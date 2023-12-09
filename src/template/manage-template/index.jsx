import { Button, Input, Row, Table } from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";

function ManageTemplate(props) {
  const { title, callbackAdd, columns, dataSource, searchText } = props;
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState(dataSource);
  const isYeuCauTitle = title === "yêu cầu";
  const isBenhNhanTitle = title === "Bệnh nhân";

  useEffect(() => {
    setData(
      dataSource?.filter((item) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [searchValue]);

  useEffect(() => {
    setData(dataSource);
  }, [dataSource]);

  return (
    <div className="manage-template">
      <Title>Quản lý {title}</Title>
      <div style={{display: "flex", width:"100%", justifyContent:"flex-end"}}>
      {searchText && (
        <Input
        style={{width:"30%", height:"40px", marginRight:"61%"}}
          placeholder={searchText}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
        />
      )}
      <Row style={{ marginBottom: 20 }}>
        {isBenhNhanTitle || isYeuCauTitle ? null : (
          <Button size="large"  onClick={callbackAdd} type="primary">
            Thêm {title}
          </Button>
        )}
      </Row>
      </div>
      
      <Table dataSource={data} columns={columns} />
    </div>
  );
}

export default ManageTemplate;

