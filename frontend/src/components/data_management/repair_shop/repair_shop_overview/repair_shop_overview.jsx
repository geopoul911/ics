// Built-ins
import React from "react";

// Modules / Functions
import axios from "axios";
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import Swal from "sweetalert2";

// Custom Made Components
import ChangeName from "../../../modals/change_name";
import ChangeAddress from "../../../modals/change_address";
import ChangeEmail from "../../../modals/change_email";
import ChangeTel from "../../../modals/change_tel";
import ChangeType from "../../../modals/repair_shops/change_type";
import GoogleMap from "../../../core/map/map";
import ChangeLatLng from "../../../modals/change_lat_lng";
import ChangeEnabled from "../../../modals/change_enabled";
import DeleteObjectModal from "../../../modals/delete_object";
import EditPaymentDetails from "../../../modals/edit_payment_details";
import Notes from "../../../core/notes/notes";
import ContactPersons from "../../../core/contact_persons/contact_persons";
import ChangeAddress2 from "../../../modals/change_address2";
import ChangePostal from "../../../modals/change_postal";
import ChangeRegion from "../../../modals/change_region";

// Icons / Images
import { FaMapMarkerAlt } from "react-icons/fa";
import { BsInfoSquare } from "react-icons/bs";
import { MdCreditCard } from "react-icons/md";
import { FaHashtag, FaCheck } from "react-icons/fa";
import { FaAddressCard } from "react-icons/fa";
import { BsFillTelephoneFill } from "react-icons/bs";
import { MdAlternateEmail } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { FaMinus } from "react-icons/fa";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { GiConvergenceTarget } from "react-icons/gi";
import { BsMailbox } from "react-icons/bs";
import { IoMdBusiness } from "react-icons/io";
import { FiType } from "react-icons/fi";

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

const VIEW_REPAIR_SHOP =
  "http://localhost:8000/api/data_management/repair_shop/";

function getRepairShopId() {
  return window.location.pathname.split("/")[3];
}

let overviewIconStyle = { color: "#F3702D", marginRight: "0.5em" };

class RepairShopOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      repair_shop: { notes: [] },
      contact_persons: [],
      is_loaded: false,
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
      .get(VIEW_REPAIR_SHOP + getRepairShopId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          repair_shop: res.data.repair_shop,
          notes: res.data.repair_shop.notes,
          contact_persons: res.data.repair_shop.contact_persons,
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
    this.setState({ repair_shop: update_state });
  };

  refresh = () => {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_REPAIR_SHOP + getRepairShopId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          repair_shop: res.data.repair_shop,
          notes: res.data.repair_shop.notes,
          is_loaded: true,
        });
      });
  };

  update_notes = (notes) => {
    var repair_shop = { ...this.state.repair_shop };
    repair_shop.notes = notes;
    this.setState({
      repair_shop: repair_shop,
    });
  };

  add_contact_person = (contact_persons) => {
    var repair_shop = { ...this.state.repair_shop };
    repair_shop.contact_persons = contact_persons;
    this.setState({
      repair_shop: repair_shop,
      contact_persons: contact_persons,
    });
  };

  render() {
    return (
      <>
        <div className="mainContainer">
          {pageHeader("repair_shop_overview", this.state.repair_shop.name)}
          {this.state.forbidden ? (
            <>{forbidden("Updates")}</>
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
                        Repair Shop Information
                      </Card.Header>
                      <Card.Body>
                        <div className={"info_descr"}>
                          <FaHashtag style={overviewIconStyle} /> Name
                        </div>
                        <div className={"info_span"}>
                          {this.state.repair_shop.name
                            ? this.state.repair_shop.name
                            : "N/A"}
                        </div>

                        <ChangeName
                          object_id={this.state.repair_shop.id}
                          object_name={this.state.repair_shop.name}
                          object_type={"Repair Shop"}
                          update_state={this.update_state}
                        />

                        <div className={"info_descr"}> <IoMdBusiness style={overviewIconStyle} /> Company </div>
                        <div className={"info_span"}>
                          {this.state.repair_shop.payment_details
                            ? this.state.repair_shop.payment_details.company === "" ||
                              this.state.repair_shop.payment_details.company === null
                              ? "N/A"
                              : 
                              <span style={{color: this.state.repair_shop.payment_details.company === this.state.repair_shop.name ? 'blue': ''}}>
                                {this.state.repair_shop.payment_details.company}
                              </span>
                            : "N/A"}
                        </div>

                        <div className={"info_descr"}>
                          <FaAddressCard style={overviewIconStyle} /> Address
                        </div>
                        <div className={"info_span"}>
                          {this.state.repair_shop.contact.address
                            ? this.state.repair_shop.contact.address
                            : "N/A"}
                        </div>
                        <ChangeAddress
                          object_id={this.state.repair_shop.id}
                          object_name={this.state.repair_shop.name}
                          object_type={"Repair Shop"}
                          update_state={this.update_state}
                          address={
                            this.state.repair_shop.contact.address
                              ? this.state.repair_shop.contact.address
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
                              {this.state.repair_shop.contact.address2
                                ? this.state.repair_shop.contact.address2
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
                              object_id={this.state.repair_shop.id}
                              object_name={this.state.repair_shop.name}
                              object_type={"Repair Shop"}
                              update_state={this.update_state}
                              address={
                                this.state.repair_shop.contact.address2
                                  ? this.state.repair_shop.contact.address2
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
                          {this.state.repair_shop.contact.tel
                            ? this.state.repair_shop.contact.tel
                            : "N/A"}
                        </div>
                        <ChangeTel
                          object_id={this.state.repair_shop.id}
                          object_name={this.state.repair_shop.name}
                          object_type={"Repair Shop"}
                          tel_num={"tel"}
                          update_state={this.update_state}
                          telephone={
                            this.state.repair_shop.contact.tel
                              ? this.state.repair_shop.contact.tel
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
                              {this.state.repair_shop.contact.tel2
                                ? this.state.repair_shop.contact.tel2
                                : "N/A"}
                            </div>

                            <ChangeTel
                              object_id={this.state.repair_shop.id}
                              object_name={this.state.repair_shop.name}
                              object_type={"Repair Shop"}
                              tel_num={"tel2"}
                              update_state={this.update_state}
                              telephone={
                                this.state.repair_shop.contact.tel2
                                  ? this.state.repair_shop.contact.tel2
                                  : "N/A"
                              }
                            />
                            <div className={"info_descr"}>
                              <BsFillTelephoneFill style={overviewIconStyle} />
                              Tel. 3
                            </div>
                            <div className={"info_span"}>
                              {this.state.repair_shop.contact.tel3
                                ? this.state.repair_shop.contact.tel3
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
                              object_id={this.state.repair_shop.id}
                              object_name={this.state.repair_shop.name}
                              object_type={"Repair Shop"}
                              tel_num={"tel3"}
                              update_state={this.update_state}
                              telephone={
                                this.state.repair_shop.contact.tel3
                                  ? this.state.repair_shop.contact.tel3
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
                          {this.state.repair_shop.region ? this.state.repair_shop.region : 'N/A'}
                        </div>

                        <ChangeRegion
                          object_id={this.state.repair_shop.id}
                          object_name={this.state.repair_shop.name}
                          object_type={"Repair Shop"}
                          update_state={this.update_state}
                          region_id={this.state.repair_shop.region_id}
                          region_type={this.state.repair_shop.region_type}
                        />

                        <div className={"info_descr"}>
                          <BsMailbox style={overviewIconStyle} />
                          Postal / Zip code
                        </div>
                        <div className={"info_span"}>
                          {this.state.repair_shop.contact.postal
                            ? this.state.repair_shop.contact.postal
                            : "N/A"}
                        </div>
                        <ChangePostal
                          object_id={this.state.repair_shop.id}
                          object_name={this.state.repair_shop.name}
                          object_type={"Repair Shop"}
                          update_state={this.update_state}
                          postal={
                            this.state.repair_shop.contact.postal
                              ? this.state.repair_shop.contact.postal
                              : "N/A"
                          }
                        />
                        <div className={"info_descr"}>
                          <MdAlternateEmail style={overviewIconStyle} />
                          Email
                        </div>
                        <div className={"info_span"}>
                          {this.state.repair_shop.contact.email
                            ? this.state.repair_shop.contact.email
                            : "N/A"}
                        </div>
                        <ChangeEmail
                          object_id={this.state.repair_shop.id}
                          object_name={this.state.repair_shop.name}
                          object_type={"Repair Shop"}
                          update_state={this.update_state}
                          email={
                            this.state.repair_shop.contact.email
                              ? this.state.repair_shop.contact.email
                              : "N/A"
                          }
                        />
                        <div className={"info_descr"}>
                          <FaMapMarkerAlt style={overviewIconStyle} />
                          Lat / Lng
                        </div>
                        <ChangeLatLng
                          object_id={this.state.repair_shop.id}
                          object_name={this.state.repair_shop.name}
                          object_type={"Repair Shop"}
                          update_state={this.update_state}
                          lat={this.state.repair_shop.lat}
                          lng={this.state.repair_shop.lng}
                        />
                        <div className={"lat_lng_span"}>
                          {this.state.repair_shop.lat
                            ? this.state.repair_shop.lat
                            : "N/A"}
                        </div>
                        <div
                          style={{ marginLeft: 35 }}
                          className={"lat_lng_span"}
                        >
                          {this.state.repair_shop.lng
                            ? this.state.repair_shop.lng
                            : "N/A"}
                        </div>
                        <div className={"info_descr"}>
                          <FiType style={overviewIconStyle} /> Types
                        </div>
                        <div className={"info_span"}>
                          {this.state.repair_shop.type.length > 0
                            ? this.state.repair_shop.type.map((e) => (
                                <img
                                  src={"http://localhost:8000" + e.icon}
                                  alt=""
                                  id="repair_shop_icon"
                                  title={e.description}
                                />
                              ))
                            : "N/A"}
                        </div>
                        <ChangeType
                          repair_shop_id={this.state.repair_shop.id}
                          name={this.state.repair_shop.name}
                          update_state={this.update_state}
                        />

                        <ContactPersons
                          add_contact_person={this.add_contact_person}
                          object_id={this.state.repair_shop.id}
                          object_name={this.state.repair_shop.name}
                          object_type={"Repair Shop"}
                          update_state={this.update_state}
                          contact_persons={
                            this.state.repair_shop.contact_persons
                          }
                        />

                        <div className={"info_descr"}>
                          {this.state.repair_shop.enabled ? (
                            <FaCheck style={overviewIconStyle} />
                          ) : (
                            <ImCross style={overviewIconStyle} />
                          )}
                          Enabled
                        </div>
                        <div className={"info_span"}>
                          {this.state.repair_shop.enabled
                            ? "Enabled"
                            : "Disabled"}
                        </div>
                        <ChangeEnabled
                          object_id={this.state.repair_shop.id}
                          object_name={this.state.repair_shop.name}
                          object_type={"Repair Shop"}
                          update_state={this.update_state}
                        />
                      </Card.Body>
                      <Card.Footer>
                        <DeleteObjectModal
                          object_id={this.state.repair_shop.id}
                          object_name={this.state.repair_shop.name}
                          object_type={"Repair Shop"}
                          update_state={this.update_state}
                        />
                      </Card.Footer>
                    </Card>
                    <Notes
                      update_notes={this.update_notes}
                      object_id={this.state.repair_shop.id}
                      object_name={this.state.repair_shop.name}
                      object_type={"Repair Shop"}
                      update_state={this.update_state}
                      notes={this.state.repair_shop.notes}
                    />
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
                        Map with repair shop's location
                      </Card.Header>
                      {this.state.repair_shop.lat ||
                      this.state.repair_shop.lng ? (
                        <>
                          <Card.Body>
                            <GoogleMap object={this.state.repair_shop} />
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
                          Update latitude / longitude to show repair_shop\'s
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
                          Changing repair shop's lat/lng will also change the
                          map's pin
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
                          {this.state.repair_shop.payment_details
                            ? this.state.repair_shop.payment_details.company ===
                                "" ||
                              this.state.repair_shop.payment_details.company ===
                                null
                              ? "N/A"
                              : this.state.repair_shop.payment_details.company
                            : "N/A"}
                        </div>
                        <div className={"info_descr"}> Currency </div>
                        <div className={"info_span"}>
                          {this.state.repair_shop.payment_details
                            ? this.state.repair_shop.payment_details
                                .currency === "" ||
                              this.state.repair_shop.payment_details
                                .currency === null
                              ? "N/A"
                              : this.state.repair_shop.payment_details.currency
                            : "N/A"}
                        </div>
                        <div className={"info_descr"}>
                          {this.state.repair_shop.payment_details.currency ===
                          "GBP"
                            ? "Account Number"
                            : "IBAN"}
                        </div>
                        <div className={"info_span"}>
                          {this.state.repair_shop.payment_details
                            ? this.state.repair_shop.payment_details.iban ===
                                "" ||
                              this.state.repair_shop.payment_details.iban ===
                                null
                              ? "N/A"
                              : this.state.repair_shop.payment_details.iban
                            : "N/A"}
                        </div>
                        <div className={"info_descr"}>
                          {this.state.repair_shop.payment_details.currency ===
                          "GBP"
                            ? "Sort Code"
                            : "Swift"}
                        </div>
                        <div className={"info_span"}>
                          {this.state.repair_shop.payment_details
                            ? this.state.repair_shop.payment_details.swift ===
                                "" ||
                              this.state.repair_shop.payment_details.swift ===
                                null
                              ? "N/A"
                              : this.state.repair_shop.payment_details.swift
                            : "N/A"}
                        </div>
                      </Card.Body>
                      <Card.Footer>
                        <EditPaymentDetails
                          object_id={this.state.repair_shop.id}
                          object_name={this.state.repair_shop.name}
                          object_type={"Repair Shop"}
                          update_state={this.update_state}
                          payment_details={
                            this.state.repair_shop.payment_details
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

export default RepairShopOverView;
