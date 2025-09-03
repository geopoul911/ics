// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../../core/navigation_bar/navigation_bar";
import Footer from "../../../core/footer/footer";

// Icons / Images
import { FaHashtag, FaSort, FaStop } from "react-icons/fa";
import { BsInfoSquare } from "react-icons/bs";
import { MdCheckCircle, MdCancel } from "react-icons/md";

// Modules / Functions
import { Card } from "react-bootstrap";
import { Grid, Button } from "semantic-ui-react";
import axios from "axios";

// Global Variables
import { headers, pageHeader } from "../../../global_vars";
import {
  EditBankClientAccountClientModal,
  EditBankClientAccountBankModal,
  EditBankClientAccountTransitNumberModal,
  EditBankClientAccountAccountNumberModal,
  EditBankClientAccountIbanModal,
  EditBankClientAccountActiveModal,
} from "../../../modals/bank_client_account_edit_modals";
import DeleteObjectModal from "../../../modals/delete_object";

const VIEW_BANK_CLIENT_ACCOUNT = "http://localhost:8000/api/data_management/bank_client_account/";

function getBankClientAccountIdFromPath() {
  const pathParts = window.location.pathname.split('/');
  return pathParts[pathParts.length - 1];
}

let overviewIconStyle = { color: "#2a9fd9", marginRight: "0.5em" };

class BankClientAccountOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bankClientAccount: {},
      is_loaded: false,
    };
  }

  componentDidMount() {
    this.fetchBankClientAccount();
  }

  fetchBankClientAccount = () => {
    const bankClientAccountId = getBankClientAccountIdFromPath();
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    axios
      .get(VIEW_BANK_CLIENT_ACCOUNT + bankClientAccountId + "/", {
        headers: currentHeaders,
      })
      .then((res) => {
        this.setState({
          bankClientAccount: res.data,
          is_loaded: true,
        });
      })
      .catch((e) => {
        console.error("Error fetching bank client account:", e);
        if (e?.response?.status === 401) {
          this.setState({ forbidden: true });
        }
      });
  };

  update_state = (updated) => {
    this.setState({ bankClientAccount: updated });
  };

  render() {
    const { bankClientAccount } = this.state;

    if (!this.state.is_loaded) {
      return (
        <>
          <NavigationBar />
          <div className="rootContainer">
            {pageHeader("bank_client_account_overview", "")}
            <div className="contentBody">
              <div>Loading...</div>
            </div>
          </div>
          <Footer />
        </>
      );
    }

    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("bank_client_account_overview", `${bankClientAccount.accountnumber}`)}
          <div className="contentBody">
            <Grid stackable columns={2}>
              <Grid.Column>
                <Card>
                  <Card.Header>
                    <h4>
                      <FaHashtag style={overviewIconStyle} />
                      Basic Information
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    {/* Bank Client Account ID */}
                    <div className={"info_descr"}>
                      <FaHashtag style={overviewIconStyle} /> Bank Client Account ID
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {bankClientAccount.bankclientacco_id || "N/A"}
                      <span
                        style={{
                          position: "absolute",
                          right: "0px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      >
                        <Button size="tiny" basic disabled>
                          <FaStop
                            disabled
                            style={{ marginRight: 6, color: "red" }}
                            title="Bank Client Account ID is immutable"
                          />{" "}
                          ID
                        </Button>
                      </span>
                    </div>

                    {/* Account Number */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> Account Number
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {bankClientAccount.accountnumber || "Not set"}
                      <span
                        style={{
                          position: "absolute",
                          right: "0px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      >
                        <EditBankClientAccountAccountNumberModal
                          bankClientAccount={bankClientAccount}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Transit Number */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> Transit Number
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {bankClientAccount.transitnumber || "Not set"}
                      <span
                        style={{
                          position: "absolute",
                          right: "0px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      >
                        <EditBankClientAccountTransitNumberModal
                          bankClientAccount={bankClientAccount}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* IBAN */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> IBAN
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {bankClientAccount.iban || "Not set"}
                      <span
                        style={{
                          position: "absolute",
                          right: "0px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      >
                        <EditBankClientAccountIbanModal
                          bankClientAccount={bankClientAccount}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Active Status */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> Active Status
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {bankClientAccount.active ? (
                        <span style={{ color: "green" }}>
                          <MdCheckCircle style={{ marginRight: 6 }} />
                          Active
                        </span>
                      ) : (
                        <span style={{ color: "red" }}>
                          <MdCancel style={{ marginRight: 6 }} />
                          Inactive
                        </span>
                      )}
                      <span
                        style={{
                          position: "absolute",
                          right: "0px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      >
                        <EditBankClientAccountActiveModal
                          bankClientAccount={bankClientAccount}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>
                  </Card.Body>
                  <Card.Footer>
                    <DeleteObjectModal
                      object={bankClientAccount}
                      objectType="BankClientAccount"
                      objectName={bankClientAccount.accountnumber}
                    />
                  </Card.Footer>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card>
                  <Card.Header>
                    <h4>
                      <FaSort style={overviewIconStyle} />
                      Related Information
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    {/* Client */}
                    <div className={"info_descr"}>
                      <BsInfoSquare style={overviewIconStyle} /> Client
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {bankClientAccount.client?.fullname || "Not set"}
                      <span
                        style={{
                          position: "absolute",
                          right: "0px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      >
                        <EditBankClientAccountClientModal
                          bankClientAccount={bankClientAccount}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Bank */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> Bank
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {bankClientAccount.bank?.bankname || "Not set"}
                      <span
                        style={{
                          position: "absolute",
                          right: "0px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      >
                        <EditBankClientAccountBankModal
                          bankClientAccount={bankClientAccount}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>
                  </Card.Body>
                </Card>
                
              </Grid.Column>
            </Grid>
          </div>
        </div>
        <Footer />
      </>
    );
  }
}

export default BankClientAccountOverview;
