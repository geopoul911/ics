// Built-ins
import React from "react";

// Icons / Images
import { BsInfoSquare } from "react-icons/bs";
import { FaHashtag, FaSort, FaStop } from "react-icons/fa";
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

let overviewIconStyle = { color: "#2a9fd9", marginRight: "0.5em" };

class InsuranceCarrierOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      insurance_carrier: {},
      is_loaded: false,
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
      .then((res) => {
        // Accept a few possible payload shapes safely
        const insurance_carrier =
          res?.data ||
          {};

        this.setState({
          insurance_carrier,
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

  // When modals return a fresh object, replace state.insurance_carrier
  update_state = (updated) => {
    this.setState({ insurance_carrier: updated });
  };

  render() {
    const { insurance_carrier } = this.state;
    
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("insurance_carrier_overview", `Insurance Carrier: ${insurance_carrier.title || 'Loading...'}`)}
          {this.state.is_loaded ? (
            <>
              <Grid stackable columns={2} divided>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <BsInfoSquare
                        style={{
                          color: "#2a9fd9",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      Basic Information
                    </Card.Header>
                    <Card.Body>
                      {/* Insurance Carrier ID */}
                      <div className={"info_descr"}>
                        <FaHashtag style={overviewIconStyle} /> Insurance Carrier ID
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
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <BsInfoSquare style={overviewIconStyle} /> Title
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

                      {/* Order Index */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <FaSort style={overviewIconStyle} /> Order Index
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
                        object_id={insurance_carrier.insucarrier_id}
                        object_name={insurance_carrier.title}
                        object_type="Insurance Carrier"
                        warningMessage="This will also delete all client insurance associations with this carrier."
                        onDeleteSuccess={() => {
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
                          color: "#2a9fd9",
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
