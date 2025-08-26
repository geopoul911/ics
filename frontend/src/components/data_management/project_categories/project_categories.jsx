// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Modules / Functions
import { apiGet, API_ENDPOINTS } from '../../../utils/api';
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
} from "../../global_vars";

// Variables
window.Swal = Swal;

const ProjectCategoriesComponent = () => {
  const history = useHistory();

  const columns = [
    {
      dataField: "projcate_id",
      text: "ID",
      sort: true,
      filter: textFilter(),
      formatter: (cell, row) => (
        <Button variant="link" className="p-0" onClick={() => history.push(`/data_management/project_categories/${row.projcate_id}`)}>
          {row.projcate_id}
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

  const [is_loaded, setIsLoaded] = React.useState(false);
  const [project_categories, setProjectCategories] = React.useState([]);


  const fetchProjectCategories = async () => {
    setIsLoaded(false);
    try {
      const categories = await apiGet(API_ENDPOINTS.PROJECT_CATEGORIES);
      setProjectCategories(categories);
      setIsLoaded(true);
    } catch (error) {
      console.log(error);
      if (error.message === 'Authentication required') {
        // Handle forbidden
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load project categories.",
        });
      }
      setIsLoaded(true);
    }
  };



  React.useEffect(() => {
    fetchProjectCategories();
  }, []);

  return (
    <>
      <NavigationBar />
      <div className="mainContainer">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Project Categories</h2>
          <Button
            variant="primary"
            onClick={() => history.push('/data_management/project_categories/new')}
          >
            New Project Category
          </Button>
        </div>
        <ToolkitProvider
          keyField="projcate_id"
          data={project_categories}
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

export default ProjectCategoriesComponent;
