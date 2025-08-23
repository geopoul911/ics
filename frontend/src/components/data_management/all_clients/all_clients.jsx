// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import NoDataToShowImage from "../../../images/generic/no_results_found.png";
import ReactCountryFlag from "react-country-flag";
import AddClientModal from "../../modals/create/add_client_modal";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

// Modules / Functions
import { Card, ListGroup } from "react-bootstrap";
import { Button, Grid, Input } from "semantic-ui-react";
import ReactPaginate from "react-paginate";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Swal from "sweetalert2";
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

const GET_CLIENTS = "http://localhost:8000/api/data_management/all_clients/";

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

const notesFilterOptions = {
  true: "Has notes",
  false: "Does not have notes",
};

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
          href={"/data_management/client/" + row.id}
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
    dataField: "abbreviation",
    text: "Abbreviation",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <>{row.abbreviation === "None" ? "N/A" : <>{row.abbreviation}</>}</>
    ),
  },
  {
    dataField: "nationality",
    text: "Nationality",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row, rowIndex, extraData) => (
      <>
        {row.country_code !== "N/A" ? (
          <>
            <ReactCountryFlag
              countryCode={row.country_code}
              svg
              style={{ width: "2em", height: "2em", marginRight: 10 }}
              title={row.nationality.code}
            />
            {row.nationality ? row.nationality.name : "N/A"}
            {row.nationality}
          </>
        ) : (
          "N/A"
        )}
      </>
    ),
  },
  {
    dataField: "region",
    text: "Region",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <>{row.region ? row.region : 'N/A'}</>
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

// AllClients page Class
// url path = '/all_clients'
class AllClients extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_clients: [],
      is_loaded: false,
      selectedView: "table",
      selectedName: null,
      currentPage: 1,
      clientsPerPage: 10,
      searchValue: "",
      totalFilteredClients: 0,
      lastClickTime: 0,
      forbidden: false,
    };
  }

  fetchClients() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    axios
      .get(GET_CLIENTS, {
        headers: headers,
      })
      .then((res) => {
        const allClients = res.data.all_clients;
        const filteredClients = allClients.filter((client) =>
          client.name
            .toLowerCase()
            .includes(this.state.searchValue.toLowerCase())
        );
        this.setState({
          all_clients: allClients,
          totalFilteredClients: filteredClients.length,
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
    this.fetchClients();
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
      this.fetchClients();
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

  handleDoubleTap = (client_id) => {
    const { lastClickTime } = this.state;
    const currentTime = new Date().getTime();
    const tapTimeDifference = currentTime - lastClickTime;

    if (tapTimeDifference < 300) {
      window.location.href = "/data_management/client/" + client_id;
    }

    this.setState({ lastClickTime: currentTime });
  };

  render() {
    const { all_clients, currentPage, searchValue, totalFilteredClients } =
      this.state;

    // Filter the all_clients array based on the search term
    const filteredClients = all_clients.filter((client) =>
      client.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Calculate the index range of clients for the current page from the filtered array
    const indexOfLastClient = currentPage * this.state.clientsPerPage;
    const indexOfFirstClient = indexOfLastClient - this.state.clientsPerPage;
    const currentClients = filteredClients.slice(
      indexOfFirstClient,
      indexOfLastClient
    );

    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("all_clients")}
          <div className='container'>
            <h3 className='dox_h3'>Autocomplete Searching: </h3>
            <Autocomplete
              options={this.state.all_clients.map((client) => client.id + ") " + client.name)}
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
                window.open("/data_management/client/" + value.split(") ")[0], '_blank');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Client"
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
            <>{forbidden("All Clients")}</>
          ) : this.state.is_loaded ? (
            this.state.selectedView === "table" ? (
              <>
                <ToolkitProvider
                  keyField="id"
                  data={this.state.all_clients}
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
                        id="all_clients_table"
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
                <AddClientModal redir={true} />
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
                      {currentClients.map((client) => (
                        <>
                          <Button
                            color={
                              this.state.selectedName === client.name
                                ? "blue"
                                : "vk"
                            }
                            onClick={(e) => {
                              this.setSelectedName(e.target.innerText);
                              this.handleDoubleTap(client.id);
                            }}
                            style={{ width: 300, margin: 10 }}
                          >
                            {client.name}
                          </Button>
                          <br />
                        </>
                      ))}
                    </Grid.Column>
                    <Grid.Column width={6}>
                      {this.state.all_clients
                        .filter(
                          (client) => client.name === this.state.selectedName
                        )
                        .map((client) => (
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
                                Client Information
                              </Card.Header>
                              <Card.Body>
                                <ListGroup>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>ID</div>
                                    <div className={"info_span"}>
                                      {client.id}
                                    </div>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                    <div
                                      className={
                                        client.enabled
                                          ? "info_span"
                                          : "red_info_span"
                                      }
                                    >
                                      Name
                                    </div>
                                    <div className={"info_span"}>
                                      <a
                                        href={
                                          "/data_management/client/" + client.id
                                        }
                                        basic
                                        id="cell_link"
                                        className={
                                          client.enabled ? "" : "cnclled"
                                        }
                                      >
                                        {client.name}
                                      </a>
                                    </div>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Address</div>
                                    <div className={"info_span"}>
                                      {client.address === "None" ? (
                                        "N/A"
                                      ) : (
                                        <>{client.address}</>
                                      )}
                                    </div>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                    <div className={"info_descr"}>
                                      Tel details
                                    </div>
                                    <div className={"info_span"}>
                                      {client.tel}
                                    </div>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Email</div>
                                    <div className={"info_span"}>
                                      {client.email === "None" ||
                                      client.email === "" ? (
                                        "N/A"
                                      ) : (
                                        <>{client.email}</>
                                      )}
                                    </div>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                    <div className={"info_descr"}>
                                      Abbreviation
                                    </div>
                                    <div className={"info_span"}>
                                      {client.abbreviation === "None" ? (
                                        "N/A"
                                      ) : (
                                        <>{client.abbreviation}</>
                                      )}
                                    </div>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                    <div className={"info_descr"}>
                                      Nationality
                                    </div>
                                    <div className={"info_span"}>
                                      {client.country_code !== "N/A" ? (
                                        <>
                                          <ReactCountryFlag
                                            countryCode={client.country_code}
                                            svg
                                            style={{
                                              width: "2em",
                                              height: "2em",
                                              marginRight: 10,
                                            }}
                                            title={client.nationality.code}
                                          />
                                          {client.nationality
                                            ? client.nationality.name
                                            : "N/A"}
                                          {client.nationality}
                                        </>
                                      ) : (
                                        "N/A"
                                      )}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Enabled</div>
                                    <div className={"info_span"}>
                                      {client.enabled ? (
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
                    totalFilteredClients / this.state.clientsPerPage
                  )}
                  marginPagesDisplayed={0}
                  pageRangeDisplayed={5}
                  onPageChange={this.handlePageChange}
                  containerClassName={"pagination"}
                  subContainerClassName={"pages react-pagination"}
                  activeClassName={"active"}
                />
                <AddClientModal redir={true} />
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

export default AllClients;
