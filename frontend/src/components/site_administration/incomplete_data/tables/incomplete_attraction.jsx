// Built-ins
import React, { Component } from "react";

// Modules / Functions
import { Button, Popup } from "semantic-ui-react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import { Alert } from "react-bootstrap";
import ToolkitProvider from "react-bootstrap-table2-toolkit";

// CSS
import "react-tabs/style/react-tabs.css";

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
        <h6> Which Attraction is considered Incomplete?</h6>
        <p>
          Attractions having no data on the following entries are Incomplete
          <ul style={{ listStyle: "upper-roman" }}>
            <li>Name</li>
            <li>Lat</li>
            <li>Lng</li>
            <li>Place</li>
          </ul>
        </p>
      </li>
    </ul>
  </>
);

class IncompleteAttraction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selected_model: "Attraction",
      columns: [
        {
          // # 1 ID
          dataField: "id", // dataField is linked to the backend, if it doesnt match the data, nothing will be rendered
          text: "ID", // TH text
          sort: true, // shorting method
          filter: textFilter(),
        },
        {
          // # 2 Name
          dataField: "name",
          text: "Name",
          sort: true,
          filter: textFilter(),
          formatter: (cell, row) => (
            <>
              <Button
                href={"/data_management/attraction/" + row.id}
                basic
                id="cell_link"
              >
                {row.name}
              </Button>
            </>
          ),
        },
        {
          // # 3 Place
          dataField: "place",
          text: "Place",
          sort: true,
          filter: textFilter(),
        },
        {
          // # 4 Lat lng
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
        <Alert variant="primary" style={{ float: "left", marginLeft: 20 }}>
          Found {this.props.data.length} incomplete Attraction entries
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

export default IncompleteAttraction;
