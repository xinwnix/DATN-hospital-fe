import React, { useEffect, useState } from "react";
import PageTemplate from "../../../../template/page-template";
import { useForm } from "antd/es/form/Form";
import { Button, Checkbox, Col, DatePicker, Form, Row, Select, Tooltip, notification, Table } from "antd";
import myAxios from "../../../../config/config";
import TextArea from "antd/es/input/TextArea";
import useUserInformation from "../../../../hooks/useUserInformation";
import moment from "moment";
import { render } from "@testing-library/react";
import { ArrowLeftOutlined } from '@ant-design/icons';
import "./index.scss";

function ServiceDetails() {
    const [form] = useForm();
    const [selectedFacility, setSelectedFacility] = useState(null);
    const [facility, setFacility] = useState([]);
    const [service, setService] = useState([]);
    const [doctor, setDoctor] = useState([]);
    const { userInformation } = useUserInformation();
    const { Option } = Select;
    const [api, context] = notification.useNotification();

    useEffect(() => {
        const fetchFacilities = async () => {
            try {
                const response = await myAxios.get("/facility");
                setFacility(response.data.data);
            } catch (error) {
                console.error("Error fetching facilities: ", error);
            }
        };

        fetchFacilities();
    }, []);

    const fetchServicesByFacility = async (facilityId) => {
        try {
            const response = await myAxios.get(`/facility-services/${facilityId}`);
            console.log("Response from /facility-doctors: ", response.data);
            setService(response.data.data.services);
        } catch (error) {
            console.error("Error fetching services: ", error);
            setService([]);
        }
    };

    const handleFacilityChange = async (value) => {
        setSelectedFacility(value);
        if (value) {
            await fetchServicesByFacility(value);
        } else {
            setService([]);
        }
    };


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

    const handleServiceChange = async (value) => {
        if (value) {
            await fetchDoctorsByService(value);
        } else {
            setDoctor([]); // Nếu không có dịch vụ được chọn, reset danh sách bác sĩ
        }
    };

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
        return current && current < moment().startOf("day");
    }
    return (
        <div className="service-detail">
            <div className="service-back">
                <ArrowLeftOutlined style={{ margin: "0 15px", fontSize: "20px" }} />
            </div>
            <div className="service-title" >
                <div>
                    <h1 style={{ marginBottom: "15px" }}>Cơ xương khớp</h1>
                </div>
                <h2>
                    <b>Bác sĩ Cơ Xương Khớp giỏi</b>
                </h2>
                <ul style={{ listStyle: "none", marginBottom: "15px" }}>
                    <li><span>Các chuyên gia có quá trình đào tạo bài bản, nhiều kinh nghiệm</span></li>
                    <li><span>Các giáo sư, phó giáo sư đang trực tiếp nghiên cứu và giảng dạy tại Đại học Y khoa Hà Nội</span></li>
                    <li><span>Các bác sĩ đã, đang công tác tại các bệnh viện hàng đầu Khoa Cơ Xương Khớp - Bệnh viện Bạch Mai</span></li>
                </ul>
            </div>

            <Form style={{ padding: "20px 0", backgroundColor: "#eeeeee" }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item>
                            <Select
                                placeholder="Chọn khu vực"
                                onChange={handleFacilityChange}
                            >
                                {facility.map((item) => (
                                    <Option key={item.id} value={item.id}>
                                        {item.facility_name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16} style={{ height: "100px", backgroundColor: "white", borderRadius: "5px" }}>
                    <Col span={12}>
                    </Col>
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
                </Row>
            </Form>
        </div>
    )
}

export default ServiceDetails;