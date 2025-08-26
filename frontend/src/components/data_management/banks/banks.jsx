// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Modules / Functions
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Swal from "sweetalert2";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { apiGet, API_ENDPOINTS } from "../../../utils/api";

// CSS
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Icons / Images
import NoDataToShowImage from "../../../images/generic/no_results_found.png";

// Global Variables
import {
  paginationOptions,
} from "../../global_vars";

// Variables
window.Swal = Swal;

const BanksComponent = () => {
  const history = useHistory();

  const columns = [
    {
      dataField: "bank_id",
      text: "ID",
      sort: true,
      filter: textFilter(),
      formatter: (cell, row) => (
        <Button variant="link" className="p-0" onClick={() => history.push(`/data_management/banks/${row.bank_id}`)}>
          {row.bank_id}
        </Button>
      ),
    },
    {
      dataField: "country.title",
      text: "Country",
      sort: true,
      filter: textFilter(),
      formatter: (cell, row) => row.country?.title || "",
    },
    {
      dataField: "bankname",
      text: "Bank Name",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "orderindex",
      text: "Order Index",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "institutionnumber",
      text: "Institution Number",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "swiftcode",
      text: "SWIFT Code",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "active",
      text: "Active",
      sort: true,
      filter: textFilter(),
      formatter: (cell, row) => (
        <span className={row.active ? "text-success" : "text-danger"}>
          {row.active ? "Yes" : "No"}
        </span>
      ),
    },
  ];

  const defaultSorted = [
    {
      dataField: "orderindex",
      order: "asc",
    },
  ];

  const NoDataToShow = () => {
    return <img src={NoDataToShowImage} alt={""} className="fill" />;
  };

  const [banks, setBanks] = React.useState([]);
  const [is_loaded, setIsLoaded] = React.useState(false);

  const fetchBanks = async () => {
    setIsLoaded(false);
    try {
      const response = await apiGet(API_ENDPOINTS.BANKS);
      if (response.success) {
        setBanks(response.data);
      } else {
        setBanks([]);
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Error fetching banks:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load banks.",
      });
      setIsLoaded(true);
    }
  };

  React.useEffect(() => {
    fetchBanks();
  }, []);

  return (
    <>
      <NavigationBar />
      <div className="mainContainer">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Banks</h2>
          <Button
            variant="primary"
            onClick={() => history.push('/data_management/banks/new')}
          >
            New Bank
          </Button>
        </div>
        <ToolkitProvider
          keyField="bank_id"
          data={banks}
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
                loading={!is_loaded}
              />
            </div>
          )}
        </ToolkitProvider>
      </div>
      <Footer />
    </>
  );
};

export default BanksComponent;
