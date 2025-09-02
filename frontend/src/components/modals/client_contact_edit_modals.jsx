// Built-ins
import { useState, useEffect } from "react";

// Icons / Images
import { FiEdit } from "react-icons/fi";
import axios from "axios";

// Modules / Functions
import Swal from "sweetalert2";
import { Modal, Form } from "react-bootstrap";
import { Button } from "semantic-ui-react";

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

  const handleSave = async () => {
    if (!fullname.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Full name cannot be empty.",
      });
      return;
    }

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
        Edit
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Full Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={fullname}
                onChange={(e) => setFullname(clampLen(e.target.value, 40))}
                maxLength={40}
                placeholder="Enter full name"
              />
              <Form.Text className="text-muted">
                {fullname.length}/40 characters
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button basic onClick={handleClose}>
            Cancel
          </Button>
          <Button primary loading={isLoading} onClick={handleSave}>
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

  const handleSave = async () => {
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
        Edit
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Father's Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Father's Name</Form.Label>
              <Form.Control
                type="text"
                value={fathername}
                onChange={(e) => setFathername(clampLen(e.target.value, 80))}
                maxLength={80}
                placeholder="Enter father's name"
              />
              <Form.Text className="text-muted">
                {fathername.length}/80 characters
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button basic onClick={handleClose}>
            Cancel
          </Button>
          <Button primary loading={isLoading} onClick={handleSave}>
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

  const handleSave = async () => {
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
        Edit
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Mother's Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Mother's Name</Form.Label>
              <Form.Control
                type="text"
                value={mothername}
                onChange={(e) => setMothername(clampLen(e.target.value, 80))}
                maxLength={80}
                placeholder="Enter mother's name"
              />
              <Form.Text className="text-muted">
                {mothername.length}/80 characters
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button basic onClick={handleClose}>
            Cancel
          </Button>
          <Button primary loading={isLoading} onClick={handleSave}>
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

  const handleSave = async () => {
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
        Edit
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Connection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Connection</Form.Label>
              <Form.Control
                type="text"
                value={connection}
                onChange={(e) => setConnection(clampLen(e.target.value, 40))}
                maxLength={40}
                placeholder="Enter connection type"
              />
              <Form.Text className="text-muted">
                {connection.length}/40 characters
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button basic onClick={handleClose}>
            Cancel
          </Button>
          <Button primary loading={isLoading} onClick={handleSave}>
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

  const handleSave = async () => {
    if (!address.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Address cannot be empty.",
      });
      return;
    }

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
        Edit
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={address}
                onChange={(e) => setAddress(clampLen(e.target.value, 80))}
                maxLength={80}
                placeholder="Enter address"
              />
              <Form.Text className="text-muted">
                {address.length}/80 characters
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button basic onClick={handleClose}>
            Cancel
          </Button>
          <Button primary loading={isLoading} onClick={handleSave}>
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

  const handleSave = async () => {
    if (!email.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Email cannot be empty.",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter a valid email address.",
      });
      return;
    }

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
        Edit
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button basic onClick={handleClose}>
            Cancel
          </Button>
          <Button primary loading={isLoading} onClick={handleSave}>
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

  const handleSave = async () => {
    if (!phone.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Phone cannot be empty.",
      });
      return;
    }

    setIsLoading(true);
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    try {
      const response = await axios.patch(
        `${UPDATE_CLIENT_CONTACT}${clientContact.clientcont_id}/`,
        { phone: phone.trim() },
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
        Edit
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Phone</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                value={phone}
                onChange={(e) => setPhone(clampLen(e.target.value, 15))}
                maxLength={15}
                placeholder="Enter phone number"
              />
              <Form.Text className="text-muted">
                {phone.length}/15 characters
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button basic onClick={handleClose}>
            Cancel
          </Button>
          <Button primary loading={isLoading} onClick={handleSave}>
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

  const handleSave = async () => {
    if (!mobile.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Mobile cannot be empty.",
      });
      return;
    }

    setIsLoading(true);
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    try {
      const response = await axios.patch(
        `${UPDATE_CLIENT_CONTACT}${clientContact.clientcont_id}/`,
        { mobile: mobile.trim() },
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
        Edit
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Mobile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Mobile</Form.Label>
              <Form.Control
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(clampLen(e.target.value, 15))}
                maxLength={15}
                placeholder="Enter mobile number"
              />
              <Form.Text className="text-muted">
                {mobile.length}/15 characters
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button basic onClick={handleClose}>
            Cancel
          </Button>
          <Button primary loading={isLoading} onClick={handleSave}>
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

  const handleSave = async () => {
    if (!profession.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Profession cannot be empty.",
      });
      return;
    }

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
        Edit
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profession</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Profession</Form.Label>
              <Form.Control
                type="text"
                value={profession}
                onChange={(e) => setProfession(clampLen(e.target.value, 40))}
                maxLength={40}
                placeholder="Enter profession"
              />
              <Form.Text className="text-muted">
                {profession.length}/40 characters
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button basic onClick={handleClose}>
            Cancel
          </Button>
          <Button primary loading={isLoading} onClick={handleSave}>
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

  const handleSave = async () => {
    if (!reliability) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please select a reliability level.",
      });
      return;
    }

    setIsLoading(true);
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    try {
      const response = await axios.patch(
        `${UPDATE_CLIENT_CONTACT}${clientContact.clientcont_id}/`,
        { reliability },
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
        Edit
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Reliability</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Reliability</Form.Label>
              <Form.Select
                value={reliability}
                onChange={(e) => setReliability(e.target.value)}
              >
                <option value="">Select reliability level</option>
                {reliabilityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button basic onClick={handleClose}>
            Cancel
          </Button>
          <Button primary loading={isLoading} onClick={handleSave}>
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

  const handleSave = async () => {
    if (!city.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "City cannot be empty.",
      });
      return;
    }

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
        Edit
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit City</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                value={city}
                onChange={(e) => setCity(clampLen(e.target.value, 40))}
                maxLength={40}
                placeholder="Enter city"
              />
              <Form.Text className="text-muted">
                {city.length}/40 characters
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button basic onClick={handleClose}>
            Cancel
          </Button>
          <Button primary loading={isLoading} onClick={handleSave}>
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
        Edit
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Active Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button basic onClick={handleClose}>
            Cancel
          </Button>
          <Button primary loading={isLoading} onClick={handleSave}>
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
        Edit
      </Button>

      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Notes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button basic onClick={handleClose}>
            Cancel
          </Button>
          <Button primary loading={isLoading} onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
