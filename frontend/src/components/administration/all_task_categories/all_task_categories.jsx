// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import AddTaskCategoryModal from "../../modals/create/add_task_category";

// Modules / Functions
import filterFactory, { textFilter, selectFilter } from "react-bootstrap-table2-filter";
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

// API endpoint for task categories
const ALL_TASK_CATEGORIES = "https://ultima.icsgr.com/api/administration/all_task_categories/";

const columns = [
  {
    dataField: "taskcate_id",
    text: "Category ID",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button>
        <a href={"/administration/task_category/" + row.taskcate_id} basic id="cell_link">
          {row.taskcate_id}
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
    dataField: "orderindex",
    text: "Order by",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "active",
    text: "Active",
    sort: true,
    filter: selectFilter({
      options: { "": "All", true: "Yes", false: "No" },
      defaultValue: "",
      onFilter: (filterVal, data) => {
        if (filterVal === "" || filterVal === undefined || filterVal === null) return data;
        return data.filter((row) => String(row.active) === String(filterVal));
      },
    }),
    formatter: (cell, row) => (
      <span className={row.active ? "text-success" : "text-danger"}>
        {row.active ? "Yes" : "No"}
      </span>
    ),
  },
];

const defaultSorted = [
  {
    dataField: "orderindex",
    order: "asc",
  },
];

class AllTaskCategoriesComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_task_categories: [],
      is_loaded: false,
    };
  }

  fetchTaskCategories = () => {
    // Update headers with current token
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    axios
      .get(ALL_TASK_CATEGORIES, {
        headers: currentHeaders,
      })
      .then((res) => {
        // Handle different response structures
        let allTaskCategories = [];

        if (Array.isArray(res.data)) {
          allTaskCategories = res.data;
        } else if (res.data && Array.isArray(res.data.results)) {
          allTaskCategories = res.data.results;
        } else if (res.data && Array.isArray(res.data.data)) {
          allTaskCategories = res.data.data;
        } else if (res.data && res.data.all_task_categories) {
          allTaskCategories = res.data.all_task_categories;
        } else {
          console.warn('Unexpected API response structure:', res.data);
          allTaskCategories = [];
        }
        
        this.setState({
          all_task_categories: allTaskCategories,
          is_loaded: true,
        });
      })
      .catch((e) => {
        console.error('Error fetching task categories:', e);
        if (e.response?.status === 401) {
          this.setState({
            forbidden: true,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An unknown error has occurred.",
          });
        }
        // Set empty array on error to prevent filter issues
        this.setState({
          all_task_categories: [],
          is_loaded: true,
        });
      });
  };

  componentDidMount() {
    this.fetchTaskCategories();
  }

  render() {
    // Ensure we always have an array for the table
    const tableData = Array.isArray(this.state.all_task_categories) ? this.state.all_task_categories : [];
    
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("all_task_categories", "All Task Categories")}
          <div className="contentContainer">
            <div className="contentBody">
              {this.state.is_loaded ? (
                <>
                  <ToolkitProvider
                    bootstrap4
                    keyField="taskcate_id"
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
                    <AddTaskCategoryModal onTaskCategoryCreated={this.fetchTaskCategories} />
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

export default AllTaskCategoriesComponent;
