// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import NoDataToShowImage from "../../../images/generic/no_results_found.png";
import ReactCountryFlag from "react-country-flag";
import AddRailwayStationModal from "../../modals/create/add_railway_station_modal";

// Modules / Functions
import { Card, ListGroup } from "react-bootstrap";
import { Button, Grid, Input } from "semantic-ui-react";
import ReactPaginate from "react-paginate";

import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import filterFactory, {
  textFilter,
  selectFilter,
} from "react-bootstrap-table2-filter";
import Swal from "sweetalert2";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

// CSS
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Icons / Modules
import { TiTick } from "react-icons/ti";
import { BsTable, BsTablet, BsInfoSquare } from "react-icons/bs";
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

const rowStyle = (row) => {
  const style = {};
  if (row.enabled === false) {
    style.color = "red";
  }
  return style;
};

let cross_style = {
  color: "red",
  fontSize: "1em",
};

let tick_style = {
  color: "green",
  fontSize: "1.4em",
};

const GET_RAILWAY_STATIONS =
  "http://localhost:8000/api/data_management/all_railway_stations/";

const enabledFilterOptions = {
  true: "Yes",
  false: "No",
};

const columns = [
  {
    dataField: "id",
    text: "ID",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "name",
    text: "Name",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <>
        <a
          href={"/data_management/railway_station/" + row.id}
          basic
          id="cell_link"
          className={row.enabled ? "" : "cnclled"}
        >
          {row.name}
        </a>
      </>
    ),
  },
  {
    dataField: "code",
    text: "Code",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "nationality",
    text: "Nationality",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row, rowIndex, extraData) => (
      <>
        {row.nationality_code !== "N/A" ? (
          <>
            <ReactCountryFlag
              countryCode={row.nationality_code}
              svg
              style={{ width: "2em", height: "2em", marginRight: 10 }}
              title={row.nationality.code}
            />
            {row.nationality !== "N/A" ? row.nationality.name : "N/A"}
            {row.nationality}
          </>
        ) : (
          "N/A"
        )}
      </>
    ),
  },
  {
    dataField: "enabled",
    text: "Enabled",
    sort: true,
    filter: selectFilter({
      options: enabledFilterOptions,
    }),
    formatter: (cell, row) => (
      <>
        {row.enabled ? (
          <TiTick style={tick_style} />
        ) : (
          <ImCross style={cross_style} />
        )}
      </>
    ),
  },
];

const defaultSorted = [
  {
    dataField: "id",
    order: "desc",
  },
];

const NoDataToShow = () => {
  return <img src={NoDataToShowImage} alt={""} className="fill" />;
};

// url path = '/all_railway_stations'
class AllRailwayStations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_railway_stations: [],
      is_loaded: false,
      selectedView: "table",
      selectedName: null,
      currentPage: 1,
      railway_stationsPerPage: 10,
      searchValue: "",
      totalFilteredRailwayStations: 0,
      lastClickTime: 0,
      forbidden: false,
    };
  }

  fetchRailwayStations() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    axios
      .get(GET_RAILWAY_STATIONS, {
        headers: headers,
      })
      .then((res) => {
        const allRailwayStations = res.data.all_railway_stations;
        const filteredRailwayStations = allRailwayStations.filter(
          (railway_station) =>
            railway_station.name
              .toLowerCase()
              .includes(this.state.searchValue.toLowerCase())
        );
        this.setState({
          all_railway_stations: allRailwayStations,
          totalFilteredRailwayStations: filteredRailwayStations.length,
          is_loaded: true,
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

  componentDidMount() {
    this.fetchRailwayStations();
    if (window.innerWidth < 992) {
      this.setState({
        selectedView: "tablet",
      });
    } else {
      this.setState({
        selectedView: "table",
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchValue !== this.state.searchValue) {
      this.fetchRailwayStations();
    }
  }

  setView = (view) => {
    this.setState({
      selectedView: view,
    });
  };

  handlePageChange = (selectedPage) => {
    this.setState({
      currentPage: selectedPage.selected + 1,
    });
  };

  setSelectedName = (name) => {
    this.setState({
      selectedName: name,
    });
  };

  handleDoubleTap = (railway_station_id) => {
    const { lastClickTime } = this.state;
    const currentTime = new Date().getTime();
    const tapTimeDifference = currentTime - lastClickTime;

    if (tapTimeDifference < 300) {
      window.location.href =
        "/data_management/railway_station/" + railway_station_id;
    }

    this.setState({ lastClickTime: currentTime });
  };

  render() {
    const {
      all_railway_stations,
      currentPage,
      searchValue,
      totalFilteredRailwayStations,
    } = this.state;

    // Filter the all_railway_stations array based on the search term
    const filteredRailwayStations = all_railway_stations.filter(
      (railway_station) =>
        railway_station.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Calculate the index range of railway_stations for the current page from the filtered array
    const indexOfLastRailwayStation =
      currentPage * this.state.railway_stationsPerPage;
    const indexOfFirstRailwayStation =
      indexOfLastRailwayStation - this.state.railway_stationsPerPage;
    const currentRailwayStations = filteredRailwayStations.slice(
      indexOfFirstRailwayStation,
      indexOfLastRailwayStation
    );

    return (
      <>
        <NavigationBar />

        <div className="mainContainer">
          {pageHeader("all_railway_stations")}
          <div className='container'>
            <h3 className='dox_h3'>Autocomplete Searching: </h3>
            <Autocomplete
              options={this.state.all_railway_stations.map((railway_station) => railway_station.id + ") " + railway_station.name)}
              className={"select_airport"}
              style={{ width: 300 }}
              filterOptions={(options, { inputValue }) => {
                const lowercasedInput = inputValue.toLowerCase();
                const words = lowercasedInput.split(' '); // Split input into words
                return options.filter(option => {
                  const lowercasedOption = option.toLowerCase();
                  return words.every(word => lowercasedOption.includes(word));
                });
              }}
              onChange={(event, value) => {
                window.open("/data_management/railway_station/" + value.split(") ")[0], '_blank');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Railway Station"
                  variant="outlined"
                />
              )}
            />
          </div>
          <div style={{ marginLeft: 20, width: 80, borderRadius: 10 }}>
            <Button
              id="table_icon"
              style={{
                padding: 6,
                margin: 2,
                backgroundColor:
                  this.state.selectedView === "table" ? "#e3e3e3" : "",
              }}
              onClick={() => this.setView("table")}
            >
              <BsTable
                style={{
                  color: "#F3702D",
                  fontSize: "1.5em",
                }}
              />
            </Button>
            <Button
              id="tablet_icon"
              style={{
                padding: 6,
                margin: 2,
                backgroundColor:
                  this.state.selectedView === "tablet" ? "#e3e3e3" : "",
              }}
              onClick={() => this.setView("tablet")}
            >
              <BsTablet
                style={{
                  color: "#F3702D",
                  fontSize: "1.5em",
                }}
              />
            </Button>
          </div>

          {this.state.forbidden ? (
            <>{forbidden("All Railway Stations")}</>
          ) : this.state.is_loaded ? (
            this.state.selectedView === "table" ? (
              <>
                <ToolkitProvider
                  keyField="id"
                  data={this.state.all_railway_stations}
                  columns={columns}
                  search
                  noDataIndication={<NoDataToShow />}
                  bootstrap4
                  condensed
                  defaultSorted={defaultSorted}
                  exportCSV
                >
                  {(props) => (
                    <div>
                      <BootstrapTable
                        {...props.baseProps}
                        id="all_railway_stations_table"
                        pagination={paginationFactory(paginationOptions)}
                        hover
                        bordered={false}
                        striped
                        rowStyle={rowStyle}
                        filter={filterFactory()}
                      />
                    </div>
                  )}
                </ToolkitProvider>
                <AddRailwayStationModal redir={true} />
              </>
            ) : (
              <>
                <div style={{ marginLeft: 20 }}>
                  <Input
                    icon="search"
                    placeholder="Search Name..."
                    style={{ margin: 0 }}
                    onChange={(e) =>
                      this.setState({ searchValue: e.target.value })
                    }
                    value={this.state.searchValue}
                  />
                </div>
                <Grid columns={2} stackable style={{ marginLeft: 20 }}>
                  <Grid.Row>
                    <Grid.Column width={6}>
                      {currentRailwayStations.map((railway_station) => (
                        <>
                          <Button
                            color={
                              this.state.selectedName === railway_station.name
                                ? "blue"
                                : "vk"
                            }
                            onClick={(e) => {
                              this.setSelectedName(e.target.innerText);
                              this.handleDoubleTap(railway_station.id);
                            }}
                            style={{ width: 300, margin: 10 }}
                          >
                            {railway_station.name}
                          </Button>
                          <br />
                        </>
                      ))}
                    </Grid.Column>
                    <Grid.Column width={6}>
                      {this.state.all_railway_stations
                        .filter(
                          (railway_station) =>
                            railway_station.name === this.state.selectedName
                        )
                        .map((railway_station) => (
                          <>
                            <Card width={4}>
                              <Card.Header>
                                <BsInfoSquare
                                  style={{
                                    color: "#F3702D",
                                    fontSize: "1.5em",
                                    marginRight: "0.5em",
                                  }}
                                />
                                Railway Station Information
                              </Card.Header>
                              <Card.Body>
                                <ListGroup>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>ID</div>
                                    <div className={"info_span"}>
                                      {railway_station.id}
                                    </div>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Name</div>
                                    <div
                                      className={
                                        railway_station.enabled
                                          ? "info_span"
                                          : "red_info_span"
                                      }
                                    >
                                      <a
                                        href={
                                          "/data_management/railway_station/" +
                                          railway_station.id
                                        }
                                        basic
                                        id="cell_link"
                                        className={
                                          railway_station.enabled
                                            ? ""
                                            : "cnclled"
                                        }
                                      >
                                        {railway_station.name}
                                      </a>
                                    </div>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Code</div>
                                    <div className={"info_span"}>
                                      {railway_station.code}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>
                                      Lat / Lng
                                    </div>
                                    <div className={"info_span"}>
                                      {railway_station.lat_lng}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>
                                      Nationality
                                    </div>
                                    <div className={"info_span"}>
                                      {railway_station.nationality_code !==
                                      "N/A" ? (
                                        <>
                                          <ReactCountryFlag
                                            countryCode={
                                              railway_station.nationality_code
                                            }
                                            svg
                                            style={{
                                              width: "2em",
                                              height: "2em",
                                              marginRight: 10,
                                            }}
                                            title={
                                              railway_station.nationality.code
                                            }
                                          />
                                          {railway_station.nationality !== "N/A"
                                            ? railway_station.nationality.name
                                            : "N/A"}
                                          {railway_station.nationality}
                                        </>
                                      ) : (
                                        "N/A"
                                      )}
                                    </div>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Enabled</div>
                                    <div className={"info_span"}>
                                      {railway_station.enabled ? (
                                        <TiTick style={tick_style} />
                                      ) : (
                                        <ImCross style={cross_style} />
                                      )}
                                    </div>
                                  </ListGroup.Item>
                                </ListGroup>
                              </Card.Body>
                              <Card.Footer></Card.Footer>
                            </Card>
                          </>
                        ))}
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                <ReactPaginate
                  previousLabel={"<-"}
                  className="react-pagination"
                  nextLabel={"->"}
                  breakLabel={"..."}
                  breakClassName={"break-me"}
                  pageCount={Math.ceil(
                    totalFilteredRailwayStations /
                      this.state.railway_stationsPerPage
                  )}
                  marginPagesDisplayed={0}
                  pageRangeDisplayed={5}
                  onPageChange={this.handlePageChange}
                  containerClassName={"pagination"}
                  subContainerClassName={"pages react-pagination"}
                  activeClassName={"active"}
                />
                <AddRailwayStationModal redir={true} />
              </>
            )
          ) : (
            loader()
          )}
        </div>

        <Footer />
      </>
    );
  }
}

export default AllRailwayStations;
