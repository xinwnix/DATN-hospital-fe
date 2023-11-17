import { Button, Input, Row, Table } from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";

function ManageTemplate(props) {
  const { title, callbackAdd, columns, dataSource, searchText } = props;
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState(dataSource);

  useEffect(() => {
    setData(dataSource?.filter((item) => item.name.toLowerCase().includes(searchValue.toLowerCase())));
  }, [searchValue]);

  useEffect(() => {
    setData(dataSource);
  }, [dataSource]);

  return (
    <div className="manage-template">
      <Title>Quản lý {title}</Title>
      {searchText && (
        <Input
          placeholder={searchText}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
        />
      )}
      <Row style={{ justifyContent: "flex-end", marginBottom: 20 }}>
        <Button onClick={callbackAdd} type="primary">
          Thêm {title}
        </Button>
      </Row>
      <Table dataSource={data} columns={columns} />
    </div>
  );
}

export default ManageTemplate;
