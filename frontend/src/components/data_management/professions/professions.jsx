// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Modules / Functions
import axios from "axios";
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

const GET_PROFESSIONS = "http://localhost:8000/api/professions/";

const ProfessionsComponent = () => {
  const history = useHistory();

  const columns = [
    {
      dataField: "profession_id",
      text: "ID",
      sort: true,
      filter: textFilter(),
      formatter: (cell, row) => (
        <Button variant="link" className="p-0" onClick={() => history.push(`/data_management/professions/${row.profession_id}`)}>
          {row.profession_id}
        </Button>
      ),
    },
    {
      dataField: "title",
      text: "Title",
      sort: true,
      filter: textFilter(),
    },
  ];

  const defaultSorted = [
    {
      dataField: "title",
      order: "asc",
    },
  ];

  const NoDataToShow = () => {
    return <img src={NoDataToShowImage} alt={""} className="fill" />;
  };

  const [professions, setProfessions] = React.useState([]);
  const [is_loaded, setIsLoaded] = React.useState(false);

  const fetchProfessions = () => {
    setIsLoaded(false);
    axios
      .get(GET_PROFESSIONS, {
        headers: headers,
      })
      .then((res) => {
        const professions = res.data;
        setProfessions(professions);
        setIsLoaded(true);
      })
      .catch((e) => {
        console.log(e);
        if (e.response?.status === 401) {
          // Handle forbidden
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to load professions.",
          });
        }
        setIsLoaded(true);
      });
  };



  React.useEffect(() => {
    fetchProfessions();
  }, []);

  return (
    <>
      <NavigationBar />
      <div className="mainContainer">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Professions</h2>
          <Button
            variant="primary"
            onClick={() => history.push('/data_management/professions/new')}
          >
            New Profession
          </Button>
        </div>
        <ToolkitProvider
          keyField="profession_id"
          data={professions}
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

export default ProfessionsComponent;
