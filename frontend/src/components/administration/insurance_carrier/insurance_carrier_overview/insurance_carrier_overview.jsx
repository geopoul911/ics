// Built-ins
import React from "react";

// Icons / Images
import { FaStop } from "react-icons/fa";
import { FaIdBadge } from "react-icons/fa";
import { MdSecurity, MdCheckCircle, MdCancel } from "react-icons/md";

// Modules / Functions
import { Card } from "react-bootstrap";
import { Grid, Button } from "semantic-ui-react";
 
import Swal from "sweetalert2";

// Custom Made Components
import NavigationBar from "../../../core/navigation_bar/navigation_bar";
import Footer from "../../../core/footer/footer";
import DeleteObjectModal from "../../../modals/delete_object";
import {
  EditInsuranceCarrierTitleModal,
  EditInsuranceCarrierOrderIndexModal,
  EditInsuranceCarrierActiveModal,
} from "../../../modals/insurance_carrier_edit_modals";
import axios from "axios";

// Global Variables
import {
  headers,
  pageHeader,
  loader,
} from "../../../global_vars";

// API endpoint for insurance carrier
const VIEW_INSURANCE_CARRIER = "http://localhost:8000/api/administration/insurance_carrier/";

// Helpers to read URL like: /administration/insurance_carrier/<insucarrier_id>
function getInsuranceCarrierIdFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean); // removes '' from // or trailing /
  const idx = parts.indexOf("insurance_carrier");
  if (idx === -1) return null;
  const id = parts[idx + 1] || null;
  return id ? decodeURIComponent(id) : null;
}

let overviewIconStyle = { color: "#93ab3c", marginRight: "0.5em" };
let labelPillStyle = { background: "#eef5ff", color: "#2c3e50", padding: "2px 10px", borderRadius: "12px", fontSize: "0.85em", marginRight: "8px", border: "1px solid #d6e4ff" };
let valueTextStyle = { fontWeight: 600, color: "#212529" };

class InsuranceCarrierOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      insurance_carrier: {},
      is_loaded: false,
      clients: [],
    };
  }

  componentDidMount() {
    // Update headers with current token
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    const insuranceCarrierId = getInsuranceCarrierIdFromPath();

    axios
      .get(`${VIEW_INSURANCE_CARRIER}${insuranceCarrierId}/`, { headers: currentHeaders })
      .then(async (res) => {
        const insurance_carrier = res?.data || {};
        let clients = insurance_carrier.clients || [];
        try {
          const icid = insurance_carrier.insucarrier_id;
          const clientsRes = await axios.get(`http://localhost:8000/api/data_management/clients/?insucarrier=${encodeURIComponent(icid)}`, { headers: currentHeaders });
          clients = clientsRes?.data?.all_clients || [];
        } catch (_e) { clients = []; }
        this.setState({ insurance_carrier, clients, is_loaded: true });
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

  // When modals return a fresh object, replace state.insurance_carrier
  update_state = (updated) => {
    this.setState({ insurance_carrier: updated });
  };

  render() {
    const { insurance_carrier } = this.state;
    
    return (
      <>
        <NavigationBar />
        <style>{`
          .pillLink { color: inherit; text-decoration: none; }
          .pillLink:hover { color: #93ab3c !important; text-decoration: none; }
        `}</style>
        <div className="mainContainer">
          {pageHeader("insurance_carrier_overview", `Insurance Carrier: ${insurance_carrier.title || 'Loading...'}`)}
          {this.state.is_loaded ? (
            <>
              <Grid stackable columns={2} divided>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <FaIdBadge
                        style={{
                          color: "#93ab3c",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      Basic Information
                    </Card.Header>
                    <Card.Body>
                      {/* Insurance Carrier ID */}
                      <div className={"info_descr"}>
                        <FaIdBadge style={overviewIconStyle} /> Insurance Carrier ID
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {insurance_carrier.insucarrier_id ? insurance_carrier.insucarrier_id : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <Button size="tiny" basic disabled>
                            <FaStop style={{ marginRight: 6, color: "red" }} title="Insurance Carrier ID is immutable"/>
                            ID
                          </Button>
                        </span>
                      </div>

                      {/* Title */}
                      <div className={"info_descr"}>
                        <FaIdBadge style={overviewIconStyle} /> Public Insurance
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {insurance_carrier.title ? insurance_carrier.title : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditInsuranceCarrierTitleModal
                            insurance_carrier={insurance_carrier}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>

                      {/* Order by */}
                      <div className={"info_descr"}>
                        <FaIdBadge style={overviewIconStyle} /> Order by
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {(typeof insurance_carrier.orderindex === "number" ||
                          typeof insurance_carrier.orderindex === "string")
                          ? insurance_carrier.orderindex
                          : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditInsuranceCarrierOrderIndexModal
                            insurance_carrier={insurance_carrier}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>
                    </Card.Body>
                    <Card.Footer>
                      <DeleteObjectModal
                        objectId={insurance_carrier.insucarrier_id}
                        objectName={insurance_carrier.title}
                        objectType="InsuranceCarrier"
                        onObjectDeleted={() => {
                          window.location.href = "/administration/all_insurance_carriers";
                        }}
                      />
                    </Card.Footer>
                  </Card>
                </Grid.Column>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <MdSecurity
                        style={{
                          color: "#93ab3c",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      Status Information
                    </Card.Header>
                    <Card.Body>
                      {/* Active */}
                      <div className={"info_descr"}>
                        <MdCheckCircle style={overviewIconStyle} /> Active
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {insurance_carrier.active ? 
                          <MdCheckCircle style={{ color: 'green' }} /> : 
                          <MdCancel style={{ color: 'red' }} />}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditInsuranceCarrierActiveModal
                            insurance_carrier={insurance_carrier}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>
                    </Card.Body>
                    <Card.Footer></Card.Footer>
                  </Card>
                </Grid.Column>

                <Grid.Column>
                  <Card style={{ marginTop: 20 }} widht={8}>
                    <Card.Header>
                      <FaIdBadge
                        style={{ color: "#93ab3c", fontSize: "1.5em", marginRight: "0.5em" }}
                      />
                      Clients
                    </Card.Header>
                    <Card.Body>
                      {Array.isArray(this.state.clients) && this.state.clients.length > 0 ? (
                        <ul className="list-unstyled" style={{ margin: 0 }}>
                          {this.state.clients.map((cl, idx) => (
                            <li key={cl.client_id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                                <span style={labelPillStyle}>#</span>
                                <span style={valueTextStyle}>{idx + 1}</span>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>ID</span>
                                <a href={`/data_management/client/${cl.client_id}`} className="pillLink" style={{ ...valueTextStyle }}>{cl.client_id}</a>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Name</span>
                                <span style={valueTextStyle}>{cl.fullname || `${cl.surname || ''} ${cl.name || ''}`.trim()}</span>
                                {cl.mobile1 ? (<>
                                  <span style={{ width: 10 }} />
                                  <span style={labelPillStyle}>Cell</span>
                                  <span style={valueTextStyle}>{cl.mobile1}</span>
                                </>) : null}
                                {cl.email ? (<>
                                  <span style={{ width: 10 }} />
                                  <span style={labelPillStyle}>E-mail</span>
                                  <span style={valueTextStyle}>{cl.email}</span>
                                </>) : null}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div>No clients</div>
                      )}
                    </Card.Body>
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

export default InsuranceCarrierOverview;
