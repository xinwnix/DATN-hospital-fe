import React, { useEffect, useState } from "react";
import PageTemplate from "../../../template/page-template";
import ManageTemplate from "../../../template/manage-template";
import { EyeOutlined } from "@ant-design/icons";
import myAxios from "../../../config/config";
import { renderTag } from "../../../utils/label";
import moment from "moment";
import "moment/locale/vi";
import { Tag, notification, Modal, Table } from "antd";


function PatientRecords() {
  const [users, setUsers] = useState([]);
  const [api, context] = notification.useNotification();
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSecondModalVisible, setIsSecondModalVisible] = useState(false);



  const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "fullName",
      key: "fullName",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      align: "center",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      align: "center",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      align: "center",
      render: (text) => {
        return text === "MALE" ? <span>Nam</span> : <span>Nữ</span>;
      },
    },
    {
      title: "Ngày sinh",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      align: "center",
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      align: "center",
      width: "110px",
      ellipsis: true,
      render: (_, record) => (
        <span onClick={() => handleViewDetails(record)}>
          <EyeOutlined style={{ cursor: "pointer", color: "#45c3d2", fontSize: "20px" }} />
        </span>
      ),
    },
  ];

  const fetch = async () => {
    const response = await myAxios.get("/patientrecord");
    setUsers(response.data.data);
  };


  useEffect(() => {
    fetch();
  }, []);

  const handleViewDetails = (record) => {
    setSelectedRecord(record);

    const columns = [
      {
        title: 'Bệnh viện',
        dataIndex: 'facility_name',
        key: 'facility_name',
      },
      {
        title: 'Dịch vụ',
        dataIndex: 'service_name',
        key: 'service_name',
      },
      {
        title: 'Bác sĩ',
        dataIndex: 'doctor_name',
        key: 'doctor_name',
      },
      {
        title: 'Ngày khám',
        dataIndex: 'testDate',
        key: 'testDate',
        render: (testDate) => <div style={{ height: "50px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>{testDate ? moment(testDate).format("DD/MM/YYYY") : "-"}</div>,
      },
      {
        title: 'Kết luận',
        dataIndex: 'comment',
        key: 'comment',
      },
      {
        title: 'Phân tích',
        dataIndex: 'value',
        key: 'value',
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
        dataIndex: "actionitem",
        key: "actionitem",
        align: "center",
        ellipsis: true,
        render: (_, record) => (
          <span onClick={() => handleViewSecondModal(record)}>
            <EyeOutlined style={{ cursor: "pointer", color: "#45c3d2", fontSize: "20px" }} />
          </span>
        ),
      },

    ];

    const dataSource = record.orderResponses.map((response) => ({
      key: response.id,
      facility_name: response.doctor.service.facility.facility_name,
      service_name: response.doctor.service.name,
      doctor_name: response.doctor.fullName,
      testDate: response.testDate,
      comment: response.results[0].comment,
      value: response.results[0].value,
      level: response.results[0].level,
    }));

    Modal.info({
      title: `Chi tiết hồ sơ bệnh nhân - ${record.fullName}`,
      width: '60%',
      content: (
        <div style={{ padding: "20px" }}>
          <Table columns={columns} dataSource={dataSource} pagination={false} />
        </div>
      ),
      closable: true,
      maskClosable: true,
      onOk() { },
      okText: 'Xác nhận',
    });
  };

  const handleViewSecondModal = (record) => {
    console.log("handleViewSecondModal called with record:", record)
    setIsModalVisible(true);
    setSelectedItem(record);
  };


  return (
    <PageTemplate>
      {context}
      <ManageTemplate title="Bệnh nhân" columns={columns} dataSource={users} hideAddButton>
      </ManageTemplate>
      {isSecondModalVisible && selectedItem && selectedItem.facility_name && selectedItem.service_name && (
        <Modal
          title={`Chi tiết thêm`}
          visible={isSecondModalVisible}
          onCancel={() => setIsSecondModalVisible(false)}
          footer={null}
          getPopupContainer={() => document.getElementById("root")}
          style={{ zIndex: 1050 }}
        >
          <div>

          </div>
        </Modal>
      )}
    </PageTemplate>
  );
}

export default PatientRecords;
