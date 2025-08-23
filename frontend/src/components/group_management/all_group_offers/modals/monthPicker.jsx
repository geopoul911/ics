import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const MonthPicker = (props) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [activePicker, setActivePicker] = useState(null);

  const handleMonthChange = (newDate) => {
    if (activePicker === "start") {
      if (newDate > endDate) {
        setEndDate(newDate); // Adjust the end date to match the new start date
      }
      setStartDate(newDate);
      props.onMonthRangeChange &&
        props.onMonthRangeChange({ startDate: newDate, endDate });
    } else if (activePicker === "end") {
      if (newDate < startDate) {
        setStartDate(newDate); // Adjust the start date to match the new end date
      }
      setEndDate(newDate);
      props.onMonthRangeChange &&
        props.onMonthRangeChange({ startDate, endDate: newDate });
    }
    setActivePicker(null);
  };

  const toggleCalendar = (picker) => {
    setActivePicker(picker);
  };

  const tileDisabled = ({ date, view }) => {
    if (activePicker === "end" && view === "year") {
      return date < startDate;
    }
    return false;
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "10px" }}>
        <div
          onClick={() => toggleCalendar("start")}
          style={{
            flex: 1,
            border: `1px solid ${
              activePicker === "start" ? "#3385ff" : "#ccc"
            }`,
            padding: "10px",
            cursor: "pointer",
            boxShadow:
              activePicker === "start"
                ? "0 0 5px rgba(81, 203, 238, 1)"
                : "none",
            borderRadius: 4,
          }}
        >
          From:
          {`${startDate.toLocaleString("default", {
            month: "long",
          })} ${startDate.getFullYear()}`}
        </div>

        <div
          onClick={() => toggleCalendar("end")}
          style={{
            flex: 1,
            border: `1px solid ${activePicker === "end" ? "#3385ff" : "#ccc"}`,
            padding: "10px",
            cursor: "pointer",
            boxShadow:
              activePicker === "end" ? "0 0 5px rgba(81, 203, 238, 1)" : "none",
            borderRadius: 4,
          }}
        >
          To:
          {`${endDate.toLocaleString("default", {
            month: "long",
          })} ${endDate.getFullYear()}`}
        </div>
      </div>

      {(activePicker === "start" || activePicker === "end") && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          <Calendar
            onChange={handleMonthChange}
            value={activePicker === "start" ? startDate : endDate}
            view="year"
            onClickMonth={handleMonthChange}
            tileDisabled={tileDisabled}
          />
        </div>
      )}
    </div>
  );
};

export default MonthPicker;
