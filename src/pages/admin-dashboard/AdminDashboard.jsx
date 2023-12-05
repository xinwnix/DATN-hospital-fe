import React, { useEffect } from "react";
import { getItem } from "../../utils/dashboard-utils";
import DashBoard from "../dashboard";
import { UserOutlined, FileDoneOutlined, GlobalOutlined, MedicineBoxOutlined } from "@ant-design/icons";
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
    getItem("Người dùng", "admin/user", React.createElement(UserOutlined)),
    getItem("Đặt lịch", "admin/order", React.createElement(FileDoneOutlined)),
    getItem("Dịch vụ", "admin/service", React.createElement(GlobalOutlined)),
    getItem("Thuốc", "admin/medicine", React.createElement(MedicineBoxOutlined)),
    getItem("Doanh thu", "admin/statistical", React.createElement(MedicineBoxOutlined)),
  ];
  return <DashBoard items={items} />;
}

export default AdminDashboard;
