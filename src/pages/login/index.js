import classes from "./Login.module.scss"
import logo from "../../assets/images/logo.png"
import { Button, Form, Input, notification } from "antd";

import { Link } from "react-router-dom";


function Login() {
    // const [api, contextHolder] = notification.useNotification();
    return (
        <div id={classes["login"]}>
            {/* {contextHolder} */}
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
                        <Form>
                            <Form.Item
                                name="phone"
                                rules={[{ required: true, message: "Please input your phone number or email!" }]}
                            >
                                <label style={{ fontSize: 18, display: "flex" }}>Phone number or Email(<p style={{ color: "red" }}>*</p>):</label>
                                <Input className={classes["account"]} placeholder="Số điện thoại hoặc Email" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: "Please input your password!" }]}
                            >
                                <label style={{ fontSize: 18, display: "flex" }}>Password(<p style={{ color: "red" }}>*</p>):</label>
                                <Input.Password className={classes["password"]} placeholder="Mật khẩu" />
                            </Form.Item>
                            <Form.Item style={{ display: "flex", justifyContent: "center" }} >
                                <Button type="primary" htmlType="submit" className={classes["submit"]}>
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                        </Form>
                        <div className={classes["reset"]}>
                            <p href="#">Quên mật khẩu?</p>
                            <a href="#">Đặt lại mật khẩu.</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;