import { Tag } from "antd";

const renderTag = (status) => {
  let vietnameseStatus = "";

  switch (status) {
    case "REJECT":
      vietnameseStatus = "Từ chối";
      break;
    case "CONFIRM":
      vietnameseStatus = "Chờ xác nhận";
      break;
    case "DONE":
      vietnameseStatus = "Hoàn thành";
      break;
    case "IN_PROCESS":
      vietnameseStatus = "Đang xử lý";
      break;
    case "NORMAL":
      vietnameseStatus = "Yếu";
      break;
    case "GOOD":
      vietnameseStatus = "Tốt";
      break;
    case "ALARM":
      vietnameseStatus = "Trung bình";
      break;
    default:
      break;
  }

  return <Tag color={getColorBasedOnStatus(status)}>{vietnameseStatus}</Tag>;
};

const getColorBasedOnStatus = (status) => {
  switch (status) {
    case "REJECT":
      return "#ff4d4f";
    case "CONFIRM":
      return "red";
    case "DONE":
      return "green";
    case "IN_PROCESS":
      return "yellow";
    case "NORMAL":
      return "red";
    case "GOOD":
      return "green";
    case "ALARM":
      return "red";
    default:
      return "";
  }
};

export { renderTag };
