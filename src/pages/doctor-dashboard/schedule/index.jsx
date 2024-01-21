import React, { useEffect, useState } from "react";
import PageTemplate from "../../../template/page-template";
import { Badge, Calendar, Tooltip, Modal, Table, Row } from "antd";
import dayjs, { Dayjs } from "dayjs";
import myAxios from "../../../config/config";
import useUserInformation from "../../../hooks/useUserInformation";
import { Link } from "react-router-dom";
import 'moment/locale/vi';
import locale from 'antd/es/date-picker/locale/vi_VN';



function Schedule() {
  const [schedule, setSchedule] = useState([]);
  const { userInformation } = useUserInformation();
  const today = dayjs();
  

  useEffect(() => {
    const fetch = async () => {
      const response = await myAxios.get(`schedule/${userInformation?.id}`);
      console.log("schedule/${userInformation?.id}", response.data);
      setSchedule(response.data.data);
    };

    userInformation && fetch();
  }, []);


  const getService = (results) => {
    const services = [];
    results?.forEach((result, index) => {
      services.push(result.service.name);
    });
    return services.join(", ");
  };

  const getListData = (value) => {
    const formattedValueDate = value.format("YYYY-MM-DD");
    const eventsForDate = schedule.filter((event) => {
      const formattedEventDate = dayjs(event.testDate).format("YYYY-MM-DD");
      return formattedValueDate === formattedEventDate;
    });

    const listData = eventsForDate.map((event) => {
      return {
        type: "success",
        content: (
          <Tooltip title={getService(event.results)}>
            <Link to={`${event.id}`}>{event?.patient?.fullName || "-"}</Link>
          </Tooltip>
        ),
        patient: event?.patient,
        testDate: event.testDate
      };
    });

    return listData || [];
  };


  const getMonthData = (value) => {
    if (value.month() === 8) {
      return 1394;
    }
  };

  const monthCellRender = (value) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const dateCellRender = (value) => {
    if (value.isBefore(today, 'day')) {
      return null; 
    }
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const cellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };

  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleDateClick = (value) => {
    setSelectedDate(value);   
    const eventsForDate = getListData(value);
    if (eventsForDate.length > 0) {
      setIsModalVisible(true);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedDate(null);
  };
  const renderSelectedDateInfo = () => {
    if (!selectedDate) {
      return null;
    }

    const listData = getListData(selectedDate);

    const columns = [
      {
        title: "Stt",
        dataIndex: "stt",
        key: "stt",
        with: 10,
        align: "center",
        render: (text, record, index) => index + 1,
      },
      {
        title: 'Thời gian khám:',
        dataIndex: 'testDate',
        key: 'testDate',
        render: (testDate) => dayjs(testDate).format('HH:mm'),
      },
      {
        title: 'Tên bệnh nhân',
        dataIndex: 'patient',
        key: 'patient',
        render: (text, record) => (
          <Tooltip title={getService(record.patient.results)}>
            <Link to={`${record.patient.id -1}`}>{record.patient.fullName || "-"}</Link>
          </Tooltip>
        ),
        
      },
    ];

    return (
      <div>
        <h2 style={{marginBottom:"50px"}} >Thông tin ngày {selectedDate.format('DD/MM/YYYY')}:</h2>
        <Table 
        dataSource={listData} 
        columns={columns}
        pagination={false}
        style={{overflow: 'hidden'}}
         />
      </div>
    );
  };


  return (
    <PageTemplate >
      <Calendar locale={locale} cellRender={cellRender} onSelect={handleDateClick}  style={{overflow:"hidden", height:"82vh", marginTop:"-15px"}} />
      <Modal
        width={"50%"}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        {renderSelectedDateInfo()}
      </Modal>
    </PageTemplate>
  );
}

export default Schedule;
