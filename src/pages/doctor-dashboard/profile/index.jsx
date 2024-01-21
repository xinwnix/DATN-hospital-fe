import React, { useEffect, useState } from "react";
import { Form, Input, Select, DatePicker, Button, Row, Col, Tabs, notification } from "antd";
import PageTemplate from "../../../template/page-template";
import useUserInformation from "../../../hooks/useUserInformation";
import myAxios from "../../../config/config";
import "dayjs/locale/en";
import dayjs from "dayjs";
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
const { Option } = Select;

const ProfileUpdateForm = ({ initialValues, onSubmit }) => {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const { userInformation } = useUserInformation();
  const [profile, setProfile] = useState();
  const labelCol = { span: 8, style: { width: "120px" } };
  const [api, contextHolder] = notification.useNotification();

  const onFinish = async (values) => {
    const formattedDate = dayjs(values.dateOfBirth).format("DD/MM/YYYY");
    values.id = userInformation.id;
    values.password = "123";
    const response = await myAxios.put(`/profile`, values);
    api["success"]({
      message: response.data.message,
    });
  };

  const handleChangePassword = async (values) => {
    const response = await myAxios.put(`/password/1`, {
      newPassword: values.newPassword,
    });
    api["success"]({
      message: response.data.message,
    });
  };

  useEffect(() => {
    const fetch = async () => {
      const response = await myAxios.get(`/account/${userInformation.id}`);
      setProfile(response.data.data);
      console.log(response.data.data);

      response.data.data.dateOfBirth = dayjs(response.data.data.dateOfBirth);
      console.log(response.data.data);

      form.setFieldsValue(response.data.data);
    };
    userInformation && fetch();
  }, []);

  const items = [
    {
      label: "Thông tin cá nhân",
      key: 1,
      children: (
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
                <DatePicker placeholder="Date of Birth" style={{ width: "100%" }} format={"DD/MM/YYYY"} />
              </Form.Item>
            </Col>
          </Row>


          <Row gutter={16}>
          <Col span={12}>
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
            <Col span={12}>
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

          <Form.Item wrapperCol={{ offset: 10, span: 20 }}>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      label: "Mật khẩu",
      key: 2,
      children: (
        <Form
          onFinish={handleChangePassword}
          form={form2}
          style={{ maxWidth: 500 }}
          labelCol={labelCol}
          labelAlign="left"
        >
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: "Please enter your new password" },
              { min: 6, message: "Password must be at least 6 characters long" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["newPassword"]}
            hasFeedback
            rules={[
              { required: true, message: "Please confirm your new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Passwords do not match");
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 10, span: 20 }}>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <PageTemplate>
      {contextHolder}
      <Tabs tabPosition={"left"} items={items} />
    </PageTemplate>
  );
};

export default ProfileUpdateForm;
