import React, { useEffect, useState } from "react";
import PageTemplate from "../../../template/page-template";
import ManageTemplate from "../../../template/manage-template";
import myAxios from "../../../config/config";
import ButtonGroup from "antd/es/button/button-group";
import { Button, Card, Form, Input, Modal, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import Title from "antd/es/typography/Title";

function Medicine() {
  const [api, context] = notification.useNotification();
  const [render, setRender] = useState(0);
  const [services, setServices] = useState([]);
  const [service, setSetvice] = useState();
  const [modal, contextHolder] = Modal.useModal();
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [form] = useForm();

  const columns = [
    {
      title: "Tên thuốc",
      key: "name",
      dataIndex: "name",
      align: "center",
    },
    {
      title: "Thành phần hoạt chất",
      key: "barcode",
      dataIndex: "barcode",
      align: "center",
    },
    {
      title: "Cách dùng",
      key: "describemedicine",
      dataIndex: "describemedicine",
      align: "center",
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
      const response = await myAxios.get("/medicine");
      setServices(response.data.data);
    };

    fetch();
  }, [render]);

  const onFinish = async (values) => {
    try {
      const response = await myAxios.post("/medicine", { ...values, id: service?.id });
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


  return (
    <PageTemplate>
      {context}
      {contextHolder}
      <ManageTemplate
        searchText="Nhập tên thuốc"
        callbackAdd={() => {
          setSetvice({
            id: 0,
            name: "",
            description: "",
            barcode:"",
            describemedicine:"",
          });
        }}
        title="thuốc men"
        columns={columns}
        dataSource={services}
      />
      <Modal
        onCancel={() => {
          setSetvice(null);
          form.resetFields();
        }}
        onOk={() => {
          form.submit();
        }}
        visible={service != null && !showConfirmButton}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Card title={service?.id == 0 ? "Thêm thuốc" : "Cập nhật thuốc"}>
          <Form form={form} onFinish={onFinish} labelCol={{ span: 6 }} labelAlign="left">
            <Form.Item label="Tên thuốc:" name="name" rules={[{ required: true, message: "Vui lòng nhập tên thuốc" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Thành phần:" name="barcode" rules={[{ required: true, message: "Vui lòng nhập thành phần hoạt chất" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Mô tả:" name="describemedicine" rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}>
              <Input />
            </Form.Item>
          </Form>
        </Card>
      </Modal>

      <Modal
        visible={showConfirmButton}
        onOk={async () => {
          const response = await myAxios.delete(`/medicine/${service?.id}`);
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
        <Title style={{ fontSize: 20 }}>Bạn có muốn xóa thuốc "{service?.name}" này không?</Title>
      </Modal>
    </PageTemplate>
  );
}

export default Medicine;
