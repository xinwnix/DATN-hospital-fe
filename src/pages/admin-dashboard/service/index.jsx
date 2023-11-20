import React, { useEffect, useState } from "react";
import PageTemplate from "../../../template/page-template";
import ManageTemplate from "../../../template/manage-template";
import myAxios from "../../../config/config";
import ButtonGroup from "antd/es/button/button-group";
import { Button, Card, Form, Input, Modal, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import Title from "antd/es/typography/Title";

import "./index.scss"

function Service() {
  const [api, context] = notification.useNotification();
  const [render, setRender] = useState(0);
  const [services, setServices] = useState([]);
  const [service, setSetvice] = useState();
  const [modal, contextHolder] = Modal.useModal();
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [form] = useForm();

  const columns = [
    {
      title: "Tên dịch vụ",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "Giá tiền",
      key: "price",
      dataIndex: "price",
    },
    {
      title: "Mô tả",
      key: "description",
      dataIndex: "description",
      width: 800,
    },
    {
      title: "Hành động",
      key: "description",
      align: "center",
      render: (_, record) => {
        return (
          <ButtonGroup>
            <Button
              type="primary"
              onClick={() => {
                form.setFieldsValue(record);
                setSetvice(record);
              }}
            >
              Cập nhật
            </Button>
            <Button
              type="primary"
              danger
              onClick={() => {
                setSetvice(record);
                setShowConfirmButton(true);
              }}
            >
              Xóa
            </Button>
          </ButtonGroup>
        );
      },
    },
  ];

  useEffect(() => {
    const fetch = async () => {
      const response = await myAxios.get("/service");
      setServices(response.data.data);
    };

    fetch();
  }, [render]);

  const onFinish = async (values) => {
    try {
      const response = await myAxios.post("/service", { ...values, id: service?.id });
      setRender(render + 1);
      api.success({
        message: response.data.message,
      });
      setSetvice(null);
      form.resetFields();
    } catch (e) {
      console.log(e);
    }
  };


  const [formattedPrice, setFormattedPrice] = useState('');

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const numericValue = parseFloat(inputValue.replace(/[^\d.-]/g, '')); // Lấy giá trị số từ chuỗi nhập vào
    const formattedValue = numericValue.toLocaleString('vi-VN'); // Định dạng số theo định dạng tiền tệ

    setFormattedPrice(formattedValue);
  };

  return (
    <PageTemplate>
      {context}
      {contextHolder}
      <ManageTemplate
        searchText="Nhập tên dịch vụ nhé"
        callbackAdd={() => {
          setSetvice({
            id: 0,
            name: "",
            description: "",
          });
        }}
        title="dịch vụ"
        columns={columns}
        dataSource={services}
      />
      <Modal
        onCancel={() => {
          setSetvice(null);
          form.resetFields();
        }}
        visible={service != null && !showConfirmButton}
        footer={[
          <Button
            key="cancelButton"
            onClick={() => {
              setSetvice(null);
              form.resetFields();
            }}
            style={{ width: "100px" }}>
            Hủy
          </Button>,
          <Button
            key="okButton" type="primary"
            onClick={() => {
              form.submit();
            }} style={{ width: "100px" }}>
            Xác nhận
          </Button>,
        ]}
      >
        <Card title={service?.id == 0 ? "Thêm dịch vụ" : "Cập nhật dịch vụ"}>
          <Form form={form} onFinish={onFinish} labelCol={{ span: 6 }} labelAlign="left">
            <Form.Item label="Tên dịch vụ" name="name" rules={[{ required: true, message: "Please enter a name." }]}>
              <Input />
            </Form.Item>

            <Form.Item
              label="Giá tiền"
              name="price"
              rules={[
                {
                  required: true,
                  message: 'Please enter a price.',
                },
              ]}
            >
              <Input
                value={formattedPrice}
                onChange={handleInputChange}
                placeholder="Nhập giá tiền"
              />
            </Form.Item>

            <Form.Item
              label="Mô tả"
              name="description"
              rules={[{ required: true, message: "Please enter a description." }]}
            >
              <Input.TextArea />
            </Form.Item>
          </Form>
        </Card>
      </Modal>

      <Modal
        visible={showConfirmButton}
        onOk={async () => {
          const response = await myAxios.delete(`/service/${service?.id}`);
          setSetvice(null);
          setRender(render + 1);
          setShowConfirmButton(false);
          api.success({
            message: response.data.message,
          });
        }}
        onCancel={() => {
          setSetvice(null);
          setShowConfirmButton(false);
        }}
      >
        <Title style={{ fontSize: 20 }}>Bạn có muốn xóa dịch vụ này?</Title>
      </Modal>
    </PageTemplate>
  );
}

export default Service;
