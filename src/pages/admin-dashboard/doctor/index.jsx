import React, { useEffect, useState } from "react";
import PageTemplate from "../../../template/page-template";
import ManageTemplate from "../../../template/manage-template";
import myAxios from "../../../config/config";
import { Button, Col, DatePicker, Form, Input, Modal, Row, Select, Tag, notification } from "antd";
import TextArea from "antd/es/input/TextArea";
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import moment from "moment";

function Doctor() {
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
      // Tìm dịch vụ được chọn từ danh sách các dịch vụ
      const selectedService = service.find(serv => serv.id === values.serviceName);
      // Nếu dịch vụ được chọn tồn tại
      if (selectedService) {
        values.service_id = selectedService.id;
        values.accountType = "DOCTOR";
        values.password = generateRandomPassword(8);
        const response = await myAxios.post("/register", values);
        setUsers(prevUsers => [...prevUsers, response.data.data]);
        fetch();
        form.resetFields();
        handleCancel();

        // Hiển thị thông báo thành công
        api["success"]({
          message: response.data.message,
        });
      }
    } catch (e) {
      // Xử lý lỗi nếu có
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
    },
    {
      title: "Cơ sở làm việc",
      dataIndex: ["service", "facility", "facility_name"],
      key: "serviceName",
      align: "center",
    },
    {
      title: "Dịch vụ khám",
      dataIndex: "serviceName",
      key: "serviceName",
      align: "center",
    },
  ];

  const fetch = async () => {
    try {
      const response = await myAxios.get("/accounts/doctor");
      const fetchedUsers = response.data.data; // Dữ liệu mới từ API
      const modifiedUsers = fetchedUsers.map(user => ({
        ...user,
        serviceName: user.service ? user.service.name : '' // Lấy service.name nếu tồn tại, nếu không thì trả về ''
      }));
      setUsers(modifiedUsers); // Cập nhật state users với dữ liệu mới
    } catch (error) {
      console.error("Fetch error: ", error);
    }
  };

  const disabledDate = (current) => {
    const tenYearsAgo = moment().subtract(10, 'years');
    return current && current > tenYearsAgo;
  }

  useEffect(() => {
    fetch();
  }, []);

  //Lấy dịch vụ
  const [service, setService] = useState([]);
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await myAxios.get("/service/facility");
        setService(response.data.data);
      } catch (error) {
        console.error("Error fetching setServices: ", error);
      }
    };

    fetchServices();
  }, []);

  return (
    <PageTemplate>
      {context}
      <ManageTemplate
        columns={columns}
        title="Bác sĩ"
        dataSource={users}
        callbackAdd={() => {
          showModal();
        }}
      />
      <Modal
        title="Thêm tài khoản bác sĩ"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="cancelButton" onClick={handleCancel} style={{ width: "100px" }}>
            Hủy
          </Button>,
          <Button key="okButton" onClick={handleOk} type="primary" style={{ width: "100px" }}>
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
            <Col span={24}>
              <Form.Item name="serviceName">
                <Select placeholder="Chọn dịch vụ">
                  {service.map(service => (
                    <Option key={service.id} value={service.id}>
                      {service.name}
                    </Option>
                  ))}
                </Select>
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
                <TextArea prefix={<HomeOutlined />} placeholder="Address" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </PageTemplate>
  );
}

export default Doctor;
