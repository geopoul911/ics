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
const defaultSorted = [
  {
    dataField: "id",
    order: "desc",
  },
];

const helpContent = () => (
  <>
    <ul style={{ listStyle: "circle" }}>
      <li>
        <h6> Which Cruising Company is considered Incomplete?</h6>
        <p>
          Cruising Companies having no data on the following entries are
          Incomplete
          <ul style={{ listStyle: "upper-roman" }}>
            <li>Name</li>
            <li>Address</li>
            <li>Tel (1)</li>
            <li>Email</li>
            <li>Lat</li>
            <li>Lng</li>
          </ul>
        </p>
      </li>
    </ul>
  </>
);

let cross_style = {
  color: "red",
  fontSize: "1em",
};

let tick_style = {
  color: "green",
  fontSize: "1.4em",
};

const enabledFilterOptions = {
  true: "Yes",
  false: "No",
};

class IncompleteCruisingCompany extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selected_model: "Cruising Company",
      columns: [
        {
          // # 1 ID
          dataField: "id",
          text: "ID",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "name",
          text: "Name",
          sort: true,
          filter: textFilter(),
          formatter: (cell, row) => (
            <Button
              href={"/data_management/cruising_company/" + row.id}
              basic
              id="cell_link"
            >
              {row.name}
            </Button>
          ),
        },
        {
          dataField: "address",
          text: "Address",
          sort: true,
          filter: textFilter(),
          formatter: (cell, row) => (
            <>
              {row.address === null ? (
                "N/A"
              ) : (
                <>
                  {row.address} <br />
                </>
              )}
            </>
          ),
        },

        {
          dataField: "tel",
          text: "Tel details",
          sort: true,
          filter: textFilter(),
          formatter: (cell, row) => (
            <>
              {row.tel === null ? (
                "N/A"
              ) : (
                <>
                  <strong>Tel : </strong> {row.tel}
                  <br />
                </>
              )}
              {row.tel2 === "N/A" ? (
                ""
              ) : (
                <>
                  <strong>Tel2 : </strong> {row.tel2}
                  <br />
                </>
              )}
              {row.tel3 === "N/A" ? (
                ""
              ) : (
                <>
                  <strong>Tel3 : </strong> {row.tel3}
                  <br />
                </>
              )}
            </>
          ),
        },
        {
          dataField: "email",
          text: "Email",
          sort: true,
          filter: textFilter(),
          formatter: (cell, row) => (
            <>{row.email === null ? "N/A" : <>{row.email}</>}</>
          ),
        },
        {
          dataField: "enabled",
          text: "Enabled",
          sort: true,
          filter: selectFilter({
            options: enabledFilterOptions,
          }),
          formatter: (cell, row) => (
            <>
              {row.enabled ? (
                <TiTick style={tick_style} />
              ) : (
                <ImCross style={cross_style} />
              )}
            </>
          ),
        },
        {
          dataField: "lat_lng",
          text: "Lat / Lng",
          sort: true,
          filter: textFilter(),
        },
      ],
    };
  }

  render() {
    return (
      <>
        <hr />
        <Alert variant="primary" style={{ float: "left", marginLeft: 20 }}>
          Found {this.props.data.length} incomplete Cruising Company entries
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

export default IncompleteCruisingCompany;
