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

// API endpoints for different object types
const DELETE_ENDPOINTS = {
  'Country': 'http://localhost:8000/api/regions/delete_country/',
  'Province': 'http://localhost:8000/api/regions/delete_province/',
  'City': 'http://localhost:8000/api/regions/delete_city/',
  'User': 'http://localhost:8000/api/site_admin/del_usr/',
  // Add more object types as needed
};

// Redirect URLs after successful deletion
const REDIRECT_URLS = {
  'Country': '/regions/all_countries',
  'Province': '/regions/all_provinces', 
  'City': '/regions/all_cities',
  'User': '/site_administration/all_users',
  // Add more redirect URLs as needed
};

// Object type to ID field mapping
const ID_FIELD_MAPPING = {
  'Country': 'country_id',
  'Province': 'province_id',
  'City': 'city_id',
  'User': 'user_id',
  // Add more mappings as needed
};

function DeleteObjectModal(props) {
  const [open, setOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  const deleteObject = async () => {
    setBusy(true);
    
    try {
      const endpoint = DELETE_ENDPOINTS[props.object_type];
      if (!endpoint) {
        throw new Error(`No delete endpoint configured for object type: ${props.object_type}`);
      }

      // Get the correct ID field for this object type
      const idField = ID_FIELD_MAPPING[props.object_type];
      if (!idField) {
        throw new Error(`No ID field mapping configured for object type: ${props.object_type}`);
      }

      const requestData = {
        [idField]: props.object_id,
      };

      const response = await axios({
        method: "post",
        url: endpoint,
        headers: headers,
        data: requestData,
      });

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: response.data.message || `${props.object_type} deleted successfully`,
      });

      // Redirect if callback is provided, otherwise use default redirect
      if (props.onDeleteSuccess) {
        props.onDeleteSuccess(response.data);
      } else {
        const redirectUrl = REDIRECT_URLS[props.object_type];
        if (redirectUrl) {
          window.location.href = redirectUrl;
        }
      }

    } catch (error) {
      console.error('Delete error:', error);
      
      const errorMessage = error.response?.data?.errormsg || 
                          error.response?.data?.detail || 
                          error.message || 
                          `Failed to delete ${props.object_type}`;
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    } finally {
      setBusy(false);
      setOpen(false);
    }
  };

  // Custom trigger button if provided, otherwise use default
  const triggerButton = props.trigger || (
    <Button color="red" style={{ float: "right" }}>
      Delete {props.object_type}
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
        <h1 style={{ color: "red" }}>Delete {props.object_type}</h1>
      </Header>
      <Modal.Content>
        <p>
          Are you sure you want to delete this {props.object_type}?
          {props.object_name && (
            <strong> "{props.object_name}"</strong>
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
