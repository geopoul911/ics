// Built-ins
import React from "react";

import axios from "axios";
import { Grid, Form, Radio, Segment } from "semantic-ui-react";

// CSS
import "react-tabs/style/react-tabs.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Custom Made Components
import AddNewServiceModal from "./modals/add_new_service";
import DeleteAllServices from "./modals/delete_all_services";

// Custom Made Components
import AllServicesTable from "./service_tables/all_services";

// Icons
import {
  BiHotel,
  BiMapPin,
  BiFootball,
  BiTransfer,
  BiRestaurant,
} from "react-icons/bi";
import { BsKey } from "react-icons/bs";
import { MdToll } from "react-icons/md";
import { HiOutlineTicket } from "react-icons/hi";
import { TiGroup } from "react-icons/ti";
import { MdLocalAirport, MdAirplaneTicket } from "react-icons/md";
import { FaHotel, FaTheaterMasks, FaRoute, FaSkiing } from "react-icons/fa";
import { GiTicket, GiShipWheel, GiCartwheel } from "react-icons/gi";
import { SiYourtraveldottv } from "react-icons/si";
import { WiTrain } from "react-icons/wi";
import { AiOutlineBorderlessTable } from "react-icons/ai";
import { GiMagickTrick } from "react-icons/gi";

// Global Variables
import { headers, loader, pageHeader } from "../../../global_vars";

const VIEW_GROUP = "http://localhost:8000/api/groups/group/";

function getRefcode(pathname) {
  return pathname.split("/")[3];
}

let total_services = 0;

class GroupServices extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dates: {},
      showing: "All",
    };
    this.add_service = this.add_service.bind(this);
    this.toggle_amenity_check_box = this.toggle_amenity_check_box.bind(this);
    this.toggle_all_days = this.toggle_all_days.bind(this);
  }

  toggle_amenity_check_box(event) {
    const checked = event.target.checked;
    const date = event.target.name;
    var dates = { ...this.state.dates };
    dates[date] = checked;
    this.setState({ dates: dates });
  }

  toggle_all_days(event) {
    const checked = event.target.checked;
    var dates = { ...this.state.dates };
    this.props.group.group_travelday.map((td) => (dates[td.date] = checked));
    this.setState({ dates: dates });
  }

  change_showing(val) {
    this.setState({
      showing: val,
    });
  }

  add_service() {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_GROUP + getRefcode(window.location.pathname), {
        headers: headers,
      })
      .then((res) => {
        res.data.model.group_travelday.map(
          (e) => (total_services += e.travelday_service.length)
        );
        this.setState({
          group: res.data.model,
          traveldays: res.data.model.group_travelday,
          coach_info_data: res.data.coach_info_data,
          all_group_services: res.data.all_services,
          is_loaded: true,
          dates: {},
        });
      });
  }

  render() {
    let all_group_services = this.props.group.group_travelday.flatMap((td) =>
      td.travelday_service.filter((service) => service)
    );
    return (
      <>
        <div className="rootContainer">
          {pageHeader("group_services", this.props.group.refcode)}
          {this.props.isLoaded ? (
            <>
              <Grid columns={2} divided stackable>
                <Grid.Column width={3} style={{ marginLeft: 10 }}>
                  <Form style={{ padding: 10 }}>
                    <ul>
                      <li>
                        <AiOutlineBorderlessTable
                          style={{
                            fontSize: "1.2em",
                            marginBottom: 5,
                            color:
                              all_group_services.length === 0
                                ? "#6c757d"
                                : "#F3702D",
                            marginRight: 10,
                          }}
                        />
                        <Radio
                          label={"All (" + all_group_services.length + ")"}
                          name="radioGroup"
                          disabled={all_group_services.length === 0}
                          checked={this.state.showing === "All"}
                          onChange={() => this.change_showing("All")}
                        />
                      </li>
                      <li>
                        <BiHotel
                          style={{
                            fontSize: "1.2em",
                            marginBottom: 5,
                            color:
                              all_group_services.filter(
                                (service) => service.service_type === "AC"
                              ).length === 0
                                ? "#6c757d"
                                : "#F3702D",
                            marginRight: 10,
                          }}
                        />
                        <Radio
                          label={
                            "Accommodation (" +
                            all_group_services.filter(
                              (service) => service.service_type === "AC"
                            ).length +
                            ")"
                          }
                          name="radioGroup"
                          checked={this.state.showing === "Accommodation"}
                          disabled={
                            all_group_services.filter(
                              (service) => service.service_type === "AC"
                            ).length === 0
                          }
                          onChange={() => this.change_showing("Accommodation")}
                        />
                      </li>
                      <li>
                        <MdAirplaneTicket
                          style={{
                            fontSize: "1.2em",
                            marginBottom: 5,
                            color:
                              all_group_services.filter(
                                (service) => service.service_type === "AT"
                              ).length === 0
                                ? "#6c757d"
                                : "#F3702D",
                            marginRight: 10,
                          }}
                        />
                        <Radio
                          label={
                            "Air Tickets (" +
                            all_group_services.filter(
                              (service) => service.service_type === "AT"
                            ).length +
                            ")"
                          }
                          name="radioGroup"
                          disabled={
                            all_group_services.filter(
                              (service) => service.service_type === "AT"
                            ).length === 0
                          }
                          checked={this.state.showing === "Air Tickets"}
                          onChange={() => this.change_showing("Air Tickets")}
                        />
                      </li>
                      <li>
                        <MdLocalAirport
                          style={{
                            fontSize: "1.2em",
                            marginBottom: 5,
                            color:
                              all_group_services.filter(
                                (service) => service.service_type === "AP"
                              ).length === 0
                                ? "#6c757d"
                                : "#F3702D",
                            marginRight: 10,
                          }}
                        />
                        <Radio
                          label={
                            "Airport Porterage (" +
                            all_group_services.filter(
                              (service) => service.service_type === "AP"
                            ).length +
                            ")"
                          }
                          name="radioGroup"
                          disabled={
                            all_group_services.filter(
                              (service) => service.service_type === "AP"
                            ).length === 0
                          }
                          checked={this.state.showing === "Airport Porterage"}
                          onChange={() =>
                            this.change_showing("Airport Porterage")
                          }
                        />
                      </li>
                      <li>
                        <GiTicket
                          style={{
                            fontSize: "1.2em",
                            marginBottom: 5,
                            color:
                              all_group_services.filter(
                                (service) => service.service_type === "CFT"
                              ).length === 0
                                ? "#6c757d"
                                : "#F3702D",
                            marginRight: 10,
                          }}
                        />
                        <Radio
                          label={
                            "Coach's Ferry Tickets (" +
                            all_group_services.filter(
                              (service) => service.service_type === "CFT"
                            ).length +
                            ")"
                          }
                          name="radioGroup"
                          disabled={
                            all_group_services.filter(
                              (service) => service.service_type === "CFT"
                            ).length === 0
                          }
                          checked={
                            this.state.showing === "Coach's Ferry Tickets"
                          }
                          onChange={() =>
                            this.change_showing("Coach's Ferry Tickets")
                          }
                        />
                      </li>

                      <li>
                        <GiShipWheel
                          style={{
                            fontSize: "1.2em",
                            marginBottom: 5,
                            color:
                              all_group_services.filter(
                                (service) => service.service_type === "CR"
                              ).length === 0
                                ? "#6c757d"
                                : "#F3702D",
                            marginRight: 10,
                          }}
                        />
                        <Radio
                          label={
                            "Cruises (" +
                            all_group_services.filter(
                              (service) => service.service_type === "CR"
                            ).length +
                            ")"
                          }
                          name="radioGroup"
                          disabled={
                            all_group_services.filter(
                              (service) => service.service_type === "CR"
                            ).length === 0
                          }
                          checked={this.state.showing === "Cruises"}
                          onChange={() => this.change_showing("Cruises")}
                        />
                      </li>
                      <li>
                        <GiCartwheel
                          style={{
                            fontSize: "1.2em",
                            marginBottom: 5,
                            color:
                              all_group_services.filter(
                                (service) => service.service_type === "DA"
                              ).length === 0
                                ? "#6c757d"
                                : "#F3702D",
                            marginRight: 10,
                          }}
                        />
                        <Radio
                          label={
                            "Driver's Accommodation (" +
                            all_group_services.filter(
                              (service) => service.service_type === "DA"
                            ).length +
                            ")"
                          }
                          name="radioGroup"
                          disabled={
                            all_group_services.filter(
                              (service) => service.service_type === "DA"
                            ).length === 0
                          }
                          checked={
                            this.state.showing === "Driver's Accommodation"
                          }
                          onChange={() =>
                            this.change_showing("Driver's Accommodation")
                          }
                        />
                      </li>
                      <li>
                        <HiOutlineTicket
                          style={{
                            fontSize: "1.2em",
                            marginBottom: 5,
                            color:
                              all_group_services.filter(
                                (service) => service.service_type === "FT"
                              ).length === 0
                                ? "#6c757d"
                                : "#F3702D",
                            marginRight: 10,
                          }}
                        />
                        <Radio
                          label={
                            "Ferry Tickets (" +
                            all_group_services.filter(
                              (service) => service.service_type === "FT"
                            ).length +
                            ")"
                          }
                          name="radioGroup"
                          disabled={
                            all_group_services.filter(
                              (service) => service.service_type === "FT"
                            ).length === 0
                          }
                          checked={this.state.showing === "Ferry Tickets"}
                          onChange={() => this.change_showing("Ferry Tickets")}
                        />
                      </li>
                      <li>
                        <FaHotel
                          style={{
                            fontSize: "1.2em",
                            marginBottom: 5,
                            color:
                              all_group_services.filter(
                                (service) => service.service_type === "HP"
                              ).length === 0
                                ? "#6c757d"
                                : "#F3702D",
                            marginRight: 10,
                          }}
                        />
                        <Radio
                          label={
                            "Hotel Porterage (" +
                            all_group_services.filter(
                              (service) => service.service_type === "HP"
                            ).length +
                            ")"
                          }
                          name="radioGroup"
                          disabled={
                            all_group_services.filter(
                              (service) => service.service_type === "HP"
                            ).length === 0
                          }
                          checked={this.state.showing === "Hotel Porterage"}
                          onChange={() =>
                            this.change_showing("Hotel Porterage")
                          }
                        />
                      </li>
                      <li>
                        <SiYourtraveldottv
                          style={{
                            fontSize: "1.2em",
                            marginBottom: 5,
                            color:
                              all_group_services.filter(
                                (service) => service.service_type === "LG"
                              ).length === 0
                                ? "#6c757d"
                                : "#F3702D",
                            marginRight: 10,
                          }}
                        />
                        <Radio
                          label={
                            "Local Guides (" +
                            all_group_services.filter(
                              (service) => service.service_type === "LG"
                            ).length +
                            ")"
                          }
                          name="radioGroup"
                          disabled={
                            all_group_services.filter(
                              (service) => service.service_type === "LG"
                            ).length === 0
                          }
                          checked={this.state.showing === "Local Guides"}
                          onChange={() => this.change_showing("Local Guides")}
                        />
                      </li>
                      <li>
                        <BiRestaurant
                          style={{
                            fontSize: "1.2em",
                            marginBottom: 5,
                            color:
                              all_group_services.filter(
                                (service) => service.service_type === "RST"
                              ).length === 0
                                ? "#6c757d"
                                : "#F3702D",
                            marginRight: 10,
                          }}
                        />
                        <Radio
                          label={
                            "Restaurants (" +
                            all_group_services.filter(
                              (service) => service.service_type === "RST"
                            ).length +
                            ")"
                          }
                          name="radioGroup"
                          disabled={
                            all_group_services.filter(
                              (service) => service.service_type === "RST"
                            ).length === 0
                          }
                          checked={this.state.showing === "Restaurants"}
                          onChange={() => this.change_showing("Restaurants")}
                        />
                      </li>
                      <li>
                        <GiMagickTrick
                          style={{
                            fontSize: "1.2em", marginBottom: 5,
                            color: all_group_services.filter((service) => service.service_type === "SE").length === 0 ? "#6c757d" : "#F3702D",
                            marginRight: 10,
                          }}
                        />
                        <Radio
                          label={
                            "Shows & Entertainment (" +
                            all_group_services.filter(
                              (service) => service.service_type === "ES"
                            ).length +
                            ")"
                          }
                          name="radioGroup"
                          disabled={
                            all_group_services.filter(
                              (service) => service.service_type === "ES"
                            ).length === 0
                          }
                          checked={this.state.showing === "Shows & Entertainment"}
                          onChange={() => this.change_showing("Shows & Entertainment")}
                        />
                      </li>
                      <li>
                        <BiFootball
                          style={{
                            fontSize: "1.2em",
                            marginBottom: 5,
                            color:
                              all_group_services.filter(
                                (service) => service.service_type === "SE"
                              ).length === 0
                                ? "#6c757d"
                                : "#F3702D",
                            marginRight: 10,
                          }}
                        />
                        <Radio
                          label={
                            "Sport Events (" +
                            all_group_services.filter(
                              (service) => service.service_type === "SE"
                            ).length +
                            ")"
                          }
                          name="radioGroup"
                          disabled={
                            all_group_services.filter(
                              (service) => service.service_type === "SE"
                            ).length === 0
                          }
                          checked={this.state.showing === "Sport Events"}
                          onChange={() => this.change_showing("Sport Events")}
                        />
                      </li>
                      <li>
                        <BiMapPin
                          style={{
                            fontSize: "1.2em",
                            marginBottom: 5,
                            color:
                              all_group_services.filter(
                                (service) => service.service_type === "SHT"
                              ).length === 0
                                ? "#6c757d"
                                : "#F3702D",
                            marginRight: 10,
                          }}
                        />
                        <Radio
                          label={
                            "Sightseeing (" +
                            all_group_services.filter(
                              (service) => service.service_type === "SHT"
                            ).length +
                            ")"
                          }
                          name="radioGroup"
                          disabled={
                            all_group_services.filter(
                              (service) => service.service_type === "SHT"
                            ).length === 0
                          }
                          checked={this.state.showing === "Sightseeing"}
                          onChange={() => this.change_showing("Sightseeing")}
                        />
                      </li>
                      <li>
                        <BiTransfer
                          style={{
                            fontSize: "1.2em",
                            marginBottom: 5,
                            color:
                              all_group_services.filter(
                                (service) => service.service_type === "TE"
                              ).length === 0
                                ? "#6c757d"
                                : "#F3702D",
                            marginRight: 10,
                          }}
                        />
                        <Radio
                          label={
                            "Teleferiks (" +
                            all_group_services.filter(
                              (service) => service.service_type === "TE"
                            ).length +
                            ")"
                          }
                          name="radioGroup"
                          disabled={
                            all_group_services.filter(
                              (service) => service.service_type === "TE"
                            ).length === 0
                          }
                          checked={this.state.showing === "Teleferiks"}
                          onChange={() => this.change_showing("Teleferiks")}
                        />
                      </li>
                      <li>
                        <FaTheaterMasks
                          style={{
                            fontSize: "1.2em",
                            marginBottom: 5,
                            color:
                              all_group_services.filter(
                                (service) => service.service_type === "TH"
                              ).length === 0
                                ? "#6c757d"
                                : "#F3702D",
                            marginRight: 10,
                          }}
                        />
                        <Radio
                          label={
                            "Theaters (" +
                            all_group_services.filter(
                              (service) => service.service_type === "TH"
                            ).length +
                            ")"
                          }
                          name="radioGroup"
                          disabled={
                            all_group_services.filter(
                              (service) => service.service_type === "TH"
                            ).length === 0
                          }
                          checked={this.state.showing === "Theaters"}
                          onChange={() => this.change_showing("Theaters")}
                        />
                      </li>
                      <li>
                        <MdToll
                          style={{
                            fontSize: "1.2em",
                            marginBottom: 5,
                            color:
                              all_group_services.filter(
                                (service) => service.service_type === "TO"
                              ).length === 0
                                ? "#6c757d"
                                : "#F3702D",
                            marginRight: 10,
                          }}
                        />
                        <Radio
                          label={
                            "Tolls (" +
                            all_group_services.filter(
                              (service) => service.service_type === "TO"
                            ).length +
                            ")"
                          }
                          name="radioGroup"
                          disabled={
                            all_group_services.filter(
                              (service) => service.service_type === "TO"
                            ).length === 0
                          }
                          checked={this.state.showing === "Tolls"}
                          onChange={() => this.change_showing("Tolls")}
                        />
                      </li>
                      <li>
                        <TiGroup
                          style={{
                            fontSize: "1.2em",
                            marginBottom: 5,
                            color:
                              all_group_services.filter(
                                (service) => service.service_type === "TL"
                              ).length === 0
                                ? "#6c757d"
                                : "#F3702D",
                            marginRight: 10,
                          }}
                        />
                        <Radio
                          label={
                            "Tour Leaders (" +
                            all_group_services.filter(
                              (service) => service.service_type === "TL"
                            ).length +
                            ")"
                          }
                          name="radioGroup"
                          disabled={
                            all_group_services.filter(
                              (service) => service.service_type === "TL"
                            ).length === 0
                          }
                          checked={this.state.showing === "Tour Leaders"}
                          onChange={() => this.change_showing("Tour Leaders")}
                        />
                      </li>
                      <li>
                        <BiHotel
                          style={{
                            fontSize: "1.2em",
                            marginBottom: 5,
                            color:
                              all_group_services.filter(
                                (service) => service.service_type === "TLA"
                              ).length === 0
                                ? "#6c757d"
                                : "#F3702D",
                            marginRight: 10,
                          }}
                        />
                        <Radio
                          label={
                            "Tour Leader's Accommodation (" +
                            all_group_services.filter(
                              (service) => service.service_type === "TLA"
                            ).length +
                            ")"
                          }
                          name="radioGroup"
                          disabled={
                            all_group_services.filter(
                              (service) => service.service_type === "TLA"
                            ).length === 0
                          }
                          checked={
                            this.state.showing === "Tour Leader's Accommodation"
                          }
                          onChange={() =>
                            this.change_showing("Tour Leader's Accommodation")
                          }
                        />
                      </li>
                      <li>
                        <MdAirplaneTicket
                          style={{
                            fontSize: "1.2em",
                            marginBottom: 5,
                            color:
                              all_group_services.filter(
                                (service) => service.service_type === "TLAT"
                              ).length === 0
                                ? "#6c757d"
                                : "#F3702D",
                            marginRight: 10,
                          }}
                        />
                        <Radio
                          label={
                            "Tour Leader's Air Tickets (" +
                            all_group_services.filter(
                              (service) => service.service_type === "TLAT"
                            ).length +
                            ")"
                          }
                          name="radioGroup"
                          disabled={
                            all_group_services.filter(
                              (service) => service.service_type === "TLAT"
                            ).length === 0
                          }
                          checked={
                            this.state.showing === "Tour Leader's Air Tickets"
                          }
                          onChange={() =>
                            this.change_showing("Tour Leader's Air Tickets")
                          }
                        />
                      </li>
                      <li>
                        <WiTrain
                          style={{
                            fontSize: "1.2em",
                            marginBottom: 5,
                            color:
                              all_group_services.filter(
                                (service) => service.service_type === "TT"
                              ).length === 0
                                ? "#6c757d"
                                : "#F3702D",
                            marginRight: 10,
                          }}
                        />
                        <Radio
                          label={
                            "Train Tickets (" +
                            all_group_services.filter(
                              (service) => service.service_type === "TT"
                            ).length +
                            ")"
                          }
                          name="radioGroup"
                          disabled={
                            all_group_services.filter(
                              (service) => service.service_type === "TT"
                            ).length === 0
                          }
                          checked={this.state.showing === "Train Tickets"}
                          onChange={() => this.change_showing("Train Tickets")}
                        />
                      </li>
                      <li>
                        <FaRoute
                          style={{
                            fontSize: "1.2em",
                            marginBottom: 5,
                            color:
                              all_group_services.filter(
                                (service) => service.service_type === "TR"
                              ).length === 0
                                ? "#6c757d"
                                : "#F3702D",
                            marginRight: 10,
                          }}
                        />
                        <Radio
                          label={
                            "Transfers (" +
                            all_group_services.filter(
                              (service) => service.service_type === "TR"
                            ).length +
                            ")"
                          }
                          name="radioGroup"
                          disabled={
                            all_group_services.filter(
                              (service) => service.service_type === "TR"
                            ).length === 0
                          }
                          checked={this.state.showing === "Transfers"}
                          onChange={() => this.change_showing("Transfers")}
                        />
                      </li>
                      <li>
                        <BsKey
                          style={{
                            fontSize: "1.2em",
                            marginBottom: 5,
                            color:
                              all_group_services.filter(
                                (service) => service.service_type === "PRM"
                              ).length === 0
                                ? "#6c757d"
                                : "#F3702D",
                            marginRight: 10,
                          }}
                        />
                        <Radio
                          label={
                            "Permits (" +
                            all_group_services.filter(
                              (service) => service.service_type === "PRM"
                            ).length +
                            ")"
                          }
                          name="radioGroup"
                          disabled={
                            all_group_services.filter(
                              (service) => service.service_type === "PRM"
                            ).length === 0
                          }
                          checked={this.state.showing === "Permits"}
                          onChange={() => this.change_showing("Permits")}
                        />
                      </li>
                      <li>
                        <FaSkiing
                          style={{
                            fontSize: "1.2em",
                            marginBottom: 5,
                            color:
                              all_group_services.filter(
                                (service) => service.service_type === "OTH"
                              ).length === 0
                                ? "#6c757d"
                                : "#F3702D",
                            marginRight: 10,
                          }}
                        />
                        <Radio
                          label={
                            "Other Services (" +
                            all_group_services.filter(
                              (service) => service.service_type === "OTH"
                            ).length +
                            ")"
                          }
                          name="radioGroup"
                          disabled={
                            all_group_services.filter(
                              (service) => service.service_type === "OTH"
                            ).length === 0
                          }
                          checked={this.state.showing === "Other Services"}
                          onChange={() => this.change_showing("Other Services")}
                        />
                      </li>
                    </ul>
                  </Form>
                </Grid.Column>
                <Grid.Column width={12}>
                  <Segment>
                    <AllServicesTable
                      data={all_group_services}
                      update_state={this.props.update_state}
                      filter={this.state.showing}
                      group={this.props.group}
                      is_loaded={this.props.isLoaded}
                      refcode={this.props.group.refcode}
                    />
                    {this.props.group.group_travelday.length > 0 ? (
                      <>
                        <AddNewServiceModal
                          update_state={this.props.update_state}
                          is_loaded={this.props.isLoaded}
                          group={this.props.group}
                          dates={this.state.dates}
                          toggle_amenity_check_box={
                            this.toggle_amenity_check_box
                          }
                          toggle_all_days={this.toggle_all_days}
                        />
                        <DeleteAllServices
                          update_state={this.props.update_state}
                          is_loaded={this.props.isLoaded}
                          group={this.props.group}
                        />
                      </>
                    ) : (
                      <div
                        style={{
                          color: "red",
                          margin: 20,
                          width: "100%",
                          textAlign: "center",
                        }}
                      >
                        In order to create a service, add traveldays at group's
                        schedule first.
                      </div>
                    )}
                  </Segment>
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

export default GroupServices;
