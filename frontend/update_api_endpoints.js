#!/usr/bin/env node
/**
 * Script to update all frontend components to use the new Django API endpoints
 * This script will help identify and update components that need API integration
 */

const fs = require('fs');
const path = require('path');

// Components that need API updates
const componentsToUpdate = [
  // Reference Data
  'countries/countries.jsx',
  'provinces/provinces.jsx', 
  'cities/cities.jsx',
  'banks/banks.jsx',
  'insurance_carriers/insurance_carriers.jsx',
  
  // Client Management
  'clients/clients.jsx',
  'clients/client_detail.jsx',
  'bank_client_accounts/bank_client_accounts.jsx',
  'bank_client_accounts/bank_client_account_detail.jsx',
  
  // Consultant Management
  'consultants/consultants.jsx',
  'consultants/consultant_detail.jsx',
  
  // Project Management
  'projects/projects.jsx',
  'projects/project_detail.jsx',
  'project_categories/project_categories.jsx',
  'project_categories/project_category_detail.jsx',
  'associated_clients/associated_clients.jsx',
  'associated_clients/associated_client_detail.jsx',
  
  // Document Management
  'documents/documents.jsx',
  'documents/document_detail.jsx',
  
  // Professional Management
  'professions/professions.jsx',
  'professions/profession_detail.jsx',
  'professionals/professionals.jsx',
  'professionals/professional_detail.jsx',
  'client_contacts/client_contacts.jsx',
  'client_contacts/client_contact_detail.jsx',
  
  // Property Management
  'properties/properties.jsx',
  'properties/property_detail.jsx',
  'bank_project_accounts/bank_project_accounts.jsx',
  'bank_project_accounts/bank_project_account_detail.jsx',
  
  // Task Management
  'project_tasks/project_tasks.jsx',
  'project_tasks/project_task_detail.jsx',
  'task_categories/task_categories.jsx',
  'task_categories/task_category_detail.jsx',
  'task_comments/task_comments.jsx',
  'task_comments/task_comment_detail.jsx',
  
  // Cash and Taxation Management
  'cash/cash.jsx',
  'cash/cash_detail.jsx',
  'taxation_projects/taxation_projects.jsx',
  'taxation_projects/taxation_project_detail.jsx',
];

// API endpoint mappings
const apiEndpoints = {
  // Reference Data
  'countries': 'API_ENDPOINTS.COUNTRIES',
  'provinces': 'API_ENDPOINTS.PROVINCES',
  'cities': 'API_ENDPOINTS.CITIES',
  'banks': 'API_ENDPOINTS.BANKS',
  'insurance_carriers': 'API_ENDPOINTS.INSURANCE_CARRIERS',
  
  // Client Management
  'clients': 'API_ENDPOINTS.CLIENTS',
  'bank_client_accounts': 'API_ENDPOINTS.BANK_CLIENT_ACCOUNTS',
  
  // Consultant Management
  'consultants': 'API_ENDPOINTS.CONSULTANTS',
  
  // Project Management
  'projects': 'API_ENDPOINTS.PROJECTS',
  'project_categories': 'API_ENDPOINTS.PROJECT_CATEGORIES',
  'associated_clients': 'API_ENDPOINTS.ASSOCIATED_CLIENTS',
  
  // Document Management
  'documents': 'API_ENDPOINTS.DOCUMENTS',
  
  // Professional Management
  'professions': 'API_ENDPOINTS.PROFESSIONS',
  'professionals': 'API_ENDPOINTS.PROFESSIONALS',
  'client_contacts': 'API_ENDPOINTS.CLIENT_CONTACTS',
  
  // Property Management
  'properties': 'API_ENDPOINTS.PROPERTIES',
  'bank_project_accounts': 'API_ENDPOINTS.BANK_PROJECT_ACCOUNTS',
  
  // Task Management
  'project_tasks': 'API_ENDPOINTS.PROJECT_TASKS',
  'task_categories': 'API_ENDPOINTS.TASK_CATEGORIES',
  'task_comments': 'API_ENDPOINTS.TASK_COMMENTS',
  
  // Cash and Taxation Management
  'cash': 'API_ENDPOINTS.CASH',
  'taxation_projects': 'API_ENDPOINTS.TAXATION_PROJECTS',
};

// Reference data endpoints for dropdowns
const referenceEndpoints = {
  'countries': 'API_ENDPOINTS.REFERENCE_COUNTRIES',
  'provinces': 'API_ENDPOINTS.REFERENCE_PROVINCES',
  'cities': 'API_ENDPOINTS.REFERENCE_CITIES',
  'banks': 'API_ENDPOINTS.REFERENCE_BANKS',
  'consultants': 'API_ENDPOINTS.REFERENCE_CONSULTANTS',
  'project_categories': 'API_ENDPOINTS.REFERENCE_PROJECT_CATEGORIES',
  'task_categories': 'API_ENDPOINTS.REFERENCE_TASK_CATEGORIES',
  'professions': 'API_ENDPOINTS.REFERENCE_PROFESSIONS',
  'professionals': 'API_ENDPOINTS.REFERENCE_PROFESSIONALS',
  'insurance_carriers': 'API_ENDPOINTS.REFERENCE_INSURANCE_CARRIERS',
};

console.log('Frontend-Backend API Integration Update Script');
console.log('==============================================\n');

console.log('Components that need API updates:');
componentsToUpdate.forEach((component, index) => {
  console.log(`${index + 1}. ${component}`);
});

console.log('\nAPI Endpoints available:');
Object.entries(apiEndpoints).forEach(([key, value]) => {
  console.log(`${key}: ${value}`);
});

console.log('\nReference endpoints for dropdowns:');
Object.entries(referenceEndpoints).forEach(([key, value]) => {
  console.log(`${key}: ${value}`);
});

console.log('\nUpdate Instructions:');
console.log('1. Replace axios imports with apiGet, apiPost, apiPut, apiDelete from utils/api');
console.log('2. Replace hardcoded URLs with API_ENDPOINTS constants');
console.log('3. Update fetch methods to use async/await pattern');
console.log('4. Update error handling to use the new API error format');
console.log('5. Update reference data loading to use reference endpoints');

console.log('\nExample update pattern:');
console.log(`
// OLD:
import axios from "axios";
const GET_DATA = "http://localhost:8000/api/data/";

// NEW:
import { apiGet, API_ENDPOINTS } from "../../../utils/api";
const GET_DATA = API_ENDPOINTS.DATA;

// OLD:
axios.get(GET_DATA, { headers })
  .then((res) => {
    this.setState({ data: res.data });
  })
  .catch((e) => {
    console.log(e);
  });

// NEW:
try {
  const data = await apiGet(GET_DATA);
  this.setState({ data });
} catch (error) {
  console.error('Error fetching data:', error);
}
`);

console.log('\nNext steps:');
console.log('1. Update the API configuration in utils/api.js (DONE)');
console.log('2. Update projects component (DONE)');
console.log('3. Update remaining components systematically');
console.log('4. Test API integration');
console.log('5. Update authentication flow');
