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
import CreateAssociatedClientModal from "../../modals/create/add_associated_client";
import { Button } from "semantic-ui-react";

// CSS
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Global Variables
import {
  paginationOptions,
  headers,
  loader,
  pageHeader,
} from "../../global_vars";

// Variables
window.Swal = Swal;

// API endpoint
const ALL_ASSOCIATED_CLIENTS = "https://ultima.icsgr.com/api/data_management/associated_clients/";

const columns = [
  {
    dataField: "assoclient_id",
    text: "Associated Client ID",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button>
        <a href={"/data_management/associated_client/" + row.assoclient_id} basic id="cell_link">
          {row.assoclient_id}
        </a>
      </Button>
    ),
  },
  {
    dataField: "project.title",
    text: "Project",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.project?.title || "",
  },
  {
    dataField: "client.surname",
    text: "Client Surname",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.client?.surname || "",
  },
  {
    dataField: "client.name",
    text: "Client Name",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.client?.name || "",
  },
  {
    dataField: "orderindex",
    text: "Order by",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "notes",
    text: "Notes",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.notes || "",
  },
];

const defaultSorted = [
  {
    dataField: "orderindex",
    order: "asc",
  },
];

class AllAssociatedClients extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_associated_clients: [],
      is_loaded: false,
    };
  }

  fetchAssociatedClients = () => {
    // Update headers with current token
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    axios
      .get(ALL_ASSOCIATED_CLIENTS, {
        headers: currentHeaders,
      })
      .then((res) => {
        // Handle different response structures
        let allAssociatedClients = [];

        if (Array.isArray(res.data)) {
          allAssociatedClients = res.data;
        } else if (res.data && Array.isArray(res.data.results)) {
          allAssociatedClients = res.data.results;
        } else if (res.data && Array.isArray(res.data.data)) {
          allAssociatedClients = res.data.data;
        } else if (res.data && res.data.all_associated_clients) {
          allAssociatedClients = res.data.all_associated_clients;
        } else {
          console.warn('Unexpected API response structure:', res.data);
          allAssociatedClients = [];
        }
        
        this.setState({
          all_associated_clients: allAssociatedClients,
          is_loaded: true,
        });
      })
      .catch((e) => {
        console.error('Error fetching associated clients:', e);
        if (e?.response?.status === 401) {
          this.setState({ forbidden: true });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to load associated clients. Please try again.",
          });
        }
        // Set empty array on error to prevent filter issues
        this.setState({
          all_associated_clients: [],
          is_loaded: true,
        });
      });
  };

  componentDidMount() {
    this.fetchAssociatedClients();
  }

  render() {
    // Ensure we always have an array for the table
    const tableData = Array.isArray(this.state.all_associated_clients) ? this.state.all_associated_clients : [];
    
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("all_associated_clients")}
          <div className="contentContainer">
            <div className="contentBody">
              {this.state.is_loaded ? (
                <>
                  <ToolkitProvider
                    bootstrap4
                    keyField="assoclient_id"
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
                    <CreateAssociatedClientModal onClientCreated={this.fetchAssociatedClients} />
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

export default AllAssociatedClients;
