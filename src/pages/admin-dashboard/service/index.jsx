import React, { useEffect, useState } from "react";
import PageTemplate from "../../../template/page-template";
import ManageTemplate from "../../../template/manage-template";
import myAxios from "../../../config/config";
import ButtonGroup from "antd/es/button/button-group";
import { Button, Card, Form, Input, Modal, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import Title from "antd/es/typography/Title";


import ImgCrop from 'antd-img-crop';
import { Upload } from 'antd';

import "./index.scss"

function Service() {
  const [api, context] = notification.useNotification();
  const [render, setRender] = useState(0);
  const [services, setServices] = useState([]);
  const [service, setService] = useState();
  const [modal, contextHolder] = Modal.useModal();
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [form] = useForm();

  const columns = [
    {
      title: "Ảnh dịch vụ",
      key: "image",
      dataIndex: "image",
      render: (image) => (
        <img style={{ width: "100px", height: "50px", objectFit: "cover" }} src={image} alt='khong co anh' />
      ),
    },
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
                setService(record);
              }}
            >
              Cập nhật
            </Button>
            <Button
              type="primary"
              danger
              onClick={() => {
                setService(record);
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
      console.log(response, "dataget đăng ký dịch vụ");
      setServices(response.data.data);
    };

    fetch();
  }, [render]);

  const [formattedPrice, setFormattedPrice] = useState('');

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const numericValue = parseFloat(inputValue.replace(/[^\d.-]/g, '')); // Lấy giá trị số từ chuỗi nhập vào
    const formattedValue = numericValue.toLocaleString('vi-VN'); // Định dạng số theo định dạng tiền tệ

    setFormattedPrice(formattedValue);
  };

  //uploade ảnh
  const [imageUrl, setImageUrl] = useState('');

  const onChange = (e) => {
    const fileList = e.target.files;
    if (fileList.length > 0) {
      const url = URL.createObjectURL(fileList[0]);
      setImageUrl(url);
    }
  };

  const onFinish = async (values) => {
    try {
      const response = await myAxios.post("/service", { ...values, id: service?.id, image: imageUrl }); // Gửi đường dẫn ảnh trong request

      setRender(render + 1);
      api.success({
        message: response.data.message,
      });
      setService(null);
      form.resetFields();
      setImageUrl(''); // Đặt lại đường dẫn ảnh sau khi gửi thành công
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <PageTemplate>
      {context}
      {contextHolder}
      <ManageTemplate
        searchText="Nhập tên dịch vụ tìm kiếm"
        callbackAdd={() => {
          setService({
            id: 0,
            image: "",
            name: "",
            price: "",
            description: "",
          });
        }}
        title="dịch vụ"
        columns={columns}
        dataSource={services}
      />
      <Modal
        onCancel={() => {
          setService(null);
          form.resetFields();
        }}
        open={service != null && !showConfirmButton}
        footer={[
          <Button
            key="cancelButton"
            onClick={() => {
              setService(null);
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
            <Form.Item name="image">
              {service?.id && imageUrl ? (
                <img style={{ width: "100px" }} src={imageUrl} alt="khong co anh" />
              ) : null}
              <input type="file" onChange={onChange} multiple></input>
            </Form.Item>

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
        open={showConfirmButton}
        onOk={async () => {
          const response = await myAxios.delete(`/service/${service?.id}`);
          setService(null);
          setRender(render + 1);
          setShowConfirmButton(false);
          api.success({
            message: response.data.message,
          });
        }}
        onCancel={() => {
          setService(null);
          setShowConfirmButton(false);
        }}
      >
        <Title style={{ fontSize: 20 }}>Bạn có muốn xóa dịch vụ này?</Title>
      </Modal>
    </PageTemplate>
  );
}

export default Service;
