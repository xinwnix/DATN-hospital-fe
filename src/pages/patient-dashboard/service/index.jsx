import React, { useEffect, useState } from "react";
import PageTemplate from "../../../template/page-template";
import { useForm } from "antd/es/form/Form";
import { Button, Checkbox, Col, DatePicker, Form, Row, Select, Tooltip, notification, Table } from "antd";
import myAxios from "../../../config/config";
import TextArea from "antd/es/input/TextArea";
import useUserInformation from "../../../hooks/useUserInformation";
import moment from "moment";

function ServiceRegister() {
  const [form] = useForm();
  const [doctors, setDoctors] = useState([]);
  const [service, setService] = useState([]);
  const { userInformation } = useUserInformation();
  const { Option } = Select;
  const [api, context] = notification.useNotification();
  useEffect(() => {
    const fetch = async () => {
      const response = await myAxios.get("/doctor");
      const responseService = await myAxios.get("/service");
      setDoctors(response.data.data);
      setService(responseService.data.data);
    };

    fetch();
  }, []);

  const onFinish = async (values) => {
    values.patientId = userInformation.id;
    const response = await myAxios.post("/order", values);
    form.resetFields();
    api.success({
      message: response.data.message,
    });
  };

  const validateNotNull = (_, value) => {
    if (value === null || value === undefined || value === "") {
      return Promise.reject("This field is required.");
    }
    return Promise.resolve();
  };

  function disabledDate(current) {
    // If the date is before today, disable it
    return current && current < moment().startOf("day");
  }
  // table checkbox


  return (
    <PageTemplate>
      {context}
      <h1 style={{ marginBottom: "20px" }}>Đặt lịch khám</h1>
      <Form form={form} onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="testDate" rules={[{ validator: validateNotNull }]}>
              <DatePicker
                disabledDate={disabledDate}
                showTime={{ format: "HH:mm" }}
                style={{ width: "100%" }}
                placeholder="Chọn ngày khám"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="doctorId" rules={[{ validator: validateNotNull }]}>
              <Select placeholder="Chọn bác sĩ">
                {doctors.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.fullName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Col style={{ display: "flex" }}>
          <Row gutter={16} style={{ width: "50%" }}>
            <Form.Item
            style={{ width:'100%' ,border: "1px #d9d9d9 solid", borderRadius: "5px", marginLeft: "7px" }}
              name="services"
              rules={[
                {
                  required: true,
                  message: "This field is required.",
                },
              ]}
            >
              <Checkbox.Group style={{width:'100%' ,height: '200px', overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column' }}>
                {service.map((item) => (
                  <Col style={{width:"100%", marginBottom:"10px", overflowY:"auto"}} key={item.id}>
                    <Tooltip  title={item.description}>
                      <Checkbox style={{width:"100%"}} value={item.id} >{item.name} {item.price}</Checkbox>
                    </Tooltip>
                  </Col>
                ))}
              </Checkbox.Group>
            </Form.Item>

          </Row>

          <Row gutter={8} style={{ height: '100%', width: "50%", minHeight: "200px", marginLeft: "20px" }} >
            <Col span={24}>
              <Form.Item name="note" style={{ minHeight: "200px" }}>
                <TextArea placeholder="Ghi chú" style={{ minHeight: "200px" }} />
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Row style={{ width: "100%", display: "flex", justifyContent: "end" }}>
          <Form wrapperCol={{ offset: 10, span: 20 }} style={{ marginRight: "-22px" }}>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: "white", color: "black", width: "100px", border: "1px black solid" }}>
              Hủy
            </Button>
          </Form>
          <Form.Item wrapperCol={{ offset: 10, span: 20 }} style={{ marginRight: "42px" }}>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: "#45c3d2", width: "100px" }}>
              Đặt lịch
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </PageTemplate>
  );
}

export default ServiceRegister;

