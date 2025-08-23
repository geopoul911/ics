// Built-ins
import React from "react";

// Icons
import { FaRegListAlt, FaHotel } from "react-icons/fa";
import { AiOutlineWarning } from "react-icons/ai";
import { AiOutlineMail } from "react-icons/ai";
import { BiSave } from "react-icons/bi";
import { MdBlock } from "react-icons/md";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { FaToggleOn } from "react-icons/fa";
import { FaToggleOff } from "react-icons/fa";

// Modules / Functions
import { Card, Form, Row, Col, ListGroup } from "react-bootstrap";
import { Button, Grid } from "semantic-ui-react";
import axios from "axios";
import { Editor } from "@tinymce/tinymce-react";
import Swal from "sweetalert2";

// CSS
import "react-tabs/style/react-tabs.css";

// Global Variables
import { headers, pageHeader, loader } from "../../../global_vars";

window.Swal = Swal;

let form_control_style = {
  marginBottom: 10,
  width: "80%",
  display: "inline-block",
};

function getRefcode() {
  return window.location.pathname.split("/")[3];
}

function generateRoomTable(inputString) {
  // Check if inputString is null or empty
  if (!inputString || inputString.trim() === "") {
    return ""; // Return blank if inputString is null or empty
  }

  // Split the input string into an array of room counts
  const roomCounts = inputString.split("//").map(item => item.trim());

  // Ensure the input string is in the correct format
  if (!roomCounts.every(roomCount => /^\s*(Single|Double for single use|Double|Twin|Triple|Quad|Suite|Five Bed|Six Bed|Seven Bed|Eight Bed)\s*:\s*\d+\s*$/.test(roomCount))) {
    return ""; // Return blank if the input string is not in the correct format
  }

  // Define the order of room types
  const roomOrder = ['Twin', 'Double', 'Triple', 'Quad', 'Double for single use', 'Single'];

  // Sort roomCounts based on the order of room types
  roomCounts.sort((a, b) => {
    const typeA = a.split(':')[0].trim();
    const typeB = b.split(':')[0].trim();
    return roomOrder.indexOf(typeA) - roomOrder.indexOf(typeB);
  });

  let paxCounter = 1;
  let rows = [];

  // Define the table header
  let table = `
    <table width='1200' class='mce-item-table' data-mce-selected='1'>
      <tbody>
        <tr>
          <td>ROOM</td>
          <td>NO</td>
          <td>NAME</td>
          <td>SEX</td>
          <td>D.O.B</td>
          <td>PASSPORT NO</td>
        </tr>
  `;

  // Iterate through each room count
  roomCounts.forEach(roomCount => {
    const [roomType, numOfRooms] = roomCount.split(":").map(item => item.trim());
    const totalRooms = parseInt(numOfRooms);

    // Determine rowspan based on room type
    let rowspan = {
      'Single': 1,
      'Double for single use': 1,
      'Double': 2,
      'Twin': 2,
      'Triple': 3,
      'Quad': 4,
      'Suite': 5,
      'Five Bed': 5,
      'Six Bed': 6,
      'Seven Bed': 7,
      'Eight Bed': 8,
    }[roomType];

    // Generate rows for each room type
    for (let i = 1; i <= totalRooms; i++) {
      rows.push(`
        <tr>
          <td rowspan="${rowspan}">${roomType} ${i}</td>
          <td>${paxCounter}</td>
          <td><br></td>
          <td><br></td>
          <td><br></td>
          <td><br></td>
        </tr>
      `);
      paxCounter++;

      // Insert additional rows for room types with rowspan > 1
      if (rowspan > 1) {
        for (let j = 2; j <= rowspan; j++) {
          rows.push(`
            <tr>
              <td>${paxCounter}</td>
              <td><br></td>
              <td><br></td>
              <td><br></td>
              <td><br></td>
            </tr>
          `);
          paxCounter++;
        }
      }
    }
  });

  // Check if there is at least one 'Single' room
  if (roomCounts.some(roomCount => roomCount.startsWith('Single:'))) {
    // Modify the last row's NAME column to 'Driver'
    rows[rows.length - 1] = rows[rows.length - 1].replace('<td><br></td>', '<td>DRIVER</td>');
  }

  // Append rows to the table
  table += rows.join('');

  table += "</tbody></table>";

  return table;
}

const icon_style = {
  fontSize: "1.0em",
  marginRight: 10,
};

const VIEW_ROOMING_LIST = "http://localhost:8000/api/groups/rooming_list_view/";
const CHANGE_ROOMTEXT = "http://localhost:8000/api/groups/change_rooming_list_room_text/";
const EDIT_ROOMING_LIST_FIELDS_MASS = "http://localhost:8000/api/groups/edit_mass_rooming_list_fields/";
const SEND_ALL_ROOMING_LISTS = "http://localhost:8000/api/groups/send_all_rooming_lists/";
const SEND_ROOMING_LIST = "http://localhost:8000/api/groups/send_rooming_list/";
const TOGGLE_CHECKMARK = "http://localhost:8000/api/groups/toggle_checkmark/";

class GroupRoomingLists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rooming_list: [],
      showing: "All",
      selected_hotels: {},
      all_room_text: generateRoomTable(this.props.group.room_desc),
      send_from: localStorage.user_email,
      all_note: "N/A",
      group: {
        rooming_lists: [],
        group_travelday: [],
      },
      isLoaded: false,
    };
    this.changeAllRoomText = this.changeAllRoomText.bind(this);
    this.change_showing = this.change_showing.bind(this);
    this.change_roomText = this.change_roomText.bind(this);
    this.apply_new_room_text = this.apply_new_room_text.bind(this);
    this.update_state = this.update_state.bind(this);
    this.change_note_all = this.change_note_all.bind(this);
    this.toggle_rooming_list_check_box = this.toggle_rooming_list_check_box.bind(this);
    this.toggle_rooming_list_checkmark = this.toggle_rooming_list_checkmark.bind(this);
    this.save_changes_multiple = this.save_changes_multiple.bind(this);
    this.send_all_rooming_lists = this.send_all_rooming_lists.bind(this);
    this.send_rooming_list = this.send_rooming_list.bind(this);
  }

  changeAllRoomText(e) {
    this.setState({
      all_room_text: e,
    });
  }

  change_note_all(e) {
    this.setState({
      all_note: e.target.value,
    });
  }

  change_roomText(content) {
    var group = { ...this.props.group };
    group.rooming_lists.filter(
      (rm) => rm.hotel.name === this.state.showing
    )[0].roomtext = content;
    this.setState({
      group: group,
    });
  }

  update_state(rooming_list) {
    this.setState({
      rooming_list: rooming_list,
    });
  }

  toggle_rooming_list_check_box(event) {
    const checked = event.target.checked;
    const name = event.target.name;
  
    // Create a new object based on the current state
    const updatedSelectedHotels = {
      ...this.state.selected_hotels,
      [name]: checked // Update the checked status for the targeted hotel
    };
  
    // Set the state with the updated object
    this.setState({
      selected_hotels: updatedSelectedHotels,
    });
  }

  toggle_rooming_list_checkmark(checked, rl_id) {
    console.log(checked)
    axios({
      method: "post",
      url: TOGGLE_CHECKMARK,
      headers: headers,
      data: {
        rl_id: rl_id,
        checked: checked,
        refcode: getRefcode(),
      },
    })
    .then((res) => {
      this.props.update_state(res.data.group);
    })
  }

  apply_new_room_text() {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios({
      method: "post",
      url: CHANGE_ROOMTEXT + getRefcode(),
      headers: headers,
      data: {
        rooming_list_id: this.state.rooming_list.id,
        room_text: this.props.group.rooming_lists.filter(
          (rm) => rm.id === this.state.rooming_list.id
        )[0].roomtext,
      },
    })
    .then((res) => {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Successfully updated selected rooming lists",
      });
      this.setState({
        rooming_list: res.data.rooming_list,
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

  save_changes_multiple() {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios({
      method: "post",
      url: EDIT_ROOMING_LIST_FIELDS_MASS + getRefcode(),
      headers: headers,
      data: {
        selected_hotels: this.state.selected_hotels,
        all_note: this.state.all_note,
        room_text: this.state.all_room_text,
      },
    })
    .then((res) => {
      this.props.update_state(res.data.group);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Successfully updated selected rooming lists",
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

  change_showing = (e) => {
    this.setState({
      showing: e.target.value,
    });
    if (e.target.value !== "All") {
      headers["Authorization"] = "Token " + localStorage.getItem("userToken");
      axios.get(VIEW_ROOMING_LIST + getRefcode(window.location.pathname), {
        headers: headers,
        params: {
          hotel_name: e.target.value,
        },
      })
      .then((res) => {
        this.setState({
          rooming_list: res.data.rooming_list,
        });
      });
    }
  };

  send_all_rooming_lists() {
    axios({
      method: "post",
      url: SEND_ALL_ROOMING_LISTS + getRefcode(),
      headers: headers,
      data: {
        send_from: this.state.send_from,
      },
    })
    .then((res) => {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: res.data.recipients.map((e) => e + " \n"),
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

  send_rooming_list() {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios({
      method: "post",
      url: SEND_ROOMING_LIST + getRefcode(),
      headers: headers,
      data: {
        rooming_list_id: this.state.rooming_list.id,
        hotel_id: this.state.rooming_list.hotel.id,
        send_from: this.state.send_from,
      },
    })
    .then((res) => {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: res.data.recipients.map((e) => e + " \n"),
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

  componentDidMount() {
  // Initialize selected_hotels with all hotels checked
  const selectedHotels = {};
  this.props.group.group_travelday.forEach(item => {
    const hotelName = item.hotel ? item.hotel.name : '';
    if (hotelName) {
      selectedHotels[hotelName] = true;
    }
    });
    this.setState({ selected_hotels: selectedHotels });
  }
  
  setSendFrom = (value) => {
    this.setState({ send_from: value });
  };

  render() {
    let unique_hotels = [
    ...new Set(
      this.props.group.group_travelday.map((item) =>
        item.hotel ? item.hotel : ""
      )
    ),
  ];

  const unique_hotel_names = [
    ...new Set(unique_hotels.map((item) => (item.name ? item.name : ""))),
  ];

  const user_email = localStorage.getItem("user_email");
  const user_secondary_email = localStorage.getItem("user_secondary_email");

  console.log(localStorage)

  return this.props.isLoaded ? (
    <>
      <div className="rootContainer">
        {pageHeader("group_rooming_lists", this.props.group.refcode)}
        <Card>
          <Card.Header>
            <FaRegListAlt
              style={{
                color: "#F3702D",
                fontSize: "1.5em",
                marginRight: "0.5em",
              }}
            />
            Please select a hotel to view the rooming list
          </Card.Header>
          <Card.Body>
            <Grid columns={2} stackable>
              <Grid.Row>
                <Grid.Column width={5}>
                <ul id="hotel_list">
                  <Button
                    style={{
                      backgroundColor:
                        this.state.showing === "All" ? "#F3702D" : "",
                      margin: 4,
                      color: this.state.showing === "All" ? "white" : "",
                    }}
                    onClick={this.change_showing}
                    value={"All"}
                  >
                    All
                  </Button>
                  {unique_hotel_names.map((e) =>
                    e.length > 0 ? (
                      <li style={{ display: "inline-block" }}>
                        <Button
                          style={{
                            backgroundColor:
                              this.state.showing === e ? "#F3702D" : "",
                            margin: 4,
                            color: this.state.showing === e ? "white" : "",
                          }}
                          onClick={this.change_showing}
                          value={e}
                        >
                          <FaHotel style={icon_style} className="unclickable" />
                          {e}
                        </Button>
                      </li>
                    ) : (
                      ""
                    )
                  )}
                </ul>
                <hr />
                {this.state.showing !== "All" ? (
                  <div style={{ marginTop: 5, marginLeft: 20 }}>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="2">
                        Send To:
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control
                          style={form_control_style}
                          disabled
                          value={this.state.rooming_list.doc_To ? this.state.rooming_list.doc_To.email : "N/A"}
                        />
                      </Col>
                      <Form.Label column sm="2">
                        Send From:
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control
                          disabled={true}
                          style={form_control_style}
                          value={localStorage.getItem("user_email")}
                        />
                      </Col>
                      <Form.Label column sm="2">
                        Date:
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control
                          disabled={true}
                          style={form_control_style}
                          value={this.state.rooming_list.doc_Date ? this.state.rooming_list.doc_Date : "N/A"}
                        />
                      </Col>
                      <Form.Label column sm="2">
                        Nights
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control
                          disabled
                          style={form_control_style}
                          value={this.state.rooming_list.doc_nights ? this.state.rooming_list.doc_nights : "N/A"}
                        />
                      </Col>
                    </Form.Group>
                  </div>
                ) : (
                  <>
                    <Grid.Row>
                      <Grid.Column width={12}>
                        <div style={{ marginTop: 5, marginLeft: 30 }}>
                          <label style={{ color: "red", fontWeight: "bold" }}>
                            Check the hotels you want to edit rooming lists for
                          </label>
                          <ul>
                            {unique_hotel_names.map((e) =>
                              e.length > 0 ? (
                                <li key={e} style={{ width: '100%', display: 'inline-block' }}>
                                  <label style={{ width: '80%' }}>
                                    <Form.Check
                                      inline
                                      label={e}
                                      name={e}
                                      type={"checkbox"}
                                      value={e}
                                      checked={this.state.selected_hotels[e] || false}
                                      id={`inline-${"checkbox"}-${e}`}
                                      onChange={this.toggle_rooming_list_check_box}
                                    />
                                    {/* Find the corresponding item */}
                                    {this.props.group.rooming_lists.map(item => {
                                      if (item.hotel.name === e && item.sent === true) {
                                        return (
                                          <IoIosCheckmarkCircle
                                            key={item.id}
                                            style={{ color: 'green', fontSize: '1.3em' }}
                                            title={`Rooming List Is Sent to: ${e}`}
                                          />
                                        );
                                      }
                                      return null;
                                    })}
                                  </label>

                                  <div style={{ display: 'inline', fontSize: 10, margin: '0 auto' }}>
                                    {this.props.group.rooming_lists.find(item => item.hotel.name === e).sent ? 
                                      <>
                                        <FaToggleOn
                                          style={{fontSize: '2.5em', cursor: 'pointer', marginBottom: 6, color: '#007bff'}}
                                          title={`Toggle Sent Status for ${e}`}
                                          onClick={() => {
                                            this.toggle_rooming_list_checkmark(
                                              this.props.group.rooming_lists.find(item => item.hotel.name === e).sent,
                                              this.props.group.rooming_lists.find(item => item.hotel.name === e).id);
                                          }}
                                        />
                                      </>
                                      :
                                      <>
                                      <FaToggleOff
                                          style={{fontSize: '2.5em', cursor: 'pointer', marginBottom: 6, color: '#007bff'}}
                                          title={`Toggle Sent Status for ${e}`}
                                          onClick={() => {
                                            this.toggle_rooming_list_checkmark(
                                              this.props.group.rooming_lists.find(item => item.hotel.name === e).sent,
                                              this.props.group.rooming_lists.find(item => item.hotel.name === e).id);
                                          }}
                                        />
                                      </>
                                    }
                                  </div>
                                </li>
                              ) : null
                            )}
                          </ul>
                        </div>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Column>
                      <ListGroup style={{ marginLeft: "2%", marginRight: "2%" }}>
                        <ListGroup.Item>
                          <div className={"info_descr"}>From: </div>
                          <div className={"info_span"} style={{ backgroundColor: "#e9ecef" }}>
                            {localStorage.getItem("user_email")}
                          </div>
                          <MdBlock
                            title={
                              "Rooming list's Sender cannot be changed."
                            }
                            style={{
                              color: "red",
                              fontSize: 16,
                              float: "right",
                              marginTop: 5,
                              cursor: "unset",
                            }}
                            className={"edit_icon"}
                          />
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <div className={"info_descr"}>
                            Room Description:
                          </div>
                          <div
                            className={"info_span"}
                            style={{ backgroundColor: "#e9ecef" }}
                          >
                            {this.props.group.room_desc
                              ? this.props.group.room_desc
                              : "N/A"}
                          </div>
                          <MdBlock
                            title={
                              "Rooming list's Room Description cannot be changed in this page. \nTo change Room Description head to group's overview."
                            }
                            style={{
                              color: "red",
                              fontSize: 16,
                              float: "right",
                              marginTop: 5,
                              cursor: "unset",
                            }}
                            className={"edit_icon"}
                          />
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <div className={"info_descr"}>
                            Meal Description:
                          </div>
                          <div className={"info_span"} style={{ backgroundColor: "#e9ecef" }}>
                            {this.props.group.meal_desc ? this.props.group.meal_desc : "N/A"}
                          </div>
                          <MdBlock
                            title={
                              "Rooming list's Meal Description cannot be changed in this page. \nTo change Meal Description head to group's overview."
                            }
                            style={{
                              color: "red",
                              fontSize: 16,
                              float: "right",
                              marginTop: 5,
                              cursor: "unset",
                            }}
                            className={"edit_icon"}
                          />
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <div className={"info_descr"}>
                            Note: ( Optional )
                          </div>
                          <div
                            className={"info_span"}
                            style={{ backgroundColor: "#e9ecef" }}
                          >
                            <input
                              className="form-control"
                              disabled={unique_hotel_names.length === 0}
                              value={this.state.all_note}
                              onChange={this.change_note_all}
                            />
                          </div>
                        </ListGroup.Item>
                      </ListGroup>
                    </Grid.Column>
                  </>
                )}
              </Grid.Column>
              <Grid.Column width={11}>
                {this.state.showing === "All" ? (
                  <Editor
                    apiKey="gbn17r35npt722cfkbjivwssdep33fkit1sa1zg7976rhjzc"
                    onEditorChange={(e) => this.changeAllRoomText(e)}
                    value={this.state.all_room_text}
                    init={{
                      height: 520,
                      menubar: false,
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
                ) : (
                  <Editor
                    apiKey="gbn17r35npt722cfkbjivwssdep33fkit1sa1zg7976rhjzc"
                    onEditorChange={this.change_roomText}
                    value={
                      this.props.group.rooming_lists.filter((rm) => rm.hotel.name === this.state.showing).length > 0
                        ? this.props.group.rooming_lists.filter((rm) => rm.hotel.name === this.state.showing)[0].roomtext
                        : ""
                    }
                    disabled={unique_hotel_names.length === 0}
                    init={{
                      height: 520,
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
                )}

                {this.state.showing === "All" ? (
                  <>
                    <Button
                      color="green"
                      style={{ margin: 10 }}
                      onClick={this.save_changes_multiple}
                    >
                      <BiSave /> Save changes
                    </Button>
                    <br />
                    <p className="mr-auto" style={{ color: "red" }}>
                      <AiOutlineWarning
                        style={{
                          color: "red",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      Save changes will also update the selected hotel's
                      rooming list
                    </p>
                  </>
                ) : (
                  <>
                    <Button color="green" style={{ margin: 10, visibility: this.state.showing === "All" ? "hidden" : "",}} onClick={this.apply_new_room_text}>
                      <BiSave /> Save Room text
                    </Button>
                  </>
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Card.Body>
          <Card.Footer>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label>Send from: </label>
              <select
                required
                className="form-control"
                value={this.state.send_from}
                style={{ width: 240, marginRight: 10 }}
                onChange={(e) => this.setSendFrom(e.target.value)}
              >
                {user_email && <option value={user_email}>{user_email}</option>}
                {user_secondary_email && (
                  <option value={user_secondary_email}>
                    {user_secondary_email}
                  </option>
                )}
              </select>
              {this.state.showing !== "All" ? (
                <Button color="green" disabled={this.state.showing === ""} onClick={this.send_rooming_list}>
                  <AiOutlineMail /> Send by email
                </Button>
              ) : (
                <Button
                  color="green"
                  disabled={unique_hotel_names.length === 0}
                  onClick={this.send_all_rooming_lists}
                >
                  <AiOutlineMail /> Send all Rooming lists
                </Button>
              )}
            </div>
          </Card.Footer>
        </Card>
      </div>
    </>
    ) : (
      <div style={{ minHeight: 776 }}>{loader()}</div>
    );
  }
}

export default GroupRoomingLists;
