// Built-ins
import React from "react";

// Modules / Functions
import axios from "axios";
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import ReactCountryFlag from "react-country-flag";
import Swal from "sweetalert2";

// Modals
import ChangeName from "../../../modals/change_name";
import ChangeAddress from "../../../modals/change_address";
import ChangeEmail from "../../../modals/change_email";
import ChangeTel from "../../../modals/change_tel";
import ChangeEnabled from "../../../modals/change_enabled";
import DeleteObjectModal from "../../../modals/delete_object";
import ChangeRating from "../../../modals/change_leader_rating";
import ChangeLanguage from "../../../modals/group_leaders/change_languages";
import EditPaymentDetails from "../../../modals/edit_payment_details";
import Notes from "../../../core/notes/notes";
import ChangeAddress2 from "../../../modals/change_address2";
import ChangePostal from "../../../modals/change_postal";
import ChangeRegion from "../../../modals/change_region";

// Icons / Images
import { BsFlag } from "react-icons/bs";
import { GiConvergenceTarget } from "react-icons/gi";
import { BsInfoSquare } from "react-icons/bs";
import { MdCreditCard } from "react-icons/md";
import { FaMinus } from "react-icons/fa";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { BsMailbox } from "react-icons/bs";
import { FaFlag, FaHashtag, FaCheck } from "react-icons/fa";
import { FaAddressCard } from "react-icons/fa";
import { BsFillTelephoneFill } from "react-icons/bs";
import { MdAlternateEmail } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { FaRegStar } from "react-icons/fa";
import { IoMdBusiness } from "react-icons/io";

// Global Variables
import {
  headers,
  loader,
  pageHeader,
  forbidden,
  restrictedUsers,
  iconStyle,
  languagePerCountry,
} from "../../../global_vars";

// Variables
window.Swal = Swal;

const ratingcolorstoflag = {
  G: "green",
  Y: "orange",
  R: "red",
};

const ratingcolorstowords = {
  G: "Good",
  Y: "Medium",
  R: "Bad",
};

let overviewIconStyle = { color: "#F3702D", marginRight: "0.5em" };

const VIEW_LEADER = "http://localhost:8000/api/data_management/group_leader/";
const DOWNLOAD_DOCUMENT =
  "http://localhost:8000/api/group_leaders/download_group_leader_document/";

function getGroupLeaderId() {
  return window.location.pathname.split("/")[3];
}

class GroupLeaderOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group_leader: {
        notes: {},
      },
      is_loaded: false,
      forbidden: false,
      show_tel2: false,
      show_address2: false,
    };
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_LEADER + getGroupLeaderId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          group_leader: res.data.group_leader,
          notes: res.data.group_leader.notes,
          is_loaded: true,
        });
      })
      .catch((e) => {
        if (e.response.status === 401) {
          this.setState({
            forbidden: true,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An unknown error has occured.",
          });
        }
      });
  }

  update_state = (update_state) => {
    this.setState({ group_leader: update_state });
  };

  refresh = () => {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_LEADER + getGroupLeaderId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          group_leader: res.data.group_leader,
          notes: res.data.group_leader.notes,
          is_loaded: true,
        });
      });
  };

  update_notes = (notes) => {
    var group_leader = { ...this.state.group_leader };
    group_leader.notes = notes;
    this.setState({
      group_leader: group_leader,
    });
  };

  downloadGroupLeaderDocument = (fileName) => {
    axios
      .get(VIEW_LEADER + getGroupLeaderId(), {
        headers: headers,
        params: {
          file: fileName,
        },
      })
      .then((res) => {
        window.open(
          DOWNLOAD_DOCUMENT + getGroupLeaderId() + "?file=" + fileName
        );
      });
  };

  render() {
    return (
      <>
        <div className="mainContainer">
          {pageHeader("group_leader_overview", this.state.group_leader.name)}
          {this.state.forbidden ? (
            <>{forbidden("Group Leader Overview")}</>
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
                      Group Leader Information
                    </Card.Header>
                    <Card.Body>
                      <div className={"info_descr"}>
                        <FaHashtag style={overviewIconStyle} /> Name
                      </div>
                      <div className={"info_span"}>
                        {this.state.group_leader.name
                          ? this.state.group_leader.name
                          : "N/A"}
                      </div>
                      <ChangeName
                        object_id={this.state.group_leader.id}
                        object_name={this.state.group_leader.name}
                        object_type={"Group Leader"}
                        update_state={this.update_state}
                      />

                      <div className={"info_descr"}> <IoMdBusiness style={overviewIconStyle} /> Company </div>
                      <div className={"info_span"}>
                        {this.state.group_leader.payment_details
                          ? this.state.group_leader.payment_details.company === "" ||
                            this.state.group_leader.payment_details.company === null
                            ? "N/A"
                            : 
                            <span style={{color: this.state.group_leader.payment_details.company === this.state.group_leader.name ? 'blue': ''}}>
                              {this.state.group_leader.payment_details.company}
                            </span>
                          : "N/A"}
                      </div>

                      <div className={"info_descr"}>
                        <FaAddressCard style={overviewIconStyle} /> Address
                      </div>
                      <div className={"info_span"}>
                        {this.state.group_leader.address
                          ? this.state.group_leader.address
                          : "N/A"}
                      </div>
                      <ChangeAddress
                        object_id={this.state.group_leader.id}
                        object_name={this.state.group_leader.name}
                        object_type={"Group Leader"}
                        update_state={this.update_state}
                        address={
                          this.state.group_leader.address
                            ? this.state.group_leader.address
                            : "N/A"
                        }
                      />

                      {this.state.show_address2 ? (
                        <>
                          <div className={"info_descr"}>
                            <FaAddressCard style={overviewIconStyle} /> Address
                            2
                          </div>
                          <div className={"info_span"}>
                            {this.state.group_leader.address2
                              ? this.state.group_leader.address2
                              : "N/A"}
                          </div>
                          <FaMinus
                            className="minus-icon"
                            title="Hide address 2"
                            style={{ marginLeft: 20 }}
                            onClick={() =>
                              this.setState({ show_address2: false })
                            }
                          />
                          <ChangeAddress2
                            object_id={this.state.group_leader.id}
                            object_name={this.state.group_leader.name}
                            object_type={"Group Leader"}
                            update_state={this.update_state}
                            address={
                              this.state.group_leader.address2
                                ? this.state.group_leader.address2
                                : "N/A"
                            }
                          />
                        </>
                      ) : (
                        <>
                          <AiOutlinePlusSquare
                            className="plus-icon"
                            title="Show Address 2"
                            style={{ marginLeft: 20 }}
                            onClick={() =>
                              this.setState({ show_address2: true })
                            }
                          />
                        </>
                      )}

                      <div className={"info_descr"}>
                        <BsFillTelephoneFill style={overviewIconStyle} /> Tel
                      </div>
                      <div className={"info_span"}>
                        {this.state.group_leader.tel
                          ? this.state.group_leader.tel
                          : "N/A"}
                      </div>
                      <ChangeTel
                        object_id={this.state.group_leader.id}
                        object_name={this.state.group_leader.name}
                        object_type={"Group Leader"}
                        tel_num={"tel"}
                        update_state={this.update_state}
                        telephone={
                          this.state.group_leader.tel
                            ? this.state.group_leader.tel
                            : "N/A"
                        }
                      />
                      {this.state.show_tel2 ? (
                        <>
                          <div className={"info_descr"}>
                            <BsFillTelephoneFill style={overviewIconStyle} />
                            Tel. 2
                          </div>
                          <div className={"info_span"}>
                            {this.state.group_leader.tel2
                              ? this.state.group_leader.tel2
                              : "N/A"}
                          </div>

                          <ChangeTel
                            object_id={this.state.group_leader.id}
                            object_name={this.state.group_leader.name}
                            object_type={"Group Leader"}
                            tel_num={"tel2"}
                            update_state={this.update_state}
                            telephone={
                              this.state.group_leader.tel2
                                ? this.state.group_leader.tel2
                                : "N/A"
                            }
                          />
                          <div className={"info_descr"}>
                            <BsFillTelephoneFill style={overviewIconStyle} />
                            Tel. 3
                          </div>
                          <div className={"info_span"}>
                            {this.state.group_leader.tel3
                              ? this.state.group_leader.tel3
                              : "N/A"}
                          </div>

                          <FaMinus
                            className="minus-icon"
                            title="Hide address 2"
                            style={{ marginLeft: 20 }}
                            onClick={() => this.setState({ show_tel2: false })}
                          />

                          <ChangeTel
                            object_id={this.state.group_leader.id}
                            object_name={this.state.group_leader.name}
                            object_type={"Group Leader"}
                            tel_num={"tel3"}
                            update_state={this.update_state}
                            telephone={
                              this.state.group_leader.tel3
                                ? this.state.group_leader.tel3
                                : "N/A"
                            }
                          />
                        </>
                      ) : (
                        <>
                          <AiOutlinePlusSquare
                            className="plus-icon"
                            title="Show Tel 2"
                            style={{ marginLeft: 20 }}
                            onClick={() => this.setState({ show_tel2: true })}
                          />
                        </>
                      )}

                      <div className={"info_descr"}>
                        <BsMailbox style={overviewIconStyle} />
                        Postal / Zip code
                      </div>
                      <div className={"info_span"}>
                        {this.state.group_leader.postal
                          ? this.state.group_leader.postal
                          : "N/A"}
                      </div>
                      <ChangePostal
                        object_id={this.state.group_leader.id}
                        object_name={this.state.group_leader.name}
                        object_type={"Group Leader"}
                        update_state={this.update_state}
                        postal={
                          this.state.group_leader.postal
                            ? this.state.group_leader.postal
                            : "N/A"
                        }
                      />
                      <div className={"info_descr"}>
                        <MdAlternateEmail style={overviewIconStyle} />
                        Email
                      </div>
                      <div className={"info_span"}>
                        {this.state.group_leader.email
                          ? this.state.group_leader.email
                          : "N/A"}
                      </div>
                      <ChangeEmail
                        object_id={this.state.group_leader.id}
                        object_name={this.state.group_leader.name}
                        object_type={"Group Leader"}
                        update_state={this.update_state}
                        email={
                          this.state.group_leader.email
                            ? this.state.group_leader.email
                            : ""
                        }
                      />
                      <div className={"info_descr"}>
                        <FaRegStar style={overviewIconStyle} /> Rating
                      </div>
                      <div className={"info_span"}>
                        {this.state.group_leader.rating ? (
                          <>
                            <BsFlag
                              style={{
                                color:
                                  ratingcolorstoflag[
                                    this.state.group_leader.rating
                                  ],
                                fontSize: "1.5em",
                                marginRight: "0.5em",
                              }}
                            />
                            {
                              ratingcolorstowords[
                                this.state.group_leader.rating
                              ]
                            }
                          </>
                        ) : (
                          "N/A"
                        )}
                      </div>
                      <ChangeRating
                        object_id={this.state.group_leader.id}
                        object_name={this.state.group_leader.name}
                        object_type={"Group Leader"}
                        update_state={this.update_state}
                      />

                      <div className={"info_descr"}>
                        <GiConvergenceTarget style={overviewIconStyle} />
                        Region
                      </div>

                      <div className={"info_span"}>
                        {this.state.group_leader.region ? this.state.group_leader.region : 'N/A'}
                      </div>

                      <ChangeRegion
                        object_id={this.state.group_leader.id}
                        object_name={this.state.group_leader.name}
                        object_type={"Group Leader"}
                        update_state={this.update_state}
                      />

                      <div className={"info_descr"}>
                        <FaFlag style={overviewIconStyle} /> Languages
                      </div>
                      <div className={"info_span"}>
                        {this.state.group_leader.flags.length > 0
                          ? this.state.group_leader.flags.map((e) => (
                              <>
                                <ReactCountryFlag
                                  countryCode={e.code}
                                  svg
                                  style={{
                                    width: "1.5em",
                                    height: "1.5em",
                                    marginRight: 10,
                                  }}
                                  title={[e.name] + ' - ' + languagePerCountry[e.name]}
                                />
                              </>
                            ))
                          : "N/A"}
                      </div>
                      <ChangeLanguage
                        group_leader_id={this.state.group_leader.id}
                        name={this.state.group_leader.name}
                        update_state={this.update_state}
                      />
                      <div className={"info_descr"}>
                        {this.state.group_leader.enabled ? (
                          <FaCheck style={overviewIconStyle} />
                        ) : (
                          <ImCross style={overviewIconStyle} />
                        )}
                        Enabled
                      </div>
                      <div className={"info_span"}>
                        {this.state.group_leader.enabled
                          ? "Enabled"
                          : "Disabled"}
                      </div>
                      <ChangeEnabled
                        object_id={this.state.group_leader.id}
                        object_name={this.state.group_leader.name}
                        object_type={"Group Leader"}
                        update_state={this.update_state}
                      />
                    </Card.Body>
                    <Card.Footer>
                      <DeleteObjectModal
                        object_id={this.state.group_leader.id}
                        object_name={this.state.group_leader.name}
                        object_type={"Group Leader"}
                        update_state={this.update_state}
                      />
                    </Card.Footer>
                  </Card>
                </Grid.Column>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <MdCreditCard style={iconStyle} />
                      Payment Details
                    </Card.Header>
                    <Card.Body>
                      <div className={"info_descr"}> Company </div>
                      <div className={"info_span"}>
                        {this.state.group_leader.payment_details
                          ? this.state.group_leader.payment_details.company ===
                              "" ||
                            this.state.group_leader.payment_details.company ===
                              null
                            ? "N/A"
                            : this.state.group_leader.payment_details.company
                          : "N/A"}
                      </div>
                      <div className={"info_descr"}> Currency </div>
                      <div className={"info_span"}>
                        {this.state.group_leader.payment_details
                          ? this.state.group_leader.payment_details.currency ===
                              "" ||
                            this.state.group_leader.payment_details.currency ===
                              null
                            ? "N/A"
                            : this.state.group_leader.payment_details.currency
                          : "N/A"}
                      </div>
                      <div className={"info_descr"}>
                        {this.state.group_leader.payment_details.currency ===
                        "GBP"
                          ? "Account Number"
                          : "IBAN"}
                      </div>
                      <div className={"info_span"}>
                        {this.state.group_leader.payment_details
                          ? this.state.group_leader.payment_details.iban ===
                              "" ||
                            this.state.group_leader.payment_details.iban ===
                              null
                            ? "N/A"
                            : this.state.group_leader.payment_details.iban
                          : "N/A"}
                      </div>
                      <div className={"info_descr"}>
                        {this.state.group_leader.payment_details.currency ===
                        "GBP"
                          ? "Sort Code"
                          : "Swift"}
                      </div>
                      <div className={"info_span"}>
                        {this.state.group_leader.payment_details
                          ? this.state.group_leader.payment_details.swift ===
                              "" ||
                            this.state.group_leader.payment_details.swift ===
                              null
                            ? "N/A"
                            : this.state.group_leader.payment_details.swift
                          : "N/A"}
                      </div>
                    </Card.Body>
                    <Card.Footer>
                      <EditPaymentDetails
                        object_id={this.state.group_leader.id}
                        object_name={this.state.group_leader.name}
                        object_type={"Group Leader"}
                        update_state={this.update_state}
                        payment_details={
                          this.state.group_leader.payment_details
                        }
                      />
                    </Card.Footer>
                  </Card>
                  <Notes
                    update_notes={this.update_notes}
                    object_id={this.state.group_leader.id}
                    object_name={this.state.group_leader.name}
                    object_type={"GroupLeader"}
                    update_state={this.update_state}
                    notes={this.state.group_leader.notes}
                  />
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

export default GroupLeaderOverView;
