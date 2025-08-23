// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Modules / Functions
import axios from "axios";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import Swal from "sweetalert2";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Button } from "semantic-ui-react";

// CSS
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Icons / Images
import NoDataToShowImage from "../../../images/generic/no_results_found.png";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";

// Global Variables
import {
  paginationOptions,
  headers,
  loader,
  pageHeader,
  forbidden,
  restrictedUsers,
} from "../../global_vars";

// Variables
window.Swal = Swal;

const { SearchBar } = Search;

let cross_style = {
  color: "red",
  fontSize: "1em",
};

let tick_style = {
  color: "green",
  fontSize: "1.4em",
};

const NoDataToShow = () => {
  return <img src={NoDataToShowImage} alt={""} className="fill" />;
};

const defaultSorted = [
  {
    dataField: "id",
    order: "desc",
  },
];

const PENDING_GROUPS = "http://localhost:8000/api/groups/pending_groups/";

// Pending Groups page Class
// url path = '/pending_groups'
class PendingGroups extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups_data: {},
      days_timedelta: 30,
      showing: "All",
      data_columns: [
        {
          dataField: "id",
          text: "#",
          sort: true,
        },
        {
          dataField: "refcode",
          text: "Refcode",
          sort: true,
          formatter: (cell, row) => (
            <>
              <a
                href={"/group_management/group/" + row.refcode}
                basic
                className={row.status === "Cancelled" ? "cnclled" : "cnfrmed"}
                id="cell_link"
              >
                {row.refcode}
              </a>
            </>
          ),
        },
        {
          dataField: "all_hotels",
          text: "Hotels",
          sort: true,
          formatter: (cell, row) => (
            <>
              {row.all_hotels ? (
                <TiTick style={tick_style} />
              ) : (
                <ImCross style={cross_style} />
              )}
            </>
          ),
        },
        {
          dataField: "all_drivers",
          text: "Drivers",
          sort: true,
          formatter: (cell, row) => (
            <>
              {row.all_drivers ? (
                <TiTick style={tick_style} />
              ) : (
                <ImCross style={cross_style} />
              )}
            </>
          ),
        },
        {
          dataField: "all_coaches",
          text: "Coaches",
          sort: true,
          formatter: (cell, row) => (
            <>
              {row.all_coaches ? (
                <TiTick style={tick_style} />
              ) : (
                <ImCross style={cross_style} />
              )}
            </>
          ),
        },
        {
          dataField: "arrival",
          text: "Arrival",
          sort: true,
          formatter: (cell, row) => (
            <>
              {row.arrival ? (
                <TiTick style={tick_style} />
              ) : (
                <ImCross style={cross_style} />
              )}
            </>
          ),
        },
        {
          dataField: "departure",
          text: "Departure",
          sort: true,
          formatter: (cell, row) => (
            <>
              {row.departure ? (
                <TiTick style={tick_style} />
              ) : (
                <ImCross style={cross_style} />
              )}
            </>
          ),
        },
        {
          dataField: "pax",
          text: "PAX",
          sort: true,
          formatter: (cell, row) => (
            <>
              {row.pax ? (
                <TiTick style={tick_style} />
              ) : (
                <ImCross style={cross_style} />
              )}
            </>
          ),
        },
        {
          dataField: "leader",
          text: "Leader",
          sort: true,
          formatter: (cell, row) => (
            <>
              {row.all_leaders ? (
                <TiTick style={tick_style} />
              ) : (
                <ImCross style={cross_style} />
              )}
            </>
          ),
        },
      ],
    };
  }

  setShowing(office) {
    this.setState({
      showing: office,
    });
  }

  componentDidMount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    axios
      .get(PENDING_GROUPS, {
        headers: headers,
        params: {
          days_timedelta: this.state.days_timedelta,
        },
      })
      .then((res) => {
        this.setState({
          groups_data: res.data.groups_data,
          isLoaded: true,
        });
      })
      .catch((e) => {
        if (e.response.status === 401) {
          this.setState({
            forbidden: true,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An unknown error has occured.",
          });
        }
      });
  }

  handleShowUpcoming = (e) => {
    this.setState({
      days_timedelta: e.target.value,
    });
    axios
      .get(PENDING_GROUPS, {
        headers: headers,
        params: {
          days_timedelta: e.target.value,
        },
      })
      .then((res) => {
        this.setState({
          groups_data: res.data.groups_data,
          isLoaded: true,
        });
      })
      .catch((e) => {
        if (e.response.status === 401) {
          this.setState({
            forbidden: true,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An unknown error has occured.",
          });
        }
      });
  };

  render() {
    return (
      <div>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("pending")}
          {this.state.forbidden ? (
            <>{forbidden("Pending Groups")}</>
          ) : this.state.isLoaded ? (
            <>
              <div style={{ float: "left", margin: 10 }}>
                <Button
                  style={{ marginLeft: 30 }}
                  color={this.state.showing === "All" ? "green" : ""}
                  onClick={() => this.setShowing("All")}
                >
                  All
                </Button>
                <Button
                  color={this.state.showing === "COA" ? "green" : ""}
                  onClick={() => this.setShowing("COA")}
                >
                  COA
                </Button>
                <Button
                  color={this.state.showing === "COL" ? "green" : ""}
                  onClick={() => this.setShowing("COL")}
                >
                  COL
                </Button>
                Show Upcoming
                <input
                  type="number"
                  value={this.state.days_timedelta}
                  style={{ width: 60, marginLeft: 10, marginRight: 10 }}
                  onChange={this.handleShowUpcoming}
                />
                Days
              </div>
              <ToolkitProvider
                keyField="id"
                data={this.state.groups_data.filter((group) => {
                  if (this.state.showing === "All") {
                    return true;
                  } else {
                    return group.refcode.startsWith(this.state.showing);
                  }
                })}
                columns={this.state.data_columns}
                search
                noDataIndication={<NoDataToShow />}
                bootstrap4
                condensed
                defaultSorted={defaultSorted}
                exportCSV
              >
                {(props) => (
                  <div>
                    <SearchBar {...props.searchProps} />
                    <hr />
                    <div style={{ overflow: "x:auto" }}>
                      <BootstrapTable
                        {...props.baseProps}
                        id="pending_groups_table"
                        pagination={paginationFactory(paginationOptions)}
                        hover
                        bordered={false}
                        striped
                        responsive
                      />
                    </div>
                  </div>
                )}
              </ToolkitProvider>
            </>
          ) : (
            loader()
          )}
        </div>
        <Footer />
      </div>
    );
  }
}

export default PendingGroups;
