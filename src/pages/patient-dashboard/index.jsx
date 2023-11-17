import React, { useEffect } from "react";
import { getItem } from "../../utils/dashboard-utils";
import DashBoard from "../dashboard";
import { UserOutlined, HeartOutlined, FormOutlined, HistoryOutlined } from "@ant-design/icons";
function PaientDashboard() {
  const items = [
    getItem("Thông tin", "patient/profile", React.createElement(UserOutlined)),
    getItem("Hồ sơ sức khỏe", "patient/health", React.createElement(HeartOutlined)),
    getItem("Đăng kí dịch vụ", "patient/service", React.createElement(FormOutlined)),
    getItem("Lịch sử", "patient/history", React.createElement(HistoryOutlined)),
  ];
  return <DashBoard items={items} />;
}

export default PaientDashboard;
