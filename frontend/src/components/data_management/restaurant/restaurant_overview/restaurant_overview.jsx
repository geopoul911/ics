// Built-ins
import React from "react";

// Icons-images
import { BsInfoSquare } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaHashtag, FaCheck, FaGlobe } from "react-icons/fa";
import { FaAddressCard } from "react-icons/fa";
import { BsFillTelephoneFill } from "react-icons/bs";
import { MdAlternateEmail } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { MdOutlineReduceCapacity } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import { FiType } from "react-icons/fi";
import { FaMinus } from "react-icons/fa";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { GiConvergenceTarget } from "react-icons/gi";
import { BsMailbox } from "react-icons/bs";
import { IoMdBusiness } from "react-icons/io";

// Functions / modules
import axios from "axios";
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import Swal from "sweetalert2";

// Custom Made Components
import ChangeName from "../../../modals/change_name";
import GoogleMap from "../../../core/map/map";
import ChangeType from "../../../modals/restaurants/change_type";
import ChangeAddress from "../../../modals/change_address";
import ChangeEmail from "../../../modals/change_email";
import ChangeTel from "../../../modals/change_tel";
import ChangeWebsite from "../../../modals/change_website";
import ChangeEnabled from "../../../modals/change_enabled";
import DeleteObjectModal from "../../../modals/delete_object";
import ChangeLatLng from "../../../modals/change_lat_lng";
import ChangeCapacity from "../../../modals/restaurants/change_capacity";
import ChangeRating from "../../../modals/change_rating";
import EditPaymentDetails from "../../../modals/edit_payment_details";
import Notes from "../../../core/notes/notes";
import ContactPersons from "../../../core/contact_persons/contact_persons";
import ChangeAddress2 from "../../../modals/change_address2";
import ChangePostal from "../../../modals/change_postal";
import ChangeRegion from "../../../modals/change_region";

// Icons / Images
import { AiFillStar } from "react-icons/ai";
import { BsStarHalf } from "react-icons/bs";
import { AiOutlineStar } from "react-icons/ai";
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

let starStyle = {
  color: "orange",
  fontSize: "1.5em",
  display: "inline-block",
};

const VIEW_RESTAURANT = "http://localhost:8000/api/data_management/restaurant/";

function getRestaurantId() {
  return window.location.pathname.split("/")[3];
}

const calculateRestaurantStars = (rating) => {
  if (rating !== "" && rating !== null) {
    let results = [];
    let string_rating = rating.toString();
    let fullStars = string_rating[0];
    let halfStars = string_rating[1];
    let emptyStars = 5 - parseInt(rating / 10);
    // full stars loop
    for (var i = 0; i < Number(fullStars); i++) {
      results.push(<AiFillStar style={starStyle} />);
    }
    // half star
    if (halfStars === 5) {
      results.push(
        <BsStarHalf
          style={{
            color: "orange",
            fontSize: "1.3em",
            display: "inline-block",
          }}
        />
      );
    }
    // empty star
    for (var l = 0; l < Number(emptyStars); l++) {
      if (fullStars === "4" && halfStars !== "0") {
      } else {
        results.push(<AiOutlineStar style={starStyle} />);
      }
    }
    return results;
  }
};

// Restaurant overview page Class
class RestaurantOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurant: {
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
      .get(VIEW_RESTAURANT + getRestaurantId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          restaurant: res.data.restaurant,
          notes: res.data.restaurant.notes,
          contact_persons: res.data.restaurant.contact_persons,
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
    this.setState({ restaurant: update_state });
  };

  update_notes = (notes) => {
    var restaurant = { ...this.state.restaurant };
    restaurant.notes = notes;
    this.setState({
      restaurant: restaurant,
    });
  };

  add_contact_person = (contact_persons) => {
    var restaurant = { ...this.state.restaurant };
    restaurant.contact_persons = contact_persons;
    this.setState({
      restaurant: restaurant,
      contact_persons: contact_persons,
    });
  };

  render() {
    return (
      <>
        <div className="mainContainer">
          {pageHeader("restaurant_overview", this.state.restaurant.name)}
          {this.state.forbidden ? (
            <>{forbidden("Restaurant Overview")}</>
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
                      Restaurant Information
                    </Card.Header>
                    <Card.Body>
                      <div className={"info_descr"}>
                        <FaHashtag style={overviewIconStyle} /> Name
                      </div>
                      <div className={"info_span"}>
                        {this.state.restaurant.name
                          ? this.state.restaurant.name
                          : "N/A"}
                      </div>
                      <ChangeName
                        object_id={this.state.restaurant.id}
                        object_name={this.state.restaurant.name}
                        object_type={"Restaurant"}
                        update_state={this.update_state}
                      />

                      <div className={"info_descr"}> <IoMdBusiness style={overviewIconStyle} /> Company </div>
                      <div className={"info_span"}>
                        {this.state.restaurant.payment_details
                          ? this.state.restaurant.payment_details.company === "" ||
                            this.state.restaurant.payment_details.company === null
                            ? "N/A"
                            : 
                            <span style={{color: this.state.restaurant.payment_details.company === this.state.restaurant.name ? 'blue': ''}}>
                              {this.state.restaurant.payment_details.company}
                            </span>
                          : "N/A"}
                      </div>

                      <div className={"info_descr"}>
                        <FaRegStar style={overviewIconStyle} /> Rating
                      </div>
                      <div className={"info_span"}>
                        {this.state.restaurant.rating
                          ? calculateRestaurantStars(
                              this.state.restaurant.rating
                            )
                          : "N/A"}
                      </div>
                      <ChangeRating
                        object_id={this.state.restaurant.id}
                        object_name={this.state.restaurant.name}
                        object_type={"Restaurant"}
                        update_state={this.update_state}
                      />
                      <div className={"info_descr"}>
                        <FaAddressCard style={overviewIconStyle} /> Address
                      </div>
                      <div className={"info_span"}>
                        {this.state.restaurant.contact.address
                          ? this.state.restaurant.contact.address
                          : "N/A"}
                      </div>
                      <ChangeAddress
                        object_id={this.state.restaurant.id}
                        object_name={this.state.restaurant.name}
                        object_type={"Restaurant"}
                        update_state={this.update_state}
                        address={
                          this.state.restaurant.contact.address
                            ? this.state.restaurant.contact.address
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
                            {this.state.restaurant.contact.address2
                              ? this.state.restaurant.contact.address2
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
                            object_id={this.state.restaurant.id}
                            object_name={this.state.restaurant.name}
                            object_type={"Restaurant"}
                            update_state={this.update_state}
                            address={
                              this.state.restaurant.contact.address2
                                ? this.state.restaurant.contact.address2
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
                        {this.state.restaurant.contact.tel
                          ? this.state.restaurant.contact.tel
                          : "N/A"}
                      </div>
                      <ChangeTel
                        object_id={this.state.restaurant.id}
                        object_name={this.state.restaurant.name}
                        object_type={"Restaurant"}
                        tel_num={"tel"}
                        update_state={this.update_state}
                        telephone={
                          this.state.restaurant.contact.tel
                            ? this.state.restaurant.contact.tel
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
                            {this.state.restaurant.contact.tel2
                              ? this.state.restaurant.contact.tel2
                              : "N/A"}
                          </div>

                          <ChangeTel
                            object_id={this.state.restaurant.id}
                            object_name={this.state.restaurant.name}
                            object_type={"Restaurant"}
                            tel_num={"tel2"}
                            update_state={this.update_state}
                            telephone={
                              this.state.restaurant.contact.tel2
                                ? this.state.restaurant.contact.tel2
                                : "N/A"
                            }
                          />
                          <div className={"info_descr"}>
                            <BsFillTelephoneFill style={overviewIconStyle} />
                            Tel. 3
                          </div>
                          <div className={"info_span"}>
                            {this.state.restaurant.contact.tel3
                              ? this.state.restaurant.contact.tel3
                              : "N/A"}
                          </div>

                          <FaMinus
                            className="minus-icon"
                            title="Hide address 2"
                            style={{ marginLeft: 20 }}
                            onClick={() => this.setState({ show_tel2: false })}
                          />

                          <ChangeTel
                            object_id={this.state.restaurant.id}
                            object_name={this.state.restaurant.name}
                            object_type={"Restaurant"}
                            tel_num={"tel3"}
                            update_state={this.update_state}
                            telephone={
                              this.state.restaurant.contact.tel3
                                ? this.state.restaurant.contact.tel3
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
                        {this.state.restaurant.region ? this.state.restaurant.region : 'N/A'}
                      </div>

                      <ChangeRegion
                        object_id={this.state.restaurant.id}
                        object_name={this.state.restaurant.name}
                        object_type={"Restaurant"}
                        update_state={this.update_state}
                        region_id={this.state.restaurant.region_id}
                        region_type={this.state.restaurant.region_type}
                      />

                      <div className={"info_descr"}>
                        <BsMailbox style={overviewIconStyle} />
                        Postal / Zip code
                      </div>
                      <div className={"info_span"}>
                        {this.state.restaurant.contact.postal
                          ? this.state.restaurant.contact.postal
                          : "N/A"}
                      </div>
                      <ChangePostal
                        object_id={this.state.restaurant.id}
                        object_name={this.state.restaurant.name}
                        object_type={"Restaurant"}
                        update_state={this.update_state}
                        postal={
                          this.state.restaurant.contact.postal
                            ? this.state.restaurant.contact.postal
                            : "N/A"
                        }
                      />
                      <div className={"info_descr"}>
                        <MdOutlineReduceCapacity style={overviewIconStyle} />
                        Capacity
                      </div>
                      <div className={"info_span"}>
                        {this.state.restaurant.capacity
                          ? this.state.restaurant.capacity
                          : "N/A"}
                      </div>
                      <ChangeCapacity
                        object_id={this.state.restaurant.id}
                        object_name={this.state.restaurant.name}
                        object_type={"Restaurant"}
                        update_state={this.update_state}
                        capacity={
                          this.state.restaurant.capacity
                            ? this.state.restaurant.capacity
                            : ""
                        }
                      />
                      <div className={"info_descr"}>
                        <MdAlternateEmail style={overviewIconStyle} />
                        Email
                      </div>
                      <div className={"info_span"}>
                        {this.state.restaurant.contact.email
                          ? this.state.restaurant.contact.email
                          : "N/A"}
                      </div>
                      <ChangeEmail
                        object_id={this.state.restaurant.id}
                        object_name={this.state.restaurant.name}
                        object_type={"Restaurant"}
                        update_state={this.update_state}
                        email={
                          this.state.restaurant.contact.email
                            ? this.state.restaurant.contact.email
                            : "N/A"
                        }
                      />
                      <div className={"info_descr"}>
                        <FaGlobe style={overviewIconStyle} /> Website
                      </div>
                      <div className={"info_span"}>
                        {this.state.restaurant.contact.website
                          ? this.state.restaurant.contact.website
                          : "N/A"}
                      </div>
                      <ChangeWebsite
                        object_id={this.state.restaurant.id}
                        object_name={this.state.restaurant.name}
                        object_type={"Restaurant"}
                        update_state={this.update_state}
                        website={
                          this.state.restaurant.contact.website
                            ? this.state.restaurant.contact.website
                            : "N/A"
                        }
                      />

                      <div className={"info_descr"}>
                        <FaMapMarkerAlt style={overviewIconStyle} />
                        Lat / Lng
                      </div>
                      <ChangeLatLng
                        object_id={this.state.restaurant.id}
                        object_name={this.state.restaurant.name}
                        object_type={"Restaurant"}
                        update_state={this.update_state}
                        lat={this.state.restaurant.lat}
                        lng={this.state.restaurant.lng}
                      />
                      <div className={"lat_lng_span"}>
                        {this.state.restaurant.lat
                          ? this.state.restaurant.lat
                          : "N/A"}
                      </div>
                      <div
                        style={{ marginLeft: 35 }}
                        className={"lat_lng_span"}
                      >
                        {this.state.restaurant.lng
                          ? this.state.restaurant.lng
                          : "N/A"}
                      </div>
                      <div className={"info_descr"}>
                        {this.state.restaurant.enabled ? (
                          <FaCheck style={overviewIconStyle} />
                        ) : (
                          <ImCross style={overviewIconStyle} />
                        )}
                        Enabled
                      </div>
                      <div className={"info_span"}>
                        {this.state.restaurant.enabled ? "Enabled" : "Disabled"}
                      </div>
                      <ChangeEnabled
                        object_id={this.state.restaurant.id}
                        object_name={this.state.restaurant.name}
                        object_type={"Restaurant"}
                        update_state={this.update_state}
                      />
                      <div className={"info_descr"}></div>
                      <div className={"info_descr"}>
                        <FiType style={overviewIconStyle} />
                        Types
                      </div>
                      <div className={"info_span"}>
                        {this.state.restaurant.type.length !== 0
                          ? this.state.restaurant.type.map((e) => (
                              <img
                                src={"http://localhost:8000" + e.icon}
                                alt=""
                                id="restaurant_icon"
                                title={e.description}
                              />
                            ))
                          : "N/A"}
                      </div>
                      <ChangeType
                        restaurant_id={this.state.restaurant.id}
                        name={this.state.restaurant.name}
                        update_state={this.update_state}
                      />

                      <ContactPersons
                        add_contact_person={this.add_contact_person}
                        object_id={this.state.restaurant.id}
                        object_name={this.state.restaurant.name}
                        object_type={"Restaurant"}
                        update_state={this.update_state}
                        contact_persons={this.state.restaurant.contact_persons}
                      />
                    </Card.Body>
                    <Card.Footer>
                      <DeleteObjectModal
                        object_id={this.state.restaurant.id}
                        object_name={this.state.restaurant.name}
                        object_type={"Restaurant"}
                        update_state={this.update_state}
                      />
                    </Card.Footer>
                  </Card>
                  <Notes
                    update_notes={this.update_notes}
                    object_id={this.state.restaurant.id}
                    object_name={this.state.restaurant.name}
                    object_type={"Restaurant"}
                    update_state={this.update_state}
                    notes={this.state.restaurant.notes}
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
                      Map with restaurant's location
                    </Card.Header>
                    {this.state.restaurant.lat || this.state.restaurant.lng ? (
                      <>
                        <Card.Body>
                          <GoogleMap object={this.state.restaurant} />
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
                        Update latitude / longitude to show restaurant\'s
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
                        Changing restaurant's lat/lng will also change the map's
                        pin
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
                        {this.state.restaurant.payment_details
                          ? this.state.restaurant.payment_details.company ===
                              "" ||
                            this.state.restaurant.payment_details.company ===
                              null
                            ? "N/A"
                            : this.state.restaurant.payment_details.company
                          : "N/A"}
                      </div>
                      <div className={"info_descr"}> Currency </div>
                      <div className={"info_span"}>
                        {this.state.restaurant.payment_details
                          ? this.state.restaurant.payment_details.currency ===
                              "" ||
                            this.state.restaurant.payment_details.currency ===
                              null
                            ? "N/A"
                            : this.state.restaurant.payment_details.currency
                          : "N/A"}
                      </div>
                      <div className={"info_descr"}>
                        {this.state.restaurant.payment_details.currency ===
                        "GBP"
                          ? "Account Number"
                          : "IBAN"}
                      </div>
                      <div className={"info_span"}>
                        {this.state.restaurant.payment_details
                          ? this.state.restaurant.payment_details.iban === "" ||
                            this.state.restaurant.payment_details.iban === null
                            ? "N/A"
                            : this.state.restaurant.payment_details.iban
                          : "N/A"}
                      </div>
                      <div className={"info_descr"}>
                        {this.state.restaurant.payment_details.currency ===
                        "GBP"
                          ? "Sort Code"
                          : "Swift"}
                      </div>
                      <div className={"info_span"}>
                        {this.state.restaurant.payment_details
                          ? this.state.restaurant.payment_details.swift ===
                              "" ||
                            this.state.restaurant.payment_details.swift === null
                            ? "N/A"
                            : this.state.restaurant.payment_details.swift
                          : "N/A"}
                      </div>
                    </Card.Body>
                    <Card.Footer>
                      <EditPaymentDetails
                        object_id={this.state.restaurant.id}
                        object_name={this.state.restaurant.name}
                        object_type={"Restaurant"}
                        update_state={this.update_state}
                        payment_details={this.state.restaurant.payment_details}
                      />
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

export default RestaurantOverView;
