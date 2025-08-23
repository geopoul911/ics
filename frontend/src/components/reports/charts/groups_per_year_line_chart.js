import React from "react";
import ReactApexChart from "react-apexcharts";

class GroupsPerYearLineChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      series: [
        {
          name: "Groups",
          data: Object.values(this.props.groups_per_year),
        },
      ],
      options: {
        chart: {
          type: "line",
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "straight",
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"],
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: Object.keys(this.props.groups_per_year),
        },
      },
    };
  }

  componentDidUpdate(prevProps) {
    // Check if the data prop has changed
    if (prevProps.groups_per_year !== this.props.groups_per_year) {
      this.setState({
        series: [
          {
            name: "Number Of Groups",
            data: Object.values(this.props.groups_per_year),
          },
        ],
        options: {
          chart: {
            type: "line",
            height: 260,
            zoom: {
              enabled: false,
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            curve: "straight",
          },
          grid: {
            row: {
              colors: ["#f3f3f3", "transparent"],
              opacity: 0.5,
            },
          },
          xaxis: {
            categories: Object.keys(this.props.groups_per_year),
          },
        },
      });
    }
  }

  render() {
    return (
      <div>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="line"
          height={260}
        />
      </div>
    );
  }
}

export default GroupsPerYearLineChart;
