import React from "react";
import { Form, Input, Select, DatePicker, Button, Row, Col, Tabs, notification } from "antd";
import PageTemplate from "../../../template/page-template";
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import moment from "moment";
import classes from "./index.scss"


const ProfileUpdateForm = () => {
  const { Option } = Select;
  const disabledDate = (current) => {
    // Lấy ngày hiện tại và trừ đi 10 năm
    const tenYearsAgo = moment().subtract(10, "years");
    // Nếu ngày hiện tại cách ngày hôm nay 10 năm trở lại trở đi, trả về true để vô hiệu hóa ngày đó
    return current && current > tenYearsAgo;
  };
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const labelCol = { span: 8, style: { width: "120px", color: "#45c3d2" } };

  const items = [
    {
      label: "Thông tin cá nhân",
      key: 1,
      children: (
        <Form name="registrationForm" form={form} scrollToFirstError autoComplete="off">

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
                <Input prefix={<UserOutlined />} placeholder="Tên đầy đủ" />
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
                <Input prefix={<PhoneOutlined />} placeholder="Số diện thoại" />
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
                <Select placeholder="Giới tính">
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
                <DatePicker disabledDate={disabledDate} placeholder="Ngày/Tháng/Năm sinh" style={{ width: "100%" }} format={"DD/MM/YYYY"} />
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
          </Row >
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
      label: "Mật khẩu",
      key: 2,
      children: (
        <Form
          form={form2}
          style={{ maxWidth: 500 }}
          labelCol={labelCol}
          labelAlign="left"
        >
          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: "Please enter your new password" },
              { min: 6, message: "Password must be at least 6 characters long" },
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

          <Row style={{ width: "100%", display: "flex", justifyContent: "end" }}>
            <Form wrapperCol={{ offset: 10, span: 20 }} style={{ marginRight: "-22px" }}>
              <Button type="primary" htmlType="submit" style={{ backgroundColor: "white", color: "black", width: "100px", border: "1px black solid" }}>
                Hủy
              </Button>
            </Form>
            <Form.Item wrapperCol={{ offset: 10, span: 20 }} style={{ marginRight: "42px" }}>
              <Button type="primary" htmlType="submit" style={{ backgroundColor: "#45c3d2", width: "100px" }}>
                Cập nhật
              </Button>
            </Form.Item>
          </Row>
        </Form>
      ),
    },
  ];

  return (
    <PageTemplate>
      <Tabs tabPosition={"left"} items={items} />
    </PageTemplate>
  );
};

export default ProfileUpdateForm;
