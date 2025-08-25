import { apiGet, apiPost, apiPut, apiDelete, API_ENDPOINTS } from '../../../utils/api';
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

// Helper function to get relationship color
const getRelationshipColor = (relationship) => {
  switch (relationship?.toLowerCase()) {
    case 'spouse': return 'primary';
    case 'family': return 'success';
    case 'business': return 'warning';
    case 'legal': return 'info';
    case 'other': return 'secondary';
    default: return 'light';
  }
};

// Helper function to format contact name
const formatContactName = (contact) => {
  const parts = [];
  if (contact.firstname) parts.push(contact.firstname);
  if (contact.lastname) parts.push(contact.lastname);
  return parts.join(' ') || 'N/A';
};

const columns = [
  {
    dataField: "clientcontact_id",
    text: "ID",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button variant="link" className="p-0">
        <a href={"/data_management/client_contacts/" + row.clientcontact_id} className="text-decoration-none">
          {row.clientcontact_id}
        </a>
      </Button>
    ),
  },
  {
    dataField: "firstname",
    text: "Contact Name",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => formatContactName(row),
  },
  {
    dataField: "client.surname",
    text: "Client",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      const client = row.client;
      if (!client) return '';
      return `${client.surname} ${client.name}`;
    },
  },
  {
    dataField: "relationship",
    text: "Relationship",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      const relationship = row.relationship || 'Other';
      const color = getRelationshipColor(relationship);
      return (
        <Badge bg={color}>
          {relationship}
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
    dataField: "isprimary",
    text: "Primary Contact",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Badge bg={row.isprimary ? 'success' : 'secondary'}>
        {row.isprimary ? 'Yes' : 'No'}
      </Badge>
    ),
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
    dataField: "client.surname",
    order: "asc",
  },
];

const NoDataToShow = () => {
  return <img src={NoDataToShowImage} alt={""} className="fill" />;
};

class ClientContacts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      client_contacts: [],
      is_loaded: false,
      currentPage: 1,
      contactsPerPage: 10,
    };
  }

  async fetchClientContacts() {
    this.setState({ is_loaded: false });
    try {
      const contacts = await apiGet(API_ENDPOINTS.CLIENT_CONTACTS);
      this.setState({
        client_contacts: contacts,
        is_loaded: true,
      });
    } catch (error) {
      console.log(error);
      if (error.message === 'Authentication required') {
        this.setState({
          forbidden: true,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load client contacts.",
        });
      }
      this.setState({ is_loaded: true });
    }
  }

  handlePageChange = (selectedPage) => {
    this.setState({
      currentPage: selectedPage.selected + 1,
    });
  };

  componentDidMount() {
    this.fetchClientContacts();
  }

  render() {
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Client Contacts</h2>
            <Button
              variant="primary"
              onClick={() => this.props.history.push('/data_management/client_contacts/new')}
            >
              New Client Contact
            </Button>
          </div>
          <ToolkitProvider
            keyField="clientcontact_id"
            data={this.state.client_contacts}
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

export default ClientContacts;
