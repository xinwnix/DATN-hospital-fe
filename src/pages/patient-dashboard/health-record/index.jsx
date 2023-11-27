import React, { useEffect, useState } from "react";
import PageTemplate from "../../../template/page-template";
import { Table, Modal, Button, Collapse } from "antd";
import useUserInformation from "../../../hooks/useUserInformation";
import myAxios from "../../../config/config";
import { renderTag } from "../../../utils/label";
import "./index.scss";
import OrderDetail from "../../doctor-dashboard/order-detail";

function HealthRecord() {
  const [healthRecord, setHealthRecord] = useState();
  const { userInformation } = useUserInformation();

  useEffect(() => {
    const fetch = async () => {
      const response = await myAxios.get(`/health-record/${userInformation.id}`);
      setHealthRecord(response.data.data);
    };

    userInformation && fetch();
  }, []);

  const columns = [
    {
      title: "Nhận xét",
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: "Phân tích",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Mức độ sức khỏe",
      dataIndex: "level",
      key: "level",
      filters: [
        { text: "GOOD", value: "GOOD" },
        { text: "ALARM", value: "ALARM" },
        { text: "NORMAL", value: "NORMAL" },
      ],
      onFilter: (value, record) => record.level === value,
      render: (text) => {
        return renderTag(text);
      },
    },
    {
      title: "Tên dịch vụ",
      dataIndex: ["service", "name"],
      key: "serviceName",
    },
  ];
  const [selectedRecord, setSelectedRecord] = useState(null);// State để lưu trữ dữ liệu cho record được chọn
  const rowProps = {
    onClick: (record) => {
      handleRowClick(record);
    },
  };

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const response = await myAxios.get(`/order/${userInformation?.id}`);
      setOrders(response.data.data);
    };
    userInformation && fetch();
  }, []);

  const handleRowClick = (record) => {
    setSelectedRecord(record);
    // Mở modal khi ô được click
    const selectedHealthRecord = healthRecord.find((item) => item.id === record.id);
    Modal.info({
      title: 'Thông tin chi tiết',
      content: (
        <div>
          {orders.map((item) => {
            return (
              <div className="wrapper">
                <Collapse
                  size="large"
                  items={[
                    {
                      key: "1",
                      children: <OrderDetail orderId={item.id} disable />,
                    },
                  ]}
                />
              </div>
            );
          })}
        </div>
      ),
      closable: true,
      maskClosable: true,
      onOk() { }, // Hàm này để đóng modal khi nhấn OK, có thể để trống
    });
  };

  return (
    <PageTemplate>
      <h1 style={{ marginBottom: "20px" }}>Hồ sơ sức khỏe</h1>
      <Table columns={columns} dataSource={healthRecord} rowKey="id" onRow={(record) => ({ ...rowProps })} />
    </PageTemplate>
  );
}

export default HealthRecord;

