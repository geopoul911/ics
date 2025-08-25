// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Modules / Functions
import { apiGet, apiPost, apiPut, apiDelete, API_ENDPOINTS } from '../../../utils/api';
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Swal from "sweetalert2";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Button, Badge } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import AdvancedSearch from "../../common/AdvancedSearch";
import { filterData } from "../../../utils/searchUtils";

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

// Helper function to format comment text
const formatCommentText = (text) => {
  if (!text) return '';
  return text.length > 80 ? text.substring(0, 80) + '...' : text;
};

// Helper function to get comment type color
const getCommentTypeColor = (type) => {
  switch (type?.toLowerCase()) {
    case 'internal': return 'info';
    case 'client': return 'primary';
    case 'urgent': return 'danger';
    case 'update': return 'success';
    case 'note': return 'warning';
    default: return 'secondary';
  }
};

const TaskCommentsComponent = () => {
  const history = useHistory();

  const columns = [
    {
      dataField: "taskcomment_id",
      text: "ID",
      sort: true,
      filter: textFilter(),
      formatter: (cell, row) => (
        <Button variant="link" className="p-0" onClick={() => history.push(`/data_management/task_comments/${row.taskcomment_id}`)}>
          {row.taskcomment_id}
        </Button>
      ),
    },
    {
      dataField: "commenttext",
      text: "Comment",
      sort: true,
      filter: textFilter(),
      formatter: (cell, row) => formatCommentText(row.commenttext),
    },
    {
      dataField: "project_task.title",
      text: "Task",
      sort: true,
      filter: textFilter(),
      formatter: (cell, row) => {
        const taskTitle = row.project_task?.title || '';
        return taskTitle.length > 40 ? taskTitle.substring(0, 40) + '...' : taskTitle;
      },
    },
    {
      dataField: "project.title",
      text: "Project",
      sort: true,
      filter: textFilter(),
      formatter: (cell, row) => {
        const projectTitle = row.project?.title || '';
        return projectTitle.length > 30 ? projectTitle.substring(0, 30) + '...' : projectTitle;
      },
    },
    {
      dataField: "commenttype",
      text: "Type",
      sort: true,
      filter: textFilter(),
    formatter: (cell, row) => {
      const type = row.commenttype || 'Note';
      const color = getCommentTypeColor(type);
      return (
        <Badge bg={color}>
          {type}
        </Badge>
      );
    },
  },
  {
    dataField: "author.fullname",
    text: "Author",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.author?.fullname || '',
  },
  {
    dataField: "commentdate",
    text: "Date",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      return row.commentdate ? new Date(row.commentdate).toLocaleDateString() : '';
    },
  },
  {
    dataField: "commenttime",
    text: "Time",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      if (!row.commenttime) return '';
      return new Date(row.commenttime).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    },
  },
  {
    dataField: "isprivate",
    text: "Private",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Badge bg={row.isprivate ? 'warning' : 'success'}>
        {row.isprivate ? 'Yes' : 'No'}
      </Badge>
    ),
  },
  {
    dataField: "isurgent",
    text: "Urgent",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Badge bg={row.isurgent ? 'danger' : 'secondary'}>
        {row.isurgent ? 'Yes' : 'No'}
      </Badge>
    ),
  },
  {
    dataField: "requiresaction",
    text: "Requires Action",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Badge bg={row.requiresaction ? 'warning' : 'success'}>
        {row.requiresaction ? 'Yes' : 'No'}
      </Badge>
    ),
  },
  {
    dataField: "actioncompleted",
    text: "Action Completed",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Badge bg={row.actioncompleted ? 'success' : 'secondary'}>
        {row.actioncompleted ? 'Yes' : 'No'}
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
      dataField: "commentdate",
      order: "desc",
    },
  ];

  const NoDataToShow = () => {
    return <img src={NoDataToShowImage} alt={""} className="fill" />;
  };

  const [task_comments, setTaskComments] = React.useState([]);
  const [filtered_comments, setFilteredComments] = React.useState([]);
  const [is_loaded, setIsLoaded] = React.useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = React.useState(false);


  const fetchTaskComments = async () => {
    setIsLoaded(false);
    try {
      const comments = await apiGet(API_ENDPOINTS.TASK_COMMENTS);
      setTaskComments(comments);
      setFilteredComments(comments);
      setIsLoaded(true);
    } catch (error) {
      console.log(error);
      if (error.message === 'Authentication required') {
        // Handle forbidden
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load task comments.",
        });
      }
      setIsLoaded(true);
    }
  };

  const handleAdvancedSearch = (criteria) => {
    const filtered = filterData(task_comments, criteria);
    setFilteredComments(filtered);
  };

  const handleClearSearch = () => {
    setFilteredComments(task_comments);
  };

  const toggleAdvancedSearch = () => {
    setShowAdvancedSearch(!showAdvancedSearch);
  };

  // Define search filters
  const searchFilters = [
    {
      key: 'commenttext',
      type: 'text',
      label: 'Comment Text',
      placeholder: 'Search in comment text...',
      width: 6
    },
    {
      key: 'project_task.title',
      type: 'text',
      label: 'Task Title',
      placeholder: 'Search by task title...',
      width: 6
    },
    {
      key: 'project.title',
      type: 'text',
      label: 'Project Title',
      placeholder: 'Search by project title...',
      width: 6
    },
    {
      key: 'commenttype',
      type: 'status',
      label: 'Comment Type',
      options: [
        { value: 'internal', label: 'Internal', color: 'info' },
        { value: 'client', label: 'Client', color: 'primary' },
        { value: 'urgent', label: 'Urgent', color: 'danger' },
        { value: 'update', label: 'Update', color: 'success' },
        { value: 'note', label: 'Note', color: 'warning' }
      ],
      width: 6
    },
    {
      key: 'author.fullname',
      type: 'text',
      label: 'Author',
      placeholder: 'Search by author name...',
      width: 6
    },
    {
      key: 'commentdate',
      type: 'dateRange',
      label: 'Comment Date Range',
      width: 6
    },
    {
      key: 'isprivate',
      type: 'select',
      label: 'Privacy',
      options: [
        { value: true, label: 'Private' },
        { value: false, label: 'Public' }
      ],
      width: 6
    },
    {
      key: 'isurgent',
      type: 'select',
      label: 'Urgency',
      options: [
        { value: true, label: 'Urgent' },
        { value: false, label: 'Normal' }
      ],
      width: 6
    },
    {
      key: 'requiresaction',
      type: 'select',
      label: 'Requires Action',
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ],
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
    fetchTaskComments();
  }, []);

  return (
    <>
      <NavigationBar />
      <div className="mainContainer">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Task Comments</h2>
          <Button
            variant="primary"
            onClick={() => history.push('/data_management/task_comments/new')}
          >
            New Task Comment
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
          keyField="taskcomment_id"
          data={filtered_comments}
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

export default TaskCommentsComponent;
