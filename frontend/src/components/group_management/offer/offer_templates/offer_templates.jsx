// Built-ins
import React from "react";

// Icons-images
import { BsCheckLg } from "react-icons/bs";
import {
  AiFillFilter,
  AiOutlineUnorderedList,
  AiOutlineCreditCard,
  AiOutlineSend,
} from "react-icons/ai";
import { ImCross, ImPriceTag } from "react-icons/im";
import { FaChild } from "react-icons/fa";
import { BiNote } from "react-icons/bi";
import { HiInformationCircle } from "react-icons/hi";

// Functions / modules
import axios from "axios";
import ReactSearchBox from "react-search-box";
import { Form } from "react-bootstrap";
import { Grid, Button } from "semantic-ui-react";
import Swal from "sweetalert2";
import ReactCountryFlag from "react-country-flag";

// Custom Made Components
import AddTextTemplateModal from "../../../modals/create/add_text_template_modal";

// Global Variables
import {
  headers,
  pageHeader,
  loader,
  forbidden,
  restrictedUsers,
} from "../../../global_vars";

// Variables
window.Swal = Swal;

const VIEW_OFFER = "http://localhost:8000/api/groups/offer/";
const GET_TEXT_TEMPLATES =
  "http://localhost:8000/api/data_management/all_text_templates/";
const UPDATE_OFFER_TEMPLATES =
  "http://localhost:8000/api/groups/update_offer_templates/";
const UPDATE_ALL_OFFER_TEMPLATES =
  "http://localhost:8000/api/groups/update_all_offer_templates/";
const TOGGLE_OFFER_TEMPLATE_BY_SEARCH =
  "http://localhost:8000/api/groups/toggle_offer_template_by_search/";

function getOfferId() {
  return window.location.pathname.split("/")[3];
}

let btnStyle = {
  paddingTop: 3,
  paddingLeft: 6,
  paddingRight: 6,
  paddingBottom: 3,
  margin: 2,
};

let flagStyle = { width: "2.5em", height: "2.5em" };

let country_codes = [
  "GR",
  "GB",
  "FR",
  "DE",
  "IT",
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "HU",
  "IE",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
  "CH",
  "UA",
  "RU",
  "NO",
];

let codes_to_full_name = {
  AT: "Austria",
  BE: "Belgium",
  BG: "Bulgaria",
  HR: "Croatia",
  CY: "Cyprus",
  CZ: "Czechia",
  DK: "Denmark",
  EE: "Estonia",
  FI: "Finland",
  FR: "France",
  DE: "Germany",
  GR: "Greece",
  HU: "Hungary",
  IE: "Ireland",
  IT: "Italy",
  LV: "Latvia",
  LT: "Lithuania",
  LU: "Luxembourg",
  MT: "Malta",
  NL: "Netherlands",
  PL: "Poland",
  PT: "Portugal",
  RO: "Romania",
  SK: "Slovakia",
  SI: "Slovenia",
  ES: "Spain",
  SE: "Sweden",
  GB: "United Kingdom",
  CH: "Switzerland",
  UA: "Ukraine",
  RU: "Russia",
  NO: "Norway",
};

let divStyle = {
  maxHeight: 200,
  minHeight: 200,
  overflowY: "auto",
  border: "1px solid #ccc",
};

class OfferTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offer: {},
      text_templates: [],
      text_template_values: [],
      is_loaded: false,
      forbidden: false,
      selectedCountries: [],
      selectAllBool: false,
    };
    this.update_offer_templates = this.update_offer_templates.bind(this);
    this.selectAllTemplates = this.selectAllTemplates.bind(this);
    this.toggle_by_search = this.toggle_by_search.bind(this);
    this.remount = this.remount.bind(this);
  }

  componentDidMount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_OFFER + getOfferId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          offer: res.data.offer,
          is_loaded: true,
          text_template_values: res.data.offer.text_templates.map(
            (text_template) => text_template.id
          ),
        });
      });
    axios
      .get(GET_TEXT_TEMPLATES, {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          text_templates: res.data.all_text_templates,
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

  remount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_OFFER + getOfferId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          offer: res.data.offer,
          is_loaded: true,
          text_template_values: res.data.offer.text_templates.map(
            (text_template) => text_template.id
          ),
        });
      });
    axios
      .get(GET_TEXT_TEMPLATES, {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          text_templates: res.data.all_text_templates,
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

  toggle_by_search = (text) => {
    axios({
      method: "post",
      url: TOGGLE_OFFER_TEMPLATE_BY_SEARCH + getOfferId(),
      headers: headers,
      data: {
        text: text,
        offer_id: this.state.offer.id,
      },
    }).then((res) => {
      this.setState({
        offer: res.data.offer,
        is_loaded: true,
        text_template_values: res.data.offer.text_templates.map(
          (text_template) => text_template.id
        ),
      });
    });
  };

  update_state = (update_state) => {
    this.setState({
      offer: update_state,
    });
  };

  update_offer_templates(event) {
    const checked = event.target.checked;
    const id = parseInt(event.target.name);
    if (checked) {
      this.setState({
        text_template_values: [...this.state.text_template_values, id],
      });
    } else {
      let filteredArray = this.state.text_template_values.filter(
        (item) => item !== id
      );
      this.setState({ text_template_values: filteredArray });
    }

    axios({
      method: "post",
      url: UPDATE_OFFER_TEMPLATES + getOfferId(),
      headers: headers,
      data: {
        template_id: event.target.name,
        checked: checked,
      },
    })
      .then((res) => {
        this.update_state(res.data.offer);
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: e.response.data.errormsg,
        });
      });
  }

  toggleCountrySelection = (code) => {
    const { selectedCountries } = this.state;

    if (selectedCountries.includes(code)) {
      // If the code is already selected, remove it
      this.setState({
        selectedCountries: selectedCountries.filter((c) => c !== code),
      });
    } else {
      // If the code is not selected, add it to the list
      this.setState({
        selectedCountries: [...selectedCountries, code],
      });
    }
  };

  selectAllTemplates = (e) => {
    this.setState(() => ({
      selectAllBool: e.target.checked,
    }));

    let filteredData = [];

    if (this.state.selectedCountries.length === 0) {
      filteredData = this.state.text_templates;
    } else {
      filteredData = this.state.text_templates.filter((item) => {
        return item.countries.some((country) =>
          this.state.selectedCountries.includes(country)
        );
      });
    }

    // use one function, not a loop.
    axios({
      method: "post",
      url: UPDATE_ALL_OFFER_TEMPLATES + getOfferId(),
      headers: headers,
      data: {
        template_ids: filteredData.map((text_template) => text_template.id),
        checked: e.target.checked,
      },
    }).then((res) => {
      this.update_state(res.data.offer);
      this.setState(() => ({
        text_template_values: res.data.offer.text_templates.map(
          (text_template) => text_template.id
        ),
      }));
    });
  };

  render() {
    let additional_information_data = [];
    let additional_information_data_array = this.state.text_templates.filter(
      (tt) => tt.type === "Additional Information"
    );
    additional_information_data_array.map((tt) =>
      additional_information_data.push({ key: tt.text, value: tt.text })
    );

    let included_data = [];
    let included_data_array = this.state.text_templates.filter(
      (tt) => tt.type === "Included"
    );
    included_data_array.map((tt) =>
      included_data.push({ key: tt.text, value: tt.text })
    );

    let not_included_data = [];
    let not_included_data_array = this.state.text_templates.filter(
      (tt) => tt.type === "Not Included"
    );
    not_included_data_array.map((tt) =>
      not_included_data.push({ key: tt.text, value: tt.text })
    );

    let notes_data = [];
    let notes_data_array = this.state.text_templates.filter(
      (tt) => tt.type === "Notes"
    );
    notes_data_array.map((tt) =>
      notes_data.push({ key: tt.text, value: tt.text })
    );

    let entry_price_data = [];
    let entry_price_data_array = this.state.text_templates.filter(
      (tt) => tt.type === "Entry Price"
    );
    entry_price_data_array.map((tt) =>
      entry_price_data.push({ key: tt.text, value: tt.text })
    );

    let payment_and_cancellation_data = [];
    let payment_and_cancellation_data_array = this.state.text_templates.filter(
      (tt) => tt.type === "Payment & Cancellation Policy"
    );
    payment_and_cancellation_data_array.map((tt) =>
      payment_and_cancellation_data.push({ key: tt.text, value: tt.text })
    );

    let children_policy_data = [];
    let children_policy_data_array = this.state.text_templates.filter(
      (tt) => tt.type === "Children Policy"
    );
    children_policy_data_array.map((tt) =>
      children_policy_data.push({ key: tt.text, value: tt.text })
    );

    let epilogue_data = [];
    let epilogue_data_array = this.state.text_templates.filter(
      (tt) => tt.type === "Epilogue"
    );
    epilogue_data_array.map((tt) =>
      epilogue_data.push({ key: tt.text, value: tt.text })
    );

    return (
      <>
        <div className="rootContainer">
          {pageHeader("offer_templates", this.state.offer.name)}
          {this.state.forbidden ? (
            <>{forbidden("Offer Templates")}</>
          ) : this.state.is_loaded ? (
            <>
              <div style={{ display: "flex", alignItems: "center" }}>
                <b style={{ marginRight: 20 }}>
                  <AiFillFilter
                    style={{
                      color: "orange",
                      fontSize: "1.4em",
                      marginRight: "0.5em",
                    }}
                  />
                  Filter By Countries:
                </b>
                <Button
                  style={btnStyle}
                  color={
                    this.state.selectedCountries.includes("GN") ? "blue" : ""
                  }
                  onClick={() => this.toggleCountrySelection("GN")}
                  title="Generic"
                >
                  <AiOutlineUnorderedList style={flagStyle} />
                </Button>
                {country_codes.map((code) => (
                  <Button
                    key={code}
                    style={btnStyle}
                    color={
                      this.state.selectedCountries.includes(code) ? "blue" : ""
                    }
                    onClick={() => this.toggleCountrySelection(code)}
                  >
                    <ReactCountryFlag
                      countryCode={code}
                      value={code}
                      style={flagStyle}
                      svg
                      title={codes_to_full_name[code]}
                    />
                  </Button>
                ))}
              </div>
              <hr />
              <Grid columns={4} divided stackable style={{ marginLeft: 20 }}>
                <Grid.Row>
                  <Grid.Column width={4}>
                    <h3>
                      <HiInformationCircle
                        style={{
                          color: "#F3702D",
                          fontSize: "1.4em",
                          fontWeight: "bold",
                        }}
                      />
                      Additional Information
                    </h3>
                    <hr />
                    <ReactSearchBox
                      placeholder="Search"
                      onSelect={(record) =>
                        this.toggle_by_search(record.item["key"])
                      }
                      data={additional_information_data}
                    />
                    <hr />
                    <div style={divStyle}>
                      {/* eslint-disable-next-line */}
                      {this.state.text_templates.map((text_template) => {
                        if (
                          text_template.type === "Additional Information" &&
                          (this.state.selectedCountries.length === 0 ||
                            text_template.countries.some((country) =>
                              this.state.selectedCountries.includes(country)
                            ))
                        ) {
                          return (
                            <>
                              <label>
                                <Form.Check
                                  type={"checkbox"}
                                  name={text_template.id}
                                  checked={this.state.text_template_values.includes(
                                    text_template.id
                                  )}
                                  onChange={this.update_offer_templates}
                                  style={{ marginTop: 5, marginLeft: 10 }}
                                />
                              </label>
                              {text_template.text}
                              <br />
                            </>
                          );
                        }
                      })}
                    </div>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <h3>
                      <BsCheckLg
                        style={{
                          color: "#F3702D",
                          fontSize: "1.2em",
                          fontWeight: "bold",
                          marginRight: "0.2em",
                        }}
                      />
                      Included
                    </h3>
                    <hr />
                    <ReactSearchBox
                      placeholder="Search"
                      onSelect={(record) =>
                        this.toggle_by_search(record.item["key"])
                      }
                      data={included_data}
                    />
                    <hr />
                    <div style={divStyle}>
                      {/* eslint-disable-next-line */}
                      {this.state.text_templates.map((text_template) => {
                        if (
                          text_template.type === "Included" &&
                          (this.state.selectedCountries.length === 0 ||
                            text_template.countries.some((country) =>
                              this.state.selectedCountries.includes(country)
                            ))
                        ) {
                          return (
                            <>
                              <label>
                                <Form.Check
                                  type={"checkbox"}
                                  name={text_template.id}
                                  checked={this.state.text_template_values.includes(
                                    text_template.id
                                  )}
                                  onChange={this.update_offer_templates}
                                  style={{ marginTop: 5, marginLeft: 10 }}
                                />
                              </label>
                              {text_template.text}
                              <br />
                            </>
                          );
                        }
                      })}
                    </div>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <h3>
                      <ImCross
                        style={{
                          color: "#F3702D",
                          fontSize: "1.2em",
                          fontWeight: "bold",
                          marginRight: "0.2em",
                        }}
                      />
                      Not Included
                    </h3>
                    <hr />
                    <ReactSearchBox
                      placeholder="Search"
                      onSelect={(record) =>
                        this.toggle_by_search(record.item["key"])
                      }
                      data={not_included_data}
                    />
                    <hr />
                    <div style={divStyle}>
                      {/* eslint-disable-next-line */}
                      {this.state.text_templates.map((text_template) => {
                        if (
                          text_template.type === "Not Included" &&
                          (this.state.selectedCountries.length === 0 ||
                            text_template.countries.some((country) =>
                              this.state.selectedCountries.includes(country)
                            ))
                        ) {
                          return (
                            <>
                              <label>
                                <Form.Check
                                  type={"checkbox"}
                                  name={text_template.id}
                                  checked={this.state.text_template_values.includes(
                                    text_template.id
                                  )}
                                  onChange={this.update_offer_templates}
                                  style={{ marginTop: 5, marginLeft: 10 }}
                                />
                              </label>
                              {text_template.text}
                              <br />
                            </>
                          );
                        }
                      })}
                    </div>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <h3>
                      <BiNote
                        style={{
                          color: "#F3702D",
                          fontSize: "1.2em",
                          fontWeight: "bold",
                          marginRight: "0.2em",
                        }}
                      />
                      Notes
                    </h3>
                    <hr />
                    <ReactSearchBox
                      placeholder="Search"
                      onSelect={(record) =>
                        this.toggle_by_search(record.item["key"])
                      }
                      data={notes_data}
                    />
                    <hr />
                    <div style={divStyle}>
                      {/* eslint-disable-next-line */}
                      {this.state.text_templates.map((text_template) => {
                        if (
                          text_template.type === "Notes" &&
                          (this.state.selectedCountries.length === 0 ||
                            text_template.countries.some((country) =>
                              this.state.selectedCountries.includes(country)
                            ))
                        ) {
                          return (
                            <>
                              <label>
                                <Form.Check
                                  type={"checkbox"}
                                  name={text_template.id}
                                  checked={this.state.text_template_values.includes(
                                    text_template.id
                                  )}
                                  onChange={this.update_offer_templates}
                                  style={{ marginTop: 5, marginLeft: 10 }}
                                />
                              </label>
                              {text_template.text}
                              <br />
                            </>
                          );
                        }
                      })}
                    </div>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={4}>
                    <h3>
                      <ImPriceTag
                        style={{
                          color: "#F3702D",
                          fontSize: "1.2em",
                          fontWeight: "bold",
                        }}
                      />
                      Entry Price
                    </h3>
                    <hr />
                    <ReactSearchBox
                      placeholder="Search"
                      onSelect={(record) =>
                        this.toggle_by_search(record.item["key"])
                      }
                      data={entry_price_data}
                    />
                    <hr />
                    <div style={divStyle}>
                      {/* eslint-disable-next-line */}
                      {this.state.text_templates.map((text_template) => {
                        if (
                          text_template.type === "Entry Price" &&
                          (this.state.selectedCountries.length === 0 ||
                            text_template.countries.some((country) =>
                              this.state.selectedCountries.includes(country)
                            ))
                        ) {
                          return (
                            <>
                              <label>
                                <Form.Check
                                  type={"checkbox"}
                                  name={text_template.id}
                                  checked={this.state.text_template_values.includes(
                                    text_template.id
                                  )}
                                  onChange={this.update_offer_templates}
                                  style={{ marginTop: 5, marginLeft: 10 }}
                                />
                              </label>
                              {text_template.text}
                              <br />
                            </>
                          );
                        }
                      })}
                    </div>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <h3>
                      <AiOutlineCreditCard
                        style={{
                          color: "#F3702D",
                          fontSize: "1.2em",
                          fontWeight: "bold",
                          marginRight: "0.2em",
                        }}
                      />
                      Payment & Cancellation Policy
                    </h3>
                    <hr />
                    <ReactSearchBox
                      placeholder="Search"
                      onSelect={(record) =>
                        this.toggle_by_search(record.item["key"])
                      }
                      data={payment_and_cancellation_data}
                    />
                    <hr />
                    <div style={divStyle}>
                      {/* eslint-disable-next-line */}
                      {this.state.text_templates.map((text_template) => {
                        if (
                          text_template.type ===
                            "Payment & Cancellation Policy" &&
                          (this.state.selectedCountries.length === 0 ||
                            text_template.countries.some((country) =>
                              this.state.selectedCountries.includes(country)
                            ))
                        ) {
                          return (
                            <>
                              <label>
                                <Form.Check
                                  type={"checkbox"}
                                  name={text_template.id}
                                  checked={this.state.text_template_values.includes(
                                    text_template.id
                                  )}
                                  onChange={this.update_offer_templates}
                                  style={{ marginTop: 5, marginLeft: 10 }}
                                />
                              </label>
                              {text_template.text}
                              <br />
                            </>
                          );
                        }
                      })}
                    </div>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <h3>
                      <FaChild
                        style={{
                          color: "#F3702D",
                          fontSize: "1.2em",
                          fontWeight: "bold",
                          marginRight: "0.2em",
                        }}
                      />
                      Children Policy
                    </h3>
                    <hr />
                    <ReactSearchBox
                      placeholder="Search"
                      onSelect={(record) =>
                        this.toggle_by_search(record.item["key"])
                      }
                      data={children_policy_data}
                    />
                    <hr />
                    <div style={divStyle}>
                      {/* eslint-disable-next-line */}
                      {this.state.text_templates.map((text_template) => {
                        if (
                          text_template.type === "Children Policy" &&
                          (this.state.selectedCountries.length === 0 ||
                            text_template.countries.some((country) =>
                              this.state.selectedCountries.includes(country)
                            ))
                        ) {
                          return (
                            <>
                              <label>
                                <Form.Check
                                  type={"checkbox"}
                                  name={text_template.id}
                                  checked={this.state.text_template_values.includes(
                                    text_template.id
                                  )}
                                  onChange={this.update_offer_templates}
                                  style={{ marginTop: 5, marginLeft: 10 }}
                                />
                              </label>
                              {text_template.text}
                              <br />
                            </>
                          );
                        }
                      })}
                    </div>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <h3>
                      <AiOutlineSend
                        style={{
                          color: "#F3702D",
                          fontSize: "1.2em",
                          fontWeight: "bold",
                          marginRight: "0.2em",
                        }}
                      />
                      Epilogue
                    </h3>
                    <hr />
                    <ReactSearchBox
                      placeholder="Search"
                      onSelect={(record) =>
                        this.toggle_by_search(record.item["key"])
                      }
                      data={epilogue_data}
                    />
                    <hr />
                    <div style={divStyle}>
                      {/* eslint-disable-next-line */}
                      {this.state.text_templates.map((text_template) => {
                        if (
                          text_template.type === "Epilogue" &&
                          (this.state.selectedCountries.length === 0 ||
                            text_template.countries.some((country) =>
                              this.state.selectedCountries.includes(country)
                            ))
                        ) {
                          return (
                            <>
                              <label>
                                <Form.Check
                                  type={"checkbox"}
                                  name={text_template.id}
                                  checked={this.state.text_template_values.includes(
                                    text_template.id
                                  )}
                                  onChange={this.update_offer_templates}
                                  style={{ marginTop: 5, marginLeft: 10 }}
                                />
                              </label>
                              {text_template.text}
                              <br />
                            </>
                          );
                        }
                      })}
                    </div>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <AddTextTemplateModal redir={false} remount={this.remount} />
              <div style={{ display: "inline-flex", marginLeft: "31%" }}>
                <div>
                  <label>
                    <Form.Check
                      type={"checkbox"}
                      onChange={this.selectAllTemplates}
                      value={this.state.selectAllBool}
                      style={{ marginTop: 5, marginLeft: 10 }}
                    />
                  </label>
                  <b>
                    {this.state.selectAllBool
                      ? "Remove All Templates"
                      : "Select All templates"}
                  </b>
                </div>
              </div>
            </>
          ) : (
            loader()
          )}
        </div>
      </>
    );
  }
}

export default OfferTemplate;
