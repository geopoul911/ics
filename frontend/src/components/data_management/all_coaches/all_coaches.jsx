// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import AddCoachModal from "../../modals/create/add_coach_modal";

// Modules / Functions
import { Card, ListGroup } from "react-bootstrap";
import { Button, Grid, Input } from "semantic-ui-react";
import ReactPaginate from "react-paginate";

import axios from "axios";
import filterFactory, {
  textFilter,
  selectFilter,
} from "react-bootstrap-table2-filter";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Swal from "sweetalert2";

// CSS
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Icons / Images
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
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

const GET_COACHES = "http://localhost:8000/api/data_management/all_coaches/";

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

const notesFilterOptions = {
  true: "Has notes",
  false: "Does not have notes",
};

const emissionFilterOptions = {
  "Euro 3": "Euro 3",
  "Euro 4": "Euro 4",
  "Euro 5": "Euro 5",
  "Euro 6": "Euro 6",
  "Euro 7": "Euro 7",
  "N/A": "N/A",
};

const columns = [
  {
    dataField: "id",
    text: "ID",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "make",
    text: "Make",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <>
        <a
          href={"/data_management/coach/" + row.id}
          basic
          id="cell_link"
          className={row.enabled ? "" : "cnclled"}
        >
          {row.make}
        </a>
      </>
    ),
  },
  {
    dataField: "body_number",
    text: "Body Number",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "plate_number",
    text: "Plate Number",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "passenger_seats",
    text: "Passenger Seats",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "emission_stds",
    text: "Emission stds",
    sort: true,
    filter: selectFilter({
      options: emissionFilterOptions,
    }),
  },
  {
    dataField: "year",
    text: "Year",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "notes",
    text: "Notes",
    sort: true,
    filter: selectFilter({
      options: notesFilterOptions,
    }),
    formatter: (cell, row) => (
      <>
        {row.notes ? (
          <TiTick style={tick_style} />
        ) : (
          <ImCross style={cross_style} />
        )}
      </>
    ),
  },
  {
    dataField: "coach_operator",
    text: "Coach Operator",
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

// url path = '/all_coaches'
class AllCoaches extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_coaches: [],
      is_loaded: false,
      selectedView: "table",
      selectedName: null,
      currentPage: 1,
      coachesPerPage: 10,
      searchValue: "",
      totalFilteredCoaches: 0,
      lastClickTime: 0,
      forbidden: false,
    };
  }

  fetchCoaches() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    axios
      .get(GET_COACHES, {
        headers: headers,
      })
      .then((res) => {
        const allCoaches = res.data.all_coaches;
        const filteredCoaches = allCoaches.filter((coach) =>
          coach.make
            .toLowerCase()
            .includes(this.state.searchValue.toLowerCase())
        );
        this.setState({
          all_coaches: allCoaches,
          totalFilteredCoaches: filteredCoaches.length,
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
    this.fetchCoaches();
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
      this.fetchCoaches();
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

  handleDoubleTap = (coach_id) => {
    const { lastClickTime } = this.state;
    const currentTime = new Date().getTime();
    const tapTimeDifference = currentTime - lastClickTime;

    if (tapTimeDifference < 300) {
      window.location.href = "/data_management/coach/" + coach_id;
    }

    this.setState({ lastClickTime: currentTime });
  };

  render() {
    const { all_coaches, currentPage, searchValue, totalFilteredCoaches } =
      this.state;

    // Filter the all_coaches array based on the search term
    const filteredCoaches = all_coaches.filter((coach) =>
      coach.make.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Calculate the index range of coaches for the current page from the filtered array
    const indexOfLastCoach = currentPage * this.state.coachesPerPage;
    const indexOfFirstCoach = indexOfLastCoach - this.state.coachesPerPage;
    const currentCoaches = filteredCoaches.slice(
      indexOfFirstCoach,
      indexOfLastCoach
    );

    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("all_coaches")}
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
            <>{forbidden("All Coaches")}</>
          ) : this.state.is_loaded ? (
            this.state.selectedView === "table" ? (
              <>
                <ToolkitProvider
                  keyField="id"
                  data={this.state.all_coaches}
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
                <AddCoachModal redir={true} />
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
                      {currentCoaches.map((coach) => (
                        <>
                          <Button
                            color={this.state.selectedName === coach.make ? "blue" : "vk"}
                            onClick={(e) => { this.setSelectedName(e.target.innerText); this.handleDoubleTap(coach.id);}}
                            style={{ width: 300, margin: 10 }}
                          >
                            {coach.make}
                          </Button>
                          <br />
                        </>
                      ))}
                    </Grid.Column>
                    <Grid.Column width={6}>
                      {this.state.all_coaches.filter((coach) => coach.make === this.state.selectedName)
                        .map((coach) => (
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
                                Coach Information
                              </Card.Header>
                              <Card.Body>
                                <ListGroup>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>ID</div>
                                    <div className={"info_span"}>
                                      {coach.id}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Make</div>
                                    <div className={"info_span"}>
                                      <a
                                        href={"/data_management/coach/" + coach.id}
                                        basic
                                        id="cell_link"
                                        className={coach.enabled ? "" : "cnclled"}
                                      >
                                        {coach.make}
                                      </a>
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>
                                      Body Number
                                    </div>
                                    <div className={"info_span"}>
                                      {coach.body_number}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>
                                      Plate Number
                                    </div>
                                    <div className={"info_span"}>
                                      {coach.plate_number}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>
                                      Passenger Seats
                                    </div>
                                    <div className={"info_span"}>
                                      {coach.passenger_seats}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Year</div>
                                    <div className={"info_span"}>
                                      {coach.year}
                                    </div>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                    <div className={"info_descr"}>
                                      Coach Operator
                                    </div>
                                    <div className={"info_span"}>
                                      {coach.coach_operator}
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
                    totalFilteredCoaches / this.state.coachesPerPage
                  )}
                  marginPagesDisplayed={0}
                  pageRangeDisplayed={5}
                  onPageChange={this.handlePageChange}
                  containerClassName={"pagination"}
                  subContainerClassName={"pages react-pagination"}
                  activeClassName={"active"}
                />
                <AddCoachModal redir={true} />
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

export default AllCoaches;
