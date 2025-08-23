// Built-ins
import { useState } from "react";

// Icons / Images
import { BiPlus } from "react-icons/bi";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Col, Form, Row } from "react-bootstrap";
import { Button, Checkbox } from "semantic-ui-react";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

let warningStyle = {
  fontSize: 18,
  marginRight: 6,
};

let checkStyle = {
  fontSize: 18,
  marginRight: 6,
};

const allowAlpha = (value) => {
  return value.replace(/[^\w\s.\-/&\u4e00-\u9eff]{1,20}$/g, "");
};

const ADD_AIRLINE = "http://localhost:8000/api/view/add_airline/";

function AddAirlineModal(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [Name, setName] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  let [addPaymentDetails, setAddPaymentDetails] = useState(false);

  const [company, setCompany] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [iban, setIban] = useState("");
  const [swift, setSwift] = useState("");

  const handleCheckBox = () => {
    setAddPaymentDetails(!addPaymentDetails);
  };

  const createNewAirline = () => {
    axios({
      method: "post",
      url: ADD_AIRLINE,
      headers: headers,
      data: {
        name: Name,
        abbreviation: abbreviation,
        company: company,
        currency: currency,
        iban: iban,
        swift: swift,
      },
    })
      .then((res) => {
        if (props.redir) {
          window.location.href =
            "/data_management/airline/" + res.data.new_airline_id;
        } else {
          props.set_airline(Name + ", " + abbreviation);
          props.set_abbr(abbreviation);
        }
      })

      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: e.response.data.errormsg,
        });
      });
  };

  return (
    <>
      <Button
        color="green"
        style={{ margin: 20 }}
        onClick={() => {
          handleShow();
          setName("");
          setAbbreviation("");
          setAddPaymentDetails(false);
        }}
      >
        <BiPlus
          style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }}
        />
        Create new Airline
      </Button>
      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title> Create new Airline </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="justify-content-md-center">
            <Col>
              <Form>
                <Form.Group>
                  <Form.Label>Name:</Form.Label>
                  <Form.Control
                    maxLength="200"
                    style={{ width: 400 }}
                    onChange={(e) =>
                      setName(allowAlpha(e.currentTarget.value.toUpperCase()))
                    }
                    value={Name}
                  />
                  <Form.Label>Abbreviation:</Form.Label>
                  <Form.Control
                    maxLength="3"
                    style={{ width: 400 }}
                    onChange={(e) => {
                      setAbbreviation(e.target.value.toUpperCase());
                    }}
                    value={abbreviation}
                  />
                  <div style={{ marginTop: 10 }}>
                    <Checkbox
                      label={"Add Payment Details?"}
                      value={addPaymentDetails}
                      onChange={handleCheckBox}
                    />
                  </div>
                  {addPaymentDetails ? (
                    <>
                      <Form.Label>Company:</Form.Label>
                      <Form.Control
                        maxLength="255"
                        onChange={(e) => setCompany(e.currentTarget.value)}
                        value={company}
                      />
                      <Form.Label>Currency:</Form.Label>
                      <select
                        className="form-control"
                        onChange={(e) => setCurrency(e.target.value)}
                        style={{ marginBottom: 10, width: "40%" }}
                      >
                        <option value="EUR"> € Euro (EUR) </option>
                        <option value="GBP"> £ Pound Sterling (GBP) </option>
                        <option value="USD"> $ US Dollar (USD) </option>
                        <option value="CAD"> $ Canadian Dollar (CAD) </option>
                        <option value="AUD"> $ Australian Dollar (AUD) </option>
                        <option value="CHF"> ₣ Swiss Franc (CHF) </option>
                        <option value="JPY"> ¥ Japanese Yen (JPY) </option>
                        <option value="NZD">
                          $ New Zealand Dollar (NZD)
                        </option>
                        <option value="CNY"> ¥ Chinese Yuan (CNY) </option>
                        <option value="SGD"> $ Singapore Dollar (SGD) </option>
                      </select>
                      <Form.Label>
                        {currency === "GBP" ? "Account Number" : "IBAN"} :
                      </Form.Label>
                      <Form.Control
                        maxLength="50"
                        onChange={(e) =>
                          setIban(e.currentTarget.value.toUpperCase())
                        }
                        value={iban}
                      />
                      <Form.Label>
                        {currency === "GBP" ? "Sort Code" : "Swift"} :
                      </Form.Label>
                      <Form.Control
                        maxLength="50"
                        onChange={(e) =>
                          setSwift(e.currentTarget.value.toUpperCase())
                        }
                        value={swift}
                      />
                    </>
                  ) : (
                    ""
                  )}
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {Name.length === 0 ||
            abbreviation.length === 0 ||
            (addPaymentDetails && !iban) ||
            (addPaymentDetails && !swift) ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {Name.length === 0 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Fill The Name Field.
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {abbreviation.length === 0 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Fill The
                        Abbreviation Field.
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {addPaymentDetails && !iban ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Payment
                        Details must include an IBAN or Account Number.
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {addPaymentDetails && !swift ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Payment
                        Details must include either sort code or Swift.
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                </ul>
              </>
            ) : (
              <>
                <ul
                  className="mr-auto"
                  style={{
                    margin: 0,
                    padding: 0,
                    marginTop: 10,
                    color: "green",
                  }}
                >
                  <li>
                    <AiOutlineCheckCircle style={checkStyle} /> Validated
                  </li>
                </ul>
              </>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              createNewAirline();
            }}
            disabled={
              Name.length === 0 ||
              abbreviation.length === 0 ||
              (addPaymentDetails && !iban) ||
              (addPaymentDetails && !swift)
            }
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddAirlineModal;
