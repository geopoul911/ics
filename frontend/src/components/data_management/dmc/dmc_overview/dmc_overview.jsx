// Built-ins
import React from "react";

// Modules / Functions
import axios from "axios";
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import ReactCountryFlag from "react-country-flag";
import Swal from "sweetalert2";

// Modals
import ChangeName from "../../../modals/change_name";
import ChangeAddress from "../../../modals/change_address";
import ChangeEmail from "../../../modals/change_email";
import ChangeTel from "../../../modals/change_tel";
import ChangeWebsite from "../../../modals/change_website";
import ChangeLatLng from "../../../modals/change_lat_lng";
import GoogleMap from "../../../core/map/map";
import ChangeEnabled from "../../../modals/change_enabled";
import DeleteObjectModal from "../../../modals/delete_object";
import ChangeLanguage from "../../../modals/dmcs/change_languages";
import EditPaymentDetails from "../../../modals/edit_payment_details";
import ContactPersons from "../../../core/contact_persons/contact_persons";
import ChangeAddress2 from "../../../modals/change_address2";
import ChangePostal from "../../../modals/change_postal";
import ChangeRegion from "../../../modals/change_region";
import Notes from "../../../core/notes/notes";

// Icons / Images
import { FaMapMarkerAlt } from "react-icons/fa";
import { BsInfoSquare } from "react-icons/bs";
import { MdCreditCard } from "react-icons/md";
import { FaMinus } from "react-icons/fa";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { GiConvergenceTarget } from "react-icons/gi";
import { BsMailbox } from "react-icons/bs";
import { IoMdBusiness } from "react-icons/io";
import { FaGlobe, FaHashtag, FaCheck, FaFlag } from "react-icons/fa";
import { FaAddressCard } from "react-icons/fa";
import { BsFillTelephoneFill } from "react-icons/bs";
import { MdAlternateEmail } from "react-icons/md";
import { ImCross } from "react-icons/im";

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

let overviewIconStyle = { color: "#F3702D", marginRight: "0.5em" };

const VIEW_DMC = "http://localhost:8000/api/data_management/dmc/";

function getDMCId() {
  return window.location.pathname.split("/")[3];
}

class DMCOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dmc: {},
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
      .get(VIEW_DMC + getDMCId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          dmc: res.data.dmc,
          notes: res.data.dmc.notes,
          contact_persons: res.data.dmc.contact_persons,
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
    this.setState({ dmc: update_state });
  };

  refresh = () => {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_DMC + getDMCId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          dmc: res.data.dmc,
          is_loaded: true,
        });
      });
  };

  update_dmc = (dmc) => {
    this.setState({ dmc: dmc });
  };

  add_contact_person = (contact_persons) => {
    var dmc = { ...this.state.dmc };
    dmc.contact_persons = contact_persons;
    this.setState({
      dmc: dmc,
      contact_persons: contact_persons,
    });
  };

  update_notes = (notes) => {
    var dmc = { ...this.state.dmc };
    dmc.notes = notes;
    this.setState({
      dmc: dmc,
    });
  };

  render() {
    return (
      <>
        <div className="mainContainer">
          {pageHeader("dmc_overview", this.state.dmc.name)}
          {this.state.forbidden ? (
            <>{forbidden("DMC Overview")}</>
          ) : this.state.is_loaded ? (
            <>
              <Grid stackable columns={2} divided>
                <Grid.Row style={{ marginLeft: 2 }}>
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
                        DMC Information
                      </Card.Header>
                      <Card.Body>
                        <div className={"info_descr"}>
                          <FaHashtag style={overviewIconStyle} /> Name
                        </div>
                        <div className={"info_span"}>
                          {this.state.dmc.name ? this.state.dmc.name : "N/A"}
                        </div>
                        <ChangeName
                          object_id={this.state.dmc.id}
                          object_name={this.state.dmc.name}
                          object_type={"DMC"}
                          update_state={this.update_state}
                        />
                        <div className={"info_descr"}> <IoMdBusiness style={overviewIconStyle} /> Company </div>
                        <div className={"info_span"}>
                          {this.state.dmc.payment_details
                            ? this.state.dmc.payment_details.company === "" ||
                              this.state.dmc.payment_details.company === null
                              ? "N/A"
                              : 
                              <span style={{color: this.state.dmc.payment_details.company === this.state.dmc.name ? 'blue': ''}}>
                                {this.state.dmc.payment_details.company}
                              </span>
                            : "N/A"}
                        </div>
                        <div className={"info_descr"}>
                          <FaAddressCard style={overviewIconStyle} /> Address
                        </div>
                        <div className={"info_span"}>
                          {this.state.dmc.contact.address
                            ? this.state.dmc.contact.address
                            : "N/A"}
                        </div>
                        <ChangeAddress
                          object_id={this.state.dmc.id}
                          object_name={this.state.dmc.name}
                          object_type={"DMC"}
                          update_state={this.update_state}
                          address={
                            this.state.dmc.contact.address
                              ? this.state.dmc.contact.address
                              : "N/A"
                          }
                        />

                        {this.state.show_address2 ? (
                          <>
                            <div className={"info_descr"}>
                              <FaAddressCard style={overviewIconStyle} />
                              Address 2
                            </div>
                            <div className={"info_span"}>
                              {this.state.dmc.contact.address2
                                ? this.state.dmc.contact.address2
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
                              object_id={this.state.dmc.id}
                              object_name={this.state.dmc.name}
                              object_type={"DMC"}
                              update_state={this.update_state}
                              address={
                                this.state.dmc.contact.address2
                                  ? this.state.dmc.contact.address2
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
                          {this.state.dmc.contact.tel
                            ? this.state.dmc.contact.tel
                            : "N/A"}
                        </div>
                        <ChangeTel
                          object_id={this.state.dmc.id}
                          object_name={this.state.dmc.name}
                          object_type={"DMC"}
                          tel_num={"tel"}
                          update_state={this.update_state}
                          telephone={
                            this.state.dmc.contact.tel
                              ? this.state.dmc.contact.tel
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
                              {this.state.dmc.contact.tel2
                                ? this.state.dmc.contact.tel2
                                : "N/A"}
                            </div>

                            <ChangeTel
                              object_id={this.state.dmc.id}
                              object_name={this.state.dmc.name}
                              object_type={"DMC"}
                              tel_num={"tel2"}
                              update_state={this.update_state}
                              telephone={
                                this.state.dmc.contact.tel2
                                  ? this.state.dmc.contact.tel2
                                  : "N/A"
                              }
                            />
                            <div className={"info_descr"}>
                              <BsFillTelephoneFill style={overviewIconStyle} />
                              Tel. 3
                            </div>
                            <div className={"info_span"}>
                              {this.state.dmc.contact.tel3
                                ? this.state.dmc.contact.tel3
                                : "N/A"}
                            </div>

                            <FaMinus
                              className="minus-icon"
                              title="Hide address 2"
                              style={{ marginLeft: 20 }}
                              onClick={() =>
                                this.setState({ show_tel2: false })
                              }
                            />
                            <ChangeTel
                              object_id={this.state.dmc.id}
                              object_name={this.state.dmc.name}
                              object_type={"DMC"}
                              tel_num={"tel3"}
                              update_state={this.update_state}
                              telephone={
                                this.state.dmc.contact.tel3
                                  ? this.state.dmc.contact.tel3
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
                          <GiConvergenceTarget style={overviewIconStyle} />
                          Region
                        </div>
                        <div className={"info_span"}>
                          {this.state.dmc.region ? this.state.dmc.region : 'N/A'}
                        </div>

                        <ChangeRegion
                          object_id={this.state.dmc.id}
                          object_name={this.state.dmc.name}
                          object_type={"DMC"}
                          update_state={this.update_state}
                        />
                        <div className={"info_descr"}>
                          <BsMailbox style={overviewIconStyle} />
                          Postal / Zip code
                        </div>
                        <div className={"info_span"}>
                          {this.state.dmc.contact.postal
                            ? this.state.dmc.contact.postal
                            : "N/A"}
                        </div>
                        <ChangePostal
                          object_id={this.state.dmc.id}
                          object_name={this.state.dmc.name}
                          object_type={"DMC"}
                          update_state={this.update_state}
                          postal={
                            this.state.dmc.contact.postal
                              ? this.state.dmc.contact.postal
                              : "N/A"
                          }
                        />
                        <div className={"info_descr"}>
                          <MdAlternateEmail style={overviewIconStyle} />
                          Email
                        </div>
                        <div className={"info_span"}>
                          {this.state.dmc.contact.email
                            ? this.state.dmc.contact.email
                            : "N/A"}
                        </div>
                        <ChangeEmail
                          object_id={this.state.dmc.id}
                          object_name={this.state.dmc.name}
                          object_type={"DMC"}
                          update_state={this.update_state}
                          email={
                            this.state.dmc.contact.email
                              ? this.state.dmc.contact.email
                              : "N/A"
                          }
                        />
                        <div className={"info_descr"}>
                          <FaGlobe style={overviewIconStyle} /> Website
                        </div>
                        <div className={"info_span"}>
                          {this.state.dmc.contact.website
                            ? this.state.dmc.contact.website
                            : "N/A"}
                        </div>
                        <ChangeWebsite
                          object_id={this.state.dmc.id}
                          object_name={this.state.dmc.name}
                          object_type={"DMC"}
                          update_state={this.update_state}
                          website={
                            this.state.dmc.contact.website
                              ? this.state.dmc.contact.website
                              : "N/A"
                          }
                        />
                        <div className={"info_descr"}>
                          <FaFlag style={overviewIconStyle} /> Countries
                          Operating
                        </div>
                        <div className={"info_span"}>
                          {this.state.dmc.countries_operating.length > 0
                            ? this.state.dmc.countries_operating.map((e) => (
                                <>
                                  <ReactCountryFlag
                                    countryCode={e.code}
                                    svg
                                    style={{
                                      width: "1.5em",
                                      height: "1.5em",
                                      marginRight: 10,
                                    }}
                                    title={e.name}
                                  />
                                </>
                              ))
                            : "N/A"}
                        </div>
                        <ChangeLanguage
                          dmc_id={this.state.dmc.id}
                          name={this.state.dmc.name}
                          update_state={this.update_state}
                        />
                        <div className={"info_descr"}>
                          <FaMapMarkerAlt style={overviewIconStyle} />
                          Lat / Lng
                        </div>
                        <ChangeLatLng
                          object_id={this.state.dmc.id}
                          object_name={this.state.dmc.name}
                          object_type={"DMC"}
                          update_state={this.update_state}
                          lat={this.state.dmc.lat}
                          lng={this.state.dmc.lng}
                        />
                        <div className={"lat_lng_span"}>
                          {this.state.dmc.lat ? this.state.dmc.lat : "N/A"}
                        </div>
                        <div
                          style={{ marginLeft: 35 }}
                          className={"lat_lng_span"}
                        >
                          {this.state.dmc.lng ? this.state.dmc.lng : "N/A"}
                        </div>
                        <ContactPersons
                          add_contact_person={this.add_contact_person}
                          object_id={this.state.dmc.id}
                          object_name={this.state.dmc.name}
                          object_type={"DMC"}
                          update_state={this.update_state}
                          contact_persons={this.state.dmc.contact_persons}
                        />
                        <div className={"info_descr"}>
                          {this.state.dmc.enabled ? (
                            <FaCheck style={overviewIconStyle} />
                          ) : (
                            <ImCross style={overviewIconStyle} />
                          )}
                          Enabled
                        </div>
                        <div className={"info_span"}>
                          {this.state.dmc.enabled ? "Enabled" : "Disabled"}
                        </div>
                        <ChangeEnabled
                          object_id={this.state.dmc.id}
                          object_name={this.state.dmc.name}
                          object_type={"DMC"}
                          update_state={this.update_state}
                        />
                      </Card.Body>
                      <Card.Footer>
                        <DeleteObjectModal
                          object_id={this.state.dmc.id}
                          object_name={this.state.dmc.name}
                          object_type={"DMC"}
                          update_state={this.update_state}
                        />
                      </Card.Footer>
                    </Card>
                    <Notes
                      update_notes={this.update_notes}
                      object_id={this.state.dmc.id}
                      object_name={this.state.dmc.name}
                      object_type={"DMC"}
                      update_state={this.update_state}
                      notes={this.state.dmc.notes}
                    />
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
                          {this.state.dmc.payment_details
                            ? this.state.dmc.payment_details.company === "" ||
                              this.state.dmc.payment_details.company === null
                              ? "N/A"
                              : this.state.dmc.payment_details.company
                            : "N/A"}
                        </div>
                        <div className={"info_descr"}> Currency </div>
                        <div className={"info_span"}>
                          {this.state.dmc.payment_details
                            ? this.state.dmc.payment_details.currency === "" ||
                              this.state.dmc.payment_details.currency === null
                              ? "N/A"
                              : this.state.dmc.payment_details.currency
                            : "N/A"}
                        </div>
                        <div className={"info_descr"}>
                          {this.state.dmc.payment_details.currency === "GBP"
                            ? "Account Number"
                            : "IBAN"}
                        </div>
                        <div className={"info_span"}>
                          {this.state.dmc.payment_details
                            ? this.state.dmc.payment_details.iban === "" ||
                              this.state.dmc.payment_details.iban === null
                              ? "N/A"
                              : this.state.dmc.payment_details.iban
                            : "N/A"}
                        </div>
                        <div className={"info_descr"}>
                          {this.state.dmc.payment_details.currency === "GBP"
                            ? "Sort Code"
                            : "Swift"}
                        </div>
                        <div className={"info_span"}>
                          {this.state.dmc.payment_details
                            ? this.state.dmc.payment_details.swift === "" ||
                              this.state.dmc.payment_details.swift === null
                              ? "N/A"
                              : this.state.dmc.payment_details.swift
                            : "N/A"}
                        </div>
                      </Card.Body>
                      <Card.Footer>
                        <EditPaymentDetails
                          object_id={this.state.dmc.id}
                          object_name={this.state.dmc.name}
                          object_type={"DMC"}
                          update_state={this.update_state}
                          payment_details={this.state.dmc.payment_details}
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
                        Map with dmc's location
                      </Card.Header>
                      {this.state.dmc.lat || this.state.dmc.lng ? (
                        <>
                          <Card.Body>
                            <GoogleMap object={this.state.dmc} />
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
                          Update latitude / longitude to show
                          destination_management company's location on map
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
                          Changing dmc's lat/lng will also change the map's pin
                        </small>
                      </Card.Footer>
                    </Card>
                  </Grid.Column>
                </Grid.Row>
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

export default DMCOverView;
