// Built-ins
import { useState, useEffect } from "react";

// Icons / Images
import { BiPlus } from "react-icons/bi";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";
import { MdPhotoCamera } from "react-icons/md";

import axios from "axios";

// Modules / Functions
import Swal from "sweetalert2";
import { Modal, Col, Form, Row } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/bootstrap.css';

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

// API endpoint - Using administration API
const ADD_CONSULTANT = "https://ultima.icsgr.com/api/administration/all_consultants/";

// Helpers
// eslint-disable-next-line no-useless-escape
const onlyAlphanumeric = (value) => value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
const clampLen = (value, max) => value.slice(0, max);
const toSmallInt = (value) => {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return "";
  return Math.max(-32768, Math.min(32767, n)); // Django SmallIntegerField range
};

// Countries will be loaded to populate the multi-select for cash passport

// Validation helpers
const validateUsername = (value) => value.replace(/[^a-zA-Z0-9]/g, "");
const validatePassword = (password) => {
  const hasCapital = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasMinLength = password.length >= 6;
  return hasCapital && hasNumber && hasMinLength;
};

function AddConsultantModal() {
  const [show, setShow] = useState(false);

  const [consultantId, setConsultantId] = useState(""); // maps to consultant_id
  const [fullname, setFullname] = useState(""); // required
  const [email, setEmail] = useState(""); // optional
  const [phone, setPhone] = useState(""); // optional
  const [mobile, setMobile] = useState(""); // optional
  const [role, setRole] = useState(""); // required
  const [username, setUsername] = useState(""); // required
  const [password, setPassword] = useState(""); // required
  const [confirmPassword, setConfirmPassword] = useState(""); // required
  const [canAssignTask, setCanAssignTask] = useState(false); // optional
  const [countries, setCountries] = useState([]);
  const [selectedCodes, setSelectedCodes] = useState([]);
  const [active, setActive] = useState(true); // optional, default true
  const [orderindex, setOrderindex] = useState(""); // required small int
  const [selectedPhoto, setSelectedPhoto] = useState(null); // optional photo file
  const [photoPreview, setPhotoPreview] = useState(null); // photo preview URL

  const resetForm = () => {
    setConsultantId("");
    setFullname("");
    setEmail("");
    setPhone("");
    setMobile("");
    setRole("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setCanAssignTask(false);
    setActive(true);
    setOrderindex("");
    setSelectedPhoto(null);
    setPhotoPreview(null);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => {
    resetForm();
    setShow(true);
  };

  const handlePhotoSelect = (event) => {
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

      setSelectedPhoto(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const isConsultantIdValid = consultantId.length >= 2 && consultantId.length <= 10;
  const isFullnameValid = fullname.trim().length >= 2 && fullname.trim().length <= 40;
  const isEmailValid = email !== "" && email.includes("@") && email.length >= 5; // required
  const isPhoneValid = !phone || phone.replace(/\D/g, '').length >= 7; // optional
  const isMobileValid = mobile.replace(/\D/g, '').length >= 7; // required
  const isRoleValid = ["A", "S", "U", "C"].includes(role);
  const isUsernameValid = username.length >= 3 && username.length <= 15;
  const isPasswordValid = validatePassword(password) && password === confirmPassword;
  const joinedCashPassport = selectedCodes.join(', ');
  const isCashPassportValid = joinedCashPassport.length <= 120; // optional
  const isOrderIndexValid = orderindex !== "" && Number.isInteger(+orderindex); // required

  const isFormValid = isConsultantIdValid && isFullnameValid && isEmailValid &&
                     isPhoneValid && isMobileValid && isRoleValid &&
                     isUsernameValid && isPasswordValid && isCashPassportValid &&
                     isOrderIndexValid;

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

  const createNewConsultant = async () => {
    try {
      // Update headers with current token
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      // Remove Content-Type header to let browser set it with boundary for multipart/form-data
      delete currentHeaders["Content-Type"];

      const formData = new FormData();
      formData.append('consultant_id', consultantId);
      formData.append('fullname', fullname.trim());
      formData.append('email', email);
      if (phone) formData.append('phone', ('+' + phone.replace(/\D/g, '')));
      formData.append('mobile', ('+' + mobile.replace(/\D/g, '')));
      formData.append('role', role);
      formData.append('username', username);
      formData.append('password', password);
      formData.append('canassigntask', canAssignTask);
      if (joinedCashPassport) formData.append('cashpassport', joinedCashPassport);
      formData.append('active', active);
      // Order by is required
      formData.append('orderindex', Number(orderindex));
      
      // Add photo if selected
      if (selectedPhoto) {
        formData.append('photo', selectedPhoto);
      }

      const res = await axios({
        method: "post",
        url: ADD_CONSULTANT,
        headers: {
          "Authorization": currentHeaders["Authorization"]
        },
        data: formData,
      });

      const newId =
        res?.data?.consultant_id ||
        res?.data?.id ||
        consultantId;

      window.location.href = "/administration/consultant/" + newId;
    } catch (e) {
      console.log('Error creating consultant:', e);
      console.log('Error response data:', e?.response?.data);
      
      // Handle different error response formats
      let apiMsg = "Something went wrong while creating the consultant.";
      
      if (e?.response?.data?.error) {
        // Custom error format from our enhanced error handling
        apiMsg = e.response.data.error;
      } else if (e?.response?.data?.orderindex) {
        // Serializer validation error for orderindex
        apiMsg = e.response.data.orderindex[0];
      } else if (e?.response?.data?.consultant_id) {
        // Serializer validation error for consultant_id
        apiMsg = e.response.data.consultant_id[0];
      } else if (e?.response?.data?.username) {
        // Serializer validation error for username
        apiMsg = e.response.data.username[0];
      } else if (e?.response?.data?.fullname) {
        // Serializer validation error for fullname
        apiMsg = e.response.data.fullname[0];
      } else if (e?.response?.data?.role) {
        // Serializer validation error for role
        apiMsg = e.response.data.role[0];
      } else if (e?.response?.data?.password) {
        // Serializer validation error for password
        apiMsg = e.response.data.password[0];
      } else if (e?.response?.data?.email) {
        // Serializer validation error for email
        apiMsg = e.response.data.email[0];
      } else if (e?.response?.data?.phone) {
        // Serializer validation error for phone
        apiMsg = e.response.data.phone[0];
      } else if (e?.response?.data?.mobile) {
        // Serializer validation error for mobile
        apiMsg = e.response.data.mobile[0];
      } else if (e?.response?.data?.cashpassport) {
        // Serializer validation error for cashpassport
        apiMsg = e.response.data.cashpassport[0];
      } else if (e?.response?.data?.photo) {
        // Serializer validation error for photo
        apiMsg = e.response.data.photo[0];
      } else if (e?.response?.data?.detail) {
        // Generic DRF error
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
      <Button color="green" style={{ margin: 20 }} onClick={handleShow}>
        <BiPlus
          style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }}
        />
        Create new Consultant
      </Button>

      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Consultant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Consultant ID *</Form.Label>
                                     <Form.Control
                     type="text"
                     value={consultantId}
                     onChange={(e) => setConsultantId(onlyAlphanumeric(clampLen(e.target.value, 10)))}
                     placeholder="Enter consultant ID (2-10 alphanumeric characters)"
                     isInvalid={consultantId !== "" && !isConsultantIdValid}
                   />
                  <Form.Control.Feedback type="invalid">
                    Consultant ID must be 2-10 characters
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Full name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={fullname}
                    onChange={(e) => setFullname(clampLen(e.target.value, 40))}
                    placeholder="Enter full name (2-40 characters)"
                    isInvalid={fullname !== "" && !isFullnameValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    Full name must be 2-40 characters
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                 <Form.Group>
                   <Form.Label>E-mail *</Form.Label>
                   <Form.Control
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     placeholder="Enter email address"
                     isInvalid={email !== "" && !isEmailValid}
                   />
                   <Form.Control.Feedback type="invalid">
                     Please enter a valid email address
                   </Form.Control.Feedback>
                 </Form.Group>
               </Col>
               <Col md={6}>
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
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Cell phone *</Form.Label>
                  <PhoneInput
                    country={'gr'}
                    value={mobile}
                    onChange={(val) => setMobile(val)}
                    enableSearch
                    countryCodeEditable={false}
                    inputProps={{ name: 'mobile' }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Role *</Form.Label>
                  <Form.Control
                    as="select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    isInvalid={role !== "" && !isRoleValid}
                  >
                    <option value="">Select Role</option>
                    <option value="A">Admin</option>
                    <option value="S">Supervisor</option>
                    <option value="U">Superuser</option>
                    <option value="C">User</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    Please select a role
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Username *</Form.Label>
                                     <Form.Control
                     type="text"
                     value={username}
                     onChange={(e) => setUsername(validateUsername(clampLen(e.target.value, 15)))}
                     placeholder="Enter username (3-15 alphanumeric characters)"
                     isInvalid={username !== "" && !isUsernameValid}
                   />
                  <Form.Control.Feedback type="invalid">
                    Username must be 3-15 characters
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Password *</Form.Label>
                    <Form.Control
                     type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder="Enter password (min 6 chars, 1 capital, 1 number)"
                     isInvalid={password !== "" && !validatePassword(password)}
                   />
                   <Form.Control.Feedback type="invalid">
                     Password must be at least 6 characters with 1 capital letter and 1 number
                   </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Confirm Password *</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    isInvalid={confirmPassword !== "" && password !== confirmPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    Passwords do not match
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Order by *</Form.Label>
                  <Form.Control
                    type="number"
                    value={orderindex}
                    onChange={(e) => setOrderindex(toSmallInt(e.target.value))}
                    placeholder="Enter order index"
                    isInvalid={!isOrderIndexValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    Order by is required and must be an integer
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Photo</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                  />
                  <Form.Text className="text-muted">
                    <MdPhotoCamera style={{ marginRight: 6 }} />
                    Supported formats: JPEG, PNG, GIF. Maximum size: 5MB (optional)
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            {photoPreview && (
              <Row>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Photo Preview</Form.Label>
                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                      <img
                        src={photoPreview}
                        alt="preview"
                        style={{
                          maxWidth: '200px',
                          maxHeight: '200px',
                          borderRadius: '8px',
                          border: '2px solid #ddd'
                        }}
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            )}

            <Row>
              <Col md={12}>
                <Form.Group>
                  <Form.Label id="create-cashpassport-countries-label">Cash Passport Countries</Form.Label>
                  {/* Hidden input to expose joined value for tooling/tests */}
                  <input type="hidden" name="cashpassport" value={joinedCashPassport} />
                  <div role="group" aria-labelledby="create-cashpassport-countries-label" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
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
                                const next = prev.filter((id) => id !== c.country_id);
                                return next;
                              }
                              const next = [...prev, c.country_id];
                              return next;
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
                    <div style={{ color: 'red', marginTop: 6 }}>Selection too long (max length 120 when joined)</div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    checked={canAssignTask}
                    onChange={(e) => setCanAssignTask(e.target.checked)}
                    label="Can Assign Tasks"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    label="Active"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
                 <Modal.Footer>
           <small className="mr-auto">
             {!isFormValid ? (
               <ul
                 className="mr-auto"
                 style={{ margin: 0, padding: 0, color: "red" }}
               >
                 {!isConsultantIdValid && (
                   <li>
                     <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                     Consultant ID is required (2–10 chars).
                   </li>
                 )}
                 {!isFullnameValid && (
                   <li>
                     <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                     Full Name is required (2–40 chars).
                   </li>
                 )}
                 {!isEmailValid && (
                   <li>
                     <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                     Email is required and must be valid.
                   </li>
                 )}
                 {!isPhoneValid && (
                   <li>
                     <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                     Phone must be 15 characters or less.
                   </li>
                 )}
                 {!isMobileValid && (
                   <li>
                     <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                     Mobile is required and must be at least 7 digits.
                   </li>
                 )}
                 {!isRoleValid && (
                   <li>
                     <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                     Role is required.
                   </li>
                 )}
                 {!isUsernameValid && (
                   <li>
                     <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                     Username is required (3–15 chars).
                   </li>
                 )}
                                   {!isPasswordValid && (
                    <li>
                      <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                      Password is required (min 6 chars, 1 capital, 1 number) and must match confirmation.
                    </li>
                  )}
                 {!isCashPassportValid && (
                   <li>
                     <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                     Cash Passport selection too long (max 120 characters when joined).
                   </li>
                 )}
                 {!isOrderIndexValid && (
                   <li>
                     <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                     Order by is required and must be an integer.
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
               createNewConsultant();
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

export default AddConsultantModal;
