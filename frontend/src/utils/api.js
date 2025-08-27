// API Configuration for Django Backend
const API_BASE_URL = 'http://localhost:8000/api';

// Get authentication token from localStorage
const getAuthToken = () => {
  // Check multiple possible token storage keys
  const token = localStorage.getItem('user-token') || 
                localStorage.getItem('userToken') || 
                localStorage.getItem('authToken');
  
  // Debug logging to help identify authentication issues
  if (!token) {
    console.warn('No authentication token found in localStorage. Available keys:', {
      'user-token': localStorage.getItem('user-token'),
      'userToken': localStorage.getItem('userToken'),
      'authToken': localStorage.getItem('authToken')
    });
  }
  
  return token;
};

// Get CSRF token if needed
const getCSRFToken = () => {
  return document.querySelector('[name=csrfmiddlewaretoken]')?.value;
};

export const apiRequest = async (method, endpoint, data = null, isBlob = false) => {
  const headers = {
    'Content-Type': 'application/json'
  };

  // Add authentication headers
  const authToken = getAuthToken();
  if (authToken) {
    headers['Authorization'] = `Token ${authToken}`;
    headers['User-Token'] = authToken;
  } else {
    console.warn('No authentication token available for request to:', endpoint);
  }

  // Add CSRF token for POST/PUT/DELETE requests
  const csrfToken = getCSRFToken();
  if (csrfToken && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method.toUpperCase())) {
    headers['X-CSRFToken'] = csrfToken;
  }

  if (isBlob) {
    delete headers['Content-Type'];
  }

  const options = {
    method,
    headers,
    cache: 'no-store'
  };

  if (data && !isBlob) {
    options.body = JSON.stringify(data);
  } else if (data) {
    options.body = data;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      if (response.status === 401) {
        // Unauthorized - redirect to login
        localStorage.removeItem('user-token');
        localStorage.removeItem('userToken');
        localStorage.removeItem('authToken');
        window.location.href = '/login';
        throw new Error('Authentication required');
      }
      
      const error = await response.json().catch(() => ({ error: 'An error occurred' }));
      throw new Error(error.error || error.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    if (isBlob) {
      return response.blob();
    }

    return response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Convenience methods for common HTTP operations
export const apiGet = (endpoint) => apiRequest('GET', endpoint);
export const apiPost = (endpoint, data) => apiRequest('POST', endpoint, data);
export const apiPut = (endpoint, data) => apiRequest('PUT', endpoint, data);
export const apiDelete = (endpoint) => apiRequest('DELETE', endpoint);
export const apiPatch = (endpoint, data) => apiRequest('PATCH', endpoint, data);

// Data Management API endpoints
export const API_ENDPOINTS = {
  // Reference Data
  COUNTRIES: '/regions/all_countries/',
  PROVINCES: '/regions/all_provinces/',
  CITIES: '/regions/all_cities/',
  BANKS: '/administration/all_banks/',
  INSURANCE_CARRIERS: '/administration/all_insurance_carriers/',
  
  // Reference Data for dropdowns
  REFERENCE_COUNTRIES: '/regions/all_countries/',
  REFERENCE_PROVINCES: '/regions/all_provinces/',
  REFERENCE_CITIES: '/regions/all_cities/',
  REFERENCE_BANKS: '/administration/all_banks/',
  REFERENCE_CONSULTANTS: '/administration/all_consultants/',
  REFERENCE_PROJECT_CATEGORIES: '/administration/all_project_categories/',
  REFERENCE_TASK_CATEGORIES: '/administration/all_task_categories/',
  REFERENCE_PROFESSIONS: '/administration/all_professions/',
  REFERENCE_PROFESSIONALS: '/administration/all_professionals/',
  REFERENCE_INSURANCE_CARRIERS: '/administration/all_insurance_carriers/',
  REFERENCE_PROJECTS: '/data_management/all_projects/',
  REFERENCE_CLIENTS: '/data_management/all_clients/',
  
  // Client Management
  CLIENTS: '/data_management/clients/',
  BANK_CLIENT_ACCOUNTS: '/data_management/bank-client-accounts/',
  
  // Consultant Management
  CONSULTANTS: '/administration/all_consultants/',
  
  // Project Management
  PROJECT_CATEGORIES: '/administration/all_project_categories/',
  PROJECTS: '/data_management/projects/',
  ASSOCIATED_CLIENTS: '/data_management/associated-clients/',
  
  // Document Management
  DOCUMENTS: '/data_management/all_documents/',
  
  // Professional Management
  PROFESSIONS: '/administration/all_professions/',
  PROFESSIONALS: '/administration/all_professionals/',
  CLIENT_CONTACTS: '/data_management/client-contacts/',
  
  // Property Management
  PROPERTIES: '/data_management/properties/',
  BANK_PROJECT_ACCOUNTS: '/data_management/bank-project-accounts/',
  
  // Task Management
  TASK_CATEGORIES: '/administration/all_task_categories/',
  PROJECT_TASKS: '/data_management/project-tasks/',
  TASK_COMMENTS: '/data_management/task-comments/',
  
  // Cash and Taxation Management
  CASH: '/data_management/cash/',
  TAXATION_PROJECTS: '/data_management/taxation-projects/',
  
  // Notification Management
  NOTIFICATIONS: '/data_management/notifications/',
  
  // Special endpoints
  CITIES_BY_PROVINCE: '/data_management/cities/by-province/',
  CLIENTS_SEARCH: '/data_management/clients/search/',
  CLIENTS_STATISTICS: '/data_management/clients/statistics/',
  PROJECTS_SEARCH: '/data_management/projects/search/',
  PROJECTS_STATISTICS: '/data_management/projects/statistics/',
  DOCUMENTS_EXPIRED: '/data_management/documents/expired/',
  DOCUMENTS_EXPIRING_SOON: '/data_management/documents/expiring-soon/',
  PROJECT_TASKS_OVERDUE: '/data_management/project-tasks/overdue/',
  PROJECT_TASKS_MY_TASKS: '/data_management/project-tasks/my-tasks/',
  PROJECT_TASKS_STATISTICS: '/data_management/project-tasks/statistics/',
  CASH_STATISTICS: '/data_management/cash/statistics/',
  TAXATION_PROJECTS_OVERDUE: '/data_management/taxation-projects/overdue/',
  NOTIFICATIONS_UNREAD: '/data_management/notifications/unread/',
};

// Helper function to handle pagination
export const handlePagination = (response) => {
  if (response.results) {
    return {
      data: response.results,
      total: response.count,
      next: response.next,
      previous: response.previous
    };
  }
  return {
    data: response,
    total: response.length,
    next: null,
    previous: null
  };
};

// Helper function to build query parameters
export const buildQueryParams = (params) => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => queryParams.append(key, v));
      } else {
        queryParams.append(key, value);
      }
    }
  });
  
  return queryParams.toString();
}; 