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
      title: "Stt",
      dataIndex: "stt",
      key: "stt",
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Ảnh dịch vụ",
      key: "image",
      dataIndex: "image",
      width: 150,
      render: (image) => (
        <img style={{ width: "100px", height: "50px", objectFit: "cover" }} src={image} alt='Không có ảnh' />
      ),
    },
    {
      title: "Tên cơ sở",
      key: "facility_name",
      dataIndex: "facilityName",
      width: 250,
    },
    {
      title: "Tên dịch vụ",
      key: "name",
      dataIndex: "name",
      width: 250,
    },
    {
      title: "Giá tiền",
      key: "price",
      dataIndex: "price",
      width: 200,
    },
    {
      title: "Mô tả",
      key: "description",
      dataIndex: "description",
      width: 300,
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
                form.setFieldsValue(record); // Gán thông tin của dịch vụ vào form
                setService(record); // Lưu thông tin dịch vụ để cập nhật
                // Gán thông tin ảnh và fileList của dịch vụ vào state để hiển thị
                setImageUrl(record.image || '');
                if (record.image) {
                  setFileList([{ uid: '-1', name: 'image.png', status: 'done', url: record.image }]);
                } else {
                  setFileList([]); // Nếu không có ảnh, xóa fileList để hiển thị '+ Upload'
                }

                // Gán giá trị facilityac_id để hiển thị tên cơ sở trong Select
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
        console.log(response,">..............................data service");
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
    const numericValue = parseFloat(inputValue.replace(/[^\d.-]/g, '')); // Lấy giá trị số từ chuỗi nhập vào
    const formattedValue = numericValue.toLocaleString('vi-VN'); // Định dạng số theo định dạng tiền tệ

    setFormattedPrice(formattedValue);
  };

  //uploade ảnh
  const [imageUrl, setImageUrl] = useState('');
  const [fileList, setFileList] = useState([]);

  const onChange = (file) => {
    if (file.fileList.length > 0) {
      const currentFile = file.fileList[0].originFileObj;

      // Nếu người dùng không chọn ảnh mới mà muốn xóa ảnh hiện tại
      if (!currentFile) {
        setImageUrl(''); // Xóa đường dẫn ảnh
        setFileList([]); // Xóa danh sách file
        return;
      }

      const url = URL.createObjectURL(currentFile);
      // Thực hiện các hành động cần thiết với đường dẫn ảnh
      setImageUrl(url); // Lưu đường dẫn ảnh
      setFileList(file.fileList); // Lưu danh sách file
    } else {
      setImageUrl(''); // Xóa đường dẫn ảnh nếu không có ảnh nào được chọn
      setFileList([]); // Xóa danh sách file nếu không có ảnh nào được chọn
    }
  };

  const onFinish = async (values) => {
    try {
      const payload = {
        ...values,
        facilityac_id: values.facilityac_id, // Chọn cơ sở từ Select và lưu vào facility_id
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


  //lấy cơ sở vào selection
  const { Option } = Select;

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
                  <img style={{ width: '100px', height: '100px', objectFit: 'cover' }} src={imageUrl || service?.image} alt="Không có ảnh" />
                )}
              </ImgCrop>
            </Form.Item>

            <Form.Item label="Tên cơ sở" name="facilityac_id">
              <Select placeholder="Chọn cơ sở">
                {services.map(service => (
                  service.facility && ( // Kiểm tra xem có thông tin về cơ sở không
                    <Option key={service.facility.id} value={service.facility.id}>
                      {service.facility.facility_name}
                    </Option>
                  )
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Tên dịch vụ" name="name" rules={[{ required: true, message: "Please enter a name." }]}>
              <Input />
            </Form.Item>

            <Form.Item
              label="Giá tiền"
              name="price"
              rules={[
                {
                  required: true,
                  message: 'Please enter a price.',
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
              rules={[{ required: true, message: "Please enter a description." }]}
            >
              <Input.TextArea />
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
      >
        <Title style={{ fontSize: 20 }}>Bạn có muốn xóa dịch vụ này?</Title>
      </Modal>
    </PageTemplate>
  );
}

export default Service;
