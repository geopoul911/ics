// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Modules / Functions
import axios from "axios";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Swal from "sweetalert2";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import AddProvinceModal from "../../modals/create/add_province";
import { Button } from "semantic-ui-react";

// CSS
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Icons / Images
import NoDataToShowImage from "../../../images/generic/no_results_found.png";

// Global Variables
import {
  paginationOptions,
  headers,
  pageHeader,
} from "../../global_vars";

// Variables
window.Swal = Swal;

const GET_PROVINCES = "http://localhost:8000/api/regions/all_provinces/";

const columns = [
  {
    dataField: "province_id",
    text: "ID",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button>
        <a href={"/regions/province/" + row.province_id} basic id="cell_link">
          {row.province_id}
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
    dataField: "country",
    text: "Country",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button>
        <a href={"/regions/country/" + row.country} basic id="cell_link">
          {row.country}
        </a>
      </Button>
    ),
  },
  {
    dataField: "orderindex",
    text: "Order Index",
    sort: true,
    filter: textFilter(),
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

class AllProvinces extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_provinces: [],
      is_loaded: true,
      currentPage: 1,
      provincesPerPage: 10,
    };
  }

  fetchProvinces() {
    axios
      .get(GET_PROVINCES, {
        headers: headers,
      })
      .then((res) => {
        const allProvinces = res.data.all_provinces;
        this.setState({
          all_provinces: allProvinces,
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

  handlePageChange = (selectedPage) => {
    this.setState({
      currentPage: selectedPage.selected + 1,
    });
  };

  componentDidMount() {
    this.fetchProvinces();
  }

  render() {
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("all_provinces")}
            <ToolkitProvider
              keyField={(row, index) => index}
              data={this.state.all_provinces}
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
                  />
                </div>
              )}
            </ToolkitProvider>
            <AddProvinceModal/>
          </div>
        <Footer />
      </>
    );
  }
}

export default AllProvinces;
