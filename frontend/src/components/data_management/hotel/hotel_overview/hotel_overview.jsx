// Built-ins
import React from "react";

// Modules / Functions
import moment from "moment";
import DatePicker from "react-date-picker";

// Functions / modules
import axios from "axios";
import { Card, CardGroup } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import Swal from "sweetalert2";
import GoogleMap from "../../../core/map/map";

// Modals
import ChangeName from "../../../modals/change_name";
import ChangeAddress from "../../../modals/change_address";
import ChangeEmail from "../../../modals/change_email";
import ChangeTel from "../../../modals/change_tel";
import ShowPricings from "./modals/show_pricings";
import ChangeEnabled from "../../../modals/change_enabled";
import ChangeWebsite from "../../../modals/change_website";
import ChangeLatLng from "../../../modals/change_lat_lng";
import ChangeRating from "../../../modals/change_rating";
import DeleteObjectModal from "../../../modals/delete_object";
import EditPaymentDetails from "../../../modals/edit_payment_details";
import UpdateCategories from "./modals/update_categories";
import ChangePriority from "./modals/change_priority";
import ChangeNumberOfRooms from "./modals/change_number_of_rooms";
import Notes from "../../../core/notes/notes";
import ContactPersons from "../../../core/contact_persons/contact_persons";
import ChangeAddress2 from "../../../modals/change_address2";
import ChangePostal from "../../../modals/change_postal";
import ChangeRegion from "../../../modals/change_region";

// Icons-images
import {
  FaParking,
  FaShower,
  FaFan,
  FaBed,
  FaTemperatureLow,
  FaSmokingBan,
  FaConciergeBell,
  FaFileContract,
  FaLuggageCart,
  FaBath,
  FaWind,
  FaHelicopter,
  FaMapMarkerAlt,
  FaMinus,
  FaRegStar,
  FaHashtag,
  FaCheck,
  FaSpa,
  FaTemperatureHigh,
  FaGlobe,
  FaAddressCard
} from "react-icons/fa";
import {
  FiMonitor,
  FiCoffee,
} from "react-icons/fi";
import {
  AiOutlineWifi,
  AiFillCreditCard,
  AiFillPhone,
  AiOutlinePlusSquare,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";
import { IoMdBusiness, IoIosPricetag } from "react-icons/io";
import {
  MdPets,
  MdBalcony,
  MdFitnessCenter,
  MdBusinessCenter,
  MdRestaurant,
  MdAirportShuttle,
  MdCategory,
  MdOutlinePriorityHigh,
  MdMicrowave,
  MdCleaningServices,
  MdMeetingRoom,
  MdAlternateEmail,
  MdIron,
  MdOutlineDryCleaning,
  MdCreditCard,
} from "react-icons/md";
import {
  BiSwim,
  BiDrink,
  BiFridge,
  BiHandicap
} from "react-icons/bi";
import {
  BsAlarm,
  BsInfoSquare,
  BsHouseFill,
  BsFillHouseFill,
  BsSafe,
  BsMailbox,
  BsStarHalf,
  BsFillTelephoneFill,
} from "react-icons/bs";
import {
  GiFireplace,
  GiConvergenceTarget
} from "react-icons/gi";
import { Ri24HoursFill } from "react-icons/ri";

import { ImCross } from "react-icons/im";

// Global Variables
import {
  headers,
  loader,
  pageHeader,
  forbidden,
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

let selected_date = "";

const VIEW_HOTEL = "http://localhost:8000/api/data_management/hotel/";

function getHotelId() {
  return window.location.pathname.split("/")[3];
}

const GBPConversionRates = {
  EUR: 1.1808,
  CHF: 1.1506,
  USD: 1.2744,
  GBP: 1.00,
};

const EURConversionRates = {
  GBP: 0.8468,
  CHF: 0.9744,
  USD: 1.0791,
  EUR: 1.00,
};

const CHFConversionRates = {
  GBP: 0.8621,
  CHF: 1.0000,
  USD: 1.1159,
  EUR: 1.0254,
};

const USDConversionRates = {
  GBP: 0.7725,
  CHF: 0.8960,
  USD: 1.0000,
  EUR: 0.9189,
};

function getConversionRate(currency, targetCurrency) {
  switch (currency) {
    case 'GBP':
      return GBPConversionRates[targetCurrency];
    case 'EUR':
      return EURConversionRates[targetCurrency];
    case 'CHF':
      return CHFConversionRates[targetCurrency];
    case 'USD':
      return USDConversionRates[targetCurrency];
    default:
      return 1; // Default to 1 if unknown currency
  }
}

function parsePrice(priceStr) {
  if (!priceStr || typeof priceStr !== 'string') {
    return { amount: 0, currency: 'USD' }; // Default to 0 USD if invalid
  }

  const parts = priceStr.split(' ');
  if (parts.length !== 2) {
    return { amount: 0, currency: 'USD' }; // Default to 0 USD if invalid format
  }

  const symbol = parts[0];
  const amount = parseFloat(parts[1]);

  if (isNaN(amount)) {
    return { amount: 0, currency: 'USD' }; // Default to 0 USD if invalid amount
  }

  let currency;
  switch (symbol) {
    case '£':
      currency = 'GBP';
      break;
    case '€':
      currency = 'EUR';
      break;
    case '₣':
      currency = 'CHF';
      break;
    case '$':
      currency = 'USD';
      break;
    default:
      currency = 'USD'; // Default to USD if unknown symbol
  }

  return { amount, currency };
}

function AveragePricing(tds, region) {
  let targetCurrency = 'EUR'; // Set target currency to EUR
  let targetSymbol = '€'; // Set target symbol to €

  if (!region) {
    return 'This Hotel has no region. Average price cannot be calculated'
  }

  if (region.includes('Switzerland')) {
    targetCurrency = 'CHF';
    targetSymbol = '₣';
  } else if (region.includes('United Kingdom')) {
    targetCurrency = 'GBP';
    targetSymbol = '£';
  } else if (region.includes('Europe')) {
    targetCurrency = 'EUR';
    targetSymbol = '€';
  } else {
    // Default to USD if region doesn't match any specific currency
    targetCurrency = 'USD';
    targetSymbol = '$';
  }

  // Calculate the total and average price in the target currency
  if (tds && tds.length === 0) {
    return `${targetSymbol} 0.00`; // Return zero if there are no travel days
  }

  let total = 0;
  for (let i = 0; i < tds.length; i++) {
    const { amount, currency } = parsePrice(tds[i].price);
    const conversionRate = getConversionRate(currency, targetCurrency);
    total += amount * conversionRate;
  }

  let average = total / tds.length;

  // Format the average to two decimal places
  average = average.toFixed(2);

  return `${targetSymbol} ${average}`;
}


const calculateHotelStars = (rating) => {
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

// url path = 'http://localhost:3000/hotel/1'
class HotelOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hotel: {
        notes: [],
        categories: [],
      },
      contract: false,
      selected_date: new Date(),
      contact_persons: [],
      is_loaded: false,
      show_tel2: false,
      show_address2: false,
      forbidden: false,
    };
    this.ChangeDate = this.ChangeDate.bind(this);
  }

  // When component is loaded, load hotel's data
  componentDidMount() {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_HOTEL + getHotelId(), {
        headers: headers,
        params: {
          date: moment(this.state.selected_date).format("YYYY-MM-DD"),
        },
      })
      .then((res) => {
        this.setState({
          hotel: res.data.hotel,
          notes: res.data.hotel.notes,
          categories: res.data.hotel.categories,
          contact_persons: res.data.hotel.contact_persons,
          contract: res.data.contract,
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
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_HOTEL + getHotelId(), {
        headers: headers,
        params: {
          date: moment(this.state.selected_date).format("YYYY-MM-DD"),
        },
      })
      .then((res) => {
        this.setState({
          hotel: res.data.hotel,
          notes: res.data.hotel.notes,
          categories: res.data.hotel.categories,
          contact_persons: res.data.hotel.contact_persons,
          contract: res.data.contract,
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
  };

  update_notes = (notes) => {
    var hotel = { ...this.state.hotel };
    hotel.notes = notes;
    this.setState({
      hotel: hotel,
    });
  };

  add_contact_person = (contact_persons) => {
    var hotel = { ...this.state.hotel };
    hotel.contact_persons = contact_persons;
    this.setState({
      hotel: hotel,
      contact_persons: contact_persons,
    });
  };

  ChangeDate(e) {
    selected_date = e;
    this.setState({
      selected_date: e,
    });
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_HOTEL + getHotelId(), {
        headers: headers,
        params: {
          date: moment(selected_date).format("YYYY-MM-DD"),
        },
      })
      .then((res) => {
        this.setState({
          hotel: res.data.hotel,
          notes: res.data.hotel.notes,
          contact_persons: res.data.hotel.contact_persons,
          contract: res.data.contract,
          is_loaded: true,
        });
      });
  }

  render() {
    console.log(this.state.hotel)
    return (
      <>
        <div className="mainContainer">
          {pageHeader("hotel_overview", this.state.hotel.name)}
          {this.state.forbidden ? (
            <>{forbidden("Hotel Overview")}</>
          ) : this.state.is_loaded ? (
            <>
              <Grid stackable columns={2} divided>
                <Grid.Row style={{ marginLeft: 2 }}>
                  <Grid.Column>
                    <Card>
                      <Card.Header>
                        <BsInfoSquare style={iconStyle} />
                        Hotel Information
                      </Card.Header>
                      <Card.Body>
                        <div className={"info_descr"}>
                          <FaHashtag style={overviewIconStyle} /> Name
                        </div>
                        <div className={"info_span"}>
                          {this.state.hotel.name ? this.state.hotel.name : "N/A"}
                        </div>
                        <ChangeName
                          object_id={this.state.hotel.id}
                          object_name={this.state.hotel.name}
                          object_type={"Hotel"}
                          update_state={this.update_state}
                        />

                        <div className={"info_descr"}> <IoMdBusiness style={overviewIconStyle} /> Company </div>
                        <div className={"info_span"}>
                          {this.state.hotel.payment_details
                            ? this.state.hotel.payment_details.company === "" || this.state.hotel.payment_details.company === null
                              ? "N/A" : 
                              <span style={{color: this.state.hotel.payment_details.company === this.state.hotel.name ? 'blue': ''}}>
                                {this.state.hotel.payment_details.company}
                              </span>
                            : "N/A"
                          }
                        </div>

                        <div className={"info_descr"}>
                          <FaRegStar style={overviewIconStyle} /> Rating
                        </div>
                        <div className={"info_span"}>
                          {this.state.hotel.rating ? calculateHotelStars(this.state.hotel.rating) : "N/A"}
                        </div>
                        <ChangeRating
                          object_id={this.state.hotel.id}
                          object_name={this.state.hotel.name}
                          object_type={"Hotel"}
                          update_state={this.update_state}
                        />
                        <div className={"info_descr"}>
                          <MdCategory style={overviewIconStyle} /> Markets
                        </div>
                        <div className={"info_span"}>
                          {this.state.hotel.categories.length > 0 ? (
                            <ul style={{ listStyle: "circle", marginLeft: 10, marginBottom: 0,}}>
                              {this.state.hotel.categories.map((hc) => {return <li>{hc.name}</li>;})}
                            </ul>
                          ) : (
                            "N/A"
                          )}
                        </div>
                        <UpdateCategories
                          object_id={this.state.hotel.id}
                          object_name={this.state.hotel.name}
                          object_type={"Hotel"}
                          update_state={this.update_state}
                          categories={this.state.hotel.categories}
                        />
                        <div className={"info_descr"}>
                          <FaAddressCard style={overviewIconStyle} /> Address
                        </div>
                        <div className={"info_span"}>
                          {this.state.hotel.contact.address ? this.state.hotel.contact.address : "N/A"}
                        </div>
                        <ChangeAddress
                          object_id={this.state.hotel.id}
                          object_name={this.state.hotel.name}
                          object_type={"Hotel"}
                          update_state={this.update_state}
                          address={this.state.hotel.contact.address ? this.state.hotel.contact.address : "N/A"}
                        />
                        {this.state.show_address2 ? (
                          <>
                            <div className={"info_descr"}>
                              <FaAddressCard style={overviewIconStyle} />
                              Address 2
                            </div>
                            <div className={"info_span"}>
                              {this.state.hotel.contact.address2 ? this.state.hotel.contact.address2 : "N/A"}
                            </div>
                            <FaMinus
                              className="minus-icon"
                              title="Hide address 2"
                              style={{ marginLeft: 20 }}
                              onClick={() =>this.setState({ show_address2: false })}
                            />
                            <ChangeAddress2
                              object_id={this.state.hotel.id}
                              object_name={this.state.hotel.name}
                              object_type={"Hotel"}
                              update_state={this.update_state}
                              address={this.state.hotel.contact.address2 ? this.state.hotel.contact.address2 : "N/A"}
                            />
                          </>
                        ) : (
                          <>
                            <AiOutlinePlusSquare
                              className="plus-icon"
                              title="Show Address 2"
                              style={{ marginLeft: 20 }}
                              onClick={() => this.setState({ show_address2: true })}
                            />
                          </>
                        )}
                        <div className={"info_descr"}>
                          <BsFillTelephoneFill style={overviewIconStyle} /> Tel
                        </div>
                        <div className={"info_span"}>
                          {this.state.hotel.contact.tel ? this.state.hotel.contact.tel : "N/A"}
                        </div>
                        <ChangeTel
                          object_id={this.state.hotel.id}
                          object_name={this.state.hotel.name}
                          object_type={"Hotel"}
                          tel_num={"tel"}
                          update_state={this.update_state}
                          telephone={this.state.hotel.contact.tel ? this.state.hotel.contact.tel : "N/A"}
                        />
                        {this.state.show_tel2 ? (
                          <>
                            <div className={"info_descr"}>
                              <BsFillTelephoneFill style={overviewIconStyle} />
                              Tel. 2
                            </div>
                            <div className={"info_span"}>
                              {this.state.hotel.contact.tel2
                                ? this.state.hotel.contact.tel2
                                : "N/A"}
                            </div>

                            <ChangeTel
                              object_id={this.state.hotel.id}
                              object_name={this.state.hotel.name}
                              object_type={"Hotel"}
                              tel_num={"tel2"}
                              update_state={this.update_state}
                              telephone={
                                this.state.hotel.contact.tel2
                                  ? this.state.hotel.contact.tel2
                                  : "N/A"
                              }
                            />
                            <div className={"info_descr"}>
                              <BsFillTelephoneFill style={overviewIconStyle} />
                              Tel. 3
                            </div>
                            <div className={"info_span"}>
                              {this.state.hotel.contact.tel3
                                ? this.state.hotel.contact.tel3
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
                              object_id={this.state.hotel.id}
                              object_name={this.state.hotel.name}
                              object_type={"Hotel"}
                              tel_num={"tel3"}
                              update_state={this.update_state}
                              telephone={
                                this.state.hotel.contact.tel3
                                  ? this.state.hotel.contact.tel3
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
                          {this.state.hotel.region ? this.state.hotel.region : 'N/A'}
                        </div>

                        <ChangeRegion
                          object_id={this.state.hotel.id}
                          object_name={this.state.hotel.name}
                          object_type={"Hotel"}
                          update_state={this.update_state}
                        />

                        <div className={"info_descr"}>
                          <BsMailbox style={overviewIconStyle} />
                          Postal / Zip code
                        </div>
                        <div className={"info_span"}>
                          {this.state.hotel.contact.postal
                            ? this.state.hotel.contact.postal
                            : "N/A"}
                        </div>
                        <ChangePostal
                          object_id={this.state.hotel.id}
                          object_name={this.state.hotel.name}
                          object_type={"Hotel"}
                          update_state={this.update_state}
                          postal={
                            this.state.hotel.contact.postal
                              ? this.state.hotel.contact.postal
                              : "N/A"
                          }
                        />

                        <div className={"info_descr"}>
                          <MdAlternateEmail style={overviewIconStyle} />
                          Email
                        </div>
                        <div className={"info_span"}>
                          {this.state.hotel.contact.email
                            ? this.state.hotel.contact.email
                            : "N/A"}
                        </div>
                        <ChangeEmail
                          object_id={this.state.hotel.id}
                          object_name={this.state.hotel.name}
                          object_type={"Hotel"}
                          update_state={this.update_state}
                          email={
                            this.state.hotel.contact.email ? this.state.hotel.contact.email : ""
                          }
                        />
                        <div className={"info_descr"}>
                          <MdOutlinePriorityHigh style={overviewIconStyle} /> Priority
                        </div>
                        <div className={"info_span"}>
                          {this.state.hotel.priority ? this.state.hotel.priority : "N/A"}
                        </div>
                        <ChangePriority
                          object_id={this.state.hotel.id}
                          object_name={this.state.hotel.name}
                          object_type={"Hotel"}
                          update_state={this.update_state}
                        />
                        <div className={"info_descr"}>
                          <FaBed style={overviewIconStyle} /> Number Of Rooms
                        </div>
                        <div className={"info_span"}>
                          {this.state.hotel.number_of_rooms ? this.state.hotel.number_of_rooms : "N/A"}
                        </div>
                        <ChangeNumberOfRooms
                          object_id={this.state.hotel.id}
                          object_name={this.state.hotel.name}
                          object_type={"Hotel"}
                          update_state={this.update_state}
                        />
                        <div className={"info_descr"}>
                          <FaGlobe style={overviewIconStyle} /> Website
                        </div>
                        <div className={"info_span"}>
                          {this.state.hotel.contact.website ? this.state.hotel.contact.website : "N/A"}
                        </div>
                        <ChangeWebsite
                          object_id={this.state.hotel.id}
                          object_name={this.state.hotel.name}
                          object_type={"Hotel"}
                          update_state={this.update_state}
                          website={this.state.hotel.contact.website ? this.state.hotel.contact.website : ""}
                        />
                        <div className={"info_descr"}>
                          <FaMapMarkerAlt style={overviewIconStyle} /> Lat / Lng
                        </div>
                        <ChangeLatLng
                          object_id={this.state.hotel.id}
                          object_name={this.state.hotel.name}
                          object_type={"Hotel"}
                          update_state={this.update_state}
                          lat={this.state.hotel.lat}
                          lng={this.state.hotel.lng}
                        />
                        <div className={"lat_lng_span"}>
                          {this.state.hotel.lat ? this.state.hotel.lat : "N/A"}
                        </div>
                        <div style={{ marginLeft: 35 }} className={"lat_lng_span"}>
                          {this.state.hotel.lng ? this.state.hotel.lng : "N/A"}
                        </div>
                        <div className={"info_descr"}>
                          <IoIosPricetag style={overviewIconStyle} /> Avg. Price
                        </div>
                        <div className={"info_span"}>
                          {AveragePricing(this.state.hotel.tds, this.state.hotel.region)}
                        </div>
                        <ShowPricings tds={this.state.hotel.tds} />
                        <ContactPersons
                          add_contact_person={this.add_contact_person}
                          object_id={this.state.hotel.id}
                          object_name={this.state.hotel.name}
                          object_type={"Hotel"}
                          update_state={this.update_state}
                          contact_persons={this.state.hotel.contact_persons}
                        />
                        <div className={"info_descr"}>
                          {this.state.hotel.enabled ? (
                            <FaCheck style={overviewIconStyle} />
                          ) : (
                            <ImCross style={overviewIconStyle} />
                          )}
                          Enabled
                        </div>
                        <div className={"info_span"}>
                          {this.state.hotel.enabled ? "Enabled" : "Disabled"}
                        </div>
                        <ChangeEnabled
                          object_id={this.state.hotel.id}
                          object_name={this.state.hotel.name}
                          object_type={"Hotel"}
                          update_state={this.update_state}
                        />
                      </Card.Body>
                      <Card.Footer>
                        <DeleteObjectModal
                          object_id={this.state.hotel.id}
                          object_name={this.state.hotel.name}
                          object_type={"Hotel"}
                          update_state={this.update_state}
                        />
                        <small className="mr-auto">
                          {this.state.hotel.amenity.has_free_internet ? (<AiOutlineWifi title="Free internet" style={iconStyle}/>) : ("")}
                          {this.state.hotel.amenity.has_parking ? (<FaParking title="Parking" style={iconStyle} />) : ("")}
                          {this.state.hotel.amenity.allows_pets ? (<MdPets title="Pets allowed" style={iconStyle} />) : ("")}
                          {this.state.hotel.amenity.has_swimming_pool ? (<BiSwim title="Swimming pool" style={iconStyle} />) : ("")}
                          {this.state.hotel.amenity.has_airport_shuttle ? (<MdAirportShuttle title="Airport shuttle" style={iconStyle}/>) : ("")}
                          {this.state.hotel.amenity.has_smoking_free_facilities ? (<FaSmokingBan title="No smoking" style={iconStyle}/>) : ("")}
                          {this.state.hotel.amenity.has_fitness_center ? (<MdFitnessCenter title="Fitness center" style={iconStyle}/>) : ("")}
                          {this.state.hotel.amenity.has_handicapped_room_facilities ? (<BiHandicap title="Handicapped room facilities" style={iconStyle}/>) : ("")}
                          {this.state.hotel.amenity.has_business_center ? (<MdBusinessCenter title="Business center" style={iconStyle}/>) : ("")}
                          {this.state.hotel.amenity.has_restaurant ? (<MdRestaurant title="Restaurant" style={iconStyle}/>) : ("")}
                          {this.state.hotel.amenity.has_cable_tv ? (<FiMonitor title="Cable TV" style={iconStyle} />) : ("")}
                          {this.state.hotel.amenity.supports_credit_cards ? (<AiFillCreditCard title="Credit cards accepted" style={iconStyle}/>) : ("")}
                          {this.state.hotel.amenity.has_concierge ? (<FaConciergeBell title="Concierge available" style={iconStyle} />) : ("")}
                          {this.state.hotel.amenity.has_telephone ? (<AiFillPhone title="Telephone" style={iconStyle} />) : ("")}
                          {this.state.hotel.amenity.has_alarm_clock ? (<BsAlarm title="Radio alarm clock" style={iconStyle}/>) : ("")}
                          {this.state.hotel.amenity.has_fireplace ? (<GiFireplace title="Fireplace" style={iconStyle} />) : ("")}
                          {this.state.hotel.amenity.has_ceiling_fan ? (<FaFan title="Ceiling fan" style={iconStyle} />) : ("")}
                          {this.state.hotel.amenity.has_mini_bar ? (<BiFridge title="Mini bar" style={iconStyle} />) : ("")}
                          {this.state.hotel.amenity.has_24hour_room_service ? (<Ri24HoursFill title="24 hour room service" style={iconStyle}/>) : ("")}
                          {this.state.hotel.amenity.has_tab ? (<FaShower title="Whirlpool tab and shower" style={iconStyle}/>) : ("")}
                          {this.state.hotel.amenity.has_climate_control ? (<FaTemperatureLow title="Climate control" style={iconStyle} />) : ("")}
                          {this.state.hotel.amenity.has_balcony ? (<MdBalcony title="Private balcony" style={iconStyle}/>) : ("")}
                          {this.state.hotel.amenity.room_service ? (<MdCleaningServices title="Room Service" style={iconStyle} />) : ("")}
                          {this.state.hotel.amenity.has_laundry_service ? (<MdOutlineDryCleaning title="Laundry Service" style={iconStyle}/>) : ("")}
                          {this.state.hotel.amenity.has_spa ? (<FaSpa title="Spa" style={iconStyle}/>) : ("")}
                          {this.state.hotel.amenity.has_sauna ? (<FaTemperatureHigh title="Sauna" style={iconStyle}/>) : ("")}
                          {this.state.hotel.amenity.meeting_rooms ? ( <MdMeetingRoom title="Meeting Room" style={iconStyle}/>) : ("")}
                          {this.state.hotel.amenity.has_concierge_service ? ( <FaConciergeBell title="Concierge Service" style={iconStyle}/>) : ("")}
                          {this.state.hotel.amenity.has_24hour_reception ? (<Ri24HoursFill title="24 Hour Reception" style={iconStyle}/>) : ("")}
                          {this.state.hotel.amenity.has_helipad ? (<FaHelicopter title="Helipad" style={iconStyle}/>) : ("")}
                          {this.state.hotel.amenity.has_bar ? (<BiDrink title="In House Bar" style={iconStyle}/>) : ("")}
                          {this.state.hotel.amenity.has_bellhop_service ? (<FaLuggageCart title="Bellhop Service" style={iconStyle}/>) : ("")}
                          {this.state.hotel.amenity.supports_credit_cards ? (<AiFillCreditCard title="Credit Cards" style={iconStyle}/>) : ("")}
                          {this.state.hotel.amenity.has_coffee_maker ? (<FiCoffee title="Coffee Maker" style={iconStyle}/>) : ("")}
                          {this.state.hotel.amenity.has_microwave ? (<MdMicrowave title="Microwave" style={iconStyle}/>) : ("")}
                          {this.state.hotel.amenity.has_safe_deposit_box ? (<BsSafe title="Safe Deposit Box" style={iconStyle} />) : ("")}
                          {this.state.hotel.amenity.has_ironing_board ? (<MdIron title="Ironing Board" style={iconStyle}/>) : ("")}
                          {this.state.hotel.amenity.has_jacuzzi ? (<FaBath title="Jacuzzi" style={iconStyle}/>) : ("")}
                          {this.state.hotel.amenity.has_hairdryer ? (<FaWind title="Hairdryer" style={iconStyle}/>) : ("")}
                        </small>
                      </Card.Footer>
                    </Card>
                    <Card>
                      <Card.Header>
                        <div>
                          <BsHouseFill style={iconStyle} /> Room Availability for
                          <DatePicker
                            wrapperClassName="datePicker"
                            clearIcon={null}
                            format={"dd/MM/y"}
                            style={{ marginLeft: 20, float: "right" }}
                            name="date_from"
                            value={this.state.selected_date}
                            onChange={this.ChangeDate}
                          />
                          <label style={{ float: "right" }}>
                            {this.state.contract ? (<><FaFileContract style={iconStyle}/> Contract: {this.state.contract.name}</>) : (<></>)}
                          </label>
                        </div>
                      </Card.Header>
                      <Card.Body>
                        {this.state.contract ? (
                          <CardGroup>
                            <Card style={{ margin: 0 }}>
                              <Card.Header>Single</Card.Header>
                              <Card.Body>
                                {this.state.contract.room_contract.filter(
                                  (room) => room.room_type === "SGL" && room.date === moment(this.state.selected_date).format("YYYY-MM-DD")
                                ).length === 0
                                  ? "No Rooms"
                                  : this.state.contract.room_contract
                                      .filter((room) => room.room_type === "SGL" && room.date === moment(this.state.selected_date).format("YYYY-MM-DD"))
                                      .map((room) => (
                                        <BsFillHouseFill style={{color: room.available ? "green" : "red",}}/>
                                      ))}
                              </Card.Body>
                              <Card.Footer>
                                total:
                                {
                                  this.state.contract.room_contract.filter((room) => room.room_type === "SGL" && room.date === moment(this.state.selected_date).format("YYYY-MM-DD")
                                  ).length
                                }
                              </Card.Footer>
                            </Card>
                            <Card style={{ margin: 0 }}>
                              <Card.Header>Double</Card.Header>
                              <Card.Body>
                                {this.state.contract.room_contract.filter((room) =>
                                  room.room_type === "DBL" &&
                                  room.date === moment(this.state.selected_date).format("YYYY-MM-DD")
                                ).length === 0 ? "No Rooms"
                                  : this.state.contract.room_contract
                                    .filter((room) => room.room_type === "DBL" && room.date === moment(this.state.selected_date).format("YYYY-MM-DD"))
                                    .map((room) => (<BsFillHouseFill style={{color: room.available ? "green" : "red" }} />))}
                              </Card.Body>
                              <Card.Footer>
                                total:
                                {
                                  this.state.contract.room_contract.filter((room) =>
                                    room.room_type === "DBL" && room.date === moment(this.state.selected_date).format("YYYY-MM-DD")).length
                                }
                              </Card.Footer>
                            </Card>
                            <Card style={{ margin: 0 }}>
                              <Card.Header>Twin</Card.Header>
                              <Card.Body>
                                {this.state.contract.room_contract.filter(
                                  (room) =>
                                    room.room_type === "TWIN" &&
                                    room.date === moment(this.state.selected_date).format("YYYY-MM-DD")
                                ).length === 0
                                  ? "No Rooms"
                                  : this.state.contract.room_contract
                                      .filter(
                                        (room) =>
                                          room.room_type === "TWIN" &&
                                          room.date ===
                                            moment(
                                              this.state.selected_date
                                            ).format("YYYY-MM-DD")
                                      )
                                      .map((room) => (
                                        <BsFillHouseFill
                                          style={{
                                            color: room.available
                                              ? "green"
                                              : "red",
                                          }}
                                        />
                                      ))}
                              </Card.Body>
                              <Card.Footer> total: {this.state.contract.room_contract.filter(
                                  (room) => room.room_type === "TWIN" && room.date ===   moment(this.state.selected_date).format("YYYY-MM-DD")).length
                                }
                              </Card.Footer>
                            </Card>
                            <Card style={{ margin: 0 }}>
                              <Card.Header>Triple</Card.Header>
                              <Card.Body>
                                {this.state.contract.room_contract.filter(
                                  (room) => room.room_type === "TRPL" && room.date === moment(this.state.selected_date).format("YYYY-MM-DD")).length === 0
                                  ? "No Rooms" : this.state.contract.room_contract
                                    .filter((room) => room.room_type === "TRPL" && room.date === moment(this.state.selected_date).format("YYYY-MM-DD"))
                                    .map((room) => (
                                      <BsFillHouseFill style={{ color: room.available ? "green" : "red" }} />
                                    ))
                                }
                              </Card.Body>
                              <Card.Footer>
                                total:
                                {
                                  this.state.contract.room_contract.filter(
                                    (room) =>
                                      room.room_type === "TRPL" &&
                                      room.date ===
                                        moment(this.state.selected_date).format(
                                          "YYYY-MM-DD"
                                        )
                                  ).length
                                }
                              </Card.Footer>
                            </Card>
                            <Card style={{ margin: 0 }}>
                              <Card.Header>Quad</Card.Header>
                              <Card.Body>
                                {this.state.contract.room_contract.filter(
                                  (room) =>
                                    room.room_type === "QUAD" &&
                                    room.date ===
                                      moment(this.state.selected_date).format(
                                        "YYYY-MM-DD"
                                      )
                                ).length === 0
                                  ? "No Rooms"
                                  : this.state.contract.room_contract
                                      .filter(
                                        (room) =>
                                          room.room_type === "QUAD" &&
                                          room.date ===
                                            moment(
                                              this.state.selected_date
                                            ).format("YYYY-MM-DD")
                                      )
                                      .map((room) => (
                                        <BsFillHouseFill
                                          style={{
                                            color: room.available
                                              ? "green"
                                              : "red",
                                          }}
                                        />
                                      ))}
                              </Card.Body>
                              <Card.Footer>
                                total:
                                {
                                  this.state.contract.room_contract.filter(
                                    (room) =>
                                      room.room_type === "QUAD" &&
                                      room.date ===
                                        moment(this.state.selected_date).format(
                                          "YYYY-MM-DD"
                                        )
                                  ).length
                                }
                              </Card.Footer>
                            </Card>
                          </CardGroup>
                        ) : (
                          <>
                            No contract has been found related to this hotel for
                            {moment(this.state.selected_date).format(
                              "YYYY-MM-DD"
                            )}
                            .
                          </>
                        )}
                      </Card.Body>
                      <Card.Footer>
                        To Edit Contract's period, number of rooms or other
                        data, head over to
                        <a href="/data_management/all_contracts">
                          Data Management / Contracts
                        </a>
                      </Card.Footer>
                    </Card>
                  </Grid.Column>
                  <Grid.Column>
                    <Card>
                      <Card.Header>
                        <FaMapMarkerAlt style={iconStyle} />
                        Map with hotel's location
                      </Card.Header>
                      {this.state.hotel.lat || this.state.hotel.lng ? (
                        <>
                          <Card.Body>
                            <GoogleMap object={this.state.hotel} />
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
                          Update latitude / longitude to show hotel\'s location
                          on map
                        </strong>
                      )}
                      <Card.Footer>
                        <small className="mr-auto">
                          <BsInfoSquare style={iconStyle} />
                          Changing hotel's lat/lng will also change the map's
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
                          {this.state.hotel.payment_details
                            ? this.state.hotel.payment_details.company === "" ||
                              this.state.hotel.payment_details.company === null
                              ? "N/A"
                              : this.state.hotel.payment_details.company
                            : "N/A"}
                        </div>
                        <div className={"info_descr"}> Currency </div>
                        <div className={"info_span"}>
                          {this.state.hotel.payment_details
                            ? this.state.hotel.payment_details.currency ===
                                "" ||
                              this.state.hotel.payment_details.currency === null
                              ? "N/A"
                              : this.state.hotel.payment_details.currency
                            : "N/A"}
                        </div>
                        <div className={"info_descr"}>
                          {this.state.hotel.payment_details.currency === "GBP"
                            ? "Account Number"
                            : "IBAN"}
                        </div>
                        <div className={"info_span"}>
                          {this.state.hotel.payment_details
                            ? this.state.hotel.payment_details.iban === "" ||
                              this.state.hotel.payment_details.iban === null
                              ? "N/A"
                              : this.state.hotel.payment_details.iban
                            : "N/A"}
                        </div>
                        <div className={"info_descr"}>
                          {this.state.hotel.payment_details.currency === "GBP"
                            ? "Sort Code"
                            : "Swift"}
                        </div>
                        <div className={"info_span"}>
                          {this.state.hotel.payment_details
                            ? this.state.hotel.payment_details.swift === "" ||
                              this.state.hotel.payment_details.swift === null
                              ? "N/A"
                              : this.state.hotel.payment_details.swift
                            : "N/A"}
                        </div>
                      </Card.Body>
                      <Card.Footer>
                        <EditPaymentDetails
                          object_id={this.state.hotel.id}
                          object_name={this.state.hotel.name}
                          object_type={"Hotel"}
                          update_state={this.update_state}
                          payment_details={this.state.hotel.payment_details}
                        />
                      </Card.Footer>
                    </Card>
                    <Notes
                      update_notes={this.update_notes}
                      object_id={this.state.hotel.id}
                      object_name={this.state.hotel.name}
                      object_type={"Hotel"}
                      update_state={this.update_state}
                      notes={this.state.hotel.notes}
                    />
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

export default HotelOverView;
