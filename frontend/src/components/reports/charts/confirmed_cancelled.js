// Built-ins
import React, { useState } from "react";

// Modules / Functions
import { PieChart } from "react-minimal-pie-chart";

function transformData(inputData) {
  const total = inputData.cancelled + inputData.confirmed;
  const transformedData = Object.keys(inputData).map((key) => ({
    title: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
    value: inputData[key],
    color: key === "cancelled" ? "red" : "green",
    percentage: total === 0 ? 0 : ((inputData[key] / total) * 100).toFixed(2),
  }));

  return transformedData;
}

function MiniPieChart(props) {
  const transformedData = transformData(props.data);

  const [selected, setSelected] = useState();

  if (props.data["confirmed"] === 0 && props.data["cancelled"] === 0) {
    // If there is no data, return a message
    return (
      <div style={{ minHeight: 260, textAlign: "center" }}>No Data to show</div>
    );
  }

  return (
    <>
      <PieChart
        style={{
          fontFamily:
            '"Nunito Sans", -apple-system, Helvetica, Arial, sans-serif',
          fontSize: "8px",
          maxHeight: 220,
        }}
        animate
        data={transformedData}
        radius={44}
        segmentsStyle={{ transition: "stroke .3s", cursor: "pointer" }}
        segmentsShift={(index) => (index === selected ? 6 : 1)}
        onClick={(_, index) => {
          setSelected(index === selected ? undefined : index);
        }}
      />
      <hr />
      <span style={{ color: "green" }}>
        Confirmed: {transformedData[1].percentage}% ({transformedData[1].value})
      </span>
      <br />
      <span style={{ color: "red" }}>
        Cancelled: {transformedData[0].percentage}% ({transformedData[0].value})
      </span>
    </>
  );
}

export default MiniPieChart;
