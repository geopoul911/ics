// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Modules / Functions
import { Card, ListGroup } from "react-bootstrap";
import { Button, Grid, Input } from "semantic-ui-react";
import ReactPaginate from "react-paginate";
import AddCoachOperatorModal from "../../modals/create/add_coach_operator_modal";
import ReactCountryFlag from "react-country-flag";
import axios from "axios";
import filterFactory, {
  textFilter,
  selectFilter,
} from "react-bootstrap-table2-filter";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Swal from "sweetalert2";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

// CSS
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
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
  countryToCode,
} from "../../global_vars";

// Variables
window.Swal = Swal;

const GET_COACH_OPERATORS =
  "http://localhost:8000/api/data_management/all_coach_operators/";

let cross_style = {
  color: "red",
  fontSize: "1em",
};

let tick_style = {
  color: "green",
  fontSize: "1.4em",
};

const enabledFilterOptions = {
  true: "Yes",
  false: "No",
};

const tariffFilterOptions = {
  true: "Yes",
  false: "No",
}

const rowStyle = (row) => {
  const style = {};
  if (row.enabled === false) {
    style.color = "red";
  }
  return style;
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
          href={"/data_management/coach_operator/" + row.id}
          className={row.enabled ? "" : "cnclled"}
          basic
          id="cell_link"
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
        {row.tel ? 
          row.tel.split(" - ")[0] === "" ||
          row.tel.split(" - ")[0] === "None" ? (
            <>
              <strong>Tel : </strong> N/A
            </>
          ) : (
            <>
              <strong>Tel : </strong> {row.tel.split(" - ")[0]}
            </>
          )
          :
          'N/A'
        }
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
      <> {row.email === "None" ? "N/A" : <>{row.email}</>} </>
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
    dataField: "categories",
    text: "Categories",
    sort: true,
    filter: textFilter(),

    formatter: (cell, row) => (
      <>
        {row.categories ? (
          row.categories.split(', ').map((category, index) => (
            <span key={index}>
              • {category}
              <br />
            </span>
          ))
        ) : (
          'N/A'
        )}
    </>
    ),

  },

  {
    dataField: "place",
    text: "Place",
    sort: true,
    filter: textFilter(),
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
    {
    dataField: "tariff",
    text: "Tariffs",
    sort: true,
    filter: selectFilter({
      options: tariffFilterOptions,
    }),
    formatter: (cell, row) => (
      <>
        {row.tariff ? (
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

// url path = '/all_coach_operators'
class AllCoachOperators extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_coach_operators: [],
      is_loaded: false,
      selectedView: "table",
      selectedName: null,
      currentPage: 1,
      coach_operatorsPerPage: 10,
      searchValue: "",
      totalFilteredCoachOperators: 0,
      lastClickTime: 0,
      forbidden: false,
    };
  }

  async fetchCoachOperators() {
    try {
      if (restrictedUsers().includes(localStorage.getItem("user"))) {
        this.setState({
          forbidden: true,
        });
        return; // exit function if user is restricted
      }

      const res = await axios.get(GET_COACH_OPERATORS, {
        headers: headers,
      });

      const allCoachOperators = res.data.all_coach_operators;
      const filteredCoachOperators = allCoachOperators.filter(
        (coach_operator) =>
          coach_operator.name
            .toLowerCase()
            .includes(this.state.searchValue.toLowerCase())
      );

      this.setState({
        all_coach_operators: allCoachOperators,
        totalFilteredCoachOperators: filteredCoachOperators.length,
        is_loaded: true,
      });
    } catch (e) {
      if (e.response && e.response.status === 401) {
        this.setState({
          forbidden: true,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An unknown error has occurred.",
        });
      }
    }
  }

  componentDidMount() {
    this.fetchCoachOperators();
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
      this.fetchCoachOperators();
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

  handleDoubleTap = (coach_operator_id) => {
    const { lastClickTime } = this.state;
    const currentTime = new Date().getTime();
    const tapTimeDifference = currentTime - lastClickTime;

    if (tapTimeDifference < 300) {
      window.location.href =
        "/data_management/coach_operator/" + coach_operator_id;
    }

    this.setState({ lastClickTime: currentTime });
  };

  render() {
    const {
      all_coach_operators,
      currentPage,
      searchValue,
      totalFilteredCoachOperators,
    } = this.state;

    // Filter the all_coach_operators array based on the search term
    const filteredCoachOperators = all_coach_operators.filter(
      (coach_operator) =>
        coach_operator.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Calculate the index range of coach_operators for the current page from the filtered array
    const indexOfLastCoachOperator =
      currentPage * this.state.coach_operatorsPerPage;
    const indexOfFirstCoachOperator =
      indexOfLastCoachOperator - this.state.coach_operatorsPerPage;
    const currentCoachOperators = filteredCoachOperators.slice(
      indexOfFirstCoachOperator,
      indexOfLastCoachOperator
    );
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("all_coach_operators")}
          <div className='container'>
            <h3 className='dox_h3'>Autocomplete Searching: </h3>
            <Autocomplete
              options={this.state.all_coach_operators.map((coach_operator) => coach_operator.id + ") " + coach_operator.name)}
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
                window.open("/data_management/coach_operator/" + value.split(") ")[0], '_blank');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Coach Operator"
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
            <>{forbidden("All Coach Operators")}</>
          ) : this.state.is_loaded ? (
            this.state.selectedView === "table" ? (
              <>
                <ToolkitProvider
                  keyField="id"
                  data={this.state.all_coach_operators}
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
                        id="all_coach_operators_table"
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
                <AddCoachOperatorModal redir={true} />
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
                      {currentCoachOperators.map((coach_operator) => (
                        <>
                          <Button
                            color={this.state.selectedName === coach_operator.name ? "blue" : "vk"}
                            onClick={(e) => {
                              this.setSelectedName(e.target.innerText);
                              this.handleDoubleTap(coach_operator.id);
                            }}
                            style={{ width: 300, margin: 10 }}
                          >
                            {coach_operator.name}
                          </Button>
                          <br />
                        </>
                      ))}
                    </Grid.Column>
                    <Grid.Column width={6}>
                      {this.state.all_coach_operators
                        .filter((coach_operator) => coach_operator.name === this.state.selectedName)
                        .map((coach_operator) => (
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
                                Coach Operator Information
                              </Card.Header>
                              <Card.Body>
                                <ListGroup>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>ID</div>
                                    <div className={"info_span"}>
                                      {coach_operator.id}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Name</div>
                                    <div className={"info_span"}>
                                      <a
                                        href={"/data_management/coach_operator/" + coach_operator.id}
                                        className={ coach_operator.enabled ? "" : "cnclled"}
                                        basic
                                        id="cell_link"
                                      >
                                        {coach_operator.name}
                                      </a>
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>
                                      Tel Details
                                    </div>
                                    <div className={"info_span"}>
                                      {coach_operator.tel.split(" - ")[0] === "" || coach_operator.tel.split(" - ")[0] === "None" ? (
                                        <>
                                          <strong>Tel : </strong> N/A <br />
                                        </>
                                      ) : (
                                        <>
                                          <strong>Tel : </strong> {coach_operator.tel.split(" - ")[0]}<br />
                                        </>
                                      )}
                                      {coach_operator.tel.split(" - ")[1] === "" || coach_operator.tel.split(" - ")[1] === "None" ? (
                                        ""
                                      ) : (
                                        <>
                                          <strong>Tel2 : </strong>
                                          {coach_operator.tel.split(" - ")[1]}
                                          <br />
                                        </>
                                      )}
                                      {coach_operator.tel.split(" - ")[2] === "" || coach_operator.tel.split(" - ")[2] === "None" ? (
                                        ""
                                      ) : (
                                        <>
                                          <strong>Tel3 : </strong>
                                          {coach_operator.tel.split(" - ")[2]}
                                          <br />
                                        </>
                                      )}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Address</div>
                                    <div className={"info_span"}>
                                      {coach_operator.address}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Address</div>
                                    <div className={"info_span"}>
                                      {coach_operator.email === "None" && coach_operator.email === "" ? (
                                        "N/A"
                                      ) : (
                                        <>{coach_operator.email}</>
                                      )}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>
                                      Lat / Lng
                                    </div>
                                    <div className={"info_span"}>
                                      {coach_operator.lat_lng}
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
                  pageCount={Math.ceil(totalFilteredCoachOperators / this.state.coach_operatorsPerPage)}
                  marginPagesDisplayed={0}
                  pageRangeDisplayed={5}
                  onPageChange={this.handlePageChange}
                  containerClassName={"pagination"}
                  subContainerClassName={"pages react-pagination"}
                  activeClassName={"active"}
                />
                <AddCoachOperatorModal redir={true} />
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

export default AllCoachOperators;
