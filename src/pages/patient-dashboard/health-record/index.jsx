import React from 'react';
import { Table, Tag } from 'antd';
import { renderTag } from "../../../utils/label";
import PageTemplate from "../../../template/page-template";
const columns = [
  {
    title: 'Nhận xét',
    dataIndex: 'comment',
    key: 'comment',
    width: 200,
    render: (text) => <p>{text}</p>,
  },
  {
    title: 'Phân tích',
    dataIndex: 'value',
    key: 'value',
    width: 200,
  },
  {
    title: 'Mức độ',
    key: 'level',
    dataIndex: 'level',
    width: 100,
    filters: [
      { text: "Tốt", value: "GOOD" },
      { text: "Bình thường", value: "ALARM" },
      { text: "Yếu", value: "NORMAL" },
    ],
    render: (text) => {
      return renderTag(text);
    },
    render: (_, { level }) => (
      <>
        {level.map((level) => {
          let color = level.length > 5 ? 'geekblue' : 'green';
          if (level === 'Tốt') {
            color = 'green';
          }
          if (level === 'Bình thường') {
            color = 'orange';
          }
          if (level === 'Yếu') {
            color = 'red';
          }
          return (
            <Tag color={color} key={level}>
              {level.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: "Tên dịch vụ",
    dataIndex: "service",
    key: "serviceName",
    width: 200,
  },
];
const data = [
  {
    key: '1',
    comment: 'Mắt tốt chú ý đi khám định kỳ',
    value: 'Mắt tốt 10/10',
    level: ['Tốt'],
    service: 'Khám mắt'
  },
  {
    key: '2',
    comment: 'Chú ý hạn chế nhìn màn hình máy tính quá nhiều',
    value: 'Mắt 9/10',
    level: ['Bình thường'],
    service: 'Khám mắt'
  },
  {
    key: '3',
    comment: 'Chý ý uống thêm thực phẩm chức năng hỗ trợ mắt',
    value: 'Mắt phải cận nhẹ 2 độ, măt trái vừa loạn và có cận 2 độ',
    level: ['Yếu'],
    service: 'Khám mắt'
  },
];

const HealthRecord = () => {
  return (
    <PageTemplate>
      <Table columns={columns} dataSource={data}/>
    </PageTemplate>
  );
};
export default HealthRecord;
