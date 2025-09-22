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
import CreateDocumentModal from "../../modals/create/add_document";
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
const ALL_DOCUMENTS = "https://ultima.icsgr.com/api/data_management/all_documents/";

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
    formatter: (cell, row) => row.title || "",
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
    text: "Client surname",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.client?.surname || "",
  },
  {
    dataField: "client.name",
    text: "Client name",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.client?.name || "",
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
    text: "Valid until",
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
    dataField: "original",
    text: "Original",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.original ? "Yes" : "No",
  },
  {
    dataField: "trafficable",
    text: "Trafficable",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.trafficable ? "Yes" : "No",
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
      all_documents: [],
      is_loaded: false,
    };
  }

  fetchDocuments = () => {
    // Update headers with current token
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    axios
      .get(ALL_DOCUMENTS, {
        headers: currentHeaders,
      })
      .then((res) => {
        // Handle different response structures
        let allDocuments = [];

        if (Array.isArray(res.data)) {
          allDocuments = res.data;
        } else if (res.data && Array.isArray(res.data.results)) {
          allDocuments = res.data.results;
        } else if (res.data && Array.isArray(res.data.data)) {
          allDocuments = res.data.data;
        } else if (res.data && res.data.all_documents) {
          allDocuments = res.data.all_documents;
        } else {
          console.warn('Unexpected API response structure:', res.data);
          allDocuments = [];
        }
        
        this.setState({
          all_documents: allDocuments,
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
            text: "Failed to load documents. Please try again.",
          });
        }
        // Set empty array on error to prevent filter issues
        this.setState({
          all_documents: [],
          is_loaded: true,
        });
      });
  };

  componentDidMount() {
    this.fetchDocuments();
  }

  render() {
    // Ensure we always have an array for the table
    const tableData = Array.isArray(this.state.all_documents) ? this.state.all_documents : [];
    
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("all_documents")}
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
                    <CreateDocumentModal onClientCreated={this.fetchDocuments} />
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

export default AllDocuments;
