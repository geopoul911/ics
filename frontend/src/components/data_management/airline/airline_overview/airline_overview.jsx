// Built-ins
import React from "react";

// Icons-images
import { BsInfoSquare } from "react-icons/bs";
import { MdCreditCard } from "react-icons/md";
import { FaHashtag } from "react-icons/fa";
import { IoMdBarcode } from "react-icons/io";
import { ImCross } from "react-icons/im";
import { FaCheck } from "react-icons/fa";
import { IoMdBusiness } from "react-icons/io";

// Functions / Modules
import axios from "axios";
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import Swal from "sweetalert2";

// Custom Made Components
import ChangeName from "../../../modals/change_name";
import ChangeAbbreviation from "../../../modals/change_abbreviation";
import ChangeEnabled from "../../../modals/change_enabled";
import DeleteObjectModal from "../../../modals/delete_object";
import EditPaymentDetails from "../../../modals/edit_payment_details";

// Global Variables
import {
  headers,
  iconStyle,
  loader,
  pageHeader,
  forbidden,
} from "../../../global_vars";

// Variables
window.Swal = Swal;

let overviewIconStyle = { color: "#93ab3c", marginRight: "0.5em" };

const VIEW_AIRLINE = "http://localhost:8000/api/data_management/airline/";

function getAirlineId() {
  return window.location.pathname.split("/")[3];
}

class AirlineOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      airline: {},
      notes: {},
      is_loaded: false,
      forbidden: false,
    };
  }

  componentDidMount() {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_AIRLINE + getAirlineId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          airline: res.data.airline,
          notes: res.data.airline.notes,
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
    this.setState({ airline: update_state });
  };

  add_note = (note) => {
    var airline = { ...this.state.airline };
    airline.notes = note;
    this.setState({
      airline: airline,
      notes: note,
    });
  };

  edit_note = (note) => {
    var airline = { ...this.state.airline };
    airline.notes = note;
    this.setState({
      airline: airline,
      notes: note,
    });
  };

  delete_note = (note) => {
    var airline = { ...this.state.airline };
    airline.notes = note;
    this.setState({
      airline: airline,
      notes: note,
    });
  };

  render() {
    return (
      <>
        <div className="rootContainer">
          {pageHeader("airline_overview", this.state.airline.name)}
          {this.state.forbidden ? (
            <>{forbidden("Airline Overview")}</>
          ) : this.state.is_loaded ? (
            <>
              <Grid stackable columns={2} divided>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <BsInfoSquare style={iconStyle} />
                      Airline Information
                    </Card.Header>
                    <Card.Body>
                      <div className={"info_descr"}>
                        <FaHashtag style={overviewIconStyle} /> Name
                      </div>
                      <div className={"info_span"}>
                        {this.state.airline.name
                          ? this.state.airline.name
                          : "N/A"}
                      </div>
                      <ChangeName
                        object_id={this.state.airline.id}
                        object_name={this.state.airline.name}
                        object_type={"Airline"}
                        update_state={this.update_state}
                      />

                      <div className={"info_descr"}> <IoMdBusiness style={overviewIconStyle} /> Company </div>
                      <div className={"info_span"}>
                        {this.state.airline.payment_details
                          ? this.state.airline.payment_details.company === "" ||
                            this.state.airline.payment_details.company === null
                            ? "N/A"
                            : 
                            <span style={{color: this.state.airline.payment_details.company === this.state.airline.name ? 'blue': ''}}>
                              {this.state.airline.payment_details.company}
                            </span>
                          : "N/A"}
                      </div>

                      <div className={"info_descr"}>
                        <IoMdBarcode style={overviewIconStyle} /> Abbreviation
                      </div>
                      <div className={"info_span"}>
                        {this.state.airline.abbreviation
                          ? this.state.airline.abbreviation
                          : "N/A"}
                      </div>
                      <ChangeAbbreviation
                        object_id={this.state.airline.id}
                        object_name={this.state.airline.name}
                        object_type={"Airline"}
                        update_state={this.update_state}
                        abbreviation={
                          this.state.airline.abbreviation
                            ? this.state.airline.abbreviation
                            : ""
                        }
                      />
                      <div className={"info_descr"}>
                        {this.state.airline.enabled ? (
                          <FaCheck style={overviewIconStyle} />
                        ) : (
                          <ImCross style={overviewIconStyle} />
                        )}
                        Enabled
                      </div>
                      <div className={"info_span"}>
                        {this.state.airline.enabled ? "Enabled" : "Disabled"}
                      </div>
                      <ChangeEnabled
                        object_id={this.state.airline.id}
                        object_name={this.state.airline.name}
                        object_type={"Airline"}
                        update_state={this.update_state}
                      />
                    </Card.Body>
                    <Card.Footer>
                      <DeleteObjectModal
                        object_id={this.state.airline.id}
                        object_name={this.state.airline.name}
                        object_type={"Airline"}
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
                        {this.state.airline.payment_details
                          ? this.state.airline.payment_details.company === "" ||
                            this.state.airline.payment_details.company === null
                            ? "N/A"
                            : this.state.airline.payment_details.company
                          : "N/A"}
                      </div>
                      <div className={"info_descr"}> Currency </div>
                      <div className={"info_span"}>
                        {this.state.airline.payment_details
                          ? this.state.airline.payment_details.currency ===
                              "" ||
                            this.state.airline.payment_details.currency === null
                            ? "N/A"
                            : this.state.airline.payment_details.currency
                          : "N/A"}
                      </div>
                      <div className={"info_descr"}>
                        {this.state.airline.payment_details.currency === "GBP"
                          ? "Account Number"
                          : "IBAN"}
                      </div>
                      <div className={"info_span"}>
                        {this.state.airline.payment_details
                          ? this.state.airline.payment_details.iban === "" ||
                            this.state.airline.payment_details.iban === null
                            ? "N/A"
                            : this.state.airline.payment_details.iban
                          : "N/A"}
                      </div>
                      <div className={"info_descr"}>
                        {this.state.airline.payment_details.currency === "GBP"
                          ? "Sort Code"
                          : "Swift"}
                      </div>
                      <div className={"info_span"}>
                        {this.state.airline.payment_details
                          ? this.state.airline.payment_details.swift === "" ||
                            this.state.airline.payment_details.swift === null
                            ? "N/A"
                            : this.state.airline.payment_details.swift
                          : "N/A"}
                      </div>
                    </Card.Body>
                    <Card.Footer>
                      <EditPaymentDetails
                        object_id={this.state.airline.id}
                        object_name={this.state.airline.name}
                        object_type={"Airline"}
                        update_state={this.update_state}
                        payment_details={this.state.airline.payment_details}
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

export default AirlineOverView;
