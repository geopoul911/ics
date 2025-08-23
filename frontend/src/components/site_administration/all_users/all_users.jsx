// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import NoDataToShowImage from "../../../images/generic/no_results_found.png";

// Modules / Functions
import AddUserModal from "./modals/add_user_modal";
import axios from "axios";
import filterFactory, {
  textFilter,
  selectFilter,
} from "react-bootstrap-table2-filter";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Swal from "sweetalert2";

// CSS
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Icons / Images
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";

// Global Variables
import {
  paginationOptions,
  headers,
  loader,
  pageHeader,
  forbidden,
  restrictedUsers,
} from "../../global_vars";

// Variables
window.Swal = Swal;

const GET_ALL_USERS = "http://localhost:8000/api/site_admin/all_users/";

let cross_style = {
  color: "red",
  fontSize: "1em",
};

let tick_style = {
  color: "green",
  fontSize: "1.4em",
};

const staffFilterOptions = {
  true: "Is Staff",
  false: "Is not Staff",
};

const activeFilterOptions = {
  true: "Is Active",
  false: "Is not Active",
};

const superuserFilterOptions = {
  true: "Is Superuser",
  false: "Is not Superuser",
};

const columns = [
  {
    dataField: "id",
    text: "ID",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "username",
    text: "Username",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <>
        <a href={"/site_administration/user/" + row.id} basic id="cell_link">
          {row.username}
        </a>
      </>
    ),
  },
  {
    dataField: "first_name",
    text: "First Name",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "last_name",
    text: "Last Name",
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
    dataField: "is_staff",
    text: "Is Staff",
    sort: true,
    filter: selectFilter({
      options: staffFilterOptions,
    }),
    formatter: (cell, row) => (
      <>
        {row.is_staff ? (
          <TiTick style={tick_style} />
        ) : (
          <ImCross style={cross_style} />
        )}
      </>
    ),
  },
  {
    dataField: "is_active",
    text: "Is Active",
    sort: true,
    filter: selectFilter({
      options: activeFilterOptions,
    }),
    formatter: (cell, row) => (
      <>
        {row.is_active ? (
          <TiTick style={tick_style} />
        ) : (
          <ImCross style={cross_style} />
        )}
      </>
    ),
  },
  {
    dataField: "is_superuser",
    text: "Is Super User",
    sort: true,
    filter: selectFilter({
      options: superuserFilterOptions,
    }),
    formatter: (cell, row) => (
      <>
        {row.is_superuser ? (
          <TiTick style={tick_style} />
        ) : (
          <ImCross style={cross_style} />
        )}
      </>
    ),
  },
  {
    dataField: "date_joined",
    text: "Date joined",
    sort: true,
    filter: textFilter(),
  },
];

const defaultSorted = [
  {
    dataField: "id",
    order: "desc",
  },
];

const NoDataToShow = () => {
  return <img src={NoDataToShowImage} alt={""} className="fill" />;
};

// url path = '/all_users'
class AllUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_users: [],
      is_loaded: false,
      date_from: new Date(2000, 0, 1), // By default, bring users from this millenium
      date_to: new Date(),
      forbidden: false,
    };
  }

  componentDidMount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    axios
      .get(GET_ALL_USERS, {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          all_users: res.data.all_users, // back end's data
          is_loaded: true, // stop loading
        });
      })
      .catch((e) => {
        if (e.response.status === 401) {
          this.setState({
            forbidden: true,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An unknown error has occured.",
          });
        }
      });
  }

  render() {
    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("all_users")}
          {this.state.forbidden ? (
            <>{forbidden("All Users")}</>
          ) : this.state.is_loaded ? (
            <>
              <ToolkitProvider
                keyField="id"
                data={this.state.all_users}
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
                      id="all_users_table"
                      bordered={false}
                      striped
                      filter={filterFactory()}
                    />
                  </div>
                )}
              </ToolkitProvider>
              <AddUserModal />
            </>
          ) : (
            loader()
          )}
        </div>
        <Footer />
      </>
    );
  }
}

export default AllUsers;
