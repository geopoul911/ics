// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Modules / Functions
import { Card, ListGroup } from "react-bootstrap";
import ReactCountryFlag from "react-country-flag";
import AddGroupModal from "./modals/add_group_modal";
import axios from "axios";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Button, Grid, Input } from "semantic-ui-react";
import filterFactory, {
  textFilter,
  selectFilter,
} from "react-bootstrap-table2-filter";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";

// CSS
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Icons / Images
import { BsTable, BsTablet, BsInfoSquare } from "react-icons/bs";
import NoDataToShowImage from "../../../images/generic/no_results_found.png";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";

// Global Variables
import {
  paginationOptions,
  headers,
  loader,
  pageHeader,
  restrictedUsers,
} from "../../global_vars";

// Variables
window.Swal = Swal;

const GET_GROUPS = "http://localhost:8000/api/groups/all_groups/";

const proformaFilterOptions = {
  true: "Issued Proforma",
  false: "No Issued Proforma",
};

let cross_style = {
  color: "red",
  fontSize: "1em",
};

let tick_style = {
  color: "green",
  fontSize: "1.4em",
};

const statusFilterOptions = {
  Confirmed: "Confirmed",
  Cancelled: "Cancelled",
};

const columns = [
  {
    dataField: "id",
    text: "ID",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "refcode",
    text: "Refcode",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <>
        <a
          href={"/group_management/group/" + row.refcode}
          basic
          className={row.status === "Cancelled" ? "cnclled" : "cnfrmed"}
        >
          {row.refcode}
        </a>
      </>
    ),
  },
  {
    dataField: "agent_name",
    text: "Agent / Client",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) =>
      row.agent_or_client === "Agent" ? (
        <>
          <a
            href={"/data_management/agent/" + row.agent_id}
            basic
            id="cell_link"
            className={row.status === "Cancelled" ? "cnclled" : "cnfrmed"}
          >
            {row.agent_name} ( {row.agent_or_client} )
          </a>
        </>
      ) : (
        <>
          <a
            href={"/data_management/client/" + row.client_id}
            basic
            className={row.status === "Cancelled" ? "cnclled" : "cnfrmed"}
            id="cell_link"
          >
            {row.client_name} ( {row.agent_or_client} )
          </a>
        </>
      ),
  },

  {
    dataField: "agent_refcode",
    text: "Agent / Client Refcode",
    sort: true,
    filter: textFilter(),
  },

  {
    dataField: "abbreviation",
    text: "Abbreviation",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => <>{row.abbreviation}</>,
  },


  {
    dataField: "status",
    text: "Status",
    sort: true,
    filter: selectFilter({
      options: statusFilterOptions,
    }),
  },
  {
    dataField: "departure_date",
    text: "Departure date",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "nationality_code",
    text: "Nationality",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <>
        {row.nationality_code ? (
          <>
            <ReactCountryFlag
              countryCode={row.nationality_code}
              svg
              style={{ width: "2em", height: "2em", marginRight: 10 }}
              title={row.nationality.code}
            />
            {row.nationality_code ? row.nationality_code : "N/A"}
          </>
        ) : (
          "N/A"
        )}
      </>
    ),
  },
  {
    dataField: "number_of_people",
    text: "PAX",
    sort: true,
    filter: textFilter(),
  },
  
  {
    dataField: "proforma",
    text: "Proforma",
    sort: true,
    filter: selectFilter({
      options: proformaFilterOptions,
    }),
    formatter: (cell, row) => (
      <>
        {row.proforma ? (
          <TiTick style={tick_style} />
        ) : (
          <ImCross style={cross_style} />
        )}
      </>
    ),
  },

];

// In case group is cancelled, make row's text red
const rowStyle = (row) => {
  const style = {};
  if (row.status !== "Confirmed") {
    style.color = "red";
  }
  return style;
};

const defaultSorted = [
  {
    dataField: "id",
    order: "desc",
  },
];

const NoDataToShow = () => {
  return (
    <img src={NoDataToShowImage} alt={""} className="fill dox_responsive_img" />
  );
};

// url path = '/all_groups'
class AllGroups extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_groups: [],
      is_loaded: false,
      selectedView: "table",
      selectedRefcode: null,
      currentPage: 1,
      groupsPerPage: 10,
      searchValue: "",
      totalFilteredGroups: 0,
      lastClickTime: 0,
      showing: "All",
    };
  }

  fetchGroups() {
    axios
      .get(GET_GROUPS, {
        headers: headers,
      })
      .then((res) => {
        const groups = res.data.all_groups;
        const filteredGroups = groups.filter((group) =>
          group.refcode
            .toLowerCase()
            .includes(this.state.searchValue.toLowerCase())
        );

        if (restrictedUsers().includes(localStorage.getItem("user"))) {
          this.setState({
            all_groups: groups.filter((group) => group.refcode.includes("HCG")),
            totalFilteredGroups: filteredGroups.length,
            is_loaded: true,
          });
        } else {
          this.setState({
            all_groups: groups,
            totalFilteredGroups: filteredGroups.length,
            is_loaded: true,
          });
        }
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error status 401",
          text: e.response.data.errormsg,
        });
      });
  }

  componentDidMount() {
    this.fetchGroups();
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
      this.fetchGroups();
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

  setSelectedRefcode = (refcode) => {
    this.setState({
      selectedRefcode: refcode,
    });
  };

  handleDoubleTap = (refcode) => {
    const { lastClickTime } = this.state;
    const currentTime = new Date().getTime();
    const tapTimeDifference = currentTime - lastClickTime;

    if (tapTimeDifference < 300) {
      window.location.href = "/group_management/group/" + refcode;
    }

    this.setState({ lastClickTime: currentTime });
  };

  setShowing(office) {
    this.setState({
      showing: office,
    });
  }

  render() {
    const { all_groups, currentPage, searchValue, totalFilteredGroups } =
      this.state;

    // Filter the all_groups array based on the search term
    const filteredGroups = all_groups.filter((group) =>
      group.refcode.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Calculate the index range of groups for the current page from the filtered array
    const indexOfLastGroup = currentPage * this.state.groupsPerPage;
    const indexOfFirstGroup = indexOfLastGroup - this.state.groupsPerPage;
    const currentGroups = filteredGroups.slice(
      indexOfFirstGroup,
      indexOfLastGroup
    );

    return (
      <div>
        <NavigationBar />
        {pageHeader("all_groups")}
        <div style={{ marginLeft: 20, borderRadius: 10 }}>
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
            <BsTable style={{ color: "#F3702D", fontSize: "1.5em" }} />
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
            <BsTablet style={{ color: "#F3702D", fontSize: "1.5em" }} />
          </Button>
          <Button
            style={{ marginLeft: 30 }}
            color={this.state.showing === "All" ? "green" : ""}
            onClick={() => this.setShowing("All")}
          >
            All
          </Button>
          <Button
            color={this.state.showing === "COA" ? "green" : ""}
            onClick={() => this.setShowing("COA")}
          >
            COA
          </Button>
          <Button
            color={this.state.showing === "COL" ? "green" : ""}
            onClick={() => this.setShowing("COL")}
          >
            COL
          </Button>
        </div>
        <div style={{ minHeight: 726 }}>
          {this.state.is_loaded ? (
            this.state.selectedView === "table" ? (
              <>
                <ToolkitProvider
                  keyField="id"
                  data={this.state.all_groups.filter((group) => {
                    if (this.state.showing === "All") {
                      return true;
                    } else {
                      return group.refcode.startsWith(this.state.showing);
                    }
                  })}
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
                      <div style={{ overflow: "x:auto" }}>
                        <BootstrapTable
                          id="all_groups_table"
                          {...props.baseProps}
                          pagination={paginationFactory(paginationOptions)}
                          hover
                          bordered={false}
                          striped
                          rowStyle={rowStyle}
                          filter={filterFactory()}
                        />
                      </div>
                    </div>
                  )}
                </ToolkitProvider>
              </>
            ) : (
              <>
                <div style={{ marginLeft: 20 }}>
                  <Input
                    icon="search"
                    placeholder="Search Refcode..."
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
                      {currentGroups.map((group) => (
                        <>
                          <Button
                            color={
                              this.state.selectedRefcode === group.refcode
                                ? "blue"
                                : "vk"
                            }
                            onClick={(e) => {
                              this.setSelectedRefcode(e.target.innerText);
                              this.handleDoubleTap(group.refcode);
                            }}
                            style={{ width: 300, margin: 10 }}
                          >
                            {group.refcode}
                          </Button>
                          <br />
                        </>
                      ))}
                    </Grid.Column>
                    <Grid.Column width={6}>
                      {this.state.all_groups
                        .filter((group) => group.refcode === this.state.selectedRefcode)
                        .map((group) => (
                          <>
                            <Card width={4}>
                              <Card.Header>
                                <BsInfoSquare
                                  style={{
                                    color: "#57585B",
                                    fontSize: "1.5em",
                                    marginRight: "0.5em",
                                  }}
                                />
                                Group Information
                              </Card.Header>
                              <Card.Body>
                                <ListGroup>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>ID</div>
                                    <div className={"info_span"}>
                                      {group.id}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>
                                      Reference Code
                                    </div>
                                    <div className={"info_span"}>
                                      {group.refcode ? (
                                        <a
                                          href={
                                            "/group_management/group/" +
                                            group.refcode
                                          }
                                          basic
                                          className={
                                            group.status === "Cancelled"
                                              ? "cnclled"
                                              : "cnfrmed"
                                          }
                                        >
                                          {group.refcode}
                                        </a>
                                      ) : (
                                        "N/A"
                                      )}
                                    </div>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                    <div className={"info_descr"}>
                                      Agent / Client
                                    </div>
                                    <div className={"info_span"}>
                                      {group.agent_or_client === "Agent" ? (
                                        <>
                                          <a
                                            href={
                                              "/data_management/agent/" +
                                              group.agent_id
                                            }
                                            basic
                                            id="cell_link"
                                            className={
                                              group.status === "Cancelled"
                                                ? "cnclled"
                                                : "cnfrmed"
                                            }
                                          >
                                            {group.agent_name} (
                                            {group.agent_or_client} )
                                          </a>
                                        </>
                                      ) : (
                                        <>
                                          <a
                                            href={
                                              "/data_management/client/" +
                                              group.client_id
                                            }
                                            basic
                                            className={
                                              group.status === "Cancelled"
                                                ? "cnclled"
                                                : "cnfrmed"
                                            }
                                            id="cell_link"
                                          >
                                            {group.client_name} (
                                            {group.agent_or_client} )
                                          </a>
                                        </>
                                      )}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Status</div>
                                    <div className={"info_span"}>
                                      {group.status === "Cancelled"
                                        ? "Cancelled"
                                        : "Confirmed"}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>
                                      Departure date
                                    </div>
                                    <div className={"info_span"}>
                                      {group.departure_date}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>
                                      Nationality
                                    </div>
                                    <div className={"info_span"}>
                                      {group.nationality_code ? (
                                        <>
                                          <ReactCountryFlag
                                            countryCode={group.nationality_code}
                                            svg
                                            style={{
                                              width: "2em",
                                              height: "2em",
                                              marginRight: 10,
                                            }}
                                            title={group.nationality.code}
                                          />
                                          {group.nationality
                                            ? group.nationality.name
                                            : "N/A"}
                                          {group.nationality}
                                        </>
                                      ) : (
                                        "N/A"
                                      )}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>PAX</div>
                                    <div className={"info_span"}>
                                      {group.number_of_people}
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
                    totalFilteredGroups / this.state.groupsPerPage
                  )}
                  marginPagesDisplayed={0}
                  pageRangeDisplayed={5}
                  onPageChange={this.handlePageChange}
                  containerClassName={"pagination"}
                  subContainerClassName={"pages react-pagination"}
                  activeClassName={"active"}
                />
              </>
            )
          ) : (
            loader()
          )}
          <AddGroupModal />
        </div>
        <Footer />
      </div>
    );
  }
}

export default AllGroups;
