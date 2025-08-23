// Built-ins
import { useState } from "react";

// Modules / Functions
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// Icons / Images
import noPermissionsImg from "../../../../images/site_administration/roles/no_permissions.png";
import readOnlyImg from "../../../../images/site_administration/roles/read_only.png";
import basicImg from "../../../../images/site_administration/roles/basic.png";
import backOfficeImg from "../../../../images/site_administration/roles/backoffice.png";
import administratorImg from "../../../../images/site_administration/roles/administrator.png";
import { AiOutlineWarning } from "react-icons/ai";

// Variables
const noPermissions = () => (
  <img src={noPermissionsImg} alt="" style={{ maxWidth: "100%" }} />
);
const readOnly = () => (
  <img src={readOnlyImg} alt="" style={{ maxWidth: "100%" }} />
);
const basic = () => <img src={basicImg} alt="" style={{ maxWidth: "100%" }} />;
const backOffice = () => (
  <img src={backOfficeImg} alt="" style={{ maxWidth: "100%" }} />
);
const administrator = () => (
  <img src={administratorImg} alt="" style={{ maxWidth: "100%" }} />
);

window.Swal = Swal;

function Roles() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <label
        style={{
          marginTop: 20,
          cursor: "pointer",
          border: "1px solid #4183c4",
          borderRadius: 6,
          padding: 10,
          color: "#4183c4",
        }}
        onClick={() => {
          handleShow();
        }}
      >
        Click Here to see more about Roles
      </label>
      <Modal
        show={show}
        size="lg"
        style={{ width: "80% !important" }}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title> User Roles </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs>
            <TabList>
              <Tab>No Permissions</Tab>
              <Tab>Read Only</Tab>
              <Tab>Basic</Tab>
              <Tab>Back Office</Tab>
              <Tab>Administrator</Tab>
            </TabList>
            <TabPanel>{noPermissions()}</TabPanel>
            <TabPanel>{readOnly()}</TabPanel>
            <TabPanel>{basic()}</TabPanel>
            <TabPanel>{backOffice()}</TabPanel>
            <TabPanel>{administrator()}</TabPanel>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            <AiOutlineWarning style={{ color: "red", fontSize: "1.5em", marginRight: "0.5em" }}/>
            Setting a user role will not update User's Active / Staff / Superuser status
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Roles;
