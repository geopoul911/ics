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
        <h6> Which Airline is considered Incomplete?</h6>
        <p>
          Airlines having no data on the following entries are Incomplete
          <ul style={{ listStyle: "upper-roman" }}>
            <li>Name</li>
            <li>Abbreviation</li>
          </ul>
        </p>
      </li>
    </ul>
  </>
);

const enabledFilterOptions = {
  true: "Yes",
  false: "No",
};

class IncompleteAirline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selected_model: "Airline",
      columns: [
        {
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
              href={"/data_management/airline/" + row.id}
              basic
              id="cell_link"
            >
              {row.name}
            </Button>
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
          dataField: "abbreviation",
          text: "Abbreviation",
          sort: true,
          filter: textFilter(),
          formatter: (cell, row) => (
            <>
              {row.abbreviation === null || row.abbreviation === "" ? (
                "N/A"
              ) : (
                <>{row.abbreviation}</>
              )}
            </>
          ),
        },
      ],
    };
  }

  render() {
    return (
      <>
        <Alert variant="primary" style={{ float: "left", marginLeft: 20 }}>
          Found {this.props.data.length} incomplete Airline entries
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

export default IncompleteAirline;
