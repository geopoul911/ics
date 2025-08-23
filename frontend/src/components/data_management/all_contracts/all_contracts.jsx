// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import NoDataToShowImage from "../../../images/generic/no_results_found.png";
import AddContractModal from "../../modals/create/add_contract_modal";

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
  // selectFilter,
} from "react-bootstrap-table2-filter";
import moment from "moment";

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

const GET_CONTRACTS =
  "http://localhost:8000/api/data_management/all_contracts/";

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
  if (row.status !== "Enabled") {
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
    filter: textFilter(),
    formatter: (cell, row) => (
      <>
        <a
          href={"/data_management/contract/" + row.id}
          basic
          id="cell_link"
          className={row.status === "Enabled" ? "" : "cnclled"}
        >
          {row.name}
        </a>
      </>
    ),
  },
  {
    dataField: "supplier_type",
    text: "Supplier Type",
    sort: true,
  },

  {
    dataField: "period",
    text: "Period",
    sort: true,
    filter: textFilter(),
  },

  {
    dataField: "currency",
    text: "Currency",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "status",
    text: "Status",
    sort: true,
    formatter: (cell, row) => (
      <>
        {row.status === "Enabled" ? (
          <TiTick style={tick_style} />
        ) : (
          <ImCross style={cross_style} />
        )}
      </>
    ),
  },

  {
    dataField: "document",
    text: "Document",
    sort: true,
    formatter: (cell, row) => (
      <>
        {row.document ? (
          <TiTick style={tick_style} />
        ) : (
          <ImCross style={cross_style} />
        )}
      </>
    ),
  },

  {
    dataField: "date_created",
    text: "Date Created",
    sort: true,
    formatter: (cell, row) => (
      <>{moment(row.date_created).format("MMMM DD, YYYY [at] HH:mm:ss")}</>
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

// AllContracts page Class
// url path = '/all_contracts'
class AllContracts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_contracts: [],
      is_loaded: false,
      selectedView: "table",
      selectedName: null,
      currentPage: 1,
      contractsPerPage: 10,
      searchValue: "",
      totalFilteredContracts: 0,
      lastClickTime: 0,
      forbidden: false,
    };
  }

  fetchContracts() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    axios
      .get(GET_CONTRACTS, {
        headers: headers,
      })
      .then((res) => {
        const allContracts = res.data.all_contracts;
        const filteredContracts = allContracts.filter((contract) =>
          contract.name
            .toLowerCase()
            .includes(this.state.searchValue.toLowerCase())
        );
        this.setState({
          all_contracts: allContracts,
          totalFilteredContracts: filteredContracts.length,
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
    this.fetchContracts();
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
      this.fetchContracts();
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

  handleDoubleTap = (contract_id) => {
    const { lastClickTime } = this.state;
    const currentTime = new Date().getTime();
    const tapTimeDifference = currentTime - lastClickTime;

    if (tapTimeDifference < 300) {
      window.location.href = "/data_management/contract/" + contract_id;
    }

    this.setState({ lastClickTime: currentTime });
  };

  render() {
    const { all_contracts, currentPage, searchValue, totalFilteredContracts } =
      this.state;

    // Filter the all_contracts array based on the search term
    const filteredContracts = all_contracts.filter((contract) =>
      contract.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Calculate the index range of contracts for the current page from the filtered array
    const indexOfLastContract = currentPage * this.state.contractsPerPage;
    const indexOfFirstContract =
      indexOfLastContract - this.state.contractsPerPage;
    const currentContracts = filteredContracts.slice(
      indexOfFirstContract,
      indexOfLastContract
    );

    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("all_contracts")}
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
            <>{forbidden("All Contracts")}</>
          ) : this.state.is_loaded ? (
            this.state.selectedView === "table" ? (
              <>
                <ToolkitProvider
                  keyField="id"
                  data={this.state.all_contracts}
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
                        id="all_contracts_table"
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
                <AddContractModal redir={true} />
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
                      {currentContracts.map((contract) => (
                        <>
                          <Button
                            color={
                              this.state.selectedName === contract.name
                                ? "blue"
                                : "vk"
                            }
                            onClick={(e) => {
                              this.setSelectedName(e.target.innerText);
                              this.handleDoubleTap(contract.id);
                            }}
                            style={{ width: 300, margin: 10 }}
                          >
                            {contract.name}
                          </Button>
                          <br />
                        </>
                      ))}
                    </Grid.Column>
                    <Grid.Column width={6}>
                      {this.state.all_contracts
                        .filter(
                          (contract) =>
                            contract.name === this.state.selectedName
                        )
                        .map((contract) => (
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
                                Contract Information
                              </Card.Header>
                              <Card.Body>
                                <ListGroup>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>ID</div>
                                    <div className={"info_span"}>
                                      {contract.id}
                                    </div>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Name</div>
                                    <div
                                      className={
                                        contract.status === "Enabled"
                                          ? "info_span"
                                          : "red_info_span"
                                      }
                                    >
                                      <a
                                        href={
                                          "/data_management/contract/" +
                                          contract.id
                                        }
                                        basic
                                        id="cell_link"
                                        className={
                                          contract.status === "Enabled"
                                            ? ""
                                            : "cnclled"
                                        }
                                      >
                                        {contract.name}
                                      </a>
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Type</div>
                                    <div className={"info_span"}>
                                      {contract.supplier_type}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Period</div>
                                    <div className={"info_span"}>
                                      {contract.period}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Currency</div>
                                    <div className={"info_span"}>
                                      {contract.currency}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Status</div>
                                    <div className={"info_span"}>
                                      {contract.status === "Enabled" ? (
                                        <TiTick style={tick_style} />
                                      ) : (
                                        <ImCross style={cross_style} />
                                      )}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Document</div>
                                    <div className={"info_span"}>
                                      {contract.document ? (
                                        <TiTick style={tick_style} />
                                      ) : (
                                        <ImCross style={cross_style} />
                                      )}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>
                                      Date Created
                                    </div>
                                    <div className={"info_span"}>
                                      {moment(contract.date_created).format(
                                        "MMMM DD, YYYY [at] HH:mm:ss"
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
                    totalFilteredContracts / this.state.contractsPerPage
                  )}
                  marginPagesDisplayed={0}
                  pageRangeDisplayed={5}
                  onPageChange={this.handlePageChange}
                  containerClassName={"pagination"}
                  subContainerClassName={"pages react-pagination"}
                  activeClassName={"active"}
                />
                <AddContractModal redir={true} />
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

export default AllContracts;
