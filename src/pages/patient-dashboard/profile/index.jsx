import React, { useEffect, useState } from "react";
import { Form, Input, Select, DatePicker, Button, Row, Col, Tabs, notification } from "antd";
import PageTemplate from "../../../template/page-template";
import useUserInformation from "../../../hooks/useUserInformation";
import myAxios from "../../../config/config";
import dayjs from "dayjs";
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import classes from "./index.scss"
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
    // values.dateOfBirth = formattedDate;
    const response = await myAxios.put(`/profile`, values);
    api["success"]({
      message: response.data.message,
    });
  };

  const handleChangePassword = async (values) => {
    console.log(values);
    const response = await myAxios.put(`/password/${userInformation.id}`, {
      newPassword: values.newPassword,
    });
    form2.resetFields();
    window.location.href = '/patient/profile';
    api["success"]({
      message: response.data.message,
    });
  };

  useEffect(() => {
    const fetch = async () => {
      const response = await myAxios.get(`/account/${userInformation.id}`);
      setProfile(response.data.data);

      response.data.data.dateOfBirth = dayjs(response.data.data.dateOfBirth);

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
                    message: "Vui lòng nhập tên đầy đủ của bạn!",
                  },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                rules={[
                  {
                    type: "email",
                    message: "Vui lòng nhập email hợp lệ!",
                  },
                  {
                    required: true,
                    message: "Vui lòng nhập email của bạn!",
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
                    message: "Xin vui lòng điền số điện thoại của bạn!",
                  },
                ]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="gender"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn giới tính của bạn!",
                  },
                ]}
              >
                <Select placeholder="Chọn giới tính của bạn">
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
                    message: "Vui lòng chọn ngày sinh của bạn!",
                  },
                ]}
              >
                <DatePicker placeholder="Ngày sinh" style={{ width: "100%" }} format={"DD/MM/YYYY"} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
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
                <TextArea prefix={<HomeOutlined />} placeholder="Địa chỉ" />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ width: "100%", display: "flex", justifyContent: "end" }}>
            <Form wrapperCol={{ offset: 10, span: 20 }} style={{ marginRight: "-22px" }}>
              <Button type="primary" htmlType="submit" style={{ backgroundColor: "white", color: "black", width: "100px", border: "1px black solid" }}>
                Hủy
              </Button>
            </Form>
            <Form.Item wrapperCol={{ offset: 10, span: 20 }} style={{ marginRight: "42px" }}>
              <Button type="primary" htmlType="submit" style={{ backgroundColor: "#45c3d2", width: "100px" }}>
                Lưu
              </Button>
            </Form.Item>
          </Row>
        </Form>
      ),
    },
    {
      label: "Đổi mật khẩu",
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
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới của bạn" },
              { min: 6, message: "Mật khẩu phải có độ dài ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Nhập lại mật khẩu"
            name="confirmPassword"
            dependencies={["newPassword"]}
            hasFeedback
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới của bạn" },
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
          <Row style={{ width: "100%", display: "flex", justifyContent: "end" }}>
            <Form wrapperCol={{ offset: 10, span: 20 }} style={{ marginRight: "-22px" }}>
              <Button type="primary" htmlType="submit" style={{ backgroundColor: "white", color: "black", width: "100px", border: "1px black solid" }}>
                Hủy
              </Button>
            </Form>
            <Form.Item wrapperCol={{ offset: 10, span: 20 }} style={{ marginRight: "42px" }}>
              <Button type="primary" htmlType="submit" style={{ backgroundColor: "#45c3d2", width: "100px" }}>
                Lưu
              </Button>
            </Form.Item>
          </Row>
        </Form>
      ),
    },
  ];

  return (
    <PageTemplate>
      {contextHolder}
      <h1 style={{ marginBottom: "20px" }}>Thông tin cá nhân</h1>
      <Tabs tabPosition={"left"} items={items} />
    </PageTemplate>
  );
};

export default ProfileUpdateForm;
