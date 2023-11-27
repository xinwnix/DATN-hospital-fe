import { Button, Form, Input, notification } from "antd";
import myAxios from "../../config/config";
import { Link, useNavigate } from "react-router-dom";
import classes from "./Login.module.scss"
import logo from "../../assets/images/logo.png"

function Login() {

    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate();
    const onFinish = async (values) => {
        try {
            const response = await myAxios.post("/login", values);
            localStorage.setItem("account", JSON.stringify(response.data.data));

            if (response.data.data.accountType === "PATIENT") {
                navigate("/patient");
            }
            if (response.data.data.accountType === "DOCTOR") {
                navigate("/doctor");
            }
            if (response.data.data.accountType === "ADMIN") {
                navigate("/admin");
            }
        } catch (e) {
            api["error"]({
                message: e.response.data,
            });
        }
    };

    return (
        <div id={classes["login"]}>
            {contextHolder}
            <div className={classes["wrapper"]}>
                <div className={classes["header"]}>
                    <img src={logo} />
                    <a href="">Trợ giúp?</a>
                </div>
                <div className={classes["content"]}>
                    <div className={classes["form"]}>
                        <p>Đăng nhập</p>
                        <div className={classes["signup"]}>
                            <p>Bạn chưa có tài khoản?</p>
                            <Link to={"/register"} className={classes["dangky"]}>Đăng ký ngay.</Link>
                        </div>
                        <Form
                            name="basic"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                labelAlign="left"
                                label="Phone or email"
                                name="phone"
                                rules={[{ required: true, message: "Please input your username!" }]}
                            >
                                <Input className={classes["account"]} placeholder="Số điện thoại hoặc Email" />
                            </Form.Item>

                            <Form.Item
                                labelAlign="left"
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: "Please input your password!" }]}
                            >
                                <Input.Password className={classes["password"]} placeholder="Mật khẩu" />
                            </Form.Item>
                            <Form.Item wrapperCol={{ offset: 8, span: 16 }} style={{ display: "flex", justifyContent: "center" }}>
                                <Button type="primary" htmlType="submit" className={classes["submit"]}>
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                        </Form>
                        <div className={classes["reset"]}>
                            <p>Quên mật khẩu?</p>
                            <Link to={"/forget-password"}>Đặt lại mật khẩu.</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;