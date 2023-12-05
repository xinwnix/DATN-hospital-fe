import React, { useEffect, useState } from "react";
import { Await, Link, useNavigate } from "react-router-dom";
import { Button, Col, DatePicker, Form, Input, Row, Select, notification } from "antd";
import myAxios from "../../config/config";
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined, RedoOutlined } from "@ant-design/icons";
import { auth } from "../../config/firebase";
import OtpInput from "react-otp-input";
import moment from "moment";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useForm } from "antd/es/form/Form";
import classes from "./Register.module.scss"
import logo from "../../assets/images/logo.png"

export default function Register() {
    const { Option } = Select;
    const [api, contextHolder] = notification.useNotification();
    const [confirmationResult, setConfirmationResult] = useState();
    const [appVerifier, setAppVerifier] = useState();
    const [code, setCode] = useState("");
    const [isCheckOTP, setIsCheckedOTP] = useState(false);
    const [isPhoneInputDisabled, setIsPhoneInputDisabled] = useState(false);
    const [disable, setDisable] = useState(true);

    const [form] = useForm();
    const sendOtp = async () => {
        try {
            const response = await myAxios.get(`/check-user/${form.getFieldValue("phone")}`);
            api.error({
                message: "Số điện thoại này đã được đăng ký trước đó!",
            });
        } catch (e) {
            let verifier = appVerifier;
            if (!appVerifier) {
                console.log("vào if");
                verifier = new RecaptchaVerifier(auth, "sign-in-button", {
                    size: "invisible",
                    callback: (response) => {
                    },
                });
                setAppVerifier(verifier);
            }
            try {
                signInWithPhoneNumber(auth, convertPhoneNumber(form.getFieldValue("phone")), verifier)
                    .then((confirmationResult) => {
                        window.confirmationResult = confirmationResult;
                        setConfirmationResult(confirmationResult);
                        console.log("success");
                        setIsPhoneInputDisabled(true);

                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } catch (error) {
                console.log(error);
                api.error({
                    message: error.message,
                });
            }
        }
    };

    const verify = () => {
        console.log(code);
        confirmationResult
            .confirm(code)
            .then((result) => {
                setIsCheckedOTP(true);

                api.success({
                    message: "Đã xác minh otp thành công",
                });
            })
            .catch((error) => {
                api.error({
                    message: "Bad OTP",
                });
            });
    };

    const onFinish = async (values) => {
        if (!isCheckOTP) {
            api["error"]({
                message: "Error",
                description: "Xác minh otp không thành công",
            });
            return;
        }
        try {
            values.accountType = "PATIENT";
            values.accountStatus = "ACTIVE";
            console.log(values);
            const response = await myAxios.post("/register", values);
            api["success"]({
                message: "Successfully",
                description: response.data.message,
            });
        } catch (e) {
            api["error"]({
                message: "Duplicate",
                description: "Địa chỉ email này đã được đăng ký trước đó",
            });
        }
    };

    function convertPhoneNumber(number) {
        if (number.length === 10 && /^\d+$/.test(number)) {
            return "+84" + number.slice(1);
        }
        return number;
    }

    // Custom validation function to check if the phone number is in Vietnamese format
    const validateVietnamesePhoneNumber = (_, value) => {
        const vietnamesePhoneNumberRegex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/; // Vietnamese phone number format
        if (!value || vietnamesePhoneNumberRegex.test(value)) {
            return Promise.resolve();
        }
        return Promise.reject("Please enter a valid Vietnamese phone number!");
    };

    const validateVietnamesePhoneNumber2 = (value) => {
        const vietnamesePhoneNumberRegex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/; // Vietnamese phone number format
        return vietnamesePhoneNumberRegex.test(value);
    };
    const disabledDate = (current) => {
        // Lấy ngày hiện tại và trừ đi 10 năm
        const tenYearsAgo = moment().subtract(10, "years");
        // Nếu ngày hiện tại cách ngày hôm nay 10 năm trở lại trở đi, trả về true để vô hiệu hóa ngày đó
        return current && current > tenYearsAgo;
    };

    const resetPhone = () => {
        setIsPhoneInputDisabled(false);
        setConfirmationResult(false);
    };


    return (
        <div id={classes["register"]}>
            <div className={classes["wrapper"]}>
                <div className={classes["header"]}>
                    <img src={logo} />
                    <a href="">Trợ giúp?</a>
                </div>
                {contextHolder}
                <div className={classes["content"]}>
                    <button id="sign-in-button"></button>
                    <div className={classes["form"]}>
                        <p>Đăng ký</p>
                        <div className={classes["signin"]}>
                            <p>Bạn đã có tài khoản?<Link to={"/login"} className={classes["dangnhap"]}>Đăng nhập ngay.</Link></p>
                        </div>

                        <Form form={form} name="registrationForm" onFinish={onFinish} scrollToFirstError autoComplete="off">
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="fullName"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Vui lòng nhập tên đầy đủ của bạn!",
                                            },
                                        ]}
                                    >
                                        <Input prefix={<UserOutlined />} placeholder="Tên đầy đủ" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="email"
                                        rules={[
                                            {
                                                type: "email",
                                                message: "Vui lòng nhập email hợp lệ!",
                                            },
                                            {
                                                required: true,
                                                message: "Vui lòng nhập email của bạn!",
                                            },
                                        ]}
                                    >
                                        <Input prefix={<MailOutlined />} placeholder="Email" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={confirmationResult ? 12 : 18}>
                                    <Form.Item
                                        name="phone"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Xin vui lòng điền số điện thoại của bạn!",
                                            },
                                            {
                                                validator: validateVietnamesePhoneNumber,
                                            },
                                        ]}
                                    >
                                        <Row gutter={5}>
                                            <Col span={isPhoneInputDisabled ? 20 : 24}>
                                                <Input
                                                    disabled={isPhoneInputDisabled}
                                                    prefix={<PhoneOutlined />}
                                                    placeholder="Số điện thoại"
                                                    onChange={(e) => {
                                                        setDisable(!validateVietnamesePhoneNumber2(e.target.value));
                                                    }}
                                                />
                                            </Col>
                                            <Col span={4}>
                                                {isPhoneInputDisabled && (
                                                    <Button type="primary" onClick={resetPhone}>
                                                        <RedoOutlined />
                                                    </Button>
                                                )}
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>
                                {confirmationResult && !isCheckOTP && (
                                    <Col span={6}>
                                        <Form.Item
                                            name="code"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui lòng nhập mã!",
                                                },
                                            ]}
                                        >
                                            <Input
                                                prefix={<PhoneOutlined />}
                                                placeholder="OTP"
                                                value={code}
                                                onChange={(e) => {
                                                    setCode(e.target.value);
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>
                                )}
                                <Col span={6}>
                                    {!isCheckOTP &&
                                        (confirmationResult ? (
                                            <Button style={{ width: "100%" }} onClick={verify}>
                                                Kiểm tra OTP
                                            </Button>
                                        ) : (
                                            <Button style={{ width: "100%" }} onClick={sendOtp} disabled={disable}>
                                                Gửi OTP
                                            </Button>
                                        ))}
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item
                                        name="password"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Vui lòng nhập mật khẩu của bạn!",
                                            },
                                        ]}
                                    >
                                        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="gender"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Vui lòng chọn giới tính của bạn!",
                                            },
                                        ]}
                                    >
                                        <Select placeholder="Chọn giới tính của bạn">
                                            <Option value="MALE">Nam</Option>
                                            <Option value="FEMALE">Nữ</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="dateOfBirth"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Vui lòng chọn ngày sinh của bạn!",
                                            },
                                        ]}
                                    >
                                        <DatePicker
                                            disabledDate={disabledDate}
                                            placeholder="Ngày sinh"
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
                                                message: "Vui lòng nhập địa chỉ của bạn!",
                                            },
                                        ]}
                                    >
                                        <Input prefix={<HomeOutlined />} placeholder="Địa chỉ" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
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
