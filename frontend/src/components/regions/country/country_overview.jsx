// Built-ins
import React from "react";

// Icons / Images
import { BsInfoSquare } from "react-icons/bs";
import { FaHashtag } from "react-icons/fa";
import { FiType } from "react-icons/fi";
import { GiMoneyStack } from "react-icons/gi";
import { BiSort } from "react-icons/bi";

// Modules / Functions
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import Swal from "sweetalert2";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import DeleteObjectModal from "../../modals/delete_object";
import {
  EditCountryIdModal,
  EditCountryTitleModal,
  EditCountryCurrencyModal,
  EditCountryOrderIndexModal,
} from "../../modals/country_edit_modals";
import axios from "axios";
import AddProvinceModal from "../../modals/create/add_province";

// Global Variables
import {
  headers,
  pageHeader,
  loader,
} from "../../global_vars";

// API (Updated to use new data_management API)
const VIEW_COUNTRY = "http://localhost:8000/api/regions/country/";

// Helpers to read URL like: /regions/country/<country_id>
function getCountryIdFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean); // removes '' from // or trailing /
  const idx = parts.indexOf("country");
  if (idx === -1) return null;
  const id = parts[idx + 1] || null;
  return id ? decodeURIComponent(id) : null;
}

let overviewIconStyle = { color: "#93ab3c", marginRight: "0.5em" };
// Pretty label/value styling
let labelPillStyle = {
  background: "#eef5ff",
  color: "#2c3e50",
  padding: "2px 10px",
  borderRadius: "12px",
  fontSize: "0.85em",
  marginRight: "8px",
  border: "1px solid #d6e4ff",
};
let valueTextStyle = { fontWeight: 600, color: "#212529" };

class CountryOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      country: {},
      is_loaded: false,
      provinces: [],
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
      .then(async (res) => {
        const country = res?.data || {};
        let provinces = Array.isArray(country.provinces) ? country.provinces : [];

        // Fallback: fetch all provinces and filter by this country
        if (provinces.length === 0) {
          try {
            const provRes = await axios.get(
              "http://localhost:8000/api/regions/all_provinces/",
              { headers: currentHeaders }
            );
            const allProvinces = provRes?.data?.all_provinces || provRes?.data?.results || provRes?.data?.data || provRes?.data || [];
            const cid = country.country_id;
            provinces = (Array.isArray(allProvinces) ? allProvinces : []).filter((p) => {
              const c = p.country;
              if (!c) return false;
              if (typeof c === 'object') return c.country_id === cid;
              return c === cid;
            });
          } catch (_e) {
            provinces = [];
          }
        }

        // Enrich provinces with their cities
        try {
          const citiesRes = await axios.get(
            "http://localhost:8000/api/regions/all_cities/",
            { headers: currentHeaders }
          );
          const allCities = citiesRes?.data?.all_cities || citiesRes?.data?.results || citiesRes?.data?.data || citiesRes?.data || [];
          const cityByProvince = {};
          (Array.isArray(allCities) ? allCities : []).forEach((c) => {
            const provRef = c?.province;
            const pid = typeof provRef === 'object' ? provRef?.province_id : provRef;
            if (!pid) return;
            if (!cityByProvince[pid]) cityByProvince[pid] = [];
            cityByProvince[pid].push(c);
          });
          provinces = (provinces || []).map((p) => ({
            ...p,
            cities: cityByProvince[p.province_id] || [],
          }));
        } catch (_e) {
          // ignore if cities endpoint fails; UI will simply omit cities
        }

        this.setState({ country, provinces, is_loaded: true });
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
        <NavigationBar />
        <style>{`
          .pillLink { color: inherit; text-decoration: none; }
          .pillLink:hover { color: #93ab3c !important; text-decoration: none; }
        `}</style>
        <div className="mainContainer">
          {pageHeader("country_overview", `${country.title || "Country"}`)}
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
                      Country Information
                    </Card.Header>
                    <Card.Body>
                      {/* Country ID */}
                      <div className={"info_descr"}>
                        <FaHashtag style={overviewIconStyle} /> Country ID (2–3 chars)
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        <span style={valueTextStyle}>{country.country_id ? country.country_id : "N/A"}</span>
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditCountryIdModal
                            country={country}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>
                      {/* Title */}
                      <div className={"info_descr"}>
                        <FiType style={overviewIconStyle} /> Country
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        <span style={valueTextStyle}>{country.title ? country.title : "N/A"}</span>
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditCountryTitleModal
                            country={country}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>

                      {/* Currency */}
                      <div className={"info_descr"}>
                        <GiMoneyStack style={overviewIconStyle} /> Currency
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {country.currency ? country.currency : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditCountryCurrencyModal
                            country={country}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>

                      {/* Order by */}
                      <div className={"info_descr"}>
                        <BiSort style={overviewIconStyle} /> Order by
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {(typeof country.orderindex === "number" ||
                          typeof country.orderindex === "string")
                          ? country.orderindex
                          : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditCountryOrderIndexModal
                            country={country}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>
                    </Card.Body>
                    <Card.Footer>
                      <DeleteObjectModal
                        objectType="Country"
                        objectId={country.country_id}
                        objectName={country.title}
                        onObjectDeleted={() => {
                          window.location.href = "/regions/all_countries";
                        }}
                      />
                    </Card.Footer>
                  </Card>
                </Grid.Column>
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
                      Provinces
                    </Card.Header>
                    <Card.Body>
                      {Array.isArray(this.state.provinces) && this.state.provinces.length > 0 ? (
                        <ul className="list-unstyled" style={{ margin: 0 }}>
                          {this.state.provinces.map((p, idx) => (
                            <li key={p.province_id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                                <span style={labelPillStyle}>#</span>
                                <span style={valueTextStyle}>{idx + 1}</span>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>ID</span>
                                <a href={`/regions/province/${p.province_id}`} className="pillLink" style={{ ...valueTextStyle }}>{p.province_id}</a>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Province</span>
                                <span style={valueTextStyle}>{p.title}</span>
                              </div>
                              {/* Cities list for this province */}
                              {Array.isArray(p.cities) && p.cities.length > 0 ? (
                                <div style={{ marginTop: 8, paddingLeft: 12, borderLeft: '3px solid #eef5ff' }}>
                                  <div style={{ marginBottom: 6, fontWeight: 700, color: '#2c3e50' }}>Cities</div>
                                  <ul className="list-unstyled" style={{ margin: 0 }}>
                                    {p.cities.map((c, cidx) => (
                                      <li key={c.city_id || cidx} style={{ padding: '6px 0', borderBottom: '1px dashed #eee' }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                                          <span style={labelPillStyle}>#</span>
                                          <span style={valueTextStyle}>{cidx + 1}</span>
                                          <span style={{ width: 10 }} />
                                          <span style={labelPillStyle}>ID</span>
                                          <a href={`/regions/city/${c.city_id}`} className="pillLink" style={{ ...valueTextStyle }}>{c.city_id}</a>
                                          <span style={{ width: 10 }} />
                                          <span style={labelPillStyle}>City</span>
                                          <span style={valueTextStyle}>{c.title}</span>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      ) : (<div>No provinces</div>)}
                    </Card.Body>
                    <Card.Footer>
                      <AddProvinceModal
                        refreshData={() => this.componentDidMount()}
                        defaultCountryId={this.state.country?.country_id}
                        lockCountry={true}
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
        <Footer />
      </>
    );
  }
}

export default CountryOverview;
