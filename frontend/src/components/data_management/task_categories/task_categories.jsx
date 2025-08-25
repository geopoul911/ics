// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Modules / Functions
import { apiGet, apiPost, apiPut, apiDelete, API_ENDPOINTS } from '../../../utils/api';
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Swal from "sweetalert2";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

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

const TaskCategoriesComponent = () => {
  const history = useHistory();

  const columns = [
    {
      dataField: "taskcate_id",
      text: "ID",
      sort: true,
      filter: textFilter(),
      formatter: (cell, row) => (
        <Button variant="link" className="p-0" onClick={() => history.push(`/data_management/task_categories/${row.taskcate_id}`)}>
          {row.taskcate_id}
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
      text: "Order Index",
      sort: true,
      filter: textFilter(),
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
      dataField: "orderindex",
      order: "asc",
    },
  ];

  const NoDataToShow = () => {
    return <img src={NoDataToShowImage} alt={""} className="fill" />;
  };

  const [task_categories, setTaskCategories] = React.useState([]);
  const [is_loaded, setIsLoaded] = React.useState(false);


  const fetchTaskCategories = async () => {
    setIsLoaded(false);
    try {
      const categories = await apiGet(API_ENDPOINTS.TASK_CATEGORIES);
      setTaskCategories(categories);
      setIsLoaded(true);
    } catch (error) {
      console.log(error);
      if (error.message === 'Authentication required') {
        // Handle forbidden
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load task categories.",
        });
      }
      setIsLoaded(true);
    }
  };



  React.useEffect(() => {
    fetchTaskCategories();
  }, []);

  return (
    <>
      <NavigationBar />
      <div className="mainContainer">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Task Categories</h2>
          <Button
            variant="primary"
            onClick={() => history.push('/data_management/task_categories/new')}
          >
            New Task Category
          </Button>
        </div>
        <ToolkitProvider
          keyField="taskcate_id"
          data={task_categories}
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
                loading={!is_loaded}
              />
            </div>
          )}
        </ToolkitProvider>
      </div>
      <Footer />
    </>
  );
};

export default TaskCategoriesComponent;
