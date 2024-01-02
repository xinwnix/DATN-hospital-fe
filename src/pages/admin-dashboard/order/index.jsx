import React, { useEffect, useState } from "react";
import PageTemplate from "../../../template/page-template";
import myAxios from "../../../config/config";
import ManageTemplate from "../../../template/manage-template";
import { formatDate } from "../../../utils/date-time";
import { Button, Input, Space, notification } from "antd";
import { renderTag } from "../../../utils/label";

import "./index.scss"

function Order() {
  const [order, setOrder] = useState([]);
  const [api, context] = notification.useNotification();
  useEffect(() => {
    const fetch = async () => {
      const response = await myAxios.get("/order");
      setOrder(response.data.data);
    };

    fetch();
  }, []);

  const columns = [
    {
      title: "Ngày khám",
      dataIndex: "testDate",
      key: "testDate",
      align: "center",
      render: (testDate) => formatDate(testDate, "dd/MM/yyyy HH:mm"),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (createdAt) => formatDate(createdAt, "dd/MM/yyyy HH:mm"),
    },
    {
      title: "Tên bệnh nhân",
      dataIndex: ["patient", "fullName"],
      align: "center",
      key: "patient.fullName",
    },
    {
      title: "Số điện thoại bệnh nhân",
      dataIndex: ["patient", "phone"],
      align: "center",
      key: "patient.phone",
    },
    {
      title: "Tên bác sĩ",
      dataIndex: ["doctor", "fullName"],
      align: "center",
      key: "doctor.fullName",
    },
    {
      title: "Dịch vụ khám",
      dataIndex: ["doctor","service", "name"],
      align: "center",
      key: "doctor.fullName",
    },
    {
      title: "Giá cả",
      dataIndex: ["doctor","service", "price"],
      align: "center",
      key: "doctor.fullName",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      key: "status",
      filters: [
        { text: "Hoàn thành", value: "DONE" },
        { text: "Đang xử lý", value: "IN_PROCESS" },
        { text: "Chờ xác nhận", value: "CONFIRM" },
        { text: "Từ chối", value: "REJECT" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (value) => {
        return renderTag(value);
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      align: "center",
      key: "note",
    },
    {
      title: "Hành động",
      align: "center",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          {record.status === "CONFIRM" && (
            <>
              <Button
                onClick={async () => {
                  const response = await myAxios.patch(`/order/${record.id}/IN_PROCESS`);
                  api.success({
                    message: response.data.message,
                  });
                  setOrder(
                    order.map((item) => {
                      if (item.id === response.data.data.id) {
                        item = response.data.data;
                      }
                      return item;
                    })
                  );
                }}
                type="primary"
              >
                Duyệt
              </Button>
              <Button
                danger
                onClick={async () => {
                  const response = await myAxios.patch(`/order/${record.id}/REJECT`);
                  api.success({
                    message: response.data.message,
                  });
                  setOrder(
                    order.map((item) => {
                      if (item.id === response.data.data.id) {
                        item = response.data.data;
                      }

                      return item;
                    })
                  );
                }}
                type="primary"
              >
                Hủy
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <PageTemplate>
      {context}
      <ManageTemplate title="yêu cầu" columns={columns} dataSource={order} hideAddButton>
      </ManageTemplate>
    </PageTemplate>
  );
}

export default Order;
