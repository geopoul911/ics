// Built-ins
import React from "react";

// Modules / Functions
import ReactApexChart from "react-apexcharts";

class ApexChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      series: [{ data: props.bar_dates }],
      options: {
        chart: { type: "bar" },
        plotOptions: { bar: { borderRadius: 4, horizontal: true } },
        dataLabels: { enabled: false },
        xaxis: { categories: props.bar_groups },
      },
    };
  }

  render() {
    return (
      <div id="group_stats_chart">
        <label> Active Groups Bar Graph </label>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="line"
          height="300"
        />
      </div>
    );
  }
}

export default ApexChart;
