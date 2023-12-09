import { Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import useNotification from "./hooks/useNotification";
import PaientDashboard from "./pages/patient-dashboard";
import Profile from "./pages/patient-dashboard/profile";
import ServiceRegister from "./pages/patient-dashboard/service";
import AdminDashboard from "./pages/admin-dashboard/AdminDashboard";
import User from "./pages/admin-dashboard/user";
import Doctor from "./pages/admin-dashboard/doctor";
import CheckCode from "./pages/check-code";
import History from "./pages/patient-dashboard/history";
import Order from "./pages/admin-dashboard/order";
import DoctorDashboard from "./pages/doctor-dashboard";
import Schedule from "./pages/doctor-dashboard/schedule";
import OrderDetail from "./pages/doctor-dashboard/order-detail";
import HealthRecord from "./pages/patient-dashboard/health-record";
import Service from "./pages/admin-dashboard/service";
import Medicine from "./pages/admin-dashboard/medicine";
import Statistical from "./pages/admin-dashboard/statistical";
import ForgetPassword from "./pages/forget-password";

function App() {
  const { contextHolder } = useNotification();
  return (
    <div className="app">
      {contextHolder}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/:userId/:code" element={<CheckCode />} />
        <Route path="login" element={<Login />} />
        <Route path="forget-password" element={<ForgetPassword />} />
        <Route path="register" element={<Register />} />

        <Route path="patient" element={<PaientDashboard/>}>
          <Route path="profile" element={<Profile />}></Route>
          <Route path="service" element={<ServiceRegister />}></Route>
          <Route path="history" element={<History />}></Route>
          <Route path="health" element={<HealthRecord />}></Route>
        </Route>
        <Route path="admin" element={<AdminDashboard />}>
          <Route path="user" element={<User />}></Route>
          <Route path="doctor" element={<Doctor />}></Route>
          <Route path="order" element={<Order />}></Route>
          <Route path="service" element={<Service />}></Route>
          <Route path="medicine" element={<Medicine />}></Route>
          <Route path="statistical" element={<Statistical/>}></Route>
        </Route>
        <Route path="doctor" element={<DoctorDashboard />}>
          <Route path="profile" element={<Profile />}></Route>
          <Route path="schedule" element={<Schedule />}></Route>
          <Route path="schedule/:orderId" element={<OrderDetail />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;

