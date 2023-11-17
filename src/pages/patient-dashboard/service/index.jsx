import React from "react";
import PageTemplate from "../../../template/page-template";
import { useForm } from "antd/es/form/Form";
import { Button, Checkbox, Col, DatePicker, Form, Row, Select, Tooltip, notification } from "antd";
import TextArea from "antd/es/input/TextArea";
import moment from "moment";

function ServiceRegister() {
  const [form] = useForm();
  const { Option } = Select;

  const validateNotNull = (_, value) => {
    if (value === null || value === undefined || value === "") {
      return Promise.reject("This field is required.");
    }
    return Promise.resolve();
  };
  function disabledDate(current) {
    return current && current < moment().startOf("day");
  }

  const services = [
    { name: 'Khám mắt1', price: '100,000 VND' },
    { name: 'Khám tai mũi họng 1', price: '150,000 VND' },
    { name: 'Khám tai mũi họng 2', price: '200,000 VND' },
    { name: 'Khám mắt2', price: '100,000 VND' },
  ];

  return (
    <PageTemplate>
      <h1 style={{ marginBottom: 40, textAlign: "left" }}>Đặt lịch khám</h1>
      <Form form={form} >
        <Row gutter={16} >
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
                <Option >
                </Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8} style={{}}>
          <Col gutter={16} style={{ width: "50%", }}>
            <Form.Item
              style={{ border: "1px #d9d9d9 solid", borderRadius: "5px", marginRight: "5px" }}
              name="services"
              rules={[
                {
                  required: true,
                  message: "This field is required.",
                },
              ]}
            >
              <div style={{ height: '200px', overflowY: 'auto' }}>
                <Checkbox.Group style={{ width: '100%', padding: '10px', display: "flex", flexDirection: "column", }} options={services.map(service => ({ label: `${service.name} - ${service.price}`, value: service.name }))} />
              </div>
            </Form.Item>
          </Col>

          <Col style={{ height: '100%', width: "50%", minHeight: "200px" }}>
            <Col span={24}>
              <Form.Item name="note" style={{ minHeight: "200px" }}>
                <TextArea placeholder="Ghi chú" style={{ minHeight: "200px" }} />
              </Form.Item>
            </Col>
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
              Đặt lịch
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </PageTemplate>
  );
}

export default ServiceRegister;
