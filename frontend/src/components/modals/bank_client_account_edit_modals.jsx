// Built-ins
import React from "react";

// Modules / Functions
import { Button, Form, Modal } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

// Icons
import { BiEdit } from "react-icons/bi";

// Global Variables
import { headers } from "../global_vars";

// Variables
window.Swal = Swal;

// Edit Bank Client Account ID Modal
export function EditBankClientAccountIdModal({ bankClientAccount, refreshData }) {
  const [show, setShow] = React.useState(false);
  const [bankclientacco_id, setBankclientacco_id] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (bankClientAccount) {
      setBankclientacco_id(bankClientAccount.bankclientacco_id || "");
    }
  }, [bankClientAccount]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async () => {
    if (!bankclientacco_id.trim()) {
      Swal.fire("Error", "Bank Client Account ID is required", "error");
      return;
    }

    setBusy(true);
    try {
      await axios.put(
        `http://localhost:8000/api/data_management/bank_client_account/${bankClientAccount.bankclientacco_id}/`,
        { bankclientacco_id },
        { headers }
      );

      Swal.fire("Success", "Bank Client Account ID updated successfully", "success");
      if (refreshData) refreshData();
      handleClose();
    } catch (error) {
      console.error("Error updating bank client account ID:", error);
      const errorMessage = error.response?.data?.error || "Failed to update Bank Client Account ID";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Button variant="outline-primary" size="sm" onClick={handleShow}>
        <BiEdit /> Edit ID
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Bank Client Account ID</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Bank Client Account ID *</Form.Label>
              <Form.Control
                type="text"
                value={bankclientacco_id}
                onChange={(e) => setBankclientacco_id(e.target.value)}
                placeholder="Enter bank client account ID"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={busy}>
            {busy ? "Updating..." : "Update"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Bank Client Account Client Modal
export function EditBankClientAccountClientModal({ bankClientAccount, refreshData }) {
  const [show, setShow] = React.useState(false);
  const [client_id, setClient_id] = React.useState("");
  const [clients, setClients] = React.useState([]);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (bankClientAccount) {
      setClient_id(bankClientAccount.client?.client_id || "");
    }
  }, [bankClientAccount]);

  React.useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/data_management/all_clients/",
          { headers }
        );
        setClients(response.data.all_clients || []);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fetchClients();
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async () => {
    if (!client_id) {
      Swal.fire("Error", "Client is required", "error");
      return;
    }

    setBusy(true);
    try {
      await axios.put(
        `http://localhost:8000/api/data_management/bank_client_account/${bankClientAccount.bankclientacco_id}/`,
        { client_id },
        { headers }
      );

      Swal.fire("Success", "Client updated successfully", "success");
      if (refreshData) refreshData();
      handleClose();
    } catch (error) {
      console.error("Error updating client:", error);
      const errorMessage = error.response?.data?.error || "Failed to update client";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Button variant="outline-primary" size="sm" onClick={handleShow}>
        <BiEdit /> Edit Client
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Client *</Form.Label>
              <Form.Control
                as="select"
                value={client_id}
                onChange={(e) => setClient_id(e.target.value)}
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client.client_id} value={client.client_id}>
                    {client.surname} {client.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={busy}>
            {busy ? "Updating..." : "Update"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Bank Client Account Bank Modal
export function EditBankClientAccountBankModal({ bankClientAccount, refreshData }) {
  const [show, setShow] = React.useState(false);
  const [bank_id, setBank_id] = React.useState("");
  const [banks, setBanks] = React.useState([]);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (bankClientAccount) {
      setBank_id(bankClientAccount.bank?.bank_id || "");
    }
  }, [bankClientAccount]);

  React.useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/administration/all_banks/",
          { headers }
        );
        setBanks(response.data.all_banks || []);
      } catch (error) {
        console.error("Error fetching banks:", error);
      }
    };
    fetchBanks();
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async () => {
    if (!bank_id) {
      Swal.fire("Error", "Bank is required", "error");
      return;
    }

    setBusy(true);
    try {
      await axios.put(
        `http://localhost:8000/api/data_management/bank_client_account/${bankClientAccount.bankclientacco_id}/`,
        { bank_id },
        { headers }
      );

      Swal.fire("Success", "Bank updated successfully", "success");
      if (refreshData) refreshData();
      handleClose();
    } catch (error) {
      console.error("Error updating bank:", error);
      const errorMessage = error.response?.data?.error || "Failed to update bank";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Button variant="outline-primary" size="sm" onClick={handleShow}>
        <BiEdit /> Edit Bank
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Bank</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Bank *</Form.Label>
              <Form.Control
                as="select"
                value={bank_id}
                onChange={(e) => setBank_id(e.target.value)}
              >
                <option value="">Select a bank</option>
                {banks.map((bank) => (
                  <option key={bank.bank_id} value={bank.bank_id}>
                    {bank.title}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={busy}>
            {busy ? "Updating..." : "Update"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Bank Client Account Transit Number Modal
export function EditBankClientAccountTransitNumberModal({ bankClientAccount, refreshData }) {
  const [show, setShow] = React.useState(false);
  const [transitnumber, setTransitnumber] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (bankClientAccount) {
      setTransitnumber(bankClientAccount.transitnumber || "");
    }
  }, [bankClientAccount]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async () => {
    setBusy(true);
    try {
      await axios.put(
        `http://localhost:8000/api/data_management/bank_client_account/${bankClientAccount.bankclientacco_id}/`,
        { transitnumber },
        { headers }
      );

      Swal.fire("Success", "Transit number updated successfully", "success");
      if (refreshData) refreshData();
      handleClose();
    } catch (error) {
      console.error("Error updating transit number:", error);
      const errorMessage = error.response?.data?.error || "Failed to update transit number";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Button variant="outline-primary" size="sm" onClick={handleShow}>
        <BiEdit /> Edit Transit Number
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Transit Number</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Transit Number</Form.Label>
              <Form.Control
                type="text"
                value={transitnumber}
                onChange={(e) => setTransitnumber(e.target.value)}
                placeholder="Enter transit number"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={busy}>
            {busy ? "Updating..." : "Update"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Bank Client Account Account Number Modal
export function EditBankClientAccountAccountNumberModal({ bankClientAccount, refreshData }) {
  const [show, setShow] = React.useState(false);
  const [accountnumber, setAccountnumber] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (bankClientAccount) {
      setAccountnumber(bankClientAccount.accountnumber || "");
    }
  }, [bankClientAccount]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async () => {
    if (!accountnumber.trim()) {
      Swal.fire("Error", "Account number is required", "error");
      return;
    }

    setBusy(true);
    try {
      await axios.put(
        `http://localhost:8000/api/data_management/bank_client_account/${bankClientAccount.bankclientacco_id}/`,
        { accountnumber },
        { headers }
      );

      Swal.fire("Success", "Account number updated successfully", "success");
      if (refreshData) refreshData();
      handleClose();
    } catch (error) {
      console.error("Error updating account number:", error);
      const errorMessage = error.response?.data?.error || "Failed to update account number";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Button variant="outline-primary" size="sm" onClick={handleShow}>
        <BiEdit /> Edit Account Number
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Account Number</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Account Number *</Form.Label>
              <Form.Control
                type="text"
                value={accountnumber}
                onChange={(e) => setAccountnumber(e.target.value)}
                placeholder="Enter account number"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={busy}>
            {busy ? "Updating..." : "Update"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Bank Client Account IBAN Modal
export function EditBankClientAccountIbanModal({ bankClientAccount, refreshData }) {
  const [show, setShow] = React.useState(false);
  const [iban, setIban] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (bankClientAccount) {
      setIban(bankClientAccount.iban || "");
    }
  }, [bankClientAccount]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async () => {
    setBusy(true);
    try {
      await axios.put(
        `http://localhost:8000/api/data_management/bank_client_account/${bankClientAccount.bankclientacco_id}/`,
        { iban },
        { headers }
      );

      Swal.fire("Success", "IBAN updated successfully", "success");
      if (refreshData) refreshData();
      handleClose();
    } catch (error) {
      console.error("Error updating IBAN:", error);
      const errorMessage = error.response?.data?.error || "Failed to update IBAN";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Button variant="outline-primary" size="sm" onClick={handleShow}>
        <BiEdit /> Edit IBAN
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit IBAN</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>IBAN</Form.Label>
              <Form.Control
                type="text"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                placeholder="Enter IBAN"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={busy}>
            {busy ? "Updating..." : "Update"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Bank Client Account Active Modal
export function EditBankClientAccountActiveModal({ bankClientAccount, refreshData }) {
  const [show, setShow] = React.useState(false);
  const [active, setActive] = React.useState(true);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (bankClientAccount) {
      setActive(bankClientAccount.active !== false);
    }
  }, [bankClientAccount]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async () => {
    setBusy(true);
    try {
      await axios.put(
        `http://localhost:8000/api/data_management/bank_client_account/${bankClientAccount.bankclientacco_id}/`,
        { active },
        { headers }
      );

      Swal.fire("Success", "Active status updated successfully", "success");
      if (refreshData) refreshData();
      handleClose();
    } catch (error) {
      console.error("Error updating active status:", error);
      const errorMessage = error.response?.data?.error || "Failed to update active status";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Button variant="outline-primary" size="sm" onClick={handleShow}>
        <BiEdit /> Edit Active Status
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Active Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Active</Form.Label>
              <Form.Check
                type="switch"
                id="active-switch"
                label="Account is active"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={busy}>
            {busy ? "Updating..." : "Update"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
