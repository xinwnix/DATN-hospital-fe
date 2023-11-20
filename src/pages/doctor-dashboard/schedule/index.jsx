import React, { useEffect, useState } from "react";
import PageTemplate from "../../../template/page-template";
import { Badge, Calendar, Tooltip } from "antd";
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

  //   const getListData = (value) => {
  //     console.log(value);
  //     let listData;
  //     switch (value.date()) {
  //       case 8:
  //         listData = [
  //           { type: "warning", content: "This is warning event." },
  //           { type: "success", content: "This is usual event." },
  //         ];
  //         break;
  //       case 10:
  //         listData = [
  //           { type: "warning", content: "This is warning event." },
  //           { type: "success", content: "This is usual event." },
  //           { type: "error", content: "This is error event." },
  //         ];
  //         break;
  //       case 15:
  //         listData = [
  //           { type: "warning", content: "This is warning event" },
  //           { type: "success", content: "This is very long usual event。。...." },
  //           { type: "error", content: "This is error event 1." },
  //           { type: "error", content: "This is error event 2." },
  //           { type: "error", content: "This is error event 3." },
  //           { type: "error", content: "This is error event 4." },
  //         ];
  //         break;
  //       default:
  //     }
  //     return listData || [];
  //   };

  const getService = (results) => {
    const services = [];
    results?.forEach((result, index) => {
      services.push(result.service.name);
    });
    return services.join(", ");
  };

  const getListData = (value) => {
    const eventsForDate = schedule.filter((event) => {
      return value.date() === dayjs(event.testDate).date();
    });

    const listData = eventsForDate.map((event) => {
      console.log(event);
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
  return (
    <PageTemplate>
      <Calendar cellRender={cellRender} />
    </PageTemplate>
  );
}

export default Schedule;
