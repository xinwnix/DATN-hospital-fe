import { notification } from "antd";

const useNotification = () => {
  const [api, contextHolder] = notification.useNotification();
  return { api, contextHolder };
};

export default useNotification;

