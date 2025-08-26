// Built-ins
import { useState } from "react";

// Icons / Images
import { BiEdit } from "react-icons/bi";
import { FaStop } from "react-icons/fa";

// Modules / Functions
import Swal from "sweetalert2";
import { Modal, Col, Form, Row } from "react-bootstrap";
import { Button } from "semantic-ui-react";

// Global Variables
import { headers, apiPut } from "../global_vars";

// Variables
window.Swal = Swal;

// API endpoint for consultant
const UPDATE_CONSULTANT = "http://localhost:8000/api/administration/consultant/";

// Helpers
const clampLen = (value, max) => value.slice(0, max);
const toSmallInt = (value) => {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return "";
  return Math.max(-32768, Math.min(32767, n)); // Django SmallIntegerField range
};

// Field-specific validation helpers
const validatePhone = (value) => {
  // Allow digits, spaces, dashes, parentheses, plus sign
  // eslint-disable-next-line no-useless-escape
  return value.replace(/[^\d\s\-()\+]/g, "");
};

const validateMobile = (value) => {
  // Allow digits, spaces, dashes, parentheses, plus sign
  // eslint-disable-next-line no-useless-escape
  return value.replace(/[^\d\s\-()\+]/g, "");
};

const validateFullname = (value) => {
  // Allow letters, spaces, hyphens, apostrophes
  // eslint-disable-next-line no-useless-escape
  return value.replace(/[^a-zA-Z\s\-']/g, "");
};

const validatePassword = (password) => {
  const hasCapital = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasMinLength = password.length >= 6;
  return hasCapital && hasNumber && hasMinLength;
};

// Edit Consultant ID Modal (PK - Immutable)
export function EditConsultantIdModal({ consultant, update_state }) {
  return (
    <Button size="mini" basic disabled>
      <FaStop style={{ marginRight: 6, color: "red" }} title="Consultant ID is immutable"/>
      ID
    </Button>
  );
}

// Edit Consultant Fullname Modal
export function EditConsultantFullnameModal({ consultant, update_state }) {
  const [show, setShow] = useState(false);
  const [fullname, setFullname] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setFullname(consultant.fullname || "");
    setShow(true);
  };

  const isFullnameValid = fullname.trim().length >= 2 && fullname.trim().length <= 40;

  const onSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const res = await apiPut(
        `${UPDATE_CONSULTANT}${consultant.consultant_id}/`,
        { fullname: fullname.trim() },
        currentHeaders
      );

      update_state(res);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Full name updated successfully!",
      });
    } catch (e) {
      console.log('Error updating fullname:', e);
      console.log('Error response data:', e?.response?.data);
      
      let apiMsg = "Failed to update Full Name.";
      
      if (e?.response?.data?.error) {
        apiMsg = e.response.data.error;
      } else if (e?.response?.data?.fullname) {
        apiMsg = e.response.data.fullname[0];
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
      <Button onClick={handleShow} size="mini" basic title="Edit Full Name">
        <BiEdit style={{ marginRight: 6 }} />
        Name
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Full Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Full Name:
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(validateFullname(clampLen(e.target.value, 40)))}
                  placeholder="Enter full name (2-40 characters)"
                />
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
                 <Modal.Footer>
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
             <small style={{ color: "red" }}>
               <i className="fas fa-info-circle" style={{ marginRight: "5px" }}></i>
               Must be 2-40 characters
             </small>
             <div>
               <Button color="red" onClick={handleClose} style={{ marginRight: "10px" }}>
                 Cancel
               </Button>
               <Button
                 color="green"
                 onClick={onSave}
                 disabled={!isFullnameValid}
               >
                 Save
               </Button>
             </div>
           </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Consultant Email Modal
export function EditConsultantEmailModal({ consultant, update_state }) {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setEmail(consultant.email || "");
    setShow(true);
  };

  const isEmailValid = email === "" || (email.includes("@") && email.length >= 5);

  const onSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const res = await apiPut(
        `${UPDATE_CONSULTANT}${consultant.consultant_id}/`,
        { email: email || null },
        currentHeaders
      );

      update_state(res);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Email updated successfully!",
      });
    } catch (e) {
      console.log('Error updating email:', e);
      console.log('Error response data:', e?.response?.data);
      
      let apiMsg = "Failed to update Email.";
      
      if (e?.response?.data?.error) {
        apiMsg = e.response.data.error;
      } else if (e?.response?.data?.email) {
        apiMsg = e.response.data.email[0];
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
      <Button onClick={handleShow} size="mini" basic title="Edit Email">
        <BiEdit style={{ marginRight: 6 }} />
        Email
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Email:
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address (optional)"
                />
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
                 <Modal.Footer>
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
             <small style={{ color: "red" }}>
               <i className="fas fa-info-circle" style={{ marginRight: "5px" }}></i>
               Valid email format or empty
             </small>
             <div>
               <Button color="red" onClick={handleClose} style={{ marginRight: "10px" }}>
                 Cancel
               </Button>
               <Button
                 color="green"
                 onClick={onSave}
                 disabled={!isEmailValid}
               >
                 Save
               </Button>
             </div>
           </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Consultant Phone Modal
export function EditConsultantPhoneModal({ consultant, update_state }) {
  const [show, setShow] = useState(false);
  const [phone, setPhone] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setPhone(consultant.phone || "");
    setShow(true);
  };

  const isPhoneValid = phone === "" || phone.length <= 15;

  const onSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const res = await apiPut(
        `${UPDATE_CONSULTANT}${consultant.consultant_id}/`,
        { phone: phone || null },
        currentHeaders
      );

      update_state(res);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Phone updated successfully!",
      });
    } catch (e) {
      console.log('Error updating phone:', e);
      console.log('Error response data:', e?.response?.data);
      
      let apiMsg = "Failed to update Phone.";
      
      if (e?.response?.data?.error) {
        apiMsg = e.response.data.error;
      } else if (e?.response?.data?.phone) {
        apiMsg = e.response.data.phone[0];
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
      <Button onClick={handleShow} size="mini" basic title="Edit Phone">
        <BiEdit style={{ marginRight: 6 }} />
        Phone
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Phone</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Phone:
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(validatePhone(clampLen(e.target.value, 15)))}
                  placeholder="Enter phone number (digits, spaces, -, (, ), +)"
                />
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
                 <Modal.Footer>
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
             <small style={{ color: "red" }}>
               <i className="fas fa-info-circle" style={{ marginRight: "5px" }}></i>
               Digits, spaces, dashes, parentheses, + (max 15)
             </small>
             <div>
               <Button color="red" onClick={handleClose} style={{ marginRight: "10px" }}>
                 Cancel
               </Button>
               <Button
                 color="green"
                 onClick={onSave}
                 disabled={!isPhoneValid}
               >
                 Save
               </Button>
             </div>
           </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Consultant Mobile Modal
export function EditConsultantMobileModal({ consultant, update_state }) {
  const [show, setShow] = useState(false);
  const [mobile, setMobile] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setMobile(consultant.mobile || "");
    setShow(true);
  };

  const isMobileValid = mobile === "" || mobile.length <= 15;

  const onSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const res = await apiPut(
        `${UPDATE_CONSULTANT}${consultant.consultant_id}/`,
        { mobile: mobile || null },
        currentHeaders
      );

      update_state(res);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Mobile updated successfully!",
      });
    } catch (e) {
      console.log('Error updating mobile:', e);
      console.log('Error response data:', e?.response?.data);
      
      let apiMsg = "Failed to update Mobile.";
      
      if (e?.response?.data?.error) {
        apiMsg = e.response.data.error;
      } else if (e?.response?.data?.mobile) {
        apiMsg = e.response.data.mobile[0];
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
      <Button onClick={handleShow} size="mini" basic title="Edit Mobile">
        <BiEdit style={{ marginRight: 6 }} />
        Mobile
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Mobile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Mobile:
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(validateMobile(clampLen(e.target.value, 15)))}
                  placeholder="Enter mobile number (digits, spaces, -, (, ), +)"
                />
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
                 <Modal.Footer>
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
             <small style={{ color: "red" }}>
               <i className="fas fa-info-circle" style={{ marginRight: "5px" }}></i>
               Digits, spaces, dashes, parentheses, + (max 15)
             </small>
             <div>
               <Button color="red" onClick={handleClose} style={{ marginRight: "10px" }}>
                 Cancel
               </Button>
               <Button
                 color="green"
                 onClick={onSave}
                 disabled={!isMobileValid}
               >
                 Save
               </Button>
             </div>
           </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Consultant Role Modal
export function EditConsultantRoleModal({ consultant, update_state }) {
  const [show, setShow] = useState(false);
  const [role, setRole] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setRole(consultant.role || "");
    setShow(true);
  };

  const isRoleValid = ["A", "S", "U", "C"].includes(role);

  const onSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const res = await apiPut(
        `${UPDATE_CONSULTANT}${consultant.consultant_id}/`,
        { role: role },
        currentHeaders
      );

      update_state(res);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Role updated successfully!",
      });
    } catch (e) {
      console.log('Error updating role:', e);
      console.log('Error response data:', e?.response?.data);
      
      let apiMsg = "Failed to update Role.";
      
      if (e?.response?.data?.error) {
        apiMsg = e.response.data.error;
      } else if (e?.response?.data?.role) {
        apiMsg = e.response.data.role[0];
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
      <Button onClick={handleShow} size="mini" basic title="Edit Role">
        <BiEdit style={{ marginRight: 6 }} />
        Role
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Role:
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  as="select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="">Select Role</option>
                  <option value="A">Admin</option>
                  <option value="S">Supervisor</option>
                  <option value="U">Superuser</option>
                  <option value="C">User</option>
                </Form.Control>
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
                 <Modal.Footer>
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
             <small style={{ color: "red" }}>
               <i className="fas fa-info-circle" style={{ marginRight: "5px" }}></i>
               Select a valid role
             </small>
             <div>
               <Button color="red" onClick={handleClose} style={{ marginRight: "10px" }}>
                 Cancel
               </Button>
               <Button
                 color="green"
                 onClick={onSave}
                 disabled={!isRoleValid}
               >
                 Save
               </Button>
             </div>
           </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Consultant Username Modal (Immutable)
export function EditConsultantUsernameModal({ consultant, update_state }) {
  return (
    <Button size="mini" basic disabled>
      <FaStop style={{ marginRight: 6, color: "red" }} title="Username is immutable"/>
      Username
    </Button>
  );
}

// Edit Consultant Password Modal
export function EditConsultantPasswordModal({ consultant, update_state }) {
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setPassword("");
    setConfirmPassword("");
    setShow(true);
  };

  const isPasswordValid = validatePassword(password) && password === confirmPassword;

  const onSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const res = await apiPut(
        `${UPDATE_CONSULTANT}${consultant.consultant_id}/`,
        { password: password },
        currentHeaders
      );

      update_state(res);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Password updated successfully!",
      });
    } catch (e) {
      console.log('Error updating password:', e);
      console.log('Error response data:', e?.response?.data);
      
      let apiMsg = "Failed to update Password.";
      
      if (e?.response?.data?.error) {
        apiMsg = e.response.data.error;
      } else if (e?.response?.data?.password) {
        apiMsg = e.response.data.password[0];
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
      <Button onClick={handleShow} size="mini" basic title="Edit Password">
        <BiEdit style={{ marginRight: 6 }} />
        Password
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                New Password:
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password (min 6 chars, 1 capital, 1 number)"
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Confirm Password:
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
                 <Modal.Footer>
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
             <small style={{ color: "red" }}>
               <i className="fas fa-info-circle" style={{ marginRight: "5px" }}></i>
               Min 6 chars, 1 capital, 1 number, both fields must match
             </small>
             <div>
               <Button color="red" onClick={handleClose} style={{ marginRight: "10px" }}>
                 Cancel
               </Button>
               <Button
                 color="green"
                 onClick={onSave}
                 disabled={!isPasswordValid}
               >
                 Save
               </Button>
             </div>
           </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Consultant Can Assign Task Modal
export function EditConsultantCanAssignTaskModal({ consultant, update_state }) {
  const [show, setShow] = useState(false);
  const [canAssignTask, setCanAssignTask] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setCanAssignTask(consultant.canassigntask || false);
    setShow(true);
  };

  const onSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const res = await apiPut(
        `${UPDATE_CONSULTANT}${consultant.consultant_id}/`,
        { canassigntask: canAssignTask },
        currentHeaders
      );

      update_state(res);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Can Assign Task updated successfully!",
      });
    } catch (e) {
      console.log('Error updating can assign task:', e);
      console.log('Error response data:', e?.response?.data);
      
      let apiMsg = "Failed to update Can Assign Task.";
      
      if (e?.response?.data?.error) {
        apiMsg = e.response.data.error;
      } else if (e?.response?.data?.canassigntask) {
        apiMsg = e.response.data.canassigntask[0];
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
      <Button onClick={handleShow} size="mini" basic title="Edit Can Assign Task">
        <BiEdit style={{ marginRight: 6 }} />
        Tasks
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Can Assign Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Can Assign Task:
              </Form.Label>
              <Col sm={9}>
                <Form.Check
                  type="checkbox"
                  checked={canAssignTask}
                  onChange={(e) => setCanAssignTask(e.target.checked)}
                  label="Allow this consultant to assign tasks"
                />
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
                 <Modal.Footer>
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
             <small style={{ color: "red" }}>
               <i className="fas fa-info-circle" style={{ marginRight: "5px" }}></i>
               Enable/disable task assignment
             </small>
             <div>
               <Button color="red" onClick={handleClose} style={{ marginRight: "10px" }}>
                 Cancel
               </Button>
               <Button color="green" onClick={onSave}>
                 Save
               </Button>
             </div>
           </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Consultant Cash Passport Modal
export function EditConsultantCashPassportModal({ consultant, update_state }) {
  const [show, setShow] = useState(false);
  const [cashPassport, setCashPassport] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setCashPassport(consultant.cashpassport || "");
    setShow(true);
  };

  // Regex to validate country codes: 3 capital letters separated by comma + space
  const countryCodeRegex = /^([A-Z]{3}(,\s[A-Z]{3})*)?$/;
  const isCashPassportValid = cashPassport === "" || (cashPassport.length <= 120 && countryCodeRegex.test(cashPassport));

  const onSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const res = await apiPut(
        `${UPDATE_CONSULTANT}${consultant.consultant_id}/`,
        { cashpassport: cashPassport || null },
        currentHeaders
      );

      update_state(res);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Cash Passport Countries updated successfully!",
      });
    } catch (e) {
      console.log('Error updating cash passport:', e);
      console.log('Error response data:', e?.response?.data);
      
      let apiMsg = "Failed to update Cash Passport Countries.";
      
      if (e?.response?.data?.error) {
        apiMsg = e.response.data.error;
      } else if (e?.response?.data?.cashpassport) {
        apiMsg = e.response.data.cashpassport[0];
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
      <Button onClick={handleShow} size="mini" basic title="Edit Cash Passport">
        <BiEdit style={{ marginRight: 6 }} />
        Passport
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Cash Passport Countries</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Countries:
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  value={cashPassport}
                  onChange={(e) => setCashPassport(clampLen(e.target.value, 120))}
                  placeholder="Enter country codes (e.g., GRE, CAN, USA) - optional"
                />
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
                 <Modal.Footer>
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
             <small style={{ color: "red" }}>
               <i className="fas fa-info-circle" style={{ marginRight: "5px" }}></i>
               3 capital letters, comma + space (e.g., GRE, CAN, USA)
             </small>
             <div>
               <Button color="red" onClick={handleClose} style={{ marginRight: "10px" }}>
                 Cancel
               </Button>
               <Button
                 color="green"
                 onClick={onSave}
                 disabled={!isCashPassportValid}
               >
                 Save
               </Button>
             </div>
           </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Consultant Active Modal
export function EditConsultantActiveModal({ consultant, update_state }) {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setActive(consultant.active || false);
    setShow(true);
  };

  const onSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const res = await apiPut(
        `${UPDATE_CONSULTANT}${consultant.consultant_id}/`,
        { active: active },
        currentHeaders
      );

      update_state(res);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Active status updated successfully!",
      });
    } catch (e) {
      console.log('Error updating active status:', e);
      console.log('Error response data:', e?.response?.data);
      
      let apiMsg = "Failed to update Active status.";
      
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
      <Button onClick={handleShow} size="mini" basic title="Edit Active Status">
        <BiEdit style={{ marginRight: 6 }} />
        Active
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Active Status</Modal.Title>
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
                  label="Mark consultant as active"
                />
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
                 <Modal.Footer>
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
             <small style={{ color: "red" }}>
               <i className="fas fa-info-circle" style={{ marginRight: "5px" }}></i>
               Activate/deactivate account
             </small>
             <div>
               <Button color="red" onClick={handleClose} style={{ marginRight: "10px" }}>
                 Cancel
               </Button>
               <Button color="green" onClick={onSave}>
                 Save
               </Button>
             </div>
           </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Consultant Order Index Modal
export function EditConsultantOrderIndexModal({ consultant, update_state }) {
  const [show, setShow] = useState(false);
  const [orderindex, setOrderindex] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setOrderindex(consultant.orderindex?.toString() || "");
    setShow(true);
  };

  const isOrderIndexValid = orderindex !== "" && Number.isInteger(+orderindex);

  const onSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const res = await apiPut(
        `${UPDATE_CONSULTANT}${consultant.consultant_id}/`,
        { orderindex: Number(orderindex) },
        currentHeaders
      );

      update_state(res);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Order Index updated successfully!",
      });
    } catch (e) {
      console.log('Error updating order index:', e);
      console.log('Error response data:', e?.response?.data);
      
      let apiMsg = "Failed to update Order Index.";
      
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
      <Button onClick={handleShow} size="mini" basic title="Edit Order Index">
        <BiEdit style={{ marginRight: 6 }} />
        Order
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Order Index</Modal.Title>
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
                />
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
                 <Modal.Footer>
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
             <small style={{ color: "red" }}>
               <i className="fas fa-info-circle" style={{ marginRight: "5px" }}></i>
               Must be a valid integer
             </small>
             <div>
               <Button color="red" onClick={handleClose} style={{ marginRight: "10px" }}>
                 Cancel
               </Button>
               <Button
                 color="green"
                 onClick={onSave}
                 disabled={!isOrderIndexValid}
               >
                 Save
               </Button>
             </div>
           </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
