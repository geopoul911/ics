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
import { BsCloudDownload } from "react-icons/bs";
import { MdBlock } from "react-icons/md";
import { FaMinus } from "react-icons/fa";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { BsMailbox } from "react-icons/bs";
import { FaHashtag, FaCheck, FaBirthdayCake } from "react-icons/fa";
import { FaAddressCard } from "react-icons/fa";
import { BsFillTelephoneFill } from "react-icons/bs";
import { MdAlternateEmail } from "react-icons/md";
import { MdSupportAgent } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { GiConvergenceTarget } from "react-icons/gi";

// Custom Made Components
import ChangeName from "../../../modals/change_name";
import ChangeAddress from "../../../modals/change_address";
import ChangeEmail from "../../../modals/change_email";
import ChangeDateOfBirth from "../../../modals/change_date_of_birth";
import ChangeTel from "../../../modals/change_tel";
import AddDriverDocument from "../../../modals/drivers/add_doc";
import DeleteDriverDocument from "../../../modals/drivers/delete_doc";
import ChangeEnabled from "../../../modals/change_enabled";
import DeleteObjectModal from "../../../modals/delete_object";
import Notes from "../../../core/notes/notes";
import ChangeAddress2 from "../../../modals/change_address2";
import ChangePostal from "../../../modals/change_postal";
import ChangeRegion from "../../../modals/change_region";

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
  has_driver_license: false,
  tachograph_card: false,
  passport: false,
  identification_card: false,
};

const VIEW_DRIVER = "http://localhost:8000/api/data_management/driver/";
const DOWNLOAD_DRIVER_DOCUMENT =
  "http://localhost:8000/api/data_management/download_driver_document/";

function getDriverId() {
  return window.location.pathname.split("/")[3];
}

let today = new Date();

class DriverOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      driver: {
        notes: {},
      },
      coach_operator: "",
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
      .get(VIEW_DRIVER + getDriverId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          driver: res.data.driver,
          coach_operator: res.data.coach_operator,
          notes: res.data.driver.notes,
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
    var driver = { ...this.state.driver };
    driver.notes = notes;
    this.setState({
      driver: driver,
    });
  };

  update_state = (update_state) => {
    this.setState({ driver: update_state });
  };

  refresh = () => {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_DRIVER + getDriverId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          driver: res.data.driver,
          coach_operator: res.data.coach_operator,
          notes: res.data.driver.notes,
          is_loaded: true,
        });
      });
  };

  update_coach_op = (coach_operator) => {
    this.setState({ coach_operator: coach_operator });
  };

  downloadDriverDocument = (fileName) => {
    axios
      .get(VIEW_DRIVER + getDriverId(), {
        headers: headers,
        params: {
          file: fileName,
        },
      })
      .then((res) => {
        window.open(
          DOWNLOAD_DRIVER_DOCUMENT + getDriverId() + "?file=" + fileName
        );
      });
  };

  render() {
    return (
      <>
        <div className="mainContainer">
          {pageHeader("driver_overview", this.state.driver.name)}
          {this.state.forbidden ? (
            <>{forbidden("Driver Overview")}</>
          ) : this.state.is_loaded ? (
            <>
              <Grid stackable columns={2} divided>
                <Grid.Row style={{ marginLeft: 10 }}>
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
                        Driver Information
                      </Card.Header>
                      <Card.Body>
                        <div className={"info_descr"}>
                          <FaHashtag style={overviewIconStyle} /> Name
                        </div>
                        <div className={"info_span"}>
                          {this.state.driver.name
                            ? this.state.driver.name
                            : "N/A"}
                        </div>

                        <ChangeName
                          object_id={this.state.driver.id}
                          object_name={this.state.driver.name}
                          object_type={"Driver"}
                          update_state={this.update_state}
                        />
                        <div className={"info_descr"}>
                          <FaAddressCard style={overviewIconStyle} /> Address
                        </div>
                        <div className={"info_span"}>
                          {this.state.driver.address
                            ? this.state.driver.address
                            : "N/A"}
                        </div>
                        <ChangeAddress
                          object_id={this.state.driver.id}
                          object_name={this.state.driver.name}
                          object_type={"Driver"}
                          update_state={this.update_state}
                          address={
                            this.state.driver.address
                              ? this.state.driver.address
                              : "N/A"
                          }
                        />

                        {this.state.show_address2 ? (
                          <>
                            <div className={"info_descr"}>
                              <FaAddressCard style={overviewIconStyle} />
                              Address 2
                            </div>
                            <div className={"info_span"}>
                              {this.state.driver.address2
                                ? this.state.driver.address2
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
                              object_id={this.state.driver.id}
                              object_name={this.state.driver.name}
                              object_type={"Driver"}
                              update_state={this.update_state}
                              address={
                                this.state.driver.address2
                                  ? this.state.driver.address2
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
                          {this.state.driver.tel
                            ? this.state.driver.tel
                            : "N/A"}
                        </div>
                        <ChangeTel
                          object_id={this.state.driver.id}
                          object_name={this.state.driver.name}
                          object_type={"Driver"}
                          tel_num={"tel"}
                          update_state={this.update_state}
                          telephone={
                            this.state.driver.tel
                              ? this.state.driver.tel
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
                              {this.state.driver.tel2
                                ? this.state.driver.tel2
                                : "N/A"}
                            </div>

                            <ChangeTel
                              object_id={this.state.driver.id}
                              object_name={this.state.driver.name}
                              object_type={"Driver"}
                              tel_num={"tel2"}
                              update_state={this.update_state}
                              telephone={
                                this.state.driver.tel2
                                  ? this.state.driver.tel2
                                  : "N/A"
                              }
                            />
                            <div className={"info_descr"}>
                              <BsFillTelephoneFill style={overviewIconStyle} />
                              Tel. 3
                            </div>
                            <div className={"info_span"}>
                              {this.state.driver.tel3
                                ? this.state.driver.tel3
                                : "N/A"}
                            </div>

                            <FaMinus
                              className="minus-icon"
                              title="Hide address 2"
                              style={{ marginLeft: 20 }}
                              onClick={() =>
                                this.setState({ show_tel2: false })
                              }
                            />

                            <ChangeTel
                              object_id={this.state.driver.id}
                              object_name={this.state.driver.name}
                              object_type={"Driver"}
                              tel_num={"tel3"}
                              update_state={this.update_state}
                              telephone={
                                this.state.driver.tel3
                                  ? this.state.driver.tel3
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
                          {this.state.driver.postal
                            ? this.state.driver.postal
                            : "N/A"}
                        </div>
                        <ChangePostal
                          object_id={this.state.driver.id}
                          object_name={this.state.driver.name}
                          object_type={"Driver"}
                          update_state={this.update_state}
                          postal={
                            this.state.driver.postal
                              ? this.state.driver.postal
                              : "N/A"
                          }
                        />

                        <div className={"info_descr"}>
                          <MdAlternateEmail style={overviewIconStyle} />
                          Email
                        </div>
                        <div className={"info_span"}>
                          {this.state.driver.email
                            ? this.state.driver.email
                            : "N/A"}
                        </div>
                        <ChangeEmail
                          object_id={this.state.driver.id}
                          object_name={this.state.driver.name}
                          object_type={"Driver"}
                          update_state={this.update_state}
                          email={
                            this.state.driver.email
                              ? this.state.driver.email
                              : ""
                          }
                        />
                        <div className={"info_descr"}>
                          <FaBirthdayCake style={overviewIconStyle} />
                          Date Of Birth
                        </div>
                        <div className={"info_span"}>
                          {this.state.driver.date_of_birth
                            ? moment(this.state.driver.date_of_birth).format(
                                "DD-MM-YYYY"
                              )
                            : "N/A"}
                        </div>
                        <ChangeDateOfBirth
                          object_id={this.state.driver.id}
                          object_name={this.state.driver.name}
                          object_type={"Driver"}
                          update_state={this.update_state}
                          date_of_birth={
                            this.state.driver.date_of_birth
                              ? this.state.driver.date_of_birth
                              : ""
                          }
                        />

                      <div className={"info_descr"}>
                        <GiConvergenceTarget style={overviewIconStyle} />
                        Region
                      </div>

                      <div className={"info_span"}>
                        {this.state.driver.region ? this.state.driver.region : 'N/A'}
                      </div>

                      <ChangeRegion
                        object_id={this.state.driver.id}
                        object_name={this.state.driver.name}
                        object_type={"Driver"}
                        update_state={this.update_state}
                      />

                        <div className={"info_descr"}>
                          <MdSupportAgent style={overviewIconStyle} /> Coach
                          Operator
                        </div>
                        <div className={"info_span"}>
                          {this.state.coach_operator
                            ? this.state.coach_operator
                            : "N/A"}
                        </div>
                        <MdBlock
                          title={"Driver's Coach Operator cannot be changed"}
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
                          {this.state.driver.enabled ? (
                            <FaCheck style={overviewIconStyle} />
                          ) : (
                            <ImCross style={overviewIconStyle} />
                          )}
                          Enabled
                        </div>
                        <div className={"info_span"}>
                          {this.state.driver.enabled ? "Enabled" : "Disabled"}
                        </div>
                        <ChangeEnabled
                          object_id={this.state.driver.id}
                          object_name={this.state.driver.name}
                          object_type={"Driver"}
                          update_state={this.update_state}
                        />
                      </Card.Body>
                      <Card.Footer>
                        <DeleteObjectModal
                          object_id={this.state.driver.id}
                          object_name={this.state.driver.name}
                          object_type={"Driver"}
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
                          If driver has changed Coach operator, he will have to
                          be recreated with the new value
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
                        Driver's documents
                      </Card.Header>
                      <Card.Body>
                        {/* eslint-disable-next-line */}
                        {this.state.driver.documents.map((e) => {
                          if (e.type === "DL") {
                            docs["has_driver_license"] = true;
                            docs["driver_license_exp_date"] = e.expiry_date;
                            docs["driver_license_id"] = e.id;
                            docs["driver_license_file_name"] = e.name;
                          } else if (e.type === "TC") {
                            docs["tachograph_card"] = true;
                            docs["tachograph_card_exp_date"] = e.expiry_date;
                            docs["tachograph_card_id"] = e.id;
                            docs["tachograph_card_file_name"] = e.name;
                          } else if (e.type === "PST") {
                            docs["passport"] = true;
                            docs["passport_exp_date"] = e.expiry_date;
                            docs["passport_id"] = e.id;
                            docs["passport_file_name"] = e.name;
                          } else if (e.type === "ID") {
                            docs["identification_card"] = true;
                            docs["identification_card_exp_date"] =
                              e.expiry_date;
                            docs["identification_card_id"] = e.id;
                            docs["identification_card_file_name"] = e.name;
                          }
                        })}
                        <div style={{ width: "50%" }} className={"info_span"}>
                          Driver's License
                        </div>
                        {docs["has_driver_license"] ? (
                          <>
                            <DeleteDriverDocument
                              driver_id={this.state.driver.id}
                              document_id={docs["driver_license_id"]}
                              document_name={docs["driver_license_file_name"]}
                              type={"Driver License"}
                            />
                            <BsCloudDownload
                              className="download_doc_icon"
                              onClick={() => {
                                this.downloadDriverDocument(
                                  docs["driver_license_file_name"]
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
                            <strong
                              style={{ float: "right", marginRight: 100 }}
                            >
                              {moment(today).format() >
                              moment(
                                docs["driver_license_exp_date"]
                              ).format() ? (
                                <div style={{ color: "red" }}>
                                  Expiration date :
                                  {moment(
                                    docs["driver_license_exp_date"]
                                  ).format("DD-MM-YYYY")}
                                </div>
                              ) : (
                                <>
                                  Expiration date :
                                  {moment(
                                    docs["driver_license_exp_date"]
                                  ).format("DD-MM-YYYY")}
                                </>
                              )}
                            </strong>
                          </>
                        ) : (
                          <AddDriverDocument
                            type={"driver license"}
                            driver_id={this.state.driver.id}
                            refresh={this.refresh}
                          />
                        )}
                        <div style={{ width: "50%" }} className={"info_span"}>
                          Tachograph Card
                        </div>
                        {docs["tachograph_card"] ? (
                          <>
                            <DeleteDriverDocument
                              driver_id={this.state.driver.id}
                              document_id={docs["tachograph_card_id"]}
                              document_name={docs["tachograph_card_file_name"]}
                              type={"Tachograph Card"}
                            />
                            <BsCloudDownload
                              className="download_doc_icon"
                              onClick={() => {
                                this.downloadDriverDocument(
                                  docs["tachograph_card_file_name"]
                                );
                              }}
                              style={{
                                color: "#F3702D",
                                fontSize: "1.5em",
                                marginRight: "0.5em",
                                float: "right",
                              }}
                            />
                            <strong
                              style={{ float: "right", marginRight: 100 }}
                            >
                              {moment(today).format() >
                              moment(
                                docs["tachograph_card_exp_date"]
                              ).format() ? (
                                <div style={{ color: "red" }}>
                                  Expiration date :
                                  {moment(
                                    docs["tachograph_card_exp_date"]
                                  ).format("DD-MM-YYYY")}
                                </div>
                              ) : (
                                <>
                                  Expiration date :
                                  {moment(
                                    docs["tachograph_card_exp_date"]
                                  ).format("DD-MM-YYYY")}
                                </>
                              )}
                            </strong>
                          </>
                        ) : (
                          <AddDriverDocument
                            type={"tachograph card"}
                            driver_id={this.state.driver.id}
                            refresh={this.refresh}
                          />
                        )}
                        <div style={{ width: "50%" }} className={"info_span"}>
                          Passport
                        </div>
                        {docs["passport"] ? (
                          <>
                            <DeleteDriverDocument
                              driver_id={this.state.driver.id}
                              document_id={docs["passport_id"]}
                              document_name={docs["passport_file_name"]}
                              type={"Passport"}
                            />
                            <BsCloudDownload
                              className="download_doc_icon"
                              onClick={() => {
                                this.downloadDriverDocument(
                                  docs["passport_file_name"]
                                );
                              }}
                              style={{
                                color: "#F3702D",
                                fontSize: "1.5em",
                                marginRight: "0.5em",
                                float: "right",
                              }}
                            />
                            <strong
                              style={{ float: "right", marginRight: 100 }}
                            >
                              {moment(today).format() >
                              moment(docs["passport_exp_date"]).format() ? (
                                <div style={{ color: "red" }}>
                                  Expiration date :
                                  {moment(docs["passport_exp_date"]).format(
                                    "DD-MM-YYYY"
                                  )}
                                </div>
                              ) : (
                                <>
                                  Expiration date :
                                  {moment(docs["passport_exp_date"]).format(
                                    "DD-MM-YYYY"
                                  )}
                                </>
                              )}
                            </strong>
                          </>
                        ) : (
                          <AddDriverDocument
                            type={"passport"}
                            driver_id={this.state.driver.id}
                            refresh={this.refresh}
                          />
                        )}
                        <div style={{ width: "50%" }} className={"info_span"}>
                          Identification Card
                        </div>
                        {docs["identification_card"] ? (
                          <>
                            <DeleteDriverDocument
                              driver_id={this.state.driver.id}
                              document_id={docs["identification_card_id"]}
                              document_name={
                                docs["identification_card_file_name"]
                              }
                              type={"Identification card"}
                            />
                            <BsCloudDownload
                              className="download_doc_icon"
                              onClick={() => {
                                this.downloadDriverDocument(
                                  docs["identification_card_file_name"]
                                );
                              }}
                              style={{
                                color: "#F3702D",
                                fontSize: "1.5em",
                                marginRight: "0.5em",
                                float: "right",
                              }}
                            />
                            <strong
                              style={{ float: "right", marginRight: 100 }}
                            >
                              {moment(today).format() >
                              moment(
                                docs["identification_card_exp_date"]
                              ).format() ? (
                                <div style={{ color: "red" }}>
                                  Expiration date :
                                  {moment(
                                    docs["identification_card_exp_date"]
                                  ).format("DD-MM-YYYY")}
                                </div>
                              ) : (
                                <>
                                  Expiration date :
                                  {moment(
                                    docs["identification_card_exp_date"]
                                  ).format("DD-MM-YYYY")}
                                </>
                              )}
                            </strong>
                          </>
                        ) : (
                          <AddDriverDocument
                            type={"identification card"}
                            driver_id={this.state.driver.id}
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
                      object_id={this.state.driver.id}
                      object_name={this.state.driver.name}
                      object_type={"Driver"}
                      update_state={this.update_state}
                      notes={this.state.driver.notes}
                    />
                  </Grid.Column>
                </Grid.Row>
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

export default DriverOverView;
