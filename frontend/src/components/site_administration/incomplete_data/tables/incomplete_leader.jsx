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

const helpContent = () => (
  <>
    <ul style={{ listStyle: "circle" }}>
      <li>
        <h6> Which Group Leader is considered Incomplete?</h6>
        <p>
          Group Leaders having no data on the following entries are Incomplete
          <ul style={{ listStyle: "upper-roman" }}>
            <li>Name</li>
            <li>Address</li>
            <li>Tel (1)</li>
            <li>Email</li>
          </ul>
        </p>
      </li>
    </ul>
  </>
);

class IncompleteLeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selected_model: "Leader",
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
            <Button
              href={"/data_management/group_leader/" + row.id}
              basic
              id="cell_link"
            >
              {row.name}
            </Button>
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
          dataField: "address",
          text: "Address",
          sort: true,
          filter: textFilter(),
          formatter: (cell, row) => (
            <>{row.address === null ? "N/A" : <>{row.address}</>}</>
          ),
        },
        {
          dataField: "email",
          text: "Email",
          sort: true,
          filter: textFilter(),
          formatter: (cell, row) => (
            <>{row.email === "None" ? "N/A" : <>{row.email}</>}</>
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
          Found {this.props.data.length} incomplete Leader entries
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

export default IncompleteLeader;
