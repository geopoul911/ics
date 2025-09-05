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
  EditProvinceIdModal,
  EditProvinceTitleModal,
  EditProvinceOrderIndexModal,
  EditProvinceCountryModal,
} from "../../../modals/province_edit_modals";
import axios from "axios";

// Global Variables
import {
  headers,
  pageHeader,
  loader,
} from "../../../global_vars";

// API (Updated to use new data_management API)
const VIEW_PROVINCE = "http://localhost:8000/api/regions/province/";

// Helpers to read URL like: /regions/province/<province_id>
function getProvinceIdFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean); // removes '' from // or trailing /
  const idx = parts.indexOf("province");
  if (idx === -1) return null;
  const id = parts[idx + 1] || null;
  return id ? decodeURIComponent(id) : null;
}

let overviewIconStyle = { color: "#93ab3c", marginRight: "0.5em" };

class ProvinceOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      province: {},
      is_loaded: false,
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
      .then((res) => {
        // Accept a few possible payload shapes safely
        const province =
          res?.data ||
          {};

        this.setState({
          province,
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

export default ProvinceOverview;
