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
import { Button } from "semantic-ui-react";

// CSS
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Icons / Images
import NoDataToShowImage from "../../../images/generic/no_results_found.png";

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

const GET_REGIONS = "http://localhost/api/data_management/all_regions/";

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
      <a href={`/data_management/region/${row.type.toLowerCase()}/${row.id}`}>
        {row.name}
      </a>
    ),
  },
  {
    dataField: "parent",
    text: "Parent Region",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "type",
    text: "Region Type",
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

class AllRegions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_regions: [],
      is_loaded: true,
      currentPage: 1,
      regionsPerPage: 10,
      showing: "All",
    };
  }

  fetchRegions() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    axios
      .get(GET_REGIONS, {
        headers: headers,
      })
      .then((res) => {
        const allRegions = res.data.all_regions;
        this.setState({
          all_regions: allRegions,
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

  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchValue !== this.state.searchValue) {
      // this.fetchRegions();
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

  componentDidMount(prevProps, prevState) {
    this.fetchRegions();
  }

  setShowing(office) {
    this.setState({
      showing: office,
    });
  }

  render() {
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("all_regions")}
          <div style={{ margin: 10, borderRadius: 10 }}>
            <Button
              style={{ marginLeft: 30 }}
              color={this.state.showing === "All" ? "green" : ""}
              onClick={() => this.setShowing("All")}
            >
              All
            </Button>
            <Button
              color={this.state.showing === "Country" ? "green" : ""}
              onClick={() => this.setShowing("Country")}
            >
              Countries
            </Button>
            <Button
              color={this.state.showing === "City" ? "green" : ""}
              onClick={() => this.setShowing("City")}
            >
              City
            </Button>
            <Button
              color={this.state.showing === "Province" ? "green" : ""}
              onClick={() => this.setShowing("Province")}
            >
              Provinces
            </Button>

          </div>
          {this.state.forbidden ? (
            <>{forbidden("All Regions")}</>
          ) : this.state.is_loaded ? (
              <>
                <ToolkitProvider
                  keyField={(row, index) => index}
                  data={this.state.all_regions.filter((region) => {
                    if (this.state.showing === "All") {
                      return true;
                    } else {
                      return region.type === this.state.showing;
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
              </>
          ) : (
            loader()
          )}
        </div>
        <Footer />
      </>
    );
  }
}

export default AllRegions;
