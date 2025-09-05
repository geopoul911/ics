// Built-ins
import React from "react";

// Icons / Images
import { BsInfoSquare } from "react-icons/bs";
import { FaHashtag } from "react-icons/fa";
import { FiType } from "react-icons/fi";
import { BiSort } from "react-icons/bi";
import { FaGlobe } from "react-icons/fa";

// Modules / Functions
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import Swal from "sweetalert2";

// Custom Made Components
import DeleteObjectModal from "../../../modals/delete_object";
import {
  EditCityIdModal,
  EditCityTitleModal,
  EditCityOrderIndexModal,
  EditCityLocationModal,
} from "../../../modals/city_edit_modals";
import axios from "axios";

// Global Variables
import {
  headers,
  pageHeader,
  loader,
} from "../../../global_vars";

// API (Using regions API)
const VIEW_CITY = "http://localhost:8000/api/regions/city/";

// Helpers to read URL like: /regions/city/<city_id>
function getCityIdFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean); // removes '' from // or trailing /
  const idx = parts.indexOf("city");
  if (idx === -1) return null;
  const id = parts[idx + 1] || null;
  return id ? decodeURIComponent(id) : null;
}

let overviewIconStyle = { color: "#93ab3c", marginRight: "0.5em" };

class CityOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: {},
      is_loaded: false,
    };
  }

  componentDidMount() {
    // Update headers with current token
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    const cityId = getCityIdFromPath();

    axios
      .get(`${VIEW_CITY}${cityId}/`, { headers: currentHeaders })
      .then((res) => {
        // Accept a few possible payload shapes safely
        const city =
          res?.data ||
          {};

        this.setState({
          city,
          is_loaded: true,
        });
      })
      .catch((e) => {
        if (e?.response?.status === 401) {
          this.setState({ forbidden: true });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An unknown error has occurred.",
          });
        }
      });
  }

  // When modals return a fresh object, replace state.city
  update_state = (updated) => {
    this.setState({ city: updated });
  };

  render() {
    const { city } = this.state;
    
    return (
      <>
        <div className="mainContainer">
          {pageHeader("city_overview", `${city.title || "City"}`)}
          {this.state.is_loaded ? (
            <>
              <Grid stackable columns={2} divided>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <BsInfoSquare
                        style={{
                          color: "#93ab3c",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      City Information
                    </Card.Header>
                    <Card.Body>
                      {/* City ID */}
                      <div className={"info_descr"}>
                        <FaHashtag style={overviewIconStyle} /> City ID (2–10 chars)
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {city.city_id ? city.city_id : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditCityIdModal
                            city={city}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>

                      {/* Title */}
                      <div className={"info_descr"}>
                        <FiType style={overviewIconStyle} /> City
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {city.title ? city.title : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditCityTitleModal
                            city={city}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>



                      {/* Location (Country & Province) */}
                      <div className={"info_descr"}>
                        <FaGlobe style={overviewIconStyle} /> Country & Province
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {(city.country?.title || "N/A")} {city.province?.title ? ` / ${city.province.title}` : ""}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditCityLocationModal
                            city={city}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>

                      {/* Order by */}
                      <div className={"info_descr"}>
                        <BiSort style={overviewIconStyle} /> Order by
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {(typeof city.orderindex === "number" ||
                          typeof city.orderindex === "string")
                          ? city.orderindex
                          : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditCityOrderIndexModal
                            city={city}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>
                    </Card.Body>
                    <Card.Footer>
                      <DeleteObjectModal
                        objectType="City"
                        objectId={city.city_id}
                        objectName={city.title}
                        warningMessage="This will delete the city and all associated data."
                        onObjectDeleted={() => {
                          window.location.href = "/regions/all_cities";
                        }}
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

export default CityOverview;
