import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./index.scss";
import { Avatar, Dropdown, Layout, Menu, theme, Tooltip } from "antd";
import { UserOutlined } from '@ant-design/icons';
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import logo_dashboard from "../../assets/images/logo_dashboard.png"

function DashBoard({ items }) {
  const navigate = useNavigate();

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
    <Menu>
      <Menu.Item key="profile">My Profile</Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="dashboard">
      <Layout style={{ minHeight: "100vh" }}>
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <div className="dashboard__logo">
            <Link to={"/"}>
              <img style={{ width: "100%" }} src={logo_dashboard} />
            </Link>
          </div>
          <Menu
            style={{}}
            theme="dark"
            selectedKeys={location.pathname.slice(1)}
            mode="inline"
            items={items}
            className="custom-menu"
          >
            {items.map((item) => (
              <Menu.Item key={item.key} className="menu-item-custom" > 
                <Link to={item.path}>{item.label}</Link>
              </Menu.Item>
            ))}
          </Menu>
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
                    icon={<UserOutlined />}
                  />
                </Tooltip>
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
