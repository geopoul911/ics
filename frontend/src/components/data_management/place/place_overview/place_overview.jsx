// Built-ins
import React from "react";

// Icons / Images
import { BsInfoSquare } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaFlag } from "react-icons/fa";
import { MdOutlineMyLocation } from "react-icons/md";
import { FaMapMarked } from "react-icons/fa";
import { BsSignpostFill } from "react-icons/bs";
import { FaLandmark } from "react-icons/fa";

// Modules / Functions
import axios from "axios";
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import Swal from "sweetalert2";

// Custom Made Components
import ChangeCity from "../../../modals/places/change_city";
import ChangeCountry from "../../../modals/change_country";
import ChangeLocality from "../../../modals/places/change_locality";
import ChangeDistrict from "../../../modals/places/change_district";
import ChangeLandmark from "../../../modals/places/change_landmark";
import ChangeLatLng from "../../../modals/change_lat_lng";
import GoogleMap from "./modals/google_map";
import DeleteObjectModal from "../../../modals/delete_object";

// Global Variables
import {
  headers,
  loader,
  pageHeader,
  forbidden,
  restrictedUsers,
} from "../../../global_vars";

const VIEW_PLACE = "http://localhost:8000/api/data_management/place/";

function getPlaceId() {
  return window.location.pathname.split("/")[3];
}

let overviewIconStyle = { color: "#F3702D", marginRight: "0.5em" };

class PlaceOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      place: {},
      coach_operator: "",
      notes: {},
      is_loaded: false,
      forbidden: false,
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
      .get(VIEW_PLACE + getPlaceId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          place: res.data.place,
          is_loaded: true,
          attractions: res.data.attractions,
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
    this.setState({ place: update_state });
  };

  render() {
    return (
      <>
        <div className="mainContainer">
          {pageHeader(
            "place_overview",
            `${this.state.place.city} - ${this.state.place.country}`
          )}
          {this.state.forbidden ? (
            <>{forbidden("Place Overview")}</>
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
                      Place Information
                    </Card.Header>
                    <Card.Body>
                      <div className={"info_descr"}>
                        <MdOutlineMyLocation style={overviewIconStyle} /> City
                      </div>
                      <div className={"info_span"}>
                        {this.state.place.city ? this.state.place.city : "N/A"}
                      </div>
                      <ChangeCity
                        place_id={this.state.place.id}
                        name={this.state.place.city}
                        update_state={this.update_state}
                        city={
                          this.state.place.city ? this.state.place.city : "N/A"
                        }
                      />
                      <div className={"info_descr"}>
                        <FaFlag style={overviewIconStyle} /> Country
                      </div>
                      <div className={"info_span"}>
                        {this.state.place.country
                          ? this.state.place.country
                          : "N/A"}
                      </div>
                      <ChangeCountry
                        object_id={this.state.place.id}
                        object_name={this.state.place.city}
                        object_type={"Place"}
                        update_state={this.update_state}
                        country={
                          this.state.place.country
                            ? { name: this.state.place.country }
                            : "N/A"
                        }
                      />
                      <div className={"info_descr"}>
                        <FaMapMarked style={overviewIconStyle} /> Locality
                      </div>
                      <div className={"info_span"}>
                        {this.state.place.locality
                          ? this.state.place.locality
                          : "N/A"}
                      </div>
                      <ChangeLocality
                        place_id={this.state.place.id}
                        name={this.state.place.city}
                        update_state={this.update_state}
                        locality={
                          this.state.place.locality
                            ? this.state.place.locality
                            : "N/A"
                        }
                      />
                      <div className={"info_descr"}>
                        <BsSignpostFill style={overviewIconStyle} /> District
                      </div>
                      <div className={"info_span"}>
                        {this.state.place.district
                          ? this.state.place.district
                          : "N/A"}
                      </div>
                      <ChangeDistrict
                        place_id={this.state.place.id}
                        name={this.state.place.city}
                        update_state={this.update_state}
                        district={
                          this.state.place.district
                            ? this.state.place.district
                            : "N/A"
                        }
                      />
                      <div className={"info_descr"}>
                        <FaLandmark style={overviewIconStyle} /> Landmark
                      </div>
                      <div className={"info_span"}>
                        {this.state.place.landmark
                          ? this.state.place.landmark
                          : "N/A"}
                      </div>
                      <ChangeLandmark
                        place_id={this.state.place.id}
                        name={this.state.place.city}
                        update_state={this.update_state}
                        landmark={
                          this.state.place.landmark
                            ? this.state.place.landmark
                            : "N/A"
                        }
                      />
                      <div className={"info_descr"}>
                        <FaMapMarkerAlt style={overviewIconStyle} />
                        Lat / Lng
                      </div>
                      <ChangeLatLng
                        object_id={this.state.place.id}
                        object_name={this.state.place.city}
                        object_type={"Place"}
                        update_state={this.update_state}
                        lat={this.state.place.lat}
                        lng={this.state.place.lng}
                      />
                      <div className={"lat_lng_span"}>
                        {this.state.place.lat ? this.state.place.lat : "N/A"}
                      </div>
                      <div
                        style={{ marginLeft: 35 }}
                        className={"lat_lng_span"}
                      >
                        {this.state.place.lng ? this.state.place.lng : "N/A"}
                      </div>
                    </Card.Body>
                    <Card.Footer>
                      <DeleteObjectModal
                        object_id={this.state.place.id}
                        object_name={this.state.place.name}
                        object_type={"Place"}
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
                      Map with place's location
                    </Card.Header>
                    {this.state.place.lat || this.state.place.lng ? (
                      <>
                        <Card.Body>
                          <GoogleMap place={this.state.place} />
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
                        Update latitude / longitude to show place\'s location on
                        map
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
                        Changing place's lat/lng will also change the map's pin
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

export default PlaceOverView;
