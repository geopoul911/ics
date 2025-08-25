// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Modules / Functions
import axios from "axios";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Swal from "sweetalert2";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Button, Badge } from "react-bootstrap";

// CSS
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Icons / Images
import NoDataToShowImage from "../../../images/generic/no_results_found.png";

// Global Variables
import {
  paginationOptions,
  headers,
} from "../../global_vars";

// Variables
window.Swal = Swal;

const GET_PROFESSIONALS = "http://localhost:8000/api/professionals/";

// Helper function to format professional name
const formatProfessionalName = (professional) => {
  const parts = [];
  if (professional.firstname) parts.push(professional.firstname);
  if (professional.lastname) parts.push(professional.lastname);
  return parts.join(' ') || 'N/A';
};

// Helper function to get professional type color
const getProfessionalTypeColor = (type) => {
  switch (type?.toLowerCase()) {
    case 'lawyer': return 'primary';
    case 'accountant': return 'success';
    case 'notary': return 'warning';
    case 'translator': return 'info';
    case 'consultant': return 'secondary';
    default: return 'light';
  }
};

const columns = [
  {
    dataField: "professional_id",
    text: "ID",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button variant="link" className="p-0">
        <a href={"/data_management/professionals/" + row.professional_id} className="text-decoration-none">
          {row.professional_id}
        </a>
      </Button>
    ),
  },
  {
    dataField: "firstname",
    text: "Professional Name",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => formatProfessionalName(row),
  },
  {
    dataField: "profession.title",
    text: "Profession",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      const profession = row.profession?.title || '';
      const color = getProfessionalTypeColor(profession);
      return (
        <Badge bg={color}>
          {profession}
        </Badge>
      );
    },
  },
  {
    dataField: "phone",
    text: "Phone",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "mobile",
    text: "Mobile",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "email",
    text: "Email",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      const email = row.email || '';
      return email.length > 30 ? email.substring(0, 30) + '...' : email;
    },
  },
  {
    dataField: "address",
    text: "Address",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      const address = row.address || '';
      return address.length > 50 ? address.substring(0, 50) + '...' : address;
    },
  },
  {
    dataField: "city.title",
    text: "City",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.city?.title || '',
  },
  {
    dataField: "province.title",
    text: "Province",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.province?.title || '',
  },
  {
    dataField: "country.title",
    text: "Country",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.country?.title || '',
  },
  {
    dataField: "postalcode",
    text: "Postal Code",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "licensenumber",
    text: "License Number",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "specialization",
    text: "Specialization",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      const specialization = row.specialization || '';
      return specialization.length > 40 ? specialization.substring(0, 40) + '...' : specialization;
    },
  },
  {
    dataField: "hourlyrate",
    text: "Hourly Rate",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      if (!row.hourlyrate) return '';
      return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD'
      }).format(row.hourlyrate);
    },
  },
  {
    dataField: "active",
    text: "Active",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Badge bg={row.active ? 'success' : 'secondary'}>
        {row.active ? 'Yes' : 'No'}
      </Badge>
    ),
  },
];

const defaultSorted = [
  {
    dataField: "lastname",
    order: "asc",
  },
];

const NoDataToShow = () => {
  return <img src={NoDataToShowImage} alt={""} className="fill" />;
};

class Professionals extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      professionals: [],
      is_loaded: false,
      currentPage: 1,
      professionalsPerPage: 10,
    };
  }

  fetchProfessionals() {
    this.setState({ is_loaded: false });
    axios
      .get(GET_PROFESSIONALS, {
        headers: headers,
      })
      .then((res) => {
        const professionals = res.data;
        this.setState({
          professionals: professionals,
          is_loaded: true,
        });
      })
      .catch((e) => {
        console.log(e);
        if (e.response?.status === 401) {
          this.setState({
            forbidden: true,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to load professionals.",
          });
        }
        this.setState({ is_loaded: true });
      });
  }

  handlePageChange = (selectedPage) => {
    this.setState({
      currentPage: selectedPage.selected + 1,
    });
  };

  componentDidMount() {
    this.fetchProfessionals();
  }

  render() {
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Professionals</h2>
            <Button
              variant="primary"
              onClick={() => this.props.history.push('/data_management/professionals/new')}
            >
              New Professional
            </Button>
          </div>
          <ToolkitProvider
            keyField="professional_id"
            data={this.state.professionals}
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
                  loading={!this.state.is_loaded}
                />
              </div>
            )}
          </ToolkitProvider>
        </div>
        <Footer />
      </>
    );
  }
}

export default Professionals;
