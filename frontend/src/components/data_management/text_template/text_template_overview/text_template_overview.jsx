// Built-ins
import React from "react";

// Icons-images
import { BsInfoSquare } from "react-icons/bs";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { FaFlag } from "react-icons/fa";
import { FiType } from "react-icons/fi";
import { BsCalendar2DateFill } from "react-icons/bs";
import { IoText } from "react-icons/io5";

// Functions / Modules
import axios from "axios";
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import moment from "moment";
import ReactCountryFlag from "react-country-flag";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";

// Custom Made Components
import ChangeText from "../../../modals/text_templates/change_text";
import ChangeType from "../../../modals/text_templates/change_type";
import ChangeCountries from "../../../modals/text_templates/change_countries";

import DeleteObjectModal from "../../../modals/delete_object";

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

let btnStyle = {
  paddingTop: 5,
  paddingLeft: 10,
  paddingRight: 10,
  paddingBottom: 5,
  margin: 4,
};

let overviewIconStyle = { color: "#F3702D", marginRight: "0.5em" };

let flagStyle = { width: "2.5em", height: "2.5em" };

const types = {
  AI: "Additional Information",
  I: "Included",
  NI: "Not Included",
  N: "Notes",
  EP: "Entry Price",
  PC: "Payment & Cancellation Policy",
  CP: "Children Policy",
  EL: "Epilogue",
};

const VIEW_TEXT_TEMPLATE =
  "http://localhost:8000/api/data_management/text_template/";
const UPDATE_OFFER_LANGUAGE =
  "http://localhost:8000/api/data_management/update_text_template_language/";

function getTextTemplateId() {
  return window.location.pathname.split("/")[3];
}

// TextTemplate overview page Class
class TextTemplateOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text_template: {},
      is_loaded: false,
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
      .get(VIEW_TEXT_TEMPLATE + getTextTemplateId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          text_template: res.data.text_template,
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
    this.setState({ text_template: update_state });
  };

  set_language = (language) => {
    axios({
      method: "post",
      url: UPDATE_OFFER_LANGUAGE,
      headers: headers,
      data: {
        language: language,
        text_template_id: getTextTemplateId(),
      },
    }).then((res) => {
      this.setState({
        text_template: res.data.text_template,
        is_loaded: true,
      });
    });
  };

  render() {
    return (
      <>
        <div className="mainContainer">
          {pageHeader("text_template_overview", this.state.text_template.name)}
          {this.state.forbidden ? (
            <>{forbidden("Text Template Overview")}</>
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
                        Text Template Information
                      </Card.Header>
                      <Card.Body>
                        <div className={"info_descr"}>
                          <IoText style={overviewIconStyle} /> Text
                        </div>
                        <div
                          className={
                            this.state.text_template.text
                              ? "info_span"
                              : "red_info_span"
                          }
                        >
                          {this.state.text_template
                            ? this.state.text_template.text
                            : "N/A"}
                        </div>
                        <ChangeText
                          object_id={this.state.text_template.id}
                          object_type={"Text Template"}
                          update_state={this.update_state}
                          text={
                            this.state.text_template
                              ? this.state.text_template.text
                              : "N/A"
                          }
                        />
                        <div className={"info_descr"}>
                          <FiType style={overviewIconStyle} /> Type
                        </div>
                        <div
                          className={
                            this.state.text_template.text
                              ? "info_span"
                              : "red_info_span"
                          }
                        >
                          {this.state.text_template
                            ? types[this.state.text_template.type]
                            : "N/A"}
                        </div>
                        <ChangeType
                          object_id={this.state.text_template.id}
                          object_type={"Text Template"}
                          update_state={this.update_state}
                          tt_type={
                            this.state.text_template
                              ? this.state.text_template.type
                              : "N/A"
                          }
                        />
                        <div className={"info_descr"}>
                          <FaFlag style={overviewIconStyle} /> Nationality
                        </div>
                        <div
                          className={
                            this.state.text_template.countries.length > 0
                              ? "info_span"
                              : "red_info_span"
                          }
                        >
                          {this.state.text_template.countries.length > 0
                            ? this.state.text_template.countries.map(
                                (country) => {
                                  if (country.name === "GN") {
                                    return (
                                      <React.Fragment key={country.name}>
                                        <Button
                                          style={btnStyle}
                                          color="blue"
                                          title="Generic"
                                        >
                                          <AiOutlineUnorderedList
                                            style={flagStyle}
                                          />
                                        </Button>
                                      </React.Fragment>
                                    );
                                  } else {
                                    return (
                                      <React.Fragment key={country.name}>
                                        <Button style={btnStyle} color="blue">
                                          <ReactCountryFlag
                                            countryCode={country.name}
                                            value={country.name}
                                            style={flagStyle}
                                            svg
                                          />
                                        </Button>
                                      </React.Fragment>
                                    );
                                  }
                                }
                              )
                            : "N/A"}
                        </div>
                        <ChangeCountries
                          object_id={this.state.text_template.id}
                          object_type={"Text Template"}
                          update_state={this.update_state}
                        />
                        <div className={"info_descr"}>
                          <BsCalendar2DateFill style={overviewIconStyle} /> Date
                          Created
                        </div>
                        <div className={"info_span"}>
                          {this.state.text_template.date_created
                            ? moment(this.state.date_created).format(
                                "DD-MM-YYYY HH:mm:ss"
                              )
                            : "N/A"}
                        </div>
                      </Card.Body>
                      <Card.Footer>
                        <DeleteObjectModal
                          object_id={this.state.text_template.id}
                          object_name={this.state.text_template.text}
                          object_type={"Text Template"}
                          update_state={this.update_state}
                        />
                      </Card.Footer>
                    </Card>
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

export default TextTemplateOverView;
