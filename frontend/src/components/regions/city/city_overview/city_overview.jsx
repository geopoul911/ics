// Built-ins
import React from "react";

// Icons / Images
import { BsInfoSquare } from "react-icons/bs";
import { FaHashtag } from "react-icons/fa";
import { FiType } from "react-icons/fi";

// Modules / Functions

import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import Swal from "sweetalert2";
import axios from "axios";

// Custom Made Components
import DeleteObjectModal from "../../../modals/delete_object";
import {
  EditCityIdModal,
  EditCityTitleModal,
  EditCityCountryModal,
  EditCityProvinceModal,
  EditCityOrderIndexModal,
} from "../../../modals/city_edit_modals";

// Global Variables
import {
  headers,
  pageHeader,
  forbidden,
  loader,
} from "../../../global_vars";

// API base
const VIEW_CITY = "http://localhost:8000/api/regions/city/";

// Helpers to read URL like: /regions/city/<city_id>
function getCityIdFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const idx = parts.indexOf("city");
  if (idx === -1) return null;
  const id = parts[idx + 1] || null;
  return id ? decodeURIComponent(id) : null;
}

let overviewIconStyle = { color: "#F3702D", marginRight: "0.5em" };

class CityOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: {},
      is_loaded: false,
    };
  }

  componentDidMount() {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");

    const cityId = getCityIdFromPath();

    axios
      .get(`${VIEW_CITY}${cityId}`, { headers })
      .then((res) => {
        // Accept a few possible payload shapes safely
        const city =
          res?.data?.city ||
          res?.data?.region || // fallback if backend reused "region"
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
          {this.state.forbidden ? (
            <> {forbidden("City Overview")} </>
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
                      City Information
                    </Card.Header>
                  <Card.Body>
                    {/* Title */}
                    <div className={"info_descr"}>
                      <FiType style={overviewIconStyle} /> Title
                    </div>
                    <div className={"info_span"}>
                      {city.title ? city.title : "N/A"}
                      <span style={{ marginLeft: 8 }}>
                        <EditCityTitleModal
                          city={city}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* City ID */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaHashtag style={overviewIconStyle} /> City ID (2–10 chars)
                    </div>
                    <div className={"info_span"}>
                      {city.city_id ? city.city_id : "N/A"}
                      <span style={{ marginLeft: 8 }}>
                        <EditCityIdModal
                          city={city}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Country */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaHashtag style={overviewIconStyle} /> Country
                    </div>
                    <div className={"info_span"}>
                      {city.country ? city.country : "N/A"}
                      <span style={{ marginLeft: 8 }}>
                        <EditCityCountryModal
                          city={city}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Province */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaHashtag style={overviewIconStyle} /> Province
                    </div>
                    <div className={"info_span"}>
                      {city.province ? city.province : "N/A"}
                      <span style={{ marginLeft: 8 }}>
                        <EditCityProvinceModal
                          city={city}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Order Index */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaHashtag style={overviewIconStyle} /> Order Index
                    </div>
                    <div className={"info_span"}>
                      {(typeof city.orderindex === "number" ||
                        typeof city.orderindex === "string")
                        ? city.orderindex
                        : "N/A"}
                      <span style={{ marginLeft: 8 }}>
                        <EditCityOrderIndexModal
                          city={city}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>
                  </Card.Body>
                  <Card.Footer>
                    <DeleteObjectModal
                      object_id={city.city_id}
                      object_name={city.title}
                      object_type="City"
                      warningMessage="This will also delete all clients associated with this city."
                      onDeleteSuccess={() => {
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
