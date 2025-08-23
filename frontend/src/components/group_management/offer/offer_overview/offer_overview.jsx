// Built-ins
import React from "react";

// Icons-images
import { Form, Table, Alert } from "react-bootstrap";
import { AiOutlineFilePdf } from "react-icons/ai";
import { BsInfoSquare } from "react-icons/bs";
import { AiOutlineSetting } from "react-icons/ai";
import { BiStats } from "react-icons/bi";
import { Button } from "semantic-ui-react";
import { BiSave } from "react-icons/bi";
import { FaListUl } from "react-icons/fa";

// Custom Made Components
import AddService from "./modals/add_service";
import EditNights from "./modals/edit_nights";
import ChangePrice from "./modals/change_price";
import ChangeRecipient from "./modals/change_recipient";
import ChangePeriod from "./modals/change_period";
import DeleteOfferService from "./modals/delete_offer_service";
import DeleteObjectModal from "../../../modals/delete_object";
import DeleteAllServices from "./modals/delete_all_services";

// Functions / modules
import axios from "axios";
import { Grid } from "semantic-ui-react";
import Swal from "sweetalert2";
import moment from "moment";
import DatePicker from "react-date-picker";
import DoubleSlider from "./DoubleSlider";

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

const commonServices = [
  "TR",
  "TO",
  "PM",
  "CFT",
  "DA",
  "LG",
  "TL",
  "TLAT",
  "TLA",
  "FC",
  "RST",
  "OTH",
  "TR",
  "PRM",
];

const nonCommonServices = [
  "AT",
  "ML",
  "FT",
  "CR",
  "MU",
  "TH",
  "TP",
  "TT",
  "SE",
  "TE",
  "HP",
  "AP",
];

const commonServicesObj = {
  TR: "Transfers",
  TO: "Tolls",
  DA: "Driver Accomodation",
  CFT: "Coach's Ferry Ticket",
  LG: "Local Guide",
  TL: "Tour Leader",
  TLAT: "Tour Leader Air Ticket",
  TLA: "Tour Leader Accomodation",
  RST: "Restaurant",
  OTH: "Other",
  PRM: "Permits",
};

const nonCommonServicesObj = {
  AT: "Air Ticket",
  ML: "Meals",
  FT: "Ferry Ticket",
  CR: "Cruise",
  TH: "Theater",
  TT: "Train Ticket",
  SE: "Sport Event",
  TE: "Teleferik",
  HP: "Hotel Porterage",
  AP: "Airport Porterage",
};

const VIEW_OFFER = "https://groupplan.gr/api/groups/offer/";
const UPDATE_OFFER_INFO = "https://groupplan.gr/api/groups/update_offer_info/";
const DOWNLOAD_OFFER = "https://groupplan.gr/api/groups/download_offer_pdf/";

function getOfferID() {
  return window.location.pathname.split("/")[3];
}

let first_column = ["SGL", "DBL", "TWIN", "TRPL", "QUAD"];

let defaultOfferInfoTextGR = `
  <div>
      <ul>
          <li>Συμπλήρωμα μονόκλινου: 280 €</li>
          <li>1 Μονόκλινο Δωρεάν για τον αρχηγό της περιοδείας</li>
      </ul>
  </div>
`;

let defaultOfferInfoTextINT = `
  <div>
    <ul>
        <li>Single Supplement: 280 €</li>
        <li>1 Single Free For Tour Leader</li>
    </ul>
  </div>
`;

let bigScale = [
  "10-14",
  "15-19",
  "20-24",
  "25-29",
  "30-34",
  "35-39",
  "40-44",
  "45 +",
];

class OfferOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offer: {
        name: "",
        services: [],
        offer_info: "",
      },
      is_loaded: false,
      dates: {},
      forbidden: false,
      includeMap: true,
      zoom: 5,
      mapType: "roadmap",
      scaleType: "tiered",
      scaleRange: { min: 1, max: 1 },
    };
    this.update_offer_info = this.update_offer_info.bind(this);
    this.add_service = this.add_service.bind(this);
    this.toggleIncludeMap = this.toggleIncludeMap.bind(this);
    this.update_zoom = this.update_zoom.bind(this);
    this.update_map_type = this.update_map_type.bind(this);
    this.toggleTiered = this.toggleTiered.bind(this);
  }

  componentDidMount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_OFFER + getOfferID(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          offer: res.data.offer,
          scaleRange: {
            min: 1,
            max: res.data.offer.number_of_people,
          },
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

  add_service(event) {
    const checked = event.target.checked;
    const date = event.target.name;
    var dates = { ...this.state.dates };
    dates[date] = checked;
    this.setState({ dates: dates });
  }

  update_state = (update_state) => {
    console.log(update_state);
    this.setState({
      offer: update_state,
      dates: {},
    });
  };

  update_offer_name = (e) => {
    var offer = { ...this.state.offer };
    offer.name = e.target.value;
    this.setState({ offer: offer });
  };

  update_offer_group_ref = (e) => {
    var offer = { ...this.state.offer };
    offer.group_ref = e.target.value;
    this.setState({ offer: offer });
  };

  update_offer_date = (e) => {
    var offer = { ...this.state.offer };
    offer.date = e;
    this.setState({ offer: offer });
  };

  update_offer_type = (e) => {
    var offer = { ...this.state.offer };
    offer.offer_type = e.target.value;
    this.setState({ offer: offer });
  };

  update_offer_doc_type = (e) => {
    var offer = { ...this.state.offer };
    offer.doc_type = e.target.value;
    if (e.target.value.includes("GR")) {
      offer.offer_info = defaultOfferInfoTextGR;
    } else if (e.target.value.includes("INT")) {
      offer.offer_info = defaultOfferInfoTextINT;
    }
    this.setState({ offer: offer });
  };

  update_currency = (e) => {
    var offer = { ...this.state.offer };
    offer.currency = e.target.value;
    this.setState({ offer: offer });
  };

  update_destination = (e) => {
    var offer = { ...this.state.offer };
    offer.destination = e.target.value;
    this.setState({ offer: offer });
  };

  update_pax = (e) => {
    var offer = { ...this.state.offer };
    offer.number_of_people = e.target.value;
    this.setState({
      offer: offer,
      scaleRange: {
        min: 1,
        max: e.target.value,
      },
    });
  };

  update_profit = (e) => {
    var offer = { ...this.state.offer };
    offer.profit = e.target.value;
    this.setState({ offer: offer });
  };

  update_cancellation_deadline = (e) => {
    var offer = { ...this.state.offer };
    offer.cancellation_deadline = e.target.value;
    this.setState({ offer: offer });
  };

  update_offer_info() {
    axios({
      method: "post",
      url: UPDATE_OFFER_INFO + getOfferID(),
      headers: headers,
      data: {
        name: this.state.offer.name,
        group_reference: this.state.offer.group_reference,
        date: moment(this.state.offer.date).format("YYYY-MM-DD"),
        offer_type: this.state.offer.offer_type,
        doc_type: this.state.offer.doc_type,
        currency: this.state.offer.currency,
        destination: this.state.offer.destination,
        period: this.state.offer.period,
        pax: this.state.offer.number_of_people,
        profit: this.state.offer.profit,
        cancellation_deadline: this.state.offer.cancellation_deadline,
      },
    })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Offer updated successfully",
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

  downloadOffer = () => {
    const offerID = getOfferID();
    const params = `?zoom=${this.state.zoom}&include_map=${
      this.state.includeMap
    }&map_type=${this.state.mapType}&scale_type=${
      this.state.scaleType
    }&scale_range=${JSON.stringify(this.state.scaleRange)}`;
    axios
      .get(DOWNLOAD_OFFER + offerID + params, {
        headers: headers,
      })
      .then((res) => {
        window.open(DOWNLOAD_OFFER + offerID + params);
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: e.response.data.errormsg,
        });
      });
  };

  toggleIncludeMap() {
    this.setState({
      includeMap: !this.state.includeMap,
    });
  }

  toggleTiered(e) {
    this.setState({
      scaleType: e.target.value,
    });
  }

  update_zoom(e) {
    console.log(e);
    this.setState({
      zoom: e.target.value,
    });
  }

  update_map_type(e) {
    console.log(e);
    this.setState({
      mapType: e.target.value,
    });
  }

  updateScaleRange = (min, max) => {
    this.setState({
      scaleRange: {
        min: min,
        max: max,
      },
    });
  };

  render() {
    function getLocationsWithCounts(nights) {
      const counts = nights.reduce((acc, night) => {
        acc[night.location] = (acc[night.location] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(counts).map(([location, count]) => ({
        location,
        count,
      }));
    }

    return (
      <>
        <div className="rootContainer">
          {pageHeader("offer_overview", this.state.offer.name)}
          {this.state.forbidden ? (
            <>{forbidden("Offer Overview")}</>
          ) : this.state.is_loaded ? (
            <>
              <Grid columns={4} divided stackable>
                <Grid.Column
                  width={4}
                  style={{ marginTop: 10, marginLeft: 20 }}
                >
                  <h3>
                    <BsInfoSquare
                      style={{
                        color: "#F3702D",
                        fontSize: "1.2em",
                        marginRight: "0.2em",
                      }}
                    />
                    Offer Info
                  </h3>
                  <hr />
                  <Form>
                    <Form.Group className="mb-2 row">
                      <Form.Label className="col-sm-3 col-form-label">
                        Name :
                      </Form.Label>
                      <div className="col-sm-8">
                        <Form.Control
                          type="text"
                          value={this.state.offer.name}
                          onChange={this.update_offer_name}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-2 row">
                      <Form.Label className="col-sm-3 col-form-label">
                        Recipient :
                      </Form.Label>
                      <div className="col-sm-8">
                        <Form.Control
                          type="text"
                          value={
                            this.state.offer.recipient
                              ? this.state.offer.recipient.name
                              : "N/A"
                          }
                        />
                      </div>

                      <ChangeRecipient
                        offer_id={this.state.offer.id}
                        name={this.state.offer.name}
                        update_state={this.update_state}
                      />
                    </Form.Group>

                    <Form.Group className="mb-2 row">
                      <Form.Label className="col-sm-3 col-form-label">
                        Group Ref :
                      </Form.Label>
                      <div className="col-sm-8">
                        <Form.Control
                          type="text"
                          value={this.state.offer.group_reference}
                          onChange={this.update_offer_group_ref}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-2 row">
                      <Form.Label className="col-sm-3 col-form-label">
                        Date :
                      </Form.Label>
                      <div className="col-sm-8">
                        <DatePicker
                          clearIcon={null}
                          value={new Date(this.state.offer.date)}
                          format="dd/MM/yyyy"
                          onChange={this.update_offer_date}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-2 row">
                      <Form.Label className="col-sm-3 col-form-label">
                        Offer Type :
                      </Form.Label>
                      <div className="col-sm-8">
                        <select
                          className="form-control"
                          onChange={this.update_offer_type}
                          value={this.state.offer.offer_type}
                        >
                          <option value="PP">Per Person</option>
                          <option value="BS">By Scale</option>
                        </select>
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-2 row">
                      <Form.Label className="col-sm-3 col-form-label">
                        Doc Type :
                      </Form.Label>
                      <div className="col-sm-8">
                        <select
                          className="form-control"
                          onChange={this.update_offer_doc_type}
                        >
                          <option value="B2BINT">b2b International</option>
                          <option value="B2BGR">b2b Greece</option>
                          <option value="B2CINT">b2c International</option>
                          <option value="B2CGR">b2c Greece</option>
                        </select>
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-2 row">
                      <Form.Label className="col-sm-3 col-form-label">
                        Currency :
                      </Form.Label>
                      <div className="col-sm-8">
                        <select
                          className="form-control"
                          onChange={(e) => this.update_currency}
                        >
                          <option value="EUR"> € Euro (EUR) </option>
                          <option value="GBP"> £ Pound Sterling (GBP) </option>
                          <option value="USD"> $ US Dollar (USD) </option>
                          <option value="CAD"> $ Canadian Dollar (CAD) </option>
                          <option value="AUD">
                            $ Australian Dollar (AUD)
                          </option>
                          <option value="CHF"> ₣ Swiss Franc (CHF) </option>
                          <option value="JPY"> ¥ Japanese Yen (JPY) </option>
                          <option value="NZD">
                            $ New Zealand Dollar (NZD)
                          </option>
                          <option value="CNY"> ¥ Chinese Yuan (CNY) </option>
                          <option value="SGD">
                            $ Singapore Dollar (SGD)
                          </option>
                        </select>
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-2 row">
                      <Form.Label className="col-sm-3 col-form-label">
                        Period :
                      </Form.Label>
                      <div className="col-sm-8">
                        <Form.Control
                          type="text"
                          value={this.state.offer.period}
                        />
                      </div>
                      <ChangePeriod
                        offer_id={this.state.offer.id}
                        name={this.state.offer.name}
                        update_state={this.update_state}
                      />
                    </Form.Group>

                    <Form.Group className="mb-2 row">
                      <Form.Label className="col-sm-3 col-form-label">
                        Destination :
                      </Form.Label>
                      <div className="col-sm-8">
                        <Form.Control
                          type="text"
                          value={this.state.offer.destination}
                          onChange={this.update_destination}
                        />
                      </div>
                    </Form.Group>
                    <Form.Group className="mb-2 row">
                      <Form.Label className="col-sm-3 col-form-label">
                        PAX :
                      </Form.Label>
                      <div className="col-sm-8">
                        <Form.Control
                          type="number"
                          value={this.state.offer.number_of_people}
                          onChange={this.update_pax}
                          onInput={(e) => {
                            e.target.value = Math.max(
                              0,
                              parseInt(e.target.value)
                            )
                              .toString()
                              .slice(0, 3);
                          }}
                          max={100}
                          min={0}
                        />
                      </div>
                    </Form.Group>
                    <Form.Group className="mb-2 row">
                      <Form.Label className="col-sm-3 col-form-label">
                        Profit (%):
                      </Form.Label>
                      <div className="col-sm-8">
                        <Form.Control
                          type="number"
                          value={this.state.offer.profit}
                          onChange={this.update_profit}
                          onInput={(e) => {
                            e.target.value = Math.max(
                              0,
                              parseInt(e.target.value)
                            )
                              .toString()
                              .slice(0, 3);
                          }}
                          max={100}
                          min={0}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-2 row">
                      <Form.Label className="col-sm-6 col-form-label">
                        Cancellation Deadline (days) :
                      </Form.Label>
                      <div className="col-sm-5">
                        <Form.Control
                          type="number"
                          value={this.state.offer.cancellation_deadline}
                          onChange={this.update_cancellation_deadline}
                          onInput={(e) => {
                            e.target.value = Math.max(
                              0,
                              parseInt(e.target.value)
                            )
                              .toString()
                              .slice(0, 3);
                          }}
                          max={100}
                          min={0}
                        />
                      </div>
                    </Form.Group>
                    <Form.Group className="mb-2 row">
                      <Form.Label className="col-sm-3 col-form-label">
                        Created :
                      </Form.Label>
                      <div className="col-sm-8">
                        <Form.Control
                          type="text"
                          disabled
                          value={moment(this.state.offer.date_created).format(
                            "DD/MM/YYYY hh:mm:ss"
                          )}
                        />
                      </div>
                    </Form.Group>
                  </Form>
                  <Button
                    color="green"
                    style={{ marginTop: 20 }}
                    onClick={this.update_offer_info}
                  >
                    <BiSave /> Save Offer's Info
                  </Button>
                </Grid.Column>

                <Grid.Column
                  width={2}
                  style={{ marginTop: 10, marginLeft: 20 }}
                >
                  <div>
                    <h3>
                      <FaListUl
                        style={{
                          color: "#F3702D",
                          fontSize: "1.2em",
                          marginRight: "0.2em",
                        }}
                      />
                      Itinerary
                    </h3>
                    <hr />
                    <b>Nights: {this.state.offer.nights.length}</b>
                    <ul style={{ listStyle: "circle" }}>
                      {getLocationsWithCounts(this.state.offer.nights).map(
                        ({ location, count }) => (
                          <li
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span style={{ flex: 1, textAlign: "left" }}>
                              • {location}
                            </span>
                            <span>{count} Night(s)</span>
                          </li>
                        )
                      )}
                    </ul>
                    <EditNights
                      offer={this.state.offer}
                      is_loaded={this.state.is_loaded}
                      update_state={this.update_state}
                    />
                  </div>
                </Grid.Column>

                <Grid.Column
                  width={5}
                  style={{ marginTop: 10, marginLeft: 20 }}
                >
                  <div>
                    <h3>
                      <AiOutlineSetting
                        style={{
                          color: "#F3702D",
                          fontSize: "1.2em",
                          marginRight: "0.2em",
                        }}
                      />
                      Services
                    </h3>
                    <hr />
                    {this.state.offer.offer_type === "PP" ? (
                      <>
                        {this.state.offer.services.some(
                          (service) => service.service_type === "AC"
                        ) ? (
                          <>
                            <p>Accomodation</p>
                            <Table striped hover id="offer_services_table">
                              <thead>
                                <tr>
                                  <th>Date</th>
                                  <th>Sgl</th>
                                  <th>Dbl</th>
                                  <th>Twin</th>
                                  <th>Trpl</th>
                                  <th>Quad</th>
                                  <th>Delete</th>
                                </tr>
                              </thead>
                              <tbody>
                                {/* eslint-disable-next-line */}
                                {this.state.offer.services.map((service) => {
                                  if (service.service_type === "AC") {
                                    return (
                                      <>
                                        <tr>
                                          <td>
                                            {service.date ? (
                                              <>
                                                {moment(
                                                  service.date,
                                                  "YYYY-MM-DD"
                                                ).format("DD-MM-YYYY")}
                                              </>
                                            ) : (
                                              "N/A"
                                            )}
                                          </td>
                                          <td>
                                            € {service.sgl}
                                            <ChangePrice
                                              offer_id={this.state.offer.id}
                                              name={this.state.offer.name}
                                              type={"single"}
                                              service_id={service.id}
                                              update_state={this.update_state}
                                            />
                                          </td>
                                          <td>
                                            € {service.dbl}
                                            <ChangePrice
                                              type={"double"}
                                              offer_id={this.state.offer.id}
                                              name={this.state.offer.name}
                                              service_id={service.id}
                                              update_state={this.update_state}
                                            />
                                          </td>
                                          <td>
                                            € {service.twin}
                                            <ChangePrice
                                              type={"twin"}
                                              offer_id={this.state.offer.id}
                                              name={this.state.offer.name}
                                              service_id={service.id}
                                              update_state={this.update_state}
                                            />
                                          </td>
                                          <td>
                                            € {service.trpl}
                                            <ChangePrice
                                              type={"triple"}
                                              offer_id={this.state.offer.id}
                                              name={this.state.offer.name}
                                              service_id={service.id}
                                              update_state={this.update_state}
                                            />
                                          </td>
                                          <td>
                                            € {service.quad}
                                            <ChangePrice
                                              type={"quadrable"}
                                              offer_id={this.state.offer.id}
                                              name={this.state.offer.name}
                                              service_id={service.id}
                                              update_state={this.update_state}
                                            />
                                          </td>
                                          <td>
                                            <DeleteOfferService
                                              id="delete_doc_modal"
                                              offer_service_id={service.id}
                                              offer_id={this.state.offer.id}
                                              update_state={this.update_state}
                                            />
                                          </td>
                                        </tr>
                                      </>
                                    );
                                  }
                                })}
                              </tbody>
                            </Table>
                          </>
                        ) : (
                          ""
                        )}
                      </>
                    ) : (
                      <>
                        {this.state.offer.services.some(
                          (service) => service.service_type === "AC"
                        ) ? (
                          <>
                            <p>Accomodation</p>
                            <Table striped hover id="offer_services_table">
                              <thead>
                                <tr>
                                  <th> Service Type </th>
                                  <th>Date</th>
                                  <th>Price ( Per Person )</th>
                                  <th>Delete</th>
                                </tr>
                              </thead>
                              <tbody>
                                {/* eslint-disable-next-line */}
                                {this.state.offer.services.map((service) => {
                                  if (service.service_type === "AC") {
                                    return (
                                      <>
                                        <tr>
                                          <td> {"Accomodation"} </td>
                                          <td>
                                            {service.date ? (
                                              <>
                                                {moment(
                                                  service.date,
                                                  "YYYY-MM-DD"
                                                ).format("DD-MM-YYYY")}
                                              </>
                                            ) : (
                                              "N/A"
                                            )}
                                          </td>
                                          <td>
                                            € {service.price}
                                            <ChangePrice
                                              offer_id={this.state.offer.id}
                                              name={this.state.offer.name}
                                              type={"price"}
                                              service_id={service.id}
                                              update_state={this.update_state}
                                            />
                                          </td>
                                          <td>
                                            <DeleteOfferService
                                              id="delete_doc_modal"
                                              offer_service_id={service.id}
                                              offer_id={this.state.offer.id}
                                              update_state={this.update_state}
                                            />
                                          </td>
                                        </tr>
                                      </>
                                    );
                                  }
                                })}
                              </tbody>
                            </Table>
                          </>
                        ) : (
                          <></>
                        )}
                      </>
                    )}
                    {this.state.offer.services.some((service) =>
                      commonServices.includes(service.service_type)
                    ) ? (
                      <>
                        <p>Common Services</p>
                        <Table striped hover id="offer_services_table">
                          <thead>
                            <tr>
                              <th> Service Type </th>
                              <th> Date </th>
                              <th> Total Cost </th>
                              <th> Delete </th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* eslint-disable-next-line */}
                            {this.state.offer.services.map((service) => {
                              if (
                                commonServices.includes(service.service_type)
                              ) {
                                return (
                                  <>
                                    <tr>
                                      <td>
                                        {commonServicesObj[service.service_type]}
                                      </td>
                                      <td> {service.date} </td>
                                      <td>
                                        € {service.price}
                                        <ChangePrice
                                          offer_id={this.state.offer.id}
                                          name={this.state.offer.name}
                                          type={"common"}
                                          service_id={service.id}
                                          update_state={this.update_state}
                                        />
                                      </td>
                                      <td>
                                        <DeleteOfferService
                                          id="delete_doc_modal"
                                          offer_service_id={service.id}
                                          offer_id={this.state.offer.id}
                                          update_state={this.update_state}
                                        />
                                      </td>
                                    </tr>
                                  </>
                                );
                              }
                            })}
                          </tbody>
                        </Table>
                      </>
                    ) : (
                      ""
                    )}
                    {this.state.offer.services.some((service) =>
                      nonCommonServices.includes(service.service_type)
                    ) ? (
                      <>
                        <p>Non Common Services</p>
                        <Table striped hover id="offer_services_table">
                          <thead>
                            <tr>
                              <th> Service Type </th>
                              <th> Date </th>
                              <th> Price Per Person </th>
                              <th> Delete </th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* eslint-disable-next-line */}
                            {this.state.offer.services.map((service) => {
                              if (
                                nonCommonServices.includes(service.service_type)
                              ) {
                                return (
                                  <>
                                    <tr>
                                      <td>
                                        {
                                          nonCommonServicesObj[
                                            service.service_type
                                          ]
                                        }
                                      </td>
                                      <td> {service.date} </td>
                                      <td>
                                        € {service.price}
                                        <ChangePrice
                                          offer_id={this.state.offer.id}
                                          name={this.state.offer.name}
                                          type={"non_common"}
                                          service_id={service.id}
                                          update_state={this.update_state}
                                        />
                                      </td>
                                      <td>
                                        <DeleteOfferService
                                          id="delete_doc_modal"
                                          offer_service_id={service.id}
                                          offer_id={this.state.offer.id}
                                          update_state={this.update_state}
                                        />
                                      </td>
                                    </tr>
                                  </>
                                );
                              }
                            })}
                          </tbody>
                        </Table>
                      </>
                    ) : (
                      ""
                    )}
                    {this.state.offer.services.length === 0 ? (
                      <Alert
                        variant="warning"
                        style={{
                          width: "80%",
                          textAlign: "center",
                          margin: "0 auto",
                        }}
                      >
                        This offer has no services added yet.
                      </Alert>
                    ) : (
                      ""
                    )}
                    <hr />
                  </div>
                  <AddService
                    offer={this.state.offer}
                    is_loaded={this.state.is_loaded}
                    update_state={this.update_state}
                    add_service={this.add_service}
                  />
                  <DeleteAllServices
                    update_state={this.update_state}
                    is_loaded={this.state.is_loaded}
                    offer={this.state.offer}
                  />
                </Grid.Column>
                <Grid.Column
                  width={4}
                  style={{ marginTop: 10, marginLeft: 20 }}
                >
                  {this.state.offer.offer_type === "PP" ? (
                    <>
                      <h3>
                        <BiStats
                          style={{
                            color: "#F3702D",
                            fontSize: "1.2em",
                            marginRight: "0.2em",
                          }}
                        />
                        Results Per Person
                      </h3>
                      <hr />
                      <Table striped hover borderless id="results_offer_tbl">
                        <thead>
                          <tr>
                            <th> # </th>
                            <th> Total Cost Net </th>
                            <th> Profit %</th>
                            <th> Profit </th>
                            <th style={{ color: "#ff3333" }}> Selling Price</th>
                            <th style={{ color: "#009933" }}> Total Profit </th>
                            {this.state.offer.services.some(
                              (service) => service.service_type === "AC"
                            ) ? (
                              <th> Free </th>
                            ) : (
                              ""
                            )}
                            {this.state.offer.services.some(
                              (service) => service.service_type === "AC"
                            ) ? (
                              <th> Cost per Free </th>
                            ) : (
                              ""
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.offer.services.some(
                            (service) => service.service_type === "AC"
                          )
                            ? // eslint-disable-next-line
                              first_column.map((j) => {
                                let to_iterate = "";
                                let free = "";
                                let total_single = 0;
                                let total_dbl = 0;
                                let total_twin = 0;
                                let total_trpl = 0;
                                let total_quad = 0;
                                let free_sgl = 0;
                                let free_dbl = 0;
                                let free_twin = 0;
                                let free_trpl = 0;
                                let free_quad = 0;
                                let total_common = 0;
                                let total_per_person = 0;

                                // eslint-disable-next-line
                                this.state.offer.services.map((service) => {
                                  if (service.service_type === "AC") {
                                    total_single += service.sgl;
                                    total_dbl += service.dbl;
                                    total_twin += service.twin;
                                    total_trpl += service.trpl;
                                    total_quad += service.quad;
                                    free_sgl += service.free_sgl;
                                    free_dbl += service.free_dbl;
                                    free_twin += service.free_twin;
                                    free_trpl += service.free_trpl;
                                    free_quad += service.free_quad;
                                  } else if (commonServices.includes(service.service_type)) {
                                    total_common +=
                                      service.price /
                                      (this.state.offer.number_of_people -
                                        free);
                                  } else if (
                                    nonCommonServices.includes(
                                      service.service_type
                                    )
                                  ) {
                                    total_per_person += service.price;
                                  }
                                });

                                if (j === "SGL") {
                                  to_iterate = total_single;
                                  free = free_sgl;
                                } else if (j === "DBL") {
                                  to_iterate = total_dbl;
                                  free = free_dbl;
                                } else if (j === "TWIN") {
                                  to_iterate = total_twin;
                                  free = free_twin;
                                } else if (j === "TRPL") {
                                  to_iterate = total_trpl;
                                  free = free_trpl;
                                } else if (j === "QUAD") {
                                  to_iterate = total_quad;
                                  free = free_quad;
                                }

                                let total_cost_net =
                                  to_iterate + total_common + total_per_person;

                                if (to_iterate !== 0) {
                                  return (
                                    <>
                                      <tr>
                                        {/* Left Bold Cell */}
                                        <th> {j} </th>
                                        {/* Total Cost Net */}
                                        <td>
                                          €
                                          {isFinite(total_cost_net)
                                            ? total_cost_net.toFixed(2)
                                            : 0}
                                        </td>
                                        {/* Profit % */}
                                        <td> {this.state.offer.profit} % </td>
                                        {/* Profit */}
                                        <td>
                                          €
                                          {(
                                            (total_cost_net *
                                              this.state.offer.profit) /
                                            100
                                          ).toFixed(2)}
                                        </td>
                                        {/* Selling Price */}
                                        <td style={{ color: "#ff3300" }}>
                                          €
                                          {(
                                            (total_cost_net *
                                              this.state.offer.profit) /
                                              100 +
                                            total_cost_net
                                          ).toFixed(2)}
                                        </td>
                                        {/* Total Profit */}
                                        <td style={{ color: "#009933" }}>
                                          €
                                          {(
                                            ((total_cost_net *
                                              this.state.offer.profit) /
                                              100) *
                                            this.state.offer.number_of_people
                                          ).toFixed(2)}
                                        </td>
                                        {/* Free */}
                                        <td> {free} </td>
                                        {/* Cost Per Free */}
                                        <td>
                                          €
                                          {(
                                            (total_cost_net * free) /
                                            this.state.offer.number_of_people
                                          ).toFixed(2)}
                                        </td>
                                      </tr>
                                    </>
                                  );
                                }
                              })
                            : // eslint-disable-next-line
                              first_column.slice(0, 1).map((j) => {
                                let to_iterate = 0;
                                let total_common = 0;
                                let total_per_person = 0;
                                let number_of_nights = Array.from(
                                  new Set(
                                    this.state.offer.services
                                      .filter(
                                        (item) => item.service_type === "AC"
                                      )
                                      .map((item) => item.date)
                                  )
                                ).length;

                                // eslint-disable-next-line
                                this.state.offer.services.map((service) => {
                                  if (
                                    commonServices.includes(
                                      service.service_type
                                    )
                                  ) {
                                    total_common +=
                                      service.price /
                                      this.state.offer.number_of_people;
                                  } else if (
                                    nonCommonServices.includes(
                                      service.service_type
                                    )
                                  ) {
                                    total_per_person += service.price;
                                  }
                                });

                                let total_cost_net =
                                  to_iterate * number_of_nights +
                                  total_common +
                                  total_per_person;
                                return (
                                  <>
                                    <tr>
                                      {/* Left Bold Cell */}
                                      <th> Offer </th>
                                      {/* Total Cost Net */}
                                      <td>€ {total_cost_net.toFixed(2)} </td>
                                      {/* Profit % */}
                                      <td>% {this.state.offer.profit} </td>
                                      {/* Profit */}
                                      <td>
                                        €
                                        {(
                                          (total_cost_net *
                                            this.state.offer.profit) /
                                          100
                                        ).toFixed(2)}
                                      </td>
                                      {/* Selling Price */}
                                      <td>
                                        €
                                        {(
                                          total_cost_net +
                                          (total_cost_net *
                                            this.state.offer.profit) /
                                            100
                                        ).toFixed(2)}
                                      </td>
                                      {/* Total Profit */}
                                      <td>
                                        €
                                        {(
                                          ((total_cost_net *
                                            this.state.offer.profit) /
                                            100) *
                                          this.state.offer.number_of_people
                                        ).toFixed(2)}
                                      </td>
                                    </tr>
                                  </>
                                );
                              })}
                        </tbody>
                      </Table>
                    </>
                  ) : (
                    <>
                      <h3>
                        <BiStats
                          style={{
                            color: "#F3702D",
                            fontSize: "1.2em",
                            marginRight: "0.2em",
                          }}
                        />
                        Results By Scale
                      </h3>
                      <hr />
                      <Grid columns={2}>
                        <Grid.Row style={{ marginLeft: 20 }}>
                          <Grid.Column width={6}>
                            <label>Select Scale Type: </label>
                            <Form.Check
                              type={"radio"}
                              label={"Tiered"}
                              value={"tiered"}
                              checked={this.state.scaleType === "tiered"}
                              onChange={this.toggleTiered}
                            />
                            <Form.Check
                              type={"radio"}
                              label={"Incremental"}
                              value={"incremental"}
                              checked={this.state.scaleType === "incremental"}
                              onChange={this.toggleTiered}
                            />
                          </Grid.Column>
                          <Grid.Column width={8}>
                            {this.state.scaleType === "incremental" ? (
                              <>
                                <label> Show: </label>
                                <DoubleSlider
                                  updateScaleRange={this.updateScaleRange}
                                  pax={this.state.offer.number_of_people}
                                  key={this.state.offer.number_of_people}
                                />
                              </>
                            ) : (
                              ""
                            )}
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                      <hr />
                      {this.state.scaleType === "tiered" ? (
                        <Table
                          striped
                          hover
                          borderless
                          id="offer_services_table"
                        >
                          <thead>
                            <tr>
                              <th> # </th>
                              <th> Price </th>
                              <th> Profit </th>
                              <th> Total Cost </th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.offer.services.some(
                              (service) => service.service_type === "AC"
                            )
                              ? // eslint-disable-next-line
                                bigScale.map((j) => {
                                  let total_prices = 0;
                                  let total_common = 0;
                                  let total_per_person = 0;

                                  // eslint-disable-next-line
                                  this.state.offer.services.map((service) => {
                                    if (service.service_type === "AC") {
                                      total_prices += service.price;
                                    } else if (
                                      commonServices.includes(
                                        service.service_type
                                      )
                                    ) {
                                      total_common +=
                                        service.price / j.slice(0, 2);
                                    } else if (
                                      nonCommonServices.includes(
                                        service.service_type
                                      )
                                    ) {
                                      total_per_person += service.price;
                                    }
                                  });
                                  let total_cost_net =
                                    total_prices +
                                    total_common +
                                    total_per_person;
                                  return (
                                    <>
                                      <tr>
                                        {/* Left Bold Cell */}
                                        <td> {j} Pax </td>
                                        {/* Total Cost Net */}
                                        <td>
                                          €
                                          {(
                                            Math.round(total_cost_net * 2) / 2
                                          ).toFixed(2)}
                                        </td>
                                        {/* Profit % */}
                                        <td>
                                          €
                                          {(
                                            Math.round(
                                              total_cost_net *
                                                this.state.offer.profit
                                            ) / 100
                                          ).toFixed(2)}
                                        </td>
                                        <td>
                                          €
                                          {(
                                            Math.round(
                                              total_cost_net *
                                                this.state.offer.profit
                                            ) /
                                              100 +
                                            total_cost_net
                                          ).toFixed(2)}
                                        </td>
                                      </tr>
                                    </>
                                  );
                                })
                              : // eslint-disable-next-line
                                first_column.slice(0, 1).map((j) => {
                                  let total_common = 0;
                                  let total_per_person = 0;
                                  // eslint-disable-next-line
                                  this.state.offer.services.map((service) => {
                                    if (
                                      commonServices.includes(
                                        service.service_type
                                      )
                                    ) {
                                      total_common +=
                                        service.price /
                                        this.state.offer.number_of_people;
                                    } else if (
                                      nonCommonServices.includes(
                                        service.service_type
                                      )
                                    ) {
                                      total_per_person += service.price;
                                    }
                                  });

                                  let total_cost_net =
                                    total_common + total_per_person;
                                  return (
                                    <>
                                      <tr>
                                        {/* Left Bold Cell */}
                                        <th> Offer </th>
                                        {/* Total Cost Net */}
                                        <td>€ {total_cost_net.toFixed(2)} </td>
                                      </tr>
                                    </>
                                  );
                                })}
                          </tbody>
                        </Table>
                      ) : (
                        <>
                          <Table
                            striped
                            hover
                            borderless
                            id="offer_services_table"
                          >
                            <thead>
                              <tr>
                                <th> # </th>
                                <th> Price </th>
                                <th> Profit </th>
                                <th> Total Cost </th>
                              </tr>
                            </thead>
                            <tbody>
                              {Array.from(
                                {
                                  length:
                                    this.state.scaleRange["max"] -
                                    this.state.scaleRange["min"] +
                                    1,
                                },
                                (_, i) => {
                                  const currentValue =
                                    this.state.scaleRange["min"] + i;
                                  let total_prices = 0;
                                  let total_common = 0;
                                  let total_per_person = 0;

                                  // eslint-disable-next-line
                                  this.state.offer.services.map((service) => {
                                    if (service.service_type === "AC") {
                                      total_prices += service.price;
                                    } else if (
                                      commonServices.includes(
                                        service.service_type
                                      )
                                    ) {
                                      total_common +=
                                        service.price / currentValue;
                                    } else if (
                                      nonCommonServices.includes(
                                        service.service_type
                                      )
                                    ) {
                                      total_per_person += service.price;
                                    }
                                  });
                                  let total_cost_net =
                                    total_prices +
                                    total_common +
                                    total_per_person;
                                  return (
                                    <tr key={i}>
                                      <td> {currentValue} Pax </td>
                                      <td>
                                        €
                                        {(
                                          Math.round(total_cost_net * 2) / 2
                                        ).toFixed(2)}
                                      </td>
                                      <td>
                                        €
                                        {(
                                          Math.round(
                                            total_cost_net *
                                              this.state.offer.profit
                                          ) / 100
                                        ).toFixed(2)}
                                      </td>
                                      <td>
                                        €
                                        {(
                                          Math.round(
                                            total_cost_net *
                                              this.state.offer.profit
                                          ) /
                                            100 +
                                          total_cost_net
                                        ).toFixed(2)}
                                      </td>
                                    </tr>
                                  );
                                }
                              )}
                            </tbody>
                          </Table>
                        </>
                      )}
                      <br />
                    </>
                  )}
                  <hr />
                  <Form.Check
                    type={"checkbox"}
                    label={"Include Map In PDF."}
                    checked={this.state.includeMap}
                    onChange={this.toggleIncludeMap}
                  />
                  {this.state.includeMap ? (
                    <>
                      <hr />
                      <div className="col-sm-8">
                        <Form.Label>Zoom: {this.state.zoom} </Form.Label>
                        <input
                          type="range"
                          className="form-control"
                          min="1"
                          max="15"
                          value={this.state.zoom}
                          onChange={this.update_zoom}
                        />
                      </div>
                      <Form.Label>Map Type</Form.Label>
                      <div className="col-sm-8">
                        <select
                          className="form-control"
                          onChange={this.update_map_type}
                          value={this.state.mapType}
                        >
                          <option value="roadmap">Roadmap</option>
                          <option value="satellite">Satellite</option>
                          <option value="hybrid">Hybrid</option>
                          <option value="terrain">Terrain</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                  <hr />
                  <Button onClick={this.downloadOffer}>
                    <AiOutlineFilePdf style={{ color: "red", fontSize: 18 }} />
                    Download Offer
                  </Button>
                </Grid.Column>
                <div style={{ margin: 20, float: "left" }}>
                  <DeleteObjectModal
                    object_id={this.state.offer.id}
                    object_name={this.state.offer.refcode}
                    object_type={"Offer"}
                    update_state={this.update_state}
                  />
                </div>
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

export default OfferOverview;
