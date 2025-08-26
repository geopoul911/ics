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
import { Button } from "semantic-ui-react";
import AddClientModal from "../../modals/create/add_client";

// CSS
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Icons / Images
import NoDataToShowImage from "../../../images/generic/no_results_found.png";

// Global Variables
import {
  paginationOptions,
  headers,
  pageHeader,
} from "../../global_vars";

// Variables
window.Swal = Swal;

const GET_CLIENTS = "http://localhost:8000/api/data_management/clients/";

const columns = [
  {
    dataField: "client_id",
    text: "ID",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button>
        <a href={"/data_management/clients/" + row.client_id} basic id="cell_link">
          {row.client_id}
        </a>
      </Button>
    ),
  },
  {
    dataField: "surname",
    text: "Surname",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "name",
    text: "Name",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "email",
    text: "Email",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "phone1",
    text: "Phone",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "city",
    text: "City",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.city?.title || "N/A",
  },
  {
    dataField: "active",
    text: "Status",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.active ? "Active" : "Inactive",
  },
];

const defaultSorted = [
  {
    dataField: "client_id",
    order: "desc",
  },
];

const NoDataToShow = () => {
  return <img src={NoDataToShowImage} alt={""} className="fill" />;
};

class ClientList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_clients: [],
      is_loaded: true,
      currentPage: 1,
      clientsPerPage: 10,
    };
  }

  fetchClients() {
    // Update headers with current token
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    axios
      .get(GET_CLIENTS, {
        headers: currentHeaders,
      })
      .then((res) => {
        const allClients = res.data.results || res.data;
        this.setState({
          all_clients: allClients,
          is_loaded: true,
        });
      })
      .catch((e) => {
        console.log(e)
        if (e.response.status === 401) {
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
      });
  }

  handlePageChange = (selectedPage) => {
    this.setState({
      currentPage: selectedPage.selected + 1,
    });
  };

  componentDidMount() {
    this.fetchClients();
  }

  // Method to refresh the clients list (can be called from child components)
  refreshClients = () => {
    this.fetchClients();
  };

  render() {
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("clients")}
            <ToolkitProvider
              keyField={(row, index) => index}
              data={this.state.all_clients}
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
                  />
                </div>
              )}
            </ToolkitProvider>
            <AddClientModal onClientCreated={this.refreshClients} />
          </div>
        <Footer />
      </>
    );
  }
}

export default ClientList;
