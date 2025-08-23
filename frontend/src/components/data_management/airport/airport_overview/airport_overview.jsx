// Built-ins
import React from "react";

// Icons-images
import { BsInfoSquare } from "react-icons/bs";
import { MdBlock } from "react-icons/md";
import { FaMapMarkerAlt, FaCity, FaHashtag, FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { GiConvergenceTarget } from "react-icons/gi";

// Functions / modules
import axios from "axios";
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import Swal from "sweetalert2";

// Custom Made Components
import ChangeLocation from "../../../modals/airports/change_location";
import ChangeLatLng from "../../../modals/change_lat_lng";
import ChangeEnabled from "../../../modals/change_enabled";
import DeleteObjectModal from "../../../modals/delete_object";
import GoogleMap from "../../../core/map/map";
import ChangeRegion from "../../../modals/change_region";

// Global Variables
import {
  headers,
  loader,
  pageHeader,
  iconStyle,
  forbidden,
} from "../../../global_vars";

// Variables
window.Swal = Swal;

const VIEW_AIRPORT = "http://localhost:8000/api/data_management/airport/";

let overviewIconStyle = { color: "#93ab3c", marginRight: "0.5em" };

function getAirportId() {
  return window.location.pathname.split("/")[3];
}

class AirportOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      airport: {},
      notes: {},
      is_loaded: false,
      forbidden: false,
    };
  }

  componentDidMount() {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_AIRPORT + getAirportId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          airport: res.data.airport,
          notes: res.data.airport.notes,
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
    this.setState({ airport: update_state });
  };

  add_note = (note) => {
    var airport = { ...this.state.airport };
    airport.notes = note;
    this.setState({
      airport: airport,
      notes: note,
    });
  };

  edit_note = (note) => {
    var airport = { ...this.state.airport };
    airport.notes = note;
    this.setState({
      airport: airport,
      notes: note,
    });
  };

  delete_note = (note) => {
    var airport = { ...this.state.airport };
    airport.notes = note;
    this.setState({
      airport: airport,
      notes: note,
    });
  };

  render() {
    return (
      <>
        <div className="mainContainer">
          {pageHeader("airport_overview", this.state.airport.name)}
          {this.state.forbidden ? (
            <>{forbidden("Updates")}</>
          ) : this.state.is_loaded ? (
            <>
              <Grid stackable columns={2} divided>
                <Grid.Row style={{ marginLeft: 2 }}>
                  <Grid.Column>
                    <Card>
                      <Card.Header>
                        <BsInfoSquare style={iconStyle} /> Airport Information
                      </Card.Header>
                      <Card.Body>
                        <div className={"info_descr"}>
                          <FaHashtag style={overviewIconStyle} /> Name
                        </div>
                        <div className={"info_span"}>
                          {this.state.airport.name
                            ? this.state.airport.name
                            : "N/A"}
                        </div>
                        <MdBlock
                          title={"Airport's name cannot be changed"}
                          style={{
                            color: "red",
                            fontSize: 16,
                            float: "right",
                            marginTop: 5,
                            cursor: "unset",
                          }}
                          className={"edit_icon"}
                        />
                        <div className={"info_descr"}>
                          <FaCity style={overviewIconStyle} /> Location
                        </div>
                        <div className={"info_span"}>
                          {this.state.airport.location
                            ? this.state.airport.location
                            : "N/A"}
                        </div>
                        <ChangeLocation
                          name={this.state.airport.name}
                          update_state={this.update_state}
                          location={this.state.airport.location}
                        />
                        <div className={"info_descr"}>
                          <FaMapMarkerAlt style={overviewIconStyle} />
                          Lat / Lng
                        </div>
                        <ChangeLatLng
                          object_id={this.state.airport.name}
                          object_name={this.state.airport.name}
                          object_type={"Airport"}
                          update_state={this.update_state}
                          lat={this.state.airport.lat}
                          lng={this.state.airport.lng}
                        />
                        <div className={"lat_lng_span"}>
                          {this.state.airport.lat
                            ? this.state.airport.lat
                            : "N/A"}
                        </div>
                        <div
                          style={{ marginLeft: 35 }}
                          className={"lat_lng_span"}
                        >
                          {this.state.airport.lng
                            ? this.state.airport.lng
                            : "N/A"}
                        </div>
                        <div className={"info_descr"}>
                          <GiConvergenceTarget style={overviewIconStyle} />
                          Region
                        </div>

                        <div className={"info_span"}>
                          {this.state.airport.region ? this.state.airport.region : 'N/A'}
                        </div>

                        <ChangeRegion
                          object_id={this.state.airport.name}
                          object_name={this.state.airport.name}
                          object_type={"Airport"}
                          update_state={this.update_state}
                          region_id={this.state.airport.region_id}
                          region_type={this.state.airport.region_type}
                        />
                        <div className={"info_descr"}>
                          {this.state.airport.enabled ? (
                            <FaCheck style={overviewIconStyle} />
                          ) : (
                            <ImCross style={overviewIconStyle} />
                          )}
                          Enabled
                        </div>
                        <div className={"info_span"}>
                          {this.state.airport.enabled ? "Enabled" : "Disabled"}
                        </div>
                        <ChangeEnabled
                          object_id={this.state.airport.name}
                          object_name={this.state.airport.name}
                          object_type={"Airport"}
                          update_state={this.update_state}
                        />
                      </Card.Body>
                      <Card.Footer>
                        <DeleteObjectModal
                          object_id={this.state.airport.name}
                          object_name={this.state.airport.name}
                          object_type={"Airport"}
                          update_state={this.update_state}
                        />
                      </Card.Footer>
                    </Card>
                  </Grid.Column>
                  <Grid.Column>
                    <Card>
                      <Card.Header>
                        <FaMapMarkerAlt style={iconStyle} />
                        Map with airport's location
                      </Card.Header>
                      {this.state.airport.lat || this.state.airport.lng ? (
                        <>
                          <Card.Body>
                            <GoogleMap object={this.state.airport} />
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
                          Update latitude / longitude to show airport's location
                          on map
                        </strong>
                      )}
                      <Card.Footer>
                        <small>
                          <BsInfoSquare style={iconStyle} />
                          Changing airport's lat/lng will also change the map's
                          pin
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

export default AirportOverView;
