// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import AddCharterBrokerModal from "../../modals/create/add_charter_broker_modal";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

// Modules / Functions
import { Card, ListGroup } from "react-bootstrap";
import { Button, Grid, Input } from "semantic-ui-react";
import ReactPaginate from "react-paginate";
import ReactCountryFlag from "react-country-flag";

import axios from "axios";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Swal from "sweetalert2";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, {
  textFilter,
  selectFilter,
} from "react-bootstrap-table2-filter";

// CSS
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Icons / Images
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import { BsTable, BsTablet, BsInfoSquare } from "react-icons/bs";

// Custom Made Components
import NoDataToShowImage from "../../../images/generic/no_results_found.png";

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

const GET_CHARTER_BROKER_COMPANIES =
  "http://localhost:8000/api/data_management/all_charter_brokers/";

const rowStyle = (row) => {
  const style = {};
  if (row.enabled === false) {
    style.color = "red";
  }
  return style;
};

const enabledFilterOptions = {
  true: "Yes",
  false: "No",
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

// Columns variable including settings per column for the table
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
          href={"/data_management/charter_broker/" + row.id}
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

// url path = '/all_charter_brokers'
class AllCharterBrokers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_charter_brokers: [],
      is_loaded: false,
      selectedView: "table",
      selectedName: null,
      currentPage: 1,
      charter_brokersPerPage: 10,
      searchValue: "",
      totalFilteredCharterBrokers: 0,
      lastClickTime: 0,
      forbidden: false,
    };
  }

  fetchCharterBrokers() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    axios
      .get(GET_CHARTER_BROKER_COMPANIES, {
        headers: headers,
      })
      .then((res) => {
        const allCharterBrokers = res.data.all_charter_brokers;
        const filteredCharterBrokers = allCharterBrokers.filter(
          (charter_broker) =>
            charter_broker.name
              .toLowerCase()
              .includes(this.state.searchValue.toLowerCase())
        );
        this.setState({
          all_charter_brokers: allCharterBrokers,
          totalFilteredCharterBrokers: filteredCharterBrokers.length,
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
    this.fetchCharterBrokers();
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
      this.fetchCharterBrokers();
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

  handleDoubleTap = (charter_broker_id) => {
    const { lastClickTime } = this.state;
    const currentTime = new Date().getTime();
    const tapTimeDifference = currentTime - lastClickTime;

    if (tapTimeDifference < 300) {
      window.location.href =
        "/data_management/charter_broker/" + charter_broker_id;
    }

    this.setState({ lastClickTime: currentTime });
  };

  render() {
    const {
      all_charter_brokers,
      currentPage,
      searchValue,
      totalFilteredCharterBrokers,
    } = this.state;

    // Filter the all_charter_brokers array based on the search term
    const filteredCharterBrokers = all_charter_brokers.filter(
      (charter_broker) =>
        charter_broker.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Calculate the index range of charter_brokers for the current page from the filtered array
    const indexOfLastCharterBroker =
      currentPage * this.state.charter_brokersPerPage;
    const indexOfFirstCharterBroker =
      indexOfLastCharterBroker - this.state.charter_brokersPerPage;
    const currentCharterBrokers = filteredCharterBrokers.slice(
      indexOfFirstCharterBroker,
      indexOfLastCharterBroker
    );

    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("all_charter_brokers")}
          <div className='container'>
            <h3 className='dox_h3'>Autocomplete Searching: </h3>
            <Autocomplete
              options={this.state.all_charter_brokers.map((charter_broker) => charter_broker.id + ") " + charter_broker.name)}
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
                window.open("/data_management/charter_broker/" + value.split(") ")[0], '_blank');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Airline & Charter Broker"
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
            <>{forbidden("All Charter Airlines & Brokers")}</>
          ) : this.state.is_loaded ? (
            this.state.selectedView === "table" ? (
              <>
                <ToolkitProvider
                  keyField="id"
                  data={this.state.all_charter_brokers}
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
                <AddCharterBrokerModal redir={true} />
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
                      {currentCharterBrokers.map((charter_broker) => (
                        <>
                          <Button
                            color={
                              this.state.selectedName === charter_broker.name
                                ? "blue"
                                : "vk"
                            }
                            onClick={(e) => {
                              this.setSelectedName(e.target.innerText);
                              this.handleDoubleTap(charter_broker.id);
                            }}
                            style={{ width: 300, margin: 10 }}
                          >
                            {charter_broker.name}
                          </Button>
                          <br />
                        </>
                      ))}
                    </Grid.Column>
                    <Grid.Column width={6}>
                      {this.state.all_charter_brokers
                        .filter(
                          (charter_broker) =>
                            charter_broker.name === this.state.selectedName
                        )
                        .map((charter_broker) => (
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
                                Charter Airlines & Brokers Information
                              </Card.Header>
                              <Card.Body>
                                <ListGroup>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>ID</div>
                                    <div className={"info_span"}>
                                      {charter_broker.id}
                                    </div>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Name</div>
                                    <div
                                      className={
                                        charter_broker.enabled
                                          ? "info_span"
                                          : "red_info_span"
                                      }
                                    >
                                      <a
                                        href={
                                          "/data_management/charter_broker/" +
                                          charter_broker.id
                                        }
                                        basic
                                        id="cell_link"
                                        className={
                                          charter_broker.enabled
                                            ? ""
                                            : "cnclled"
                                        }
                                      >
                                        {charter_broker.name}
                                      </a>
                                    </div>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Address</div>
                                    <div className={"info_span"}>
                                      {charter_broker.address === "None" ? (
                                        "N/A"
                                      ) : (
                                        <>{charter_broker.address}</>
                                      )}
                                    </div>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                    <div className={"info_descr"}>
                                      Tel details
                                    </div>
                                    <div className={"info_span"}>
                                      {charter_broker.tel}
                                    </div>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Email</div>
                                    <div className={"info_span"}>
                                      {charter_broker.email === "None" &&
                                      charter_broker.email === "" ? (
                                        "N/A"
                                      ) : (
                                        <>{charter_broker.email}</>
                                      )}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>
                                      Lat / Lng
                                    </div>
                                    <div className={"info_span"}>
                                      {charter_broker.lat_lng}
                                    </div>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Enabled</div>
                                    <div className={"info_span"}>
                                      {charter_broker.enabled ? (
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
                    totalFilteredCharterBrokers /
                      this.state.charter_brokersPerPage
                  )}
                  marginPagesDisplayed={0}
                  pageRangeDisplayed={5}
                  onPageChange={this.handlePageChange}
                  containerClassName={"pagination"}
                  subContainerClassName={"pages react-pagination"}
                  activeClassName={"active"}
                />
                <AddCharterBrokerModal redir={true} />
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

export default AllCharterBrokers;
