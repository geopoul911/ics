// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import AddHotelModal from "../../modals/create/add_hotel_modal";
import NoDataToShowImage from "../../../images/generic/no_results_found.png";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

// Modules / Functions
import { Card, ListGroup } from "react-bootstrap";
import { Button, Grid, Input } from "semantic-ui-react";
import ReactPaginate from "react-paginate";
import ReactCountryFlag from "react-country-flag";

import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, {
  textFilter,
  selectFilter,
} from "react-bootstrap-table2-filter";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Swal from "sweetalert2";

// CSS
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Icons / Images
import { AiFillStar } from "react-icons/ai";
import { BsStarHalf } from "react-icons/bs";
import { AiOutlineStar } from "react-icons/ai";
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
  countryToCode,
} from "../../global_vars";

// Variables
window.Swal = Swal;

let starStyle = {
  color: "orange",
  fontSize: "1.5em",
  display: "inline-block",
};

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

const ratingFilterOptions = {
  0: "No rating",
  10: "1 Star",
  20: "2 Stars",
  30: "3 Stars",
  40: "4 Stars",
  45: "4 Stars plus",
  50: "5 Stars",
  55: "5 Stars plus",
};

const calculateHotelStars = (rating) => {
  if (rating !== "" && rating !== null) {
    let results = [];
    let string_rating = rating.toString();
    let fullStars = string_rating[0];
    let halfStars = string_rating[1];
    let emptyStars = 5 - parseInt(rating / 10);
    // full stars loop
    for (var i = 0; i < Number(fullStars); i++) {
      results.push(<AiFillStar style={starStyle} />);
    }
    // half star
    if (halfStars === 5) {
      results.push(
        <BsStarHalf
          style={{
            color: "orange",
            fontSize: "1.3em",
            display: "inline-block",
          }}
        />
      );
    }
    // empty star
    for (var l = 0; l < Number(emptyStars); l++) {
      if (fullStars === "4" && halfStars !== "0") {
      } else {
        results.push(<AiOutlineStar style={starStyle} />);
      }
    }
    return results;
  }
};

const GET_HOTELS = "http://localhost:8000/api/data_management/all_hotels/";


const includesFilter = (filterVal, data) => {
  console.log("Data received for filtering:", data);
  if (!data || !data.name) return false; // Ensure data and data.name exist
  if (!filterVal) return true; // If no filter is set, return all data
  return data.name.toLowerCase().includes(filterVal.toLowerCase());
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
    dataField: "name",
    text: "Name",
    sort: true,
    filter: textFilter({
      getFilter: (filterVal) => {
        return (data) => includesFilter(filterVal, data);
      },
    }),
    formatter: (cell, row) => (
      <a
        href={"/data_management/hotel/" + row.id}
        basic
        id="cell_link"
        className={row.enabled ? "" : "cnclled"}
      >
        {row.name}
      </a>
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
    dataField: "rating",
    text: "Rating",
    sort: true,
    filter: selectFilter({
      options: ratingFilterOptions,
    }),
    formatter: (cell, row) => <>{calculateHotelStars(row.rating)}</>,
  },
  {
    dataField: "address",
    text: "Address",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <>{row.address === "None" ? "N/A" : <>{row.address}</>}</>
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
    dataField: "email",
    text: "Email",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <>{row.email === "None" ? "N/A" : <>{row.email}</>}</>
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

class AllHotels extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_hotels: [],
      is_loaded: false,
      selectedView: "table",
      selectedName: null,
      currentPage: 1,
      hotelsPerPage: 10,
      searchValue: "",
      totalFilteredHotels: 0,
      lastClickTime: 0,
      forbidden: false,
    };
  }

  fetchHotels() {
    axios
      .get(GET_HOTELS, {
        headers: headers,
      })
      .then((res) => {
        const allHotels = res.data.all_hotels;
        
        const filteredHotels = allHotels.filter((hotel) =>
          hotel.name
            .toLowerCase()
            .includes(this.state.searchValue.toLowerCase())
        );
        this.setState({
          all_hotels: allHotels,
          totalFilteredHotels: filteredHotels.length,
          is_loaded: true,
        });
      })
      .catch((e) => {
        console.log(e)
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
    this.fetchHotels();
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
      this.fetchHotels();
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

  handleDoubleTap = (hotel_id) => {
    const { lastClickTime } = this.state;
    const currentTime = new Date().getTime();
    const tapTimeDifference = currentTime - lastClickTime;

    if (tapTimeDifference < 300) {
      window.location.href = "/data_management/hotel/" + hotel_id;
    }

    this.setState({ lastClickTime: currentTime });
  };

  render() {
    const { all_hotels, currentPage, searchValue, totalFilteredHotels } =
      this.state;

    // Filter the all_hotels array based on the search term
    const filteredHotels = all_hotels.filter((hotel) =>
      hotel.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Calculate the index range of hotels for the current page from the filtered array
    const indexOfLastHotel = currentPage * this.state.hotelsPerPage;
    const indexOfFirstHotel = indexOfLastHotel - this.state.hotelsPerPage;
    const currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel);
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("all_hotels")}
          <div className='container'>
            <h3 className='dox_h3'>Autocomplete Searching: </h3>
            <Autocomplete
              options={this.state.all_hotels.map((hotel) => hotel.id + ") " + hotel.name)}
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
                window.open("/data_management/hotel/" + value.split(") ")[0], '_blank');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Hotel"
                  variant="outlined"
                />
              )}
            />
          </div>
          <div style={{ marginLeft: 20, width: 80, borderRadius: 10 }}>
            <Button
              id="table_icon"
              style={{ padding: 6, margin: 2, backgroundColor: this.state.selectedView === "table" ? "#e3e3e3" : ""}}
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
            <>{forbidden("All Hotels")}</>
          ) : this.state.is_loaded ? (
            this.state.selectedView === "table" ? (
              <>
                <ToolkitProvider
                  keyField="id"
                  data={this.state.all_hotels}
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
                        id="all_hotels_table"
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
                <AddHotelModal redir={true} />
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
                      {currentHotels.map((hotel) => (
                        <>
                          <Button
                            color={this.state.selectedName === hotel.name ? "blue" : "vk"}
                            onClick={(e) => {
                              this.setSelectedName(e.target.innerText);
                              this.handleDoubleTap(hotel.id);
                            }}
                            style={{ width: 300, margin: 10 }}
                          >
                            {hotel.name}
                          </Button>
                          <br />
                        </>
                      ))}
                    </Grid.Column>
                    <Grid.Column width={6}>
                      {this.state.all_hotels.filter((hotel) => hotel.name === this.state.selectedName)
                        .map((hotel) => (
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
                                Hotel Information
                              </Card.Header>
                              <Card.Body>
                                <ListGroup>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>ID</div>
                                    <div className={"info_span"}>
                                      {hotel.id}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Name</div>
                                    <div className={hotel.enabled ? "info_span": "red_info_span"}>
                                      <a
                                        href={"/data_management/hotel/" + hotel.id}
                                        basic
                                        id="cell_link"
                                        className={hotel.enabled ? "" : "cnclled"}
                                      >
                                        {hotel.name}
                                      </a>
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Address</div>
                                    <div className={"info_span"}>
                                      {hotel.address === "None" ? ("N/A") : (
                                        <>{hotel.address}</>
                                      )}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>
                                      Tel details
                                    </div>
                                    <div className={"info_span"}>
                                      {hotel.tel}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Email</div>
                                    <div className={"info_span"}>
                                      {hotel.email === "None" && hotel.email === "" ? ("N/A") : (
                                        <>{hotel.email}</>
                                      )}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Rating</div>
                                    <div className={"info_span"}>
                                      {calculateHotelStars(hotel.rating)}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>
                                      Lat / Lng
                                    </div>
                                    <div className={"info_span"}>
                                      {hotel.lat_lng}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Enabled</div>
                                    <div className={"info_span"}>
                                      {hotel.enabled ? (
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
                    totalFilteredHotels / this.state.hotelsPerPage
                  )}
                  marginPagesDisplayed={0}
                  pageRangeDisplayed={5}
                  onPageChange={this.handlePageChange}
                  containerClassName={"pagination"}
                  subContainerClassName={"pages react-pagination"}
                  activeClassName={"active"}
                />
                <AddHotelModal redir={true} />
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

export default AllHotels;
