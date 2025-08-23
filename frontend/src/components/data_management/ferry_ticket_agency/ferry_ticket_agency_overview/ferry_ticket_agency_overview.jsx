// Built-ins
import React from "react";

// Modules / Functions
import axios from "axios";
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import Swal from "sweetalert2";

// Icons / Images
import { BsInfoSquare } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdCreditCard } from "react-icons/md";
import { FaMinus } from "react-icons/fa";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { GiConvergenceTarget } from "react-icons/gi";
import { BsMailbox } from "react-icons/bs";
import { FaHashtag, FaCheck, FaGlobe } from "react-icons/fa";
import { FaAddressCard } from "react-icons/fa";
import { BsFillTelephoneFill } from "react-icons/bs";
import { MdAlternateEmail } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { IoMdBusiness } from "react-icons/io";

// Custom Made Components
import ChangeName from "../../../modals/change_name";
import ChangeAddress from "../../../modals/change_address";
import ChangeEmail from "../../../modals/change_email";
import ChangeTel from "../../../modals/change_tel";
import ChangeWebsite from "../../../modals/change_website";
import ChangeLatLng from "../../../modals/change_lat_lng";
import GoogleMap from "../../../core/map/map";
import ChangeEnabled from "../../../modals/change_enabled";
import DeleteObjectModal from "../../../modals/delete_object";
import EditPaymentDetails from "../../../modals/edit_payment_details";
import ContactPersons from "../../../core/contact_persons/contact_persons";
import ChangeAddress2 from "../../../modals/change_address2";
import ChangePostal from "../../../modals/change_postal";
import ChangeRegion from "../../../modals/change_region";

// Global Variables
import {
  headers,
  loader,
  pageHeader,
  forbidden,
  restrictedUsers,
  iconStyle,
} from "../../../global_vars";

// Variables
window.Swal = Swal;

const VIEW_FERRY_TICKET_AGENCY =
  "http://localhost:8000/api/data_management/ferry_ticket_agency/";

function getFerryTicketAgencyId() {
  return window.location.pathname.split("/")[3];
}

let overviewIconStyle = { color: "#F3702D", marginRight: "0.5em" };

class FerryTicketAgencyOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ferry_ticket_agency: {},
      notes: [],
      contact_persons: [],
      is_loaded: false,
      forbidden: false,
      show_tel2: false,
      show_address2: false,
    };
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_FERRY_TICKET_AGENCY + getFerryTicketAgencyId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          ferry_ticket_agency: res.data.ferry_ticket_agency,
          notes: res.data.ferry_ticket_agency.notes,
          contact_persons: res.data.ferry_ticket_agency.contact_persons,
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
    this.setState({ ferry_ticket_agency: update_state });
  };

  refresh = () => {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_FERRY_TICKET_AGENCY + getFerryTicketAgencyId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          ferry_ticket_agency: res.data.ferry_ticket_agency,
          is_loaded: true,
        });
      });
  };

  update_ferry_ticket_agency = (ferry_ticket_agency) => {
    this.setState({ ferry_ticket_agency: ferry_ticket_agency });
  };

  add_contact_person = (contact_persons) => {
    var ferry_ticket_agency = { ...this.state.ferry_ticket_agency };
    ferry_ticket_agency.contact_persons = contact_persons;
    this.setState({
      ferry_ticket_agency: ferry_ticket_agency,
      contact_persons: contact_persons,
    });
  };

  render() {
    return (
      <>
        <div className="mainContainer">
          {pageHeader(
            "ferry_ticket_agency_overview",
            this.state.ferry_ticket_agency.name
          )}
          {this.state.forbidden ? (
            <>{forbidden("All Ferry Ticket Agencies")}</>
          ) : this.state.is_loaded ? (
            <>
              <Grid stackable columns={2} divided>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <BsInfoSquare
                        style={{
                          color: "#F3702D",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      Ferry Ticket Agency Information
                    </Card.Header>
                    <Card.Body>
                      <div className={"info_descr"}>
                        <FaHashtag style={overviewIconStyle} /> Name
                      </div>
                      <div className={"info_span"}>
                        {this.state.ferry_ticket_agency.name
                          ? this.state.ferry_ticket_agency.name
                          : "N/A"}
                      </div>

                      <ChangeName
                        object_id={this.state.ferry_ticket_agency.id}
                        object_name={this.state.ferry_ticket_agency.name}
                        object_type={"Ferry Ticket Agency"}
                        update_state={this.update_state}
                      />

                      <div className={"info_descr"}> <IoMdBusiness style={overviewIconStyle} /> Company </div>
                      <div className={"info_span"}>
                        {this.state.ferry_ticket_agency.payment_details
                          ? this.state.ferry_ticket_agency.payment_details.company === "" ||
                            this.state.ferry_ticket_agency.payment_details.company === null
                            ? "N/A"
                            : 
                            <span style={{color: this.state.ferry_ticket_agency.payment_details.company === this.state.ferry_ticket_agency.name ? 'blue': ''}}>
                              {this.state.ferry_ticket_agency.payment_details.company}
                            </span>
                          : "N/A"}
                      </div>

                      <div className={"info_descr"}>
                        <FaAddressCard style={overviewIconStyle} /> Address
                      </div>
                      <div className={"info_span"}>
                        {this.state.ferry_ticket_agency.contact.address
                          ? this.state.ferry_ticket_agency.contact.address
                          : "N/A"}
                      </div>
                      <ChangeAddress
                        object_id={this.state.ferry_ticket_agency.id}
                        object_name={this.state.ferry_ticket_agency.name}
                        object_type={"Ferry Ticket Agency"}
                        update_state={this.update_state}
                        address={
                          this.state.ferry_ticket_agency.contact.address
                            ? this.state.ferry_ticket_agency.contact.address
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
                            {this.state.ferry_ticket_agency.contact.address2
                              ? this.state.ferry_ticket_agency.contact.address2
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
                            object_id={this.state.ferry_ticket_agency.id}
                            object_name={this.state.ferry_ticket_agency.name}
                            object_type={"Ferry Ticket Agency"}
                            update_state={this.update_state}
                            address={
                              this.state.ferry_ticket_agency.contact.address2
                                ? this.state.ferry_ticket_agency.contact
                                    .address2
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
                        {this.state.ferry_ticket_agency.contact.tel
                          ? this.state.ferry_ticket_agency.contact.tel
                          : "N/A"}
                      </div>
                      <ChangeTel
                        object_id={this.state.ferry_ticket_agency.id}
                        object_name={this.state.ferry_ticket_agency.name}
                        object_type={"Ferry Ticket Agency"}
                        tel_num={"tel"}
                        update_state={this.update_state}
                        telephone={
                          this.state.ferry_ticket_agency.contact.tel
                            ? this.state.ferry_ticket_agency.contact.tel
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
                            {this.state.ferry_ticket_agency.contact.tel2
                              ? this.state.ferry_ticket_agency.contact.tel2
                              : "N/A"}
                          </div>

                          <ChangeTel
                            object_id={this.state.ferry_ticket_agency.id}
                            object_name={this.state.ferry_ticket_agency.name}
                            object_type={"Ferry Ticket Agency"}
                            tel_num={"tel2"}
                            update_state={this.update_state}
                            telephone={
                              this.state.ferry_ticket_agency.contact.tel2
                                ? this.state.ferry_ticket_agency.contact.tel2
                                : "N/A"
                            }
                          />
                          <div className={"info_descr"}>
                            <BsFillTelephoneFill style={overviewIconStyle} />
                            Tel. 3
                          </div>
                          <div className={"info_span"}>
                            {this.state.ferry_ticket_agency.contact.tel3
                              ? this.state.ferry_ticket_agency.contact.tel3
                              : "N/A"}
                          </div>

                          <FaMinus
                            className="minus-icon"
                            title="Hide address 2"
                            style={{ marginLeft: 20 }}
                            onClick={() => this.setState({ show_tel2: false })}
                          />

                          <ChangeTel
                            object_id={this.state.ferry_ticket_agency.id}
                            object_name={this.state.ferry_ticket_agency.name}
                            object_type={"Ferry Ticket Agency"}
                            tel_num={"tel3"}
                            update_state={this.update_state}
                            telephone={
                              this.state.ferry_ticket_agency.contact.tel3
                                ? this.state.ferry_ticket_agency.contact.tel3
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
                        <GiConvergenceTarget style={overviewIconStyle} /> Region
                      </div>

                      <div className={"info_span"}>
                        {this.state.ferry_ticket_agency.region ? this.state.ferry_ticket_agency.region : 'N/A'}
                      </div>

                      <ChangeRegion
                        object_id={this.state.ferry_ticket_agency.id}
                        object_name={this.state.ferry_ticket_agency.name}
                        object_type={"Ferry Ticket Agency"}
                        update_state={this.update_state}
                      />

                      <div className={"info_descr"}>
                        <BsMailbox style={overviewIconStyle} />
                        Postal / Zip code
                      </div>
                      <div className={"info_span"}>
                        {this.state.ferry_ticket_agency.contact.postal
                          ? this.state.ferry_ticket_agency.contact.postal
                          : "N/A"}
                      </div>
                      <ChangePostal
                        object_id={this.state.ferry_ticket_agency.id}
                        object_name={this.state.ferry_ticket_agency.name}
                        object_type={"Ferry Ticket Agency"}
                        update_state={this.update_state}
                        postal={
                          this.state.ferry_ticket_agency.contact.postal
                            ? this.state.ferry_ticket_agency.contact.postal
                            : "N/A"
                        }
                      />
                      <div className={"info_descr"}>
                        <MdAlternateEmail style={overviewIconStyle} />
                        Email
                      </div>
                      <div className={"info_span"}>
                        {this.state.ferry_ticket_agency.contact.email
                          ? this.state.ferry_ticket_agency.contact.email
                          : "N/A"}
                      </div>
                      <ChangeEmail
                        object_id={this.state.ferry_ticket_agency.id}
                        object_name={this.state.ferry_ticket_agency.name}
                        object_type={"Ferry Ticket Agency"}
                        update_state={this.update_state}
                        email={
                          this.state.ferry_ticket_agency.contact.email
                            ? this.state.ferry_ticket_agency.contact.email
                            : "N/A"
                        }
                      />
                      <div className={"info_descr"}>
                        <FaGlobe style={overviewIconStyle} /> Website
                      </div>
                      <div className={"info_span"}>
                        {this.state.ferry_ticket_agency.contact.website
                          ? this.state.ferry_ticket_agency.contact.website
                          : "N/A"}
                      </div>
                      <ChangeWebsite
                        object_id={this.state.ferry_ticket_agency.id}
                        object_name={this.state.ferry_ticket_agency.name}
                        object_type={"Ferry Ticket Agency"}
                        update_state={this.update_state}
                        website={
                          this.state.ferry_ticket_agency.contact.website
                            ? this.state.ferry_ticket_agency.contact.website
                            : "N/A"
                        }
                      />
                      <div className={"info_descr"}>
                        <FaMapMarkerAlt style={overviewIconStyle} />
                        Lat / Lng
                      </div>
                      <ChangeLatLng
                        object_id={this.state.ferry_ticket_agency.id}
                        object_name={this.state.ferry_ticket_agency.name}
                        object_type={"Ferry Ticket Agency"}
                        update_state={this.update_state}
                        lat={this.state.ferry_ticket_agency.lat}
                        lng={this.state.ferry_ticket_agency.lng}
                      />
                      <div className={"lat_lng_span"}>
                        {this.state.ferry_ticket_agency.lat
                          ? this.state.ferry_ticket_agency.lat
                          : "N/A"}
                      </div>
                      <div
                        style={{ marginLeft: 35 }}
                        className={"lat_lng_span"}
                      >
                        {this.state.ferry_ticket_agency.lng
                          ? this.state.ferry_ticket_agency.lng
                          : "N/A"}
                      </div>

                      <ContactPersons
                        add_contact_person={this.add_contact_person}
                        object_id={this.state.ferry_ticket_agency.id}
                        object_name={this.state.ferry_ticket_agency.name}
                        object_type={"Ferry Ticket Agency"}
                        update_state={this.update_state}
                        contact_persons={
                          this.state.ferry_ticket_agency.contact_persons
                        }
                      />
                      <div className={"info_descr"}>
                        {this.state.ferry_ticket_agency.enabled ? (
                          <FaCheck style={overviewIconStyle} />
                        ) : (
                          <ImCross style={overviewIconStyle} />
                        )}
                        Enabled
                      </div>
                      <div className={"info_span"}>
                        {this.state.ferry_ticket_agency.enabled
                          ? "Enabled"
                          : "Disabled"}
                      </div>
                      <ChangeEnabled
                        object_id={this.state.ferry_ticket_agency.id}
                        object_name={this.state.ferry_ticket_agency.name}
                        object_type={"Ferry Ticket Agency"}
                        update_state={this.update_state}
                      />
                    </Card.Body>
                    <Card.Footer>
                      <DeleteObjectModal
                        object_id={this.state.ferry_ticket_agency.id}
                        object_name={this.state.ferry_ticket_agency.name}
                        object_type={"Ferry Ticket Agency"}
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
                        {this.state.ferry_ticket_agency.payment_details
                          ? this.state.ferry_ticket_agency.payment_details
                              .company === "" ||
                            this.state.ferry_ticket_agency.payment_details
                              .company === null
                            ? "N/A"
                            : this.state.ferry_ticket_agency.payment_details
                                .company
                          : "N/A"}
                      </div>
                      <div className={"info_descr"}> Currency </div>
                      <div className={"info_span"}>
                        {this.state.ferry_ticket_agency.payment_details
                          ? this.state.ferry_ticket_agency.payment_details
                              .currency === "" ||
                            this.state.ferry_ticket_agency.payment_details
                              .currency === null
                            ? "N/A"
                            : this.state.ferry_ticket_agency.payment_details
                                .currency
                          : "N/A"}
                      </div>
                      <div className={"info_descr"}>
                        {this.state.ferry_ticket_agency.payment_details
                          .currency === "GBP"
                          ? "Account Number"
                          : "IBAN"}
                      </div>
                      <div className={"info_span"}>
                        {this.state.ferry_ticket_agency.payment_details
                          ? this.state.ferry_ticket_agency.payment_details
                              .iban === "" ||
                            this.state.ferry_ticket_agency.payment_details
                              .iban === null
                            ? "N/A"
                            : this.state.ferry_ticket_agency.payment_details
                                .iban
                          : "N/A"}
                      </div>
                      <div className={"info_descr"}>
                        {this.state.ferry_ticket_agency.payment_details
                          .currency === "GBP"
                          ? "Sort Code"
                          : "Swift"}
                      </div>
                      <div className={"info_span"}>
                        {this.state.ferry_ticket_agency.payment_details
                          ? this.state.ferry_ticket_agency.payment_details
                              .swift === "" ||
                            this.state.ferry_ticket_agency.payment_details
                              .swift === null
                            ? "N/A"
                            : this.state.ferry_ticket_agency.payment_details
                                .swift
                          : "N/A"}
                      </div>
                    </Card.Body>
                    <Card.Footer>
                      <EditPaymentDetails
                        object_id={this.state.ferry_ticket_agency.id}
                        object_name={this.state.ferry_ticket_agency.name}
                        object_type={"Ferry Ticket Agency"}
                        update_state={this.update_state}
                        payment_details={
                          this.state.ferry_ticket_agency.payment_details
                        }
                      />
                    </Card.Footer>
                  </Card>
                  <Card>
                    <Card.Header>
                      <FaMapMarkerAlt
                        style={{
                          color: "#F3702D",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      Map with shipping agency's location
                    </Card.Header>
                    {this.state.ferry_ticket_agency.lat ||
                    this.state.ferry_ticket_agency.lng ? (
                      <>
                        <Card.Body>
                          <GoogleMap object={this.state.ferry_ticket_agency} />
                        </Card.Body>
                      </>
                    ) : (
                      <strong
                        style={{
                          textAlign: "center",
                          margin: 20,
                          padding: 20,
                        }}
                      >
                        Update latitude / longitude to show shipping agency's
                        location on map
                      </strong>
                    )}
                    <Card.Footer>
                      <small className="mr-auto">
                        <BsInfoSquare
                          style={{
                            color: "#F3702D",
                            fontSize: "1.5em",
                            marginRight: "0.5em",
                          }}
                        />
                        Changing shipping agency's lat/lng will also change the
                        map's pin
                      </small>
                    </Card.Footer>
                  </Card>
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

export default FerryTicketAgencyOverView;
