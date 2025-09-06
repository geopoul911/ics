// Built-ins
import React from "react";

// Icons / Images
import { FaStop } from "react-icons/fa";
import { FaIdBadge, FaStickyNote } from "react-icons/fa";
import { MdSecurity, MdCheckCircle, MdCancel } from "react-icons/md";

// Modules / Functions
import { Card } from "react-bootstrap";
import { Grid, Button } from "semantic-ui-react";
 
import Swal from "sweetalert2";

// Custom Made Components
import NavigationBar from "../../../core/navigation_bar/navigation_bar";
import Footer from "../../../core/footer/footer";
import DeleteObjectModal from "../../../modals/delete_object";
import AddBankClientAccountModal from "../../../modals/create/add_bank_client_account";
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

let overviewIconStyle = { color: "#93ab3c", marginRight: "0.5em" };
let labelPillStyle = { background: "#eef5ff", color: "#2c3e50", padding: "2px 10px", borderRadius: "12px", fontSize: "0.85em", marginRight: "8px", border: "1px solid #d6e4ff" };
let valueTextStyle = { fontWeight: 600, color: "#212529" };

class BankOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bank: {},
      is_loaded: false,
      bankClientAccounts: [],
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
      .then(async (res) => {
        const bank = res?.data || {};

        let bankClientAccounts = bank.bank_client_accounts || [];
        if (!Array.isArray(bankClientAccounts) || bankClientAccounts.length === 0) {
          try {
            const bcaRes = await axios.get("http://localhost:8000/api/data_management/bank_client_accounts/", { headers: currentHeaders });
            const all = bcaRes?.data?.all_bank_client_accounts || bcaRes?.data?.results || bcaRes?.data?.data || bcaRes?.data || [];
            const bid = bank.bank_id;
            bankClientAccounts = (Array.isArray(all) ? all : []).filter(a => a.bank && (a.bank.bank_id === bid || a.bank === bid));
          } catch (_e) { bankClientAccounts = []; }
        }

        this.setState({ bank, bankClientAccounts, is_loaded: true });
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
        <style>{`
          .pillLink { color: inherit; text-decoration: none; }
          .pillLink:hover { color: #93ab3c !important; text-decoration: none; }
        `}</style>
        <div className="mainContainer">
          {pageHeader("bank_overview", `Bank: ${bank.bankname || 'Loading...'}`)}
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
                      {/* Bank ID */}
                      <div className={"info_descr"}>
                        <FaIdBadge style={overviewIconStyle} /> Bank ID
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
                        <FaIdBadge style={overviewIconStyle} /> Bank
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
                        <FaStickyNote style={overviewIconStyle} /> Country
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

                      {/* Order by */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <FaIdBadge style={overviewIconStyle} /> Order by
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

                      {/* Bank code */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <FaStickyNote style={overviewIconStyle} /> Bank code
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

                      {/* Swift code */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <FaStickyNote style={overviewIconStyle} /> Swift code
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
                        objectId={bank.bank_id}
                        objectName={bank.bankname}
                        objectType="Bank"
                        onObjectDeleted={() => {
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
                <Grid.Column width={8}>
                  <Card>
                    <Card.Header>
                      <FaStickyNote style={{ color: "#93ab3c", fontSize: "1.5em", marginRight: "0.5em" }} />
                      Bank client accounts
                    </Card.Header>
                    <Card.Body>
                      {Array.isArray(this.state.bankClientAccounts) && this.state.bankClientAccounts.length > 0 ? (
                        <ul className="list-unstyled" style={{ margin: 0 }}>
                          {this.state.bankClientAccounts.map((acc, idx) => (
                            <li key={acc.bankclientacco_id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                                <span style={labelPillStyle}>#</span>
                                <span style={valueTextStyle}>{idx + 1}</span>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>ID</span>
                                <a href={`/data_management/bank_client_account/${acc.bankclientacco_id}`} className="pillLink" style={{ ...valueTextStyle }}>{acc.bankclientacco_id}</a>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Client</span>
                                <span style={valueTextStyle}>{acc.client?.fullname || `${acc.client?.surname || ''} ${acc.client?.name || ''}`.trim() || 'N/A'}</span>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Account</span>
                                <span style={valueTextStyle}>{acc.accountnumber || 'N/A'}</span>
                                {acc.transitnumber ? (<>
                                  <span style={{ width: 10 }} />
                                  <span style={labelPillStyle}>Branch</span>
                                  <span style={valueTextStyle}>{acc.transitnumber}</span>
                                </>) : null}
                                {acc.iban ? (<>
                                  <span style={{ width: 10 }} />
                                  <span style={labelPillStyle}>IBAN</span>
                                  <span style={valueTextStyle}>{acc.iban}</span>
                                </>) : null}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div>No bank client accounts</div>
                      )}
                    </Card.Body>
                    <Card.Footer>
                      <AddBankClientAccountModal refreshData={() => this.componentDidMount()} defaultBankId={this.state.bank?.bank_id} lockBank={true} />
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

export default BankOverview;
