// Built-ins
import React, { Component } from "react";

// Modules / Functions
import { Button, Popup } from "semantic-ui-react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, {
  textFilter,
  selectFilter,
  numberFilter,
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

let cross_style = {
  color: "red",
  fontSize: "1em",
};

let tick_style = {
  color: "green",
  fontSize: "1.4em",
};

const emissionFilterOptions = {
  "Euro 3": "Euro 3",
  "Euro 4": "Euro 4",
  "Euro 5": "Euro 5",
  "Euro 6": "Euro 6",
  "Euro 7": "Euro 7",
  "N/A": "N/A",
};

const enabledFilterOptions = {
  true: "Yes",
  false: "No",
};

const helpContent = () => (
  <>
    <ul style={{ listStyle: "circle" }}>
      <li>
        <h6> Which Coaches is considered Incomplete?</h6>
        <p>
          Coaches having no data on the following entries are Incomplete
          <ul style={{ listStyle: "upper-roman" }}>
            <li>Make</li>
            <li>Plate Number</li>
            <li>Body Number</li>
          </ul>
        </p>
      </li>
    </ul>
  </>
);

class IncompleteCoach extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selected_model: "Coach",
      columns: [
        {
          dataField: "id",
          text: "ID",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "make",
          text: "Make",
          sort: true,
          filter: textFilter(),
          formatter: (cell, row) => (
            <>
              <Button href={"/data_management/coach/" + row.id} basic>
                {row.make}
              </Button>
            </>
          ),
        },
        {
          dataField: "body_number",
          text: "Body Number",
          sort: true,
          filter: textFilter(),
          formatter: (cell, row) => (
            <>{row.body_number === null ? "N/A" : <>{row.body_number}</>}</>
          ),
        },
        {
          dataField: "plate_number",
          text: "Plate Number",
          sort: true,
          filter: textFilter(),
          formatter: (cell, row) => (
            <>{row.plate_number === null ? "N/A" : <>{row.plate_number}</>}</>
          ),
        },
        {
          dataField: "number_of_seats",
          text: "Number of Seats",
          sort: true,
          filter: textFilter(),
          formatter: (cell, row) => (
            <>
              {row.number_of_seats === "" ? "N/A" : <>{row.number_of_seats}</>}
            </>
          ),
        },
        {
          dataField: "emission",
          text: "Emission stds",
          sort: true,
          filter: selectFilter({
            options: emissionFilterOptions,
          }),
        },
        {
          dataField: "year",
          text: "Year",
          sort: true,
          filter: numberFilter(),
          formatter: (cell, row) => (
            <>{row.year === 0 ? "N/A" : <>{row.year}</>}</>
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
      ],
    };
  }

  render() {
    return (
      <>
        <Alert variant="primary" style={{ float: "left", marginLeft: 20 }}>
          Found {this.props.data.length} incomplete Coach entries
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

export default IncompleteCoach;
