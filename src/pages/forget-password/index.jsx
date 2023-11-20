// import React, { useState } from "react";
// import { Form, Input, Button, message, Row, notification } from "antd";
// import "./index.scss";
// import { useForm } from "antd/es/form/Form";
// import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// import { auth } from "../../config/firebase";
// import myAxios from "../../config/config";
// import { useNavigate } from "react-router-dom";
// const ForgetPassword = () => {
//   const [account, setAccount] = useState();
//   const [api, contextHolder] = notification.useNotification();
//   const [confirmationResult, setConfirmationResult] = useState();
//   const [appVerifier, setAppVerifier] = useState();
//   const [code, setCode] = useState("");
//   const [isCheckOTP, setIsCheckedOTP] = useState(false);
//   const [form] = useForm();
//   const navigate = useNavigate();
//   const onFinish = (values) => {
//     // Here you can handle the logic to send the forget password request
//     // For this example, we'll just show a success message
//     // message.success("Password reset link sent to your email!");
//   };
//   function convertPhoneNumber(number) {
//     if (number.length === 10 && /^\d+$/.test(number)) {
//       return "+84" + number.slice(1);
//     }
//     return number;
//   }

//   const sendOtp = async () => {
//     try {
//       const response = await myAxios.get(`info/${form.getFieldValue("phone")}`);
//       setAccount(response.data.data);
//     } catch (error) {
//       console.log(error);
//       api.error({
//         message: error.response.data,
//       });
//       return;
//     }

//     let verifier = appVerifier;
//     if (!appVerifier) {
//       verifier = new RecaptchaVerifier(auth, "sign-in-button", {
//         size: "invisible",
//         callback: (response) => {
//           // reCAPTCHA solved, allow signInWithPhoneNumber.
//           // onSignInSubmit();
//         },
//       });
//       setAppVerifier(verifier);
//     }
//     try {
//       signInWithPhoneNumber(auth, convertPhoneNumber(form.getFieldValue("phone")), verifier)
//         .then((confirmationResult) => {
//           // SMS sent. Prompt user to type the code from the message, then sign the
//           // user in with confirmationResult.confirm(code).
//           window.confirmationResult = confirmationResult;
//           setConfirmationResult(confirmationResult);
//           console.log("success");

//           // Swal.fire(
//           //   "Good job!",
//           //   "Sent OTP Success, Please enter code! ",
//           //   "success"
//           // );
//           // ...
//         })
//         .catch((error) => {
//           console.log(error);
//           // Error; SMS not sent
//           // ...
//           // Swal.fire({
//           //   icon: "error",
//           //   title: "Oops...",
//           //   text: "Something went wrong!",
//           // });
//         });
//     } catch (error) {
//       console.log(error);
//       api.error({
//         message: error.message,
//       });
//     }
//   };

//   const verify = () => {
//     console.log(code);
//     confirmationResult
//       .confirm(code)
//       .then((result) => {
//         console.log("ok");
//         // User signed in successfully.
//         setIsCheckedOTP(true);

//         api.success({
//           message: "Verified otp successfully",
//         });
//         // Swal.fire("Good job!", "Good OTP", "success");
//         // ...
//       })
//       .catch((error) => {
//         console.log(error);
//         api.error({
//           message: "Bad OTP",
//         });
//         // User couldn't sign in (bad verification code?)
//         // ...

//         // Swal.fire({
//         //   icon: "error",
//         //   title: "Oops...",
//         //   text: "Bad OTP",
//         // });
//       });
//   };
//   const resetPassword = async () => {
//     if (form.getFieldValue("newPassword") !== form.getFieldValue("repassword")) {
//       api.error({
//         message: "Password and repassword not match",
//       });
//       return;
//     }
//     try {
//       const response = await myAxios.post(`reset-password/${account.id}`, {
//         newPassword: form.getFieldValue("newPassword"),
//       });
//       api.success({
//         message: "Reset successfully",
//       });
//       navigate("/");
//     } catch (error) {
//       api.error({
//         message: error.response.data,
//       });
//     }
//   };
//   const validateVietnamesePhoneNumber = (_, value) => {
//     const vietnamesePhoneNumberRegex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/; // Vietnamese phone number format
//     if (!value || vietnamesePhoneNumberRegex.test(value)) {
//       return Promise.resolve();
//     }
//     return Promise.reject("Please enter a valid Vietnamese phone number!");
//   };
//   return (
//     <div className="forget-password">
//       {contextHolder}
//       <button id="sign-in-button"></button>
//       {!isCheckOTP ? (
//         <div className="wrapper">
//           <h2>Forget Password</h2>
//           <Form form={form} onFinish={onFinish}>
//             <Form.Item
//               name="phone"
//               label="Phone"
//               rules={[
//                 {
//                   required: true,
//                   message: "Please enter your phone!",
//                 },
//                 {
//                   validator: validateVietnamesePhoneNumber,
//                 },
//               ]}
//             >
//               <Input />
//             </Form.Item>

//             {confirmationResult && (
//               <Form.Item
//                 name="otp"
//                 label="OTP"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please enter your phone!",
//                   },
                  
//                 ]}
//               >
//                 <Input value={code} onChange={(e) => setCode(e.target.value)} />
//               </Form.Item>
//             )}

//             <Form.Item>
//               <Row style={{ justifyContent: "center" }}>
//                 {confirmationResult ? (
//                   <Button type="primary" htmlType="submit" onClick={verify}>
//                     Check OTP
//                   </Button>
//                 ) : (
//                   <Button type="primary" htmlType="submit" onClick={sendOtp}>
//                     Send OTP
//                   </Button>
//                 )}
//               </Row>
//             </Form.Item>
//           </Form>
//         </div>
//       ) : (
//         <div className="wrapper">
//           <h2>Reset password</h2>
//           <Form form={form} onFinish={resetPassword}>
//             <Form.Item
//               name="newPassword"
//               rules={[
//                 {
//                   required: true,
//                   message: "Please enter your password!",
//                 },
//                 { min: 6, message: "Password must be at least 6 characters long" },
//                 // {
//                 //   pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
//                 //   message: "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
//                 // },
//               ]}
//             >
//               <Input.Password  placeholder="New Password" />
//             </Form.Item>
//             <Form.Item
//               name="repassword"
//               rules={[
//                 { required: true, message: "Please confirm your new password" },
//                 ({ getFieldValue }) => ({
//                   validator(_, value) {
//                     if (!value || getFieldValue("newPassword") === value) {
//                       return Promise.resolve();
//                     }
//                     return Promise.reject("Passwords do not match");
//                   },
//                 }),
//               ]}
//             >
//               <Input.Password  placeholder="Confirm new password" />
//             </Form.Item>
//             <Form.Item>
//               <Button type="primary" htmlType="submit">
//                 Reset password
//               </Button>
//             </Form.Item>
//           </Form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ForgetPassword;

import React, { useState } from "react";
import { Form, Input, Button, message, Row, notification } from "antd";
import "./index.scss";
import { useForm } from "antd/es/form/Form";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../config/firebase";
import myAxios from "../../config/config";
import { useNavigate } from "react-router-dom";
const ForgetPassword = () => {
  const [account, setAccount] = useState();
  const [api, contextHolder] = notification.useNotification();
  const [confirmationResult, setConfirmationResult] = useState();
  const [appVerifier, setAppVerifier] = useState();
  const [code, setCode] = useState("");
  const [isCheckOTP, setIsCheckedOTP] = useState(false);
  const [form] = useForm();
  const navigate = useNavigate();
  const onFinish = (values) => {
    // Here you can handle the logic to send the forget password request
    // For this example, we'll just show a success message
    // message.success("Password reset link sent to your email!");
  };
  function convertPhoneNumber(number) {
    if (number.length === 10 && /^\d+$/.test(number)) {
      return "+84" + number.slice(1);
    }
    return number;
  }

  const sendOtp = async () => {
    try {
      const response = await myAxios.get(`info/${form.getFieldValue("phone")}`);
      setAccount(response.data.data);
    } catch (error) {
      console.log(error);
      api.error({
        message: error.response.data,
      });
      return;
    }

    let verifier = appVerifier;
    if (!appVerifier) {
      verifier = new RecaptchaVerifier(auth, "sign-in-button", {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // onSignInSubmit();
        },
      });
      setAppVerifier(verifier);
    }
    try {
      signInWithPhoneNumber(auth, convertPhoneNumber(form.getFieldValue("phone")), verifier)
        .then((confirmationResult) => {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          window.confirmationResult = confirmationResult;
          setConfirmationResult(confirmationResult);
          console.log("success");

          // Swal.fire(
          //   "Good job!",
          //   "Sent OTP Success, Please enter code! ",
          //   "success"
          // );
          // ...
        })
        .catch((error) => {
          console.log(error);
          // Error; SMS not sent
          // ...
          // Swal.fire({
          //   icon: "error",
          //   title: "Oops...",
          //   text: "Something went wrong!",
          // });
        });
    } catch (error) {
      console.log(error);
      api.error({
        message: error.message,
      });
    }
  };

  const verify = () => {
    console.log(code);
    confirmationResult
      .confirm(code)
      .then((result) => {
        console.log("ok");
        // User signed in successfully.
        setIsCheckedOTP(true);

        api.success({
          message: "Verified otp successfully",
        });
        // Swal.fire("Good job!", "Good OTP", "success");
        // ...
      })
      .catch((error) => {
        console.log(error);
        api.error({
          message: "Bad OTP",
        });
        // User couldn't sign in (bad verification code?)
        // ...

        // Swal.fire({
        //   icon: "error",
        //   title: "Oops...",
        //   text: "Bad OTP",
        // });
      });
  };
  const resetPassword = async () => {
    if (form.getFieldValue("newPassword") !== form.getFieldValue("repassword")) {
      api.error({
        message: "Password and repassword not match",
      });
      return;
    }
    try {
      const response = await myAxios.post(`reset-password/${account.id}`, {
        newPassword: form.getFieldValue("newPassword"),
      });
      api.success({
        message: "Reset successfully",
      });
      navigate("/");
    } catch (error) {
      api.error({
        message: error.response.data,
      });
    }
  };
  const validateVietnamesePhoneNumber = (_, value) => {
    const vietnamesePhoneNumberRegex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/; // Vietnamese phone number format
    if (!value || vietnamesePhoneNumberRegex.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject("Please enter a valid Vietnamese phone number!");
  };
  return (
    <div className="forget-password">
      {contextHolder}
      <button id="sign-in-button"></button>
      {!isCheckOTP ? (
        <div className="wrapper">
          <h2>Forget Password</h2>
          <Form form={form} onFinish={onFinish}>
            <Form.Item
              name="phone"
              label="Phone"
              rules={[
                {
                  required: true,
                  message: "Please enter your phone!",
                },
                {
                  validator: validateVietnamesePhoneNumber,
                },
              ]}
            >
              <Input />
            </Form.Item>

            {confirmationResult && (
              <Form.Item
                name="otp"
                label="OTP"
                rules={[
                  {
                    required: true,
                    message: "Please enter your phone!",
                  },
                  
                ]}
              >
                <Input value={code} onChange={(e) => setCode(e.target.value)} />
              </Form.Item>
            )}

            <Form.Item>
              <Row style={{ justifyContent: "center" }}>
                {confirmationResult ? (
                  <Button type="primary" htmlType="submit" onClick={verify}>
                    Check OTP
                  </Button>
                ) : (
                  <Button type="primary" htmlType="submit" onClick={sendOtp}>
                    Send OTP
                  </Button>
                )}
              </Row>
            </Form.Item>
          </Form>
        </div>
      ) : (
        <div className="wrapper">
          <h2>Reset password</h2>
          <Form form={form} onFinish={resetPassword}>
            <Form.Item
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: "Please enter your password!",
                },
                { min: 6, message: "Password must be at least 6 characters long" },
                // {
                //   pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                //   message: "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
                // },
              ]}
            >
              <Input.Password  placeholder="New Password" />
            </Form.Item>
            <Form.Item
              name="repassword"
              rules={[
                { required: true, message: "Please confirm your new password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Passwords do not match");
                  },
                }),
              ]}
            >
              <Input.Password  placeholder="Confirm new password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Reset password
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
};

export default ForgetPassword;