// Built-ins
import React from "react";

// Icons / Images
import { FaHashtag } from "react-icons/fa";
import { FiType } from "react-icons/fi";
import { BsInfoSquare } from "react-icons/bs";
import {
  EditCountryIdModal,
  EditCountryTitleModal,
  EditCountryCurrencyModal,
  EditCountryOrderIndexModal,
} from "../../../modals/country_edit_modals";


// Modules / Functions
import axios from "axios";
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import Swal from "sweetalert2";

// Custom Made Components
import DeleteObjectModal from "../../../modals/delete_object";

// Global Variables
import {
  headers,
  pageHeader,
} from "../../../global_vars";

// API (adjust port/path to match your backend)
const VIEW_COUNTRY = "http://localhost:8000/api/regions/country/";

// Helpers to read URL like: /regions/country/<country_id>
function getCountryIdFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean); // removes '' from // or trailing /
  const idx = parts.indexOf("country");
  if (idx === -1) return null;
  const id = parts[idx + 1] || null;
  return id ? decodeURIComponent(id) : null;
}

let overviewIconStyle = { color: "#F3702D", marginRight: "0.5em" };

class CountryOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      country: {},
      is_loaded: false,
    };
  }

  componentDidMount() {

    headers["Authorization"] = "Token " + localStorage.getItem("userToken");

    const countryId = getCountryIdFromPath();

    axios
      .get(`${VIEW_COUNTRY}${countryId}`, { headers })
      .then((res) => {
        // Accept a few possible payload shapes safely
        const country =
          res?.data?.country ||
          res?.data?.region || // fallback if backend reused "region"
          res?.data ||
          {};

        this.setState({
          country,
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

  // When modals return a fresh object, replace state.country
  update_state = (updated) => {
    this.setState({ country: updated });
  };

  render() {
    const { country } = this.state;
    return (
      <>
        <div className="mainContainer">
          {pageHeader("country_overview", `${country.title || "Country"}`)}
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
                      Country Information
                    </Card.Header>
                  <Card.Body>
                    {/* Title */}
                    <div className={"info_descr"}>
                      <FiType style={overviewIconStyle} /> Title
                    </div>
                    <div className={"info_span"}>
                      {country.title ? country.title : "N/A"}
                      <span style={{ marginLeft: 8 }}>
                        <EditCountryTitleModal
                          country={country}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Country ID */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaHashtag style={overviewIconStyle} /> Country ID (2–3 chars)
                    </div>
                    <div className={"info_span"}>
                      {country.country_id ? country.country_id : "N/A"}
                      <span style={{ marginLeft: 8 }}>
                        <EditCountryIdModal
                          country={country}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Currency */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaHashtag style={overviewIconStyle} /> Currency
                    </div>
                    <div className={"info_span"}>
                      {country.currency ? country.currency : "N/A"}
                      <span style={{ marginLeft: 8 }}>
                        <EditCountryCurrencyModal
                          country={country}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Order Index */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaHashtag style={overviewIconStyle} /> Order Index
                    </div>
                    <div className={"info_span"}>
                      {(typeof country.orderindex === "number" ||
                        typeof country.orderindex === "string")
                        ? country.orderindex
                        : "N/A"}
                      <span style={{ marginLeft: 8 }}>
                        <EditCountryOrderIndexModal
                          country={country}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>
                  </Card.Body>
                  <Card.Footer>
                    <DeleteObjectModal
                      object_id={country.country_id}
                      object_name={country.title}
                      object_type="Country"
                      warningMessage="This will also delete all provinces and cities associated with this country."
                      onDeleteSuccess={() => {
                        window.location.href = "/regions/all_countries";
                      }}
                    />
                  </Card.Footer>
                  </Card>
                </Grid.Column>
              </Grid>
        </div>
      </>
    );
  }
}

export default CountryOverview;
