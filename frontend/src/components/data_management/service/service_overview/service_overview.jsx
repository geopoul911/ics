// Built-ins
import React from "react";

// Icons-images
import { BsInfoSquare } from "react-icons/bs";
import { FaHashtag } from "react-icons/fa";
import { FiType } from "react-icons/fi";
import { BsCalendarDate } from "react-icons/bs";
import { IoIosPricetag } from "react-icons/io";
import { FaClock } from "react-icons/fa";
import { IoText } from "react-icons/io5";

// Functions / modules
import axios from "axios";
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import { MdBlock } from "react-icons/md";
import moment from "moment";
import Swal from "sweetalert2";

// Custom Made Components
import ChangeDate from "../../../modals/services/change_date";
import ChangePrice from "../../../modals/services/change_price";
import ChangeDescription from "../../../modals/services/change_description";
import ChangeStartTime from "../../../modals/services/change_start_time";
import DeleteService from "../../../group_management/group/group_services/modals/delete_service";
// import RelatedModel from "./render_related_model_card";

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

const SERVICE_TYPES_REV = {
  AC: "Accomodation",
  AT: "Air Ticket",
  AP: "Airport Porterage",
  CFT: "Coach's Ferry Ticket",
  CR: "Cruise",
  DA: "Driver Accomodation",
  FT: "Ferry Ticket",
  HP: "Hotel Porterage",
  LG: "Local Guide",
  RST: "Restaurant",
  SE: "Sport Event",
  TE: "Teleferik",
  TH: "Theater",
  TO: "Toll",
  TL: "Tour Leader",
  TLA: "Tour Leader's Accomodation",
  TLAT: "Tour Leader's Air Ticket",
  TT: "Train Ticket",
  TR: "Transfer",
  OTH: "Other",
  PRM: "Permit",
};

const VIEW_SERVICE = "http://localhost:8000/api/data_management/service/";

function getServiceId() {
  return window.location.pathname.split("/")[3];
}

class ServiceOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      service: {},
      notes: {},
      is_loaded: false,
      forbidden: false,
    };
  }

  componentDidMount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_SERVICE + getServiceId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          service: res.data.service,
          refcode: res.data.refcode,
          is_loaded: true,
        });
      })
      .catch((e) => {
        console.log(e);
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
    this.setState({ service: update_state });
  };

  render() {
    return (
      <>
        <div className="mainContainer">
          {pageHeader("service_overview", this.state.service.id)}
          {this.state.forbidden ? (
            <>{forbidden("Service Overview")}</>
          ) : this.state.is_loaded ? (
            <>
              <Grid stackable columns={2} divided>
                <Grid.Row style={{ marginLeft: 2 }}>
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
                        Service Information
                      </Card.Header>
                      <Card.Body>
                        <div className={"info_descr"}>
                          <FaHashtag style={overviewIconStyle} /> Refcode
                        </div>
                        <div className={"info_span"}>{this.state.refcode}</div>
                        <MdBlock
                          title={"Service's Refcode cannot be changed"}
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
                          <FiType style={overviewIconStyle} /> Type
                        </div>
                        <div className={"info_span"}>
                          {SERVICE_TYPES_REV[this.state.service.service_type]}
                        </div>
                        <MdBlock
                          title={"Service's type cannot be changed"}
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
                          <BsCalendarDate style={overviewIconStyle} /> Date
                        </div>
                        <div className={"info_span"}>
                          {moment(this.state.service.date).format("DD/MM/yyyy")}
                        </div>
                        <ChangeDate
                          service_id={this.state.service.id}
                          update_state={this.update_state}
                          is_loaded={this.state.is_loaded}
                          refcode={this.state.refcode}
                        />
                        <div className={"info_descr"}>
                          <IoIosPricetag style={overviewIconStyle} /> Price
                        </div>
                        <div className={"info_span"}>
                          {this.state.service.price
                            ? this.state.service.price
                            : "N/A"}
                        </div>
                        <ChangePrice
                          service_id={this.state.service.id}
                          update_state={this.update_state}
                        />
                        <div className={"info_descr"}>
                          <FaClock style={overviewIconStyle} /> Start Time
                        </div>
                        <div className={"info_span"}>
                          {this.state.service.start_time
                            ? this.state.service.start_time
                            : "N/A"}
                        </div>
                        <ChangeStartTime
                          service_id={this.state.service.id}
                          update_state={this.update_state}
                        />
                        <div className={"info_descr"}>
                          <IoText style={overviewIconStyle} /> Description
                        </div>
                        <div className={"info_span"}>
                          {this.state.service.description
                            ? this.state.service.description
                            : "N/A"}
                        </div>
                        <ChangeDescription
                          service_id={this.state.service.id}
                          update_state={this.update_state}
                        />
                      </Card.Body>
                      <Card.Footer>
                        <DeleteService
                          id="delete_doc_modal"
                          service_id={this.state.service.id}
                          update_state={this.update_state}
                          refcode={this.state.refcode}
                          overview={"overview"}
                        />
                      </Card.Footer>
                    </Card>
                  </Grid.Column>
                  <Grid.Column>
                    {/* <RelatedModel service={this.state.service} /> */}
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

export default ServiceOverView;
