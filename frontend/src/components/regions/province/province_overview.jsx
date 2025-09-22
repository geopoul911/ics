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
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import DeleteObjectModal from "../../modals/delete_object";
import AddCityModal from "../../modals/create/add_city";
import {
  EditProvinceIdModal,
  EditProvinceTitleModal,
  EditProvinceOrderIndexModal,
  EditProvinceCountryModal,
} from "../../modals/province_edit_modals";
import axios from "axios";

// Global Variables
import {
  headers,
  pageHeader,
  loader,
} from "../../global_vars";

// API (Updated to use new data_management API)
const VIEW_PROVINCE = "https://ultima.icsgr.com/api/regions/province/";

// Helpers to read URL like: /regions/province/<province_id>
function getProvinceIdFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean); // removes '' from // or trailing /
  const idx = parts.indexOf("province");
  if (idx === -1) return null;
  const id = parts[idx + 1] || null;
  return id ? decodeURIComponent(id) : null;
}

let overviewIconStyle = { color: "#93ab3c", marginRight: "0.5em" };
// Pretty label/value styling to match Country overview
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

class ProvinceOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      province: {},
      is_loaded: false,
      cities: [],
    };
  }

  componentDidMount() {
    // Update headers with current token
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    const provinceId = getProvinceIdFromPath();

    axios
      .get(`${VIEW_PROVINCE}${provinceId}/`, { headers: currentHeaders })
      .then(async (res) => {
        const province = res?.data || {};
        let cities = Array.isArray(province.cities) ? province.cities : [];

        if (cities.length === 0) {
          try {
            const cityRes = await axios.get(
              "https://ultima.icsgr.com/api/regions/all_cities/",
              { headers: currentHeaders }
            );
            const allCities = cityRes?.data?.all_cities || cityRes?.data?.results || cityRes?.data?.data || cityRes?.data || [];
            const pid = province.province_id;
            cities = (Array.isArray(allCities) ? allCities : []).filter((c) => {
              const p = c.province;
              if (!p) return false;
              if (typeof p === 'object') return p.province_id === pid;
              return p === pid;
            });
          } catch (_e) {
            cities = [];
          }
        }

        this.setState({ province, cities, is_loaded: true });
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

  // When modals return a fresh object, replace state.province
  update_state = (updated) => {
    console.log('Updating province state with:', updated);
    this.setState({ province: updated });
  };

  render() {
    const { province } = this.state;
    console.log('Rendering province overview with province:', province);
    
    return (
      <>
        <NavigationBar />
        <style>{`
          .pillLink { color: inherit; text-decoration: none; }
          .pillLink:hover { color: #93ab3c !important; text-decoration: none; }
        `}</style>
        <div className="mainContainer">
          {pageHeader("province_overview", `${province.title || "Province"}`)}
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
                      Province Information
                    </Card.Header>
                    <Card.Body>
                      {/* Province ID */}
                      <div className={"info_descr"}>
                        <FaHashtag style={overviewIconStyle} /> Province ID (2–10 chars)
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {province.province_id ? province.province_id : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditProvinceIdModal
                            province={province}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>
                      {/* Title */}
                      <div className={"info_descr"}>
                        <FiType style={overviewIconStyle} /> Province
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {province.title ? province.title : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditProvinceTitleModal
                            province={province}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>



                      {/* Country */}
                      <div className={"info_descr"}>
                        <FaGlobe style={overviewIconStyle} /> Country
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {province.country?.title ? province.country.title : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditProvinceCountryModal
                            province={province}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>

                      {/* Order by */}
                      <div className={"info_descr"}>
                        <BiSort style={overviewIconStyle} /> Order by
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {(typeof province.orderindex === "number" ||
                          typeof province.orderindex === "string")
                          ? province.orderindex
                          : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditProvinceOrderIndexModal
                            province={province}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>
                    </Card.Body>
                    <Card.Footer>
                      <DeleteObjectModal
                        objectType="Province"
                        objectId={province.province_id}
                        objectName={province.title}
                        onObjectDeleted={() => {
                          window.location.href = "/regions/all_provinces";
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
                      Cities
                    </Card.Header>
                    <Card.Body>
                      {Array.isArray(this.state.cities) && this.state.cities.length > 0 ? (
                        <ul className="list-unstyled" style={{ margin: 0 }}>
                          {this.state.cities.map((c, idx) => (
                            <li key={c.city_id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                                <span style={labelPillStyle}>#</span>
                                <span style={valueTextStyle}>{idx + 1}</span>
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
                      ) : (<div>No cities</div>)}
                    </Card.Body>
                    <Card.Footer>
                      <AddCityModal
                        refreshData={() => this.componentDidMount()}
                        defaultCountryId={this.state.province?.country?.country_id}
                        defaultProvinceId={this.state.province?.province_id}
                        lockCountry={true}
                        lockProvince={true}
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

export default ProvinceOverview;
