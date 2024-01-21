import axios from "axios";
const baseUrl = "http://localhost:6868/";

const config = {
  baseUrl,
};
const myAxios = axios.create(config);
myAxios.defaults.baseURL = baseUrl;
const handleBefore = (config) => {
  const token = localStorage.getItem("token")?.replaceAll('"', "");
  console.log("run interceptors");
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
};
const handleError = (error) => {
  console.log(error);
  return config;
};
myAxios.interceptors.request.use(handleBefore, null);

export default myAxios;
