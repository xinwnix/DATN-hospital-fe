import React, { useEffect, useState } from "react";
import PageTemplate from "../../../template/page-template";
import { Table, Modal, Button, Collapse, Form, Input } from "antd";
import useUserInformation from "../../../hooks/useUserInformation";
import { EyeOutlined } from "@ant-design/icons";
import myAxios from "../../../config/config";
import { renderTag } from "../../../utils/label";
import moment from "moment";
import "moment/locale/vi";
import "./index.scss";

function HealthRecord() {
  const [healthRecord, setHealthRecord] = useState();
  const { userInformation } = useUserInformation();
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const response = await myAxios.get(`/health-record/${userInformation.id}`);
      console.log("/health-record/${userInformation.id}", response.data);
      setHealthRecord(response.data.data);
    };

    userInformation && fetch();
  }, []);

  const columns = [
    {
      title: "Tên cơ sở",
      dataIndex: ["ordertoPrescription", "doctor", "service", "facility", "facility_name"],
      key: "facility_name",
      align: "center",
      ellipsis: true,
      render: (facility_name) => <div style={{ height: "50px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>{facility_name}</div>,
    },
    {
      title: "Tên dịch vụ",
      dataIndex: ["ordertoPrescription", "doctor", "service", "name"],
      key: "serviceName",
      align: "center",
      ellipsis: true,
      render: (name) => <div style={{ height: "50px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>{name}</div>,
    },
    {
      title: "Tên bác sĩ",
      dataIndex: ["ordertoPrescription", "doctor", "fullName"],
      key: "fullName",
      align: "center",
      ellipsis: true,
      render: (fullName) => <div style={{ height: "50px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>{fullName}</div>,
    },
    {
      title: "Ngày khám",
      dataIndex: ["ordertoPrescription", "testDate"],
      key: "testDate",
      align: "center",
      ellipsis: true,
      render: (testDate) => <div style={{ height: "50px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>{testDate ? moment(testDate).format("DD/MM/YYYY") : "-"}</div>,
    },
    {
      title: "Giá khám",
      dataIndex: ["ordertoPrescription", "doctor", "service", "price"],
      key: "servicePrice",
      align: "center",
      ellipsis: true,
      render: (price) => <div style={{ height: "50px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>{price}</div>,
    },
    {
      title: "Kết luận",
      dataIndex: "comment",
      key: "comment",
      align: "center",
      ellipsis: true,
      render: (comment) => <div style={{ height: "50px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>{comment}</div>,
    },
    {
      title: "Phân tích",
      dataIndex: "value",
      key: "value",
      align: "center",
      ellipsis: true,
      render: (value) => <div style={{ height: "50px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>{value}</div>,
    },
    {
      title: "Mức độ sức khỏe",
      dataIndex: "level",
      key: "level",
      align: "center",
      ellipsis: true,
      filters: [
        { text: "Tốt", value: "GOOD" },
        { text: "Trung bình", value: "ALARM" },
        { text: "Yếu", value: "NORMAL" },
      ],
      onFilter: (value, record) => record.level === value,
      render: (text) => {
        return renderTag(text);
      },
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      align: "center",
      ellipsis: true,
      render: (_, record) => (
        <span onClick={() => handleViewDetails(record)}>
          <EyeOutlined style={{ cursor: "pointer", color: "#45c3d2", fontSize: "20px" }} />
        </span>
      ),
    },

  ];

  const extractPrescriptions = (record) => {
    if (record.ordertoPrescription && record.ordertoPrescription.prescription) {
      return record.ordertoPrescription.prescription.prescriptionItems;
    }
    return [];
  };


  const columnPrescription = [
    {
      title: "Tên thuốc",
      dataIndex: ["ordertoPrescription", "prescription", "prescriptionItems", 0, "medicine", "name"],
      key: "medicineName",
      align: "center",
      ellipsis: true,
      render: (_, record) => {
        const prescriptions = extractPrescriptions(record);
        return prescriptions.map((item) => (
          <div key={item.id}>
            <p>{item.medicine.name}</p>
          </div>
        ));
      },
    },
    {
      title: "Số lượng",
      dataIndex: ["ordertoPrescription", "prescription", "prescriptionItems", 0, "quantity"],
      key: "quantity",
      align: "center",
      ellipsis: true,
      render: (_, record) => {
        const prescriptions = extractPrescriptions(record);
        return prescriptions.map((item) => (
          <div key={item.id}>
            <p>{item.quantity}</p>
          </div>
        ));
      },
    },
    {
      title: "Liều lượng",
      dataIndex: ["ordertoPrescription", "prescription", "prescriptionItems", 0, "times"],
      key: "times",
      align: "center",
      ellipsis: true,
      render: (_, record) => {
        const prescriptions = extractPrescriptions(record);
        return prescriptions.map((item) => (
          <div key={item.id}>
            <p>{item.times}</p>
          </div>
        ));
      },
    },

  ];

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    Modal.info({
      title: 'Thông tin chi tiết sức khỏe',
      width: '40%',
      content: (
        <div style={{}}>
          <Form layout="horizontal" style={{ marginTop: "30px", width: "100%" }}>
            <Form.Item>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3px', alignItems: 'center' }}>
                <label htmlFor="facilityName">Tên cơ sở:</label>
                <Input disabled id="facilityName" value={record.ordertoPrescription?.doctor?.service?.facility?.facility_name} />
              </div>
            </Form.Item>
            <Form.Item>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3px', alignItems: 'center' }}>
                <label htmlFor="serviceName">Tên dịch vụ:</label>
                <Input disabled id="serviceName" value={record.ordertoPrescription?.doctor?.service?.name} />
              </div>
            </Form.Item>
            <Form.Item>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3px', alignItems: 'center' }}>
                <label htmlFor="facilityName">Tên bác sĩ:</label>
                <Input disabled id="facilityName" value={record.ordertoPrescription?.doctor?.fullName} />
              </div>
            </Form.Item>
            <Form.Item>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3px', alignItems: 'center' }}>
                <label htmlFor="facilityName">Ngày khám:</label>
                <Input disabled id="facilityName" value={record.ordertoPrescription?.testDate ? moment(record.ordertoPrescription?.testDate).format("DD/MM/YYYY") : "-"} />
              </div>
            </Form.Item>
            <Form.Item>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3px', alignItems: 'center' }}>
                <label htmlFor="serviceName">Giá khám:</label>
                <Input disabled id="serviceName" value={record.ordertoPrescription?.doctor?.service?.price} />
              </div>
            </Form.Item>
            <Form.Item>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3px', alignItems: 'center' }}>
                <label htmlFor="facilityName">Kết luận:</label>
                <Input disabled id="facilityName" value={record.comment} />
              </div>
            </Form.Item>
            <Form.Item>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3px', alignItems: 'center' }}>
                <label htmlFor="serviceName">Phân tích:</label>
                <Input disabled id="serviceName" value={record.value} />
              </div>
            </Form.Item>
            <Form.Item>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3px', alignItems: 'center' }}>
                <label htmlFor="facilityName">Mức độ sức khỏe:</label>
                <Input disabled id="facilityName" value={record.level === "GOOD" ? "Tốt" : record.level === "ALARM" ? "Trung bình" : "Yếu"} />
              </div>
            </Form.Item>
          </Form>
          <Table
            dataSource={healthRecord.filter(item => item.id === record.id)} // Sử dụng dataSource tương ứng với dữ liệu cho bảng
            columns={columnPrescription} // Nếu muốn tắt phân trang
            style={{ marginTop: "20px", width: "100%x" }}
          />
        </div>

      ),
      closable: true,
      maskClosable: true,
      onOk() { },
      okText: "Xác nhận"
    });
  };

  return (
    <PageTemplate>
      <h1 style={{ marginBottom: "20px" }}>Hồ sơ sức khỏe</h1>
      <Table columns={columns} dataSource={healthRecord} rowKey="id" />
    </PageTemplate>
  );
}

export default HealthRecord;

