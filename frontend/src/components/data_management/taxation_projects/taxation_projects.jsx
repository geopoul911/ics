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
import { useHistory } from "react-router-dom";
import AdvancedSearch from "../../common/AdvancedSearch";
import { filterData, createFilterOptions } from "../../../utils/searchUtils";

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

const GET_TAXATION_PROJECTS = "http://localhost:8000/api/taxation_projects/";

// Helper function to get tax status color
const getTaxStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'filed': return 'success';
    case 'pending': return 'warning';
    case 'review': return 'info';
    case 'amended': return 'primary';
    case 'extension': return 'secondary';
    default: return 'light';
  }
};

// Helper function to format currency
const formatCurrency = (amount, currency = 'CAD') => {
  if (!amount) return '';
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

const TaxationProjectsComponent = () => {
  const history = useHistory();

  const columns = [
    {
      dataField: "taxationproject_id",
      text: "ID",
      sort: true,
      filter: textFilter(),
      formatter: (cell, row) => (
        <Button variant="link" className="p-0" onClick={() => history.push(`/data_management/taxation_projects/${row.taxationproject_id}`)}>
          {row.taxationproject_id}
        </Button>
      ),
    },
  {
    dataField: "title",
    text: "Project Title",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      const title = row.title || '';
      return title.length > 50 ? title.substring(0, 50) + '...' : title;
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
    dataField: "taxyear",
    text: "Tax Year",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "taxstatus",
    text: "Tax Status",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      const status = row.taxstatus || 'Pending';
      const color = getTaxStatusColor(status);
      return (
        <Badge bg={color}>
          {status}
        </Badge>
      );
    },
  },
  {
    dataField: "filingdate",
    text: "Filing Date",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      return row.filingdate ? new Date(row.filingdate).toLocaleDateString() : '';
    },
  },
  {
    dataField: "duedate",
    text: "Due Date",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      if (!row.duedate) return '';
      const dueDate = new Date(row.duedate);
      const today = new Date();
      const isOverdue = dueDate < today && row.taxstatus !== 'filed';
      
      return (
        <span className={isOverdue ? 'text-danger' : ''}>
          {dueDate.toLocaleDateString()}
          {isOverdue && <Badge bg="danger" className="ms-1">Overdue</Badge>}
        </span>
      );
    },
  },
  {
    dataField: "refundamount",
    text: "Refund Amount",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      if (!row.refundamount) return '';
      return (
        <span className="text-success">
          {formatCurrency(row.refundamount)}
        </span>
      );
    },
  },
  {
    dataField: "taxliability",
    text: "Tax Liability",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      if (!row.taxliability) return '';
      return (
        <span className="text-danger">
          {formatCurrency(row.taxliability)}
        </span>
      );
    },
  },
  {
    dataField: "consultant.fullname",
    text: "Consultant",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.consultant?.fullname || '',
  },
  {
    dataField: "taxformtype",
    text: "Tax Form Type",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      const formType = row.taxformtype || '';
      return formType.toUpperCase();
    },
  },
  {
    dataField: "isamended",
    text: "Amended",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Badge bg={row.isamended ? 'warning' : 'secondary'}>
        {row.isamended ? 'Yes' : 'No'}
      </Badge>
    ),
  },
  {
    dataField: "isextension",
    text: "Extension",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Badge bg={row.isextension ? 'info' : 'secondary'}>
        {row.isextension ? 'Yes' : 'No'}
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
      dataField: "taxyear",
      order: "desc",
    },
  ];

  const NoDataToShow = () => {
    return <img src={NoDataToShowImage} alt={""} className="fill" />;
  };

  const [taxation_projects, setTaxationProjects] = React.useState([]);
  const [filtered_projects, setFilteredProjects] = React.useState([]);
  const [is_loaded, setIsLoaded] = React.useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = React.useState(false);


  const fetchTaxationProjects = () => {
    setIsLoaded(false);
    axios
      .get(GET_TAXATION_PROJECTS, {
        headers: headers,
      })
      .then((res) => {
        const projects = res.data;
        setTaxationProjects(projects);
        setFilteredProjects(projects);
        setIsLoaded(true);
      })
      .catch((e) => {
        console.log(e);
        if (e.response?.status === 401) {
          // Handle forbidden
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to load taxation projects.",
          });
        }
        setIsLoaded(true);
      });
  };

  const handleAdvancedSearch = (criteria) => {
    const filtered = filterData(taxation_projects, criteria);
    setFilteredProjects(filtered);
  };

  const handleClearSearch = () => {
    setFilteredProjects(taxation_projects);
  };

  const toggleAdvancedSearch = () => {
    setShowAdvancedSearch(!showAdvancedSearch);
  };

  // Define search filters
  const searchFilters = [
    {
      key: 'title',
      type: 'text',
      label: 'Project Title',
      placeholder: 'Search by project title...',
      width: 6
    },
    {
      key: 'client.surname',
      type: 'text',
      label: 'Client Name',
      placeholder: 'Search by client name...',
      width: 6
    },
    {
      key: 'taxyear',
      type: 'select',
      label: 'Tax Year',
      options: createFilterOptions(taxation_projects, 'taxyear', 'Tax Year'),
      width: 4
    },
    {
      key: 'taxstatus',
      type: 'status',
      label: 'Tax Status',
      options: [
        { value: 'filed', label: 'Filed', color: 'success' },
        { value: 'pending', label: 'Pending', color: 'warning' },
        { value: 'review', label: 'Review', color: 'info' },
        { value: 'amended', label: 'Amended', color: 'primary' },
        { value: 'extension', label: 'Extension', color: 'secondary' }
      ],
      width: 8
    },
    {
      key: 'filingdate',
      type: 'dateRange',
      label: 'Filing Date Range',
      width: 6
    },
    {
      key: 'duedate',
      type: 'dateRange',
      label: 'Due Date Range',
      width: 6
    },
    {
      key: 'consultant.fullname',
      type: 'text',
      label: 'Consultant',
      placeholder: 'Search by consultant name...',
      width: 6
    },
    {
      key: 'active',
      type: 'select',
      label: 'Status',
      options: [
        { value: true, label: 'Active' },
        { value: false, label: 'Inactive' }
      ],
      width: 6
    }
  ];

  React.useEffect(() => {
    fetchTaxationProjects();
  }, []);

  return (
    <>
      <NavigationBar />
      <div className="mainContainer">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Taxation Projects</h2>
          <Button
            variant="primary"
            onClick={() => history.push('/data_management/taxation_projects/new')}
          >
            New Taxation Project
          </Button>
        </div>

        <AdvancedSearch
          filters={searchFilters}
          onSearch={handleAdvancedSearch}
          onClear={handleClearSearch}
          showAdvanced={showAdvancedSearch}
          onToggleAdvanced={toggleAdvancedSearch}
        />
        <ToolkitProvider
          keyField="taxationproject_id"
          data={filtered_projects}
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

export default TaxationProjectsComponent;
