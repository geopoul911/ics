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
  // pageHeader,
} from "../../global_vars";

// Variables
window.Swal = Swal;

const GET_PROPERTIES = "http://localhost:8000/api/properties/";

// Helper function to format address
const formatAddress = (property) => {
  const parts = [];
  if (property.address) parts.push(property.address);
  if (property.city?.title) parts.push(property.city.title);
  if (property.province?.title) parts.push(property.province.title);
  if (property.country?.title) parts.push(property.country.title);
  return parts.join(', ');
};

// Helper function to get property type color
const getPropertyTypeColor = (type) => {
  switch (type?.toLowerCase()) {
    case 'house': return 'primary';
    case 'apartment': return 'success';
    case 'commercial': return 'warning';
    case 'land': return 'info';
    default: return 'secondary';
  }
};

const columns = [
  {
    dataField: "property_id",
    text: "ID",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button variant="link" className="p-0">
        <a href={"/data_management/properties/" + row.property_id} className="text-decoration-none">
          {row.property_id}
        </a>
      </Button>
    ),
  },
  {
    dataField: "propertytype",
    text: "Property Type",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      const type = row.propertytype || 'Unknown';
      const color = getPropertyTypeColor(type);
      return (
        <Badge bg={color}>
          {type}
        </Badge>
      );
    },
  },
  {
    dataField: "address",
    text: "Address",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      const address = formatAddress(row);
      return address.length > 60 ? address.substring(0, 60) + '...' : address;
    },
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
    dataField: "squaremeters",
    text: "Square Meters",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      return row.squaremeters ? `${row.squaremeters} m²` : '';
    },
  },
  {
    dataField: "bedrooms",
    text: "Bedrooms",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      return row.bedrooms ? `${row.bedrooms} BR` : '';
    },
  },
  {
    dataField: "bathrooms",
    text: "Bathrooms",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      return row.bathrooms ? `${row.bathrooms} BA` : '';
    },
  },
  {
    dataField: "parkingspaces",
    text: "Parking",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      return row.parkingspaces ? `${row.parkingspaces} spaces` : '';
    },
  },
  {
    dataField: "yearbuilt",
    text: "Year Built",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "purchaseprice",
    text: "Purchase Price",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      if (!row.purchaseprice) return '';
      return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD'
      }).format(row.purchaseprice);
    },
  },
  {
    dataField: "currentvalue",
    text: "Current Value",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      if (!row.currentvalue) return '';
      return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD'
      }).format(row.currentvalue);
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
    dataField: "property_id",
    order: "desc",
  },
];

const NoDataToShow = () => {
  return <img src={NoDataToShowImage} alt={""} className="fill" />;
};

class Properties extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      properties: [],
      is_loaded: false,
      currentPage: 1,
      propertiesPerPage: 10,
    };
  }

  fetchProperties() {
    this.setState({ is_loaded: false });
    axios
      .get(GET_PROPERTIES, {
        headers: headers,
      })
      .then((res) => {
        const properties = res.data;
        this.setState({
          properties: properties,
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
            text: "Failed to load properties.",
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
    this.fetchProperties();
  }

  render() {
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Properties</h2>
            <Button
              variant="primary"
              onClick={() => this.props.history.push('/data_management/properties/new')}
            >
              New Property
            </Button>
          </div>
          <ToolkitProvider
            keyField="property_id"
            data={this.state.properties}
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

export default Properties;
