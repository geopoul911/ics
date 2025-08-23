// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import ReactCountryFlag from "react-country-flag";
import Footer from "../../core/footer/footer";
import NoDataToShowImage from "../../../images/generic/no_results_found.png";
import filterFactory, {
  textFilter,
  selectFilter,
} from "react-bootstrap-table2-filter";
import AddTrainTicketAgencyModal from "../../modals/create/add_train_ticket_agency_modal";

// Modules / Functions
import { Card, ListGroup } from "react-bootstrap";
import { Button, Grid, Input } from "semantic-ui-react";
import ReactPaginate from "react-paginate";

import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Swal from "sweetalert2";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

// CSS
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Icons / Images
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import { BsTable, BsTablet, BsInfoSquare } from "react-icons/bs";

// Global Variables
import {
  paginationOptions,
  headers,
  loader,
  pageHeader,
  forbidden,
  restrictedUsers,
  countryToCode,
} from "../../global_vars";

// Variables
window.Swal = Swal;

const GET_TRAIN_TICKET_AGENCIES =
  "http://localhost:8000/api/data_management/all_train_ticket_agencies/";

const enabledFilterOptions = {
  true: "Yes",
  false: "No",
};

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

function formatLocation(location) {
  // Check if the input is undefined, null, or "N/A"
  if (location === undefined || location === null || location === "N/A") {
    return "Invalid location";
  }

  // Split the string by ' >>> ' and trim any leading/trailing spaces
  const parts = location.split(' >>> ').map(part => part.trim());

  // Check if we have at least two parts
  if (parts.length >= 2) {
    const country = parts[1]; // Second part is the country
    const city = parts[2] || ''; // Third part is the city, if available
    return city ? `${country} - ${city}` : country;
  }

  return "Invalid location";
}

function getCountry(location) {
  // Check if the input is undefined, null, or "N/A"
  if (location === undefined || location === null || location === "N/A") {
    return "Invalid location";
  }

  // Split the string by ' >>> ' and trim any leading/trailing spaces
  const parts = location.split(' >>> ').map(part => part.trim());

  // Check if we have at least two parts (continent and country)
  if (parts.length >= 2) {
    return parts[1]; // Return the second part, which is the country
  }

  return "Invalid location";
}

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
          href={"/data_management/train_ticket_agency/" + row.id}
          basic
          id="cell_link"
        >
          <div className={row.enabled ? "" : "cnclled"}>{row.name}</div>
        </a>
      </>
    ),
  },
  {
    dataField: "region",
    text: "Region",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <>
        {row.region ? 
          <>
          {getCountry(row.region) !== 'Invalid Location' ? 
            <ReactCountryFlag
              countryCode={countryToCode[getCountry(row.region)]}
              svg
              style={{ width: "2.3em", height: "2.3em", marginRight: 10 }}
              title={getCountry(row.region)}
            />
          :
          <>
          </>
          }
            {formatLocation(row.region)}
          </>
          :
          'N/A'
        }
      </>
    ),
  },
  {
    dataField: "tel",
    text: "Tel details",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <>
        {row.tel.split(" - ")[0] === "" ||
        row.tel.split(" - ")[0] === "None" ? (
          <>
            <strong>Tel : </strong> N/A
          </>
        ) : (
          <>
            <strong>Tel : </strong> {row.tel.split(" - ")[0]}
          </>
        )}
      </>
    ),
  },
  {
    dataField: "address",
    text: "Address",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "email",
    text: "Email",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <>{row.email === "None" ? "N/A" : <>{row.email}</>}</>
    ),
  },
  {
    dataField: "website",
    text: "Website",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <>
        {row.website && row.website !== "N/A" && row.website !== "None" ? (
          <a
            href={row.website}
            basic
            id="cell_link"
            className={row.enabled ? "" : "cnclled"}
          >
            {row.website}
          </a>
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

// url path = '/all_train_ticket_agencies'
class AllTrainTicketAgencies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_train_ticket_agencies: [],
      is_loaded: false,
      selectedView: "table",
      selectedName: null,
      currentPage: 1,
      train_ticket_agenciesPerPage: 10,
      searchValue: "",
      totalFilteredTrainTicketAgencies: 0,
      lastClickTime: 0,
      forbidden: false,
    };
  }

  fetchTrainTicketAgencies() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    axios
      .get(GET_TRAIN_TICKET_AGENCIES, {
        headers: headers,
      })
      .then((res) => {
        const allTrainTicketAgencies = res.data.all_train_ticket_agencies;
        const filteredTrainTicketAgencies = allTrainTicketAgencies.filter(
          (train_ticket_agency) =>
            train_ticket_agency.name
              .toLowerCase()
              .includes(this.state.searchValue.toLowerCase())
        );
        this.setState({
          all_train_ticket_agencies: allTrainTicketAgencies,
          totalFilteredTrainTicketAgencies: filteredTrainTicketAgencies.length,
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
    this.fetchTrainTicketAgencies();
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
      this.fetchTrainTicketAgencies();
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

  handleDoubleTap = (train_ticket_agency_id) => {
    const { lastClickTime } = this.state;
    const currentTime = new Date().getTime();
    const tapTimeDifference = currentTime - lastClickTime;

    if (tapTimeDifference < 300) {
      window.location.href =
        "/data_management/train_ticket_agency/" + train_ticket_agency_id;
    }

    this.setState({ lastClickTime: currentTime });
  };

  render() {
    const {
      all_train_ticket_agencies,
      currentPage,
      searchValue,
      totalFilteredTrainTicketAgencies,
    } = this.state;

    // Filter the all_train_ticket_agencies array based on the search term
    const filteredTrainTicketAgencies = all_train_ticket_agencies.filter(
      (train_ticket_agency) =>
        train_ticket_agency.name
          .toLowerCase()
          .includes(searchValue.toLowerCase())
    );

    // Calculate the index range of train_ticket_agencies for the current page from the filtered array
    const indexOfLastTrainTicketAgency =
      currentPage * this.state.train_ticket_agenciesPerPage;
    const indexOfFirstTrainTicketAgency =
      indexOfLastTrainTicketAgency - this.state.train_ticket_agenciesPerPage;
    const currentTrainTicketAgencies = filteredTrainTicketAgencies.slice(
      indexOfFirstTrainTicketAgency,
      indexOfLastTrainTicketAgency
    );

    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("all_train_ticket_agencies")}
          <div className='container'>
            <h3 className='dox_h3'>Autocomplete Searching: </h3>
            <Autocomplete
              options={this.state.all_train_ticket_agencies.map((train_ticket_agency) => train_ticket_agency.id + ") " + train_ticket_agency.name)}
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
                window.open("/data_management/train_ticket_agency/" + value.split(") ")[0], '_blank');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Train Ticket Agency"
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
            <>{forbidden("All Train Ticket Agencies")}</>
          ) : this.state.is_loaded ? (
            this.state.selectedView === "table" ? (
              <>
                <ToolkitProvider
                  keyField="id"
                  data={this.state.all_train_ticket_agencies}
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
                <AddTrainTicketAgencyModal redir={true} />
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
                      {currentTrainTicketAgencies.map((train_ticket_agency) => (
                        <>
                          <Button
                            color={
                              this.state.selectedName ===
                              train_ticket_agency.name
                                ? "blue"
                                : "vk"
                            }
                            onClick={(e) => {
                              this.setSelectedName(e.target.innerText);
                              this.handleDoubleTap(train_ticket_agency.id);
                            }}
                            style={{ width: 300, margin: 10 }}
                          >
                            {train_ticket_agency.name}
                          </Button>
                          <br />
                        </>
                      ))}
                    </Grid.Column>
                    <Grid.Column width={6}>
                      {this.state.all_train_ticket_agencies
                        .filter(
                          (train_ticket_agency) =>
                            train_ticket_agency.name === this.state.selectedName
                        )
                        .map((train_ticket_agency) => (
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
                                Train Ticket Agency Information
                              </Card.Header>
                              <Card.Body>
                                <ListGroup>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>ID</div>
                                    <div className={"info_span"}>
                                      {train_ticket_agency.id}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Name</div>
                                    <div
                                      className={
                                        train_ticket_agency.enabled
                                          ? "info_span"
                                          : "red_info_span"
                                      }
                                    >
                                      <a
                                        href={
                                          "/data_management/train_ticket_agency/" +
                                          train_ticket_agency.id
                                        }
                                        basic
                                        id="cell_link"
                                        className={
                                          train_ticket_agency.enabled
                                            ? ""
                                            : "cnclled"
                                        }
                                      >
                                        {train_ticket_agency.name}
                                      </a>
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Address</div>
                                    <div className={"info_span"}>
                                      {train_ticket_agency.address ===
                                      "None" ? (
                                        "N/A"
                                      ) : (
                                        <>{train_ticket_agency.address}</>
                                      )}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>
                                      Tel details
                                    </div>
                                    <div className={"info_span"}>
                                      {train_ticket_agency.tel}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Email</div>
                                    <div className={"info_span"}>
                                      {train_ticket_agency.email === "None" &&
                                      train_ticket_agency.email === "" ? (
                                        "N/A"
                                      ) : (
                                        <>{train_ticket_agency.email}</>
                                      )}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Enabled</div>
                                    <div className={"info_span"}>
                                      {train_ticket_agency.enabled ? (
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
                    totalFilteredTrainTicketAgencies /
                      this.state.train_ticket_agenciesPerPage
                  )}
                  marginPagesDisplayed={0}
                  pageRangeDisplayed={5}
                  onPageChange={this.handlePageChange}
                  containerClassName={"pagination"}
                  subContainerClassName={"pages react-pagination"}
                  activeClassName={"active"}
                />
                <AddTrainTicketAgencyModal redir={true} />
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

export default AllTrainTicketAgencies;
