// Built-ins
import React from "react";

// Icons / Images
import { BsInfoSquare } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaHashtag } from "react-icons/fa";
import { RiParentLine } from "react-icons/ri";
import { RiMarkupLine } from "react-icons/ri";
import { FiType } from "react-icons/fi";
import { MdBlock } from "react-icons/md";

// Modules / Functions
import axios from "axios";
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import Swal from "sweetalert2";

// Custom Made Components
import GoogleMap from "../../../core/map/map";
import ChangeName from "../../../modals/change_name";
import ChangeLatLng from "../../../modals/change_lat_lng";
import ChangeParentRegion from "../../../modals/regions/change_parent_region";
import ChangeMarkup from "../../../modals/regions/change_markup";

import DeleteObjectModal from "../../../modals/delete_object";

// Global Variables
import {
  headers,
  loader,
  pageHeader,
  forbidden,
  restrictedUsers,
} from "../../../global_vars";

const VIEW_REGION = "http://localhost:8000/api/data_management/region/";

function getRegionType() {
  return window.location.pathname.split("/")[3];
}

function getRegionId() {
  return window.location.pathname.split("/")[4];
}

let overviewIconStyle = { color: "#F3702D", marginRight: "0.5em" };

class RegionOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {},
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
      .get(VIEW_REGION + getRegionType() + "/" + getRegionId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          region: res.data.region,
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
    this.setState({ region: update_state });
  };

  render() {
    return (
      <>
        <div className="mainContainer">
          {pageHeader(
            "region_overview",
            `${this.state.region.name}`
          )}
          {this.state.forbidden ? (
            <> {forbidden("Region Overview")} </>
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
                      Region Information
                    </Card.Header>
                    <Card.Body>
                      <div className={"info_descr"}>
                        <FaHashtag style={overviewIconStyle} /> Name
                      </div>
                      <div className={"info_span"}>
                        {this.state.region.name
                          ? this.state.region.name
                          : "N/A"}
                      </div>

                      <ChangeName
                        object_id={this.state.region.id}
                        object_name={this.state.region.name}
                        object_type={getRegionType()}
                        update_state={this.update_state}
                      />

                      <div className={"info_descr"}>
                        <FaMapMarkerAlt style={overviewIconStyle} />
                        Lat / Lng
                      </div>

                      <div className={"lat_lng_span"}>
                        {this.state.region.lat ? this.state.region.lat : "N/A"}
                      </div>
                      <div
                        style={{ marginLeft: 35 }}
                        className={"lat_lng_span"}
                      >
                        {this.state.region.lng ? this.state.region.lng : "N/A"}
                      </div>

                      <ChangeLatLng
                        object_id={this.state.region.id}
                        object_name={this.state.region.name}
                        object_type={getRegionType()}
                        update_state={this.update_state}
                        lat={this.state.region.lat}
                        lng={this.state.region.lng}
                      />

                      <div className={"info_descr"}>
                        <FiType style={overviewIconStyle} /> Region Type
                      </div>

                      <div className={"info_span"}>
                        {getRegionType().charAt(0).toUpperCase() +
                          getRegionType().slice(1)}
                      </div>

                      <MdBlock
                        title={"Region's Type cannot be changed"}
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
                        <RiParentLine style={overviewIconStyle} /> Parent Region
                      </div>
                      <div className={"info_span"}>
                        {getRegionType() === "continent" ? (
                          "N/A"
                        ) : (
                          <>
                            {getRegionType() === "country" &&
                              this.state.region.continent &&
                              this.state.region.continent.name}
                            {getRegionType() === "state" &&
                              this.state.region.country &&
                              this.state.region.country.name}

                            {getRegionType() === "city" && (
                              <>
                                {this.state.region.state
                                  ? `${this.state.region.state.name} ( State )`
                                  : this.state.region.country
                                  ? `${this.state.region.country.name} ( Country )`
                                  : "N/A"}
                              </>
                            )}

                            {getRegionType() === "area" &&
                              this.state.region.city.country ?
                                this.state.region.city && this.state.region.city.name + " - " + this.state.region.city.country.name
                              :
                              this.state.region.city && this.state.region.city.name + " - " + this.state.region.city.state.name
                            }
                          </>
                        )}
                      </div>

                      <ChangeParentRegion
                        object_id={this.state.region.id}
                        object_name={this.state.region.name}
                        object_type={getRegionType()}
                        update_state={this.update_state}
                      />

                      <div className={"info_descr"}>
                        <RiMarkupLine style={overviewIconStyle} /> Markup
                      </div>

                      <ChangeMarkup
                        object_id={this.state.region.id}
                        object_name={this.state.region.name}
                        object_type={getRegionType()}
                        markup={this.state.region.markup}
                        update_state={this.update_state}
                      />

                      <div className={"info_span"}>
                        {this.state.region.markup.toFixed(2)} ( % )
                      </div>
                    </Card.Body>
                    <Card.Footer>
                      <DeleteObjectModal
                        object_id={this.state.region.id}
                        object_name={this.state.region.name}
                        object_type={getRegionType()}
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
                      Map with region's location
                    </Card.Header>
                    {this.state.region.lat || this.state.region.lng ? (
                      <>
                        <Card.Body>
                          <GoogleMap object={this.state.region} />
                        </Card.Body>
                      </>
                    ) : (
                      <strong
                        style={{ textAlign: "center", margin: 20, padding: 20 }}
                      >
                        Update latitude / longitude to show region\'s location
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
                        Changing region's lat/lng will also change the map's pin
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

export default RegionOverView;
