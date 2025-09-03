// Built-ins
import React from "react";

// Modules / Functions
import { Form, Modal } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import axios from "axios";
import Swal from "sweetalert2";

// Icons
import { FiEdit } from "react-icons/fi";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Global Variables
import { headers } from "../global_vars";

// Variables
window.Swal = Swal;

// Edit Bank Client Account ID Modal
export function EditBankClientAccountIdModal({ bankClientAccount, refreshData, update_state }) {
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

  const isValid = bankclientacco_id.trim().length >= 2 && bankclientacco_id.trim().length <= 20;

  const handleSubmit = async () => {
    if (!isValid) return;

    setBusy(true);
    try {
      const currentHeaders = { ...headers, Authorization: "Token " + localStorage.getItem("userToken") };
      const res = await axios.put(
        `http://localhost:8000/api/data_management/bank_client_account/${bankClientAccount.bankclientacco_id}/`,
        { bankclientacco_id: bankclientacco_id.trim() },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Bank Client Account ID updated successfully", "success");
      if (update_state) update_state(res.data);
      else if (refreshData) refreshData();
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
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} /> Edit ID
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Bank Client Account ID</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Bank Client Account ID *</Form.Label>
              <Form.Control
                type="text"
                value={bankclientacco_id}
                onChange={(e) => setBankclientacco_id(e.target.value)}
                placeholder="Enter bank client account ID"
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isValid ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                {bankclientacco_id.trim().length < 2 && (
                  <li>
                    <AiOutlineWarning style={{ marginRight: 5 }} />
                    ID must be at least 2 characters
                  </li>
                )}
                {bankclientacco_id.trim().length > 20 && (
                  <li>
                    <AiOutlineWarning style={{ marginRight: 5 }} />
                    ID must be at most 20 characters
                  </li>
                )}
              </ul>
            ) : (
              <div style={{ color: "green" }}>
                <AiOutlineCheckCircle style={{ marginRight: 5 }} />
                Looks good.
              </div>
            )}
          </small>
          <Button color="red" onClick={handleClose} disabled={busy}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSubmit} loading={busy} disabled={!isValid}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Bank Client Account Client Modal
export function EditBankClientAccountClientModal({ bankClientAccount, refreshData, update_state }) {
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
        const currentHeaders = { ...headers, Authorization: "Token " + localStorage.getItem("userToken") };
        const response = await axios.get(
          "http://localhost:8000/api/data_management/all_clients/",
          { headers: currentHeaders }
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

  const isValid = client_id && client_id.trim().length > 0;

  const handleSubmit = async () => {
    if (!isValid) return;

    setBusy(true);
    try {
      const currentHeaders = { ...headers, Authorization: "Token " + localStorage.getItem("userToken") };
      const res = await axios.put(
        `http://localhost:8000/api/data_management/bank_client_account/${bankClientAccount.bankclientacco_id}/`,
        { client_id },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Client updated successfully", "success");
      if (update_state) update_state(res.data);
      else if (refreshData) refreshData();
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
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} /> Edit Client
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Client *</Form.Label>
              <Form.Control
                as="select"
                value={client_id}
                onChange={(e) => setClient_id(e.target.value)}
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client.client_id} value={client.client_id}>
                    {client.client_id} - {client.fullname}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isValid ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                <li>
                  <AiOutlineWarning style={{ marginRight: 5 }} />
                  Please select a client
                </li>
              </ul>
            ) : (
              <div style={{ color: "green" }}>
                <AiOutlineCheckCircle style={{ marginRight: 5 }} />
                Looks good.
              </div>
            )}
          </small>
          <Button color="red" onClick={handleClose} disabled={busy}>Cancel</Button>
          <Button color="green" onClick={handleSubmit} loading={busy} disabled={!isValid}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Bank Client Account Bank Modal
export function EditBankClientAccountBankModal({ bankClientAccount, refreshData, update_state }) {
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
        const currentHeaders = { ...headers, Authorization: "Token " + localStorage.getItem("userToken") };
        const response = await axios.get(
          "http://localhost:8000/api/administration/all_banks/",
          { headers: currentHeaders }
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

  const isValidBank = bank_id && bank_id.trim().length > 0;

  const handleSubmit = async () => {
    if (!isValidBank) return;

    setBusy(true);
    try {
      const currentHeaders = { ...headers, Authorization: "Token " + localStorage.getItem("userToken") };
      const res = await axios.put(
        `http://localhost:8000/api/data_management/bank_client_account/${bankClientAccount.bankclientacco_id}/`,
        { bank_id },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Bank updated successfully", "success");
      if (update_state) update_state(res.data);
      else if (refreshData) refreshData();
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
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} /> Edit Bank
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Bank</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Bank *</Form.Label>
              <Form.Control
                as="select"
                value={bank_id}
                onChange={(e) => setBank_id(e.target.value)}
              >
                <option value="">Select a bank</option>
                {banks.map((bank) => (
                  <option key={bank.bank_id} value={bank.bank_id}>
                    {bank.bank_id} - {bank.bankname}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isValidBank ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                <li>
                  <AiOutlineWarning style={{ marginRight: 5 }} />
                  Please select a bank
                </li>
              </ul>
            ) : (
              <div style={{ color: "green" }}>
                <AiOutlineCheckCircle style={{ marginRight: 5 }} />
                Looks good.
              </div>
            )}
          </small>
          <Button color="red" onClick={handleClose} disabled={busy}>Cancel</Button>
          <Button color="green" onClick={handleSubmit} loading={busy} disabled={!isValidBank}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Bank Client Account Transit Number Modal
export function EditBankClientAccountTransitNumberModal({ bankClientAccount, refreshData, update_state }) {
  const [show, setShow] = React.useState(false);
  const [transitnumber, setTransitnumber] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const isValid = true;

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
      const currentHeaders = { ...headers, Authorization: "Token " + localStorage.getItem("userToken") };
      const res = await axios.put(
        `http://localhost:8000/api/data_management/bank_client_account/${bankClientAccount.bankclientacco_id}/`,
        { transitnumber },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Transit number updated successfully", "success");
      if (update_state) update_state(res.data);
      else if (refreshData) refreshData();
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
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} /> Edit Transit Number
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Transit Number</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Transit Number</Form.Label>
              <Form.Control
                type="text"
                value={transitnumber}
                onChange={(e) => setTransitnumber(e.target.value)}
                placeholder="Enter transit number"
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {isValid && (
              <div style={{ color: "green" }}>
                <AiOutlineCheckCircle style={{ marginRight: 5 }} />
                Looks good.
              </div>
            )}
          </small>
          <Button color="red" onClick={handleClose} disabled={busy}>Cancel</Button>
          <Button color="green" onClick={handleSubmit} loading={busy}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Bank Client Account Account Number Modal
export function EditBankClientAccountAccountNumberModal({ bankClientAccount, refreshData, update_state }) {
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
      const currentHeaders = { ...headers, Authorization: "Token " + localStorage.getItem("userToken") };
      const res = await axios.put(
        `http://localhost:8000/api/data_management/bank_client_account/${bankClientAccount.bankclientacco_id}/`,
        { accountnumber },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Account number updated successfully", "success");
      if (update_state) update_state(res.data);
      else if (refreshData) refreshData();
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
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} /> Edit Account Number
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Account Number</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Account Number *</Form.Label>
              <Form.Control
                type="text"
                value={accountnumber}
                onChange={(e) => setAccountnumber(e.target.value)}
                placeholder="Enter account number"
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            <div style={{ color: "green" }}>
              <AiOutlineCheckCircle style={{ marginRight: 5 }} />
              Looks good.
            </div>
          </small>
          <Button color="red" onClick={handleClose} disabled={busy}>Cancel</Button>
          <Button color="green" onClick={handleSubmit} loading={busy} disabled={!accountnumber.trim()}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Bank Client Account IBAN Modal
export function EditBankClientAccountIbanModal({ bankClientAccount, refreshData, update_state }) {
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
      const currentHeaders = { ...headers, Authorization: "Token " + localStorage.getItem("userToken") };
      const res = await axios.put(
        `http://localhost:8000/api/data_management/bank_client_account/${bankClientAccount.bankclientacco_id}/`,
        { iban },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "IBAN updated successfully", "success");
      if (update_state) update_state(res.data);
      else if (refreshData) refreshData();
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
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} /> Edit IBAN
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit IBAN</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>IBAN</Form.Label>
              <Form.Control
                type="text"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                placeholder="Enter IBAN"
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            <div style={{ color: "green" }}>
              <AiOutlineCheckCircle style={{ marginRight: 5 }} />
              Looks good.
            </div>
          </small>
          <Button color="red" onClick={handleClose} disabled={busy}>Cancel</Button>
          <Button color="green" onClick={handleSubmit} loading={busy}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Bank Client Account Active Modal
export function EditBankClientAccountActiveModal({ bankClientAccount, refreshData, update_state }) {
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
      const currentHeaders = { ...headers, Authorization: "Token " + localStorage.getItem("userToken") };
      const res = await axios.put(
        `http://localhost:8000/api/data_management/bank_client_account/${bankClientAccount.bankclientacco_id}/`,
        { active },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Active status updated successfully", "success");
      if (update_state) update_state(res.data);
      else if (refreshData) refreshData();
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
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} /> Edit Active Status
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Active Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Active</Form.Label>
              <Form.Check
                type="switch"
                id="active-switch"
                label="Account is active"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            <div style={{ color: "green" }}>
              <AiOutlineCheckCircle style={{ marginRight: 5 }} />
              Looks good.
            </div>
          </small>
          <Button color="red" onClick={handleClose} disabled={busy}>Cancel</Button>
          <Button color="green" onClick={handleSubmit} loading={busy}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
