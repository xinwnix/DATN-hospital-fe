import React, { useEffect, useState } from "react";
import PageTemplate from "../../../template/page-template";
import { useParams } from "react-router-dom";
import myAxios from "../../../config/config";
import { Button, Card, Col, Descriptions, Form, Input, InputNumber, Row,Select,Space, Tabs, notification, } from "antd";
import { formatDate } from "../../../utils/date-time";
import { MinusCircleOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";

import "./index.scss";
import { useForm } from "antd/es/form/Form";
function OrderDetail({ orderId, disable }) {
  const [disableEdit, setDisable] = useState(disable);
  const param = useParams();
  const [orderDetail, setOrderDetail] = useState();
  const [medicine, setMedicine] = useState([]);
  const [data, setData] = useState([]);
  const [render, setRender] = useState(0);
  const { Option } = Select;
  const [api, context] = notification.useNotification();
  const [formPrescriptions] = useForm();
  useEffect(() => {
    console.log(orderDetail?.status);
    if (orderDetail?.status === "DONE") setDisable(true);
  }, [orderDetail]);

  useEffect(() => {
    const fetch = async () => {
      const response = await myAxios.get(`order-detail/${orderId ? orderId : param.orderId}`);
      const responseMedicine = await myAxios.get(`medicine`);
      setOrderDetail(response.data.data);
      if (response?.data?.data?.prescription?.prescriptionItems) {
        const prescription = response.data.data.prescription?.prescriptionItems
          .filter((item) => !item.deleted)
          .map((item) => {
            return {
              medicineId: item.medicine.id,
              times: item.times,
              quantity: item.quantity,
            };
          });

        formPrescriptions.setFieldsValue({
          prescriptionItems: prescription,
        });
      }
      setMedicine(
        responseMedicine.data.data.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        })
      );
      console.log(response.data.data);
    };

    fetch();
  }, [render]);

  const handleSelectChange = (index, selectedMedicineId) => {
    const updatedData = [...data];
    updatedData[index].medicineId = selectedMedicineId;
    setData(updatedData);
  };

  const handleInputChange = (index, value, field) => {
    const updatedData = [...data];
    updatedData[index][field] = value;
    setData(updatedData);
  };

  const columns = [
    {
      title: "Tên thuốc",
      key: "name",
      align: "center",
      render: (text, record, index) => {
        if (orderDetail.prescription) {
          return record.medicine.name;
        }
        return (
          <Select
            disabled={disableEdit}
            onChange={(value) => {
              handleSelectChange(index, value);
            }}
            showSearch
            placeholder="Chọn loại thuốc"
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
            options={medicine}
          />
        );
      },
    },
    {
      title: "Số lượng",
      key: "quantity",
      align: "center",
      render: (text, record, index) => {
        console.log(text);
        if (orderDetail.prescription) {
          return record.quantity;
        }
        return (
          <Input
            disabled={disableEdit}
            type="number"
            onChange={(value) => {
              handleInputChange(index, Number(value.target.value), "quantity");
            }}
          />
        );
      },
    },
    {
      title: "Dặn dò",
      key: "times",
      align: "center",
      render: (_, record, index) => {
        if (orderDetail.prescription) {
          return record.times;
        }
        return (
          <Input
            disabled={disableEdit}
            onChange={(value) => {
              handleInputChange(index, value.target.value, "times");
            }}
          />
        );
      },
    },
    {
      title: "",
      render: (_, record, index) => {
        return (
          <Button
            type="primary"
            danger
            onClick={() => {
              data.splice(index, 1);
              setData([...data]);
            }}
          >
            <DeleteOutlined />
          </Button>
        );
      },
    },
  ];

  const handleAdd = () => {
    data.push({
      medicine: {
        id: null,
      },
      time: "",
      quantity: 0,
    });

    setData([...data]);
  };

  const handleSave = async () => {
    // console.log(typeof data[0].medicine.id);
    const response = await myAxios.post(`/prescription/${param.orderId}`, {
      prescriptionItems: data,
    });
    setRender(render + 1);
    api.success({
      message: response.data.message,
    });
  };

  const handleOnChangeResult = (value, index, field) => {
    orderDetail.results[index][field] = value;
    setOrderDetail({ ...orderDetail });
  };

  const handleSubmitResult = async () => {
    const response = await myAxios.post(`/result/${param.orderId}`, orderDetail.results);
    api.success({
      message: response.data.message,
    });
  };

  const items = [
    {
      label: `Thông tin`,
      key: 1,
      children: (
        <Card title="Thông tin đặt lịch" style={{ margin: "20px 0" }}>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Test Date">
              {formatDate(orderDetail?.testDate, "dd/MM/yyyy HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {formatDate(orderDetail?.createdAt, "dd/MM/yyyy HH:mm")}
            </Descriptions.Item>

            <Descriptions.Item label="Tên bệnh nhân">{orderDetail?.patient.fullName}</Descriptions.Item>
            <Descriptions.Item label="Giới tính">{orderDetail?.patient.gender}</Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">{orderDetail?.patient.dateOfBirth}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{orderDetail?.patient.phone}</Descriptions.Item>
            <Descriptions.Item label="Email">{orderDetail?.patient.email}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{orderDetail?.patient.address}</Descriptions.Item>

            <Descriptions.Item label="Tên bác sĩ">{orderDetail?.doctor.fullName}</Descriptions.Item>

            {orderDetail?.results.length > 0 && (
              <Descriptions.Item label="Tên dịch vụ" span={2}>
                <ul>
                  {orderDetail?.results.map((result, index) => (
                    <li key={index}>{result.service.name}</li>
                  ))}
                </ul>
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Ghi chú" span={2}>
              {orderDetail?.note}
            </Descriptions.Item>

            <Descriptions.Item label="Kết luận" span={2}>
              {orderDetail?.conclude}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      ),
    },
    {
      label: `Kết quả`,
      key: 2,
      children: (
        <Card title="Kết quả" style={{ margin: "20px 0" }}>
          <Descriptions bordered column={1}>
            {orderDetail?.results?.map((item, index) => {
              return (
                <Descriptions.Item label={item.service.name}>
                  <Row gutter={16}>
                    <Col span={5}>
                      <Select
                        disabled={disableEdit}
                        value={item.level}
                        onChange={(value) => {
                          handleOnChangeResult(value, index, "level");
                        }}
                        placeholder="Chọn mức độ"
                      >
                        <Option value="GOOD">GOOD</Option>
                        <Option value="NORMAL">NORMAL</Option>
                        <Option value="ALARM">ALARM</Option>
                      </Select>
                    </Col>
                  </Row>
                  <Row style={{ margin: "20px 0" }}>
                    <Col span={24}>
                      <Input
                        disabled={disableEdit}
                        value={item.value}
                        placeholder="Phân tích"
                        onChange={(e) => {
                          handleOnChangeResult(e.target.value, index, "value");
                        }}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <Input
                        disabled={disableEdit}
                        value={item.comment}
                        placeholder="Kết luận"
                        onChange={(e) => {
                          handleOnChangeResult(e.target.value, index, "comment");
                        }}
                      />
                    </Col>
                  </Row>
                </Descriptions.Item>
              );
            })}
          </Descriptions>
          {!disableEdit && (
            <Row style={{ justifyContent: "flex-end", marginTop: 20 }}>
              <Button type="primary" onClick={handleSubmitResult}>
                Lưu
              </Button>
            </Row>
          )}
        </Card>
      ),
    },
    {
      label: `Toa thuốc`,
      key: 3,
      children: (
        <Card title="Toa thuốc" style={{ margin: "20px 0" }}>
          <Form
            disabled={disableEdit}
            form={formPrescriptions}
            onFinish={async (values) => {
              console.log(values,">>>>>>>>>>>>>>>>>>valuessssssssssssssss");
              const response = await myAxios.post(`/prescription/${param.orderId}`, values);
              setRender(render + 1);
              api.success({
                message: response.data.message,
              });
            }}
          >
            <Form.List name="prescriptionItems">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, "medicineId"]}
                        rules={[{ required: true, message: "Nhập tên loại thuốc" }]}
                      >
                        <Select
                          showSearch
                          placeholder="Chọn loại thuốc"
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                          }
                          options={medicine}
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "quantity"]}
                        rules={[{ required: true, message: "Nhập số lượng" }]}
                      >
                        <InputNumber placeholder="Số lượng" min={1} />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "times"]}
                        rules={[{ required: true, message: "Nhập dặn dò" }]}
                      >
                        <Input placeholder="Dặn dò" />
                      </Form.Item>
                      {!disableEdit && <MinusCircleOutlined onClick={() => remove(name)} />}
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Thêm thuốc
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            {!disableEdit && (
              <Row
                style={{ justifyContent: "flex-end", marginTop: 20 }}
                onClick={() => {
                  formPrescriptions.submit();
                }}
              >
                <Button type="primary">Lưu</Button>
              </Row>
            )}
          </Form>
        </Card>
      ),
    },
  ];

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <PageTemplate>
      {context}
      <div className="order-detail">
        <Tabs tabPosition="left" items={items} />

        {!disableEdit && (
          <Row style={{ justifyContent: "flex-end" }}>
            <Button
              type="primary"
              onClick={async () => {
                try {
                  const response = await myAxios.patch(`order/${param.orderId}/DONE`);
                  api.success({
                    message: "Hoàn thành",
                  });
                  setOrderDetail(response.data.data);
                } catch (e) {
                  console.log(e);
                }
              }}
            >
              Hoàn thành
            </Button>
          </Row>
        )}
      </div>
    </PageTemplate>
  );
}

export default OrderDetail;
