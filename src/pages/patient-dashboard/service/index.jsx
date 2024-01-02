import React, { useEffect, useState } from "react";
import PageTemplate from "../../../template/page-template";
import { useForm } from "antd/es/form/Form";
import { Button, Checkbox, Col, DatePicker, Form, Row, Select, Tooltip, notification, Table, Modal, Input } from "antd";
import myAxios from "../../../config/config";
import TextArea from "antd/es/input/TextArea";
import useUserInformation from "../../../hooks/useUserInformation";
import moment from "moment";
import { render } from "@testing-library/react";
import locale from 'antd/es/date-picker/locale/vi_VN';
import { Card } from 'antd';

function ServiceRegister() {

  const [form] = useForm();
  const [facility, setFacility] = useState([]);
  const [service, setService] = useState([]);
  const [doctor, setDoctor] = useState([]);
  const { userInformation } = useUserInformation();
  const { Option } = Select;
  const [api, context] = notification.useNotification();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [selectedService, setSelectedService] = useState(null);
  const [selectedFacilityName, setSelectedFacilityName] = useState('');


  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCardClick = async (item) => {
    setSelectedService(item);
    setSelectedFacilityName(item.facility.facility_name);
    showModal();
    await fetchDoctorsByService(item.id); // Lấy danh sách bác sĩ dựa trên dịch vụ được chọn
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await myAxios.get("/facility");
        const responseService = await myAxios.get("/service/facility");
        setFacility(response.data.data);
        setService(responseService.data.data);
      } catch (error) {
        console.error("Error fetching facilities: ", error);
      }
    };

    fetchFacilities();
  }, []);

  const fetchServicesByFacility = async (facilityId) => {
    try {
      const response = await myAxios.get(`/facility-services/${facilityId}`);
      setService(response.data.data.services); // Cập nhật state service với dữ liệu dịch vụ từ API
    } catch (error) {
      console.error("Error fetching services: ", error);
      setService([]); // Đặt state service thành mảng rỗng nếu có lỗi
    }
  };

  // Trong hàm handleFacilityChange, gọi hàm fetchServicesByFacility khi khu vực được chọn
  const handleFacilityChange = async (value) => {
    setSelectedFacilityName(value);
    if (value === "all") {
      try {
        const response = await myAxios.get("/service/facility");
        const allServices = response.data.data;

        if (allServices && allServices.length > 0) {
          const servicesWithFacilityNames = allServices.map((service) => ({
            ...service,
            facilityName: service.facility.facility_name || 'Unknown Facility',
          }));

          setService(servicesWithFacilityNames);
        } else {
          setService([]);
        }
      } catch (error) {
        console.error("Error fetching all services: ", error);
        setService([]);
      }
    } else if (value) {
      await fetchServicesByFacility(value);
    } else {
      setService([]);
    }
  }


  const fetchDoctorsByService = async (serviceId) => {
    try {
      const response = await myAxios.get(`/service-doctors/${serviceId}`);
      setDoctor(response.data.data); // Đảm bảo endpoint trả về dữ liệu đúng
    } catch (error) {
      console.error("Error fetching doctors: ", error);
      setDoctor([]);
    }
  };


  //madal

  const onFinish = async (values) => {
    const { doctorId, note, testDate } = values;

    console.log("Ngày đã chọn:", testDate);
    const dataToSend = {
      testDate: testDate.toDate(), // Chuyển đổi kiểu ngày tháng nếu cần
      doctorId,
      services: [selectedService.id], // Thêm ID của dịch vụ đã chọn vào mảng services
      note,
      patientId: userInformation.id,
      facilityod_id: selectedService && selectedService.facility ? selectedService.facility.id : null, // Lấy facilityod_id từ selectedService (nếu có)
    };

    try {
      const response = await myAxios.post("/order", dataToSend);

      form.resetFields();
      api.success({
        message: response.data.message,
      });
      setIsModalVisible(false);
    }
    catch (error) {
      console.error("Error submitting form: ", error);
      api.error({
        message: "Đã có lỗi xảy ra khi gửi dữ liệu. Vui lòng thử lại sau.",
      });
    }
  };

  const validateNotNull = (_, value) => {
    if (!value) {
      return Promise.reject("Vui lòng nhập thông tin này.");
    }
    return Promise.resolve();
  };

  const disabledDateTime = () => {
    const disabledHours = [];
    for (let i = 0; i <= 6; i++) {
      disabledHours.push(i);
      for (let i = 17; i <= 23; i++) {
        disabledHours.push(i);
      }
      for (let i = 12; i <= 12; i++) {
        disabledHours.push(i);
      }
    }
    return {
      disabledHours: () => {
        if (moment().isSameOrBefore(moment().hour(7).minute(0))) {
          return null;
        } else {
          return disabledHours;
        }
      },
    };
  };

  const disabledDate = (current) => {
    return current && current < moment().startOf("day");
  }


  return (
    <div style={{ backgroundColor: "white", padding: "50px" }}>
      <h1 style={{marginBottom:"20px"}}>Dịch vụ khám bệnh</h1>

      <Row gutter={16}>
        <Col span={11}>
          <Form.Item name="facilityod_id">
            <Select
              placeholder="Chọn khu vực"
              onChange={handleFacilityChange}
              defaultValue="all"
            >
              <Option value="all">Tất cả khu vực</Option>
              {facility.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.facility_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row style={{}}>
        {Array.isArray(service) && service.length > 0 && service.map((item) => (
          <Col key={item.id} style={{ marginBottom: "20px", marginRight: "20px" }}>
            <Card
              hoverable
              style={{ width: 300, height: 300 }}
              onClick={() => handleCardClick(item)}
            >
              <Card.Meta title={item.name} />

              <img style={{ width: "100px", height: "50px", objectFit: "cover", marginTop: "15px" }} src={item.image} alt='Không có ảnh' />
              <p>Giá tiền: {item.price}</p>
              <p>Mô tả: {item.description}</p>
              {item.facility && (
                <p>Tên cơ sở: {item.facility.facility_name}</p>
              )}
            </Card>
          </Col>
        ))}
      </Row>
      <Modal
        title="Thông tin chi tiết đặt lịch"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <PageTemplate
        >
          {context}
          <Form form={form} onFinish={onFinish} style={{ display: "flex", flexDirection: "column" }}>
            <Row style={{display: "flex", flexDirection: "column" }}>
              <Form.Item >
                <Input disabled="true" value={selectedFacilityName} />
              </Form.Item>
              <Form.Item >
                <Input disabled value={selectedService ? selectedService.name : ''} />
              </Form.Item>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="doctorId" rules={[{ validator: validateNotNull }]}>
                  <Select placeholder="Chọn bác sĩ">
                    {Array.isArray(doctor) && doctor.length > 0 && (doctor.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.fullName}
                      </Option>
                    )))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="testDate" rules={[{ validator: validateNotNull }]}>
                  <DatePicker
                    locale={locale}
                    disabledDate={disabledDate}
                    disabledTime={disabledDateTime}
                    showTime={{ format: "HH:mm" }}
                    style={{ width: "100%" }}
                    placeholder="Chọn ngày khám"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row style={{ height: '100%', minHeight: "100px", }} >
              <Col span={24}>
                <Form.Item name="note" style={{ minHeight: "100px" }}>
                  <TextArea placeholder="Ghi chú" style={{ minHeight: "100px" }} />
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
                  Đặt lịch
                </Button>
              </Form.Item>
            </Row>
          </Form>
        </PageTemplate>
      </Modal>
    </div>
  )
}

export default ServiceRegister;
