import React, { useEffect, useState } from "react";
import PageTemplate from "../../../template/page-template";
import ManageTemplate from "../../../template/manage-template";
import myAxios from "../../../config/config";
import { Button, Col, DatePicker, Form, Input, Modal, Row, Select, Tag, notification } from "antd";
import TextArea from "antd/es/input/TextArea";
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import moment from "moment";

function User() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { Option } = Select;
  const [form] = useForm();
  const [api, context] = notification.useNotification();
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const validateVietnamesePhoneNumber = (_, value) => {
    const vietnamesePhoneNumberRegex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/; // Vietnamese phone number format
    if (!value || vietnamesePhoneNumberRegex.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject("Please enter a valid Vietnamese phone number!");
  };

  function generateRandomPassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
    let password = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }

    return password;
  }

  const onFinish = async (values) => {
    try {
      values.password = generateRandomPassword(8);
      const response = await myAxios.post("/register", values);
      users.push(response.data.data);
      setUsers([...users]);
      form.resetFields();
      handleCancel();
      api["success"]({
        message: response.data.message,
      });
    } catch (e) {
      console.log(e);
      api["error"]({
        message: e.response.data,
      });
    }
  };

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
      title: "Giới tính",
      dataIndex: "accountType",
      key: "accountType",
      align: "center",
      filters: [
        { text: "PATIENT", value: "PATIENT" },
        { text: "DOCTOR", value: "DOCTOR" },
      ],
      onFilter: (value, record) => record.accountType === value,
      render: (value) => {
        return <Tag color={value === "PATIENT" ? "blue" : "yellow"}>{value}</Tag>;
      },
    },
  ];

  const fetch = async () => {
    const response = await myAxios.get("/accounts");
    console.log(response.data.data);
    setUsers(response.data.data);
  };
  const disabledDate = (current)=>{
    const tenYearsAgo = moment().subtract(10, 'years');
    return current && current > tenYearsAgo;
  }

  useEffect(() => {
    fetch();
  }, []);

  return (
    <PageTemplate>
      {context}
      <ManageTemplate
        columns={columns}
        title="Người dùng"
        dataSource={users}
        callbackAdd={() => {
          showModal();
        }}
      />

      <Modal 
      title="New user" 
      open={isModalOpen} 
      onOk={handleOk} 
      onCancel={handleCancel} 
      footer={[
        <Button key="cancelButton" onClick={handleCancel} style={{ width:"100px" }}>
          Hủy
        </Button>,
        <Button key="okButton" onClick={handleOk} type="primary" style={{ width:"100px" }}>
          Xác nhận
        </Button>,
      ]}
      >
        <Form name="registrationForm" form={form} onFinish={onFinish} scrollToFirstError autoComplete="off">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fullName"
                rules={[
                  {
                    required: true,
                    message: "Please enter your full name!",
                  },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Full Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                rules={[
                  {
                    type: "email",
                    message: "Please enter a valid email!",
                  },
                  {
                    required: true,
                    message: "Please enter your email!",
                  },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Please enter your phone number!",
                  },
                  {
                    validator: validateVietnamesePhoneNumber,
                  },
                ]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="gender"
                rules={[
                  {
                    required: true,
                    message: "Please select your gender!",
                  },
                ]}
              >
                <Select placeholder="Select your gender">
                  <Option value="MALE">Male</Option>
                  <Option value="FEMALE">Female</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="dateOfBirth"
                rules={[
                  {
                    required: true,
                    message: "Please select your date of birth!",
                  },
                ]}
              >
                <DatePicker disabledDate={disabledDate} placeholder="Date of Birth" style={{ width: "100%" }} format={"DD/MM/YYYY"} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            {/* Add additional fields here */}
            <Col span={24}>
              <Form.Item
                name="accountType"
                rules={[
                  {
                    required: true,
                    message: "Please enter your address!",
                  },
                ]}
              >
                <Select placeholder="Select account type">
                  <Option value="PATIENT">Patient</Option>
                  <Option value="DOCTOR">Doctor</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            {/* Add additional fields here */}
            <Col span={24}>
              <Form.Item
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Please enter your address!",
                  },
                ]}
              >
                <TextArea prefix={<HomeOutlined />} placeholder="Address" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </PageTemplate>
  );
}

export default User;
