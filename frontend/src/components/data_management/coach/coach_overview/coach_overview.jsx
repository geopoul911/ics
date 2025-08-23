// Built-ins
import React from "react";

// Modules / Functions
import axios from "axios";
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import moment from "moment";
import Swal from "sweetalert2";

// Icons / Images
import { BsInfoSquare } from "react-icons/bs";
import { FcDocument } from "react-icons/fc";
import { MdBlock } from "react-icons/md";
import { BsCloudDownload } from "react-icons/bs";

import { MdOutlineSupportAgent } from "react-icons/md"; // Coach Operator
import { SiMercedes } from "react-icons/si"; // make
import { FaBarcode } from "react-icons/fa"; // body num
import { MdEventSeat } from "react-icons/md"; // number of seats
import { BsCalendarDate } from "react-icons/bs"; // year
import { FaSimCard } from "react-icons/fa"; // sim
import { ImCross } from "react-icons/im"; // enabled/disabled
import { FaCheck } from "react-icons/fa"; // enabled/disabled
import { FaSatellite } from "react-icons/fa"; // IMEI
import { FaEuroSign } from "react-icons/fa"; // Emission
import { AiOutlineFieldNumber } from "react-icons/ai"; // Plate number

// Custom Made Components
import ChangeEnabled from "../../../modals/change_enabled";
import ChangeMake from "../../../modals/coaches/change_make";
import ChangeBodyNumber from "../../../modals/coaches/change_body_number";
import ChangePlateNumber from "../../../modals/coaches/change_plate_number";
import ChangeNumberOfSeats from "../../../modals/coaches/change_number_of_seats";
import ChangeEmission from "../../../modals/coaches/change_emission";
import ChangeYear from "../../../modals/coaches/change_year";
import DeleteObjectModal from "../../../modals/delete_object";
import AddCoachDocument from "../../../modals/coaches/add_doc";
import DeleteCoachDocument from "../../../modals/coaches/delete_doc";
import ChangeGPSDataSimCard from "../../../modals/coaches/change_gps_data_sim_card";
import ChangeIMEI from "../../../modals/coaches/change_imei";
import Notes from "../../../core/notes/notes";

// Global Variables
import {
  headers,
  loader,
  pageHeader,
  forbidden,
  restrictedUsers,
} from "../../../global_vars";

// Variables
window.Swal = Swal;

let overviewIconStyle = { color: "#F3702D", marginRight: "0.5em" };

let docs = {
  vehicle_technical_control: false,
  vehicle_insurance: false,
  lease_contract: false,
  vehicle_registration: false,
  tachograph_document: false,
  eu_community_passenger_transport_license: false,
};

let today = new Date();

const VIEW_COACH = "http://localhost:8000/api/data_management/coach/";
const DOWNLOAD_COACH_DOCUMENT =
  "http://localhost:8000/api/data_management/download_coach_document/";

function getCoachId() {
  return window.location.pathname.split("/")[3];
}

class CoachOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coach: {
        notes: {},
      },
      coach_operator: "",
      is_loaded: false,
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
      .get(VIEW_COACH + getCoachId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          coach: res.data.coach,
          coach_operator: res.data.coach_operator,
          notes: res.data.coach.notes,
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

  update_notes = (notes) => {
    var coach = { ...this.state.coach };
    coach.notes = notes;
    this.setState({
      coach: coach,
    });
  };

  update_state = (update_state) => {
    this.setState({ coach: update_state });
  };

  refresh = () => {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_COACH + getCoachId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          coach: res.data.coach,
          coach_operator: res.data.coach_operator,
          notes: res.data.coach.notes,
          is_loaded: true,
        });
      });
  };

  update_coach_op = (coach_operator) => {
    this.setState({ coach_operator: coach_operator });
  };

  downloadCoachDocument = (fileName) => {
    axios
      .get(VIEW_COACH + getCoachId(), {
        headers: headers,
        params: {
          file: fileName,
        },
      })
      .then((res) => {
        window.open(
          DOWNLOAD_COACH_DOCUMENT + getCoachId() + "?file=" + fileName
        );
      });
  };

  render() {
    return (
      <>
        <div className="mainContainer">
          {pageHeader("coach_overview", this.state.coach.make)}
          {this.state.forbidden ? (
            <>{forbidden("Coach Overview")}</>
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
                      Coach Information
                    </Card.Header>
                    <Card.Body>
                      <div className={"info_descr"}>
                        <MdOutlineSupportAgent style={overviewIconStyle} />
                        Coach Operator
                      </div>
                      <div className={"info_span"}>
                        {this.state.coach.coach_operator
                          ? this.state.coach.coach_operator.name
                          : "N/A"}
                      </div>
                      <MdBlock
                        title={"Coach's Coach Operator cannot be changed"}
                        style={{
                          color: "red",
                          fontSize: 16,
                          float: "right",
                          marginTop: 5,
                          cursor: "unset",
                        }}
                        className={"edit_icon"}
                      />
                      <div className={"info_descr"}>
                        <SiMercedes style={overviewIconStyle} /> Make
                      </div>
                      <div className={"info_span"}>
                        {this.state.coach.make ? this.state.coach.make : "N/A"}
                      </div>
                      <ChangeMake
                        coach_id={this.state.coach.id}
                        update_state={this.update_state}
                        make={
                          this.state.coach.make ? this.state.coach.make : ""
                        }
                      />
                      <div className={"info_descr"}>
                        <FaBarcode style={overviewIconStyle} /> Body number
                      </div>
                      <div className={"info_span"}>
                        {this.state.coach.body_number
                          ? this.state.coach.body_number
                          : "N/A"}
                      </div>
                      <ChangeBodyNumber
                        coach_id={this.state.coach.id}
                        make={this.state.coach.make}
                        update_state={this.update_state}
                        body_number={
                          this.state.coach.body_number
                            ? this.state.coach.body_number
                            : ""
                        }
                      />
                      <div className={"info_descr"}>
                        <AiOutlineFieldNumber style={overviewIconStyle} /> Plate
                        number
                      </div>
                      <div className={"info_span"}>
                        {this.state.coach.plate_number
                          ? this.state.coach.plate_number
                          : "N/A"}
                      </div>
                      <ChangePlateNumber
                        coach_id={this.state.coach.id}
                        make={this.state.coach.make}
                        update_state={this.update_state}
                        plate_number={
                          this.state.coach.plate_number
                            ? this.state.coach.plate_number
                            : ""
                        }
                      />
                      <div className={"info_descr"}>
                        <MdEventSeat style={overviewIconStyle} /> Number of
                        seats
                      </div>
                      <div className={"info_span"}>
                        {this.state.coach.number_of_seats
                          ? this.state.coach.number_of_seats
                          : "N/A"}
                      </div>
                      <ChangeNumberOfSeats
                        coach_id={this.state.coach.id}
                        make={this.state.coach.make}
                        update_state={this.update_state}
                        number_of_seats={
                          this.state.coach.number_of_seats
                            ? this.state.coach.number_of_seats
                            : ""
                        }
                      />
                      <div className={"info_descr"}>
                        <FaEuroSign style={overviewIconStyle} /> Emission
                      </div>
                      <div className={"info_span"}>
                        {this.state.coach.emission ? (
                          <> Euro {this.state.coach.emission} </>
                        ) : (
                          "N/A"
                        )}
                      </div>
                      <ChangeEmission
                        coach_id={this.state.coach.id}
                        make={this.state.coach.make}
                        update_state={this.update_state}
                        emission={
                          this.state.coach.emission
                            ? this.state.coach.emission
                            : ""
                        }
                      />
                      <div className={"info_descr"}>
                        <BsCalendarDate style={overviewIconStyle} /> Year
                      </div>
                      <div className={"info_span"}>
                        {this.state.coach.year ? this.state.coach.year : "N/A"}
                      </div>
                      <ChangeYear
                        coach_id={this.state.coach.id}
                        make={this.state.coach.make}
                        update_state={this.update_state}
                        year={
                          this.state.coach.year ? this.state.coach.year : ""
                        }
                      />
                      <div className={"info_descr"}>
                        <FaSimCard style={overviewIconStyle} /> GPS Data Sim
                        Card
                      </div>
                      <div className={"info_span"}>
                        {this.state.coach.gps_data_sim_card
                          ? this.state.coach.gps_data_sim_card
                          : "N/A"}
                      </div>
                      <ChangeGPSDataSimCard
                        coach_id={this.state.coach.id}
                        make={this.state.coach.make}
                        update_state={this.update_state}
                        gps_data_sim_card={
                          this.state.coach.gps_data_sim_card
                            ? this.state.coach.gps_data_sim_card
                            : ""
                        }
                      />
                      <div className={"info_descr"}>
                        <FaSatellite style={overviewIconStyle} /> IMEI
                      </div>
                      <div className={"info_span"}>
                        {this.state.coach.imei ? this.state.coach.imei : "N/A"}
                      </div>
                      <ChangeIMEI
                        coach_id={this.state.coach.id}
                        make={this.state.coach.make}
                        update_state={this.update_state}
                        IMEI={
                          this.state.coach.imei ? this.state.coach.imei : ""
                        }
                      />
                      <div className={"info_descr"}>
                        {this.state.coach.enabled ? (
                          <FaCheck style={overviewIconStyle} />
                        ) : (
                          <ImCross style={overviewIconStyle} />
                        )}
                        Enabled
                      </div>
                      <div className={"info_span"}>
                        {this.state.coach.enabled ? "Enabled" : "Disabled"}
                      </div>
                      <ChangeEnabled
                        object_id={this.state.coach.id}
                        object_name={this.state.coach.make}
                        object_type={"Coach"}
                        update_state={this.update_state}
                      />
                    </Card.Body>
                    <Card.Footer>
                      <DeleteObjectModal
                        object_id={this.state.coach.id}
                        object_name={this.state.coach.make}
                        object_type={"Coach"}
                        update_state={this.update_state}
                      />
                      <small className="mr-auto">
                        <BsInfoSquare
                          style={{
                            color: "#F3702D",
                            fontSize: "1.5em",
                            marginRight: "0.5em",
                          }}
                        />
                        We cannot update coach's coach operator. If the vehicle
                        is also used for other coach operators, it will have to
                        be recreated
                      </small>
                    </Card.Footer>
                  </Card>
                </Grid.Column>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <FcDocument
                        style={{
                          color: "#F3702D",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      Coach's documents
                    </Card.Header>
                    <Card.Body>
                      {/* eslint-disable-next-line */}
                      {this.state.coach.documents.map((e) => {
                        if (e.type === "KTEO") {
                          docs["vehicle_technical_control"] = true;
                          docs["vehicle_technical_control_exp_date"] =
                            e.expiry_date;
                          docs["vehicle_technical_control_id"] = e.id;
                          docs["vehicle_technical_control_file_name"] = e.name;
                        } else if (e.type === "VI") {
                          docs["vehicle_insurance"] = true;
                          docs["vehicle_insurance_exp_date"] = e.expiry_date;
                          docs["vehicle_insurance_id"] = e.id;
                          docs["vehicle_insurance_file_name"] = e.name;
                        } else if (e.type === "LC") {
                          docs["lease_contract"] = true;
                          docs["lease_contract_exp_date"] = e.expiry_date;
                          docs["lease_contract_id"] = e.id;
                          docs["lease_contract_file_name"] = e.name;
                        } else if (e.type === "VR") {
                          docs["vehicle_registration"] = true;
                          docs["vehicle_registration_exp_date"] = e.expiry_date;
                          docs["vehicle_registration_id"] = e.id;
                          docs["vehicle_registration_file_name"] = e.name;
                        } else if (e.type === "TCD") {
                          docs["tachograph_document"] = true;
                          docs["tachograph_document_exp_date"] = e.expiry_date;
                          docs["tachograph_document_id"] = e.id;
                          docs["tachograph_document_file_name"] = e.name;
                        } else if (e.type === "CPTL") {
                          docs[
                            "eu_community_passenger_transport_license"
                          ] = true;
                          docs[
                            "eu_community_passenger_transport_license_exp_date"
                          ] = e.expiry_date;
                          docs["eu_community_passenger_transport_license_id"] =
                            e.id;
                          docs[
                            "eu_community_passenger_transport_license_file_name"
                          ] = e.name;
                        }
                      })}
                      <div style={{ width: "50%" }} className={"info_span"}>
                        Vehicle technical control (KTEO)
                      </div>
                      {docs["vehicle_technical_control"] ? (
                        <>
                          <DeleteCoachDocument
                            coach_id={this.state.coach.id}
                            document_id={docs["vehicle_technical_control_id"]}
                            document_name={
                              docs["vehicle_technical_control_file_name"]
                            }
                            type={"Vehicle Technical Control"}
                          />
                          <BsCloudDownload
                            className="download_doc_icon"
                            onClick={() => {
                              this.downloadCoachDocument(
                                docs["vehicle_technical_control_file_name"]
                              );
                            }}
                            style={{
                              color: "#F3702D",
                              fontSize: "1.5em",
                              marginRight: 10,
                              marginTop: 5,
                              float: "right",
                            }}
                          />
                          <strong style={{ float: "right", marginRight: 50 }}>
                            {moment(today).format() >
                            moment(
                              docs["vehicle_technical_control_exp_date"]
                            ).format() ? (
                              <div style={{ color: "red" }}>
                                Expiration date :
                                {moment(
                                  docs["vehicle_technical_control_exp_date"]
                                ).format("DD-MM-YYYY")}
                              </div>
                            ) : (
                              <>
                                Expiration date :
                                {moment(
                                  docs["vehicle_technical_control_exp_date"]
                                ).format("DD-MM-YYYY")}
                              </>
                            )}
                          </strong>
                        </>
                      ) : (
                        <AddCoachDocument
                          type={"vehicle technical control"}
                          coach_id={this.state.coach.id}
                          refresh={this.refresh}
                        />
                      )}
                      <div style={{ width: "50%" }} className={"info_span"}>
                        Vehicle insurance
                      </div>
                      {docs["vehicle_insurance"] ? (
                        <>
                          <DeleteCoachDocument
                            coach_id={this.state.coach.id}
                            document_id={docs["vehicle_insurance_id"]}
                            document_name={docs["vehicle_insurance_file_name"]}
                            type={"Vehicle Insurance"}
                          />
                          <BsCloudDownload
                            className="download_doc_icon"
                            onClick={() => {
                              this.downloadCoachDocument(
                                docs["vehicle_insurance_file_name"]
                              );
                            }}
                            style={{
                              color: "#F3702D",
                              fontSize: "1.5em",
                              marginRight: "0.5em",
                              float: "right",
                            }}
                          />
                          <strong style={{ float: "right", marginRight: 100 }}>
                            {moment(today).format() >
                            moment(
                              docs["vehicle_insurance_exp_date"]
                            ).format() ? (
                              <div style={{ color: "red" }}>
                                Expiration date :
                                {moment(
                                  docs["vehicle_insurance_exp_date"]
                                ).format("DD-MM-YYYY")}
                              </div>
                            ) : (
                              <>
                                Expiration date :
                                {moment(
                                  docs["vehicle_insurance_exp_date"]
                                ).format("DD-MM-YYYY")}
                              </>
                            )}
                          </strong>
                        </>
                      ) : (
                        <AddCoachDocument
                          type={"vehicle insurance"}
                          coach_id={this.state.coach.id}
                          refresh={this.refresh}
                        />
                      )}
                      <div style={{ width: "50%" }} className={"info_span"}>
                        Lease contract
                      </div>
                      {docs["lease_contract"] ? (
                        <>
                          <DeleteCoachDocument
                            coach_id={this.state.coach.id}
                            document_id={docs["lease_contract_id"]}
                            document_name={docs["lease_contract_file_name"]}
                            type={"Lease Contract Id"}
                          />
                          <BsCloudDownload
                            className="download_doc_icon"
                            onClick={() => {
                              this.downloadCoachDocument(
                                docs["lease_contract_file_name"]
                              );
                            }}
                            style={{
                              color: "#F3702D",
                              fontSize: "1.5em",
                              marginRight: "0.5em",
                              float: "right",
                            }}
                          />
                          <strong style={{ float: "right", marginRight: 100 }}>
                            {moment(today).format() >
                            moment(docs["lease_contract_exp_date"]).format() ? (
                              <div style={{ color: "red" }}>
                                Expiration date :
                                {moment(docs["lease_contract_exp_date"]).format(
                                  "DD-MM-YYYY"
                                )}
                              </div>
                            ) : (
                              <>
                                Expiration date :
                                {moment(docs["lease_contract_exp_date"]).format(
                                  "DD-MM-YYYY"
                                )}
                              </>
                            )}
                          </strong>
                        </>
                      ) : (
                        <AddCoachDocument
                          type={"lease contract"}
                          coach_id={this.state.coach.id}
                          refresh={this.refresh}
                        />
                      )}
                      <div style={{ width: "50%" }} className={"info_span"}>
                        Vehicle registration
                      </div>
                      {docs["vehicle_registration"] ? (
                        <>
                          <DeleteCoachDocument
                            coach_id={this.state.coach.id}
                            document_id={docs["vehicle_registration_id"]}
                            document_name={
                              docs["vehicle_registration_file_name"]
                            }
                            type={"Vehicle Registration"}
                          />
                          <BsCloudDownload
                            className="download_doc_icon"
                            onClick={() => {
                              this.downloadCoachDocument(
                                docs["vehicle_registration_file_name"]
                              );
                            }}
                            style={{
                              color: "#F3702D",
                              fontSize: "1.5em",
                              marginRight: "0.5em",
                              float: "right",
                            }}
                          />
                          <strong style={{ float: "right", marginRight: 100 }}>
                            {moment(today).format() > moment(docs["vehicle_registration_exp_date"]).format() ? (
                              <div style={{ color: "red" }}>
                                Expiration date : {moment(docs["vehicle_registration_exp_date"]).format("DD-MM-YYYY")}
                              </div>
                            ) : (
                              <>
                                Expiration date : {moment(docs["vehicle_registration_exp_date"]).format("DD-MM-YYYY")}
                              </>
                            )}
                          </strong>
                        </>
                      ) : (
                        <AddCoachDocument
                          type={"vehicle registration"}
                          coach_id={this.state.coach.id}
                          refresh={this.refresh}
                        />
                      )}
                      <div style={{ width: "50%" }} className={"info_span"}>
                        Tachograph documents
                      </div>
                      {docs["tachograph_document"] ? (
                        <>
                          <DeleteCoachDocument
                            coach_id={this.state.coach.id}
                            document_id={docs["tachograph_document_id"]}
                            document_name={docs["tachograph_document_file_name"]}
                            type={"Tachograph Document"}
                          />
                          <BsCloudDownload
                            className="download_doc_icon"
                            onClick={() => {this.downloadCoachDocument(docs["tachograph_document_file_name"]);}}
                            style={{
                              color: "#F3702D",
                              fontSize: "1.5em",
                              marginRight: "0.5em",
                              float: "right",
                            }}
                          />
                          <strong style={{ float: "right", marginRight: 100 }}>
                            {moment(today).format() > moment(docs["tachograph_document_exp_date"]).format() ? (
                              <div style={{ color: "red" }}>
                                Expiration date :
                                {moment(
                                  docs["tachograph_document_exp_date"]
                                ).format("DD-MM-YYYY")}
                              </div>
                            ) : (
                              <>
                                Expiration date :
                                {moment(docs["tachograph_document_exp_date"]).format("DD-MM-YYYY")}
                              </>
                            )}
                          </strong>
                        </>
                      ) : (
                        <AddCoachDocument
                          type={"tachograph document"}
                          coach_id={this.state.coach.id}
                          refresh={this.refresh}
                        />
                      )}
                      <div style={{ width: "50%" }} className={"info_span"}>
                        EU community passenger transport license
                      </div>
                      {docs["eu_community_passenger_transport_license"] ? (
                        <>
                          <DeleteCoachDocument
                            coach_id={this.state.coach.id}
                            document_id={docs["eu_community_passenger_transport_license_id"]}
                            document_name={docs["eu_community_passenger_transport_license_file_name"]}
                            type={"EU Community Passenger Transport License"}
                          />
                          <BsCloudDownload
                            className="download_doc_icon"
                            onClick={() => { this.downloadCoachDocument(docs["eu_community_passenger_transport_license_file_name"]);}}
                            style={{
                              color: "#F3702D",
                              fontSize: "1.5em",
                              marginRight: "0.5em",
                              float: "right",
                            }}
                          />
                          <strong style={{ float: "right", marginRight: 100 }}>
                            {moment(today).format() > moment(docs["eu_community_passenger_transport_license_exp_date"]).format() ? (
                              <div style={{ color: "red" }}>
                                Expiration date :
                                {moment(docs["eu_community_passenger_transport_license_exp_date"]).format("DD-MM-YYYY")}
                              </div>
                            ) : (
                              <>
                                Expiration date :
                                {moment(docs["eu_community_passenger_transport_license_exp_date"]).format("DD-MM-YYYY")}
                              </>
                            )}
                          </strong>
                        </>
                      ) : (
                        <AddCoachDocument
                          type={"eu community passenger transport license"}
                          coach_id={this.state.coach.id}
                          refresh={this.refresh}
                        />
                      )}
                    </Card.Body>
                    <Card.Footer>
                      <small className="mr-auto">
                        <BsInfoSquare
                          style={{
                            color: "#F3702D",
                            fontSize: "1.5em",
                            marginRight: "0.5em",
                          }}
                        />
                        To check all expired documents go to
                        <a href="http://localhost:8000/reports/expiring_documents">
                          Expiring Documents
                        </a>
                      </small>
                    </Card.Footer>
                  </Card>
                  <Notes
                    update_notes={this.update_notes}
                    object_id={this.state.coach.id}
                    object_name={this.state.coach.name}
                    object_type={"Coach"}
                    update_state={this.update_state}
                    notes={this.state.coach.notes}
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

export default CoachOverView;
