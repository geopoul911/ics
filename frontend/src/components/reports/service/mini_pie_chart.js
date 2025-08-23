// Built-ins
import React, { useState } from "react";

// Modules / Functions
import { PieChart } from "react-minimal-pie-chart";

function MiniPieChart(props) {
  const [selected, setSelected] = useState();
  return (
    <PieChart
      style={{
        fontFamily:
          '"Nunito Sans", -apple-system, Helvetica, Arial, sans-serif',
        fontSize: "8px",
        maxHeight: 420,
      }}
      animate
      data={props.data}
      radius={44}
      segmentsStyle={{ transition: "stroke .3s", cursor: "pointer" }}
      segmentsShift={(index) => (index === selected ? 6 : 1)}
      onClick={(_, index) => {
        setSelected(index === selected ? undefined : index);
      }}
    />
  );
}

export default MiniPieChart;
