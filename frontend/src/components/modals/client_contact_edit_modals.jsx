// Built-ins
import { useState, useEffect } from "react";

// Icons / Images
import { FiEdit } from "react-icons/fi";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";
import axios from "axios";

// Modules / Functions
import Swal from "sweetalert2";
import { Modal, Form } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/bootstrap.css';

// Global Variables
import { headers } from "../global_vars";

// Variables
window.Swal = Swal;

// API endpoints
const UPDATE_CLIENT_CONTACT = "http://localhost:8000/api/data_management/client_contact/";

// Helpers
const clampLen = (value, max) => value.slice(0, max);

// Full Name Edit Modal
export function EditClientContactFullnameModal({ clientContact, update_state }) {
  const [show, setShow] = useState(false);
  const [fullname, setFullname] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setFullname(clientContact.fullname || "");
    }
  }, [show, clientContact]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const isFullnameValid = fullname.trim().length >= 2 && fullname.trim().length <= 40;

  const handleSave = async () => {
    if (!isFullnameValid) return;

    setIsLoading(true);
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    try {
      const response = await axios.patch(
        `${UPDATE_CLIENT_CONTACT}${clientContact.clientcont_id}/`,
        { fullname: fullname.trim() },
        { headers: currentHeaders }
      );

      update_state(response.data);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Full name updated successfully.",
      });
    } catch (error) {
      console.error("Error updating full name:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update full name.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} />
        Edit Full name
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Full name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Full name</Form.Label>
              <Form.Control
                type="text"
                value={fullname}
                onChange={(e) => setFullname(clampLen(e.target.value, 40))}
                maxLength={40}
                placeholder="Enter full name"
              />
              {/* No character countdown */}
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isFullnameValid ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                {fullname.trim().length < 2 && (
                  <li>
                    <AiOutlineWarning style={{ marginRight: 5 }} />
                    Full name must be at least 2 characters
                  </li>
                )}
                {fullname.trim().length > 40 && (
                  <li>
                    <AiOutlineWarning style={{ marginRight: 5 }} />
                    Full name must be at most 40 characters
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
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" loading={isLoading} onClick={handleSave} disabled={!isFullnameValid}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Father's Name Edit Modal
export function EditClientContactFathernameModal({ clientContact, update_state }) {
  const [show, setShow] = useState(false);
  const [fathername, setFathername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setFathername(clientContact.fathername || "");
    }
  }, [show, clientContact]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const isFathernameValid = fathername.trim().length <= 80;

  const handleSave = async () => {
    if (!isFathernameValid) return;
    setIsLoading(true);
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    try {
      const response = await axios.patch(
        `${UPDATE_CLIENT_CONTACT}${clientContact.clientcont_id}/`,
        { fathername: fathername.trim() || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Father's name updated successfully.",
      });
    } catch (error) {
      console.error("Error updating father's name:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update father's name.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} />
        Edit Father fullname
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Father fullname</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Father fullname</Form.Label>
              <Form.Control
                type="text"
                value={fathername}
                onChange={(e) => setFathername(clampLen(e.target.value, 80))}
                maxLength={80}
                placeholder="Enter father's name"
              />
              {/* No character countdown */}
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isFathernameValid ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                <li>
                  <AiOutlineWarning style={{ marginRight: 5 }} />
                  Father's name must be at most 80 characters
                </li>
              </ul>
            ) : (
              <div style={{ color: "green" }}>
                <AiOutlineCheckCircle style={{ marginRight: 5 }} />
                Looks good.
              </div>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" loading={isLoading} onClick={handleSave} disabled={!isFathernameValid}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Mother's Name Edit Modal
export function EditClientContactMothernameModal({ clientContact, update_state }) {
  const [show, setShow] = useState(false);
  const [mothername, setMothername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setMothername(clientContact.mothername || "");
    }
  }, [show, clientContact]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const isMothernameValid = mothername.trim().length <= 80;

  const handleSave = async () => {
    if (!isMothernameValid) return;
    setIsLoading(true);
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    try {
      const response = await axios.patch(
        `${UPDATE_CLIENT_CONTACT}${clientContact.clientcont_id}/`,
        { mothername: mothername.trim() || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Mother's name updated successfully.",
      });
    } catch (error) {
      console.error("Error updating mother's name:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update mother's name.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} />
        Edit Mother fullname
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Mother fullname</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Mother fullname</Form.Label>
              <Form.Control
                type="text"
                value={mothername}
                onChange={(e) => setMothername(clampLen(e.target.value, 80))}
                maxLength={80}
                placeholder="Enter mother's name"
              />
              {/* No character countdown */}
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isMothernameValid ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                <li>
                  <AiOutlineWarning style={{ marginRight: 5 }} />
                  Mother's name must be at most 80 characters
                </li>
              </ul>
            ) : (
              <div style={{ color: "green" }}>
                <AiOutlineCheckCircle style={{ marginRight: 5 }} />
                Looks good.
              </div>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" loading={isLoading} onClick={handleSave} disabled={!isMothernameValid}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Connection Edit Modal
export function EditClientContactConnectionModal({ clientContact, update_state }) {
  const [show, setShow] = useState(false);
  const [connection, setConnection] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setConnection(clientContact.connection || "");
    }
  }, [show, clientContact]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const isConnectionValid = connection.trim().length <= 40;

  const handleSave = async () => {
    if (!isConnectionValid) return;
    setIsLoading(true);
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    try {
      const response = await axios.patch(
        `${UPDATE_CLIENT_CONTACT}${clientContact.clientcont_id}/`,
        { connection: connection.trim() || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Connection updated successfully.",
      });
    } catch (error) {
      console.error("Error updating connection:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update connection.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} />
        Edit Connection
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Connection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Connection</Form.Label>
              <Form.Control
                type="text"
                value={connection}
                onChange={(e) => setConnection(clampLen(e.target.value, 40))}
                maxLength={40}
                placeholder="Enter connection type"
              />
              {/* No character countdown */}
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isConnectionValid ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                <li>
                  <AiOutlineWarning style={{ marginRight: 5 }} />
                  Connection must be at most 40 characters
                </li>
              </ul>
            ) : (
              <div style={{ color: "green" }}>
                <AiOutlineCheckCircle style={{ marginRight: 5 }} />
                Looks good.
              </div>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" loading={isLoading} onClick={handleSave} disabled={!isConnectionValid}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Address Edit Modal
export function EditClientContactAddressModal({ clientContact, update_state }) {
  const [show, setShow] = useState(false);
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setAddress(clientContact.address || "");
    }
  }, [show, clientContact]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const isAddressValid = address.trim().length >= 2 && address.trim().length <= 80;

  const handleSave = async () => {
    if (!isAddressValid) return;

    setIsLoading(true);
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    try {
      const response = await axios.patch(
        `${UPDATE_CLIENT_CONTACT}${clientContact.clientcont_id}/`,
        { address: address.trim() },
        { headers: currentHeaders }
      );

      update_state(response.data);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Address updated successfully.",
      });
    } catch (error) {
      console.error("Error updating address:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update address.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} />
        Edit Address
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={address}
                onChange={(e) => setAddress(clampLen(e.target.value, 80))}
                maxLength={80}
                placeholder="Enter address"
              />
              {/* No character countdown */}
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isAddressValid ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                {address.trim().length < 2 && (
                  <li>
                    <AiOutlineWarning style={{ marginRight: 5 }} />
                    Address must be at least 2 characters
                  </li>
                )}
                {address.trim().length > 80 && (
                  <li>
                    <AiOutlineWarning style={{ marginRight: 5 }} />
                    Address must be at most 80 characters
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
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" loading={isLoading} onClick={handleSave} disabled={!isAddressValid}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Email Edit Modal
export function EditClientContactEmailModal({ clientContact, update_state }) {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setEmail(clientContact.email || "");
    }
  }, [show, clientContact]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = email.trim().length > 0 && emailRegex.test(email.trim());

  const handleSave = async () => {
    if (!isEmailValid) return;

    setIsLoading(true);
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    try {
      const response = await axios.patch(
        `${UPDATE_CLIENT_CONTACT}${clientContact.clientcont_id}/`,
        { email: email.trim() },
        { headers: currentHeaders }
      );

      update_state(response.data);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Email updated successfully.",
      });
    } catch (error) {
      console.error("Error updating email:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update email.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} />
        Edit E-mail
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit E-mail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>E-mail</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isEmailValid ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                {email.trim().length === 0 && (
                  <li>
                    <AiOutlineWarning style={{ marginRight: 5 }} />
                    Email is required
                  </li>
                )}
                {email.trim().length > 0 && !emailRegex.test(email.trim()) && (
                  <li>
                    <AiOutlineWarning style={{ marginRight: 5 }} />
                    Please enter a valid email address
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
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" loading={isLoading} onClick={handleSave} disabled={!isEmailValid}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Phone Edit Modal
export function EditClientContactPhoneModal({ clientContact, update_state }) {
  const [show, setShow] = useState(false);
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setPhone(clientContact.phone || "");
    }
  }, [show, clientContact]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const isPhoneValid = !phone || phone.replace(/\D/g, '').length >= 7;

  const handleSave = async () => {
    if (!isPhoneValid) return;

    setIsLoading(true);
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    try {
      const response = await axios.patch(
        `${UPDATE_CLIENT_CONTACT}${clientContact.clientcont_id}/`,
        { phone: ('+' + phone.replace(/\D/g, '')) },
        { headers: currentHeaders }
      );

      update_state(response.data);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Phone updated successfully.",
      });
    } catch (error) {
      console.error("Error updating phone:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update phone.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} />
        Edit Telephone
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Telephone</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Telephone</Form.Label>
              <PhoneInput
                country={'gr'}
                value={phone}
                onChange={(val) => setPhone(val)}
                enableSearch
                countryCodeEditable={false}
                inputProps={{ name: 'phone' }}
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isPhoneValid ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                <li>
                  <AiOutlineWarning style={{ marginRight: 5 }} />
                  Enter a valid phone number (or leave empty)
                </li>
              </ul>
            ) : (
              <div style={{ color: "green" }}>
                <AiOutlineCheckCircle style={{ marginRight: 5 }} />
                Looks good.
              </div>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" loading={isLoading} onClick={handleSave} disabled={!isPhoneValid}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Mobile Edit Modal
export function EditClientContactMobileModal({ clientContact, update_state }) {
  const [show, setShow] = useState(false);
  const [mobile, setMobile] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setMobile(clientContact.mobile || "");
    }
  }, [show, clientContact]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const isMobileValid = mobile.trim().length > 0 && mobile.replace(/\D/g, '').length >= 7;

  const handleSave = async () => {
    if (!isMobileValid) return;

    setIsLoading(true);
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    try {
      const response = await axios.patch(
        `${UPDATE_CLIENT_CONTACT}${clientContact.clientcont_id}/`,
        { mobile: ('+' + mobile.replace(/\D/g, '')) },
        { headers: currentHeaders }
      );

      update_state(response.data);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Mobile updated successfully.",
      });
    } catch (error) {
      console.error("Error updating mobile:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update mobile.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} />
        Edit Cell phone
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Cell phone</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Cell phone</Form.Label>
              <PhoneInput
                country={'gr'}
                value={mobile}
                onChange={(val) => setMobile(val)}
                enableSearch
                countryCodeEditable={false}
                inputProps={{ name: 'mobile' }}
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isMobileValid ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                {mobile.trim().length === 0 && (
                  <li>
                    <AiOutlineWarning style={{ marginRight: 5 }} />
                    Mobile is required
                  </li>
                )}
                {mobile.trim().length > 15 && (
                  <li>
                    <AiOutlineWarning style={{ marginRight: 5 }} />
                    Mobile must be at most 15 characters
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
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" loading={isLoading} onClick={handleSave} disabled={!isMobileValid}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Profession Edit Modal
export function EditClientContactProfessionModal({ clientContact, update_state }) {
  const [show, setShow] = useState(false);
  const [profession, setProfession] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setProfession(clientContact.profession || "");
    }
  }, [show, clientContact]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const isProfessionValid = profession.trim().length >= 2 && profession.trim().length <= 40;

  const handleSave = async () => {
    if (!isProfessionValid) return;

    setIsLoading(true);
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    try {
      const response = await axios.patch(
        `${UPDATE_CLIENT_CONTACT}${clientContact.clientcont_id}/`,
        { profession: profession.trim() },
        { headers: currentHeaders }
      );

      update_state(response.data);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Profession updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profession:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update profession.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} />
        Edit Profession
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profession</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Profession</Form.Label>
              <Form.Control
                type="text"
                value={profession}
                onChange={(e) => setProfession(clampLen(e.target.value, 40))}
                maxLength={40}
                placeholder="Enter profession"
              />
              {/* No character countdown */}
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isProfessionValid ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                {profession.trim().length < 2 && (
                  <li>
                    <AiOutlineWarning style={{ marginRight: 5 }} />
                    Profession must be at least 2 characters
                  </li>
                )}
                {profession.trim().length > 40 && (
                  <li>
                    <AiOutlineWarning style={{ marginRight: 5 }} />
                    Profession must be at most 40 characters
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
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" loading={isLoading} onClick={handleSave} disabled={!isProfessionValid}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Reliability Edit Modal
export function EditClientContactReliabilityModal({ clientContact, update_state }) {
  const [show, setShow] = useState(false);
  const [reliability, setReliability] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const reliabilityOptions = [
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
  ];

  useEffect(() => {
    if (show) {
      setReliability(clientContact.reliability || "");
    }
  }, [show, clientContact]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Optional: valid when empty or one of allowed values
  const isReliabilityValid = reliability === "" || reliabilityOptions.some(o => o.value === reliability);

  const handleSave = async () => {
    if (!isReliabilityValid) return;

    setIsLoading(true);
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    try {
      const response = await axios.patch(
        `${UPDATE_CLIENT_CONTACT}${clientContact.clientcont_id}/`,
        { reliability: reliability || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Reliability updated successfully.",
      });
    } catch (error) {
      console.error("Error updating reliability:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update reliability.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} />
        Edit Reliability
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Reliability</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Reliability</Form.Label>
              <Form.Control
                as="select"
                value={reliability}
                onChange={(e) => setReliability(e.target.value)}
              >
                <option value="">Select reliability level</option>
                {reliabilityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {isReliabilityValid ? (
              <div style={{ color: "green" }}>
                <AiOutlineCheckCircle style={{ marginRight: 5 }} />
                Looks good.
              </div>
            ) : (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                <li>
                  <AiOutlineWarning style={{ marginRight: 5 }} />
                  Invalid selection
                </li>
              </ul>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" loading={isLoading} onClick={handleSave} disabled={!isReliabilityValid}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// City Edit Modal
export function EditClientContactCityModal({ clientContact, update_state }) {
  const [show, setShow] = useState(false);
  const [city, setCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setCity(clientContact.city || "");
    }
  }, [show, clientContact]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const isCityValid = city.trim().length >= 2 && city.trim().length <= 40;

  const handleSave = async () => {
    if (!isCityValid) return;

    setIsLoading(true);
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    try {
      const response = await axios.patch(
        `${UPDATE_CLIENT_CONTACT}${clientContact.clientcont_id}/`,
        { city: city.trim() },
        { headers: currentHeaders }
      );

      update_state(response.data);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "City updated successfully.",
      });
    } catch (error) {
      console.error("Error updating city:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update city.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} />
        Edit City
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit City</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                value={city}
                onChange={(e) => setCity(clampLen(e.target.value, 40))}
                maxLength={40}
                placeholder="Enter city"
              />
              {/* No character countdown */}
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isCityValid ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                {city.trim().length < 2 && (
                  <li>
                    <AiOutlineWarning style={{ marginRight: 5 }} />
                    City must be at least 2 characters
                  </li>
                )}
                {city.trim().length > 40 && (
                  <li>
                    <AiOutlineWarning style={{ marginRight: 5 }} />
                    City must be at most 40 characters
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
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" loading={isLoading} onClick={handleSave} disabled={!isCityValid}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Active Status Edit Modal
export function EditClientContactActiveModal({ clientContact, update_state }) {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setActive(clientContact.active !== false);
    }
  }, [show, clientContact]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    setIsLoading(true);
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    try {
      const response = await axios.patch(
        `${UPDATE_CLIENT_CONTACT}${clientContact.clientcont_id}/`,
        { active },
        { headers: currentHeaders }
      );

      update_state(response.data);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: `Contact ${active ? "activated" : "deactivated"} successfully.`,
      });
    } catch (error) {
      console.error("Error updating active status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update active status.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} />
        Edit Active Status
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Active Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Active"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
              <Form.Text className="text-muted">
                {active ? "This contact is currently active" : "This contact is currently inactive"}
              </Form.Text>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto" />
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" loading={isLoading} onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Notes Edit Modal
export function EditClientContactNotesModal({ clientContact, update_state }) {
  const [show, setShow] = useState(false);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setNotes(clientContact.notes || "");
    }
  }, [show, clientContact]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    setIsLoading(true);
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    try {
      const response = await axios.patch(
        `${UPDATE_CLIENT_CONTACT}${clientContact.clientcont_id}/`,
        { notes: notes.trim() || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Notes updated successfully.",
      });
    } catch (error) {
      console.error("Error updating notes:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update notes.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} />
        Edit Notes
      </Button>

      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Notes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter notes"
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto" />
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" loading={isLoading} onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
