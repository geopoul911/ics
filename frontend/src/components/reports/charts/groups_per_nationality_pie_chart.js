// Built-ins
import React, { useState, useEffect } from "react";

// Modules / Functions
import { PieChart } from "react-minimal-pie-chart";

const colors = [
  "#426230",
  "#83AADF",
  "#E58247",
  "#6A598B",
  "#9A2CA0",
  "#475105",
  "#589508",
  "#E5CE09",
  "#7997FF",
  "#F4EC56",
  "#9BFF92",
  "#04096D",
  "#2BD876",
  "#B92E90",
  "#571BB5",
  "#E4E18D",
  "#F28698",
  "#B6C0D2",
  "#8BB1C5",
  "#BBC75B",
  "#6C3240",
  "#A2B052",
  "#029A78",
  "#D0ECE2",
  "#1ECFDD",
  "#6CBC1A",
  "#C926C2",
  "#A46D13",
  "#3509AB",
  "#E82A34",
  "#A247AD",
  "#4FE5F5",
  "#C9F042",
  "#43B772",
  "#773CAC",
  "#54778E",
  "#BCD334",
  "#53D6FD",
  "#4755AC",
  "#10EEB8",
  "#AB9C06",
  "#D88B3A",
  "#FAC681",
  "#3FC50D",
  "#555457",
  "#EC71E9",
  "#2F0A29",
  "#7B3F8D",
  "#E073FA",
  "#E66D70",
  "#02ADBB",
  "#0F74CE",
  "#587B11",
  "#57A49E",
  "#7D646D",
  "#2F3FBF",
  "#6E3CCF",
  "#E05716",
  "#97DA99",
  "#A90247",
  "#A4959C",
  "#7341A0",
  "#BFBA34",
  "#4D180B",
  "#602A7F",
  "#8F61E5",
  "#30B2DB",
  "#BCE3CE",
  "#D64AAC",
  "#AB8C96",
  "#CB085B",
  "#8001B2",
  "#623435",
  "#9DA403",
  "#FCC5D6",
  "#B46C10",
  "#63BF86",
  "#35588F",
  "#A0B3A0",
  "#780444",
  "#873299",
  "#D54B32",
  "#B756D3",
  "#244435",
  "#585FFF",
  "#468F62",
  "#33AFBC",
  "#7BDBD6",
  "#C2F643",
  "#0BD7F9",
  "#5D38A0",
  "#D0C84A",
  "#0CD020",
  "#738755",
  "#659758",
  "#CE22DB",
  "#D6AD19",
  "#BFBCB4",
  "#7852C9",
  "#A8EB38",
];

function transformData(inputData, colors) {
  const transformedData = Object.keys(inputData).map((key, index) => ({
    title: key,
    value: inputData[key],
    color: colors[index],
  }));

  return transformedData;
}

function GroupsPerNationalityPieChart(props) {
  const [selected, setSelected] = useState();
  const [pieChartColors, setPieChartColors] = useState(colors);

  useEffect(() => {
    setPieChartColors(colors);
  }, [props.data]);

  if (!props.data || Object.keys(props.data).length < 2) {
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
          height: 220,
        }}
        animate
        data={transformData(props.data, pieChartColors)}
        radius={44}
        segmentsStyle={{ transition: "stroke .3s", cursor: "pointer" }}
        segmentsShift={(index) => (index === selected ? 6 : 1)}
        onClick={(_, index) => {
          setSelected(index === selected ? undefined : index);
        }}
      />
      <hr />
      {transformData(props.data, pieChartColors).map((d) => (
        <>
          <span style={{ color: d.color }}>
            {d.title} : {d.value}
          </span>
        </>
      ))}
    </>
  );
}

export default GroupsPerNationalityPieChart;
