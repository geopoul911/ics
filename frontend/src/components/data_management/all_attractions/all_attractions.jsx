// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import AddAttractionModal from "../../modals/create/add_attraction_modal";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

// Modules / Functions
import { Card, ListGroup } from "react-bootstrap";
import { Button, Grid, Input } from "semantic-ui-react";
import ReactPaginate from "react-paginate";

import axios from "axios";
import filterFactory, {
  textFilter,
  selectFilter,
} from "react-bootstrap-table2-filter";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import ReactCountryFlag from "react-country-flag";
import Swal from "sweetalert2";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

// CSS
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Icons / Images
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import { BsTable, BsTablet, BsInfoSquare } from "react-icons/bs";
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

let cross_style = {
  color: "red",
  fontSize: "1em",
};

let tick_style = {
  color: "green",
  fontSize: "1.4em",
};

const AttractionDescr = {
  HS: "Historical Sites",
  MS: "Museums",
  TP: "Theme Parks",
  NP: "Natural Parks",
  ZA: "Zoos And Aquariums",
  BG: "Botanical Gardens",
  LM: "Landmarks",
  AM: "Architectural Marvels",
  AG: "Art Galleries",
  CF: "Cultural Festivals",
  SA: "Sport Arenas",
  BC: "Beaches and Coastal Areas",
  SD: "Shopping Districts",
  AD: "Adventure Parks",
  SC: "Science Centers",
  OS: "Observatory",
  CP: "Castles and Palaces",
  WV: "Wineries and Vineyards",
  CT: "Culinary Tours",
  CD: "Churches And Cathedrals",
};

const GET_ATTRACTIONS =
  "http://localhost:8000/api/data_management/all_attractions/";

const notesFilterOptions = {
  true: "Has notes",
  false: "Does not have notes",
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
        <a href={"/data_management/attraction/" + row.id} basic id="cell_link">
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
    dataField: "type",
    text: "Type",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <> {row.type.length !== 2 ? "N/A" : AttractionDescr[row.type]} </>
    ),
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

// url path = '/all_attractions'
class AllAttractions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_attractions: [],
      is_loaded: false,
      selectedView: "table",
      selectedName: null,
      currentPage: 1,
      attractionsPerPage: 10,
      searchValue: "",
      totalFilteredAttractions: 0,
      lastClickTime: 0,
      forbidden: false,
    };
  }

  fetchAttractions() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    axios
      .get(GET_ATTRACTIONS, {
        headers: headers,
      })
      .then((res) => {
        const allAttractions = res.data.all_attractions;
        const filteredAttractions = allAttractions.filter((attraction) =>
          attraction.name
            .toLowerCase()
            .includes(this.state.searchValue.toLowerCase())
        );
        this.setState({
          all_attractions: allAttractions,
          totalFilteredAttractions: filteredAttractions.length,
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
    this.fetchAttractions();
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
      this.fetchAttractions();
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

  handleDoubleTap = (attraction_id) => {
    const { lastClickTime } = this.state;
    const currentTime = new Date().getTime();
    const tapTimeDifference = currentTime - lastClickTime;

    if (tapTimeDifference < 300) {
      window.location.href = "/data_management/attraction/" + attraction_id;
    }

    this.setState({ lastClickTime: currentTime });
  };

  render() {
    const {
      all_attractions,
      currentPage,
      searchValue,
      totalFilteredAttractions,
    } = this.state;

    // Filter the all_attractions array based on the search term
    const filteredAttractions = all_attractions.filter((attraction) =>
      attraction.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Calculate the index range of attractions for the current page from the filtered array
    const indexOfLastAttraction = currentPage * this.state.attractionsPerPage;
    const indexOfFirstAttraction =
      indexOfLastAttraction - this.state.attractionsPerPage;
    const currentAttractions = filteredAttractions.slice(
      indexOfFirstAttraction,
      indexOfLastAttraction
    );

    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("all_attractions")}
          <div className='container'>
            <h3 className='dox_h3'>Autocomplete Searching: </h3>
            <Autocomplete
              options={this.state.all_attractions.map((attraction) => attraction.id + ") " + attraction.name)}
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
                window.open("/data_management/attraction/" + value.split(") ")[0], '_blank');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Attraction"
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
            <>{forbidden("All Museums & Attractions")}</>
          ) : this.state.is_loaded ? (
            this.state.selectedView === "table" ? (
              <>
                <ToolkitProvider
                  keyField="id"
                  data={this.state.all_attractions}
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
                        filter={filterFactory()}
                      />
                    </div>
                  )}
                </ToolkitProvider>
                <AddAttractionModal redir={true} />
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
                      {currentAttractions.map((attraction) => (
                        <>
                          <Button
                            color={
                              this.state.selectedName === attraction.name
                                ? "blue"
                                : "vk"
                            }
                            onClick={(e) => {
                              this.setSelectedName(e.target.innerText);
                              this.handleDoubleTap(attraction.id);
                            }}
                            style={{ width: 300, margin: 10 }}
                          >
                            {attraction.name}
                          </Button>
                          <br />
                        </>
                      ))}
                    </Grid.Column>
                    <Grid.Column width={6}>
                      {this.state.all_attractions
                        .filter(
                          (attraction) =>
                            attraction.name === this.state.selectedName
                        )
                        .map((attraction) => (
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
                                Attraction Information
                              </Card.Header>
                              <Card.Body>
                                <ListGroup>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>ID</div>
                                    <div className={"info_span"}>
                                      {attraction.id}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div
                                      className={
                                        attraction.enabled
                                          ? "info_span"
                                          : "red_info_span"
                                      }
                                    >
                                      Name
                                    </div>
                                    <div className={"info_span"}>
                                      <a
                                        href={
                                          "/data_management/attraction/" +
                                          attraction.id
                                        }
                                        basic
                                        id="cell_link"
                                      >
                                        {attraction.name}
                                      </a>
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Type</div>
                                    <div className={"info_span"}>
                                      {attraction.type.length !== 2
                                        ? "N/A"
                                        : AttractionDescr[attraction.type]}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>
                                      Lat / Lng
                                    </div>
                                    <div className={"info_span"}>
                                      {attraction.lat_lng}
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
                    totalFilteredAttractions / this.state.attractionsPerPage
                  )}
                  marginPagesDisplayed={0}
                  pageRangeDisplayed={5}
                  onPageChange={this.handlePageChange}
                  containerClassName={"pagination"}
                  subContainerClassName={"pages react-pagination"}
                  activeClassName={"active"}
                />
                <AddAttractionModal redir={true} />
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

export default AllAttractions;
