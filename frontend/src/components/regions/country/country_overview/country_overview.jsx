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
import axios from "axios";

// Modules / Functions
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

// API (Updated to use new data_management API)
const VIEW_COUNTRY = "http://localhost:8000/api/data_management/countries/";

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
    // Update headers with current token
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    const countryId = getCountryIdFromPath();

    axios
      .get(`${VIEW_COUNTRY}${countryId}/`, { headers: currentHeaders })
      .then((res) => {
        // Accept a few possible payload shapes safely
        const country =
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
                  <h3>
                    <BsInfoSquare style={overviewIconStyle} />
                    Country Information
                  </h3>
                </Card.Header>
                <Card.Body>
                  <Grid>
                      <Grid.Column width={8}>
                        <p>
                          <strong>Country ID:</strong> {country.country_id}
                          <EditCountryIdModal
                            country={country}
                            update_state={(updated) =>
                              this.setState({ country: updated })
                            }
                          />
                        </p>
                      </Grid.Column>
                      <Grid.Column width={8}>
                        <p>
                          <strong>Title:</strong> {country.title}
                          <EditCountryTitleModal
                            country={country}
                            update_state={(updated) =>
                              this.setState({ country: updated })
                            }
                          />
                        </p>
                      </Grid.Column>
                      <Grid.Column width={8}>
                        <p>
                          <strong>Currency:</strong> {country.currency || "N/A"}
                          <EditCountryCurrencyModal
                            country={country}
                            update_state={(updated) =>
                              this.setState({ country: updated })
                            }
                          />
                        </p>
                      </Grid.Column>
                      <Grid.Column width={8}>
                        <p>
                          <strong>Order Index:</strong> {country.orderindex}
                          <EditCountryOrderIndexModal
                            country={country}
                            update_state={(updated) =>
                              this.setState({ country: updated })
                            }
                          />
                        </p>
                      </Grid.Column>
                  </Grid>
                </Card.Body>
              </Card>
            </Grid.Column>

            <Grid.Column width={16}>
              <DeleteObjectModal
                object={country}
                object_type="country"
                object_id={country.country_id}
                object_name={country.title}
                redirect_url="/regions"
              />
            </Grid.Column>
        </Grid>
        </div>
      </>
    );
  }
}

export default CountryOverview;
