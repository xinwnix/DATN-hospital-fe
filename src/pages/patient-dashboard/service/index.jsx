import React, { useEffect, useState } from "react";
import PageTemplate from "../../../template/page-template";
import { useForm } from "antd/es/form/Form";
import { Button, Checkbox, Col, DatePicker, Form, Row, Select, Tooltip, notification, Table, Modal } from "antd";
import myAxios from "../../../config/config";
import TextArea from "antd/es/input/TextArea";
import useUserInformation from "../../../hooks/useUserInformation";
import moment from "moment";
import { render } from "@testing-library/react";
import { Card } from 'antd';

function ServiceRegister() {

  const [form] = useForm();
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [facility, setFacility] = useState([]);
  const [service, setService] = useState([]);
  const [doctor, setDoctor] = useState([]);
  const { userInformation } = useUserInformation();
  const { Option } = Select;
  const [api, context] = notification.useNotification();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [selectedService, setSelectedService] = useState(null);
  const [selectedFacilityName, setSelectedFacilityName] = useState('');
  const [showConfirmButton, setShowConfirmButton] = useState(false);


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
        const responseService = await myAxios.get("/service");
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
      console.log("Response from /facility-services: ", response.data);
      setService(response.data.data.services); // Cập nhật state service với dữ liệu dịch vụ từ API
    } catch (error) {
      console.error("Error fetching services: ", error);
      setService([]); // Đặt state service thành mảng rỗng nếu có lỗi
    }
  };

  // Trong hàm handleFacilityChange, gọi hàm fetchServicesByFacility khi khu vực được chọn
  const handleFacilityChange = async (value) => {
    setSelectedFacility(value);
    if (value === "all") {
      try {
        const response = await myAxios.get("/service");
        const allServices = response.data.data;

        if (allServices && allServices.length > 0) {
          const servicesWithFacilityNames = allServices.map((service) => ({
            ...service,
            facilityName: service.facility?.facility_name || 'Unknown Facility',
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

      console.log("Response from /service-doctors: ", response.data);
      setDoctor(response.data.data); // Đảm bảo endpoint trả về dữ liệu đúng
    } catch (error) {
      console.error("Error fetching doctors: ", error);
      setDoctor([]);
    }
  };


  //madal

  const onFinish = async (values) => {
    const { doctorId, note, testDate } = values;
  
    const dataToSend = {
      testDate: testDate.toDate(), // Chuyển đổi kiểu ngày tháng nếu cần
      doctorId,
      services: [selectedService.id], // Thêm ID của dịch vụ đã chọn vào mảng services
      note,
      patientId: userInformation.id,
    };
  
    try {
      const response = await myAxios.post("/order", dataToSend);
      form.resetFields();
      api.success({
        message: response.data.message,
      });
      setIsModalVisible(false); // Đóng modal sau khi gửi thành công
      // Có thể thêm logic xác nhận dữ liệu đã được thêm vào cơ sở dữ liệu ở đây
    } catch (error) {
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

  function disabledDate(current) {
    return current && current < moment().startOf("day");
  }

  return (
    <div style={{ backgroundColor: "white", padding: "50px" }}>
      <h1>Dịch vụ khám bệnh</h1>

      <Row gutter={16}>
        <Col span={11}>
          <Form.Item>
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
            <Row style={{ marginBottom: "15px", display: "flex", flexDirection: "column" }}>
              <p style={{ marginBottom: "15px" }}>Tên Cơ sở: {selectedFacilityName}</p>
              {selectedService && (
                <div>
                  <p>Tên dịch vụ: {selectedService.name}</p>
                </div>
              )}
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
                    disabledDate={disabledDate}
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


// function ServiceRegister() {
//   const [form] = useForm();
//   const [selectedFacility, setSelectedFacility] = useState(null);
//   const [facility, setFacility] = useState([]);
//   const [service, setService] = useState([]);
//   const [doctor, setDoctor] = useState([]);
//   const { userInformation } = useUserInformation();
//   const { Option } = Select;
//   const [api, context] = notification.useNotification();

//   useEffect(() => {
//     const fetchFacilities = async () => {
//       try {
//         const response = await myAxios.get("/facility");
//         setFacility(response.data.data);
//       } catch (error) {
//         console.error("Error fetching facilities: ", error);
//       }
//     };

//     fetchFacilities();
//   }, []);

//   const fetchServicesByFacility = async (facilityId) => {
//     try {
//       const response = await myAxios.get(`/facility-services/${facilityId}`);
//       console.log("Response from /facility-doctors: ", response.data);
//       setService(response.data.data.services);
//     } catch (error) {
//       console.error("Error fetching services: ", error);
//       setService([]);
//     }
//   };

//   const handleFacilityChange = async (value) => {
//     setSelectedFacility(value);
//     if (value) {
//       await fetchServicesByFacility(value);
//     } else {
//       setService([]);
//     }
//   };


//   const fetchDoctorsByService = async (serviceId) => {
//     try {
//       const response = await myAxios.get(`/service-doctors/${serviceId}`);

//       console.log("Response from /service-doctors: ", response.data);
//       setDoctor(response.data.data); // Đảm bảo endpoint trả về dữ liệu đúng
//     } catch (error) {
//       console.error("Error fetching doctors: ", error);
//       setDoctor([]);
//     }
//   };

//   const handleServiceChange = async (value) => {
//     if (value) {
//       await fetchDoctorsByService(value);
//     } else {
//       setDoctor([]); // Nếu không có dịch vụ được chọn, reset danh sách bác sĩ
//     }
//   };

//   const onFinish = async (values) => {
//     values.patientId = userInformation.id;
//     const response = await myAxios.post("/order", values);
//     form.resetFields();
//     api.success({
//       message: response.data.message,
//     });
//   };

//   const validateNotNull = (_, value) => {
//     if (value === null || value === undefined || value === "") {
//       return Promise.reject("This field is required.");
//     }
//     return Promise.resolve();
//   };

//   function disabledDate(current) {
//     return current && current < moment().startOf("day");
//   }

//   return (
//     <PageTemplate>
//       {context}
//       <h1 style={{ marginBottom: "20px" }}>Đặt lịch khám</h1>
//       <Form form={form} onFinish={onFinish}>
//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item>
//               <Select
//                 placeholder="Chọn khu vực"
//                 onChange={handleFacilityChange}
//               >
//                 {facility.map((item) => (
//                   <Option key={item.id} value={item.id}>
//                     {item.facility_name}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item name="testDate" rules={[{ validator: validateNotNull }]}>
//               <DatePicker
//                 disabledDate={disabledDate}
//                 showTime={{ format: "HH:mm" }}
//                 style={{ width: "100%" }}
//                 placeholder="Chọn ngày khám"
//               />
//             </Form.Item>
//           </Col>
//         </Row>
//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item name="doctorId" rules={[{ validator: validateNotNull }]}>
//               <Select placeholder="Chọn bác sĩ" disabled={!selectedFacility || !doctor.length}>
//                 {Array.isArray(doctor) && doctor.length > 0 && (doctor.map((item) => (
//                   <Option key={item.id} value={item.id}>
//                     {item.fullName}
//                   </Option>
//                 )))}
//               </Select>
//             </Form.Item>
//           </Col>
//         </Row>
//         <Col style={{ display: "flex" }} >
//           <Row gutter={16} style={{ width: "50%" }} >
//             <Form.Item
//               style={{ width: '100%', border: "1px #d9d9d9 solid", borderRadius: "5px", marginLeft: "7px" }}
//               name="services"
//               rules={[
//                 {
//                   required: true,
//                   message: "This field is required.",
//                 },
//               ]}
//             >
//               <Checkbox.Group onChange={handleServiceChange} style={{ width: '100%', height: '200px', overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column' }}>
//                 {Array.isArray(service) && service.length > 0 && (service.map((item) => (
//                   <Col style={{ width: "100%", marginBottom: "10px", overflowY: "auto" }} key={item.id}>
//                     <Tooltip title={item.description}>
//                       <Checkbox style={{ width: "100%" }} value={item.id} >{item.name} {item.price}</Checkbox>
//                     </Tooltip>
//                   </Col>
//                 )))}
//               </Checkbox.Group>
//             </Form.Item>

//           </Row>

//           <Row gutter={8} style={{ height: '100%', width: "50%", minHeight: "200px", marginLeft: "20px" }} >
//             <Col span={24}>
//               <Form.Item name="note" style={{ minHeight: "200px" }}>
//                 <TextArea placeholder="Ghi chú" style={{ minHeight: "200px" }} />
//               </Form.Item>
//             </Col>
//           </Row>
//         </Col>
//         <Row style={{ width: "100%", display: "flex", justifyContent: "end" }}>
//           <Form wrapperCol={{ offset: 10, span: 20 }} style={{ marginRight: "-22px" }}>
//             <Button type="primary" htmlType="submit" style={{ backgroundColor: "white", color: "black", width: "100px", border: "1px black solid" }}>
//               Hủy
//             </Button>
//           </Form>
//           <Form.Item wrapperCol={{ offset: 10, span: 20 }} style={{ marginRight: "42px" }}>
//             <Button type="primary" htmlType="submit" style={{ backgroundColor: "#45c3d2", width: "100px" }}>
//               Đặt lịch
//             </Button>
//           </Form.Item>
//         </Row>
//       </Form>
//     </PageTemplate>
//   );
// }
// export default ServiceRegister;