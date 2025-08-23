import React from "react";
import ReactApexChart from "react-apexcharts";

class AgentsPerHotelBarChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          data: Object.values(this.props.data),
        },
      ],
      options: {
        chart: {
          type: "bar",
          height: 260,
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
          categories: Object.keys(this.props.data),
        },
      },
    };
  }

  componentDidUpdate(prevProps) {
    // Check if the data prop has changed
    if (prevProps.data !== this.props.data) {
      this.setState({
        series: [
          {
            data: Object.values(this.props.data),
          },
        ],
        options: {
          chart: {
            type: "bar",
            height: 260,
          },
          plotOptions: {
            bar: {
              borderRadius: 4,
              horizontal: true,
            },
          },
          dataLabels: {
            enabled: true,
          },
          xaxis: {
            categories: Object.keys(this.props.data),
          },
        },
      });
    }
  }

  render() {
    return (
      <div id="chart">
        {this.state.series[0].data.length === 0 ? (
          <div style={{ minHeight: 260, textAlign: "center" }}>
            No Data to show.
          </div>
        ) : (
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="bar"
            height={260}
          />
        )}
      </div>
    );
  }
}

export default AgentsPerHotelBarChart;
