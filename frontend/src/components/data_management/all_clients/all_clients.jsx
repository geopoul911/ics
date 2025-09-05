// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import axios from "axios";

// Modules / Functions
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Swal from "sweetalert2";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import AddClientModal from "../../modals/create/add_client";
import { Button } from "semantic-ui-react";

// CSS
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Global Variables
import {
  paginationOptions,
  headers,
  pageHeader,
  loader,
} from "../../global_vars";

// Variables
window.Swal = Swal;

// API endpoint
const ALL_CLIENTS = "http://localhost:8000/api/data_management/clients/";

const columns = [
  {
    dataField: "client_id",
    text: "Client ID",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button>
        <a href={"/data_management/client/" + row.client_id} basic id="cell_link">
          {row.client_id}
        </a>
      </Button>
    ),
  },
  {
    dataField: "surname",
    text: "Surname",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "name",
    text: "Name",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "email",
    text: "E-mail",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.email || "",
  },
  {
    dataField: "phone1",
    text: "Telephone 1",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.phone1 || "",
  },
  {
    dataField: "mobile1",
    text: "Cell phone 1",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.mobile1 || "",
  },
  {
    dataField: "country.title",
    text: "Country",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.country?.title || "",
  },
  {
    dataField: "city.title",
    text: "City",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.city?.title || "",
  },
  {
    dataField: "registrationdate",
    text: "Entered",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      if (row.registrationdate) {
        return new Date(row.registrationdate).toLocaleDateString();
      }
      return "";
    },
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
    dataField: "registrationdate",
    order: "desc",
  },
];

class AllClients extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_clients: [],
      is_loaded: false,
    };
  }

  fetchClients = () => {
    // Update headers with current token
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    axios
      .get(ALL_CLIENTS, {
        headers: currentHeaders,
      })
      .then((res) => {
        // Handle different response structures
        let allClients = [];

        if (Array.isArray(res.data)) {
          allClients = res.data;
        } else if (res.data && Array.isArray(res.data.results)) {
          allClients = res.data.results;
        } else if (res.data && Array.isArray(res.data.data)) {
          allClients = res.data.data;
        } else if (res.data && res.data.all_clients) {
          allClients = res.data.all_clients;
        } else {
          console.warn('Unexpected API response structure:', res.data);
          allClients = [];
        }
        
        this.setState({
          all_clients: allClients,
          is_loaded: true,
        });
      })
      .catch((e) => {
        console.error('Error fetching clients:', e);
        if (e?.response?.status === 401) {
          this.setState({ forbidden: true });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to load clients. Please try again.",
          });
        }
        // Set empty array on error to prevent filter issues
        this.setState({
          all_clients: [],
          is_loaded: true,
        });
      });
  };

  componentDidMount() {
    this.fetchClients();
  }

  render() {
    // Ensure we always have an array for the table
    const tableData = Array.isArray(this.state.all_clients) ? this.state.all_clients : [];
    
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("all_clients")}
          <div className="contentContainer">
            <div className="contentBody">
              {this.state.is_loaded ? (
                <>
                  <ToolkitProvider
                    bootstrap4
                    keyField="client_id"
                    data={tableData}
                    columns={columns}
                    search
                    condensed
                  >
                    {(props) => (
                      <div>
                        <BootstrapTable
                          {...props.baseProps}
                          pagination={paginationFactory(paginationOptions)}
                          filter={filterFactory()}
                          defaultSorted={defaultSorted}
                          hover
                          bordered={false}
                          striped
                        />
                      </div>
                    )}
                  </ToolkitProvider>
                  <div className="contentHeader">
                    <AddClientModal onClientCreated={this.fetchClients} />
                  </div>
                </>
              ) : (
                <div>{loader()}</div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
}

export default AllClients;
