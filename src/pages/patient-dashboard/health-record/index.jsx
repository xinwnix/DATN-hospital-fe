import React, { useEffect, useState } from "react";
import PageTemplate from "../../../template/page-template";
import { Table } from "antd";
import useUserInformation from "../../../hooks/useUserInformation";
import myAxios from "../../../config/config";
import { renderTag } from "../../../utils/label";

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

  return (
    <PageTemplate>
      <h1 style={{marginBottom:"20px"}}>Hồ sơ sức khỏe</h1>
      <Table columns={columns} dataSource={healthRecord} />
    </PageTemplate>
  );
}

export default HealthRecord;

