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
import ChangeCode from "../../../modals/ports/change_code";
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

const VIEW_PORT = "http://localhost:8000/api/data_management/port/";

function getPortId() {
  return window.location.pathname.split("/")[3];
}

let overviewIconStyle = { color: "#F3702D", marginRight: "0.5em" };

class PortOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      port: {},
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
      .get(VIEW_PORT + getPortId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          port: res.data.port,
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
    this.setState({ port: update_state });
  };

  render() {
    return (
      <>
        <div className="mainContainer">
          {pageHeader("port_overview", this.state.port.name)}

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
                        Port Information
                      </Card.Header>
                      <Card.Body>
                        <div className={"info_descr"}>
                          <FaHashtag style={overviewIconStyle} /> Name
                        </div>
                        <div
                          className={
                            this.state.port.name ? "info_span" : "red_info_span"
                          }
                        >
                          {this.state.port.name ? this.state.port.name : "N/A"}
                        </div>
                        <ChangeName
                          object_id={this.state.port.id}
                          object_name={this.state.port.name}
                          object_type={"Port"}
                          update_state={this.update_state}
                        />
                        <div className={"info_descr"}>
                          <IoMdBarcode style={overviewIconStyle} />
                          Code
                        </div>
                        <div className={"info_span"}>
                          {this.state.port.codethree
                            ? this.state.port.codethree
                            : "N/A"}
                        </div>
                        <ChangeCode
                          port_id={this.state.port.id}
                          name={this.state.port.name}
                          update_state={this.update_state}
                          code={
                            this.state.port.codethree
                              ? this.state.port.codethree
                              : "N/A"
                          }
                        />
                        <div className={"info_descr"}>
                          <FaMapMarkerAlt style={overviewIconStyle} />
                          Lat / Lng
                        </div>
                        <ChangeLatLng
                          object_id={this.state.port.id}
                          object_name={this.state.port.name}
                          object_type={"Port"}
                          update_state={this.update_state}
                          lat={this.state.port.lat}
                          lng={this.state.port.lng}
                        />
                        <div className={"lat_lng_span"}>
                          {this.state.port.lat ? this.state.port.lat : "N/A"}
                        </div>
                        <div
                          style={{ marginLeft: 35 }}
                          className={"lat_lng_span"}
                        >
                          {this.state.port.lng ? this.state.port.lng : "N/A"}
                        </div>
                        <div className={"info_descr"}>
                          <FaFlag style={overviewIconStyle} /> Nationality
                        </div>
                        <div className={"info_span"}>
                          {this.state.port.nationality ? (
                            <ReactCountryFlag
                              countryCode={this.state.port.nationality.code}
                              svg
                              style={{
                                width: "1.5em",
                                height: "1.5em",
                                marginRight: 10,
                              }}
                              title={this.state.port.nationality.code}
                            />
                          ) : (
                            ""
                          )}
                          {this.state.port.nationality
                            ? this.state.port.nationality.name
                            : "N/A"}
                        </div>
                        <ChangeCountry
                          object_id={this.state.port.id}
                          object_name={this.state.port.name}
                          object_type={"Port"}
                          update_state={this.update_state}
                          country={
                            this.state.port.nationality
                              ? this.state.port.nationality
                              : "N/A"
                          }
                        />
                        <div className={"info_descr"}>
                          {this.state.port.enabled ? (
                            <FaCheck style={overviewIconStyle} />
                          ) : (
                            <ImCross style={overviewIconStyle} />
                          )}
                          Enabled
                        </div>
                        <div className={"info_span"}>
                          {this.state.port.enabled ? "Enabled" : "Disabled"}
                        </div>
                        <ChangeEnabled
                          object_id={this.state.port.id}
                          object_name={this.state.port.name}
                          object_type={"Port"}
                          update_state={this.update_state}
                        />
                      </Card.Body>
                      <Card.Footer>
                        <DeleteObjectModal
                          object_id={this.state.port.id}
                          object_name={this.state.port.name}
                          object_type={"Port"}
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
                        Map with port's location
                      </Card.Header>
                      {this.state.port.lat || this.state.port.lng ? (
                        <>
                          <Card.Body>
                            <GoogleMap object={this.state.port} />
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
                          Update latitude / longitude to show port\'s location
                          on map
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
                          Changing port's lat/lng will also change the map's pin
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

export default PortOverView;
