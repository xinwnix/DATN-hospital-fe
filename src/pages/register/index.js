import classes from "./Register.module.scss"
import logo from "../../assets/images/logo.png"
import { Link } from "react-router-dom";
import moment from "moment";
import { Button, Col, DatePicker, Form, Input, Row, Select } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined, RedoOutlined } from "@ant-design/icons";

function Register() {
    const { Option } = Select;
    const disabledDate = (current) => {
        // Lấy ngày hiện tại và trừ đi 10 năm
        const tenYearsAgo = moment().subtract(10, "years");
        // Nếu ngày hiện tại cách ngày hôm nay 10 năm trở lại trở đi, trả về true để vô hiệu hóa ngày đó
        return current && current > tenYearsAgo;
    };

    return (
        <div id={classes["register"]}>
            <div className={classes["wrapper"]}>
                <div className={classes["header"]}>
                    <img src={logo} />
                    <a href="">Trợ giúp?</a>
                </div>
                <div className={classes["content"]}>
                    <div className={classes["form"]}>
                        <p>Đăng ký</p>
                        <div className={classes["signin"]}>
                            <p>Bạn đã có tài khoản?<Link to={"/login"} className={classes["dangnhap"]}>Đăng nhập ngay.</Link></p>
                        </div>
                        <Form >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="fullName"
                                        rules={[
                                            {
                                              required: true,
                                              message: "Please enter your full name!",
                                            },
                                          ]}
                                    >
                                        <Input prefix={<UserOutlined />} placeholder="Full Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="email"
                                        rules={[
                                            {
                                              type: "email",
                                              message: "Please enter a valid email!",
                                            },
                                            {
                                              required: true,
                                              message: "Please enter your email!",
                                            },
                                          ]}
                                    >
                                        <Input prefix={<MailOutlined />} placeholder="Email" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col>
                                    <Form.Item
                                        name="phone"
                                        rules={[
                                            {
                                              required: true,
                                              message: "Please enter your phone number!",
                                            }
                                          ]}
                                    >
                                        <Row gutter={5}>
                                            <Col>
                                                <Input
                                                    prefix={<PhoneOutlined />}
                                                    placeholder="Phone Number"
                                                />
                                            </Col>
                                            <Col span={4}>
                                                <Button type="primary" style={{color:"white", backgroundColor:"#45c3d2"}}>
                                                    <RedoOutlined />
                                                </Button>

                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>

                                <Col span={6}>
                                    <Form.Item
                                        name="code"
                                        rules={[
                                            {
                                              required: true,
                                              message: "Please enter code!",
                                            },
                                          ]}
                                    >
                                        <Input
                                            prefix={<PhoneOutlined />}
                                            placeholder="OTP"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Button style={{ width: "100%" }} >
                                        Check OTP
                                    </Button>
                                    <Button style={{ width: "100%" }}>
                                        Send OTP
                                    </Button>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item
                                        name="password"
                                        rules={[
                                            {
                                              required: true,
                                              message: "Please enter your password!",
                                            },
                                          ]}
                                    >
                                        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="gender"
                                        rules={[
                                            {
                                              required: true,
                                              message: "Please select your gender!",
                                            },
                                          ]}
                                    >
                                        <Select placeholder="Select your gender">
                                            <Option value="MALE">Male</Option>
                                            <Option value="FEMALE">Female</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="dateOfBirth"
                                        rules={[
                                            {
                                              required: true,
                                              message: "Please select your date of birth!",
                                            },
                                          ]}
                                    >
                                        <DatePicker
                                            disabledDate={disabledDate}
                                            placeholder="Date of Birth"
                                            style={{ width: "100%" }}
                                            format={"DD/MM/YYYY"}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item
                                        name="address"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please enter your address!",
                                            },
                                        ]}
                                    >
                                        <Input prefix={<HomeOutlined />} placeholder="Address" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item style={{ display: "flex", justifyContent: "center" }} >
                                <Button type="primary" htmlType="submit" className={classes["submit"]}>
                                    Đăng ký
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;