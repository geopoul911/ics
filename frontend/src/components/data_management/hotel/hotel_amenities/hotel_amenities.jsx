// Built-ins
import React from "react";

// Icons-images
import {
  FaParking,
  FaHotel,
  FaTemperatureLow,
  FaSmokingBan,
  FaSpa,
  FaTemperatureHigh,
} from "react-icons/fa";
import { FiCoffee } from "react-icons/fi";
import { AiOutlineWifi, } from "react-icons/ai";
import {
  MdPets,
  MdFitnessCenter,
  MdElevator,
  MdCleaningServices,
  MdOutlineMeetingRoom,
  MdRestaurant,
  MdAirportShuttle,
} from "react-icons/md";
import { BiSwim, BiFridge, BiSave, BiDrink } from "react-icons/bi";
import { BsSafe } from "react-icons/bs";
import { Ri24HoursFill } from "react-icons/ri";

// Functions / modules
import axios from "axios";
import { Button } from "semantic-ui-react";
import { Card, Form } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import { headers, loader, pageHeader, forbidden } from "../../../global_vars";

// Variables
window.Swal = Swal;

const VIEW_HOTEL = "http://localhost:8000/api/data_management/hotel/";
const UPDATE_AMENITIES =
  "http://localhost:8000/api/data_management/update_amenities/";

function getHotelId() {
  return window.location.pathname.split("/")[3];
}

let amenity_icons_style = {
  color: "#F3702D",
  fontSize: "1.5em",
  marginRight: "0.5em",
  marginLeft: "0.5em",
  marginBottom: "0.35em",
};

// Hotel overview page Class
class HotelOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hotel: {},
      is_loaded: false,
      forbidden: false,
    };
    this.update_amenities = this.update_amenities.bind(this);
  }

  componentDidMount() {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_HOTEL + getHotelId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          hotel: res.data.hotel,
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
    this.toggle_amenity_check_box = this.toggle_amenity_check_box.bind(this);
  }

  update_state = (update_state) => {
    this.setState({ hotel: update_state });
  };

  toggle_amenity_check_box(event) {
    const checked = event.target.checked;
    const name = event.target.name;
    var hotel = { ...this.state.hotel };
    hotel.amenity[name] = checked;
    this.setState({ hotel: hotel });
  }

  update_amenities() {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios({
      method: "post",
      url: UPDATE_AMENITIES,
      headers: headers,
      data: {
        hotel_id: this.state.hotel.id,
        amenities: this.state.hotel.amenity,
      },
    })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Successfully updated amenities",
        });
      })
      .catch((e) => {
        // else, sweet alert error message
        Swal.fire({
          icon: "error",
          title: "Error",
          text: e.response.data.errormsg,
        });
      });
  }

  render() {
    return (
      <>
        <div className="mainContainer">
          {pageHeader("hotel_amenities", this.state.hotel.name)}
          {this.state.forbidden ? (
            <>{forbidden("Hotel Amenities")}</>
          ) : this.state.is_loaded ? (
            <>
              <Grid stackable columns={2} divided>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <FaHotel
                        style={{
                          color: "#F3702D",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      Hotel Amenities
                    </Card.Header>
                    <Card.Body>
                      <ul style={{ columns: 3 }}>
                        <li>
                          <label>
                            <Form.Check
                              name={"has_free_internet"}
                              onChange={this.toggle_amenity_check_box}
                              type={"checkbox"}
                              checked={
                                this.state.hotel.amenity.has_free_internet
                              }
                            />
                          </label>
                          <AiOutlineWifi style={amenity_icons_style} />
                          Free Internet
                        </li>
                        <li>
                          <label>
                            <Form.Check
                              name={"has_parking"}
                              onChange={this.toggle_amenity_check_box}
                              type={"checkbox"}
                              checked={this.state.hotel.amenity.has_parking}
                            />
                          </label>
                          <FaParking style={amenity_icons_style} /> Parking
                        </li>
                        <li>
                          <label>
                            <Form.Check
                              name={"allows_pets"}
                              onChange={this.toggle_amenity_check_box}
                              type={"checkbox"}
                              checked={this.state.hotel.amenity.allows_pets}
                            />
                          </label>
                          <MdPets style={amenity_icons_style} />
                          Pets Allowed
                        </li>
                        <li>
                          <label>
                            <Form.Check
                              type={"checkbox"}
                              name={"has_swimming_pool"}
                              onChange={this.toggle_amenity_check_box}
                              checked={
                                this.state.hotel.amenity.has_swimming_pool
                              }
                            />
                          </label>
                          <BiSwim style={amenity_icons_style} />
                          Swimming Pool
                        </li>
                        <li>
                          <label>
                            <Form.Check
                              type={"checkbox"}
                              name={"has_airport_shuttle"}
                              onChange={this.toggle_amenity_check_box}
                              checked={
                                this.state.hotel.amenity.has_airport_shuttle
                              }
                            />
                          </label>
                          <MdAirportShuttle style={amenity_icons_style} />
                          Airport Shuttle
                        </li>
                        <li>
                          <label>
                            <Form.Check
                              type={"checkbox"}
                              name={"has_smoking_free_facilities"}
                              onChange={this.toggle_amenity_check_box}
                              checked={
                                this.state.hotel.amenity
                                  .has_smoking_free_facilities
                              }
                            />
                          </label>
                          <FaSmokingBan style={amenity_icons_style} />
                          No Smoking Room Facilities
                        </li>
                        <li>
                          <label>
                            <Form.Check
                              type={"checkbox"}
                              name={"has_fitness_center"}
                              onChange={this.toggle_amenity_check_box}
                              checked={
                                this.state.hotel.amenity.has_fitness_center
                              }
                            />
                          </label>
                          <MdFitnessCenter style={amenity_icons_style} />
                          Fitness Center
                        </li>
                        <li>
                          <label>
                            <Form.Check
                              type={"checkbox"}
                              name={"has_restaurant"}
                              onChange={this.toggle_amenity_check_box}
                              checked={this.state.hotel.amenity.has_restaurant}
                            />
                          </label>
                          <MdRestaurant style={amenity_icons_style} />
                          Restaurant
                        </li>
                        <li>
                          <label>
                            <Form.Check
                              type={"checkbox"}
                              name={"room_service"}
                              onChange={this.toggle_amenity_check_box}
                              checked={this.state.hotel.amenity.room_service}
                            />
                          </label>
                          <MdCleaningServices style={amenity_icons_style} />
                          Room Service
                        </li>
                        <li>
                          <label>
                            <Form.Check
                              type={"checkbox"}
                              name={"has_spa"}
                              onChange={this.toggle_amenity_check_box}
                              checked={this.state.hotel.amenity.has_spa}
                            />
                          </label>
                          <FaSpa style={amenity_icons_style} />
                          Spa
                        </li>
                        <li>
                          <label>
                            <Form.Check
                              type={"checkbox"}
                              name={"has_sauna"}
                              onChange={this.toggle_amenity_check_box}
                              checked={this.state.hotel.amenity.has_sauna}
                            />
                          </label>
                          <FaTemperatureHigh style={amenity_icons_style} />
                          Sauna
                        </li>
                        <li>
                          <label>
                            <Form.Check
                              type={"checkbox"}
                              name={"has_24hour_reception"}
                              onChange={this.toggle_amenity_check_box}
                              checked={
                                this.state.hotel.amenity.has_24hour_reception
                              }
                            />
                          </label>
                          <Ri24HoursFill style={amenity_icons_style} /> 24 Hour
                          Reception
                        </li>
                        <li>
                          <label>
                            <Form.Check
                              type={"checkbox"}
                              name={"has_bar"}
                              onChange={this.toggle_amenity_check_box}
                              checked={this.state.hotel.amenity.has_bar}
                            />
                          </label>
                          <BiDrink style={amenity_icons_style} /> In House Bar
                        </li>
                        <li>
                          <label>
                            <Form.Check
                              type={"checkbox"}
                              name={"has_elevator"}
                              onChange={this.toggle_amenity_check_box}
                              checked={this.state.hotel.amenity.has_elevator}
                            />
                          </label>
                          <MdElevator style={amenity_icons_style} /> Elevator
                        </li>
                      </ul>
                    </Card.Body>
                  </Card>
                </Grid.Column>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <MdOutlineMeetingRoom
                        style={{
                          color: "#F3702D",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      Room Amenities
                    </Card.Header>
                    <Card.Body>
                      <ul style={{ columns: 3 }}>
                        <li>
                          <label>
                            <Form.Check
                              type={"checkbox"}
                              name={"has_mini_bar"}
                              onChange={this.toggle_amenity_check_box}
                              checked={this.state.hotel.amenity.has_mini_bar}
                            />
                          </label>
                          <BiFridge style={amenity_icons_style} /> Mini bar
                        </li>
                        <li>
                          <label>
                            <Form.Check
                              type={"checkbox"}
                              name={"has_24hour_room_service"}
                              onChange={this.toggle_amenity_check_box}
                              checked={
                                this.state.hotel.amenity.has_24hour_room_service
                              }
                            />
                          </label>
                          <Ri24HoursFill style={amenity_icons_style} /> 24 hour
                          room service
                        </li>
                        <li>
                          <label>
                            <Form.Check
                              type={"checkbox"}
                              name={"has_climate_control"}
                              onChange={this.toggle_amenity_check_box}
                              checked={
                                this.state.hotel.amenity.has_climate_control
                              }
                            />
                          </label>
                          <FaTemperatureLow style={amenity_icons_style} />
                          Air Condition
                        </li>
                        <li>
                          <label>
                            <Form.Check
                              type={"checkbox"}
                              name={"has_coffee_maker"}
                              onChange={this.toggle_amenity_check_box}
                              checked={
                                this.state.hotel.amenity.has_coffee_maker
                              }
                            />
                          </label>
                          <FiCoffee style={amenity_icons_style} /> Coffee Maker
                        </li>
                        <li>
                          <label>
                            <Form.Check
                              type={"checkbox"}
                              name={"has_safe_deposit_box"}
                              onChange={this.toggle_amenity_check_box}
                              checked={
                                this.state.hotel.amenity.has_safe_deposit_box
                              }
                            />
                          </label>
                          <BsSafe style={amenity_icons_style} /> Safe Deposit
                          Box
                        </li>
                      </ul>
                    </Card.Body>
                  </Card>
                </Grid.Column>
              </Grid>
              <Button
                color="green"
                onClick={this.update_amenities}
                style={{ margin: 20 }}
              >
                <BiSave /> Save Changes
              </Button>
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
