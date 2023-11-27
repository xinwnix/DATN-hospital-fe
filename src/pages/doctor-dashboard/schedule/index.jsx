import React, { useEffect, useState } from "react";
import PageTemplate from "../../../template/page-template";
import { Badge, Calendar, Tooltip, Modal } from "antd";
import dayjs, { Dayjs } from "dayjs";
import myAxios from "../../../config/config";
import useUserInformation from "../../../hooks/useUserInformation";
import { Link } from "react-router-dom";

function Schedule() {
  const [schedule, setSchedule] = useState([]);
  const { userInformation } = useUserInformation();

  useEffect(() => {
    const fetch = async () => {
      const response = await myAxios.get(`schedule/${userInformation?.id}`);
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
    const formattedValueDate = value.format("YYYY-MM-DD"); // Định dạng ngày của giá trị
    const eventsForDate = schedule.filter((event) => {
      const formattedEventDate = dayjs(event.testDate).format("YYYY-MM-DD"); // Định dạng ngày của sự kiện
      return formattedValueDate === formattedEventDate; // So sánh ngày đã định dạng
    });

    const listData = eventsForDate.map((event) => {
      return {
        type: "success",
        content: (
          <Tooltip title={getService(event.results)}>
            <Link to={`${event.id}`}>{event.patient.fullName}</Link>
          </Tooltip>
        ),
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
    setIsModalVisible(true);
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

    return (
      <div>
        <h3>Thông tin ngày {selectedDate.format("DD/MM/YYYY")}:</h3>
        <ul>
          {listData.map((item, index) => (
            <li key={index}>
              <Badge status={item.type} text={item.content} />
            </li>
          ))}
        </ul>
      </div>
    );
  };


  return (
    <PageTemplate>
      <Calendar cellRender={cellRender} onSelect={handleDateClick} />
      <Modal
        title={`Ngày ${selectedDate ? selectedDate.format("DD/MM/YYYY") : ""}`}
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
