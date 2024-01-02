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
  const [facility, setFacility] = useState([]);
  const [facilitys, setFacilitys] = useState();
  const [modal, contextHolder] = Modal.useModal();
  const [form] = useForm();

  const columns = [
    {
      title: "Tên cơ sở",
      key: "name",
      dataIndex: "facility_name",
      align: "center",

    },
    {
      title: "Địa chỉ",
      key: "address",
      dataIndex: "address",
      align: "center",
    },
    {
      title: "Số điện thoại",
      key: "phone",
      dataIndex: "phone",
      align: "center",
    },
    {
      title: "Giám đốc",
      key: "president",
      dataIndex: "president",
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
                setFacilitys(record);
              }}
            >
              Cập nhật
            </Button>
          </ButtonGroup>
        );
      },
    },
  ];
  

  useEffect(() => {
    const fetch = async () => {
      const response = await myAxios.get("/facility");
      setFacility(response.data.data);
    };

    fetch();
  }, [render]);

  const onFinish = async (values) => {
    try {
      const response = await myAxios.post("/facility", { ...values, id: facilitys?.id });
      setRender(render + 1);
      api.success({
        message: response.data.message,
      });
      setFacilitys(null);
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
        callbackAdd={() => {
          setFacilitys({
            id: 0,
            facility_name: "",
            address:"",
            phone:"",
            president:""
          });
        }}
        title="cơ sở"
        columns={columns}
        dataSource={facility}
      />
      <Modal
        onCancel={() => {
          setFacilitys(null);
          form.resetFields();
        }}
        onOk={() => {
          form.submit();
        }}
        visible={facilitys != null}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Card title={facilitys?.id == 0 ? "Thêm cơ sở" : "Cập nhật cơ sở"}>
          <Form form={form} onFinish={onFinish} labelCol={{ span: 6 }} labelAlign="left">
            <Form.Item label="Tên cơ sở:" name="facility_name" rules={[{ required: true, message: "Vui lòng nhập tên cơ sở" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Địa chỉ:" name="address" rules={[{ required: true, message: "Vui lòng nhập địa chỉ của cơ sở" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Số điện thoại:" name="phone" rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Giám đốc:" name="president" rules={[{ required: true, message: "Vui lòng nhập tên giám đốc" }]}>
              <Input />
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </PageTemplate>
  );
}

export default Medicine;
