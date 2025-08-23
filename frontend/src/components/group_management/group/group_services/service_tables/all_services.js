// Built ins
import React from "react";

// Modules / Components
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import moment from "moment";

// CSS
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Custom made Components
import DeleteService from "../modals/delete_service";
import ChangeDate from "../modals/change_date";
import ChangeDescription from "../modals/change_description";
import ChangePrice from "../modals/change_price";

// Global Variables
import { paginationOptions } from "../../../../global_vars";

const defaultSorted = [
  {
    dataField: "id",
    order: "desc",
  },
];

const Currencies = {
  EUR: "€",
  GBP: "£",
  USD: "$",
  CAD: "CA$",
  AUD: "AU$",
  CHF: "₣",
  JPY: "JP¥",
  NZD: "NZ$",
  CNY: "CN¥",
  SGD: "S$",
};

const OFFER_SERVICE_TYPES = {
  AC: "Accommodation",
  AT: "Air Ticket",
  AP: "Airport Porterage",
  CFT: "Coach's Ferry Ticket",
  CR: "Cruise",
  DA: "Driver Accommodation",
  FT: "Ferry Ticket",
  HP: "Hotel Porterage",
  LG: "Local Guide",
  RST: "Restaurant",
  ES: "Shows & Entertainment",
  SE: "Sport Event",
  SHT: "Sightseeing",
  TE: "Teleferik",
  TH: "Theater",
  TO: "Tolls",
  TL: "Tour Leader",
  TLA: "Tour Leader Accommodation",
  TLAT: "Tour Leader Air Ticket",
  TT: "Train Ticket",
  TR: "Transfers",
  PRM: "Permit",
  OTH: "Other",
};

const OFFER_SERVICE_TYPES_REV = {
  "Accommodation": "AC",
  "Air Tickets": "AT",
  "Airport Porterage": "AP",
  "Coach's Ferry Tickets": "CFT",
  "Cruises": "CR",
  "Driver's Accommodation": "DA",
  "Ferry Tickets": "FT",
  "Hotel Porterage": "HP",
  "Local Guides": "LG",
  "Restaurants": "RST",
  "Shows & Entertainment": 'ES',
  "Sport Events": "SE",
  "Sightseeing": "SHT",
  "Teleferiks": "TE",
  "Theaters": "TH",
  "Tolls": "TO",
  "Tour Leaders": "TL",
  "Tour Leader's Accommodation": "TLA",
  "Tour Leader's Air Tickets": "TLAT",
  "Train Tickets": "TT",
  "Transfers": "TR",
  "Permits": "PRM",
  "Other Services": "OTH",
};

function getSupplierName(service) {
  const serviceType = service.service_type;

  switch (serviceType) {
    case "AC":
    case "DA":
    case "HP":
    case "TLA":
      return service.hotel ? service.hotel.name : "N/A";

    case "AT":
    case "TLAT":
      return service.airline ? service.airline.name : "N/A";

    case "AP":
      return service.dmc ? service.dmc.name : "N/A";

    case "CFT":
    case "FT":
      return service.ferry_ticket_agency ? service.ferry_ticket_agency.name : "N/A";

    case "CR":
      return service.cruising_company ? service.cruising_company.name : "N/A";

    case "LG":
      return service.guide ? service.guide.name : "N/A";

    case "RST":
      return service.restaurant ? service.restaurant.name : "N/A";

    case "ES":
      return service.entertainment_supplier ? service.entertainment_supplier.name : "N/A";

    case "SE":
      return service.sport_event_supplier ? service.sport_event_supplier.name : "N/A";

    case "TE":
      return service.teleferik_company ? service.teleferik_company.name : "N/A";

    case "TH":
      return service.theater ? service.theater.name : "N/A";

    case "TL":
      return service.tour_leader ? service.tour_leader.name : "N/A";

    case "TR":
      return service.coach_operator ? service.coach_operator.name : "N/A";

    case "TT":
      return service.train_ticket_agency ? service.train_ticket_agency.name : "N/A";

    default:
      // Handle unknown or unhandled service types
      return "N/A";
  }
}

function AllServicesTable(props) {
  let columns = [
    {
      dataField: "id",
      text: "ID",
      sort: true,
    },
    {
      dataField: "service_type",
      text: "Type",
      sort: true,
      formatter: (cell, row) => <>{OFFER_SERVICE_TYPES[cell]}</>,
    },
    {
      dataField: "supplier",
      text: "Supplier",
      sort: true,
      formatter: (cell, row) => <>{getSupplierName(row)}</>,
    },

    {
      dataField: "date",
      text: "Date",
      sort: true,
      formatter: (cell, row) => (
        <>
          {moment(cell).format("DD/MM/yyyy")}
          <ChangeDate
            group={props.group}
            is_loaded={props.is_loaded}
            service_id={row.id}
            date={row.date}
            update_state={props.update_state}
          />
        </>
      ),
    },
    {
      dataField: "price",
      text: "Price",
      sort: true,
      formatter: (cell, row) => (
        <>
          {row.price !== null ? (
            <>
              {Currencies[row.currency]} {row.price}
            </>
          ) : (
            "N/A"
          )}
          <ChangePrice
            group={props.group}
            is_loaded={props.is_loaded}
            date={row.date}
            service_id={row.id}
            description={row.description}
            update_state={props.update_state}
            price={row.price}
          />
        </>
      ),
    },

    {
      dataField: "description",
      text: "Description",
      sort: true,
      formatter: (cell, row) => (
        <>
          {row.description ? row.description : "N/A"}
          <ChangeDescription
            group={props.group}
            is_loaded={props.is_loaded}
            service_id={row.id}
            description={row.description}
            update_state={props.update_state}
          />
        </>
      ),
    },
    {
      dataField: "service_type",
      text: "Delete",
      sort: true,
      formatter: (cell, row) => (
        <>
          <DeleteService
            id="delete_doc_modal"
            service_id={row.id}
            update_state={props.update_state}
            refcode={props.refcode}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <ToolkitProvider
        keyField="id"
        data={
          props.filter === "All" ? 
            props.data :
            props.data.filter((service) => service.service_type === OFFER_SERVICE_TYPES_REV[props.filter])
        }
        columns={columns}
        search
        bootstrap4
        condensed
        defaultSorted={defaultSorted}
      >
        {(props) => (
          <div>
            <BootstrapTable
              {...props.baseProps}
              pagination={paginationFactory(paginationOptions)}
              hover
              bordered={false}
              striped
              id="all_services_table"
            />
          </div>
        )}
      </ToolkitProvider>
    </>
  );
}

export default AllServicesTable;
