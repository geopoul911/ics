// Built-ins
import { useState, useEffect } from "react";

// Icons / Images
import { BiPlus } from "react-icons/bi";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

import axios from "axios";

// Modules / Functions
import Swal from "sweetalert2";
import { Modal, Col, Form, Row } from "react-bootstrap";
import { Button } from "semantic-ui-react";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

// API endpoint
const ADD_BANK_CLIENT_ACCOUNT = "https://ultima.icsgr.com/api/data_management/bank_client_accounts/";

function AddBankClientAccountModal({ refreshData, defaultClientId, lockClient = false, defaultBankId, lockBank = false }) {
  const [show, setShow] = useState(false);
  
  // Form state
  const [bankclientacco_id, setBankclientacco_id] = useState("");
  const [client_id, setClient_id] = useState("");
  const [bank_id, setBank_id] = useState("");
  const [transitnumber, setTransitnumber] = useState("");
  const [accountnumber, setAccountnumber] = useState("");
  const [iban, setIban] = useState("");
  const [active, setActive] = useState(true);
  
  // Dropdown data
  const [clients, setClients] = useState([]);
  const [banks, setBanks] = useState([]);

  const resetForm = () => {
    setBankclientacco_id("");
    setClient_id("");
    setBank_id("");
    setTransitnumber("");
    setAccountnumber("");
    setIban("");
    setActive(true);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => {
    resetForm();
    if (defaultClientId) setClient_id(defaultClientId);
    if (defaultBankId) setBank_id(defaultBankId);
    setShow(true);
  };

  // Load dropdown data when modal opens
  useEffect(() => {
    if (show) {
      loadDropdownData();
    }
  }, [show]);

  const loadDropdownData = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken"),
      };
      // Fetch clients
      const clientsResponse = await axios.get(
        "https://ultima.icsgr.com/api/data_management/all_clients/",
        { headers: currentHeaders }
      );
      setClients(clientsResponse.data.all_clients || []);

      // Fetch banks
      const banksResponse = await axios.get(
        "https://ultima.icsgr.com/api/administration/all_banks/",
        { headers: currentHeaders }
      );
      setBanks(banksResponse.data.all_banks || []);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  // Validation
  const isBankclientaccoIdValid = bankclientacco_id.trim().length >= 2 && bankclientacco_id.trim().length <= 10;
  const isClientValid = client_id !== "";
  const isBankValid = bank_id !== "";
  const isTransitnumberValid = transitnumber.trim().length === 5 && /^\d{5}$/.test(transitnumber.trim());
  const isAccountnumberValid = accountnumber.trim().length >= 2 && accountnumber.trim().length <= 20;

  const isFormValid = isBankclientaccoIdValid && isClientValid && isBankValid && isTransitnumberValid && isAccountnumberValid;

  const createNewBankClientAccount = async () => {
    if (!isFormValid) {
      return;
    }

    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken"),
      };
      await axios.post(
        ADD_BANK_CLIENT_ACCOUNT,
        {
          bankclientacco_id: bankclientacco_id.trim(),
          client_id,
          bank_id,
          transitnumber: transitnumber.trim(),
          accountnumber: accountnumber.trim(),
          iban: iban.trim() || null,
          active
        },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Bank Client Account created successfully", "success");
      if (refreshData) refreshData();
      handleClose();
    } catch (error) {
      console.error("Error creating bank client account:", error);
      const errorMessage = error.response?.data?.error || "Failed to create bank client account";
      Swal.fire("Error", errorMessage, "error");
    }
  };

  return (
    <>
      <Button color="green" style={{ margin: 20 }} onClick={handleShow}>
        <BiPlus style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }}/>
        Create new Bank Client Account
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Create new Bank Client Account
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="justify-content-md-center">
            <Col>
              <Form>
                {/* Basic Information */}
                <h6 className="mb-3">Basic Information</h6>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Bank Client Account ID *:</Form.Label>
                      <Form.Control
                        maxLength={10}
                        placeholder="e.g., BCA001"
                        onChange={(e) => setBankclientacco_id(e.target.value.toUpperCase())}
                        value={bankclientacco_id}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Account number *:</Form.Label>
                      <Form.Control
                        maxLength={20}
                        placeholder="e.g., 1234567890"
                        onChange={(e) => setAccountnumber(e.target.value)}
                        value={accountnumber}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Account Information */}
                <h6 className="mb-3 mt-4">Account Information</h6>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Client *:</Form.Label>
                      <Form.Control
                        as="select"
                        onChange={(e) => setClient_id(e.target.value)}
                        value={client_id}
                        disabled={lockClient}
                      >
                        <option value="">Select Client</option>
                        {Array.isArray(clients) && clients.map((client) => (
                          <option key={client.client_id} value={client.client_id}>
                            {client.client_id} - {client.fullname || `${client.surname} ${client.name}`}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Bank *:</Form.Label>
                      <Form.Control
                        as="select"
                        onChange={(e) => setBank_id(e.target.value)}
                        value={bank_id}
                        disabled={lockBank}
                      >
                        <option value="">Select Bank</option>
                        {Array.isArray(banks) && banks.map((bank) => (
                          <option key={bank.bank_id} value={bank.bank_id}>
                            {bank.bank_id} - {bank.bankname}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Branch number:</Form.Label>
                      <Form.Control
                        maxLength={5}
                        placeholder="e.g., 12345"
                        onChange={(e) => setTransitnumber(e.target.value)}
                        value={transitnumber}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>IBAN:</Form.Label>
                      <Form.Control
                        maxLength={34}
                        placeholder="e.g., GR123456789012345678901234567"
                        onChange={(e) => setIban(e.target.value.toUpperCase())}
                        value={iban}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Status Information */}
                <h6 className="mb-3 mt-4">Status Information</h6>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        id="active-switch"
                        label="Account is active"
                        checked={active}
                        onChange={(e) => setActive(e.target.checked)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isFormValid ? (
              <ul
                className="mr-auto"
                style={{ margin: 0, padding: 0, color: "red" }}
              >
                {!isBankclientaccoIdValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Bank Client Account ID is required (2–10 chars).
                  </li>
                )}
                {!isClientValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Client is required.
                  </li>
                )}
                {!isBankValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Bank is required.
                  </li>
                )}
                {!isTransitnumberValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Branch Number is required and must be exactly 5 digits.
                  </li>
                )}
                {!isAccountnumberValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Account Number is required (2–20 chars).
                  </li>
                )}
              </ul>
            ) : (
              <ul
                className="mr-auto"
                style={{ margin: 0, padding: 0, color: "green" }}
              >
                <li>
                  <AiOutlineCheckCircle
                    style={{ fontSize: 18, marginRight: 6 }}
                  />
                  Validated
                </li>
              </ul>
            )}
          </small>

          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              createNewBankClientAccount();
            }}
            disabled={!isFormValid}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddBankClientAccountModal;
