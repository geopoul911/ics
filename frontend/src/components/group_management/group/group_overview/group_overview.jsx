// Built-ins
import React from "react";

// Icons-images
import { BsInfoSquare, BsQuestionCircle } from "react-icons/bs";
import { BiBriefcase } from "react-icons/bi";
import { GiSteeringWheel } from "react-icons/gi";
import { CgDanger } from "react-icons/cg";
import { BiHotel, BiFootball, BiTransfer } from "react-icons/bi";
import { BsKey } from "react-icons/bs";
import { MdToll, MdBlock } from "react-icons/md";
import { HiOutlineTicket } from "react-icons/hi";
import { TiGroup } from "react-icons/ti";
import {
  MdLocalAirport,
  MdAirplaneTicket,
  MdHotel,
  MdRestaurant,
  MdOutlineSupportAgent,
  MdDriveFileRenameOutline,
} from "react-icons/md";
import { TextArea } from "semantic-ui-react";
import {
  FaHotel,
  FaTheaterMasks,
  FaRoute,
  FaBus,
  FaSkiing,
  FaPlane,
  FaCheck,
  FaHashtag,
  FaCaretUp,
  FaFlag,
} from "react-icons/fa";
import {
  GiTicket,
  GiShipWheel,
  GiCartwheel,
  GiAirplaneArrival,
  GiAirplaneDeparture,
} from "react-icons/gi";
import { SiYourtraveldottv } from "react-icons/si";
import { WiTrain } from "react-icons/wi";
import { RiShipLine, RiTrainFill } from "react-icons/ri";
import { ImCross } from "react-icons/im";
import { MdGroup } from "react-icons/md";

// Modals
import ChangeRefcode from "./modals/change_refcode";
import ChangeStatus from "./modals/change_status";
import ChangeAgentRefcode from "./modals/change_agent_refcode";
import ChangeClientRefcode from "./modals/change_client_refcode";
import ChangeNumberOfPeople from "./modals/change_number_of_people";
import ChangeArrivalFlight from "./modals/change_arrival";
import ChangeDepartureFlight from "./modals/change_departure";
// import ChangeGroupNationality from "./modals/change_nationality";
import ChangeGroupsAgent from "./modals/change_agent";
import ChangeGroupsClient from "./modals/change_client";
import ChangeEmployeeInfo from "./modals/change_employee_info";
import ChangeMealDesc from "./modals/change_meal_desc";
import ChangeRoomDesc from "./modals/change_room_desc";
import DeleteGroupModal from "./modals/delete_group";
import Notes from "../../../core/notes/notes";

// Functions / modules
import { Card, Table } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import ReactCountryFlag from "react-country-flag";
import { Segment } from "semantic-ui-react";

// Global Variables
import { loader, pageHeader } from "../../../global_vars";

const serviceIconStyle = {
  color: "#F3702D",
  fontSize: "1.7em",
  marginRight: 10,
};

function renderIcon(type) {
  if (type === "AIR") {
    return (
      <FaPlane
        title="Transportation type: Plane"
        style={{
          color: "#F3702D",
          fontSize: "1.5em",
          marginRight: "0.5em",
        }}
      />
    );
  } else if (type === "NA") {
    return (
      <BsQuestionCircle
        title="Transportation type: Unknown"
        style={{
          color: "#F3702D",
          fontSize: "1.5em",
          marginRight: "0.5em",
        }}
      />
    );
  } else if (type === "SEA") {
    return (
      <RiShipLine
        title="Transportation type: Ship"
        style={{
          color: "#F3702D",
          fontSize: "1.5em",
          marginRight: "0.5em",
        }}
      />
    );
  } else if (type === "TRN") {
    return (
      <RiTrainFill
        title="Transportation type: Train"
        style={{
          color: "#F3702D",
          fontSize: "1.5em",
          marginRight: "0.5em",
        }}
      />
    );
  }  else if (type === "CCH") {
    return (
      <FaBus
        title="Transportation type: Coach"
        style={{
          color: "#F3702D",
          fontSize: "1.5em",
          marginRight: "0.5em",
        }}
      />
    );
  } else {
    return <></>;
  }
}

let overviewIconStyle = { color: "#F3702D", marginRight: "0.5em" };

let service_types = {};

// url path = 'http://localhost:3000/group/TRA2MAS1082021AAAAA'
class GroupOverView extends React.Component {
  // We loop over group's traveldays, then loop over each travelday in order to find service names
  // if services exist, this variable's values turns to true, and we render them at group information's footer
  // as icons
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    if (this.props.isLoaded) {
      this.props.group.group_travelday.forEach((groupTravelday) => {
        const traveldayServiceArray = groupTravelday.travelday_service;
        // Iterate through the travelday_service array and update service_types
        traveldayServiceArray.forEach((service) => {
          const serviceType = service.service_type;
          // Assuming service_type is a valid key, you can set it to true in service_types
          service_types[serviceType] = true;
        });
      });
    }

    return (
      <>
        <div className="rootContainer">
          {pageHeader("group_overview", this.props.group.refcode)}
          {this.props.isLoaded ? (
            <>
              <Grid columns={2} divided stackable>
                <Grid.Column>
                  <Segment>
                    <Card>
                      <Card.Header>
                        <BsInfoSquare
                          style={{
                            color: "#F3702D",
                            fontSize: "1.5em",
                            marginRight: "0.5em",
                          }}
                        />
                        Group Information
                      </Card.Header>
                      <Card.Body>

                      <div className={"info_descr"}>
                          <FaCaretUp style={overviewIconStyle} />
                          ID
                        </div>
                        <div className={"info_span"}>
                          {this.props.group.id
                            ? this.props.group.id
                            : "N/A"}
                        </div>

                        <div className={"info_descr"}>
                          <FaHashtag style={overviewIconStyle} />
                          Reference Code
                        </div>
                        <div className={"info_span"}>
                          {this.props.group.refcode
                            ? this.props.group.refcode
                            : "N/A"}
                        </div>
                        <ChangeRefcode group={this.props.group} />
                        {/* Status, 4 = 'Cancelled' // 5 = Confirmed */}
                        <div className={"info_descr"}>
                          {this.props.group.status === "4" ? (
                            <ImCross style={overviewIconStyle} />
                          ) : (
                            <FaCheck style={overviewIconStyle} />
                          )}
                          Status
                        </div>
                        <div className={"info_span"}>
                          {this.props.group.status
                            ? this.props.group.status === "4"
                              ? "Cancelled"
                              : "Confirmed"
                            : "N/A"}
                        </div>

                        <ChangeStatus
                          update_state={this.props.update_state}
                          group={this.props.group}
                        />
                        <div className={"info_descr"}>
                          <GiAirplaneArrival style={overviewIconStyle} />
                          Arrival
                        </div>
                        <div className={"info_span"}>
                          {renderIcon(this.props.group.arrival_type)}
                          {this.props.group.arrival !== "N/A"
                            ? this.props.group.arrival
                            : "N/A"}
                        </div>
                        <ChangeArrivalFlight
                          refcode={this.props.group.refcode}
                          group={this.props.group}
                          update_state={this.props.update_state}
                        />
                        <div className={"info_descr"}>
                          <GiAirplaneDeparture style={overviewIconStyle} />
                          Departure
                        </div>
                        <div className={"info_span"}>
                          {renderIcon(this.props.group.departure_type)}
                          {this.props.group.departure !== "N/A"
                            ? this.props.group.departure
                            : "N/A"}
                        </div>
                        <ChangeDepartureFlight
                          refcode={this.props.group.refcode}
                          group={this.props.group}
                          update_state={this.props.update_state}
                        />
                        <div className={"info_descr"}>
                          <MdGroup style={overviewIconStyle} /> Number Of People
                        </div>
                        {/* eslint-disable-next-line */}
                        <div className={"info_span"}>
                          {this.props.group.number_of_people
                            ? this.props.group.number_of_people
                            : "0"}
                        </div>
                        <ChangeNumberOfPeople
                          update_state={this.props.update_state}
                          group={this.props.group}
                        />
                        <div className={"info_descr"}>
                          <FaFlag style={overviewIconStyle} /> Group Nationality
                        </div>
                        <div className={"info_span"}>
                          {this.props.group.agent ? (
                            <>
                              {this.props.group.agent.nationality ? (
                                this.props.group.agent.nationality.name ? (
                                  <>
                                    <ReactCountryFlag
                                      countryCode={
                                        this.props.group.agent.nationality.code
                                      }
                                      svg
                                      style={{
                                        width: "1.5em",
                                        height: "1.5em",
                                        marginRight: 10,
                                      }}
                                      title={
                                        this.props.group.agent.nationality.code
                                      }
                                    />
                                    {this.props.group.agent.nationality.name}
                                  </>
                                ) : (
                                  "N/A"
                                )
                              ) : (
                                "N/A"
                              )}
                            </>
                          ) : (
                            <>
                              {this.props.group.client.nationality ? (
                                this.props.group.client.nationality.name ? (
                                  <>
                                    <ReactCountryFlag
                                      countryCode={
                                        this.props.group.client.nationality.code
                                      }
                                      svg
                                      style={{
                                        width: "1.5em",
                                        height: "1.5em",
                                        marginRight: 10,
                                      }}
                                      title={
                                        this.props.group.client.nationality.code
                                      }
                                    />
                                    {this.props.group.client.nationality.name}
                                  </>
                                ) : (
                                  "N/A"
                                )
                              ) : (
                                "N/A"
                              )}
                            </>
                          )}
                        </div>
                        <MdBlock
                          title={"Group's Nationality cannot be changed."}
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
                          <MdHotel style={overviewIconStyle} />
                          Rooms Description
                        </div>
                        <div className={"info_span"}>
                          {this.props.group.room_desc
                            ? this.props.group.room_desc
                            : "N/A"}
                        </div>
                        <ChangeRoomDesc
                          update_state={this.props.update_state}
                          group={this.props.group}
                        />
                        <div className={"info_descr"}>
                          <MdRestaurant style={overviewIconStyle} /> Meal
                          Description
                        </div>
                        <div className={"info_span"}>
                          {this.props.group.meal_desc
                            ? this.props.group.meal_desc
                            : "N/A"}
                        </div>
                        <ChangeMealDesc
                          update_state={this.props.update_state}
                          group={this.props.group}
                        />
                      </Card.Body>
                      <Card.Footer>
                        {/* Card's Footer */}
                        <DeleteGroupModal
                          group={this.props.group}
                          can_del={this.props.can_del}
                        />
                        <small style={{ margin: 10, fontSize: 12 }}>
                          {/* if service_types object has at least one true value ? */}
                          {Object.values(service_types).includes(true)
                            ? "Group services "
                            : "This group has no services"}
                        </small>

                        {/* Footer contains services icons , we loop before render method to get which ones are true */}
                        {service_types["AC"] ? (
                          <BiHotel
                            style={serviceIconStyle}
                            title="Accomodation service(s)"
                          />
                        ) : (
                          ""
                        )}

                        {service_types["AT"] ? (
                          <MdAirplaneTicket
                            style={serviceIconStyle}
                            title="Air Ticket service(s)"
                          />
                        ) : (
                          ""
                        )}

                        {service_types["AP"] ? (
                          <MdLocalAirport
                            style={serviceIconStyle}
                            title="Air Porterage service(s)"
                          />
                        ) : (
                          ""
                        )}

                        {service_types["CFT"] ? (
                          <GiTicket
                            style={serviceIconStyle}
                            title="Coach's Ferry Ticket service(s)"
                          />
                        ) : (
                          ""
                        )}

                        {service_types["CR"] ? (
                          <GiShipWheel
                            style={serviceIconStyle}
                            title="Cruising service(s)"
                          />
                        ) : (
                          ""
                        )}

                        {service_types["DA"] ? (
                          <GiCartwheel
                            style={serviceIconStyle}
                            title="Driver Accomodation service(s)"
                          />
                        ) : (
                          ""
                        )}

                        {service_types["FT"] ? (
                          <HiOutlineTicket
                            style={serviceIconStyle}
                            title="Ferry Ticket service(s)"
                          />
                        ) : (
                          ""
                        )}

                        {service_types["HP"] ? (
                          <FaHotel
                            style={serviceIconStyle}
                            title="Hotel Porterage service(s)"
                          />
                        ) : (
                          ""
                        )}

                        {service_types["LG"] ? (
                          <SiYourtraveldottv
                            style={serviceIconStyle}
                            title="Local Guide service(s)"
                          />
                        ) : (
                          ""
                        )}

                        {service_types["RST"] ? (
                          <MdRestaurant
                            style={serviceIconStyle}
                            title="Restaurant service(s)"
                          />
                        ) : (
                          ""
                        )}

                        {service_types["SE"] ? (
                          <BiFootball
                            style={serviceIconStyle}
                            title="Sport Event service(s)"
                          />
                        ) : (
                          ""
                        )}

                        {service_types["TE"] ? (
                          <BiTransfer
                            style={serviceIconStyle}
                            title="Teleferik service(s)"
                          />
                        ) : (
                          ""
                        )}

                        {service_types["TH"] ? (
                          <FaTheaterMasks
                            style={serviceIconStyle}
                            title="Theater service(s)"
                          />
                        ) : (
                          ""
                        )}

                        {service_types["TO"] ? (
                          <MdToll
                            style={serviceIconStyle}
                            title="Toll service(s)"
                          />
                        ) : (
                          ""
                        )}

                        {service_types["TL"] ? (
                          <TiGroup
                            style={serviceIconStyle}
                            title="Tour Leader service(s)"
                          />
                        ) : (
                          ""
                        )}

                        {service_types["TLA"] ? (
                          <BiHotel
                            style={serviceIconStyle}
                            title="Tour Leader Accomodation service(s)"
                          />
                        ) : (
                          ""
                        )}

                        {service_types["TLAT"] ? (
                          <MdAirplaneTicket
                            style={serviceIconStyle}
                            title="Tour Leader Air Ticket service(s)"
                          />
                        ) : (
                          ""
                        )}

                        {service_types["TT"] ? (
                          <WiTrain
                            style={serviceIconStyle}
                            title="Train Ticket service(s)"
                          />
                        ) : (
                          ""
                        )}

                        {service_types["TR"] ? (
                          <FaRoute
                            style={serviceIconStyle}
                            title="Transfer service(s)"
                          />
                        ) : (
                          ""
                        )}

                        {service_types["PRM"] ? (
                          <BsKey
                            style={serviceIconStyle}
                            title="Permit service(s)"
                          />
                        ) : (
                          ""
                        )}

                        {service_types["OTH"] ? (
                          <FaSkiing
                            style={serviceIconStyle}
                            title="Other service(s)"
                          />
                        ) : (
                          ""
                        )}
                      </Card.Footer>
                    </Card>

                    <Card>
                      <Card.Header>
                        <GiSteeringWheel
                          style={{
                            color: "#F3702D",
                            fontSize: "1.5em",
                            marginRight: "0.5em",
                          }}
                        />
                        Coach and Drivers Information
                      </Card.Header>
                      <Card.Body>
                        {this.props.coach_info_data.length > 0 ? (
                          <Table striped hover id="coach_and_driver_info_table">
                            <thead>
                              <tr>
                                <th>Period</th>
                                <th>Driver</th>
                                <th>Coach Op.</th>
                                <th>Coach Make</th>
                                <th>Plate Num</th>
                                <th>Seats</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.props.coach_info_data.map((e) => (
                                <tr>
                                  <td>{e["period"]}</td>
                                  <td>
                                    <a
                                      href={
                                        "/data_management/driver/" +
                                        e["driver_id"]
                                      }
                                      basic
                                      id="cell_link"
                                    >
                                      {e["driver"]}
                                    </a>
                                  </td>
                                  <td>
                                    {e["coach_operator_id"] !== null ? (
                                      <a
                                        href={
                                          "/data_management/coach_operator/" +
                                          e["coach_operator_id"]
                                        }
                                        basic
                                        id="cell_link"
                                      >
                                        {e["coach_operator"]}
                                      </a>
                                    ) : (
                                      e["coach_operator"]
                                    )}
                                  </td>
                                  <td>{e["coach_make"]}</td>
                                  <td>{e["coach_plate_num"]}</td>
                                  <td>{e["coach_seats"]}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        ) : (
                          <h6 style={{ textAlign: "center" }}>
                            Nothing to show here
                          </h6>
                        )}
                      </Card.Body>
                      <Card.Footer></Card.Footer>
                    </Card>
                  </Segment>
                </Grid.Column>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <BiBriefcase
                        style={{
                          color: "#F3702D",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      {this.props.group.agent
                        ? "Agent's information"
                        : "Client's information"}
                    </Card.Header>
                    <Card.Body>
                      <div className={"info_descr"}>
                        <MdDriveFileRenameOutline style={overviewIconStyle} />
                        Name :
                      </div>
                      {this.props.group.agent ? (
                        <div className={"info_span"}>
                          {this.props.group.agent
                            ? this.props.group.agent.name
                            : "N/A"}
                        </div>
                      ) : (
                        <div className={"info_span"}>
                          {this.props.group.client
                            ? this.props.group.client.name
                            : "N/A"}
                        </div>
                      )}
                      {this.props.group.agent ? (
                        <ChangeGroupsAgent group={this.props.group} />
                      ) : (
                        <ChangeGroupsClient group={this.props.group} />
                      )}
                      <div className={"info_descr"}>
                        <FaHashtag style={overviewIconStyle} />
                        {this.props.group.agent
                          ? "Agent's Refcode : "
                          : "Client's Refcode : "}
                      </div>
                      <div className={"info_span"}>
                        {this.props.group.agent
                          ? this.props.group.agents_refcode
                            ? this.props.group.agents_refcode
                            : "N/A"
                          : this.props.group.clients_refcode
                          ? this.props.group.clients_refcode
                          : "N/A"}
                      </div>
                      {this.props.group.agent ? (
                        <ChangeAgentRefcode
                          update_state={this.props.update_state}
                          group={this.props.group}
                        />
                      ) : (
                        <ChangeClientRefcode
                          update_state={this.props.update_state}
                          group={this.props.group}
                        />
                      )}
                      <div className={"info_descr"}>
                        <MdOutlineSupportAgent style={overviewIconStyle} />
                        Employee Info :
                      </div>
                      <div className={"info_span"}>
                        {this.props.group.employee_info ? (
                          <TextArea
                            value={this.props.group.employee_info}
                            rows={4}
                            cols={45}
                            disabled
                            className="form-control"
                          />
                        ) : (
                          "N/A"
                        )}
                      </div>
                      <ChangeEmployeeInfo
                        group={this.props.group}
                        update_state={this.props.update_state}
                      />
                    </Card.Body>
                    <Card.Footer>
                      <small className="text-muted">
                        <CgDanger
                          style={{
                            color: "red",
                            fontSize: "1.5em",
                            marginRight: "0.5em",
                          }}
                        />
                        {this.props.group.agent ? (
                          <>
                            Agent's Refcode is related to group, if agent
                            changes, Agent's refcode will remain the same
                          </>
                        ) : (
                          <>
                            Client's Refcode is related to group, if agent
                            changes, Client's refcode will remain the same
                          </>
                        )}
                      </small>
                    </Card.Footer>
                  </Card>
                  <Notes
                    update_notes={this.props.update_notes}
                    object_id={this.props.group.id}
                    object_name={this.props.group.name}
                    object_type={"GroupTransfer"}
                    update_state={this.props.update_state}
                    notes={this.props.group.notes}
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

export default GroupOverView;
