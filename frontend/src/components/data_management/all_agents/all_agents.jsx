// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import NoDataToShowImage from "../../../images/generic/no_results_found.png";
import ReactCountryFlag from "react-country-flag";
import AddAgentModal from "../../modals/create/add_agent_modal";
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

const GET_AGENTS = "http://localhost:8000/api/data_management/all_agents/";

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
          href={"/data_management/agent/" + row.id}
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
            {row.country_code ? row.country_code : "N/A"}
          </>
        ) : (
          "N/A"
        )}
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
            <strong>Tel : </strong> N/A <br />
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
    dataField: "icon",
    text: "Icon",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row, rowIndex, extraData) => (
      <>
        {row.icon ? (
          <>
            <img
              src={"http://localhost:8000" + row.icon}
              id="repair_shop_icon"
              alt=""
            />
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

// AllAgents page Class
// url path = '/all_agents'
class AllAgents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_agents: [],
      is_loaded: false,
      selectedView: "table",
      selectedName: null,
      currentPage: 1,
      agentsPerPage: 10,
      searchValue: "",
      totalFilteredAgents: 0,
      lastClickTime: 0,
      forbidden: false,
    };
  }

  fetchAgents() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    axios
      .get(GET_AGENTS, {
        headers: headers,
      })
      .then((res) => {
        const allAgents = res.data.all_agents;
        const filteredAgents = allAgents.filter((agent) =>
          agent.name
            .toLowerCase()
            .includes(this.state.searchValue.toLowerCase())
        );
        this.setState({
          all_agents: allAgents,
          totalFilteredAgents: filteredAgents.length,
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
    this.fetchAgents();
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
      this.fetchAgents();
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

  handleDoubleTap = (agent_id) => {
    const { lastClickTime } = this.state;
    const currentTime = new Date().getTime();
    const tapTimeDifference = currentTime - lastClickTime;

    if (tapTimeDifference < 300) {
      window.location.href = "/data_management/agent/" + agent_id;
    }

    this.setState({ lastClickTime: currentTime });
  };

  render() {
    const { all_agents, currentPage, searchValue, totalFilteredAgents } =
      this.state;

    // Filter the all_agents array based on the search term
    const filteredAgents = all_agents.filter((agent) =>
      agent.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Calculate the index range of agents for the current page from the filtered array
    const indexOfLastAgent = currentPage * this.state.agentsPerPage;
    const indexOfFirstAgent = indexOfLastAgent - this.state.agentsPerPage;
    const currentAgents = filteredAgents.slice(
      indexOfFirstAgent,
      indexOfLastAgent
    );

    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("all_agents")}
          <div className='container'>
            <h3 className='dox_h3'>Autocomplete Searching: </h3>
            <Autocomplete
              options={this.state.all_agents.map((agent) => agent.id + ") " + agent.name)}
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
                window.open("/data_management/agent/" + value.split(") ")[0], '_blank');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Agent"
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
                  color: "#93ab3c",
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
                  color: "#93ab3c",
                  fontSize: "1.5em",
                }}
              />
            </Button>
          </div>

          {this.state.forbidden ? (
            <>{forbidden("All Agents")}</>
          ) : this.state.is_loaded ? (
            this.state.selectedView === "table" ? (
              <>
                <ToolkitProvider
                  keyField="id"
                  data={this.state.all_agents}
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
                        id="all_agents_table"
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
                <AddAgentModal redir={true} />
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
                      {currentAgents.map((agent) => (
                        <>
                          <Button
                            color={
                              this.state.selectedName === agent.name
                                ? "blue"
                                : "vk"
                            }
                            onClick={(e) => {
                              this.setSelectedName(e.target.innerText);
                              this.handleDoubleTap(agent.id);
                            }}
                            style={{ width: 300, margin: 10 }}
                          >
                            {agent.name}
                          </Button>
                          <br />
                        </>
                      ))}
                    </Grid.Column>
                    <Grid.Column width={6}>
                      {this.state.all_agents
                        .filter(
                          (agent) => agent.name === this.state.selectedName
                        )
                        .map((agent) => (
                          <>
                            <Card width={4}>
                              <Card.Header>
                                <BsInfoSquare
                                  style={{
                                    color: "#93ab3c",
                                    fontSize: "1.5em",
                                    marginRight: "0.5em",
                                  }}
                                />
                                Agent Information
                              </Card.Header>
                              <Card.Body>
                                <ListGroup>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>ID</div>
                                    <div className={"info_span"}>
                                      {agent.id}
                                    </div>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Name</div>
                                    <div
                                      className={
                                        agent.enabled
                                          ? "info_span"
                                          : "red_info_span"
                                      }
                                    >
                                      <a
                                        href={
                                          "/data_management/agent/" + agent.id
                                        }
                                        basic
                                        id="cell_link"
                                        className={
                                          agent.enabled ? "" : "cnclled"
                                        }
                                      >
                                        {agent.name}
                                      </a>
                                    </div>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Address</div>
                                    <div className={"info_span"}>
                                      {agent.address === "None" ? (
                                        "N/A"
                                      ) : (
                                        <>{agent.address}</>
                                      )}
                                    </div>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                    <div className={"info_descr"}>
                                      Tel details
                                    </div>
                                    <div className={"info_span"}>
                                      {agent.tel}
                                    </div>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Email</div>
                                    <div className={"info_span"}>
                                      {agent.email === "None" ||
                                      agent.email === "" ? (
                                        "N/A"
                                      ) : (
                                        <>{agent.email}</>
                                      )}
                                    </div>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                    <div className={"info_descr"}>
                                      Abbreviation
                                    </div>
                                    <div className={"info_span"}>
                                      {agent.abbreviation === "None" ? (
                                        "N/A"
                                      ) : (
                                        <>{agent.abbreviation}</>
                                      )}
                                    </div>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                    <div className={"info_descr"}>
                                      Nationality
                                    </div>
                                    <div className={"info_span"}>
                                      {agent.country_code !== "N/A" ? (
                                        <>
                                          <ReactCountryFlag
                                            countryCode={agent.country_code}
                                            svg
                                            style={{
                                              width: "2em",
                                              height: "2em",
                                              marginRight: 10,
                                            }}
                                            title={agent.nationality.code}
                                          />
                                          {agent.nationality
                                            ? agent.nationality.name
                                            : "N/A"}
                                          {agent.nationality}
                                        </>
                                      ) : (
                                        "N/A"
                                      )}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Icon</div>
                                    <div className={"info_span"}>
                                      {agent.icon ? (
                                        <>
                                          <img
                                            src={
                                              "http://localhost:8000" +
                                              agent.icon
                                            }
                                            id="repair_shop_icon"
                                            alt=""
                                          />
                                        </>
                                      ) : (
                                        "N/A"
                                      )}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Enabled</div>
                                    <div className={"info_span"}>
                                      {agent.enabled ? (
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
                    totalFilteredAgents / this.state.agentsPerPage
                  )}
                  marginPagesDisplayed={0}
                  pageRangeDisplayed={5}
                  onPageChange={this.handlePageChange}
                  containerClassName={"pagination"}
                  subContainerClassName={"pages react-pagination"}
                  activeClassName={"active"}
                />
                <AddAgentModal redir={true} />
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

export default AllAgents;
