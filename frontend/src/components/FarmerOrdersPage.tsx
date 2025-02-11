import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { selectAuth } from "../store/slices/authSlice";
import { IOrder, OrderStatus } from "../types/Order";
import { Link } from "react-router-dom";

interface Order extends IOrder {
  _id: string;
}

export default function FarmerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token, user } = useSelector(selectAuth);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3800/api/orders/api/orders/${user.email}/farmers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Sort orders by date, newest first
      const sortedOrders = response.data.sort(
        (a: Order, b: Order) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sortedOrders);
    } catch (error) {
      setError("Failed to fetch orders");
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    status: OrderStatus
  ) => {
    try {
      const orderResponse = await axios.get(
        `http://localhost:3800/api/orders/api/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const order = orderResponse.data;

      if (status === OrderStatus.CONFIRMED) {
        // Decrease product quantities when accepting order
        for (const item of order.items) {
          const productResponse = await axios.get(
            `http://localhost:3800/api/products/${item.productId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const product = productResponse.data;

          await axios.put(
            `http://localhost:3800/api/products/${item.productId}`,
            {
              quantityAvailable: product.quantityAvailable - item.quantity,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
        // Get farmer's address and contact details first
        const [farmerAddressRes, farmerDetailsRes, consumerDetailsRes] =
          await Promise.all([
            axios.get(
              `http://localhost:3800/api/farmers/api/farmers/${order.farmerId}/get/address`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),
            axios.get(
              `http://localhost:3800/api/farmers/api/farmers/${order.farmerId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),
            axios.get(
              `http://localhost:3806/api/customers/${order.consumerId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),
          ]);

        console.log("farmerAddressRes", farmerAddressRes.data[0]);
        const farmerAddressData = farmerAddressRes.data[0];
        const farmerAddress = `${farmerAddressData.street}, ${farmerAddressData.city}, ${farmerAddressData.state}, ${farmerAddressData.country}, ${farmerAddressData.zipcode}`;
        const farmerPhoneNumber = farmerDetailsRes.data.phone;
        const consumerPhoneNumber = consumerDetailsRes.data.data.phone;
        const consumerAddressData = consumerDetailsRes.data.data.addresses[0];
        const consumerAddress = `${consumerAddressData.street}, ${consumerAddressData.city}, ${consumerAddressData.state}, ${consumerAddressData.country}, ${consumerAddressData.zipcode}`;
        // get delivery agents with order count less than 5
        const deliveryAgents = await axios.get(
          `http://localhost:3800/api/delivery/api/agents/available`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("deliveryAgents", deliveryAgents.data);

        // if (!deliveryAgents.data || deliveryAgents.data.length === 0) {
        //   throw new Error(
        //     "No available delivery agents found for these locations"
        //   );
        // }
        const agentId = deliveryAgents.data?.[0]?._id;
        console.log("agentId", agentId);
        const deliveryData = {
          orderId: order._id.toString() as string,
          farmerId: order.farmerId as string,
          consumerId: order.consumerId as string,
          deliveryAddress: consumerAddress as string,
          pickupAddress: farmerAddress as string,
          deliveryAgentId: agentId,
          orderPrice: order.totalAmount,
          farmerPhoneNumber: farmerPhoneNumber as string,
          consumerPhoneNumber: consumerPhoneNumber as string,
          status: "CONFIRMED",
        };

        // Create delivery entry
        try {
          await axios.post("http://localhost:3800/api/delivery", deliveryData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("deliveryData added", deliveryData);
          try {
            await axios.put(
              `http://localhost:3809/agents/${agentId}/orderCount/increase`
            );
            console.log("orderCount increased");
          } catch (error) {
            console.error("Error increasing order count:", error);
          }
        } catch (error) {
          console.log("error", error);
        }
      } else if (
        status === OrderStatus.CANCELLED &&
        order.status === OrderStatus.CONFIRMED
      ) {
        // Restore quantities if cancelling a confirmed order
        for (const item of order.items) {
          const productResponse = await axios.get(
            `http://localhost:3800/api/products/${item.productId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const product = productResponse.data;

          await axios.put(
            `http://localhost:3800/api/products/${item.productId}`,
            {
              quantityAvailable: product.quantityAvailable + item.quantity,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
      }

      // Update order status
      await axios.put(
        `http://localhost:3800/api/orders/api/orders/${orderId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchOrders(); // Refresh orders after update
    } catch (error) {
      setError("Failed to update order status");
      console.error("Error updating order:", error);
    }
  };

  const activeOrders = orders.filter(
    (order) =>
      ![OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(order.status)
  );

  const completedOrders = orders.filter((order) =>
    [OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(order.status)
  );

  const OrderCard = ({ order }: { order: Order }) => {
    const [orderDetails, setOrderDetails] = useState<{ [key: string]: any }>(
      {}
    );
    const [cancelling, setCancelling] = useState(false);
    const { token } = useSelector(selectAuth);

    useEffect(() => {
      const fetchOrderDetails = async () => {
        try {
          const itemDetails = await Promise.all(
            order.items.map(async (item) => {
              const response = await axios.get(
                `http://localhost:3800/api/products/${item.productId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              return {
                ...item,
                productDetails: response.data,
              };
            })
          );

          setOrderDetails({
            ...orderDetails,
            [order._id]: itemDetails,
          });
        } catch (error) {
          console.error("Error fetching order details:", error);
        }
      };

      if (!orderDetails[order._id]) {
        fetchOrderDetails();
      }
    }, [order._id]);

    const canCancel = [OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(
      order.status
    );

    return (
      <div className="bg-white border rounded-lg p-4 shadow-sm flex flex-col h-full justify-between">
        <div className="flex flex-col gap-4 flex-grow">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h3 className="text-base font-semibold flex items-center gap-2 flex-wrap">
                Order
                <span className="text-gray-500 text-xs">#{order._id}</span>
              </h3>
              <p className="text-gray-600 text-sm">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <span
              className={`px-2 py-1 rounded-full text-sm text-center ${
                order.status === OrderStatus.DELIVERED
                  ? "bg-green-600 text-white"
                  : order.status === OrderStatus.CONFIRMED
                  ? "bg-green-200 text-green-800"
                  : order.status === OrderStatus.PENDING ||
                    order.status === OrderStatus.ONTHEWAY ||
                    order.status === OrderStatus.SHIPPED
                  ? "bg-yellow-100 text-yellow-800"
                  : order.status === OrderStatus.CANCELLED
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {order.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {orderDetails[order._id]?.map((item: any, index: number) => (
              <div
                key={index}
                className="p-3 bg-gray-50 rounded flex flex-col justify-between"
              >
                <div>
                  <p className="font-medium text-sm">
                    {item.productDetails.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div>
                    <p className="text-xs text-gray-500">Unit Price</p>
                    <p className="font-medium text-sm">
                      ₹{item.unitPrice.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="font-medium text-sm">
                      ₹{item.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-sm">Total Amount:</span>
            <span className="font-bold text-base">
              ₹{order.totalAmount.toFixed(2)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            {order.status === OrderStatus.PENDING && (
              <>
                <button
                  onClick={() =>
                    handleUpdateOrderStatus(order._id, OrderStatus.CONFIRMED)
                  }
                  className="px-3 py-1.5 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 flex-1"
                >
                  Accept
                </button>
                <button
                  onClick={() =>
                    handleUpdateOrderStatus(order._id, OrderStatus.CANCELLED)
                  }
                  className="px-3 py-1.5 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 flex-1"
                >
                  Reject
                </button>
              </>
            )}
            {canCancel && order.status !== OrderStatus.PENDING && (
              <button
                onClick={() =>
                  handleUpdateOrderStatus(order._id, OrderStatus.CANCELLED)
                }
                disabled={cancelling}
                className="px-3 py-1.5 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 disabled:bg-red-300 flex-1"
              >
                {cancelling ? "Cancelling..." : "Cancel Order"}
              </button>
            )}
            <Link
              to={`/farmer/orders/${order._id}`}
              className="px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 text-center flex-1"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Active Orders</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {activeOrders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
        {activeOrders.length === 0 && (
          <p className="text-gray-500 text-center py-4 col-span-full">
            No active orders
          </p>
        )}
      </div>

      <h2 className="text-xl md:text-2xl font-bold mb-6 mt-8">
        Completed & Cancelled Orders
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {completedOrders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
        {completedOrders.length === 0 && (
          <p className="text-gray-500 text-center py-4 col-span-full">
            No completed or cancelled orders
          </p>
        )}
      </div>
    </div>
  );
}
