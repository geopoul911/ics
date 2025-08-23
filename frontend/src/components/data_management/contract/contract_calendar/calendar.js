import React, { useState } from "react";
import { Button } from "semantic-ui-react";
import { parse, addDays, isBefore, isEqual, formatISO } from "date-fns";

function getOrdinalSuffix(Num) {
  if (Num === 11 || Num === 12 || Num === 13) {
    return "th";
  } else if (Num === 1) {
    return "st";
  } else if (Num === 2) {
    return "nd";
  } else if (Num === 3) {
    return "rd";
  } else {
    return "th";
  }
}

const Calendar = ({ year, month, contract }) => {
  const [currentMonth, setCurrentMonth] = useState(month);
  const [currentYear, setCurrentYear] = useState(year);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // the all rooms list sometimes is empty, now we return false, might be a bug
  const compareAndAddDays = (dateStr1, dateStr2, daysToAdd) => {
    if (!dateStr1 || !dateStr2) {
      return false; // One or both of the dateStr parameters are empty, return false
    }

    const date1 = parse(dateStr1, "yyyy-MM-dd", new Date());
    const date2 = parse(dateStr2, "yyyy-MM-dd", new Date());
    const modifiedDate = addDays(date1, daysToAdd);

    if (isEqual(modifiedDate, date2)) {
      return false;
    } else if (isBefore(modifiedDate, date2)) {
      return false;
    } else {
      return true;
    }
  };

  function areAllUnavailable(arr) {
    for (const obj of arr) {
      if (
        obj.hasOwnProperty("available") &&
        obj["available"] !== false &&
        obj.hasOwnProperty("enabled") &&
        obj["enabled"] !== false
      ) {
        return false;
      }
    }
    return true;
  }

  function isAtLeastOneAvailable(arr) {
    for (const obj of arr) {
      if (obj.hasOwnProperty("available") && obj["available"] === true) {
        return true;
      }
    }
    return false;
  }

  function areAllAvailable(arr) {
    for (const obj of arr) {
      if (
        (obj.hasOwnProperty("available") && obj["available"] !== true) ||
        (obj.hasOwnProperty("enabled") && obj["enabled"] !== true)
      ) {
        return false;
      }
    }
    return true;
  }

  const getClassName = (day, contract) => {
    const formattedDate = `${currentYear}-${(currentMonth + 1)
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    let allRooms = contract.room_contract.filter(
      (item) => item.date === formattedDate
    );

    if (
      compareAndAddDays(
        formatISO(new Date(), { representation: "date" }),
        formattedDate,
        contract.release_period
      )
    ) {
      return "release_date_passed";
    } else if (areAllUnavailable(allRooms) && allRooms.length > 0) {
      return "sold_out";
    } else if (areAllAvailable(allRooms) && allRooms.length > 0) {
      return "allocation_remaining";
    } else if (isAtLeastOneAvailable(allRooms) && allRooms.length > 0) {
      return "limited_availability";
    } else {
      return "no_allocation_remaining";
    }
  };

  // Function to get the number of days in the month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Function to get the first day of the month (0 - Sunday, 1 - Monday, etc.)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Function to get the month and year for the previous and next months
  const getAdjacentMonth = (year, month, offset) => {
    const d = new Date(year, month + offset, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  };

  const previousMonth = getAdjacentMonth(currentYear, currentMonth, -1);

  // Array to hold the days of the month
  const monthDays = [];

  // Push empty placeholders for the days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    monthDays.push(null);
  }

  // Push the actual days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    monthDays.push(day);
  }

  // Group days into rows for each week
  const weeksInMonth = [];
  let week = [];
  let day = 1;

  // Add the last week of the previous month
  const prevMonthDays = getDaysInMonth(previousMonth.year, previousMonth.month);

  for (let i = firstDay - 1; i >= 0; i--) {
    // const formattedDate = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${prevMonthDays - i.toString().padStart(2, '0')}`;
    // let allRooms = contract.room_contract.filter(item => item.date === formattedDate)

    week.push(
      <td key={`prev_${i}`} className="other-month">
        <div
          style={{
            marginTop: 10,
            padding: 0,
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          {prevMonthDays - i}
          {getOrdinalSuffix(prevMonthDays - i)}
        </div>
        <hr />
        <div style={{ textAlign: "left", minHeight: 70 }}></div>
      </td>
    );
  }

  function getTotalRooms(array, roomType) {
    return array.reduce(
      (total, item) => total + (item.room_type === roomType ? 1 : 0),
      0
    );
  }

  function getTotalAvailableRooms(array, roomType) {
    let totalAvailableSGLRooms = 0;
    for (const item of array) {
      if (item.room_type === roomType && item.available && item.enabled) {
        totalAvailableSGLRooms++;
      }
    }
    return totalAvailableSGLRooms;
  }

  while (day <= daysInMonth) {
    const formattedDate = `${currentYear}-${(currentMonth + 1)
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    let allRooms = contract.room_contract.filter(
      (item) => item.date === formattedDate
    );
    week.push(
      // BOX  Containing date and rooms.
      <td className={getClassName(day, contract)} key={`current_${day}`}>
        <div
          style={{
            marginTop: 10,
            padding: 0,
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          {day}
          {getOrdinalSuffix(day)}
          <hr />
        </div>
        <div style={{ textAlign: "left", minHeight: 70 }}>
          <ul>
            {allRooms.some((item) => item.room_type === "SGL") ? (
              <li>
                SGL: {getTotalAvailableRooms(allRooms, "SGL")} /
                {getTotalRooms(allRooms, "SGL")}
              </li>
            ) : (
              ""
            )}
            {allRooms.some((item) => item.room_type === "DBL") ? (
              <li>
                DBL: {getTotalAvailableRooms(allRooms, "DBL")} /
                {getTotalRooms(allRooms, "DBL")}
              </li>
            ) : (
              ""
            )}
            {allRooms.some((item) => item.room_type === "TWIN") ? (
              <li>
                Twin: {getTotalAvailableRooms(allRooms, "TWIN")} /
                {getTotalRooms(allRooms, "TWIN")}
              </li>
            ) : (
              ""
            )}
            {allRooms.some((item) => item.room_type === "TRPL") ? (
              <li>
                TRPL: {getTotalAvailableRooms(allRooms, "TRPL")} /
                {getTotalRooms(allRooms, "TRPL")}
              </li>
            ) : (
              ""
            )}
            {allRooms.some((item) => item.room_type === "QUAD") ? (
              <li>
                QUAD: {getTotalAvailableRooms(allRooms, "QUAD")} /
                {getTotalRooms(allRooms, "QUAD")}
              </li>
            ) : (
              ""
            )}
            {allRooms.length === 0 ? (
              <div style={{ textAlign: "center", marginTop: 10 }}>
                Day Has no Rooms
              </div>
            ) : (
              ""
            )}
          </ul>
        </div>
      </td>
    );

    if ((firstDay + day - 1) % 7 === 6 || day === daysInMonth) {
      // Check if we need to add days from the next month to complete the week
      if (week.length < 7) {
        const remainingDays = 7 - week.length;
        for (let i = 1; i <= remainingDays; i++) {
          week.push(
            <td key={`next_${i}`} className="other-month">
              <div
                style={{
                  marginTop: 10,
                  padding: 0,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                {i}
                {getOrdinalSuffix(i)}
              </div>
              <hr />
              <div style={{ textAlign: "left", minHeight: 70 }}></div>
            </td>
          );
        }
      }
      weeksInMonth.push(<tr key={`current_week_${day}`}>{week}</tr>);
      week = [];
    }
    day++;
  }

  return (
    <div id="calendar">
      <div className="calendar-header">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button color="blue" onClick={handlePrevMonth}>
            Previous Month
          </Button>
          <p
            style={{
              textAlign: "center",
              margin: "0",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            {new Date(currentYear, currentMonth).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </p>
          <Button color="blue" onClick={handleNextMonth}>
            Next Month
          </Button>
        </div>
      </div>
      <hr />
      <table id="table_calendar">
        <thead>
          <tr>
            {weekdays.map((weekday) => (
              <th key={weekday}>{weekday}</th>
            ))}
          </tr>
        </thead>
        <tbody>{weeksInMonth}</tbody>
      </table>
    </div>
  );
};

export default Calendar;
