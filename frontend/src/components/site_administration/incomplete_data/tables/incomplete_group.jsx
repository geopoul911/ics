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
import ReactCountryFlag from "react-country-flag";

// CSS
import "react-tabs/style/react-tabs.css";

// Global Variables
import { paginationOptions, helpStyle } from "../../../global_vars";

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
        <h6> Which Group is considered Incomplete?</h6>
        <p>
          Groups having no data on the following entries are Incomplete
          <ul style={{ listStyle: "upper-roman" }}>
            <li>Refcode</li>
            <li>Arrival Flight</li>
            <li>Departure Flight</li>
            <li>Status</li>
            <li>PAX</li>
            <li>Agent/Client</li>
            <li>Nationality</li>
          </ul>
        </p>
      </li>
    </ul>
  </>
);

const statusFilterOptions = {
  Confirmed: "Confirmed",
  Cancelled: "Cancelled",
};

class IncompleteGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selected_model: "Group",
      columns: [
        {
          // #1 ID
          dataField: "id", // dataField is linked to the backend, if it doesnt match the data, nothing will be rendered
          text: "ID", // TH text
          sort: true, // shorting method
          filter: textFilter(),
        },
        {
          // #2 REFCODE
          dataField: "refcode",
          text: "Refcode",
          sort: true,
          filter: textFilter(),
          // We want custom formatter in order to make the user able to navigate through group's page from a button like above
          formatter: (cell, row) => (
            <>
              {/* Button is borderless */}
              {/* If group is cancelled, add red color for the text of the button */}
              <Button
                href={"/group_management/group/" + row.refcode}
                basic
                className={row.status === "Cancelled" ? "cnclled" : "cnfrmed"}
                id="cell_link"
              >
                {/* When user hovers over the button, hidden content will appear */}
                {row.refcode}
              </Button>
            </>
          ),
        },
        {
          // #3 AGENT / CLIENT
          dataField: "agent_client",
          text: "Agent / Client",
          sort: true,
          filter: textFilter(),
          formatter: (cell, row) =>
            row.agent_or_client === "Agent" ? (
              <>
                <Button
                  href={"/data_management/agent/" + row.agent_client_id}
                  basic
                  className={row.status === "Cancelled" ? "cnclled" : "cnfrmed"}
                  id="cell_link"
                >
                  {row.agent_client} ( {row.agent_or_client} )
                </Button>
              </>
            ) : (
              <>
                <Button
                  href={"/data_management/client/" + row.agent_client_id}
                  basic
                  className={row.status === "Cancelled" ? "cnclled" : "cnfrmed"}
                  id="cell_link"
                >
                  {row.agent_client} ( {row.agent_or_client} )
                </Button>
              </>
            ),
        },
        {
          // #5 STATUS
          dataField: "status",
          text: "Status",
          sort: true,
          filter: selectFilter({
            options: statusFilterOptions,
          }),
        },
        {
          // #6 DEPARTURE DATE
          dataField: "departure_date",
          text: "Departure date",
          sort: true,
          filter: textFilter(),
        },
        {
          // #7 NATIONALITY
          dataField: "nationality",
          text: "Nationality",
          sort: true,
          filter: textFilter(),
          formatter: (cell, row, rowIndex, extraData) => (
            <>
              {row.nationality_code ? (
                <>
                  <ReactCountryFlag
                    countryCode={row.nationality_code}
                    svg
                    style={{ width: "2em", height: "2em", marginRight: 10 }}
                    title={row.nationality.code}
                  />
                  {row.nationality ? row.nationality.name : "N/A"}
                  {row.nationality}
                </>
              ) : (
                "N/A"
              )}
            </>
          ),
        },
        {
          // #8 PAX ( NUMBER OF PEOPLE )
          dataField: "number_of_people",
          text: "PAX",
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
          Found {this.props.data.length} incomplete Group entries
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

export default IncompleteGroup;
