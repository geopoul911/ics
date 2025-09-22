// Built-ins
import { useState, useEffect } from "react";

// Icons / Images
import { FiEdit } from "react-icons/fi";
import { FaStop } from "react-icons/fa";
import { MdPhotoCamera } from "react-icons/md";

// Modules / Functions
import Swal from "sweetalert2";
import { Modal, Col, Form, Row } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/bootstrap.css';


// Global Variables
import { headers } from "../global_vars";
import axios from "axios";

// Variables
window.Swal = Swal;

// API endpoint for consultant
const UPDATE_CONSULTANT = "https://ultima.icsgr.com/api/administration/consultant/";

// Helpers
const clampLen = (value, max) => value.slice(0, max);
const toSmallInt = (value) => {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return "";
  return Math.max(-32768, Math.min(32767, n)); // Django SmallIntegerField range
};

// Field-specific validation helpers
// removed legacy phone validators; using PhoneInput for phone formatting

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

// Email format validation (required)
const isValidEmail = (value) => {
  if (!value) return false; // required
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(value);
};

// Edit Consultant ID Modal (PK - Immutable)
export function EditConsultantIdModal({ consultant, update_state }) {
  return (
    <Button size="tiny" basic disabled>
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

      const res = await axios.patch(
        `${UPDATE_CONSULTANT}${consultant.consultant_id}/`,
        { fullname: fullname.trim() },
        { headers: currentHeaders }
      );

      update_state(res.data);
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
      <Button onClick={handleShow} size="tiny" basic title="Edit Full name">
        <FiEdit style={{ marginRight: 6 }} />
        Name
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Full name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Full name</Form.Label>
              <Form.Control
                type="text"
                value={fullname}
                onChange={(e) => setFullname(validateFullname(clampLen(e.target.value, 40)))}
                placeholder="Full name (2-40 characters)"
                isInvalid={!isFullnameValid}
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <small style={{ color: isFullnameValid ? "green" : "red" }}>
              {isFullnameValid ? "Looks good." : "Must be 2-40 characters."}
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

  const trimmedEmail = email.trim();
  const isEmailValid = isValidEmail(trimmedEmail);

  const onSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const res = await axios.patch(
        `${UPDATE_CONSULTANT}${consultant.consultant_id}/`,
        { email: trimmedEmail },
        { headers: currentHeaders }
      );

      update_state(res.data);
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
      <Button onClick={handleShow} size="tiny" basic title="Edit E-mail">
        <FiEdit style={{ marginRight: 6 }} />
        E-mail
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit E-mail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>E-mail</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                isInvalid={!isEmailValid}
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <small style={{ color: isEmailValid ? "green" : "red" }}>
              {isEmailValid ? "Looks good." : "Enter a valid email (required)."}
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

      const res = await axios.patch(
        `${UPDATE_CONSULTANT}${consultant.consultant_id}/`,
        { phone: phone || null },
        { headers: currentHeaders }
      );

      update_state(res.data);
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
      <Button onClick={handleShow} size="tiny" basic title="Edit Telephone">
        <FiEdit style={{ marginRight: 6 }} />
        Telephone
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Telephone</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group className="mb-3">
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <small style={{ color: isPhoneValid ? "green" : "red" }}>
              {isPhoneValid ? "Looks good." : "Max 15 characters."}
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

  const isMobileValid = mobile.trim().length > 0 && mobile.replace(/\D/g, '').length >= 7;

  const onSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const res = await axios.patch(
        `${UPDATE_CONSULTANT}${consultant.consultant_id}/`,
        { mobile: ('+' + mobile.replace(/\D/g, '')) },
        { headers: currentHeaders }
      );

      update_state(res.data);
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
      <Button onClick={handleShow} size="tiny" basic title="Edit Cell phone">
        <FiEdit style={{ marginRight: 6 }} />
        Cell phone
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Cell phone</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group className="mb-3">
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <small style={{ color: isMobileValid ? "green" : "red" }}>
              {isMobileValid ? "Looks good." : "Required, max 15 characters."}
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

      const res = await axios.patch(
        `${UPDATE_CONSULTANT}${consultant.consultant_id}/`,
        { role: role },
        { headers: currentHeaders }
      );

      update_state(res.data);
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
      <Button onClick={handleShow} size="tiny" basic title="Edit Role">
        <FiEdit style={{ marginRight: 6 }} />
        Role
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                isInvalid={!isRoleValid}
              >
                <option value="">Select role</option>
                <option value="A">Admin</option>
                <option value="S">Supervisor</option>
                <option value="U">Superuser</option>
                <option value="C">User</option>
              </Form.Control>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <small style={{ color: isRoleValid ? "green" : "red" }}>
              {isRoleValid ? "Looks good." : "Select a valid role."}
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
    <Button size="tiny" basic disabled>
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

      const res = await axios.patch(
        `${UPDATE_CONSULTANT}${consultant.consultant_id}/`,
        { password: password },
        { headers: currentHeaders }
      );

      update_state(res.data);
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
      <Button onClick={handleShow} size="tiny" basic title="Edit Password">
        <FiEdit style={{ marginRight: 6 }} />
        Password
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 chars, 1 capital, 1 number"
                isInvalid={!isPasswordValid && (password || confirmPassword)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                isInvalid={!isPasswordValid && (password || confirmPassword)}
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <small style={{ color: isPasswordValid ? "green" : "red" }}>
              {isPasswordValid ? "Looks good." : "Min 6 chars, 1 capital, 1 number, both fields must match."}
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

      const res = await axios.patch(
        `${UPDATE_CONSULTANT}${consultant.consultant_id}/`,
        { canassigntask: canAssignTask },
        { headers: currentHeaders }
      );

      update_state(res.data);
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
      <Button onClick={handleShow} size="tiny" basic title="Edit Can Assign Task">
        <FiEdit style={{ marginRight: 6 }} />
        Tasks
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Can Assign Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                checked={canAssignTask}
                onChange={(e) => setCanAssignTask(e.target.checked)}
                label="Allow this consultant to assign tasks"
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <small style={{ color: "green" }}>Ready to save.</small>
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
  const [countries, setCountries] = useState([]);
  const [selectedCodes, setSelectedCodes] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    const existing = consultant.cashpassport || "";
    const arr = existing.split(',').map((s) => s.trim()).filter(Boolean);
    setSelectedCodes(arr);
    setShow(true);
  };

  // Load countries when modal opens
  useEffect(() => {
    const loadCountries = async () => {
      try {
        const currentHeaders = { ...headers, "Authorization": "Token " + localStorage.getItem("userToken") };
        const res = await axios.get("https://ultima.icsgr.com/api/regions/all_countries/", { headers: currentHeaders });
        const data = res?.data?.all_countries || [];
        setCountries(Array.isArray(data) ? data : []);
      } catch (_e) {
        setCountries([]);
      }
    };
    if (show) loadCountries();
  }, [show]);

  const joined = selectedCodes.join(', ');
  const isCashPassportValid = joined.length <= 120;

  const onSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const res = await axios.patch(
        `${UPDATE_CONSULTANT}${consultant.consultant_id}/`,
        { cashpassport: joined || null },
        { headers: currentHeaders }
      );

      update_state(res.data);
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
      <Button onClick={handleShow} size="tiny" basic title="Edit Cash Passport">
        <FiEdit style={{ marginRight: 6 }} />
        Passport
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Cash of Countries</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label id="cashpassport-countries-label">Countries</Form.Label>
              {/* Hidden input to expose joined value for tooling/tests */}
              <input type="hidden" name="cashpassport" value={joined} />
              <div role="group" aria-labelledby="cashpassport-countries-label" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {countries.map((c) => {
                  const isSelected = selectedCodes.includes(c.country_id);
                  return (
                    <Button
                      key={c.country_id}
                      type="button"
                      size="tiny"
                      color={isSelected ? 'green' : 'grey'}
                      onClick={() => {
                        setSelectedCodes((prev) => {
                          if (prev.includes(c.country_id)) {
                            return prev.filter((id) => id !== c.country_id);
                          }
                          return [...prev, c.country_id];
                        });
                      }}
                      title={`${c.country_id} - ${c.title}`}
                    >
                      {c.country_id}
                    </Button>
                  );
                })}
              </div>
              {!isCashPassportValid && (
                <div style={{ color: 'red', marginTop: 6 }}>Selection too long (max 120 characters when joined)</div>
              )}
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <small style={{ color: isCashPassportValid ? "green" : "red" }}>
              {isCashPassportValid ? "Looks good." : "Selection too long (max 120 characters when saved)."}
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

      const res = await axios.patch(
        `${UPDATE_CONSULTANT}${consultant.consultant_id}/`,
        { active: active },
        { headers: currentHeaders }
      );

      update_state(res.data);
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
      <Button onClick={handleShow} size="tiny" basic title="Edit Active Status">
        <FiEdit style={{ marginRight: 6 }} />
        Active
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Active Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                label="Mark consultant as active"
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <small style={{ color: "green" }}>Ready to save.</small>
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

// Edit Consultant Order by Modal
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

      const res = await axios.patch(
        `${UPDATE_CONSULTANT}${consultant.consultant_id}/`,
        { orderindex: Number(orderindex) },
        { headers: currentHeaders }
      );

      update_state(res.data);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Order by updated successfully!",
      });
    } catch (e) {
      console.log('Error updating order index:', e);
      console.log('Error response data:', e?.response?.data);
      
      let apiMsg = "Failed to update Order by.";
      
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
      <Button onClick={handleShow} size="tiny" basic title="Edit Order by">
        <FiEdit style={{ marginRight: 6 }} />
        Order
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Order by</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Order by</Form.Label>
              <Form.Control
                type="number"
                value={orderindex}
                onChange={(e) => setOrderindex(toSmallInt(e.target.value))}
                placeholder="Enter order index"
                isInvalid={!isOrderIndexValid}
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <small style={{ color: isOrderIndexValid ? "green" : "red" }}>
              {isOrderIndexValid ? "Looks good." : "Must be a valid integer."}
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

// Edit Consultant Photo Modal
export function EditConsultantPhotoModal({ consultant, update_state }) {
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleClose = () => {
    setShow(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleShow = () => {
    // Reset transient state on open
    setSelectedFile(null);
    setPreviewUrl(null);
    setShow(true);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          icon: "error",
          title: "Invalid File Type",
          text: "Please select an image file (JPEG, PNG, GIF, etc.)",
        });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "File Too Large",
          text: "Please select an image smaller than 5MB",
        });
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSave = async () => {
    if (!selectedFile) {
      Swal.fire({
        icon: "error",
        title: "No File Selected",
        text: "Please select an image file to upload",
      });
      return;
    }

    setIsUploading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      // Remove Content-Type header to let browser set it with boundary for multipart/form-data
      delete currentHeaders["Content-Type"];

      const formData = new FormData();
      formData.append('photo', selectedFile);

      const response = await fetch(`${UPDATE_CONSULTANT}${consultant.consultant_id}/`, {
        method: 'PUT',
        headers: {
          "Authorization": currentHeaders["Authorization"]
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const res = await response.json();
      update_state(res);
      // Clear local selection/preview after successful upload
      setSelectedFile(null);
      setPreviewUrl(null);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Photo updated successfully!",
      });
    } catch (e) {
      console.log('Error updating photo:', e);
      
      let apiMsg = "Failed to update photo.";
      
      if (e?.response?.data?.error) {
        apiMsg = e.response.data.error;
      } else if (e?.response?.data?.photo) {
        apiMsg = e.response.data.photo[0];
      } else if (e?.response?.data?.detail) {
        apiMsg = e.response.data.detail;
      }
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: apiMsg,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const res = await axios.patch(
        `${UPDATE_CONSULTANT}${consultant.consultant_id}/`,
        { photo: null },
        { headers: currentHeaders }
      );

      // Use response data (not the axios response object)
      update_state(res?.data || {});
      // Clear local state and preview
      setSelectedFile(null);
      setPreviewUrl(null);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Photo removed successfully!",
      });
    } catch (e) {
      console.log('Error removing photo:', e);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to remove photo.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Photo">
        <MdPhotoCamera style={{ marginRight: 6 }} />
        Photo
      </Button>

      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Photo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Current Photo:
              </Form.Label>
              <Col sm={9}>
                {consultant.photo_url ? (
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img 
                      src={consultant.photo_url} 
                      alt="Current" 
                      style={{ 
                        maxWidth: '200px', 
                        maxHeight: '200px', 
                        borderRadius: '8px',
                        border: '2px solid #ddd'
                      }} 
                    />
                  </div>
                ) : (
                  <div style={{ 
                    textAlign: 'center', 
                    marginBottom: '20px',
                    padding: '40px',
                    border: '2px dashed #ddd',
                    borderRadius: '8px',
                    color: '#666'
                  }}>
                    No photo uploaded
                  </div>
                )}
              </Col>
            </Form.Group>
            
            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Upload New Photo:
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
                <Form.Text className="text-muted">
                  Supported formats: JPEG, PNG, GIF. Maximum size: 5MB
                </Form.Text>
              </Col>
            </Form.Group>

            {previewUrl && (
              <Form.Group as={Row}>
                <Form.Label column sm={3}>
                  Preview:
                </Form.Label>
                <Col sm={9}>
                  <div style={{ textAlign: 'center' }}>
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      style={{ 
                        maxWidth: '200px', 
                        maxHeight: '200px', 
                        borderRadius: '8px',
                        border: '2px solid #ddd'
                      }} 
                    />
                  </div>
                </Col>
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <div>
              {consultant.photo_url && (
                <Button color="red" onClick={removePhoto} style={{ marginRight: "10px" }}>
                  Remove Photo
                </Button>
              )}
            </div>
            <div>
              <Button color="red" onClick={handleClose} style={{ marginRight: "10px" }}>
                Cancel
              </Button>
              <Button
                color="green"
                onClick={onSave}
                disabled={!selectedFile || isUploading}
                loading={isUploading}
              >
                {isUploading ? "Uploading..." : "Upload Photo"}
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
