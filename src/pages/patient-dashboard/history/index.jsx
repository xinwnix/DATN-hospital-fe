import React, { useEffect, useState } from "react";
import PageTemplate from "../../../template/page-template";
import useUserInformation from "../../../hooks/useUserInformation";
import myAxios from "../../../config/config";
import { Button, Card, Collapse, Descriptions, Tag } from "antd";
import { formatDate } from "../../../utils/date-time";
import "./index.scss";
import { renderTag } from "../../../utils/label";
import OrderDetail from "../../doctor-dashboard/order-detail";
function History() {
  const { userInformation } = useUserInformation();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const response = await myAxios.get(`/order/${userInformation?.id}`);
      setOrders(response.data.data);
    };
    userInformation && fetch();
  }, []);

  return (
    <PageTemplate>
      <h1 style={{marginBottom:"20px"}}>Lịch sử đặt lịch</h1>
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
