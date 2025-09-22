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
import CreateClientContactModal from "../../modals/create/add_client_contact";
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
const ALL_CLIENT_CONTACTS = "https://ultima.icsgr.com/api/data_management/client_contacts/";

const columns = [
  {
    dataField: "clientcont_id",
    text: "Contact ID",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button>
        <a href={"/data_management/client_contact/" + row.clientcont_id} basic id="cell_link">
          {row.clientcont_id}
        </a>
      </Button>
    ),
  },
  {
    dataField: "fullname",
    text: "Full name",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "connection",
    text: "Connection",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.connection || "",
  },
  {
    dataField: "email",
    text: "E-mail",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.email || "",
  },
  {
    dataField: "phone",
    text: "Telephone",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.phone || "",
  },
  {
    dataField: "mobile",
    text: "Cell phone",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.mobile || "",
  },
  {
    dataField: "profession",
    text: "Profession",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.profession || "",
  },
  {
    dataField: "reliability",
    text: "Reliability",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      if (row.reliability === 'High') return 'High';
      if (row.reliability === 'Medium') return 'Medium';
      if (row.reliability === 'Low') return 'Low';
      return row.reliability || "";
    },
  },
  {
    dataField: "city",
    text: "City",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.city || "",
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
    dataField: "fullname",
    order: "asc",
  },
];

class AllClientContacts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_client_contacts: [],
      is_loaded: false,
    };
  }

  fetchClientContacts = () => {
    // Update headers with current token
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    axios
      .get(ALL_CLIENT_CONTACTS, {
        headers: currentHeaders,
      })
      .then((res) => {
        // Handle different response structures
        let allClientContacts = [];

        if (Array.isArray(res.data)) {
          allClientContacts = res.data;
        } else if (res.data && Array.isArray(res.data.results)) {
          allClientContacts = res.data.results;
        } else if (res.data && Array.isArray(res.data.data)) {
          allClientContacts = res.data.data;
        } else if (res.data && res.data.all_client_contacts) {
          allClientContacts = res.data.all_client_contacts;
        } else {
          console.warn('Unexpected API response structure:', res.data);
          allClientContacts = [];
        }
        
        this.setState({
          all_client_contacts: allClientContacts,
          is_loaded: true,
        });
      })
      .catch((e) => {
        console.error('Error fetching client contacts:', e);
        if (e?.response?.status === 401) {
          this.setState({ forbidden: true });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to load client contacts. Please try again.",
          });
        }
        // Set empty array on error to prevent filter issues
        this.setState({
          all_client_contacts: [],
          is_loaded: true,
        });
      });
  };

  componentDidMount() {
    this.fetchClientContacts();
  }

  render() {
    // Ensure we always have an array for the table
    const tableData = Array.isArray(this.state.all_client_contacts) ? this.state.all_client_contacts : [];
    
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("all_client_contacts")}
          <div className="contentContainer">
            <div className="contentBody">
              {this.state.is_loaded ? (
                <>
                  <ToolkitProvider
                    bootstrap4
                    keyField="clientcont_id"
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
                    <CreateClientContactModal refreshData={this.fetchClientContacts} />
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

export default AllClientContacts;
