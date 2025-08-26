import { apiGet, API_ENDPOINTS } from '../../../utils/api';
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
import { Button, Badge } from "react-bootstrap";

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

// Helper function to get document status
const getDocumentStatus = (document) => {
  if (document.sent_to_athens) return { status: 'Sent to Athens', color: 'info' };
  if (document.sent_to_toronto) return { status: 'Sent to Toronto', color: 'warning' };
  if (document.sent_to_montreal) return { status: 'Sent to Montreal', color: 'primary' };
  if (document.received_from_athens) return { status: 'Received from Athens', color: 'success' };
  if (document.received_from_toronto) return { status: 'Received from Toronto', color: 'success' };
  if (document.received_from_montreal) return { status: 'Received from Montreal', color: 'success' };
  return { status: 'Created', color: 'secondary' };
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (!bytes) return '';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

const columns = [
  {
    dataField: "document_id",
    text: "ID",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button variant="link" className="p-0">
        <a href={"/data_management/documents/" + row.document_id} className="text-decoration-none">
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
    formatter: (cell, row) => {
      const title = row.title || '';
      return title.length > 50 ? title.substring(0, 50) + '...' : title;
    },
  },
  {
    dataField: "project.title",
    text: "Project",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      const projectTitle = row.project?.title || '';
      return projectTitle.length > 40 ? projectTitle.substring(0, 40) + '...' : projectTitle;
    },
  },
  {
    dataField: "documenttype",
    text: "Document Type",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "validuntil",
    text: "Valid Until",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      if (!row.validuntil) return '';
      const validUntil = new Date(row.validuntil);
      const today = new Date();
      const isExpired = validUntil < today;
      
      return (
        <span className={isExpired ? 'text-danger' : ''}>
          {validUntil.toLocaleDateString()}
          {isExpired && <Badge bg="danger" className="ms-1">Expired</Badge>}
        </span>
      );
    },
  },
  {
    dataField: "status",
    text: "Status",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      const statusInfo = getDocumentStatus(row);
      return (
        <Badge bg={statusInfo.color}>
          {statusInfo.status}
        </Badge>
      );
    },
  },
  {
    dataField: "filename",
    text: "File",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      if (!row.filename) return '';
      return (
        <div>
          <div className="fw-bold">{row.filename}</div>
          {row.filesize && (
            <small className="text-muted">{formatFileSize(row.filesize)}</small>
          )}
        </div>
      );
    },
  },
  {
    dataField: "uploaddate",
    text: "Upload Date",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      return row.uploaddate ? new Date(row.uploaddate).toLocaleDateString() : '';
    },
  },
  {
    dataField: "uploadedby.fullname",
    text: "Uploaded By",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.uploadedby?.fullname || '',
  },
  {
    dataField: "active",
    text: "Active",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Badge bg={row.active ? 'success' : 'secondary'}>
        {row.active ? 'Yes' : 'No'}
      </Badge>
    ),
  },
];

const defaultSorted = [
  {
    dataField: "uploaddate",
    order: "desc",
  },
];

const NoDataToShow = () => {
  return <img src={NoDataToShowImage} alt={""} className="fill" />;
};

class Documents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      documents: [],
      is_loaded: false,
      currentPage: 1,
      documentsPerPage: 10,
    };
  }

  fetchDocuments() {
    this.setState({ is_loaded: false });
    apiGet(API_ENDPOINTS.DOCUMENTS, {
        headers: headers,
      })
      .then((res) => {
        const documents = res.data;
        this.setState({
          documents: documents,
          is_loaded: true,
        });
      })
      .catch((e) => {
        console.log(e);
        if (e.response?.status === 401) {
          this.setState({
            forbidden: true,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to load documents.",
          });
        }
        this.setState({ is_loaded: true });
      });
  }

  handlePageChange = (selectedPage) => {
    this.setState({
      currentPage: selectedPage.selected + 1,
    });
  };

  componentDidMount() {
    this.fetchDocuments();
  }

  render() {
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Documents</h2>
            <Button
              variant="primary"
              onClick={() => this.props.history.push('/data_management/documents/new')}
            >
              New Document
            </Button>
          </div>
          <ToolkitProvider
            keyField="document_id"
            data={this.state.documents}
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

export default Documents;
