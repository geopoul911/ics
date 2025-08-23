// Built-ins
import React, { useState } from "react";

// Icons / Images
import { BiMailSend } from "react-icons/bi";
import { ImCross } from "react-icons/im";
import { Col, Form, Row, Modal } from "react-bootstrap";
import { Editor } from "@tinymce/tinymce-react";

// Modules / Functions
import { Button } from "semantic-ui-react";
import axios from "axios";
import Swal from "sweetalert2";
import { MdContactPhone } from "react-icons/md";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

const SEND_MASS_EMAIL = "http://localhost:8000/api/maps/send_massive_email/";

let form_control_style = {
  marginBottom: 10,
  width: "93%",
  display: "inline-block",
};

const preBody = (
  `<p>Dear partner,</p>
    <p>Please advise if you can confirm the following group:</p>
    <p>
        <strong>
          20 TWINS + 
          <span style="margin-right: 50px;">02 SGLS</span>
          <span style="margin-left: 50px;">25 JULY 2024</span> 
          / 01 NIGHT
        </strong>
    </p>
    <p>The budget of the group is:</p>
    <p>
        <strong>€ 20.00 per person, per night</strong> including buffet breakfast and all taxes.<br>
        <strong>2 sgls free for the drivers.</strong>
    </p>
    <p>Please reply back at your earliest convenience.</p>
    <br>
    <p>Cher(e) partenaire,</p>
    <p>Veuillez confirmer disponibilité pour le groupe ci-dessous :</p>
    <p>
        <strong>
          20 TWINS + 
          <span style="margin-right: 50px;">02 SGLS</span>
          <span style="margin-left: 50px;">25 JUILLET 2024</span> 
          / 01 NUITEE
        </strong>
    </p>
    <p>Le budget pour ce groupe est :</p>
    <p>
        <strong>20.00€ par personne par nuit</strong>, petit-déjeuner buffet inclus ainsi que tous les taxes<br>
        <strong>2 chambres singles gratis pour les chauffeurs</strong>
    </p>
    <p>En attente de votre retour le plus vite possible</p>`
);

const SendMassiveEmail = (props) => {
  const [subject, setSubject] = React.useState("");
  const [recipients, setRecipients] = React.useState("");
  const [messageVisible, setMessageVisible] = useState(false);

  const [file, setFile] = React.useState();
  const [body, setBody] = React.useState(preBody);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let [selectAllPOIS, setSelectAllPOIS] = React.useState(false);
  let [all_pois, setAllPOIS] = React.useState({});

  const toggleAll = () => {
    if (!selectAllPOIS) {
      props.pois.forEach((poi) => (all_pois[poi.email] = true));
      props.results.forEach((poi) => (all_pois[poi.email] = true));
    } else {
      setAllPOIS({});
    }
  };

  const handleCheckboxChange = (email) => {
    setAllPOIS((prev) => ({ ...prev, [email]: !prev[email] }));
  };

  function renderMailAddressesUL(arr) {
    // Separate hotels and contact persons
    const hotels = arr.filter(item => item.name && !item.name.includes('Contact person'));
    const contacts = arr.filter(item => item.name && item.name.includes('Contact person'));
  
    // Group contacts under respective hotels
    const groupedContacts = hotels.reduce((acc, hotel) => {
      // Find contact persons for the current hotel
      const hotelContacts = contacts.filter(contact => contact.name.includes(hotel.name));
  
      // Add contacts to the hotel in the accumulator
      if (hotelContacts.length > 0) {
        acc[hotel.name] = hotelContacts;
      }
  
      return acc;
    }, {});
  
    return (
      <div id="hotel_checkboxes_modal_content">
        {/* Loop through each hotel */}
        {hotels.map((hotel) => (
          <div key={hotel.id}>
            {/* Display hotel with checkbox */}
            <div className={all_pois[hotel.email] ? "mass_mail_selected_box" : ""}>
              <Form.Check
                name={hotel.email}
                onChange={(e) => handleCheckboxChange(hotel.email)}
                type="checkbox"
                checked={all_pois[hotel.email]}
                label={hotel.name}
                title={hotel.email}
              />
            </div>
  
            {/* Display contact persons under the current hotel */}
            {groupedContacts[hotel.name] && (
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {groupedContacts[hotel.name].map((contact) => (
                  <li key={contact.id} style={{ marginLeft: '20px' }}>
                    {/* Display contact person with checkbox and icon */}
                    <div className={all_pois[contact.email] ? "mass_mail_selected_box" : ""}>
                      <Form.Check
                        name={contact.email}
                        onChange={(e) => handleCheckboxChange(contact.email)}
                        type="checkbox"
                        checked={all_pois[contact.email]}
                        label={
                          <>
                            {/* Icon for contact person */}
                            {contact.name.includes("Contact person") && (
                              <MdContactPhone style={{ color: "#F3702D", fontSize: "1.2em", marginRight: '8px' }} />
                            )}
                            {/* Contact person name */}
                            {contact.name}
                          </>
                        }
                        title={contact.email}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  }
  

  const send = () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("subject", subject);
    formData.append("recipients", recipients);
    formData.append("body", body);
    formData.append("pois", Object.keys(all_pois));
    formData.append("from", localStorage.user_email);

    axios({
      method: "post",
      url: SEND_MASS_EMAIL,
      headers: headers,
      data: formData,
    })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Email Successfully Sent to : ",
          text: res.data.recipients.map((e) => e + " \n"),
        });
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: e.response.data.errormsg,
        });
      });
    setAllPOIS({});
    setSelectAllPOIS(false);
  };

  const handleFocus = () => {
    setMessageVisible(true);
  };

  const handleBlur = () => {
    setMessageVisible(false);
  };

  const sortedResults = props.results.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <Button
        color="green"
        onClick={() => {
          handleShow();
        }}
        style={{ marginTop: 20 }}
        disabled={ (props.pois.length === 0 && props.results.length === 0) || props.forbidden}
      >
        <BiMailSend /> Send email
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="xl"
        id="send_mass_mail_modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Select the recipients to send the email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">
              From :
            </Form.Label>
            <Col sm="10">
              <Form.Control
                disabled={true}
                style={form_control_style}
                value={localStorage.user_email}
              />
            </Col>
            <Form.Label column sm="2">
              To :
            </Form.Label>
            <Col sm="10">
              <Form.Control
                style={form_control_style}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={(e) => {
                  setRecipients(e.target.value);
                }}
                value={recipients}
              />
              {messageVisible && (
                <p style={{ color: "red" }}>
                  Separate email addresses with a ";" otherwise they will not be
                  included in the recipients list.
                </p>
              )}
            </Col>
            <Form.Label column sm="2">
              Subject :
            </Form.Label>
            <Col sm="10">
              <Form.Control
                style={form_control_style}
                maxLength="200"
                onChange={(e) => {
                  setSubject(e.target.value);
                }}
                value={subject}
              />
            </Col>
            <Form.Label column sm="2">
              Attached :
            </Form.Label>
            <Col sm="10">
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Control
                  type="file"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                  }}
                />
              </Form.Group>
            </Col>
            <Form.Label column sm="2">
              Email Body :
            </Form.Label>
            <Col sm="10" style={{ maxWidth: 1000 }}>
              <Editor
                apiKey="gbn17r35npt722cfkbjivwssdep33fkit1sa1zg7976rhjzc"
                value={body}
                onEditorChange={(e) => {
                  setBody(e);
                }}
                init={{
                  height: 600,
                  menubar: false,
                  skin: "snow",
                  plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount",
                  ],
                  toolbar:
                    "undo redo | formatselect | " +
                    "bold italic backcolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
              />
            </Col>
          </Form.Group>
          <br />
          <label>
            <Form.Check
              name={"select_all"}
              onChange={() => {
                setSelectAllPOIS(!selectAllPOIS);
                toggleAll();
              }}
              type={"checkbox"}
              checked={selectAllPOIS}
            />
          </label>
          <b>Select All Email recipients</b>
          <br />
          {sortedResults.filter((result) => result.type === "Coach Operators")
            .length > 0 ? (
            <>
              <hr /> <b style={{ fontSize: 30 }}>
                Coach Operators
              </b> <hr /> {renderMailAddressesUL(sortedResults)}
            </>
          ) : (
            ""
          )}

          {sortedResults.filter(
            (result) => result.type === "Cruising Companies"
          ).length > 0 ? (
            <>
              <hr /> <b style={{ fontSize: 30 }}>
                Cruising Companies
              </b> <hr /> {renderMailAddressesUL(sortedResults)}
            </>
          ) : (
            ""
          )}

          {sortedResults.filter(
            (result) => result.type === "Ferry Ticket Agencies"
          ).length > 0 ? (
            <>
              <hr /> <b style={{ fontSize: 30 }}>
                Ferry Ticket Agencies
              </b>
              <hr /> {renderMailAddressesUL(sortedResults)}
            </>
          ) : (
            ""
          )}

          {sortedResults.filter((result) => result.type === "DMCs").length >
          0 ? (
            <>
              <hr /> <b style={{ fontSize: 30 }}> DMCs </b> <hr />
              {renderMailAddressesUL(sortedResults)}
            </>
          ) : (
            ""
          )}

          {sortedResults.filter((result) => result.type === "Hotels").length >
          0 ? (
            <>
              <hr /> <b style={{ fontSize: 30 }}> Hotels </b> <hr />
              {renderMailAddressesUL(sortedResults)}
            </>
          ) : (
            ""
          )}

          {sortedResults.filter((result) => result.type === "Parking Lots")
            .length > 0 ? (
            <>
              <hr /> <b style={{ fontSize: 30 }}> Parking Lots </b> <hr />
              {renderMailAddressesUL(sortedResults)}
            </>
          ) : (
            ""
          )}

          {sortedResults.filter((result) => result.type === "Repair Shops")
            .length > 0 ? (
            <>
              <hr /> <b style={{ fontSize: 30 }}> Repair Shops </b> <hr />
              {renderMailAddressesUL(sortedResults)}
            </>
          ) : (
            ""
          )}

          {sortedResults.filter((result) => result.type === "Restaurants")
            .length > 0 ? (
            <>
              <hr /> <b style={{ fontSize: 30 }}> Restaurants </b> <hr />
              {renderMailAddressesUL(sortedResults)}
            </>
          ) : (
            ""
          )}

          {sortedResults.filter(
            (result) => result.type === "Sport Event Suppliers"
          ).length > 0 ? (
            <>
              <hr /> <b style={{ fontSize: 30 }}>
                Sport Event Suppliers
              </b>
              <hr /> {renderMailAddressesUL(sortedResults)}
            </>
          ) : (
            ""
          )}

          {sortedResults.filter(
            (result) => result.type === "Teleferik Companies"
          ).length > 0 ? (
            <>
              <hr /> <b style={{ fontSize: 30 }}> Teleferik Companies </b>
              <hr /> {renderMailAddressesUL(sortedResults)}
            </>
          ) : (
            ""
          )}

          {sortedResults.filter((result) => result.type === "Theaters").length >
          0 ? (
            <>
              <hr /> <b style={{ fontSize: 30 }}> Theaters </b> <hr />
              {renderMailAddressesUL(sortedResults)}
            </>
          ) : (
            ""
          )}

          {sortedResults.filter(
            (result) => result.type === "Train Ticket Agencies"
          ).length > 0 ? (
            <>
              <hr /> <b style={{ fontSize: 30 }}>
                Train Ticket Agencies
              </b>
              <hr /> {renderMailAddressesUL(sortedResults)}
            </>
          ) : (
            ""
          )}

          {props.pois.length > 0 ? (
            <>
              <hr />
              <b style={{ fontSize: 30 }}>Points of interest: </b>
              <hr />
              {renderMailAddressesUL(props.pois)}
            </>
          ) : (
            ""
          )}
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            Your email will be included in the recipients list.
          </small>
          <Button
            color="red"
            onClick={() => {
              handleClose();
              setSubject();
              setFile();
              setBody();
              setSelectAllPOIS(false);
              setAllPOIS({});
            }}
          >
            <ImCross /> Cancel
          </Button>
          <Button
            color="green"
            key={all_pois}
            disabled={
              !Object.values(all_pois).includes(true) && recipients.length < 4
            }
            onClick={() => {
              handleClose();
              send();
            }}
          >
            <BiMailSend /> Send
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SendMassiveEmail;
