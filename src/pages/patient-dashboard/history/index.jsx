import React, { useEffect, useState } from "react";
import PageTemplate from "../../../template/page-template";
import Title from "antd/es/skeleton/Title";
import { Button, Collapse,  } from "antd";
import { formatDate } from "../../../utils/date-time";
import "./index.scss";
import { renderTag } from "../../../utils/label";
import OrderDetail from "../../doctor-dashboard/order-detail";
function History() {
  const [orders, setOrders] = useState([]);
  return (
    <PageTemplate>
      <Title>Lịch sử đặt lịch</Title>
      {orders.map((item) => {
        return (
          <div className="wrapper">
            <Collapse
              size="large"
              items={[
                {
                  key: "1",
                  label: (
                    <div>
                      {formatDate(item.testDate, "dd/MM/yyyy HH:mm")}
                      {renderTag(item.status)}
                      
                    </div>
                  ),
                  children: <OrderDetail orderId={item.id} disable />,
                },
              ]}
            />
            {item.status==="CONFIRM"&&(
              <Button>Hủy</Button>
            )}
          </div>
        );
      })}
    </PageTemplate>
  );
}

export default History;
