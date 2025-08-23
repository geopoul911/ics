// Built-ins
import React from "react";

// Icons-images
import { BsInfoSquare } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";
import ReactCountryFlag from "react-country-flag";
import { FaFlag, FaHashtag, FaCheck } from "react-icons/fa";
import { IoMdBarcode } from "react-icons/io";
import { ImCross } from "react-icons/im";

// Custom Made Components
import ChangeName from "../../../modals/change_name";
import ChangeLatLng from "../../../modals/change_lat_lng";
import ChangeEnabled from "../../../modals/change_enabled";
import ChangeCountry from "../../../modals/change_country";
import ChangeCode from "../../../modals/railway_stations/change_code";
import DeleteObjectModal from "../../../modals/delete_object";
import GoogleMap from "../../../core/map/map";

// Global Variables
import {
  headers,
  loader,
  pageHeader,
  forbidden,
  restrictedUsers,
} from "../../../global_vars";

// Functions / Modules
import axios from "axios";
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import Swal from "sweetalert2";

// Variables
window.Swal = Swal;

const VIEW_RAILWAY_STATION =
  "http://localhost:8000/api/data_management/railway_station/";

function getRailwayStationId() {
  return window.location.pathname.split("/")[3];
}

let overviewIconStyle = { color: "#F3702D", marginRight: "0.5em" };

class RailwayStationOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      railway_station: {},
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
      .get(VIEW_RAILWAY_STATION + getRailwayStationId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          railway_station: res.data.railway_station,
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
    this.setState({ railway_station: update_state });
  };

  render() {
    return (
      <>
        <div className="mainContainer">
          {pageHeader(
            "railway_station_overview",
            this.state.railway_station.name
          )}
          {this.state.forbidden ? (
            <>{forbidden("railway Station Overview")}</>
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
                        Railway Station Information
                      </Card.Header>
                      <Card.Body>
                        <div className={"info_descr"}>
                          <FaHashtag style={overviewIconStyle} /> Name
                        </div>
                        <div className={"info_span"}>
                          {this.state.railway_station.name
                            ? this.state.railway_station.name
                            : "N/A"}
                        </div>

                        <ChangeName
                          object_id={this.state.railway_station.id}
                          object_name={this.state.railway_station.name}
                          object_type={"RailwayStation"}
                          update_state={this.update_state}
                        />
                        <div className={"info_descr"}>
                          <IoMdBarcode style={overviewIconStyle} />
                          Code
                        </div>
                        <div className={"info_span"}>
                          {this.state.railway_station.codethree
                            ? this.state.railway_station.codethree
                            : "N/A"}
                        </div>
                        <ChangeCode
                          railway_station_id={this.state.railway_station.id}
                          name={this.state.railway_station.name}
                          update_state={this.update_state}
                          code={
                            this.state.railway_station.codethree
                              ? this.state.railway_station.codethree
                              : "N/A"
                          }
                        />
                        <div className={"info_descr"}>
                          <FaMapMarkerAlt style={overviewIconStyle} />
                          Lat / Lng
                        </div>
                        <ChangeLatLng
                          object_id={this.state.railway_station.id}
                          object_name={this.state.railway_station.name}
                          object_type={"RailwayStation"}
                          update_state={this.update_state}
                          lat={this.state.railway_station.lat}
                          lng={this.state.railway_station.lng}
                        />
                        <div className={"lat_lng_span"}>
                          {this.state.railway_station.lat
                            ? this.state.railway_station.lat
                            : "N/A"}
                        </div>
                        <div
                          style={{ marginLeft: 35 }}
                          className={"lat_lng_span"}
                        >
                          {this.state.railway_station.lng
                            ? this.state.railway_station.lng
                            : "N/A"}
                        </div>
                        <div className={"info_descr"}>
                          <FaFlag style={overviewIconStyle} /> Nationality
                        </div>
                        <div className={"info_span"}>
                          {this.state.railway_station.nationality ? (
                            <ReactCountryFlag
                              countryCode={
                                this.state.railway_station.nationality.code
                              }
                              svg
                              style={{
                                width: "1.5em",
                                height: "1.5em",
                                marginRight: 10,
                              }}
                              title={
                                this.state.railway_station.nationality.code
                              }
                            />
                          ) : (
                            ""
                          )}
                          {this.state.railway_station.nationality
                            ? this.state.railway_station.nationality.name
                            : "N/A"}
                        </div>
                        <ChangeCountry
                          object_id={this.state.railway_station.id}
                          object_name={this.state.railway_station.name}
                          object_type={"Railway Station"}
                          update_state={this.update_state}
                          country={
                            this.state.railway_station.nationality
                              ? this.state.railway_station.nationality
                              : ""
                          }
                        />
                        <div className={"info_descr"}>
                          {this.state.railway_station.enabled ? (
                            <FaCheck style={overviewIconStyle} />
                          ) : (
                            <ImCross style={overviewIconStyle} />
                          )}
                          Enabled
                        </div>
                        <div className={"info_span"}>
                          {this.state.railway_station.enabled
                            ? "Enabled"
                            : "Disabled"}
                        </div>
                        <ChangeEnabled
                          object_id={this.state.railway_station.id}
                          object_name={this.state.railway_station.name}
                          object_type={"Railway Station"}
                          update_state={this.update_state}
                        />
                      </Card.Body>
                      <Card.Footer>
                        <DeleteObjectModal
                          object_id={this.state.railway_station.id}
                          object_name={this.state.railway_station.name}
                          object_type={"Railway Station"}
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
                        Map with Railway Station's location
                      </Card.Header>
                      {this.state.railway_station.lat ||
                      this.state.railway_station.lng ? (
                        <>
                          <Card.Body>
                            <GoogleMap object={this.state.railway_station} />
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
                          Update latitude / longitude to show Railway Station\'s
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
                          Changing Railway Station's lat/lng will also change
                          the map's pin
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

export default RailwayStationOverView;
