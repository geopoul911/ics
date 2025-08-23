// Built-ins
import React from "react";

// Modules / Functions
import axios from "axios";
import Swal from "sweetalert2";

// Icons / Images
import { FaMapMarkerAlt, FaGlobe } from "react-icons/fa";
import { BsInfoSquare } from "react-icons/bs";
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import { MdCreditCard } from "react-icons/md";
import { IoMdBusiness } from "react-icons/io";
import { FaMinus } from "react-icons/fa";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { GiConvergenceTarget } from "react-icons/gi";
import { BsMailbox } from "react-icons/bs";

import { FaHashtag, FaCheck } from "react-icons/fa";
import { FaAddressCard } from "react-icons/fa";
import { BsFillTelephoneFill } from "react-icons/bs";
import { MdAlternateEmail, MdCategory } from "react-icons/md";
import { ImCross } from "react-icons/im";

// Custom Made Components
import ChangeName from "../../../modals/change_name";
import ChangeAddress from "../../../modals/change_address";
import ChangeEmail from "../../../modals/change_email";
import ChangeTel from "../../../modals/change_tel";
import ChangeWebsite from "../../../modals/change_website";
import ChangeEnabled from "../../../modals/change_enabled";
import ChangeLatLng from "../../../modals/change_lat_lng";
import GoogleMap from "../../../core/map/map";
import DeleteObjectModal from "../../../modals/delete_object";
import EditPaymentDetails from "../../../modals/edit_payment_details";
import Notes from "../../../core/notes/notes";
import ContactPersons from "../../../core/contact_persons/contact_persons";
import ChangeAddress2 from "../../../modals/change_address2";
import ChangePostal from "../../../modals/change_postal";
import ChangeRegion from "../../../modals/change_region";
import UpdateCategories from "./modals/update_categories";

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

const VIEW_COACH_OPERATOR = "http://localhost:8000/api/data_management/coach_operator/";

function getCoachOperatorId() {
  return window.location.pathname.split("/")[3];
}

class CoachOperatorOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coach_operator: {
        notes: [],
      },
      all_coaches: [],
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
      .get(VIEW_COACH_OPERATOR + getCoachOperatorId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          coach_operator: res.data.coach_operator,
          all_coaches: res.data.all_coaches,
          notes: res.data.coach_operator.notes,
          contact_persons: res.data.coach_operator.contact_persons,
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
    this.setState({ coach_operator: update_state });
  };

  refresh = () => {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_COACH_OPERATOR + getCoachOperatorId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          coach_operator: res.data.coach_operator,
          is_loaded: true,
        });
      });
  };

  update_coach_op = (coach_operator) => {
    this.setState({ coach_operator: coach_operator });
  };

  update_notes = (notes) => {
    var coach_operator = { ...this.state.coach_operator };
    coach_operator.notes = notes;
    this.setState({
      coach_operator: coach_operator,
    });
  };

  add_contact_person = (contact_persons) => {
    var coach_operator = { ...this.state.coach_operator };
    coach_operator.contact_persons = contact_persons;
    this.setState({
      coach_operator: coach_operator,
      contact_persons: contact_persons,
    });
  };

  render() {
    return (
      <>
        <div className="mainContainer">
          {pageHeader(
            "coach_operator_overview",
            this.state.coach_operator.name
          )}
          {this.state.forbidden ? (
            <>{forbidden("Coach Operator Overview")}</>
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
                      Coach Operator Information
                    </Card.Header>
                    <Card.Body>
                      <div className={"info_descr"}>
                        <FaHashtag style={overviewIconStyle} /> Name
                      </div>
                      <div className={"info_span"}>
                        {this.state.coach_operator.name
                          ? this.state.coach_operator.name
                          : "N/A"}
                      </div>
                      <ChangeName
                        object_id={this.state.coach_operator.id}
                        object_name={this.state.coach_operator.name}
                        object_type={"Coach Operator"}
                        update_state={this.update_state}
                      />

                      <div className={"info_descr"}> <IoMdBusiness style={overviewIconStyle} /> Company </div>
                      <div className={"info_span"}>
                        {this.state.coach_operator.payment_details
                          ? this.state.coach_operator.payment_details.company === "" ||
                            this.state.coach_operator.payment_details.company === null
                            ? "N/A"
                            : 
                            <span style={{color: this.state.coach_operator.payment_details.company === this.state.coach_operator.name ? 'blue': ''}}>
                              {this.state.coach_operator.payment_details.company}
                            </span>
                          : "N/A"}
                      </div>

                      <div className={"info_descr"}>
                        <MdCategory style={overviewIconStyle} /> Categories
                      </div>
                      <div className={"info_span"}>
                        {this.state.coach_operator.categories.length > 0 ? (
                          <ul
                            style={{
                              listStyle: "circle",
                              marginLeft: 10,
                              marginBottom: 0,
                            }}
                          >
                            {this.state.coach_operator.categories.map((cc) => {
                              return <li>{cc.name}</li>;
                            })}
                          </ul>
                        ) : (
                          "N/A"
                        )}
                      </div>
                      <UpdateCategories
                        object_id={this.state.coach_operator.id}
                        object_name={this.state.coach_operator.name}
                        object_type={"Coach Operator"}
                        update_state={this.update_state}
                        categories={this.state.coach_operator.categories}
                      />

                      <div className={"info_descr"}>
                        <FaAddressCard style={overviewIconStyle} /> Address
                      </div>
                      <div className={"info_span"}>
                        {this.state.coach_operator.contact.address
                          ? this.state.coach_operator.contact.address
                          : "N/A"}
                      </div>
                      <ChangeAddress
                        object_id={this.state.coach_operator.id}
                        object_name={this.state.coach_operator.name}
                        object_type={"Coach Operator"}
                        update_state={this.update_state}
                        address={
                          this.state.coach_operator.contact.address
                            ? this.state.coach_operator.contact.address
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
                            {this.state.coach_operator.contact.address2
                              ? this.state.coach_operator.contact.address2
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
                            object_id={this.state.coach_operator.id}
                            object_name={this.state.coach_operator.name}
                            object_type={"Coach Operator"}
                            update_state={this.update_state}
                            address={
                              this.state.coach_operator.contact.address2
                                ? this.state.coach_operator.contact.address2
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
                        {this.state.coach_operator.contact.tel
                          ? this.state.coach_operator.contact.tel
                          : "N/A"}
                      </div>
                      <ChangeTel
                        object_id={this.state.coach_operator.id}
                        object_name={this.state.coach_operator.name}
                        object_type={"Coach Operator"}
                        tel_num={"tel"}
                        update_state={this.update_state}
                        telephone={
                          this.state.coach_operator.contact.tel
                            ? this.state.coach_operator.contact.tel
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
                            {this.state.coach_operator.contact.tel2
                              ? this.state.coach_operator.contact.tel2
                              : "N/A"}
                          </div>

                          <ChangeTel
                            object_id={this.state.coach_operator.id}
                            object_name={this.state.coach_operator.name}
                            object_type={"Coach Operator"}
                            tel_num={"tel2"}
                            update_state={this.update_state}
                            telephone={
                              this.state.coach_operator.contact.tel2
                                ? this.state.coach_operator.contact.tel2
                                : "N/A"
                            }
                          />
                          <div className={"info_descr"}>
                            <BsFillTelephoneFill style={overviewIconStyle} />
                            Tel. 3
                          </div>
                          <div className={"info_span"}>
                            {this.state.coach_operator.contact.tel3
                              ? this.state.coach_operator.contact.tel3
                              : "N/A"}
                          </div>

                          <FaMinus
                            className="minus-icon"
                            title="Hide address 2"
                            style={{ marginLeft: 20 }}
                            onClick={() => this.setState({ show_tel2: false })}
                          />

                          <ChangeTel
                            object_id={this.state.coach_operator.id}
                            object_name={this.state.coach_operator.name}
                            object_type={"Coach Operator"}
                            tel_num={"tel3"}
                            update_state={this.update_state}
                            telephone={
                              this.state.coach_operator.contact.tel3
                                ? this.state.coach_operator.contact.tel3
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
                        {this.state.coach_operator.region ? this.state.coach_operator.region : 'N/A'}
                      </div>

                      <ChangeRegion
                        object_id={this.state.coach_operator.id}
                        object_name={this.state.coach_operator.name}
                        object_type={"Coach Operator"}
                        update_state={this.update_state}
                      />
                      <div className={"info_descr"}>
                        <BsMailbox style={overviewIconStyle} />
                        Postal / Zip code
                      </div>
                      <div className={"info_span"}>
                        {this.state.coach_operator.contact.postal
                          ? this.state.coach_operator.contact.postal
                          : "N/A"}
                      </div>
                      <ChangePostal
                        object_id={this.state.coach_operator.id}
                        object_name={this.state.coach_operator.name}
                        object_type={"Coach Operator"}
                        update_state={this.update_state}
                        postal={
                          this.state.coach_operator.contact.postal
                            ? this.state.coach_operator.contact.postal
                            : "N/A"
                        }
                      />
                      <div className={"info_descr"}>
                        <MdAlternateEmail style={overviewIconStyle} />
                        Email
                      </div>
                      <div className={"info_span"}>
                        {this.state.coach_operator.contact.email
                          ? this.state.coach_operator.contact.email
                          : "N/A"}
                      </div>
                      <ChangeEmail
                        object_id={this.state.coach_operator.id}
                        object_name={this.state.coach_operator.name}
                        object_type={"Coach Operator"}
                        update_state={this.update_state}
                      />
                      <div className={"info_descr"}>
                        <FaGlobe style={overviewIconStyle} /> Website
                      </div>
                      <div className={"info_span"}>
                        {this.state.coach_operator.contact.website
                          ? this.state.coach_operator.contact.website
                          : "N/A"}
                      </div>
                      <ChangeWebsite
                        object_id={this.state.coach_operator.id}
                        object_name={this.state.coach_operator.name}
                        object_type={"Coach Operator"}
                        update_state={this.update_state}
                        website={
                          this.state.coach_operator.contact.website
                            ? this.state.coach_operator.contact.website
                            : "N/A"
                        }
                      />
                      <div className={"info_descr"}>
                        <FaMapMarkerAlt style={overviewIconStyle} />
                        Lat / Lng
                      </div>
                      <ChangeLatLng
                        object_id={this.state.coach_operator.id}
                        object_name={this.state.coach_operator.name}
                        object_type={"Coach Operator"}
                        update_state={this.update_state}
                        lat={this.state.coach_operator.lat}
                        lng={this.state.coach_operator.lng}
                      />
                      <div className={"lat_lng_span"}>
                        {this.state.coach_operator.lat
                          ? this.state.coach_operator.lat
                          : "N/A"}
                      </div>
                      <div
                        style={{ marginLeft: 35 }}
                        className={"lat_lng_span"}
                      >
                        {this.state.coach_operator.lng
                          ? this.state.coach_operator.lng
                          : "N/A"}
                      </div>
                      <ContactPersons
                        add_contact_person={this.add_contact_person}
                        object_id={this.state.coach_operator.id}
                        object_name={this.state.coach_operator.name}
                        object_type={"Coach Operator"}
                        update_state={this.update_state}
                        contact_persons={
                          this.state.coach_operator.contact_persons
                        }
                      />
                      <div className={"info_descr"}>
                        {this.state.coach_operator.enabled ? (
                          <FaCheck style={overviewIconStyle} />
                        ) : (
                          <ImCross style={overviewIconStyle} />
                        )}
                        Enabled
                      </div>
                      <div className={"info_span"}>
                        {this.state.coach_operator.enabled
                          ? "Enabled"
                          : "Disabled"}
                      </div>
                      <ChangeEnabled
                        object_id={this.state.coach_operator.id}
                        object_name={this.state.coach_operator.name}
                        object_type={"Coach Operator"}
                        update_state={this.update_state}
                      />
                    </Card.Body>
                    <Card.Footer>
                      <DeleteObjectModal
                        object_id={this.state.coach_operator.id}
                        object_name={this.state.coach_operator.name}
                        object_type={"Coach Operator"}
                        update_state={this.update_state}
                      />
                    </Card.Footer>
                  </Card>
                  <Notes
                    update_notes={this.update_notes}
                    object_id={this.state.coach_operator.id}
                    object_name={this.state.coach_operator.name}
                    object_type={"Coach Operator"}
                    update_state={this.update_state}
                    notes={this.state.coach_operator.notes}
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
                        {this.state.coach_operator.payment_details
                          ? this.state.coach_operator.payment_details
                              .company === "" ||
                            this.state.coach_operator.payment_details
                              .company === null
                            ? "N/A"
                            : this.state.coach_operator.payment_details.company
                          : "N/A"}
                      </div>
                      <div className={"info_descr"}> Currency </div>
                      <div className={"info_span"}>
                        {this.state.coach_operator.payment_details
                          ? this.state.coach_operator.payment_details
                              .currency === "" ||
                            this.state.coach_operator.payment_details
                              .currency === null
                            ? "N/A"
                            : this.state.coach_operator.payment_details.currency
                          : "N/A"}
                      </div>
                      <div className={"info_descr"}>
                        {this.state.coach_operator.payment_details.currency ===
                        "GBP"
                          ? "Account Number"
                          : "IBAN"}
                      </div>
                      <div className={"info_span"}>
                        {this.state.coach_operator.payment_details
                          ? this.state.coach_operator.payment_details.iban ===
                              "" ||
                            this.state.coach_operator.payment_details.iban ===
                              null
                            ? "N/A"
                            : this.state.coach_operator.payment_details.iban
                          : "N/A"}
                      </div>
                      <div className={"info_descr"}>
                        {this.state.coach_operator.payment_details.currency ===
                        "GBP"
                          ? "Sort Code"
                          : "Swift"}
                      </div>
                      <div className={"info_span"}>
                        {this.state.coach_operator.payment_details
                          ? this.state.coach_operator.payment_details.swift ===
                              "" ||
                            this.state.coach_operator.payment_details.swift ===
                              null
                            ? "N/A"
                            : this.state.coach_operator.payment_details.swift
                          : "N/A"}
                      </div>
                    </Card.Body>
                    <Card.Footer>
                      <EditPaymentDetails
                        object_id={this.state.coach_operator.id}
                        object_name={this.state.coach_operator.name}
                        object_type={"Coach Operator"}
                        update_state={this.update_state}
                        payment_details={
                          this.state.coach_operator.payment_details
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
                      Map with coach operator's location
                    </Card.Header>
                    {this.state.coach_operator.lat ||
                    this.state.coach_operator.lng ? (
                      <>
                        <Card.Body>
                          <GoogleMap object={this.state.coach_operator} />
                        </Card.Body>
                      </>
                    ) : (
                      <strong
                        style={{ textAlign: "center", margin: 20, padding: 20 }}
                      >
                        Update latitude / longitude to show coach operator's
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
                        Changing coach operator's lat/lng will also change the
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

export default CoachOperatorOverView;
