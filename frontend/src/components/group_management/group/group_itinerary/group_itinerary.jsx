// Built-ins
import React from "react";

// Modules / Functions
import { Col, Form, Table } from "react-bootstrap";
import { Grid, Button, TextArea } from "semantic-ui-react";
import { Accordion, Icon } from "semantic-ui-react";
import { Editor } from "@tinymce/tinymce-react";
import moment from "moment";
import Swal from "sweetalert2";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import axios from "axios";

// CSS
import "react-tabs/style/react-tabs.css";

// Icons / Images
import { FaMapMarkerAlt, FaCity } from "react-icons/fa";
import { BsInfoSquare } from "react-icons/bs";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";

// Global Variables
import {
  headers,
  pageHeader,
  loader,
} from "../../../global_vars";

// Variables
window.Swal = Swal;

const format = "HH:mm";

let amenity_icons_style = {
  color: "#F3702D",
  fontSize: "1.5em",
  marginRight: "0.5em",
};

let cross_style = {
  color: "red",
  fontSize: "1em",
};

let tick_style = {
  color: "green",
  fontSize: "1.4em",
};

function getRefcode() {
  return window.location.pathname.split("/")[3];
}

const TOGGLE_TD_ATTRACTION =
  "http://localhost:8000/api/groups/toggle_travelday_attraction/";
const UPDATE_GROUP_REMARKS =
  "http://localhost:8000/api/groups/update_group_remarks/";
const CHANGE_ATTRACTION_TIME =
  "http://localhost:8000/api/groups/change_attraction_time/";
const ADD_ATTRACTION_TO_TRAVELDAY =
  "http://localhost:8000/api/groups/add_attraction_to_travelday/";
const GET_ALL_ATTRACTIONS =
  "http://localhost:8000/api/view/get_all_attractions/";
const CHANGE_TD_COMMENT =
  "http://localhost:8000/api/groups/change_travelday_comment/";

class GroupItinerary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group: {},
      is_loaded: false,
      room_text: "",
      remarks: "",
      all_attractions: [],
      comment_text: "",
    };
    this.handle_accordion = this.handle_accordion.bind(this);
    this.updateRemarks = this.updateRemarks.bind(this);
    this.insert_attraction = this.insert_attraction.bind(this);
    this.update_comment_text = this.update_comment_text.bind(this);
    this.update_td_comment = this.update_td_comment.bind(this);
  }

  componentDidMount() {
    this.setState({ remarks: this.props.group.remarks_text });
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(GET_ALL_ATTRACTIONS, {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          all_attractions: res.data.all_attractions,
        });
      });
  }

  change_Remarks = () => {
    axios({
      method: "post",
      url: UPDATE_GROUP_REMARKS + getRefcode(),
      headers: headers,
      data: {
        content: this.state.remarks,
      },
    })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Group's Remarks changed successfully",
        });
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: e.response.data.errormsg,
        });
      });
  };

  updateRemarks = (remarks) => {
    this.setState({
      remarks: remarks,
    });
  };

  update_comment_text = (comment_text) => {
    this.setState({
      comment_text: comment_text,
    });
  };

  handle_accordion = (e, titleProps) => {
    const { index } = titleProps;
    const { activeAccordionIndex } = this.state;
    const newIndex = activeAccordionIndex === index ? -1 : index;
    this.setState({ activeAccordionIndex: newIndex });
  };

  toggle_day_attraction(td, attraction) {
    axios({
      method: "post",
      url: TOGGLE_TD_ATTRACTION,
      headers: headers,
      data: {
        td_id: td.id,
        attraction_id: attraction.id,
      },
    }).then((res) => {
      this.props.update_state(res.data.model);
    });
  }

  change_attraction_time(td, attraction, time) {
    axios({
      method: "post",
      url: CHANGE_ATTRACTION_TIME,
      headers: headers,
      data: {
        travelday_id: td,
        attraction_entry_id: attraction,
        time: time,
      },
    }).then((res) => {
      this.props.update_state(res.data.model);
    });
  }

  insert_attraction = (att_name, td_id) => {
    axios({
      method: "post",
      url: ADD_ATTRACTION_TO_TRAVELDAY,
      headers: headers,
      data: {
        travelday_id: td_id,
        attraction_name: att_name,
      },
    })
      .then((res) => {
        this.props.update_state(res.data.model);
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: e.response.data.errormsg,
        });
      });
  };

  update_td_comment(td_id, comment) {
    axios({
      method: "post",
      url: CHANGE_TD_COMMENT,
      headers: headers,
      data: {
        travelday_id: td_id,
        comment: comment,
      },
    }).then((res) => {
      this.setState({
        comment_text: "",
      });
      this.props.update_state(res.data.model);
    });
  }

  render() {
    return (
      <>
        <div className="rootContainer">
          {pageHeader("group_itinerary", this.props.group.refcode)}
          {this.props.isLoaded ? (
            <>
              <Grid columns={3} divided stackable>
                <Grid.Column width={6}>
                  <h3
                    style={{
                      fontWeight: "bold",
                      color: "#F3702D",
                      marginLeft: 10,
                    }}
                  >
                    Remarks
                  </h3>
                  <hr />
                  <Editor
                    apiKey="gbn17r35npt722cfkbjivwssdep33fkit1sa1zg7976rhjzc"
                    initialValue={this.props.group.remarks_text}
                    onEditorChange={this.updateRemarks}
                    value={this.state.remarks}
                    init={{
                      height: 450,
                      menubar: false,
                      skin: "snow",
                      plugins: [
                        "advlist autolink lists link image charmap print preview anchor",
                        "searchreplace visualblocks code fullscreen",
                        "insertdatetime media table paste code help wordcount",
                      ],
                      toolbar:
                        "undo redo | formatselect | " +
                        "bold italic backcolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "removeformat | help",
                      content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    }}
                  />
                  <Button
                    style={{ margin: 10 }}
                    onClick={this.change_Remarks}
                    color="green"
                  >
                    Update Remarks
                  </Button>
                  <hr />
                </Grid.Column>
                <Grid.Column width={4}>
                  <h3
                    style={{
                      fontWeight: "bold",
                      color: "#F3702D",
                      marginLeft: 10,
                    }}
                  >
                    Attractions
                  </h3>
                  <hr />
                  {this.props.group.group_travelday.map((td, j) => {
                    if (td.hotel) {
                      return (
                        <>
                          <Accordion styled>
                            <Accordion.Title
                              active={this.state.activeAccordionIndex === j}
                              index={j}
                              onClick={this.handle_accordion}
                            >
                              <Icon name="dropdown" />
                              <FaCity style={amenity_icons_style} />
                              {td.hotel.region} (
                              {moment(td.date).format("DD/MM/yyyy")})
                            </Accordion.Title>
                            <Accordion.Content
                              active={this.state.activeAccordionIndex === j}
                            >
                              {td.travelday_attraction.length > 0 ? (
                                td.travelday_attraction.map((attraction) => (
                                  <>
                                    <label>
                                      <Form.Check
                                        name={attraction.attraction.name}
                                        onChange={() =>
                                          this.toggle_day_attraction(
                                            td,
                                            attraction.attraction
                                          )
                                        }
                                        type={"checkbox"}
                                        checked={td.travelday_attraction.some(
                                          (attraction_entry) =>
                                            attraction_entry.attraction.id ===
                                            attraction.attraction.id
                                        )}
                                        style={{
                                          marginTop: 5,
                                          marginLeft: 40,
                                        }}
                                      />
                                    </label>
                                    <FaMapMarkerAlt
                                      style={amenity_icons_style}
                                    />
                                    {attraction.attraction.name}
                                    {td.travelday_attraction
                                      .filter(
                                        (attraction_entry) =>
                                          attraction_entry.attraction.id ===
                                          attraction.attraction.id
                                      )
                                      .map((att_entry) => (
                                        <div
                                          style={{
                                            display: "inline-block",
                                            marginLeft: 20,
                                          }}
                                        >
                                          <TimePicker
                                            defaultValue={dayjs(
                                              "00:00",
                                              format
                                            )}
                                            format={format}
                                            onChange={(time) =>
                                              this.change_attraction_time(
                                                td.id,
                                                att_entry.id,
                                                time
                                              )
                                            }
                                            value={dayjs(
                                              att_entry.start_time,
                                              format
                                            )}
                                          />
                                        </div>
                                      ))}
                                    <br />
                                  </>
                                ))
                              ) : (
                                <p style={{ textAlign: "center" }}>
                                  This Region has no Attractions added yet
                                </p>
                              )}
                              <hr />
                              <Col sm="10">
                                <Autocomplete
                                  options={this.state.all_attractions}
                                  className={"select_airport"}
                                  onChange={(e) => {
                                    this.insert_attraction(
                                      e.target.innerText,
                                      td.id
                                    );
                                  }}
                                  getOptionLabel={(option) => option.name}
                                  style={{
                                    width: 300,
                                    margin: 0,
                                    marginBottom: 10,
                                  }}
                                  disabled={!this.props.isLoaded}
                                  disableClearable
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Select Attraction"
                                      variant="outlined"
                                    />
                                  )}
                                />
                              </Col>
                              <hr />
                              <Col sm="10" style={{ display: "grid" }}>
                                Add Day's Comment:
                                <TextArea
                                  key={td.comment}
                                  onChange={(e) =>
                                    this.update_comment_text(e.target.value)
                                  }
                                  value={td.comment}
                                  disabled={td.comment}
                                  rows={3}
                                  cols={5}
                                  maxLength={500}
                                  className="form-control"
                                  style={{ marginBottom: 20 }}
                                />
                                <div style={{ display: "inline-block" }}>
                                  <Button
                                    color="green"
                                    style={{ width: 150 }}
                                    disabled={this.state.comment_text === ""}
                                    onClick={() =>
                                      this.update_td_comment(
                                        td.id,
                                        this.state.comment_text
                                      )
                                    }
                                  >
                                    Save Comment
                                  </Button>
                                  <Button
                                    color="red"
                                    style={{ width: 150 }}
                                    disabled={!td.comment}
                                    onClick={() =>
                                      this.update_td_comment(td.id, null)
                                    }
                                  >
                                    Clear Comment
                                  </Button>
                                </div>
                              </Col>
                            </Accordion.Content>
                          </Accordion>
                          <hr />
                        </>
                      );
                    } else {
                      return <></>;
                    }
                  })}
                  <BsInfoSquare
                    style={{
                      color: "#F3702D",
                      fontSize: "1.4em",
                      marginRight: "0.5em",
                    }}
                  />
                  To add attractions to a place, head over to
                  <a
                    target="_blank"
                    href="/data_management/all_attractions"
                    style={{ marginLeft: 10 }}
                  >
                    All Attractions
                  </a>
                  <hr />
                </Grid.Column>
                <Grid.Column width={6}>
                  <h3
                    style={{
                      fontWeight: "bold",
                      color: "#F3702D",
                      marginLeft: 10,
                    }}
                  >
                    Contents
                  </h3>
                  <hr />
                  <Table>
                    {/* Header is static */}
                    <tr>
                      <th>Header</th>
                      <td>
                        <TiTick style={tick_style} />
                      </td>
                    </tr>
                    {/* Group Information is static */}
                    <tr>
                      <th>Group Information</th>
                      <td>
                        <TiTick style={tick_style} />
                      </td>
                    </tr>
                    <tr>
                      <th>Driver & Coach Information</th>
                      {this.props.coach_info_data.length > 0 ? (
                        <td>
                          <TiTick style={tick_style} />
                        </td>
                      ) : (
                        <td>
                          <ImCross style={cross_style} />
                        </td>
                      )}
                    </tr>
                    {/* ??? */}
                    <tr>
                      <th>Driver Contact Info</th>
                      {this.props.group.group_travelday.some(
                        (td) => td.driver !== null
                      ) ? (
                        <td>
                          <TiTick style={tick_style} />
                        </td>
                      ) : (
                        <td>
                          <ImCross style={cross_style} />
                        </td>
                      )}
                    </tr>
                    <tr>
                      <th>Group Leader Contact Info</th>
                      {this.props.group.group_travelday.some(
                        (td) => td.leader !== null
                      ) ? (
                        <td>
                          <TiTick style={tick_style} />
                        </td>
                      ) : (
                        <td>
                          <ImCross style={cross_style} />
                        </td>
                      )}
                    </tr>
                    <tr>
                      <th>Hotel List</th>
                      {this.props.group.group_travelday.some(
                        (td) => td.hotel !== null
                      ) ? (
                        <td>
                          <TiTick style={tick_style} />
                        </td>
                      ) : (
                        <td>
                          <ImCross style={cross_style} />
                        </td>
                      )}
                    </tr>
                    <tr>
                      <th>Attention</th>
                      <td>
                        <TiTick style={tick_style} />
                      </td>
                    </tr>
                    <tr>
                      <th>Itinerary</th>
                      {this.props.group.group_travelday.length > 0 ? (
                        <td>
                          <TiTick style={tick_style} />
                        </td>
                      ) : (
                        <td>
                          <ImCross style={cross_style} />
                        </td>
                      )}
                    </tr>
                    <tr>
                      <th>Services</th>
                      {this.props.group.group_travelday.some(
                        (td) => td.travelday_service.length > 0
                      ) ? (
                        <td>
                          <TiTick style={tick_style} />
                        </td>
                      ) : (
                        <td>
                          <ImCross style={cross_style} />
                        </td>
                      )}
                    </tr>
                    <tr>
                      <th>Attractions</th>
                      {this.props.group.group_travelday.some(
                        (td) => td.travelday_attraction.length > 0
                      ) ? (
                        <td>
                          <TiTick style={tick_style} />
                        </td>
                      ) : (
                        <td>
                          <ImCross style={cross_style} />
                        </td>
                      )}
                    </tr>
                    <tr>
                      <th>Remarks</th>
                      {this.props.group.remarks_text.length > 0 ? (
                        <td>
                          <TiTick style={tick_style} />
                        </td>
                      ) : (
                        <td>
                          <ImCross style={cross_style} />
                        </td>
                      )}
                    </tr>
                    <tr>
                      <th>Rooming List</th>
                      {this.props.group.roomtext.length > 0 ? (
                        <td>
                          <TiTick style={tick_style} />
                        </td>
                      ) : (
                        <td>
                          <ImCross style={cross_style} />
                        </td>
                      )}
                    </tr>
                  </Table>
                  <hr />
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

export default GroupItinerary;
