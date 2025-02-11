// import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./components/HomePage";
import Login from "./components/Login";
import { Provider } from "react-redux";
import { store } from "./store";
import Signup from "./components/Signup";
import ConsumerDashboard from "./components/ConsumerDashboard";
import FarmerDashboard from "./components/FarmerDashboard";
import ProductsPage from "./components/ProductsPage";
import CartPage from "./components/CartPage";
import ConsumerProfilePage from "./components/ConsumerProfilePage";
import ConsumerOrdersPage from "./components/ConsumerOrdersPage";
import ConsumerSavedPage from "./components/ConsumerSavedPage";
import MarketPage from "./components/MarketPage";
import FarmerProducts from "./components/FarmerProducts";
import FarmerOrdersPage from "./components/FarmerOrdersPage";
import FarmerProfile from "./components/FarmerProfile";
import FarmerEarnings from "./components/FarmerEarnings";
//import { AuthPersistence } from "./store/slices/AuthPersistence";
import OrderDetailsPage from "./components/OrderDetailsPage";

function App() {
  return (
    <>
      <Provider store={store}>
        {/* <AuthPersistence /> */}
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route
            path="/consumer/products"
            element={
              <ConsumerDashboard>
                <ProductsPage />
              </ConsumerDashboard>
            }
          />
          <Route
            path="/consumer/cart"
            element={
              <ConsumerDashboard>
                <CartPage />
              </ConsumerDashboard>
            }
          />
          <Route
            path="/consumer/profile"
            element={
              <ConsumerDashboard>
                <ConsumerProfilePage />
              </ConsumerDashboard>
            }
          />
          <Route
            path="/consumer/orders"
            element={
              <ConsumerDashboard>
                <ConsumerOrdersPage />
              </ConsumerDashboard>
            }
          />
          <Route
            path="/consumer/saved"
            element={
              <ConsumerDashboard>
                <ConsumerSavedPage />
              </ConsumerDashboard>
            }
          />
          <Route
            path="/consumer/market-prices"
            element={
              <ConsumerDashboard>
                <MarketPage />
              </ConsumerDashboard>
            }
          />
          <Route
            path="/farmer/products"
            element={
              <FarmerDashboard>
                <FarmerProducts />
              </FarmerDashboard>
            }
          />
          <Route
            path="/farmer/orders"
            element={
              <FarmerDashboard>
                <FarmerOrdersPage />
              </FarmerDashboard>
            }
          />
          <Route
            path="/farmer/profile"
            element={
              <FarmerDashboard>
                <FarmerProfile />
              </FarmerDashboard>
            }
          />
          <Route
            path="/farmer/earnings"
            element={
              <FarmerDashboard>
                <FarmerEarnings />
              </FarmerDashboard>
            }
          />
          <Route
            path="/farmer/market-prices"
            element={
              <FarmerDashboard>
                <MarketPage />
              </FarmerDashboard>
            }
          />
          <Route
            path="/consumers/orders/:orderId"
            element={
              <ConsumerDashboard>
                <OrderDetailsPage />
              </ConsumerDashboard>
            }
          />
          <Route
            path="/farmer/orders/:orderId"
            element={
              <FarmerDashboard>
                <OrderDetailsPage />
              </FarmerDashboard>
            }
          />
        </Routes>
      </Provider>
    </>
  );
}

export default App;
