import React, { useEffect, useState } from "react";
import PageTemplate from "../../../template/page-template";
import useUserInformation from "../../../hooks/useUserInformation";
import myAxios from "../../../config/config";
import { Button, Collapse, Modal } from "antd";
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

  const deleteOrder = async () => {
    try {
      // Gọi API để xóa đơn hàng theo selectedOrderId
      await myAxios.delete(`/order/${selectedOrderId}`);
      // Cập nhật lại danh sách đơn hàng sau khi xóa
      const response = await myAxios.get(`/order/${userInformation?.id}`);
      setOrders(response.data.data);
      setIsModalVisible(false);
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Error deleting order:", error);
    }
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const handleCancelClick = (orderId, e) => {
    setSelectedOrderId(orderId);
    setIsModalVisible(true);
    e.stopPropagation();
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedOrderId(null);
  };

  const handleModalConfirm = () => {
    deleteOrder();
    setSelectedOrderId(null);
  };
  return (
    <PageTemplate>
      <h1 style={{ marginBottom: "20px" }}>Lịch sử đặt lịch</h1>
      {orders.map((item) => {
        const cancelBtn = item.status === "CONFIRM" && (
          <Button onClick={(e) => handleCancelClick(item.id, e)}>Hủy</Button>
        );

        return (
          <div className="wrapper" key={item.id}>
            <Collapse
              size="large"
              items={[
                {
                  key: "1",
                  label: (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ marginRight: "10px" }}>
                        {formatDate(item.testDate, "dd/MM/yyyy HH:mm")}
                        {renderTag(item.status)}
                      </div>
                      {cancelBtn}
                    </div>
                  ),
                  children: <OrderDetail orderId={item.id} disable />,
                },
              ]}
            />
          </div>
        );
      })}
      <Modal
        title="Xác nhận hủy đặt lịch"
        visible={isModalVisible}
        onOk={handleModalConfirm}
        onCancel={handleModalCancel}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        Bạn có chắc chắn muốn hủy đặt lịch này không?
      </Modal>
    </PageTemplate>
  );
}

export default History;
