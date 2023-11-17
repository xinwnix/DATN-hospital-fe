import { Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import ForgetPassword from "./pages/forget-password";
import PaientDashboard from "./pages/patient-dashboard";

import Profile from "./pages/patient-dashboard/profile";
import ServiceRegister from "./pages/patient-dashboard/service";
import History from "./pages/patient-dashboard/history";
import HealthRecord from "./pages/patient-dashboard/health-record";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forget-password" element={<ForgetPassword />} />

        <Route path="patient" element={<PaientDashboard />}>
          <Route path="profile" element={<Profile />}></Route>
          <Route path="service" element={<ServiceRegister />}></Route>
          <Route path="history" element={<History />}></Route>
          <Route path="health" element={<HealthRecord />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
