// Built-ins
import React from "react";

// Functions / Modules
import ReactApexChart from "react-apexcharts";

class ApexChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      series: [
        {
          data: props.agent_values,
        },
      ],
      options: {
        chart: {
          type: "bar",
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: props.agent_names,
        },
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="bar"
          height="1000"
        />
      </div>
    );
  }
}

export default ApexChart;
