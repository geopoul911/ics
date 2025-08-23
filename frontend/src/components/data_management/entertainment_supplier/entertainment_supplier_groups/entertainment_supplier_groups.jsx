// Built-ins
import React from "react";

// Functions / modules
import axios from "axios";
import { Grid } from "semantic-ui-react";
import Swal from "sweetalert2";
import { Card } from "react-bootstrap";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, {
  textFilter,
  selectFilter,
} from "react-bootstrap-table2-filter";

// Custom Made Components
import NoDataToShowImage from "../../../../images/generic/no_results_found.png";

import { GiOfficeChair } from "react-icons/gi";


// Global Variables
import {
  headers,
  loader,
  pageHeader,
  forbidden,
  restrictedUsers,
  paginationOptions,
  iconStyle,
} from "../../../global_vars";

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

// Variables
const VIEW_ENTERTAINMENT_SUPPLIER = "http://localhost:8000/api/data_management/entertainment_supplier/";

function getEntertainmentSupplierId() {
  return window.location.pathname.split("/")[3];
}

// Variables
window.Swal = Swal;

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
    dataField: "status",
    text: "Status",
    sort: true,
    filter: selectFilter({
      options: statusFilterOptions,
    }),
  },
  {
    dataField: "number_of_people",
    text: "PAX",
    sort: true,
    filter: textFilter(),
  },
];


class EntertainmentSupplierOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      entertainment_supplier: {},
      is_loaded: false,
      forbidden: false,
    };
  }

  componentDidMount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_ENTERTAINMENT_SUPPLIER + getEntertainmentSupplierId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          entertainment_supplier: res.data.entertainment_supplier,
          groups: res.data.groups,
          is_loaded: true,
        });
      })
      .catch((e) => {
        console.log(e);
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

  update_state = (update_state) => {
    this.setState({ entertainment_supplier: update_state });
  };

  render() {
    return (
      <>
        <div className="mainContainer">
          {pageHeader("entertainment_supplier_groups", this.state.entertainment_supplier.name)}
          {this.state.forbidden ? (
            <>
              {forbidden("Entertainment Supplier Groups")}
            </>
          ) : this.state.is_loaded ? (
            <>
              <Grid columns={3} divided stackable>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <GiOfficeChair style={iconStyle} /> COA
                    </Card.Header>
                    <Card.Body>
                      <ToolkitProvider
                          keyField="id"
                          data={this.state.groups.filter(group => group.refcode.startsWith('COA'))}
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
                                  {...props.baseProps}
                                  id="agent_groups_table"
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
                    </Card.Body>
                    <Card.Footer>
                    </Card.Footer>
                  </Card>
                </Grid.Column>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                    <GiOfficeChair style={iconStyle} /> COL
                    </Card.Header>
                    <Card.Body>
                      <ToolkitProvider
                        keyField="id"
                        data={this.state.groups.filter(group => group.refcode.startsWith('COL'))}
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
                                {...props.baseProps}
                                id="agent_groups_table"
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
                    </Card.Body>
                    <Card.Footer>
                    </Card.Footer>
                  </Card>
                </Grid.Column>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                    <GiOfficeChair style={iconStyle} /> TRA / TRB / TRL
                    </Card.Header>
                    <Card.Body>
                    <ToolkitProvider
                        keyField="id"
                        data={this.state.groups.filter(group =>
                          group.refcode.startsWith('TRA') ||
                          group.refcode.startsWith('TRB') ||
                          group.refcode.startsWith('TRL')
                        )}
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
                                {...props.baseProps}
                                id="agent_groups_table0"
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
                    </Card.Body>
                    <Card.Footer>
                    </Card.Footer>
                  </Card>
                </Grid.Column>
              </Grid>
            </>
          ) : (
            loader()
          )}
        </div>
      </>
    );
  }
}

export default EntertainmentSupplierOverView;
