// Built-ins
import React, { Component } from "react";

// Modules / Functions
import { Button, Popup } from "semantic-ui-react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, {
  textFilter,
  selectFilter,
} from "react-bootstrap-table2-filter";
import { Alert } from "react-bootstrap";
import ToolkitProvider from "react-bootstrap-table2-toolkit";

// CSS
import "react-tabs/style/react-tabs.css";

// Icons / Images
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";

// Global Variables
import { paginationOptions, helpStyle } from "../../../global_vars";

// Variables
let cross_style = {
  color: "red",
  fontSize: "1em",
};

let tick_style = {
  color: "green",
  fontSize: "1.4em",
};

const helpContent = () => (
  <>
    <ul style={{ listStyle: "circle" }}>
      <li>
        <h6> Which User is considered Incomplete?</h6>
        <p>
          Users having no data on the following entries are Incomplete
          <ul style={{ listStyle: "upper-roman" }}>
            <li>First Name</li>
            <li>Last Name</li>
            <li>Email</li>
          </ul>
        </p>
      </li>
    </ul>
  </>
);

const defaultSorted = [
  {
    dataField: "id",
    order: "desc",
  },
];

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

class IncompleteUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selected_model: "User",
      columns: [
        {
          // # 1 ID
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
              <Button
                id="cell_link"
                href={"/site_administration/user/" + row.id}
                basic
              >
                {row.username}
              </Button>
            </>
          ),
        },
        {
          // # 3 first_name
          dataField: "first_name",
          text: "First Name",
          sort: true,
          filter: textFilter(),
        },
        {
          // # 4 last_name
          dataField: "last_name",
          text: "Last Name",
          sort: true,
          filter: textFilter(),
        },
        {
          // # 5 Email
          dataField: "email",
          text: "Email",
          sort: true,
          filter: textFilter(),
        },
        {
          // # 6 is_staff
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
          // # 7 is_active
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
          // # 8 is_superuser
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
          // # 9 last_login
          dataField: "last_login",
          text: "Last Login",
          sort: true,
          filter: textFilter(),
        },
        {
          // # 10 date_joined
          dataField: "date_joined",
          text: "Date joined",
          sort: true,
          filter: textFilter(),
        },
      ],
    };
  }

  render() {
    return (
      <>
        <Alert variant="primary" style={{ float: "left", marginLeft: 20 }}>
          Found {this.props.data.length} incomplete user entries
        </Alert>
        <Popup
          trigger={
            <Button
              color="blue"
              icon="help"
              style={{ float: "right", marginRight: 20 }}
            />
          }
          content={helpContent}
          style={helpStyle}
          position="bottom left"
          inverted
        />
        <ToolkitProvider
          keyField="id"
          data={this.props.data}
          columns={this.state.columns}
          search
          bootstrap4
          condensed
          defaultSorted={defaultSorted}
          exportCSV
        >
          {(props) => (
            <div style={{ marginBottom: 20 }}>
              <BootstrapTable
                {...props.baseProps}
                id="incomplete_data_table"
                pagination={paginationFactory(paginationOptions)}
                hover
                bordered={false}
                striped
                update_state={this.update_state}
                filter={filterFactory()}
              />
            </div>
          )}
        </ToolkitProvider>
      </>
    );
  }
}

export default IncompleteUser;
