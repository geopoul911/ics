// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import NoDataToShowImage from "../../../images/generic/no_results_found.png";
import AddOfferModal from "./modals/add_group_offer_modal";

// Modules / Functions
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import axios from "axios";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Swal from "sweetalert2";

// CSS
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "./all_group_offers.css";

// Global Variables
import {
  paginationOptions,
  headers,
  loader,
  forbidden,
  restrictedUsers,
  pageHeader,
} from "../../global_vars";

// Variables
window.Swal = Swal;

const GET_OFFERS = "http://localhost:8000/api/groups/all_group_offers/";

const columns = [
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
      <>
        <a href={"/group_management/offer/" + row.id} basic id="cell_link">
          {row.name ? row.name : "N/A"}
        </a>
      </>
    ),
  },
  {
    dataField: "offer_type",
    text: "Offer Type",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <> {row.type === "PP" ? "Per person" : "By Scale"} </>
    ),
  },
  {
    dataField: "document_type",
    text: "Document Type",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => <>{row.doc_type ? row.doc_type : "N/A"}</>,
  },
  {
    dataField: "currency",
    text: "Currency",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => <>{row.currency ? row.currency : "N/A"}</>,
  },
  {
    dataField: "period",
    text: "Period",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => <>{row.period ? row.period : "N/A"}</>,
  },
  {
    dataField: "destination",
    text: "Destination",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => <>{row.destination ? row.destination : "N/A"}</>,
  },
  {
    dataField: "pax",
    text: "PAX",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => <>{row.number_of_people}</>,
  },
  {
    dataField: "profit",
    text: "Profit",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => <>{row.profit} %</>,
  },
  {
    dataField: "cancellation_deadline",
    text: "Cancellation Deadline",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => <>{row.cancellation_deadline}</>,
  },
];

const defaultSorted = [
  {
    dataField: "id",
    order: "desc",
  },
];

const NoDataToShow = () => {
  return <img src={NoDataToShowImage} alt={""} className="fill" />;
};

// url path = '/all_group_offers'
class AllOffers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_offers: [],
      is_loaded: false,
      forbidden: false,
    };
  }

  componentDidMount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    axios
      .get(GET_OFFERS, {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          all_offers: res.data.all_offers,
          agent_names: res.data.agent_names,
          client_names: res.data.client_names,
          is_loaded: true,
        });
      })
      .catch((e) => {
        if (e.response.status === 401) {
          this.setState({
            forbidden: true,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An unknown error has occured.",
          });
        }
      });
  }

  render() {
    return (
      <div>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("all_group_offers")}
          {this.state.forbidden ? (
            <>{forbidden("All Group Offers")}</>
          ) : this.state.is_loaded ? (
            <>
              <ToolkitProvider
                keyField="id"
                data={this.state.all_offers}
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
                      bordered={false}
                      striped
                      filter={filterFactory()}
                    />
                  </div>
                )}
              </ToolkitProvider>
              <AddOfferModal redir={true} />
            </>
          ) : (
            loader()
          )}
        </div>
        <Footer />
      </div>
    );
  }
}

export default AllOffers;
