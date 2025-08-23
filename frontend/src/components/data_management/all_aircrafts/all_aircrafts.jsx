// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import AddAircraftModal from "../../modals/create/add_aircraft_modal";

// Modules / Functions
import { Card, ListGroup } from "react-bootstrap";
import { Button, Grid, Input } from "semantic-ui-react";
import ReactPaginate from "react-paginate";

import axios from "axios";
import filterFactory, {
  textFilter,
} from "react-bootstrap-table2-filter";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Swal from "sweetalert2";

// CSS
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Icons / Images
import NoDataToShowImage from "../../../images/generic/no_results_found.png";
import { BsTable, BsTablet, BsInfoSquare } from "react-icons/bs";

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

const GET_AIRCRAFTS = "http://localhost:8000/api/data_management/all_aircrafts/";

const rowStyle = (row) => {
  const style = {};
  if (row.enabled === false) {
    style.color = "red";
  }
  return style;
};

const columns = [
  {
    dataField: "id",
    text: "ID",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "model",
    text: "Model",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <>
        <a
          href={"/data_management/aircraft/" + row.id}
          basic
          id="cell_link"
        >
          {row.model}
        </a>
      </>
    ),
  },
  {
    dataField: "year",
    text: "Year",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "charter_broker",
    text: "Charter Broker",
    sort: true,
    filter: textFilter(),
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

// url path = '/all_aircrafts'
class Allaircrafts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_aircrafts: [],
      is_loaded: false,
      selectedView: "table",
      selectedName: null,
      currentPage: 1,
      aircraftsPerPage: 10,
      searchValue: "",
      totalFilteredaircrafts: 0,
      lastClickTime: 0,
      forbidden: false,
    };
  }

  fetchaircrafts() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    axios
      .get(GET_AIRCRAFTS, {
        headers: headers,
      })
      .then((res) => {
        const allaircrafts = res.data.all_aircrafts;
        const filteredaircrafts = allaircrafts.filter((aircraft) =>
          aircraft.model
            .toLowerCase()
            .includes(this.state.searchValue.toLowerCase())
        );
        this.setState({
          all_aircrafts: allaircrafts,
          totalFilteredaircrafts: filteredaircrafts.length,
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
    this.fetchaircrafts();
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
      this.fetchaircrafts();
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

  handleDoubleTap = (aircraft_id) => {
    const { lastClickTime } = this.state;
    const currentTime = new Date().getTime();
    const tapTimeDifference = currentTime - lastClickTime;

    if (tapTimeDifference < 300) {
      window.location.href = "/data_management/aircraft/" + aircraft_id;
    }

    this.setState({ lastClickTime: currentTime });
  };

  render() {
    const { all_aircrafts, currentPage, searchValue, totalFilteredaircrafts } =
      this.state;

    // Filter the all_aircrafts array based on the search term
    const filteredaircrafts = all_aircrafts.filter((aircraft) =>
      aircraft.model.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Calculate the index range of aircrafts for the current page from the filtered array
    const indexOfLastAircraft = currentPage * this.state.aircraftsPerPage;
    const indexOfFirstAircraft = indexOfLastAircraft - this.state.aircraftsPerPage;
    const currentaircrafts = filteredaircrafts.slice(
      indexOfFirstAircraft,
      indexOfLastAircraft
    );

    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("all_aircrafts")}
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
              style={{ padding: 6, margin: 2, backgroundColor:   this.state.selectedView === "tablet" ? "#e3e3e3" : "",}}
              onClick={() => this.setView("tablet")}
            >
              <BsTablet style={{ color: "#F3702D", fontSize: "1.5em",}}/>
            </Button>
          </div>

          {this.state.forbidden ? (
            <>{forbidden("All aircrafts")}</>
          ) : this.state.is_loaded ? (
            this.state.selectedView === "table" ? (
              <>
                <ToolkitProvider
                  keyField="id"
                  data={this.state.all_aircrafts}
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
                <AddAircraftModal redir={true} />
              </>
            ) : (
              <>
                <div style={{ marginLeft: 20 }}>
                  <Input
                    icon="search"
                    placeholder="Search Name..."
                    style={{ margin: 0 }}
                    onChange={(e) => this.setState({ searchValue: e.target.value })}
                    value={this.state.searchValue}
                  />
                </div>
                <Grid columns={2} stackable style={{ marginLeft: 20 }}>
                  <Grid.Row>
                    <Grid.Column width={6}>
                      {currentaircrafts.map((aircraft) => (
                        <>
                          <Button
                            color={this.state.selectedName === aircraft.model ? "blue" : "vk"}
                            onClick={(e) => { this.setSelectedName(e.target.innerText); this.handleDoubleTap(aircraft.id);}}
                            style={{ width: 300, margin: 10 }}
                          >
                            {aircraft.model}
                          </Button>
                          <br />
                        </>
                      ))}
                    </Grid.Column>
                    <Grid.Column width={6}>
                      {this.state.all_aircrafts.filter((aircraft) => aircraft.model === this.state.selectedName)
                        .map((aircraft) => (
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
                                Aircraft Information
                              </Card.Header>
                              <Card.Body>
                                <ListGroup>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>ID</div>
                                    <div className={"info_span"}>
                                      {aircraft.id}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Model</div>
                                    <div className={"info_span"}>
                                      <a
                                        href={"/data_management/aircraft/" + aircraft.id}
                                        basic
                                        id="cell_link"
                                        className={aircraft.enabled ? "" : "cnclled"}
                                      >
                                        {aircraft.model}
                                      </a>
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>
                                      Body Number
                                    </div>
                                    <div className={"info_span"}>
                                      {aircraft.body_number}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>
                                      Plate Number
                                    </div>
                                    <div className={"info_span"}>
                                      {aircraft.plate_number}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>
                                      Passenger Seats
                                    </div>
                                    <div className={"info_span"}>
                                      {aircraft.passenger_seats}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Year</div>
                                    <div className={"info_span"}>
                                      {aircraft.year}
                                    </div>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                    <div className={"info_descr"}>
                                      Charter Broker
                                    </div>
                                    <div className={"info_span"}>
                                      {aircraft.charter_broker}
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
                    totalFilteredaircrafts / this.state.aircraftsPerPage
                  )}
                  marginPagesDisplayed={0}
                  pageRangeDisplayed={5}
                  onPageChange={this.handlePageChange}
                  containerClassName={"pagination"}
                  subContainerClassName={"pages react-pagination"}
                  activeClassName={"active"}
                />
                <AddAircraftModal redir={true} />
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

export default Allaircrafts;
