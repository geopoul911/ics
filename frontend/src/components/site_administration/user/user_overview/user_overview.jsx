// Built-ins
import React from "react";

// Icons-images
import { BsInfoSquare } from "react-icons/bs";
import { ImProfile } from "react-icons/im";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";

import { FaRegUser } from "react-icons/fa"; // username
import { MdTextFields } from "react-icons/md"; // first / last name
import { MdAlternateEmail } from "react-icons/md"; // email
import { RiAdminLine } from "react-icons/ri"; // Super user
import { MdOutlineUpdate } from "react-icons/md"; // Date joined
import { BsFillTelephoneFill } from "react-icons/bs"; // Phone number
import { FaFlag } from "react-icons/fa"; // Country
import { FaAddressCard } from "react-icons/fa"; // Address
import { FaShippingFast } from "react-icons/fa";
import { FaSignature, FaCheck } from "react-icons/fa"; // Signature
import { IoIosMan } from "react-icons/io";

// Functions / modules
import moment from "moment";
import axios from "axios";
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import ReactCountryFlag from "react-country-flag";
import Swal from "sweetalert2";

// Custom Made Components
import ChangeUsername from "./modals/change_username";
import ChangeFirstName from "./modals/change_first_name";
import ChangeLastName from "./modals/change_last_name";
import ChangeEmail from "./modals/change_email";
import ChangeIsEnabled from "./modals/change_is_enabled";
import ChangeIsStaff from "./modals/change_is_staff";
import ChangeIsSuperuser from "./modals/change_is_superuser";
import ChangePassword from "./modals/change_password";
import ChangePhoneNumber from "./modals/change_phone_number";
import ChangeNationality from "./modals/change_nationality";
import ChangeAddress from "./modals/change_address";
import ChangeZipCode from "./modals/change_zip_code";
import ChangeSignature from "./modals/change_signature";
import ChangeSecondaryEmail from "./modals/change_secondary_email";
import ChangeSecondarySignature from "./modals/change_secondary_signature";
import DeleteUser from "./modals/delete_user";

// Global Variables
import { headers, loader, pageHeader } from "../../../global_vars";

// Variables
window.Swal = Swal;

let overviewIconStyle = { color: "#F3702D", marginRight: "0.5em" };

let cross_style = {
  color: "red",
  fontSize: "1em",
};

let tick_style = {
  color: "green",
  fontSize: "1.4em",
};

const VIEW_USER = "http://localhost:8000/api/site_admin/user/";

function getUserId() {
  return window.location.pathname.split("/")[3];
}

class UserOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      notes: {},
      is_loaded: false,
    };
  }

  componentDidMount() {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_USER + getUserId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          user: res.data.user,
          is_loaded: true,
        });
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: e.response.data.errormsg,
        });
      });
  }

  update_state = (update_state) => {
    this.setState({ user: update_state });
  };

  add_note = (note) => {
    var user = { ...this.state.user };
    user.notes = note;
    this.setState({
      user: user,
      notes: note,
    });
  };

  edit_note = (note) => {
    var user = { ...this.state.user };
    user.notes = note;
    this.setState({
      user: user,
      notes: note,
    });
  };

  delete_note = (note) => {
    var user = { ...this.state.user };
    user.notes = note;
    this.setState({
      user: user,
      notes: note,
    });
  };

  render() {
    return (
      <>
        <div className="rootContainer">
          {pageHeader("user_overview", this.state.user.username)}
          {this.state.is_loaded ? (
            <>
              <Grid columns={2} divided stackable>
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
                      User Information
                    </Card.Header>
                    <Card.Body>
                      <div className={"info_descr"}>
                        <FaRegUser style={overviewIconStyle} /> Username :
                      </div>
                      <div className={"info_span"}>
                        {this.state.user.username
                          ? this.state.user.username
                          : "N/A"}
                      </div>
                      <ChangeUsername
                        user_id={this.state.user.id}
                        username={this.state.user.username}
                        update_state={this.update_state}
                      />
                      <div className={"info_descr"}>
                        <MdTextFields style={overviewIconStyle} /> First Name :
                      </div>
                      <div className={"info_span"}>
                        {this.state.user.first_name
                          ? this.state.user.first_name
                          : "N/A"}
                      </div>
                      <ChangeFirstName
                        user_id={this.state.user.id}
                        username={this.state.user.username}
                        update_state={this.update_state}
                        first_name={
                          this.state.user.first_name
                            ? this.state.user.first_name
                            : ""
                        }
                      />
                      <div className={"info_descr"}>
                        <MdTextFields style={overviewIconStyle} /> Last Name :
                      </div>
                      <div className={"info_span"}>
                        {this.state.user.last_name
                          ? this.state.user.last_name
                          : "N/A"}
                      </div>
                      <ChangeLastName
                        user_id={this.state.user.id}
                        username={this.state.user.username}
                        update_state={this.update_state}
                        last_name={
                          this.state.user.last_name
                            ? this.state.user.last_name
                            : ""
                        }
                      />
                      <div className={"info_descr"}>
                        <MdAlternateEmail style={overviewIconStyle} />
                        Email
                      </div>
                      <div className={"info_span"}>
                        {this.state.user.email ? this.state.user.email : "N/A"}
                      </div>
                      <ChangeEmail
                        user_id={this.state.user.id}
                        username={this.state.user.username}
                        update_state={this.update_state}
                        email={
                          this.state.user.email ? this.state.user.email : "N/A"
                        }
                      />

                      <div className={"info_descr"}>
                        <IoIosMan style={overviewIconStyle} /> Staff :
                      </div>
                      <div className={"info_span"}>
                        {this.state.user.is_staff ? (
                          <TiTick style={tick_style} />
                        ) : (
                          <ImCross style={cross_style} />
                        )}
                      </div>
                      <ChangeIsStaff
                        user_id={this.state.user.id}
                        name={this.state.user.username}
                        update_state={this.update_state}
                      />
                      <div className={"info_descr"}>
                        <RiAdminLine style={overviewIconStyle} /> Super user :
                      </div>
                      <div className={"info_span"}>
                        {this.state.user.is_superuser ? (
                          <TiTick style={tick_style} />
                        ) : (
                          <ImCross style={cross_style} />
                        )}
                      </div>
                      <ChangeIsSuperuser
                        user_id={this.state.user.id}
                        name={this.state.user.username}
                        update_state={this.update_state}
                      />
                      <div className={"info_descr"}>
                        <MdOutlineUpdate style={overviewIconStyle} /> Date
                        joined :
                      </div>
                      <div className={"info_span"}>
                        {this.state.user.date_joined
                          ? moment(this.state.user.date_joined).format(
                              "MMMM Do YYYY, h:mm:ss a"
                            )
                          : "N/A"}
                      </div>


                      <div className={"info_descr"}>
                        {this.state.user.is_active ? (
                          <FaCheck style={overviewIconStyle} />
                        ) : (
                          <ImCross style={overviewIconStyle} />
                        )}
                        Enabled
                      </div>
                      <div className={"info_span"}>
                        {this.state.user.is_active ? (
                          <TiTick style={tick_style} />
                        ) : (
                          <ImCross style={cross_style} />
                        )}
                      </div>
                      <ChangeIsEnabled
                        user_id={this.state.user.id}
                        name={this.state.user.username}
                        update_state={this.update_state}
                      />
                      
                    </Card.Body>
                    <Card.Footer>
                      <ChangePassword
                        user_id={this.state.user.id}
                        first_name={this.state.user.first_name}
                        update_state={this.update_state}
                      />
                      <DeleteUser
                        user_id={this.state.user.id}
                        update_state={this.update_state}
                      />
                    </Card.Footer>
                  </Card>
                </Grid.Column>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <ImProfile
                        style={{
                          color: "#F3702D",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      User Profile
                    </Card.Header>
                    <Card.Body>
                      <div className={"info_descr"}>
                        <BsFillTelephoneFill style={overviewIconStyle} /> Tel
                      </div>
                      <div className={"info_span"}>
                        {this.state.user.user_profile[0].phone_number
                          ? this.state.user.user_profile[0].phone_number
                          : "N/A"}
                      </div>
                      <ChangePhoneNumber
                        user_id={this.state.user.id}
                        username={this.state.user.username}
                        update_state={this.update_state}
                        telephone={
                          this.state.user.user_profile[0].phone_number
                            ? this.state.user.user_profile[0].phone_number
                            : "N/A"
                        }
                      />

                      <div className={"info_descr"}>
                        <MdAlternateEmail style={overviewIconStyle} /> Secondary Email :
                      </div>
                      <div className={"info_span"}>
                        {this.state.user.user_profile[0].secondary_email
                          ? this.state.user.user_profile[0].secondary_email
                          : "N/A"}
                      </div>
                      <ChangeSecondaryEmail
                        user_id={this.state.user.id}
                        username={this.state.user.username}
                        update_state={this.update_state}
                        secondary_email={
                          this.state.user.user_profile[0].secondary_email
                            ? this.state.user.user_profile[0].secondary_email
                            : "N/A"
                        }
                      />

                      <div className={"info_descr"}>
                        <FaFlag style={overviewIconStyle} /> Nationality
                      </div>
                      <div className={"info_span"}>
                        {this.state.user.user_profile[0].nationality ? (
                          <ReactCountryFlag
                            countryCode={
                              this.state.user.user_profile[0].nationality.code
                            }
                            svg
                            style={{
                              width: "1.5em",
                              height: "1.5em",
                              marginRight: 10,
                            }}
                            title={
                              this.state.user.user_profile[0].nationality.code
                            }
                          />
                        ) : null}
                        {this.state.user.user_profile[0].nationality
                          ? this.state.user.user_profile[0].nationality.name
                          : "N/A"}
                      </div>
                      <ChangeNationality
                        user_id={this.state.user.id}
                        username={this.state.user.username}
                        update_state={this.update_state}
                        country={this.state.user.user_profile[0].nationality}
                      />
                      <div className={"info_descr"}>
                        <FaAddressCard style={overviewIconStyle} /> Address
                      </div>
                      <div className={"info_span"}>
                        {this.state.user.user_profile[0].address
                          ? this.state.user.user_profile[0].address
                          : "N/A"}
                      </div>
                      <ChangeAddress
                        user_id={this.state.user.id}
                        username={this.state.user.username}
                        update_state={this.update_state}
                        address={
                          this.state.user.user_profile[0].address
                            ? this.state.user.user_profile[0].address
                            : "N/A"
                        }
                      />
                      <div className={"info_descr"}>
                        <FaShippingFast style={overviewIconStyle} /> Zip code :
                      </div>
                      <div className={"info_span"}>
                        {this.state.user.user_profile[0].zip_code
                          ? this.state.user.user_profile[0].zip_code
                          : "N/A"}
                      </div>
                      <ChangeZipCode
                        user_id={this.state.user.id}
                        username={this.state.user.username}
                        update_state={this.update_state}
                        zip_code={
                          this.state.user.user_profile[0].zip_code
                            ? this.state.user.user_profile[0].zip_code
                            : "N/A"
                        }
                      />
                      <div className={"info_descr"}>
                        <FaSignature style={overviewIconStyle} /> Signature :
                      </div>
                      {this.state.user.user_profile[0].signature ? (
                        <div
                          className={"info_span"}
                          dangerouslySetInnerHTML={{
                            __html: this.state.user.user_profile[0].signature,
                          }}
                        ></div>
                      ) : (
                        <div className={"info_span"}>N/A</div>
                      )}
                      <ChangeSignature
                        signature={this.state.user.user_profile[0].signature}
                        user_id={this.state.user.id}
                        username={this.state.user.username}
                        update_state={this.update_state}
                      />

                      <div className={"info_descr"}>
                        <FaSignature style={overviewIconStyle} /> Secondary Signature :
                      </div>
                      {this.state.user.user_profile[0].secondary_signature ? (
                        <div
                          className={"info_span"}
                          dangerouslySetInnerHTML={{
                            __html: this.state.user.user_profile[0].secondary_signature,
                          }}
                        ></div>
                      ) : (
                        <div className={"info_span"}>N/A</div>
                      )}
                      <ChangeSecondarySignature
                        signature={this.state.user.user_profile[0].secondary_signature}
                        user_id={this.state.user.id}
                        username={this.state.user.username}
                        update_state={this.update_state}
                      />

                    </Card.Body>
                    <Card.Footer>
                      <small className="mr-auto">
                        <BsInfoSquare
                          style={{
                            color: "#F3702D",
                            fontSize: "1.2em",
                            marginRight: "0.5em",
                          }}
                        />
                        None of user profile's fields are required.
                      </small>
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

export default UserOverView;
