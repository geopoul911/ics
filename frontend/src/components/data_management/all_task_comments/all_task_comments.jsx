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
import CreateTaskCommentModal from "../../modals/create/add_task_comment";
import { Button } from "semantic-ui-react";

// CSS
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Global Variables
import {
  paginationOptions,
  headers,
  pageHeader,
} from "../../global_vars";

// Variables
window.Swal = Swal;

// API endpoint
const ALL_TASK_COMMENTS = "http://localhost:8000/api/data_management/task_comments/";

const columns = [
  {
    dataField: "taskcomm_id",
    text: "Task Comment ID",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button>
        <a href={"/data_management/task_comment/" + row.taskcomm_id} basic id="cell_link">
          {row.taskcomm_id}
        </a>
      </Button>
    ),
  },
  {
    dataField: "projtask.title",
    text: "Project Task",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.projtask?.title || "",
  },
  {
    dataField: "commentregistration",
    text: "Registration Date",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      if (row.commentregistration) {
        return new Date(row.commentregistration).toLocaleString();
      }
      return "";
    },
  },
  {
    dataField: "consultant.surname",
    text: "Consultant Surname",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.consultant?.surname || "",
  },
  {
    dataField: "consultant.name",
    text: "Consultant Name",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.consultant?.name || "",
  },
  {
    dataField: "comment",
    text: "Comment",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.comment || "",
  },
];

const defaultSorted = [
  {
    dataField: "commentregistration",
    order: "desc",
  },
];

class AllTaskComments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_task_comments: [],
      is_loaded: false,
    };
  }

  fetchTaskComments = () => {
    // Update headers with current token
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    axios
      .get(ALL_TASK_COMMENTS, {
        headers: currentHeaders,
      })
      .then((res) => {
        // Handle different response structures
        let allTaskComments = [];

        if (Array.isArray(res.data)) {
          allTaskComments = res.data;
        } else if (res.data && Array.isArray(res.data.results)) {
          allTaskComments = res.data.results;
        } else if (res.data && Array.isArray(res.data.data)) {
          allTaskComments = res.data.data;
        } else if (res.data && res.data.all_task_comments) {
          allTaskComments = res.data.all_task_comments;
        } else {
          console.warn('Unexpected API response structure:', res.data);
          allTaskComments = [];
        }
        
        this.setState({
          all_task_comments: allTaskComments,
          is_loaded: true,
        });
      })
      .catch((e) => {
        console.error('Error fetching task comments:', e);
        if (e?.response?.status === 401) {
          this.setState({ forbidden: true });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to load task comments. Please try again.",
          });
        }
        // Set empty array on error to prevent filter issues
        this.setState({
          all_task_comments: [],
          is_loaded: true,
        });
      });
  };

  componentDidMount() {
    this.fetchTaskComments();
  }

  render() {
    // Ensure we always have an array for the table
    const tableData = Array.isArray(this.state.all_task_comments) ? this.state.all_task_comments : [];
    
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("all_task_comments")}
          <div className="contentContainer">
            <div className="contentBody">
              {this.state.is_loaded ? (
                <>
                  <ToolkitProvider
                    bootstrap4
                    keyField="taskcomm_id"
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
                    <CreateTaskCommentModal onTaskCommentCreated={this.fetchTaskComments} />
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

export default AllTaskComments;
