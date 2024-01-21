import React, { useEffect, useState } from "react";
import PageTemplate from "../../../template/page-template";
import ManageTemplate from "../../../template/manage-template";
import myAxios from "../../../config/config";
import ButtonGroup from "antd/es/button/button-group";
import { Button, Card, Form, Input, Modal, notification, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import Title from "antd/es/typography/Title";


import ImgCrop from 'antd-img-crop';
import { Upload } from 'antd';

import "./index.scss"

function Service() {
  const [api, context] = notification.useNotification();
  const [render, setRender] = useState(0);
  const [services, setServices] = useState([]);
  const [service, setService] = useState();
  const [modal, contextHolder] = Modal.useModal();
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [form] = useForm();

  const columns = [
    {
      title: "Ảnh dịch vụ",
      key: "image",
      dataIndex: "image",
      align: "center",
      width: 150,
      ellipsis: true,
      render: (image) => (
        <img style={{ width: "100px", height: "50px", objectFit: "cover", display:"flex", alignItems:"center", justifyContent:"center" }} src={image} alt='Không có ảnh' />
      ),
    },
    {
      title: "Tên cơ sở",
      key: "facility_name",
      dataIndex: "facilityName",
      align: "center",
      width: 250,
      ellipsis: true,
      render: (facilityName) => <div style={{ height: "50px", overflow: "hidden", display:"flex", alignItems:"center", justifyContent:"center" }}>{facilityName}</div>,
    },
    {
      title: "Tên dịch vụ",
      key: "name",
      dataIndex: "name",
      align: "center",
      width: 250,
      ellipsis: true,
      render: (name) => <div style={{ height: "50px", overflow: "hidden", display:"flex", alignItems:"center", justifyContent:"center" }}>{name}</div>,
    },
    {
      title: "Giá tiền",
      key: "price",
      dataIndex: "price",
      align: "center",
      width: 200,
      ellipsis: true,
      render: (description) => (
        <div style={{ height: "50px", overflow: "hidden", display: "flex", alignItems: "center" }}>
          <div style={{ display: "inline-block" }}>
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(description).replace('₫', '')}VNĐ
          </div>
        </div>
      ),
    },
    {
      title: "Mô tả",
      key: "description",
      dataIndex: "description",
      align: "center",
      width: 300,
      ellipsis: true,
      render: (description) => <div style={{ height: "50px", overflow: "hidden", display:"flex", alignItems:"center", justifyContent:"center" }}>{description}</div>,
    },
    {
      title: "Hành động",
      key: "description",
      align: "center",
      render: (_, record) => {
        return (
          <ButtonGroup>
            <Button
              type="primary"
              onClick={() => {
                form.setFieldsValue(record);
                setService(record);
                setImageUrl(record.image || '');
                if (record.image) {
                  setFileList([{ uid: '-1', name: 'image.png', status: 'done', url: record.image }]);
                } else {
                  setFileList([]);
                }
                const facilityId = record.facility?.id || undefined;
                form.setFieldsValue({ ...record, facilityac_id: facilityId });
              }}
            >
              Cập nhật
            </Button>


            <Button
              type="primary"
              danger
              onClick={() => {
                setService(record);
                setShowConfirmButton(true);
              }}
            >
              Xóa
            </Button>
          </ButtonGroup>
        );
      },
    },
  ];

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await myAxios.get("/service");
        const responseData = response.data.data;

        if (responseData && responseData.length > 0) {
          const servicesWithFacilityNames = responseData.map((service) => ({
            ...service,
            facilityName: service.facility?.facility_name || 'Unknown Facility',
          }));

          setServices(servicesWithFacilityNames);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetch();
  }, [render]);

  const [formattedPrice, setFormattedPrice] = useState('');

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const numericValue = parseFloat(inputValue.replace(/[^\d.-]/g, ''));
    const formattedValue = numericValue.toLocaleString('vi-VN');

    setFormattedPrice(formattedValue);
  };

  //uploade ảnh
  const [imageUrl, setImageUrl] = useState('');
  const [fileList, setFileList] = useState([]);

  const onChange = (file) => {
    if (file.fileList.length > 0) {
      const currentFile = file.fileList[0].originFileObj;
      if (!currentFile) {
        setImageUrl(''); 
        setFileList([]);
        return;
      }

      const url = URL.createObjectURL(currentFile);
      setImageUrl(url); // Lưu đường dẫn ảnh
      setFileList(file.fileList);
    } else {
      setImageUrl('');
      setFileList([]);
    }
  };

  const onFinish = async (values) => {
    try {
      const payload = {
        ...values,
        facilityac_id: values.facilityac_id,
        id: service?.id,
        image: imageUrl,
      };
      const response = await myAxios.post("/service", payload);

      setRender(render + 1);
      api.success({
        message: response.data.message,
      });
      setService(null);
      form.resetFields();
      setImageUrl('');
      setFileList([]);
    } catch (error) {
      console.error(error);
    }
  };

  const { Option } = Select;
  const [facility, setFacility] = useState([]);
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await myAxios.get("/facility");
        setFacility(response.data.data);
      } catch (error) {
        console.error("Error fetching facilities: ", error);
      }
    };

    fetchFacilities();
  }, []);

  return (
    <PageTemplate>
      {context}
      {contextHolder}
      <ManageTemplate
        searchText="Nhập tên dịch vụ tìm kiếm"
        callbackAdd={() => {
          setService({
            id: 0,
            image: "",
            facilityac_id:"",
            name: "",
            price: "",
            description: "",
          });
        }}
        title="dịch vụ"
        columns={columns}
        dataSource={services}
      />
      <Modal
        onCancel={() => {
          setService(null);
          setShowConfirmButton(false);
          form.resetFields();
          setImageUrl('');
          setFileList([]);
        }}
        open={service != null && !showConfirmButton}
        footer={[
          <Button
            key="cancelButton"
            onClick={() => {
              setService(null);
              form.resetFields();
            }}
            style={{ width: "100px" }}>
            Hủy
          </Button>,
          <Button
            key="okButton" type="primary"
            onClick={() => {
              form.submit();
            }} style={{ width: "100px" }}>
            Xác nhận
          </Button>,
        ]}
      >
        <Card title={service?.id == 0 ? "Thêm dịch vụ" : "Cập nhật dịch vụ"}>
          <Form form={form} onFinish={onFinish} labelCol={{ span: 6 }} labelAlign="left">
            <Form.Item label="Ảnh dịch vụ" name="image">
              <ImgCrop rotationSlider>
                <Upload
                  action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                  listType="picture-card"
                  fileList={fileList}
                  onChange={onChange}
                >
                  {fileList.length < 1 && '+ Upload'}
                </Upload>
                {service && (
                  <img style={{ width: '100px', height: '100px', objectFit: 'cover' }} src={imageUrl || service?.image} alt="Chưa có ảnh" />
                )}
              </ImgCrop>
            </Form.Item>

            <Form.Item label="Tên cơ sở" name="facilityac_id" rules={[{ required: true, message: "Vui lòng chọn dịch vụ." }]} >
              <Select placeholder="Chọn cơ sở" >
                {facility.map(facility => (
                    <Option 
                     value={facility.id}>
                      {facility.facility_name}
                    </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Tên dịch vụ" name="name" rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ." }]}>
              <Input placeholder="Nhập tên dịch vụ" />
            </Form.Item>

            <Form.Item
              label="Giá tiền"
              name="price"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập giá tiền.',
                },
              ]}
            >
              <Input
                value={formattedPrice}
                onChange={handleInputChange}
                placeholder="Nhập giá tiền"
              />
            </Form.Item>

            <Form.Item
              label="Mô tả"
              name="description"
              rules={[{ required: true, message: "Vui lòng nhập mô tả." }]}
            >
              <Input.TextArea placeholder="Mô tả" style={{minHeight:"100px"}} />
            </Form.Item>
          </Form>
        </Card>
      </Modal>

      <Modal
        open={showConfirmButton}
        onOk={async () => {
          const response = await myAxios.delete(`/service/${service?.id}`);
          setService(null);
          setRender(render + 1);
          setShowConfirmButton(false);
          api.success({
            message: response.data.message,
          });
        }}
        onCancel={() => {
          setService(null);
          setShowConfirmButton(false);
        }}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Title style={{ fontSize: 20 }}>Bạn có muốn xóa dịch vụ "{service?.name}" này không?</Title>
      </Modal>
    </PageTemplate>
  );
}

export default Service;
