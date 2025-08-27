// Built-ins
import React from "react";
import { useState } from "react";

// Icons / Images
import { FiEdit } from "react-icons/fi";

// Modules / Functions
import Swal from "sweetalert2";
import { Modal, Col, Form, Row } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import axios from "axios";

// Global Variables
import { headers } from "../global_vars";

// Variables
window.Swal = Swal;

// API endpoint for bank updates
const UPDATE_BANK = "http://localhost:8000/api/administration/bank/";

// Helpers
const clampLen = (value, max) => value.slice(0, max);
const toSmallInt = (value) => {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return "";
  return Math.max(-32768, Math.min(32767, n)); // Django SmallIntegerField range
};

// Validation helpers
const validateInstitutionNumber = (value) => value.replace(/[^\d]/g, "");
const validateSwiftCode = (value) => value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();



// Edit Bank Name Modal
export function EditBankNameModal({ bank, update_state }) {
  const [show, setShow] = useState(false);
  const [bankname, setBankname] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setBankname(bank.bankname || "");
    setShow(true);
  };

  const isBanknameValid = bankname.trim().length >= 2 && bankname.trim().length <= 40;

  const onSave = async () => {
    if (!isBanknameValid) {
      Swal.fire({
        icon: "error",
        title: "Invalid Bank Name",
        text: "Bank name must be 2-40 characters",
      });
      return;
    }

    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const res = await fetch(`${UPDATE_BANK}${bank.bank_id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": currentHeaders["Authorization"]
        },
                 body: JSON.stringify({
           bank_id: bank.bank_id,
           bankname: bankname.trim(),
           country_id: bank.country?.country_id || bank.country,
           orderindex: bank.orderindex,
           institutionnumber: bank.institutionnumber,
           swiftcode: bank.swiftcode,
           active: bank.active
         })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const updatedBank = await res.json();
      update_state(updatedBank);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Bank name updated successfully!",
      });
    } catch (e) {
      console.log('Error updating bank name:', e);
      
      let apiMsg = "Failed to update bank name.";
      
      if (e?.response?.data?.error) {
        apiMsg = e.response.data.error;
      } else if (e?.response?.data?.bankname) {
        apiMsg = e.response.data.bankname[0];
      } else if (e?.response?.data?.detail) {
        apiMsg = e.response.data.detail;
      }
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: apiMsg,
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Bank Name">
        <FiEdit style={{ marginRight: 6 }} />
        Name
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Bank Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Bank Name:
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  value={bankname}
                  onChange={(e) => setBankname(clampLen(e.target.value, 40))}
                  placeholder="Enter bank name (2-40 characters)"
                  isInvalid={bankname !== "" && !isBanknameValid}
                />
                <Form.Control.Feedback type="invalid">
                  Bank name must be 2-40 characters
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose} style={{ marginRight: "10px" }}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={onSave}
            disabled={!isBanknameValid}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Bank Country Modal
export function EditBankCountryModal({ bank, update_state }) {
  const [show, setShow] = useState(false);
  const [country, setCountry] = useState("");
  const [countries, setCountries] = useState([]);

  // Fetch countries on component mount
  React.useEffect(() => {
    const fetchCountries = async () => {
      try {
        const currentHeaders = {
          ...headers,
          "Authorization": "Token " + localStorage.getItem("userToken")
        };

        const response = await axios.get("http://localhost:8000/api/regions/all_countries/", { headers: currentHeaders });
        if (response.data && response.data.all_countries) {
          setCountries(response.data.all_countries);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    // bank.country is the full country object, so we need to get the country_id
    setCountry(bank.country?.country_id || "");
    setShow(true);
  };

  const isCountryValid = country !== "";

  const onSave = async () => {
    if (!isCountryValid) {
      Swal.fire({
        icon: "error",
        title: "Invalid Country",
        text: "Please select a country",
      });
      return;
    }

    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const res = await fetch(`${UPDATE_BANK}${bank.bank_id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": currentHeaders["Authorization"]
        },
                 body: JSON.stringify({
           bank_id: bank.bank_id,
           bankname: bank.bankname,
           country_id: country,
           orderindex: bank.orderindex,
           institutionnumber: bank.institutionnumber,
           swiftcode: bank.swiftcode,
           active: bank.active
         })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const updatedBank = await res.json();
      update_state(updatedBank);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Bank country updated successfully!",
      });
    } catch (e) {
      console.log('Error updating bank country:', e);
      
      let apiMsg = "Failed to update bank country.";
      
      if (e?.response?.data?.error) {
        apiMsg = e.response.data.error;
      } else if (e?.response?.data?.country) {
        apiMsg = e.response.data.country[0];
      } else if (e?.response?.data?.detail) {
        apiMsg = e.response.data.detail;
      }
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: apiMsg,
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Country">
        <FiEdit style={{ marginRight: 6 }} />
        Country
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Bank Country</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Country:
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  as="select"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  isInvalid={country !== "" && !isCountryValid}
                >
                  <option value="">Select Country</option>
                  {countries.map((countryOption) => (
                    <option key={countryOption.country_id} value={countryOption.country_id}>
                      {countryOption.title}
                    </option>
                  ))}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  Please select a country
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose} style={{ marginRight: "10px" }}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={onSave}
            disabled={!isCountryValid}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Bank Order Index Modal
export function EditBankOrderIndexModal({ bank, update_state }) {
  const [show, setShow] = useState(false);
  const [orderindex, setOrderindex] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setOrderindex(bank.orderindex || "");
    setShow(true);
  };

  const isOrderIndexValid = orderindex !== "" && Number.isInteger(+orderindex);

  const onSave = async () => {
    if (!isOrderIndexValid) {
      Swal.fire({
        icon: "error",
        title: "Invalid Order Index",
        text: "Please enter a valid order index",
      });
      return;
    }

    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const res = await fetch(`${UPDATE_BANK}${bank.bank_id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": currentHeaders["Authorization"]
        },
                 body: JSON.stringify({
           bank_id: bank.bank_id,
           bankname: bank.bankname,
           country_id: bank.country?.country_id || bank.country,
           orderindex: Number(orderindex),
           institutionnumber: bank.institutionnumber,
           swiftcode: bank.swiftcode,
           active: bank.active
         })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const updatedBank = await res.json();
      update_state(updatedBank);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Bank order index updated successfully!",
      });
    } catch (e) {
      console.log('Error updating bank order index:', e);
      
      let apiMsg = "Failed to update bank order index.";
      
      if (e?.response?.data?.error) {
        apiMsg = e.response.data.error;
      } else if (e?.response?.data?.orderindex) {
        apiMsg = e.response.data.orderindex[0];
      } else if (e?.response?.data?.detail) {
        apiMsg = e.response.data.detail;
      }
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: apiMsg,
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Order Index">
        <FiEdit style={{ marginRight: 6 }} />
        Order Index
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Bank Order Index</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Order Index:
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="number"
                  value={orderindex}
                  onChange={(e) => setOrderindex(toSmallInt(e.target.value))}
                  placeholder="Enter order index"
                  isInvalid={orderindex !== "" && !isOrderIndexValid}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid order index
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose} style={{ marginRight: "10px" }}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={onSave}
            disabled={!isOrderIndexValid}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Bank Institution Number Modal
export function EditBankInstitutionNumberModal({ bank, update_state }) {
  const [show, setShow] = useState(false);
  const [institutionnumber, setInstitutionnumber] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setInstitutionnumber(bank.institutionnumber || "");
    setShow(true);
  };

  const isInstitutionNumberValid = institutionnumber.length === 3 && /^\d{3}$/.test(institutionnumber);

  const onSave = async () => {
    if (!isInstitutionNumberValid) {
      Swal.fire({
        icon: "error",
        title: "Invalid Institution Number",
        text: "Institution number must be exactly 3 digits",
      });
      return;
    }

    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const res = await fetch(`${UPDATE_BANK}${bank.bank_id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": currentHeaders["Authorization"]
        },
                 body: JSON.stringify({
           bank_id: bank.bank_id,
           bankname: bank.bankname,
           country_id: bank.country?.country_id || bank.country,
           orderindex: bank.orderindex,
           institutionnumber: institutionnumber,
           swiftcode: bank.swiftcode,
           active: bank.active
         })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const updatedBank = await res.json();
      update_state(updatedBank);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Bank institution number updated successfully!",
      });
    } catch (e) {
      console.log('Error updating bank institution number:', e);
      
      let apiMsg = "Failed to update bank institution number.";
      
      if (e?.response?.data?.error) {
        apiMsg = e.response.data.error;
      } else if (e?.response?.data?.institutionnumber) {
        apiMsg = e.response.data.institutionnumber[0];
      } else if (e?.response?.data?.detail) {
        apiMsg = e.response.data.detail;
      }
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: apiMsg,
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Institution Number">
        <FiEdit style={{ marginRight: 6 }} />
        Institution Number
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Bank Institution Number</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Institution Number:
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  value={institutionnumber}
                  onChange={(e) => setInstitutionnumber(validateInstitutionNumber(clampLen(e.target.value, 3)))}
                  placeholder="Enter institution number (3 digits)"
                  isInvalid={institutionnumber !== "" && !isInstitutionNumberValid}
                />
                <Form.Control.Feedback type="invalid">
                  Institution number must be exactly 3 digits
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose} style={{ marginRight: "10px" }}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={onSave}
            disabled={!isInstitutionNumberValid}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Bank SWIFT Code Modal
export function EditBankSwiftCodeModal({ bank, update_state }) {
  const [show, setShow] = useState(false);
  const [swiftcode, setSwiftcode] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setSwiftcode(bank.swiftcode || "");
    setShow(true);
  };

  const isSwiftCodeValid = swiftcode.length >= 8 && swiftcode.length <= 11 && /^[A-Z0-9]{8,11}$/.test(swiftcode);

  const onSave = async () => {
    if (!isSwiftCodeValid) {
      Swal.fire({
        icon: "error",
        title: "Invalid SWIFT Code",
        text: "SWIFT code must be exactly 11 alphanumeric characters",
      });
      return;
    }

    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const res = await fetch(`${UPDATE_BANK}${bank.bank_id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": currentHeaders["Authorization"]
        },
                 body: JSON.stringify({
           bank_id: bank.bank_id,
           bankname: bank.bankname,
           country_id: bank.country?.country_id || bank.country,
           orderindex: bank.orderindex,
           institutionnumber: bank.institutionnumber,
           swiftcode: swiftcode,
           active: bank.active
         })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const updatedBank = await res.json();
      update_state(updatedBank);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Bank SWIFT code updated successfully!",
      });
    } catch (e) {
      console.log('Error updating bank SWIFT code:', e);
      
      let apiMsg = "Failed to update bank SWIFT code.";
      
      if (e?.response?.data?.error) {
        apiMsg = e.response.data.error;
      } else if (e?.response?.data?.swiftcode) {
        apiMsg = e.response.data.swiftcode[0];
      } else if (e?.response?.data?.detail) {
        apiMsg = e.response.data.detail;
      }
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: apiMsg,
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit SWIFT Code">
        <FiEdit style={{ marginRight: 6 }} />
        SWIFT Code
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Bank SWIFT Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                SWIFT Code:
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  value={swiftcode}
                  onChange={(e) => setSwiftcode(validateSwiftCode(clampLen(e.target.value, 11)))}
                                      placeholder="Enter SWIFT code (8-11 characters)"
                    isInvalid={swiftcode !== "" && !isSwiftCodeValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    SWIFT code must be 8-11 alphanumeric characters
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose} style={{ marginRight: "10px" }}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={onSave}
            disabled={!isSwiftCodeValid}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Bank Active Modal
export function EditBankActiveModal({ bank, update_state }) {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setActive(bank.active || false);
    setShow(true);
  };

  const onSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const res = await fetch(`${UPDATE_BANK}${bank.bank_id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": currentHeaders["Authorization"]
        },
                 body: JSON.stringify({
           bank_id: bank.bank_id,
           bankname: bank.bankname,
           country_id: bank.country?.country_id || bank.country,
           orderindex: bank.orderindex,
           institutionnumber: bank.institutionnumber,
           swiftcode: bank.swiftcode,
           active: active
         })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const updatedBank = await res.json();
      update_state(updatedBank);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: `Bank ${active ? 'activated' : 'deactivated'} successfully!`,
      });
    } catch (e) {
      console.log('Error updating bank active status:', e);
      
      let apiMsg = "Failed to update bank active status.";
      
      if (e?.response?.data?.error) {
        apiMsg = e.response.data.error;
      } else if (e?.response?.data?.active) {
        apiMsg = e.response.data.active[0];
      } else if (e?.response?.data?.detail) {
        apiMsg = e.response.data.detail;
      }
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: apiMsg,
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Active Status">
        <FiEdit style={{ marginRight: 6 }} />
        Active
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Bank Active Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Active:
              </Form.Label>
              <Col sm={9}>
                <Form.Check
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  label="Bank is active"
                />
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose} style={{ marginRight: "10px" }}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={onSave}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
