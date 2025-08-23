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

function OtherServicesTable(props) {
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

export default OtherServicesTable;
