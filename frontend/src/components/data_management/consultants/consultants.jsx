import { apiGet, apiPost, apiPut, apiDelete, API_ENDPOINTS } from '../../../utils/api';
// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Modules / Functions

import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Swal from "sweetalert2";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Button } from "react-bootstrap";

// CSS
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Icons / Images
import NoDataToShowImage from "../../../images/generic/no_results_found.png";

// Global Variables
import {
  paginationOptions,
  headers,
} from "../../global_vars";

// Variables
window.Swal = Swal;

const columns = [
  {
    dataField: "consultant_id",
    text: "ID",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button variant="link" className="p-0">
        <a href={"/data_management/consultants/" + row.consultant_id} className="text-decoration-none">
          {row.consultant_id}
        </a>
      </Button>
    ),
  },
  {
    dataField: "fullname",
    text: "Full Name",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "phone",
    text: "Phone",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "mobile",
    text: "Mobile",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "email",
    text: "Email",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "orderindex",
    text: "Order Index",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "role",
    text: "Role",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      const roleLabels = {
        'A': 'Administrator',
        'S': 'Supervisor',
        'U': 'Superuser',
        'C': 'User'
      };
      return roleLabels[row.role] || row.role;
    },
  },
  {
    dataField: "canassigntask",
    text: "Can Assign Tasks",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <span className={row.canassigntask ? "text-success" : "text-danger"}>
        {row.canassigntask ? "Yes" : "No"}
      </span>
    ),
  },
  {
    dataField: "active",
    text: "Active",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <span className={row.active ? "text-success" : "text-danger"}>
        {row.active ? "Yes" : "No"}
      </span>
    ),
  },
];

const defaultSorted = [
  {
    dataField: "orderindex",
    order: "asc",
  },
];

const NoDataToShow = () => {
  return <img src={NoDataToShowImage} alt={""} className="fill" />;
};

class Consultants extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      consultants: [],
      is_loaded: false,
      currentPage: 1,
      consultantsPerPage: 10,
    };
  }

  async fetchConsultants() {
    this.setState({ is_loaded: false });
    try {
      const consultants = await apiGet(API_ENDPOINTS.CONSULTANTS);
      this.setState({
        consultants: consultants,
        is_loaded: true,
      });
    } catch (error) {
      console.log(error);
      if (error.message === 'Authentication required') {
        this.setState({
          forbidden: true,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load consultants.",
        });
      }
      this.setState({ is_loaded: true });
    }
  }

  handlePageChange = (selectedPage) => {
    this.setState({
      currentPage: selectedPage.selected + 1,
    });
  };

  componentDidMount() {
    this.fetchConsultants();
  }

  render() {
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Consultants</h2>
            <Button
              variant="primary"
              onClick={() => this.props.history.push('/data_management/consultants/new')}
            >
              New Consultant
            </Button>
          </div>
          <ToolkitProvider
            keyField="consultant_id"
            data={this.state.consultants}
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
                  loading={!this.state.is_loaded}
                />
              </div>
            )}
          </ToolkitProvider>
        </div>
        <Footer />
      </>
    );
  }
}

export default Consultants;
