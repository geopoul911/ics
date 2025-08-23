// Built-ins
import React from "react";

// Icons / Images
import { BsInfoSquare } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdCreditCard } from "react-icons/md";
import { FaHashtag, FaCheck, FaGlobe } from "react-icons/fa";
import { FaAddressCard } from "react-icons/fa";
import { BsFillTelephoneFill } from "react-icons/bs";
import { MdAlternateEmail } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { FaMinus } from "react-icons/fa";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { GiConvergenceTarget } from "react-icons/gi";
import { BsMailbox } from "react-icons/bs";
import { IoMdBusiness } from "react-icons/io";

// Modules / Functions
import axios from "axios";
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import ContactPersons from "../../../core/contact_persons/contact_persons";

// Modals
import ChangeName from "../../../modals/change_name";
import ChangeAddress from "../../../modals/change_address";
import ChangeEmail from "../../../modals/change_email";
import ChangeTel from "../../../modals/change_tel";
import ChangeWebsite from "../../../modals/change_website";
import DeleteObjectModal from "../../../modals/delete_object";
import ChangeLatLng from "../../../modals/change_lat_lng";
import GoogleMap from "../../../core/map/map";
import ChangeEnabled from "../../../modals/change_enabled";
import EditPaymentDetails from "../../../modals/edit_payment_details";
import ChangeAddress2 from "../../../modals/change_address2";
import ChangePostal from "../../../modals/change_postal";
import ChangeRegion from "../../../modals/change_region";

import Swal from "sweetalert2";

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
const VIEW_CAR_HIRE_COMPANY =
  "http://localhost:8000/api/data_management/car_hire_company/";

function getCarHireCompanyId() {
  return window.location.pathname.split("/")[3];
}

let overviewIconStyle = { color: "#F3702D", marginRight: "0.5em" };

class CarHireCompanyOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      car_hire_company: {},
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
      .get(VIEW_CAR_HIRE_COMPANY + getCarHireCompanyId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          car_hire_company: res.data.car_hire_company,
          notes: res.data.car_hire_company.notes,
          contact_persons: res.data.car_hire_company.contact_persons,
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
    this.setState({ car_hire_company: update_state });
  };

  refresh = () => {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_CAR_HIRE_COMPANY + getCarHireCompanyId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          car_hire_company: res.data.car_hire_company,
          is_loaded: true,
        });
      });
  };

  update_car_hire_company = (car_hire_company) => {
    this.setState({ car_hire_company: car_hire_company });
  };

  add_contact_person = (contact_persons) => {
    var car_hire_company = { ...this.state.car_hire_company };
    car_hire_company.contact_persons = contact_persons;
    this.setState({
      car_hire_company: car_hire_company,
      contact_persons: contact_persons,
    });
  };

  render() {
    return (
      <>
        <div className="mainContainer">
          {pageHeader(
            "car_hire_company_overview",
            this.state.car_hire_company.name
          )}
          {this.state.forbidden ? (
            <>{forbidden("Car Hire Company Overview")}</>
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
                        Car Hire Company Information
                      </Card.Header>
                      <Card.Body>
                        <div className={"info_descr"}>
                          <FaHashtag style={overviewIconStyle} /> Name
                        </div>
                        <div className={"info_span"}>
                          {this.state.car_hire_company.name
                            ? this.state.car_hire_company.name
                            : "N/A"}
                        </div>
                        <ChangeName
                          object_id={this.state.car_hire_company.id}
                          object_name={this.state.car_hire_company.name}
                          object_type={"Car Hire Company"}
                          update_state={this.update_state}
                        />

                        <div className={"info_descr"}> <IoMdBusiness style={overviewIconStyle} /> Company </div>
                        <div className={"info_span"}>
                          {this.state.car_hire_company.payment_details
                            ? this.state.car_hire_company.payment_details.company === "" ||
                              this.state.car_hire_company.payment_details.company === null
                              ? "N/A"
                              : 
                              <span style={{color: this.state.car_hire_company.payment_details.company === this.state.car_hire_company.name ? 'blue': ''}}>
                                {this.state.car_hire_company.payment_details.company}
                              </span>
                            : "N/A"}
                        </div>

                        <div className={"info_descr"}>
                          <FaAddressCard style={overviewIconStyle} /> Address
                        </div>
                        <div className={"info_span"}>
                          {this.state.car_hire_company.contact.address
                            ? this.state.car_hire_company.contact.address
                            : "N/A"}
                        </div>
                        <ChangeAddress
                          object_id={this.state.car_hire_company.id}
                          object_name={this.state.car_hire_company.name}
                          object_type={"Car Hire Company"}
                          update_state={this.update_state}
                          address={
                            this.state.car_hire_company.contact.address
                              ? this.state.car_hire_company.contact.address
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
                              {this.state.car_hire_company.contact.address2
                                ? this.state.car_hire_company.contact.address2
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
                              object_id={this.state.car_hire_company.id}
                              object_name={this.state.car_hire_company.name}
                              object_type={"Car Hire Company"}
                              update_state={this.update_state}
                              address={
                                this.state.car_hire_company.contact.address2
                                  ? this.state.car_hire_company.contact
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
                          {this.state.car_hire_company.contact.tel
                            ? this.state.car_hire_company.contact.tel
                            : "N/A"}
                        </div>
                        <ChangeTel
                          object_id={this.state.car_hire_company.id}
                          object_name={this.state.car_hire_company.name}
                          object_type={"Car Hire Company"}
                          tel_num={"tel"}
                          update_state={this.update_state}
                          telephone={
                            this.state.car_hire_company.contact.tel
                              ? this.state.car_hire_company.contact.tel
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
                              {this.state.car_hire_company.contact.tel2
                                ? this.state.car_hire_company.contact.tel2
                                : "N/A"}
                            </div>

                            <ChangeTel
                              object_id={this.state.car_hire_company.id}
                              object_name={this.state.car_hire_company.name}
                              object_type={"Car Hire Company"}
                              tel_num={"tel2"}
                              update_state={this.update_state}
                              telephone={
                                this.state.car_hire_company.contact.tel2
                                  ? this.state.car_hire_company.contact.tel2
                                  : "N/A"
                              }
                            />
                            <div className={"info_descr"}>
                              <BsFillTelephoneFill style={overviewIconStyle} />
                              Tel. 3
                            </div>
                            <div className={"info_span"}>
                              {this.state.car_hire_company.contact.tel3
                                ? this.state.car_hire_company.contact.tel3
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
                              object_id={this.state.car_hire_company.id}
                              object_name={this.state.car_hire_company.name}
                              object_type={"Car Hire Company"}
                              tel_num={"tel3"}
                              update_state={this.update_state}
                              telephone={
                                this.state.car_hire_company.contact.tel3
                                  ? this.state.car_hire_company.contact.tel3
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
                          {this.state.car_hire_company.region ? this.state.car_hire_company.region : 'N/A'}
                        </div>

                        <ChangeRegion
                          object_id={this.state.car_hire_company.id}
                          object_name={this.state.car_hire_company.name}
                          object_type={"Car Hire Company"}
                          update_state={this.update_state}
                        />

                        <div className={"info_descr"}>
                          <BsMailbox style={overviewIconStyle} />
                          Postal / Zip code
                        </div>
                        <div className={"info_span"}>
                          {this.state.car_hire_company.contact.postal
                            ? this.state.car_hire_company.contact.postal
                            : "N/A"}
                        </div>
                        <ChangePostal
                          object_id={this.state.car_hire_company.id}
                          object_name={this.state.car_hire_company.name}
                          object_type={"Car Hire Company"}
                          update_state={this.update_state}
                          postal={
                            this.state.car_hire_company.contact.postal
                              ? this.state.car_hire_company.contact.postal
                              : "N/A"
                          }
                        />
                        <div className={"info_descr"}>
                          <MdAlternateEmail style={overviewIconStyle} />
                          Email
                        </div>
                        <div className={"info_span"}>
                          {this.state.car_hire_company.contact.email
                            ? this.state.car_hire_company.contact.email
                            : "N/A"}
                        </div>
                        <ChangeEmail
                          object_id={this.state.car_hire_company.id}
                          object_name={this.state.car_hire_company.name}
                          object_type={"Car Hire Company"}
                          update_state={this.update_state}
                          email={
                            this.state.car_hire_company.contact.email
                              ? this.state.car_hire_company.contact.email
                              : "N/A"
                          }
                        />
                        <div className={"info_descr"}>
                          <FaGlobe style={overviewIconStyle} /> Website
                        </div>
                        <div className={"info_span"}>
                          {this.state.car_hire_company.contact.website
                            ? this.state.car_hire_company.contact.website
                            : "N/A"}
                        </div>
                        <ChangeWebsite
                          object_id={this.state.car_hire_company.id}
                          object_name={this.state.car_hire_company.name}
                          object_type={"Car Hire Company"}
                          update_state={this.update_state}
                          website={
                            this.state.car_hire_company.contact.website
                              ? this.state.car_hire_company.contact.website
                              : "N/A"
                          }
                        />
                        <div className={"info_descr"}>
                          <FaMapMarkerAlt style={overviewIconStyle} />
                          Lat / Lng
                        </div>
                        <ChangeLatLng
                          object_id={this.state.car_hire_company.id}
                          object_name={this.state.car_hire_company.name}
                          object_type={"Car Hire Company"}
                          update_state={this.update_state}
                          lat={this.state.car_hire_company.lat}
                          lng={this.state.car_hire_company.lng}
                        />
                        <div className={"lat_lng_span"}>
                          {this.state.car_hire_company.lat
                            ? this.state.car_hire_company.lat
                            : "N/A"}
                        </div>
                        <div
                          style={{ marginLeft: 35 }}
                          className={"lat_lng_span"}
                        >
                          {this.state.car_hire_company.lng
                            ? this.state.car_hire_company.lng
                            : "N/A"}
                        </div>
                        <ContactPersons
                          add_contact_person={this.add_contact_person}
                          object_id={this.state.car_hire_company.id}
                          object_name={this.state.car_hire_company.name}
                          object_type={"Car Hire Company"}
                          update_state={this.update_state}
                          contact_persons={
                            this.state.car_hire_company.contact_persons
                          }
                        />
                        <div className={"info_descr"}>
                          {this.state.car_hire_company.enabled ? (
                            <FaCheck style={overviewIconStyle} />
                          ) : (
                            <ImCross style={overviewIconStyle} />
                          )}
                          Enabled
                        </div>
                        <div className={"info_span"}>
                          {this.state.car_hire_company.enabled
                            ? "Enabled"
                            : "Disabled"}
                        </div>
                        <ChangeEnabled
                          object_id={this.state.car_hire_company.id}
                          object_name={this.state.car_hire_company.name}
                          object_type={"Car Hire Company"}
                          update_state={this.update_state}
                        />
                      </Card.Body>
                      <Card.Footer>
                        <DeleteObjectModal
                          object_id={this.state.car_hire_company.id}
                          object_name={this.state.car_hire_company.name}
                          object_type={"Car Hire Company"}
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
                        Map with car Hire company's location
                      </Card.Header>
                      {this.state.car_hire_company.lat ||
                      this.state.car_hire_company.lng ? (
                        <>
                          <Card.Body>
                            <GoogleMap object={this.state.car_hire_company} />
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
                          Update latitude / longitude to show car Hire
                          company's location on map
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
                          Changing car Hire company's lat/lng will also change
                          the map's pin
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
                          {this.state.car_hire_company.payment_details
                            ? this.state.car_hire_company.payment_details
                                .company === "" ||
                              this.state.car_hire_company.payment_details
                                .company === null
                              ? "N/A"
                              : this.state.car_hire_company.payment_details
                                  .company
                            : "N/A"}
                        </div>
                        <div className={"info_descr"}> Currency </div>
                        <div className={"info_span"}>
                          {this.state.car_hire_company.payment_details
                            ? this.state.car_hire_company.payment_details
                                .currency === "" ||
                              this.state.car_hire_company.payment_details
                                .currency === null
                              ? "N/A"
                              : this.state.car_hire_company.payment_details
                                  .currency
                            : "N/A"}
                        </div>
                        <div className={"info_descr"}>
                          {this.state.car_hire_company.payment_details
                            .currency === "GBP"
                            ? "Account Number"
                            : "IBAN"}
                        </div>
                        <div className={"info_span"}>
                          {this.state.car_hire_company.payment_details
                            ? this.state.car_hire_company.payment_details
                                .iban === "" ||
                              this.state.car_hire_company.payment_details
                                .iban === null
                              ? "N/A"
                              : this.state.car_hire_company.payment_details
                                  .iban
                            : "N/A"}
                        </div>
                        <div className={"info_descr"}>
                          {this.state.car_hire_company.payment_details
                            .currency === "GBP"
                            ? "Sort Code"
                            : "Swift"}
                        </div>
                        <div className={"info_span"}>
                          {this.state.car_hire_company.payment_details
                            ? this.state.car_hire_company.payment_details
                                .swift === "" ||
                              this.state.car_hire_company.payment_details
                                .swift === null
                              ? "N/A"
                              : this.state.car_hire_company.payment_details
                                  .swift
                            : "N/A"}
                        </div>
                      </Card.Body>
                      <Card.Footer>
                        <EditPaymentDetails
                          object_id={this.state.car_hire_company.id}
                          object_name={this.state.car_hire_company.name}
                          object_type={"Car Hire Company"}
                          update_state={this.update_state}
                          payment_details={
                            this.state.car_hire_company.payment_details
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

export default CarHireCompanyOverView;
