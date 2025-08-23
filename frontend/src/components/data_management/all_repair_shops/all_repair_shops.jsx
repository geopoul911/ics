// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import AddRepairShopModal from "../../modals/create/add_repair_shop_modal";

// Modules / Functions
import { Card, ListGroup } from "react-bootstrap";
import { Button, Grid, Input } from "semantic-ui-react";
import ReactCountryFlag from "react-country-flag";
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
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

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

const rowStyle = (row) => {
  const style = {};
  if (row.enabled === false) {
    style.color = "red";
  }
  return style;
};

const GET_REPAIR_SHOPS =
  "http://localhost:8000/api/data_management/all_repair_shops/";

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

  // Return distinct values
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
          href={"/data_management/repair_shop/" + row.id}
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
    dataField: "address",
    text: "Address",
    sort: true,
    filter: textFilter(),
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

const defaultSorted = [
  {
    dataField: "id",
    order: "desc",
  },
];

const NoDataToShow = () => {
  return <img src={NoDataToShowImage} alt={""} className="fill" />;
};

class AllRepairShops extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_repair_shops: [],
      is_loaded: false,
      selectedView: "table",
      selectedName: null,
      currentPage: 1,
      repair_shopsPerPage: 10,
      searchValue: "",
      totalFilteredRepairShops: 0,
      lastClickTime: 0,
    };
  }

  fetchRepairShops() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    axios
      .get(GET_REPAIR_SHOPS, {
        headers: headers,
      })
      .then((res) => {
        const allRepairShops = res.data.all_repair_shops;
        const filteredRepairShops = allRepairShops.filter((repair_shop) =>
          repair_shop.name
            .toLowerCase()
            .includes(this.state.searchValue.toLowerCase())
        );
        this.setState({
          all_repair_shops: allRepairShops,
          totalFilteredRepairShops: filteredRepairShops.length,
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
    this.fetchRepairShops();
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
      this.fetchRepairShops();
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

  handleDoubleTap = (repair_shop_id) => {
    const { lastClickTime } = this.state;
    const currentTime = new Date().getTime();
    const tapTimeDifference = currentTime - lastClickTime;

    if (tapTimeDifference < 300) {
      window.location.href = "/data_management/repair_shop/" + repair_shop_id;
    }

    this.setState({ lastClickTime: currentTime });
  };

  render() {
    const {
      all_repair_shops,
      currentPage,
      searchValue,
      totalFilteredRepairShops,
    } = this.state;

    // Filter the all_repair_shops array based on the search term
    const filteredRepairShops = all_repair_shops.filter((repair_shop) =>
      repair_shop.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Calculate the index range of repair_shops for the current page from the filtered array
    const indexOfLastRepairShop = currentPage * this.state.repair_shopsPerPage;
    const indexOfFirstRepairShop =
      indexOfLastRepairShop - this.state.repair_shopsPerPage;
    const currentRepairShops = filteredRepairShops.slice(
      indexOfFirstRepairShop,
      indexOfLastRepairShop
    );

    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("all_repair_shops")}
          <div className='container'>
            <h3 className='dox_h3'>Autocomplete Searching: </h3>
            <Autocomplete
              options={this.state.all_repair_shops.map((repair_shop) => repair_shop.id + ") " + repair_shop.name)}
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
                window.open("/data_management/repair_shop/" + value.split(") ")[0], '_blank');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Repair Shop"
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
            <>{forbidden("All Repair Shops")}</>
          ) : this.state.is_loaded ? (
            this.state.selectedView === "table" ? (
              <>
                <ToolkitProvider
                  keyField="id"
                  data={this.state.all_repair_shops}
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
                        id="all_repair_shops_table"
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
                <AddRepairShopModal redir={true} />
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
                      {currentRepairShops.map((repair_shop) => (
                        <>
                          <Button
                            color={
                              this.state.selectedName === repair_shop.name
                                ? "blue"
                                : "vk"
                            }
                            onClick={(e) => {
                              this.setSelectedName(e.target.innerText);
                              this.handleDoubleTap(repair_shop.id);
                            }}
                            style={{ width: 300, margin: 10 }}
                          >
                            {repair_shop.name}
                          </Button>
                          <br />
                        </>
                      ))}
                    </Grid.Column>
                    <Grid.Column width={6}>
                      {this.state.all_repair_shops
                        .filter(
                          (repair_shop) =>
                            repair_shop.name === this.state.selectedName
                        )
                        .map((repair_shop) => (
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
                                Repair Shop Information
                              </Card.Header>
                              <Card.Body>
                                <ListGroup>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>ID</div>
                                    <div className={"info_span"}>
                                      {repair_shop.id}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Name</div>
                                    <div
                                      className={
                                        repair_shop.enabled
                                          ? "info_span"
                                          : "red_info_span"
                                      }
                                    >
                                      <a
                                        href={
                                          "/data_management/repair_shop/" +
                                          repair_shop.id
                                        }
                                        basic
                                        id="cell_link"
                                        className={
                                          repair_shop.enabled ? "" : "cnclled"
                                        }
                                      >
                                        {repair_shop.name}
                                      </a>
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Address</div>
                                    <div className={"info_span"}>
                                      {repair_shop.address === "None" ? (
                                        "N/A"
                                      ) : (
                                        <>{repair_shop.address}</>
                                      )}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>
                                      Tel details
                                    </div>
                                    <div className={"info_span"}>
                                      {repair_shop.tel}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Email</div>
                                    <div className={"info_span"}>
                                      {repair_shop.email === "None" &&
                                      repair_shop.email === "" ? (
                                        "N/A"
                                      ) : (
                                        <>{repair_shop.email}</>
                                      )}
                                    </div>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Types</div>
                                    <div className={"info_span"}>
                                      {repair_shop.type.length > 0
                                        ? repair_shop.type.map((e) => (
                                            <>
                                              <img
                                                src={
                                                  "http://localhost:8000" +
                                                  e.icon
                                                }
                                                id="repair_shop_icon"
                                                alt=""
                                                title={e.description}
                                              />
                                            </>
                                          ))
                                        : "N/A"}
                                    </div>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                    <div className={"info_descr"}>
                                      Lat / Lng
                                    </div>
                                    <div className={"info_span"}>
                                      {repair_shop.lat_lng}
                                    </div>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Enabled</div>
                                    <div className={"info_span"}>
                                      {repair_shop.enabled ? (
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
                    totalFilteredRepairShops / this.state.repair_shopsPerPage
                  )}
                  marginPagesDisplayed={0}
                  pageRangeDisplayed={5}
                  onPageChange={this.handlePageChange}
                  containerClassName={"pagination"}
                  subContainerClassName={"pages react-pagination"}
                  activeClassName={"active"}
                />
                <AddRepairShopModal redir={true} />
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

export default AllRepairShops;
