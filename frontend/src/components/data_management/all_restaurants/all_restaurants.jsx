// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import AddRestaurantModal from "../../modals/create/add_restaurant_modal";

// Modules / Functions
import { Card, ListGroup } from "react-bootstrap";
import { Button, Grid, Input } from "semantic-ui-react";
import ReactPaginate from "react-paginate";
import ReactCountryFlag from "react-country-flag";

import filterFactory, {
  textFilter,
  selectFilter,
} from "react-bootstrap-table2-filter";
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
import NoDataToShowImage from "../../../images/generic/no_results_found.png";
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
  restrictedUsers,
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

const rowStyle = (row) => {
  const style = {};
  if (row.enabled === false) {
    style.color = "red";
  }
  return style;
};

const calculateRestaurantStars = (rating) => {
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

const GET_RESTAURANTS =
  "http://localhost:8000/api/data_management/all_restaurants/";

const notesFilterOptions = {
  true: "Has notes",
  false: "Does not have notes",
};

const enabledFilterOptions = {
  true: "Yes",
  false: "No",
};

function filterByType(filterVal, data) {
  let results = [];

  if (filterVal === "") {
    return data;
  }

  // eslint-disable-next-line
  data.map((rshop) => {
    // eslint-disable-next-line
    rshop.type.map((obj_type) => {
      if (
        obj_type.description.toLowerCase().includes(filterVal.toLowerCase())
      ) {
        results.push(rshop);
      }
    });
  });

  return [...new Set(results)];
}

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
          href={"/data_management/restaurant/" + row.id}
          basic
          className={row.enabled ? "" : "cnclled"}
          id="cell_link"
        >
          {row.name}
        </a>
      </>
    ),
  },
  {
    dataField: "rating",
    text: "Rating",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => <>{calculateRestaurantStars(row.rating)}</>,
  },
  {
    dataField: "capacity",
    text: "Seating Capacity",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <> {row.capacity ? row.capacity : <>N/A</>} </>
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
    dataField: "address",
    text: "Address",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <> {row.address === "None" ? "N/A" : <>{row.address}</>} </>
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
    dataField: "email",
    text: "Email",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <>{row.email === "None" ? "N/A" : <>{row.email}</>}</>
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
    dataField: "type",
    text: "Types",
    sort: true,
    filter: textFilter({
      onFilter: filterByType,
    }),
    formatter: (cell, row) => (
      <>
        {cell.map((e) => (
          <>
            <img
              src={"http://localhost:8000" + e.icon}
              id="repair_shop_icon"
              alt=""
              title={e.description}
            />
          </>
        ))}
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

// By default, sort by ID descending
const defaultSorted = [
  {
    dataField: "id",
    order: "desc",
  },
];

const NoDataToShow = () => {
  return <img src={NoDataToShowImage} alt={""} className="fill" />;
};

// url path = '/all_restaurants'
class AllRestaurants extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_restaurants: [],
      is_loaded: false,
      selectedView: "table",
      selectedName: null,
      currentPage: 1,
      restaurantsPerPage: 10,
      searchValue: "",
      totalFilteredRestaurants: 0,
      lastClickTime: 0,
    };
  }

  fetchRestaurants() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    axios
      .get(GET_RESTAURANTS, {
        headers: headers,
      })
      .then((res) => {
        console.log(res.data.all_restaurants)
        const allRestaurants = res.data.all_restaurants;
        const filteredRestaurants = allRestaurants.filter((restaurant) =>
          restaurant.name
            .toLowerCase()
            .includes(this.state.searchValue.toLowerCase())
        );
        this.setState({
          all_restaurants: allRestaurants,
          totalFilteredRestaurants: filteredRestaurants.length,
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
    this.fetchRestaurants();
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
      this.fetchRestaurants();
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

  handleDoubleTap = (restaurant_id) => {
    const { lastClickTime } = this.state;
    const currentTime = new Date().getTime();
    const tapTimeDifference = currentTime - lastClickTime;

    if (tapTimeDifference < 300) {
      window.location.href = "/data_management/restaurant/" + restaurant_id;
    }

    this.setState({ lastClickTime: currentTime });
  };

  render() {
    const {
      all_restaurants,
      currentPage,
      searchValue,
      totalFilteredRestaurants,
    } = this.state;

    // Filter the all_restaurants array based on the search term
    const filteredRestaurants = all_restaurants.filter((restaurant) =>
      restaurant.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Calculate the index range of restaurants for the current page from the filtered array
    const indexOfLastRestaurant = currentPage * this.state.restaurantsPerPage;
    const indexOfFirstRestaurant =
      indexOfLastRestaurant - this.state.restaurantsPerPage;
    const currentRestaurants = filteredRestaurants.slice(
      indexOfFirstRestaurant,
      indexOfLastRestaurant
    );

    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("all_restaurants")}
          <div className='container'>
            <h3 className='dox_h3'>Autocomplete Searching: </h3>
            <Autocomplete
              options={this.state.all_restaurants.map((restaurant) => restaurant.id + ") " + restaurant.name)}
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
                window.open("/data_management/restaurant/" + value.split(") ")[0], '_blank');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Restaurant"
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
            <>{forbidden("All Restaurants")}</>
          ) : this.state.is_loaded ? (
            this.state.selectedView === "table" ? (
              <>
                <ToolkitProvider
                  keyField="id"
                  data={this.state.all_restaurants}
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
                <AddRestaurantModal redir={true} />
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
                      {currentRestaurants.map((restaurant) => (
                        <>
                          <Button
                            color={
                              this.state.selectedName === restaurant.name
                                ? "blue"
                                : "vk"
                            }
                            onClick={(e) => {
                              this.setSelectedName(e.target.innerText);
                              this.handleDoubleTap(restaurant.id);
                            }}
                            style={{ width: 300, margin: 10 }}
                          >
                            {restaurant.name}
                          </Button>
                          <br />
                        </>
                      ))}
                    </Grid.Column>
                    <Grid.Column width={6}>
                      {this.state.all_restaurants
                        .filter(
                          (restaurant) =>
                            restaurant.name === this.state.selectedName
                        )
                        .map((restaurant) => (
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
                                Restaurant Information
                              </Card.Header>
                              <Card.Body>
                                <ListGroup>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>ID</div>
                                    <div className={"info_span"}>
                                      {restaurant.id}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Name</div>
                                    <div
                                      className={
                                        restaurant.enabled
                                          ? "info_span"
                                          : "red_info_span"
                                      }
                                    >
                                      <a
                                        href={
                                          "/data_management/restaurant/" +
                                          restaurant.id
                                        }
                                        basic
                                        id="cell_link"
                                        className={
                                          restaurant.enabled ? "" : "cnclled"
                                        }
                                      >
                                        {restaurant.name}
                                      </a>
                                    </div>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Address</div>
                                    <div className={"info_span"}>
                                      {restaurant.address === "None" ? (
                                        "N/A"
                                      ) : (
                                        <>{restaurant.address}</>
                                      )}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>
                                      Tel details
                                    </div>
                                    <div className={"info_span"}>
                                      {restaurant.tel}
                                    </div>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Email</div>
                                    <div className={"info_span"}>
                                      {restaurant.email === "None" &&
                                      restaurant.email === "" ? (
                                        "N/A"
                                      ) : (
                                        <>{restaurant.email}</>
                                      )}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Rating</div>
                                    <div className={"info_span"}>
                                      {calculateRestaurantStars(
                                        restaurant.rating
                                      )}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Types</div>
                                    <div className={"info_span"}>
                                      {restaurant.type.map((e) => (
                                        <>
                                          <img
                                            src={
                                              "http://localhost:8000" + e.icon
                                            }
                                            id="repair_shop_icon"
                                            alt=""
                                            title={e.description}
                                          />
                                        </>
                                      ))}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Enabled</div>
                                    <div className={"info_span"}>
                                      {restaurant.enabled ? (
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
                    totalFilteredRestaurants / this.state.restaurantsPerPage
                  )}
                  marginPagesDisplayed={0}
                  pageRangeDisplayed={5}
                  onPageChange={this.handlePageChange}
                  containerClassName={"pagination"}
                  subContainerClassName={"pages react-pagination"}
                  activeClassName={"active"}
                />
                <AddRestaurantModal redir={true} />
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

export default AllRestaurants;
