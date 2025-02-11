import { Route, Routes } from "react-router-dom";
import Home from "./components/HomePage";
import Login from "./components/Login";
import { Provider } from "react-redux";
import { store } from "./store";
import DeliveryAgentDashboard from "./components/DeliveryAgentDashboard";
import ActiveDeliveryPage from "./components/ActiveDeliveryPage";
import OrderDetailsPage from "./components/OrderDetailsPage";

function App() {
  return (
    <>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/delivery"
            element={
              <DeliveryAgentDashboard children={<ActiveDeliveryPage />} />
            }
          />
          <Route
            path="/delivery/:deliveryId"
            element={<DeliveryAgentDashboard children={<OrderDetailsPage />} />}
          />
          <Route
            path="/delivery/pending"
            element={
              <DeliveryAgentDashboard children={<>Pending Deliveries</>} />
            }
          />
          <Route
            path="/delivery/active"
            element={
              <DeliveryAgentDashboard children={<>Active Deliveries</>} />
            }
          />
          <Route
            path="/delivery/completed"
            element={
              <DeliveryAgentDashboard children={<>Completed Deliveries</>} />
            }
          />
          <Route
            path="/delivery/profile"
            element={<DeliveryAgentDashboard children={<>My Profile</>} />}
          />
        </Routes>
      </Provider>
    </>
  );
}

export default App;
