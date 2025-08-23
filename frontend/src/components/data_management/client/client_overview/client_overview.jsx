// Built-ins
import React from "react";

// Icons / Images
import { BsInfoSquare } from "react-icons/bs";
import { MdCreditCard } from "react-icons/md";
import { FaFlag, FaHashtag, FaCheck } from "react-icons/fa";
import { FaAddressCard } from "react-icons/fa";
import { BsFillTelephoneFill } from "react-icons/bs";
import { MdAlternateEmail } from "react-icons/md";
import { MdOutlineImage } from "react-icons/md";
import { IoMdBarcode } from "react-icons/io";
import { ImCross } from "react-icons/im";
import { FaMinus } from "react-icons/fa";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { BsMailbox } from "react-icons/bs";
import { GiConvergenceTarget } from "react-icons/gi";
import { IoMdBusiness } from "react-icons/io";

// Functions / modules
import axios from "axios";
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import ReactCountryFlag from "react-country-flag";
import Swal from "sweetalert2";

// Custom Made Components
import ChangeName from "../../../modals/change_name";
import ChangeAddress from "../../../modals/change_address";
import ChangeEmail from "../../../modals/change_email";
import ChangeEnabled from "../../../modals/change_enabled";
import ChangeAbbreviation from "../../../modals/change_abbreviation";
import ChangeCountry from "../../../modals/change_country";
import ChangeTel from "../../../modals/change_tel";
import DeleteObjectModal from "../../../modals/delete_object";
import EditPaymentDetails from "../../../modals/edit_payment_details";
import Notes from "../../../core/notes/notes";
import ContactPersons from "../../../core/contact_persons/contact_persons";
import ChangeAddress2 from "../../../modals/change_address2";
import ChangePostal from "../../../modals/change_postal";
import ChangeRegion from "../../../modals/change_region";

// Global Variables
import {
  headers,
  loader,
  pageHeader,
  iconStyle,
  forbidden,
  restrictedUsers,
} from "../../../global_vars";

// Variables
const VIEW_CLIENT = "http://localhost:8000/api/data_management/client/";

function getClientId() {
  return window.location.pathname.split("/")[3];
}

// Variables
window.Swal = Swal;

let overviewIconStyle = { color: "#F3702D", marginRight: "0.5em" };

class ClientOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      client: {
        notes: [],
      },
      contact_persons: [],
      is_loaded: false,
      forbidden: false,
      show_tel2: false,
      show_address2: false,
    };
  }

  componentDidMount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_CLIENT + getClientId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          client: res.data.client,
          notes: res.data.client.notes,
          contact_persons: res.data.client.contact_persons,
          is_loaded: true,
        });
      })
      .catch((e) => {
        if (e.response.status === 401) {
          this.setState({
            forbidden: true,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An unknown error has occured.",
          });
        }
      });
  }

  update_state = (update_state) => {
    this.setState({ client: update_state });
  };

  update_notes = (notes) => {
    var client = { ...this.state.client };
    client.notes = notes;
    this.setState({
      client: client,
    });
  };

  add_contact_person = (contact_persons) => {
    var client = { ...this.state.client };
    client.contact_persons = contact_persons;
    this.setState({
      client: client,
      contact_persons: contact_persons,
    });
  };

  render() {
    console.log(this.state.client)
    return (
      <>
        <div className="mainContainer">
          {pageHeader("client_overview", this.state.client.name)}
          {this.state.forbidden ? (
            <>{forbidden("Client Overview")}</>
          ) : this.state.is_loaded ? (
            <>
              <Grid columns={2} divided stackable>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <BsInfoSquare style={iconStyle} />
                      Client Information
                    </Card.Header>
                    <Card.Body>
                      <div className={"info_descr"}>
                        <FaHashtag style={overviewIconStyle} /> Name
                      </div>
                      <div className={"info_span"}>
                        {this.state.client.name ? this.state.client.name : "N/A"}
                      </div>
                      <ChangeName
                        object_id={this.state.client.id}
                        object_name={this.state.client.name}
                        object_type={"Client"}
                        update_state={this.update_state}
                      />

                      <div className={"info_descr"}> <IoMdBusiness style={overviewIconStyle} /> Company </div>
                      <div className={"info_span"}>
                        {this.state.client.payment_details
                          ? this.state.client.payment_details.company === "" ||
                            this.state.client.payment_details.company === null
                            ? "N/A"
                            : 
                            <span style={{color: this.state.client.payment_details.company === this.state.client.name ? 'blue': ''}}>
                              {this.state.client.payment_details.company}
                            </span>
                          : "N/A"}
                      </div>

                      <div className={"info_descr"}>
                        <FaAddressCard style={overviewIconStyle} /> Address
                      </div>
                      <div className={"info_span"}>
                        {this.state.client.contact.address
                          ? this.state.client.contact.address
                          : "N/A"}
                      </div>
                      <ChangeAddress
                        object_id={this.state.client.id}
                        object_name={this.state.client.name}
                        object_type={"Client"}
                        update_state={this.update_state}
                        address={
                          this.state.client.contact.address
                            ? this.state.client.contact.address
                            : "N/A"
                        }
                      />

                      {this.state.show_address2 ? (
                        <>
                          <div className={"info_descr"}>
                            <FaAddressCard style={overviewIconStyle} /> Address
                            2
                          </div>
                          <div className={"info_span"}>
                            {this.state.client.contact.address2
                              ? this.state.client.contact.address2
                              : "N/A"}
                          </div>
                          <FaMinus
                            className="minus-icon"
                            title="Hide address 2"
                            style={{ marginLeft: 20 }}
                            onClick={() =>
                              this.setState({ show_address2: false })
                            }
                          />
                          <ChangeAddress2
                            object_id={this.state.client.id}
                            object_name={this.state.client.name}
                            object_type={"Client"}
                            update_state={this.update_state}
                            address={
                              this.state.client.contact.address2
                                ? this.state.client.contact.address2
                                : "N/A"
                            }
                          />
                        </>
                      ) : (
                        <>
                          <AiOutlinePlusSquare
                            className="plus-icon"
                            title="Show Address 2"
                            style={{ marginLeft: 20 }}
                            onClick={() =>
                              this.setState({ show_address2: true })
                            }
                          />
                        </>
                      )}

                      <div className={"info_descr"}>
                        <BsFillTelephoneFill style={overviewIconStyle} /> Tel
                      </div>
                      <div className={"info_span"}>
                        {this.state.client.contact.tel
                          ? this.state.client.contact.tel
                          : "N/A"}
                      </div>
                      <ChangeTel
                        object_id={this.state.client.id}
                        object_name={this.state.client.name}
                        object_type={"Client"}
                        tel_num={"tel"}
                        update_state={this.update_state}
                        telephone={
                          this.state.client.contact.tel
                            ? this.state.client.contact.tel
                            : "N/A"
                        }
                      />
                      {this.state.show_tel2 ? (
                        <>
                          <div className={"info_descr"}>
                            <BsFillTelephoneFill style={overviewIconStyle} />
                            Tel. 2
                          </div>
                          <div className={"info_span"}>
                            {this.state.client.contact.tel2
                              ? this.state.client.contact.tel2
                              : "N/A"}
                          </div>

                          <ChangeTel
                            object_id={this.state.client.id}
                            object_name={this.state.client.name}
                            object_type={"Client"}
                            tel_num={"tel2"}
                            update_state={this.update_state}
                            telephone={
                              this.state.client.contact.tel2
                                ? this.state.client.contact.tel2
                                : "N/A"
                            }
                          />
                          <div className={"info_descr"}>
                            <BsFillTelephoneFill style={overviewIconStyle} />
                            Tel. 3
                          </div>
                          <div className={"info_span"}>
                            {this.state.client.contact.tel3
                              ? this.state.client.contact.tel3
                              : "N/A"}
                          </div>

                          <FaMinus
                            className="minus-icon"
                            title="Hide address 2"
                            style={{ marginLeft: 20 }}
                            onClick={() => this.setState({ show_tel2: false })}
                          />
                          <ChangeTel
                            object_id={this.state.client.id}
                            object_name={this.state.client.name}
                            object_type={"Client"}
                            tel_num={"tel3"}
                            update_state={this.update_state}
                            telephone={
                              this.state.client.contact.tel3
                                ? this.state.client.contact.tel3
                                : "N/A"
                            }
                          />
                        </>
                      ) : (
                        <>
                          <AiOutlinePlusSquare
                            className="plus-icon"
                            title="Show Tel 2"
                            style={{ marginLeft: 20 }}
                            onClick={() => this.setState({ show_tel2: true })}
                          />
                        </>
                      )}
                      <div className={"info_descr"}>
                        <BsMailbox style={overviewIconStyle} />
                        Postal / Zip code
                      </div>
                      <div className={"info_span"}>
                        {this.state.client.contact.postal ? this.state.client.contact.postal : "N/A"}
                      </div>
                      <ChangePostal
                        object_id={this.state.client.id}
                        object_name={this.state.client.name}
                        object_type={"Client"}
                        update_state={this.update_state}
                        postal={ this.state.client.contact.postal ? this.state.client.contact.postal : "N/A"}
                      />
                      <div className={"info_descr"}>
                        <MdAlternateEmail style={overviewIconStyle} /> Email
                      </div>
                      <div className={"info_span"}>
                        {this.state.client.contact.email ? this.state.client.contact.email : "N/A"}
                      </div>
                      <ChangeEmail
                        object_id={this.state.client.id}
                        object_name={this.state.client.name}
                        object_type={"Client"}
                        update_state={this.update_state}
                        email={this.state.client.contact.email ? this.state.client.contact.email : "N/A"}
                      />
                      <div className={"info_descr"}>
                        <GiConvergenceTarget style={overviewIconStyle} />
                        Region
                      </div>
                      <div className={"info_span"}>
                        {this.state.client.region ? this.state.client.region : 'N/A'}
                      </div>
                      <ChangeRegion
                        object_id={this.state.client.id}
                        object_name={this.state.client.name}
                        object_type={"Client"}
                        update_state={this.update_state}
                      />

                      <div className={"info_descr"}>
                        <MdOutlineImage style={overviewIconStyle} /> Icon
                      </div>
                      <div className={"info_span"}>
                        {this.state.client.icon ? (
                          <a href={"http://localhost:8000" + this.state.client.icon}>
                            <img src={"http://localhost:8000" + this.state.client.icon}
                              style={{ maxHeight: 35, maxWidth: 35 }}
                              alt="Caption"
                            />
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </div>
                      <div className={"info_descr"}>
                        <IoMdBarcode style={overviewIconStyle} />
                        Abbreviation
                      </div>
                      <div className={"info_span"}>
                        {this.state.client.abbreviation ? this.state.client.abbreviation : "N/A"}
                      </div>
                      <ChangeAbbreviation
                        object_id={this.state.client.id}
                        object_name={this.state.client.name}
                        object_type={"Client"}
                        update_state={this.update_state}
                        abbreviation={this.state.client.abbreviation ? this.state.client.abbreviation : "N/A"}
                      />
                      <div className={"info_descr"}>
                        <FaFlag style={overviewIconStyle} /> Client Nationality
                      </div>
                      <div className={"info_span"}>
                        {this.state.client.nationality ? (
                          <ReactCountryFlag
                            countryCode={this.state.client.nationality.code}
                            svg
                            style={{
                              width: "1.5em",
                              height: "1.5em",
                              marginRight: 10,
                            }}
                            title={this.state.client.nationality.code}
                          />
                        ) : null}
                        {this.state.client.nationality ? this.state.client.nationality.name : "N/A"}
                      </div>
                      <ChangeCountry
                        object_id={this.state.client.id}
                        object_name={this.state.client.name}
                        object_type={"Client"}
                        update_state={this.update_state}
                        country={this.state.client.nationality ? this.state.client.nationality : ""}
                      />

                      <ContactPersons
                        add_contact_person={this.add_contact_person}
                        object_id={this.state.client.id}
                        object_name={this.state.client.name}
                        object_type={"Client"}
                        update_state={this.update_state}
                        contact_persons={this.state.client.contact_persons}
                      />
                      <div className={"info_descr"}>
                        {this.state.client.enabled ? (
                          <FaCheck style={overviewIconStyle} />
                        ) : (
                          <ImCross style={overviewIconStyle} />
                        )}
                        Enabled
                      </div>
                      <div className={"info_span"}>
                        {this.state.client.enabled ? "Enabled" : "Disabled"}
                      </div>
                      <ChangeEnabled
                        object_id={this.state.client.id}
                        object_name={this.state.client.name}
                        object_type={"Client"}
                        update_state={this.update_state}
                      />
                    </Card.Body>
                    <Card.Footer>
                      <DeleteObjectModal
                        object_id={this.state.client.id}
                        object_name={this.state.client.name}
                        object_type={"Client"}
                        update_state={this.update_state}
                      />
                    </Card.Footer>
                  </Card>
                </Grid.Column>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <MdCreditCard style={iconStyle} />
                      Payment Details
                    </Card.Header>
                    <Card.Body>
                      <div className={"info_descr"}> Company </div>
                      <div className={"info_span"}>
                        {this.state.client.payment_details
                          ? this.state.client.payment_details.company === "" ||
                            this.state.client.payment_details.company === null
                            ? "N/A"
                            : this.state.client.payment_details.company
                          : "N/A"}
                      </div>
                      <div className={"info_descr"}> Currency </div>
                      <div className={"info_span"}>
                        {this.state.client.payment_details
                          ? this.state.client.payment_details.currency === "" ||
                            this.state.client.payment_details.currency === null
                            ? "N/A"
                            : this.state.client.payment_details.currency
                          : "N/A"}
                      </div>
                      <div className={"info_descr"}>
                        {this.state.client.payment_details.currency === "GBP"
                          ? "Account Number"
                          : "IBAN"}
                      </div>
                      <div className={"info_span"}>
                        {this.state.client.payment_details
                          ? this.state.client.payment_details.iban === "" ||
                            this.state.client.payment_details.iban === null
                            ? "N/A"
                            : this.state.client.payment_details.iban
                          : "N/A"}
                      </div>
                      <div className={"info_descr"}>
                        {this.state.client.payment_details.currency === "GBP"
                          ? "Sort Code"
                          : "Swift"}
                      </div>
                      <div className={"info_span"}>
                        {this.state.client.payment_details
                          ? this.state.client.payment_details.swift === "" ||
                            this.state.client.payment_details.swift === null
                            ? "N/A"
                            : this.state.client.payment_details.swift
                          : "N/A"}
                      </div>
                    </Card.Body>
                    <Card.Footer>
                      <EditPaymentDetails
                        object_id={this.state.client.id}
                        object_name={this.state.client.name}
                        object_type={"Client"}
                        update_state={this.update_state}
                        payment_details={this.state.client.payment_details}
                      />
                    </Card.Footer>
                  </Card>
                  <Notes
                    update_notes={this.update_notes}
                    object_id={this.state.client.id}
                    object_name={this.state.client.name}
                    object_type={"Client"}
                    update_state={this.update_state}
                    notes={this.state.client.notes}
                  />
                </Grid.Column>
              </Grid>
            </>
          ) : (
            loader()
          )}
        </div>
      </>
    );
  }
}

export default ClientOverView;
