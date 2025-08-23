// Built-ins
import React from "react";

// Icons / Images
import { BsInfoSquare } from "react-icons/bs";
import { FaHashtag, FaCheck, FaGlobe } from "react-icons/fa";
import { FaAddressCard } from "react-icons/fa";
import { BsFillTelephoneFill } from "react-icons/bs";
import { MdAlternateEmail } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { FaMinus } from "react-icons/fa";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { GiConvergenceTarget } from "react-icons/gi";
import { IoMdBusiness } from "react-icons/io";
import { BsMailbox } from "react-icons/bs";
import axios from "axios";

// Modules / Functions
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
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
import EditPaymentDetails from "../../../modals/edit_payment_details";
import ContactPersons from "../../../core/contact_persons/contact_persons";
import ChangeAddress2 from "../../../modals/change_address2";
import ChangePostal from "../../../modals/change_postal";
import ChangeRegion from "../../../modals/change_region";

// Icons / Images
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdCreditCard } from "react-icons/md";

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

const VIEW_SPORT_EVENT_SUPPLIER = "http://localhost:8000/api/data_management/sport_event_supplier/";

function getSportEventSupplierId() {
  return window.location.pathname.split("/")[3];
}

class SportEventSupplierOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sport_event_supplier: {},
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
      .get(VIEW_SPORT_EVENT_SUPPLIER + getSportEventSupplierId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          sport_event_supplier: res.data.sport_event_supplier,
          notes: res.data.sport_event_supplier.notes,
          contact_persons: res.data.sport_event_supplier.contact_persons,
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
    this.setState({ sport_event_supplier: update_state });
  };

  refresh = () => {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_SPORT_EVENT_SUPPLIER + getSportEventSupplierId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          sport_event_supplier: res.data.sport_event_supplier,
          is_loaded: true,
        });
      });
  };

  update_sport_event_supplier = (sport_event_supplier) => {
    this.setState({ sport_event_supplier: sport_event_supplier });
  };

  add_contact_person = (contact_persons) => {
    var sport_event_supplier = { ...this.state.sport_event_supplier };
    sport_event_supplier.contact_persons = contact_persons;
    this.setState({
      sport_event_supplier: sport_event_supplier,
      contact_persons: contact_persons,
    });
  };

  render() {
    return (
      <>
        <div className="mainContainer">
          {pageHeader(
            "sport_event_supplier_overview",
            this.state.sport_event_supplier.name
          )}
          {this.state.forbidden ? (
            <>{forbidden("Sport Event Supplier Overview")}</>
          ) : this.state.is_loaded ? (
            <>
              <Grid stackable columns={2} divided>
                <Grid.Row style={{ marginLeft: 2 }}>
                  <Grid.Column>
                    <Card>
                      <Card.Header>
                        <BsInfoSquare style={{ color: "#F3702D", fontSize: "1.5em", marginRight: "0.5em",}}/>
                        Sport Event Supplier Information
                      </Card.Header>
                      <Card.Body>
                        <div className={"info_descr"}>
                          <FaHashtag style={overviewIconStyle} /> Name
                        </div>
                        <div className={"info_span"}>
                          {this.state.sport_event_supplier.name ? this.state.sport_event_supplier.name : "N/A"}
                        </div>
                        <ChangeName
                          object_id={this.state.sport_event_supplier.id}
                          object_name={this.state.sport_event_supplier.name}
                          object_type={"Sport Event Supplier"}
                          update_state={this.update_state}
                        />

                        <div className={"info_descr"}> <IoMdBusiness style={overviewIconStyle} /> Company </div>
                        <div className={"info_span"}>
                          {this.state.sport_event_supplier.payment_details
                            ? this.state.sport_event_supplier.payment_details.company === "" ||
                              this.state.sport_event_supplier.payment_details.company === null
                              ? "N/A"
                              : 
                              <span style={{color: this.state.sport_event_supplier.payment_details.company === this.state.sport_event_supplier.name ? 'blue': ''}}>
                                {this.state.sport_event_supplier.payment_details.company}
                              </span>
                            : "N/A"}
                        </div>

                        <div className={"info_descr"}>
                          <FaAddressCard style={overviewIconStyle} /> Address
                        </div>
                        <div className={"info_span"}>
                          {this.state.sport_event_supplier.contact.address
                            ? this.state.sport_event_supplier.contact.address
                            : "N/A"}
                        </div>
                        <ChangeAddress
                          object_id={this.state.sport_event_supplier.id}
                          object_name={this.state.sport_event_supplier.name}
                          object_type={"Sport Event Supplier"}
                          update_state={this.update_state}
                          address={this.state.sport_event_supplier.contact.address ? this.state.sport_event_supplier.contact.address : "N/A"}
                        />

                        {this.state.show_address2 ? (
                          <>
                            <div className={"info_descr"}>
                              <FaAddressCard style={overviewIconStyle} />
                              Address 2
                            </div>
                            <div className={"info_span"}>
                              {this.state.sport_event_supplier.contact.address2 ? this.state.sport_event_supplier.contact.address2 : "N/A"}
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
                              object_id={this.state.sport_event_supplier.id}
                              object_name={this.state.sport_event_supplier.name}
                              object_type={"Sport Event Supplier"}
                              update_state={this.update_state}
                              address={this.state.sport_event_supplier.contact.address2
                                  ? this.state.sport_event_supplier.contact.address2
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
                          {this.state.sport_event_supplier.contact.tel
                            ? this.state.sport_event_supplier.contact.tel
                            : "N/A"}
                        </div>
                        <ChangeTel
                          object_id={this.state.sport_event_supplier.id}
                          object_name={this.state.sport_event_supplier.name}
                          object_type={"Sport Event Supplier"}
                          tel_num={"tel"}
                          update_state={this.update_state}
                          telephone={
                            this.state.sport_event_supplier.contact.tel
                              ? this.state.sport_event_supplier.contact.tel
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
                              {this.state.sport_event_supplier.contact.tel2
                                ? this.state.sport_event_supplier.contact.tel2
                                : "N/A"}
                            </div>

                            <ChangeTel
                              object_id={this.state.sport_event_supplier.id}
                              object_name={this.state.sport_event_supplier.name}
                              object_type={"Sport Event Supplier"}
                              tel_num={"tel2"}
                              update_state={this.update_state}
                              telephone={
                                this.state.sport_event_supplier.contact.tel2
                                  ? this.state.sport_event_supplier.contact.tel2
                                  : "N/A"
                              }
                            />
                            <div className={"info_descr"}>
                              <BsFillTelephoneFill style={overviewIconStyle} />
                              Tel. 3
                            </div>
                            <div className={"info_span"}>
                              {this.state.sport_event_supplier.contact.tel3
                                ? this.state.sport_event_supplier.contact.tel3
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
                              object_id={this.state.sport_event_supplier.id}
                              object_name={this.state.sport_event_supplier.name}
                              object_type={"Sport Event Supplier"}
                              tel_num={"tel3"}
                              update_state={this.update_state}
                              telephone={
                                this.state.sport_event_supplier.contact.tel3
                                  ? this.state.sport_event_supplier.contact.tel3
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
                          {this.state.sport_event_supplier.region ? this.state.sport_event_supplier.region : 'N/A'}
                        </div>
                        <ChangeRegion
                          object_id={this.state.sport_event_supplier.id}
                          object_name={this.state.sport_event_supplier.name}
                          object_type={"Sport Event Supplier"}
                          update_state={this.update_state}
                          region_id={this.state.sport_event_supplier.region_id}
                          region_type={
                            this.state.sport_event_supplier.region_type
                          }
                        />

                        <div className={"info_descr"}>
                          <BsMailbox style={overviewIconStyle} />
                          Postal / Zip code
                        </div>
                        <div className={"info_span"}>
                          {this.state.sport_event_supplier.contact.postal
                            ? this.state.sport_event_supplier.contact.postal
                            : "N/A"}
                        </div>
                        <ChangePostal
                          object_id={this.state.sport_event_supplier.id}
                          object_name={this.state.sport_event_supplier.name}
                          object_type={"Sport Event Supplier"}
                          update_state={this.update_state}
                          postal={
                            this.state.sport_event_supplier.contact.postal
                              ? this.state.sport_event_supplier.contact.postal
                              : "N/A"
                          }
                        />
                        <div className={"info_descr"}>
                          <MdAlternateEmail style={overviewIconStyle} />
                          Email
                        </div>
                        <div className={"info_span"}>
                          {this.state.sport_event_supplier.contact.email
                            ? this.state.sport_event_supplier.contact.email
                            : "N/A"}
                        </div>
                        <ChangeEmail
                          object_id={this.state.sport_event_supplier.id}
                          object_name={this.state.sport_event_supplier.name}
                          object_type={"Sport Event Supplier"}
                          update_state={this.update_state}
                          email={
                            this.state.sport_event_supplier.contact.email
                              ? this.state.sport_event_supplier.contact.email
                              : "N/A"
                          }
                        />
                        <div className={"info_descr"}>
                          <FaGlobe style={overviewIconStyle} /> Website
                        </div>
                        <div className={"info_span"}>
                          {this.state.sport_event_supplier.contact.website
                            ? this.state.sport_event_supplier.contact.website
                            : "N/A"}
                        </div>
                        <ChangeWebsite
                          object_id={this.state.sport_event_supplier.id}
                          object_name={this.state.sport_event_supplier.name}
                          object_type={"Sport Event Supplier"}
                          update_state={this.update_state}
                          website={
                            this.state.sport_event_supplier.contact.website
                              ? this.state.sport_event_supplier.contact.website
                              : ""
                          }
                        />
                        <div className={"info_descr"}>
                          <FaMapMarkerAlt style={overviewIconStyle} />
                          Lat / Lng
                        </div>
                        <ChangeLatLng
                          object_id={this.state.sport_event_supplier.id}
                          object_name={this.state.sport_event_supplier.name}
                          object_type={"Sport Event Supplier"}
                          update_state={this.update_state}
                          lat={this.state.sport_event_supplier.lat}
                          lng={this.state.sport_event_supplier.lng}
                        />
                        <div className={"lat_lng_span"}>
                          {this.state.sport_event_supplier.lat
                            ? this.state.sport_event_supplier.lat
                            : "N/A"}
                        </div>
                        <div
                          style={{ marginLeft: 35 }}
                          className={"lat_lng_span"}
                        >
                          {this.state.sport_event_supplier.lng
                            ? this.state.sport_event_supplier.lng
                            : "N/A"}
                        </div>
                        <ContactPersons
                          add_contact_person={this.add_contact_person}
                          object_id={this.state.sport_event_supplier.id}
                          object_name={this.state.sport_event_supplier.name}
                          object_type={"Sport Event Supplier"}
                          update_state={this.update_state}
                          contact_persons={
                            this.state.sport_event_supplier.contact_persons
                          }
                        />
                        <div className={"info_descr"}>
                          {this.state.sport_event_supplier.enabled ? (
                            <FaCheck style={overviewIconStyle} />
                          ) : (
                            <ImCross style={overviewIconStyle} />
                          )}
                          Enabled
                        </div>
                        <div className={"info_span"}>
                          {this.state.sport_event_supplier.enabled
                            ? "Enabled"
                            : "Disabled"}
                        </div>
                        <ChangeEnabled
                          object_id={this.state.sport_event_supplier.id}
                          object_name={this.state.sport_event_supplier.name}
                          object_type={"Sport Event Supplier"}
                          update_state={this.update_state}
                        />
                      </Card.Body>
                      <Card.Footer>
                        <DeleteObjectModal
                          object_id={this.state.sport_event_supplier.id}
                          object_name={this.state.sport_event_supplier.name}
                          object_type={"Sport Event Supplier"}
                          update_state={this.update_state}
                        />
                      </Card.Footer>
                    </Card>
                  </Grid.Column>
                  <Grid.Column>
                    <Card>
                      <Card.Header>
                        <FaMapMarkerAlt
                          style={{
                            color: "#F3702D",
                            fontSize: "1.5em",
                            marginRight: "0.5em",
                          }}
                        />
                        Map with Sport Event Supplier's location
                      </Card.Header>
                      {this.state.sport_event_supplier.lat ||
                      this.state.sport_event_supplier.lng ? (
                        <>
                          <Card.Body>
                            <GoogleMap
                              object={this.state.sport_event_supplier}
                            />
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
                          sport_event_supplier\'s location on map
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
                          Changing sport_event_supplier's lat/lng will also
                          change the map's pin
                        </small>
                      </Card.Footer>
                    </Card>
                    <Card>
                      <Card.Header>
                        <MdCreditCard style={iconStyle} />
                        Payment Details
                      </Card.Header>
                      <Card.Body>
                        <div className={"info_descr"}> Company </div>
                        <div className={"info_span"}>
                          {this.state.sport_event_supplier.payment_details
                            ? this.state.sport_event_supplier.payment_details
                                .company === "" ||
                              this.state.sport_event_supplier.payment_details
                                .company === null
                              ? "N/A"
                              : this.state.sport_event_supplier.payment_details
                                  .company
                            : "N/A"}
                        </div>
                        <div className={"info_descr"}> Currency </div>
                        <div className={"info_span"}>
                          {this.state.sport_event_supplier.payment_details
                            ? this.state.sport_event_supplier.payment_details
                                .currency === "" ||
                              this.state.sport_event_supplier.payment_details
                                .currency === null
                              ? "N/A"
                              : this.state.sport_event_supplier.payment_details
                                  .currency
                            : "N/A"}
                        </div>
                        <div className={"info_descr"}>
                          {this.state.sport_event_supplier.payment_details
                            .currency === "GBP"
                            ? "Account Number"
                            : "IBAN"}
                        </div>
                        <div className={"info_span"}>
                          {this.state.sport_event_supplier.payment_details
                            ? this.state.sport_event_supplier.payment_details
                                .iban === "" ||
                              this.state.sport_event_supplier.payment_details
                                .iban === null
                              ? "N/A"
                              : this.state.sport_event_supplier.payment_details
                                  .iban
                            : "N/A"}
                        </div>
                        <div className={"info_descr"}>
                          {this.state.sport_event_supplier.payment_details
                            .currency === "GBP"
                            ? "Sort Code"
                            : "Swift"}
                        </div>
                        <div className={"info_span"}>
                          {this.state.sport_event_supplier.payment_details
                            ? this.state.sport_event_supplier.payment_details
                                .swift === "" ||
                              this.state.sport_event_supplier.payment_details
                                .swift === null
                              ? "N/A"
                              : this.state.sport_event_supplier.payment_details
                                  .swift
                            : "N/A"}
                        </div>
                      </Card.Body>
                      <Card.Footer>
                        <EditPaymentDetails
                          object_id={this.state.sport_event_supplier.id}
                          object_name={this.state.sport_event_supplier.name}
                          object_type={"Sport Event Supplier"}
                          update_state={this.update_state}
                          payment_details={
                            this.state.sport_event_supplier.payment_details
                          }
                        />
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

export default SportEventSupplierOverView;
