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

// Custom Made Components
import DeleteObjectModal from "../../../modals/delete_object";
import {
  EditProvinceIdModal,
  EditProvinceTitleModal,
  EditProvinceCountryModal,
  EditProvinceOrderIndexModal,
} from "../../../modals/province_edit_modals";
import axios from "axios";
// Global Variables
import {
  headers,
  pageHeader,
  forbidden,
  loader,
} from "../../../global_vars";

// API base
const VIEW_PROVINCE = "http://localhost:8000/api/regions/province/";

// Helpers to read URL like: /regions/province/<province_id>
function getProvinceIdFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const idx = parts.indexOf("province");
  if (idx === -1) return null;
  const id = parts[idx + 1] || null;
  return id ? decodeURIComponent(id) : null;
}

let overviewIconStyle = { color: "#F3702D", marginRight: "0.5em" };

class ProvinceOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      province: {},
      is_loaded: false,
    };
  }

  componentDidMount() {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");

    const provinceId = getProvinceIdFromPath();

    axios
      .get(`${VIEW_PROVINCE}${provinceId}`, { headers })
      .then((res) => {
        // Accept a few possible payload shapes safely
        const province =
          res?.data?.province ||
          res?.data?.region || // fallback if backend reused "region"
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
    this.setState({ province: updated });
  };

  render() {
    const { province } = this.state;
    return (
      <>
        <div className="mainContainer">
          {pageHeader("province_overview", `${province.title || "Province"}`)}
          {this.state.forbidden ? (
            <> {forbidden("Province Overview")} </>
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
                      Province Information
                    </Card.Header>
                  <Card.Body>
                    {/* Title */}
                    <div className={"info_descr"}>
                      <FiType style={overviewIconStyle} /> Title
                    </div>
                    <div className={"info_span"}>
                      {province.title ? province.title : "N/A"}
                      <span style={{ marginLeft: 8 }}>
                        <EditProvinceTitleModal
                          province={province}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Province ID */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaHashtag style={overviewIconStyle} /> Province ID (2–10 chars)
                    </div>
                    <div className={"info_span"}>
                      {province.province_id ? province.province_id : "N/A"}
                      <span style={{ marginLeft: 8 }}>
                        <EditProvinceIdModal
                          province={province}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Country */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaHashtag style={overviewIconStyle} /> Country
                    </div>
                    <div className={"info_span"}>
                      {province.country ? province.country : "N/A"}
                      <span style={{ marginLeft: 8 }}>
                        <EditProvinceCountryModal
                          province={province}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Order Index */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaHashtag style={overviewIconStyle} /> Order Index
                    </div>
                    <div className={"info_span"}>
                      {(typeof province.orderindex === "number" ||
                        typeof province.orderindex === "string")
                        ? province.orderindex
                        : "N/A"}
                      <span style={{ marginLeft: 8 }}>
                        <EditProvinceOrderIndexModal
                          province={province}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>
                  </Card.Body>
                  <Card.Footer>
                    <DeleteObjectModal
                      object_id={province.province_id}
                      object_name={province.title}
                      object_type="Province"
                      warningMessage="This will also delete all cities associated with this province."
                      onDeleteSuccess={() => {
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
