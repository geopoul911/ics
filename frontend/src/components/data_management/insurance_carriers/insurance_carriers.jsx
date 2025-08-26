// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Modules / Functions
import { apiGet, API_ENDPOINTS } from '../../../utils/api';
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Swal from "sweetalert2";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Button } from "semantic-ui-react";

// CSS
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Icons / Images
import NoDataToShowImage from "../../../images/generic/no_results_found.png";

// Global Variables
import {
  paginationOptions,
  pageHeader,
} from "../../global_vars";

// Variables
window.Swal = Swal;

const columns = [
  {
    dataField: "insucarrier_id",
    text: "ID",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button>
        <a href={"/data_management/insurance_carriers/" + row.insucarrier_id} basic id="cell_link">
          {row.insucarrier_id}
        </a>
      </Button>
    ),
  },
  {
    dataField: "title",
    text: "Title",
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

class InsuranceCarriers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      insurance_carriers: [],
      is_loaded: false,
      currentPage: 1,
      carriersPerPage: 10,
    };
  }

  async fetchInsuranceCarriers() {
    this.setState({ is_loaded: false });
    try {
      const carriers = await apiGet(API_ENDPOINTS.INSURANCE_CARRIERS);
      this.setState({
        insurance_carriers: carriers,
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
          text: "Failed to load insurance carriers.",
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
    this.fetchInsuranceCarriers();
  }

  render() {
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("insurance_carriers")}
          <div className="mb-3">
            <Button
              variant="primary"
              onClick={() => this.props.history.push("/data_management/insurance_carriers/new")}
            >
              New Insurance Carrier
            </Button>
          </div>
          <ToolkitProvider
            keyField="insucarrier_id"
            data={this.state.insurance_carriers}
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

export default InsuranceCarriers;
