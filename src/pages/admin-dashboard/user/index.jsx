import React, { useEffect, useState } from "react";
import PageTemplate from "../../../template/page-template";
import ManageTemplate from "../../../template/manage-template";
import myAxios from "../../../config/config";
import { Tag, notification } from "antd";

function User() {
  const [users, setUsers] = useState([]);
  const [api, context] = notification.useNotification();

  const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "fullName",
      key: "fullName",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      align: "center",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      align: "center",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      align: "center",
      render: (text) => {
        return text === "MALE" ? <span>Nam</span> : <span>Nữ</span>;
      },
    },
    {
      title: "Ngày sinh",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      align: "center",
    }
  ];

  const fetch = async () => {
    const response = await myAxios.get("/accounts/patient");
    setUsers(response.data.data);
  };
  

  useEffect(() => {
    fetch();
  }, []);

  return (
    <PageTemplate>
      {context}
      <ManageTemplate title="Bệnh nhân" columns={columns} dataSource={users} hideAddButton> 
      </ManageTemplate>
    </PageTemplate>
  );
}

export default User;
