import React, { useState } from "react";
import { PieChart } from "react-minimal-pie-chart";

function MiniPieChart(props) {
  const [selected, setSelected] = useState();
  const lineWidth = 60;

  return (
    <PieChart
      style={{
        fontFamily:
          '"Nunito Sans", -apple-system, Helvetica, Arial, sans-serif',
        fontSize: "8px",
      }}
      animate
      data={props.data}
      radius={44}
      lineWidth={60}
      segmentsStyle={{ transition: "stroke .3s", cursor: "pointer" }}
      segmentsShift={(index) => (index === selected ? 6 : 1)}
      label={({ dataEntry }) => Math.round(dataEntry.percentage) + "%"}
      labelPosition={100 - lineWidth / 2}
      labelStyle={{ fill: "#fff", opacity: 0.75, pointerEvents: "none" }}
      onClick={(_, index) => {
        setSelected(index === selected ? undefined : index);
      }}
    />
  );
}

export default MiniPieChart;
