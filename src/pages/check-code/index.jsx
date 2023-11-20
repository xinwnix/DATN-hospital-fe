import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import myAxios from "../../config/config";
import { Modal } from "antd";
import "./index.scss";
function CheckCode() {
  const param = useParams();
  console.log(param);
  useEffect(() => {
    const checkCode = async () => {
      try {
        const response = await myAxios.post(`/active/${param.userId}`, {
          code: param.code,
        });
        Modal.success({
          content: "Tài khoản của bạn đã được kích hoạt",
        });
      } catch (e) {
        Modal.error({
          content: "Kích hoạt tài khoản thất bại!",
        });
      }
    };

    checkCode();
  }, []);
  return (
    <div className="check-code">
      Bạn có thể đóng trang này <Link to={"/"}> Về trang chủ</Link>
    </div>
  );
}

export default CheckCode;
