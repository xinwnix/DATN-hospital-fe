import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Avatar, Dropdown, Layout, Menu, theme, Tooltip } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import useUserInformation from "../../hooks/useUserInformation";
import logo_dashboard from "../../assets/images/logo_dashboard.png"
import "./index.scss";


function DashBoard({ items }) {
  const navigate = useNavigate();
  // useEffect(() => {
  //   let isAuthen = isAllow();
  //   if (!isAuthen) {
  //     navigate("/login");
  //   }
  // }, []);
  const { userInformation } = useUserInformation();

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("account");
    localStorage.removeItem("token");
    localStorage.removeItem("userID");
    navigate("/login");
  };

  const menu = (
    <Menu style={{ marginTop: "-5px" }}>
      <Menu.Item key="logout" onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="dashboard">
      <Layout style={{ minHeight: "100vh" }}>
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <div className="dashboard__logo">
            <Link to={"/"}>
              <img style={{ width: "100%" }} src={logo_dashboard} />{" "}
            </Link>
          </div>

          <Menu className="custom-menu" theme="dark" selectedKeys={location.pathname.slice(1)} mode="inline" items={items} />
        </Sider>
        <Layout className="dashboard-layout">
          <Header
            style={{
              padding: "0 100px",
              background: colorBgContainer,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Dropdown overlay={menu} trigger={["hover"]}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <Tooltip placement="top">
                  <Avatar
                    style={{
                      backgroundColor: '#87d068', width: '50px', height: '50px', display: "flex", alignItems: "center", justifyContent: "center"
                    }}
                  >{userInformation?.fullName.charAt(0).toUpperCase()}</Avatar>
                </Tooltip>

                {/* <span>{userInformation?.fullName}</span> */}
              </div>
            </Dropdown>
          </Header>
          <Content className="main-content" style={{ padding: "10px 16px", width: "100%", overflow: "auto" }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default DashBoard;
