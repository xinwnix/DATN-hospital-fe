import React, { useEffect } from "react";
import { getItem } from "../../utils/dashboard-utils";
import DashBoard from "../dashboard";
import { UserOutlined, HeartOutlined, FormOutlined, HistoryOutlined } from "@ant-design/icons";
import useUserInformation from "../../hooks/useUserInformation";
import { useNavigate } from "react-router-dom";
function PaientDashboard() {
  const user = useUserInformation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.userInformation?.accountType === "PATIENT") {
    } else {
      navigate("/login");
    }
  }, [user]);

  const items = [
    getItem("Thông tin", "patient/profile", React.createElement(UserOutlined)),
    getItem("Hồ sơ sức khỏe", "patient/health", React.createElement(HeartOutlined)),
    getItem("Đăng kí dịch vụ", "patient/service", React.createElement(FormOutlined)),
    getItem("Lịch sử", "patient/history", React.createElement(HistoryOutlined)),
  ];
  return <DashBoard items={items}/>;
}

export default PaientDashboard;
