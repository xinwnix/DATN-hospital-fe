import React, { useEffect } from "react";
import { getItem } from "../../utils/dashboard-utils";
import DashBoard from "../dashboard";
import { UserOutlined, FileDoneOutlined, GlobalOutlined, MedicineBoxOutlined, HomeOutlined, FileProtectOutlined } from "@ant-design/icons";
import useUserInformation from "../../hooks/useUserInformation";
import { useNavigate } from "react-router-dom";
function AdminDashboard() {
  const user = useUserInformation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  useEffect(() => {
    if (user.userInformation?.accountType === "ADMIN") {
    } else {
      navigate("/login");
    }
  }, [user]);
  const items = [
    getItem("Bệnh nhân", "admin/user", React.createElement(UserOutlined)),
    getItem("Hồ sơ", "admin/patientrecords", React.createElement(FileProtectOutlined)),
    getItem("Bác sĩ", "admin/doctor", React.createElement(UserOutlined)),
    getItem("Đặt lịch", "admin/order", React.createElement(FileDoneOutlined)),
    getItem("Cơ sở", "admin/facility", React.createElement(HomeOutlined)),
    getItem("Dịch vụ", "admin/service", React.createElement(GlobalOutlined)),
    getItem("Thuốc", "admin/medicine", React.createElement(MedicineBoxOutlined)),
    getItem("Doanh thu", "admin/statistical", React.createElement(MedicineBoxOutlined)),
  ];
  return <DashBoard items={items} />;
}

export default AdminDashboard;
