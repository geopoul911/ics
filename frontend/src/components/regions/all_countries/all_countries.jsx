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
import AddCountryModal from "../../modals/create/add_country";
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

const GET_COUNTRIES = "http://localhost:8000/api/regions/all_countries/";

const columns = [
  {
    dataField: "country_id",
    text: "ID",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button>
        <a href={"/regions/country/" + row.country_id} basic id="cell_link">
          {row.country_id}
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
    dataField: "currency",
    text: "Currency",
    sort: true,
    filter: textFilter(),
  },

      {
    dataField: "orderindex",
    text: "Order Index",
    sort: true,
    filter: textFilter(),
  },
]

const defaultSorted = [
  {
    dataField: "id",
    order: "desc",
  },
];

const NoDataToShow = () => {
  return <img src={NoDataToShowImage} alt={""} className="fill" />;
};

class AllCountries extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_countries: [],
      is_loaded: true,
      currentPage: 1,
      countriesPerPage: 10,
    };
  }

  fetchCountries() {
    axios
      .get(GET_COUNTRIES, {
        headers: headers,
      })
      .then((res) => {
        const allCountries = res.data.all_countries;
        this.setState({
          all_countries: allCountries,
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
    this.fetchCountries();
  }

  render() {
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("all_countries")}
            <ToolkitProvider
              keyField={(row, index) => index}
              data={this.state.all_countries}
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
            <AddCountryModal/>
          </div>
        <Footer />
      </>
    );
  }
}

export default AllCountries;
