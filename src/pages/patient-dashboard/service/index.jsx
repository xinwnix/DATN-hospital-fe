import React, { useEffect, useState } from "react";
import PageTemplate from "../../../template/page-template";
import { useForm } from "antd/es/form/Form";
import { Button, Checkbox, Col, DatePicker, Form, Row, Select, Tooltip, notification, Table } from "antd";
import myAxios from "../../../config/config";
import TextArea from "antd/es/input/TextArea";
import useUserInformation from "../../../hooks/useUserInformation";
import moment from "moment";
import { render } from "@testing-library/react";


import coXuongKhop from "../../../assets/images/co-xuong-khop.jpg"

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

function ServiceRegister() {

  return (
    <div style={{backgroundColor:"white", padding:"50px"}}>
      <h1>Dịch vụ khám bệnh</h1>

      <a style={{ display: "flex", border: "1px black solid", borderRadius: "5px", marginTop:"15px", color:"black" }}>
        <a style={{ width: "15%", borderRadius: "5px" }}>
          <img style={{ width: "100%", height: "100%", borderRadius: "5px" }} src={coXuongKhop} />
        </a>
        <div style={{ width: "85%"}}>
          <h3 style={{ marginLeft: "15px" }}>Cơ xương khớp</h3>
          <ul style={{marginLeft: "15px", listStyle: "none" }}>
                    <li><span>Các chuyên gia có quá trình đào tạo bài bản, nhiều kinh nghiệm</span></li>
                    <li><span>Các giáo sư, phó giáo sư đang trực tiếp nghiên cứu và giảng dạy tại Đại học Y khoa Hà Nội</span></li>
                    <li><span>Các bác sĩ đã, đang công tác tại các bệnh viện hàng đầu Khoa Cơ Xương Khớp - Bệnh viện Bạch Mai</span></li>
                </ul>
        </div>
      </a>
    </div>
  )



}

export default ServiceRegister;

