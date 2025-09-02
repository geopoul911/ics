// Built-ins
import React from "react";

// Modules / Functions
import axios from "axios";
import { Button, Header, Icon, Modal } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../global_vars";

// Variables
window.Swal = Swal;

// API endpoints for different object types - Using regions API
const DELETE_ENDPOINTS = {
  'Country': 'http://localhost:8000/api/regions/country/',
  'Province': 'http://localhost:8000/api/regions/province/',
  'City': 'http://localhost:8000/api/regions/city/',
  'User': 'http://localhost:8000/api/site_admin/del_usr/',
  'Consultant': 'http://localhost:8000/api/administration/consultant/',
  'Bank': 'http://localhost:8000/api/administration/bank/',
  'InsuranceCarrier': 'http://localhost:8000/api/administration/insurance_carrier/',
  'Profession': 'http://localhost:8000/api/administration/profession/',
  'ProjectCategory': 'http://localhost:8000/api/administration/project_category/',
  'TaskCategory': 'http://localhost:8000/api/administration/task_category/',
  'Document': 'http://localhost:8000/api/data_management/document/',
  'Client': 'http://localhost:8000/api/data_management/client/',
  'ClientContact': 'http://localhost:8000/api/data_management/client_contact/',
  'BankClientAccount': 'http://localhost:8000/api/data_management/bank_client_account/',
  'Project': 'http://localhost:8000/api/data_management/project/',
  'AssociatedClient': 'http://localhost:8000/api/data_management/associated_client/',
  'TaskComment': 'http://localhost:8000/api/data_management/task_comment/',
  'Property': 'http://localhost:8000/api/data_management/property/',
  // Add more object types as needed
};

// Redirect URLs after successful deletion
const REDIRECT_URLS = {
  'Country': '/regions/all_countries',
  'Province': '/regions/all_provinces', 
  'City': '/regions/all_cities',
  'User': '/site_administration/all_users',
  'Consultant': '/administration/all_consultants',
  'Bank': '/administration/all_banks',
  'InsuranceCarrier': '/administration/all_insurance_carriers',
  'Profession': '/administration/all_professions',
  'ProjectCategory': '/administration/all_project_categories',
  'TaskCategory': '/administration/all_task_categories',
  'Document': '/data_management/documents',
  'Client': '/data_management/all_clients',
  'ClientContact': '/data_management/all_client_contacts',
  'BankClientAccount': '/data_management/all_bank_client_accounts',
  'Project': '/data_management/all_projects',
  'AssociatedClient': '/data_management/all_associated_clients',
  'TaskComment': '/data_management/all_task_comments',
  'Property': '/data_management/all_properties',
  // Add more redirect URLs as needed
};

function DeleteObjectModal(props) {
  const [open, setOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  const deleteObject = async () => {
    setBusy(true);
    
    try {
      const endpoint = DELETE_ENDPOINTS[props.objectType];
      if (!endpoint) {
        throw new Error(`No delete endpoint configured for object type: ${props.objectType}`);
      }

      // Update headers with current token
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      // For the new data_management API, we use DELETE method with the ID in the URL
      const deleteUrl = `${endpoint}${props.objectId}/`;

      const response = await axios({
        method: "delete",
        url: deleteUrl,
        headers: currentHeaders,
      });

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `${props.objectType} deleted successfully`,
      });

      // Redirect if callback is provided, otherwise use default redirect
      if (props.onObjectDeleted) {
        props.onObjectDeleted(response.data);
      } else {
        const redirectUrl = REDIRECT_URLS[props.objectType];
        if (redirectUrl) {
          window.location.href = redirectUrl;
        }
      }

    } catch (error) {
      console.error('Delete error:', error);
      
      // Check if this is a ProtectedError from the backend
      if (error.response?.data?.related_objects || error.response?.data?.errormsg?.includes('Cannot delete')) {
        const relatedObjects = error.response.data.related_objects || [];
        const errorMessage = error.response.data.errormsg || '';
        
        // Create a detailed error message with HTML formatting
        let htmlContent = `<div style="text-align: left;">`;
        
        if (errorMessage) {
          // Split the error message by newlines and format it
          const lines = errorMessage.split('\n');
          lines.forEach(line => {
            if (line.trim()) {
              if (line.startsWith('•')) {
                htmlContent += `<li style="margin: 5px 0;">${line.substring(1).trim()}</li>`;
              } else if (line.includes('Cannot delete')) {
                htmlContent += `<p style="font-weight: bold; color: #d33; margin-bottom: 15px;">${line}</p>`;
              } else if (line.includes('Please remove')) {
                htmlContent += `<p style="color: #666; font-size: 0.9em; margin-top: 15px; font-weight: bold;">${line}</p>`;
              } else {
                htmlContent += `<p>${line}</p>`;
              }
            }
          });
        } else if (relatedObjects.length > 0) {
          htmlContent += `<p><strong>Cannot delete this ${props.objectType.toLowerCase()} because it is referenced by the following objects:</strong></p>
            <ul style="margin: 10px 0; padding-left: 20px;">`;
          
          relatedObjects.forEach(obj => {
            htmlContent += `<li>${obj}</li>`;
          });
          
          htmlContent += `</ul>
            <p style="color: #666; font-size: 0.9em; margin-top: 15px;">
              <strong>Solution:</strong> Delete or reassign these related objects first, then try deleting this ${props.objectType.toLowerCase()} again.
            </p>`;
        }
        
        htmlContent += `</div>`;
        
        Swal.fire({
          icon: "warning",
          title: "Protected Object",
          html: htmlContent,
          confirmButtonText: "OK",
          width: '600px'
        });
      } else {
        // Handle other types of errors
        const errorMessage = error.response?.data?.errormsg || 
                            error.response?.data?.error || 
                            error.response?.data?.detail || 
                            error.message || 
                            `Failed to delete ${props.objectType}`;
        
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
        });
      }
    } finally {
      setBusy(false);
      setOpen(false);
    }
  };

  // Custom trigger button if provided, otherwise use default
  const triggerButton = props.trigger || (
    <Button color="red" style={{ float: "right" }}>
      Delete {props.objectType}
    </Button>
  );

  return (
    <Modal
      basic
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="small"
      trigger={triggerButton}
    >
      <Header icon>
        <Icon name="delete" style={{ color: "red" }} />
        <h1 style={{ color: "red" }}>Delete {props.objectType}</h1>
      </Header>
      <Modal.Content>
        <p>
          Are you sure you want to delete this {props.objectType}?
          {props.objectName && (
            <strong> "{props.objectName}"</strong>
          )}
        </p>
        {props.warningMessage && (
          <p style={{ color: "orange", fontWeight: "bold" }}>
            ⚠️ {props.warningMessage}
          </p>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button basic inverted onClick={() => setOpen(false)} disabled={busy}>
          <Icon name="remove" /> Cancel
        </Button>
        <Button
          inverted
          color="red"
          loading={busy}
          onClick={deleteObject}
          disabled={busy}
        >
          <Icon name="checkmark" /> Delete
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default DeleteObjectModal;
