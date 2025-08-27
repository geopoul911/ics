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
  EditBankNameModal,
  EditBankCountryModal,
  EditBankOrderIndexModal,
  EditBankInstitutionNumberModal,
  EditBankSwiftCodeModal,
  EditBankActiveModal,
} from "../../../modals/bank_edit_modals";
import axios from "axios";

// Global Variables
import {
  headers,
  pageHeader,
  loader,
} from "../../../global_vars";

// API endpoint for bank
const VIEW_BANK = "http://localhost:8000/api/administration/bank/";

// Helpers to read URL like: /administration/bank/<bank_id>
function getBankIdFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean); // removes '' from // or trailing /
  const idx = parts.indexOf("bank");
  if (idx === -1) return null;
  const id = parts[idx + 1] || null;
  return id ? decodeURIComponent(id) : null;
}

let overviewIconStyle = { color: "#2a9fd9", marginRight: "0.5em" };

class BankOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bank: {},
      is_loaded: false,
    };
  }

  componentDidMount() {
    // Update headers with current token
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    const bankId = getBankIdFromPath();

    axios
      .get(`${VIEW_BANK}${bankId}/`, { headers: currentHeaders })
      .then((res) => {
        // Accept a few possible payload shapes safely
        const bank =
          res?.data ||
          {};

        this.setState({
          bank,
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

  // When modals return a fresh object, replace state.bank
  update_state = (updated) => {
    this.setState({ bank: updated });
  };

  render() {
    const { bank } = this.state;
    
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("bank_overview", `Bank: ${bank.bankname || 'Loading...'}`)}
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
                      {/* Bank ID */}
                      <div className={"info_descr"}>
                        <FaHashtag style={overviewIconStyle} /> Bank ID
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {bank.bank_id ? bank.bank_id : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <Button size="tiny" basic disabled>
                            <FaStop style={{ marginRight: 6, color: "red" }} title="Bank ID is immutable"/>
                            ID
                          </Button>
                        </span>
                      </div>

                      {/* Bank Name */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <BsInfoSquare style={overviewIconStyle} /> Bank Name
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {bank.bankname ? bank.bankname : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditBankNameModal
                            bank={bank}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>

                      {/* Country */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <BsInfoSquare style={overviewIconStyle} /> Country
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {bank.country ? (typeof bank.country === 'object' ? bank.country.title : bank.country) : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditBankCountryModal
                            bank={bank}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>

                      {/* Order Index */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <FaSort style={overviewIconStyle} /> Order Index
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {(typeof bank.orderindex === "number" ||
                          typeof bank.orderindex === "string")
                          ? bank.orderindex
                          : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditBankOrderIndexModal
                            bank={bank}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>

                      {/* Institution Number */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <BsInfoSquare style={overviewIconStyle} /> Institution Number
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {bank.institutionnumber ? bank.institutionnumber : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditBankInstitutionNumberModal
                            bank={bank}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>

                      {/* SWIFT Code */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <BsInfoSquare style={overviewIconStyle} /> SWIFT Code
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {bank.swiftcode ? bank.swiftcode : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditBankSwiftCodeModal
                            bank={bank}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>
                    </Card.Body>
                    <Card.Footer>
                      <DeleteObjectModal
                        object_id={bank.bank_id}
                        object_name={bank.bankname}
                        object_type="Bank"
                        warningMessage="This will also delete all bank client accounts and bank project accounts associated with this bank."
                        onDeleteSuccess={() => {
                          window.location.href = "/administration/all_banks";
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
                        {bank.active ? 
                          <MdCheckCircle style={{ color: 'green' }} /> : 
                          <MdCancel style={{ color: 'red' }} />}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditBankActiveModal
                            bank={bank}
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

export default BankOverview;
