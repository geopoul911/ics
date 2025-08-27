// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import AddDocumentModal from "../../modals/create/add_document";

// Modules / Functions
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Swal from "sweetalert2";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Button } from "semantic-ui-react";
import axios from "axios";

// Headers
import { headers } from "../../global_vars";

// CSS
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Global Variables
import {
  paginationOptions,
  pageHeader,
} from "../../global_vars";

// Variables
window.Swal = Swal;

// API endpoint for documents
const ALL_DOCUMENTS = "http://localhost:8000/api/data_management/all_documents/";

const columns = [
  {
    dataField: "document_id",
    text: "Document ID",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button>
        <a href={"/data_management/document/" + row.document_id} basic id="cell_link">
          {row.document_id}
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
    dataField: "project.title",
    text: "Project",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.project?.title || "",
  },
  {
    dataField: "client.fullname",
    text: "Client",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.client?.fullname || "",
  },
  {
    dataField: "created",
    text: "Created",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      if (row.created) {
        return new Date(row.created).toLocaleDateString();
      }
      return "";
    },
  },
  {
    dataField: "validuntil",
    text: "Valid Until",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      if (row.validuntil) {
        return new Date(row.validuntil).toLocaleDateString();
      }
      return "";
    },
  },
  {
    dataField: "status",
    text: "Status",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.status || "",
  },
  {
    dataField: "is_expired",
    text: "Expired",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <span className={row.is_expired ? "text-danger" : "text-success"}>
        {row.is_expired ? "Yes" : "No"}
      </span>
    ),
  },
  {
    dataField: "original",
    text: "Original",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <span className={row.original ? "text-success" : "text-secondary"}>
        {row.original ? "Yes" : "No"}
      </span>
    ),
  },
];

const defaultSorted = [
  {
    dataField: "created",
    order: "desc",
  },
];

class AllDocuments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      is_loaded: false,
    };
  }

  componentDidMount() {
    this.fetchDocuments();
  }

  fetchDocuments = () => {
    // Update headers with current token
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    axios
      .get(ALL_DOCUMENTS, { headers: currentHeaders })
      .then((res) => {
        // Handle different response structures
        let documents = [];

        if (Array.isArray(res.data)) {
          documents = res.data;
        } else if (res.data && Array.isArray(res.data.results)) {
          documents = res.data.results;
        } else if (res.data && Array.isArray(res.data.data)) {
          documents = res.data.data;
        } else if (res.data && res.data.all_documents) {
          documents = res.data.all_documents;
        } else {
          console.warn('Unexpected API response structure:', res.data);
          documents = [];
        }
        
        this.setState({
          tableData: documents,
          is_loaded: true,
        });
      })
      .catch((e) => {
        console.error('Error fetching documents:', e);
        if (e?.response?.status === 401) {
          this.setState({ forbidden: true });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An unknown error has occurred.",
          });
        }
        // Set empty array on error to prevent filter issues
        this.setState({
          tableData: [],
          is_loaded: true,
        });
      });
  };

  render() {
    // Ensure we always have an array for the table
    const tableData = Array.isArray(this.state.tableData) ? this.state.tableData : [];
    
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("documents")}
          <div className="contentContainer">
            <div className="contentBody">
              {this.state.is_loaded ? (
                <>
                  <ToolkitProvider
                    bootstrap4
                    keyField="document_id"
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
                    <AddDocumentModal onDocumentCreated={this.fetchDocuments} />
                  </div>
                </>
              ) : (
                <div>Loading...</div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
}

export default AllDocuments;
