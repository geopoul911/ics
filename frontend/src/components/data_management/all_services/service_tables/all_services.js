// Built-ins
import React from "react";

// Icons / Images
import NoDataToShowImage from "../../../../images/generic/no_results_found.png";

// Modules / Functions
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import moment from "moment";

// CSS
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Global Variables
import { paginationOptions } from "../../../global_vars";

// Variables
const NoDataToShow = () => {
  return <img src={NoDataToShowImage} alt={""} className="fill" />;
};

const defaultSorted = [
  {
    dataField: "id",
    order: "desc",
  },
];

const OFFER_SERVICE_TYPES_REV = {
  AC: "Accomodation",
  AT: "Air Ticket",
  AP: "Airport Porterage",
  CFT: "Coach's Ferry Ticket",
  CR: "Cruise",
  DA: "Driver Accomodation",
  FT: "Ferry Ticket",
  HP: "Hotel Porterage",
  LG: "Local Guide",
  RST: "Restaurant",
  SE: "Sport Event",
  TE: "Teleferik",
  TH: "Theater",
  TO: "Tolls",
  TL: "Tour Leader",
  TLA: "Tour Leader Accomodation",
  TLAT: "Tour Leader Air Ticket",
  TT: "Train Ticket",
  TR: "Transfers",
  PRM: "Permit",
  OTH: "Other",
};

function AllServicesTable(props) {
  let columns = [
    {
      dataField: "id",
      text: "ID",
      sort: true,
      filter: textFilter(),
      formatter: (cell, row) => (
        <>
          <a href={"/data_management/service/" + row.id} basic id="cell_link">
            {row.id}
          </a>
        </>
      ),
    },
    {
      dataField: "refcode",
      text: "Refcode",
      sort: true,
      filter: textFilter(),
      formatter: (cell, row) => (
        <>
          {/* Button is borderless */}
          {/* If group is cancelled, add red color for the text of the button */}
          <a
            href={"/group_management/group/" + row.refcode}
            basic
            className={row.status === "Cancelled" ? "cnclled" : "cnfrmed"}
            id="cell_link"
          >
            {/* When user hovers over the button, hidden content will appear */}
            {row.refcode}
          </a>
        </>
      ),
    },
    {
      dataField: "service_type",
      text: "Type",
      sort: true,
      filter: textFilter(),
      formatter: (cell, row) => <>{OFFER_SERVICE_TYPES_REV[cell]}</>,
    },
    {
      dataField: "price",
      text: "Price",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "date",
      text: "Date",
      sort: true,
      filter: textFilter(),
      formatter: (cell, row) => <>{moment(cell).format("DD/MM/yyyy")}</>,
    },
    {
      dataField: "description",
      text: "Description",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "start_time",
      text: "Start Time",
      sort: true,
      filter: textFilter(),
      formatter: (cell, row) => <>{row.start_time ? row.start_time : "N/A"}</>,
    },
  ];

  return (
    <>
      <ToolkitProvider
        keyField="id"
        data={props.data}
        columns={columns}
        search
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
              noDataIndication={<NoDataToShow />}
              bordered={false}
              striped
              filter={filterFactory()}
            />
          </div>
        )}
      </ToolkitProvider>
    </>
  );
}

export default AllServicesTable;
