// Built-ins
import React from "react";

// Modules / Functions
import { Menu, Grid } from "semantic-ui-react";

// Icons / Images
import { HiDocumentSearch } from "react-icons/hi";
import { TiGroupOutline } from "react-icons/ti";
import { BiBriefcase, BiMailSend } from "react-icons/bi";
import { GiSteeringWheel } from "react-icons/gi";
import { MdSupportAgent, MdLocalAirport } from "react-icons/md";
import { FaHotel, FaCity, FaSuitcaseRolling } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";
import { BsFillPinMapFill } from "react-icons/bs";

import DatepickerRange from "../../../images/dox/datepicker_range.png";
import SelectAgent from "../../../images/dox/select_agent.png";
import SelectClient from "../../../images/dox/select_client.png";
import SelectLeader from "../../../images/dox/select_leader.png";
import SelectCoachOperator from "../../../images/dox/select_coach_operator.png";
import SelectDriver from "../../../images/dox/select_driver.png";
import SelectHotel from "../../../images/dox/select_hotel.png";
import CalendarExample from "../../../images/dox/calendar_example.png";
import BarGraphSampleAgent from "../../../images/dox/bar_graph_sample_agent.png";
import ColorsExpiringDox from "../../../images/dox/colors_expiring_dox.png";
import ShowEmptyKMTable from "../../../images/dox/show_empty_km_table.png";
import EmptyKMTableNoDistances from "../../../images/dox/empty_km_table_no_distances.png";
import HotelScheduleTabTableHeaders from "../../../images/dox/hotel_schedule_tab_table_headers.png";
import ReportsUserInfoTab from "../../../images/dox/reports_user_info_tab.png";
import SelectUser from "../../../images/dox/select_user.png";
import EmptyKMTableWithDistances from "../../../images/dox/empty_km_table_with_distances.png";
import ReportsUserActionsTableHeaders from "../../../images/dox/reports_user_actions_table_headers.png";
import ReportsUserPermissions from "../../../images/dox/reports_user_permissions.png";
import ReportsUserPermissionsTable from "../../../images/dox/reports_user_permissions_table.png";
import CityLoc from "../../../images/dox/city_loc.png";
import ShowNearbyModal from "../../../images/dox/show_nearby_modal.png";
import ShowNearbyHotelsResult from "../../../images/dox/show_nearby_hotels_result.png";
import SendMassMailHotels from "../../../images/dox/send_mass_mail_hotels.png";
import RepairShopsCityMap from "../../../images/dox/repair_shops_city_map.png";
import CoachOperatorsCityMap from "../../../images/dox/coach_operators_city_map.png";

// Variables
let icon_style = { color: "#93ab3c", fontSize: "1.7em", margin: 10 };

const General = () => {
  return (
    <>
      <h1 className="dox_h1">General Info</h1>
      <hr />
      <span>
        <p>
          Reports is the place where you can view statistics related to each
          object's page.
        </p>
        <p>They has the following data objects: </p>
        <ul>
          <li>
            <BiBriefcase style={icon_style} /> Agents
          </li>
          <li>
            <MdLocalAirport style={icon_style} /> Airports
          </li>
          <li>
            <FaCity style={icon_style} /> City Groups
          </li>
          <li>
            <FaSuitcaseRolling style={icon_style} /> Clients
          </li>
          <li>
            <MdSupportAgent style={icon_style} /> Coach Operators
          </li>
          <li>
            <GiSteeringWheel style={icon_style} /> Drivers
          </li>
          <li>
            <HiDocumentSearch style={icon_style} /> Expiring Documents
          </li>
          <li>
            <TiGroupOutline style={icon_style} /> Group Leaders
          </li>
          <li>
            <FaHotel style={icon_style} /> Hotels
          </li>
          <li>
            <BsFillPinMapFill style={icon_style} /> Maps
          </li>
          <li>
            <BiMailSend style={icon_style} /> Sent Emails
          </li>
          <li>
            <AiOutlineUser style={icon_style} /> Users
          </li>
        </ul>
      </span>
      <hr />
    </>
  );
};

const Agents = () => {
  return (
    <>
      <div className="paper_dox">
        <h1 className="dox_h1">Agent Reports</h1>
        <hr />
        <h3 className="dox_h3">General</h3>
        <span>
          <p>Agent Reports displays agents and data related to groups.</p>
          <p>
            to see the reports, first you have to select the period you would
            like to see using the datepicker
          </p>
          <p>
            For example, to see the reports for April 2022 , see the example
            below:
          </p>
          <img src={DatepickerRange} alt="" className="dox_responsive_img" />
          <br />
          <p>
            After selecting the period, you have to select a specific agent to
            see his results.
          </p>
          <p>
            Select the agent using the autocomplete dropdown list in the middle
            of the page:
          </p>
          <img src={SelectAgent} alt="" className="dox_responsive_img" />
          <p>
            After selecting an agent and the period, click on the show results
            button.
          </p>
          <p>Reports shows 4 tabs: </p>
          <ul style={{ listStyle: "circle" }}>
            <li>Calendar</li>
            <li>Information</li>
            <li>All Agents Statistics</li>
            <li>Comparison to other agents for this period</li>
          </ul>
        </span>
        <hr />
        <h3 className="dox_h3">Calendar</h3>
        <span>
          <p>
            If there are results for the selected period of the agent, a
            calendar will appear with the groups the agent attended.
          </p>
          <img src={CalendarExample} alt="" className="dox_responsive_img" />
          <p>Red boxes indicate days which the agent didn't have any group</p>
          <p>
            Green boxes indicate days which the agent had groups, inside the box
            the group's refcode is displayed.
          </p>
        </span>
        <hr />

        <h3 className="dox_h3">Information</h3>
        <span>
          <p> Information tab shows: </p>
          <ul style={{ listStyle: "circle" }}>
            <li>1) Total groups</li>
            <li>2) Total number of people</li>
            <li>3) People per group</li>
            <li>4) Datatable with details for each group</li>
          </ul>
        </span>
        <hr />

        <h3 className="dox_h3">All agent statistics</h3>
        <span>
          <p> All agent statistics tab shows: </p>
          <ul style={{ listStyle: "circle" }}>
            <li>1) Total groups</li>
            <li>2) Total number of people</li>
            <li>3) People per group</li>
          </ul>
        </span>
        <hr />

        <h3 className="dox_h3">Comparison to other agents for this period</h3>
        <span>
          <p>Contains a bar graph with the agents having at least one group </p>
          <p>
            This component also allows the user to download the statistics as
            SVG, PNG or CSV clicking the sandwich button on the top right
          </p>
          <p>Bar graph example: </p>
          <img
            src={BarGraphSampleAgent}
            alt=""
            className="dox_responsive_img"
          />
        </span>
        <hr />
      </div>
    </>
  );
};

const Airports = () => {
  return (
    <>
      <div className="paper_dox">
        <h1 className="dox_h1">Airport Reports</h1>
        <hr />
        <h3 className="dox_h3">General</h3>
        <span>
          <p>
            Airport reports displays data related to airports for a selected
            period of time.
          </p>
          <p>
            to see the reports,you only have to select the period you would like
            to see using the datepicker
          </p>
          <p>
            For example, to see the reports for April 2022 , see the example
            below:
          </p>
          <img src={DatepickerRange} alt="" className="dox_responsive_img" />
          <p>
            Then, you haver to click the show results button in the middle of
            the page
          </p>
          <p>Reports shows 4 tabs: </p>
          <ul style={{ listStyle: "circle" }}>
            <li>Total number of groups</li>
            <li>Total number of arrival flights</li>
            <li>Total number of departure flights.</li>
          </ul>
        </span>
        <hr />
      </div>
    </>
  );
};

const CityGroups = () => {
  return (
    <>
      <div className="paper_dox">
        <h1 className="dox_h1">City Reports</h1>
        <hr />
        <h3 className="dox_h3">General</h3>
        <span>
          <p>
            City Reports displays data for a city in a selected period of time.
          </p>
          <p>
            to see the reports, first you have to select the period you would
            like to see using the datepicker
          </p>
          <p>
            For example, to see the reports for April 2022 , see the example
            below:
          </p>
          <img src={DatepickerRange} alt="" className="dox_responsive_img" />
          <br />
          <p>
            After selecting the period, you have to select a specific city to
            see its results.
          </p>
          <p>
            Select the city using the autocomplete dropdown list in the middle
            of the page
          </p>
          <p>
            After selecting the city and the period, click on the show results
            button.
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">Calendar</h3>
        <span>
          <p>
            If there are results for the selected period of the city, a calendar
            will appear with the groups that have been to the selected city.
          </p>
          <img src={CalendarExample} alt="" className="dox_responsive_img" />
          <p>Red boxes indicate days which the city didn't have any group</p>
          <p>
            Green boxes indicate days which the city had groups, inside the box
            the group's refcode is displayed.
          </p>
        </span>
        <hr />
      </div>
    </>
  );
};

const Clients = () => {
  return (
    <>
      <div className="paper_dox">
        <h1 className="dox_h1">Client Reports</h1>
        <hr />
        <h3 className="dox_h3">General</h3>
        <span>
          <p>Client reports is similar to Agent reports.</p>
          <p>It displays clients and data related to groups.</p>
          <p>
            to see the reports, first you have to select the period you would
            like to see using the datepicker
          </p>
          <p>
            For example, to see the reports for April 2022 , see the example
            below:
          </p>
          <img src={DatepickerRange} alt="" className="dox_responsive_img" />
          <br />
          <p>
            After selecting the period, you have to select a specific client to
            see his results.
          </p>
          <p>
            Select the client using the autocomplete dropdown list in the middle
            of the page:
          </p>
          <img src={SelectClient} alt="" className="dox_responsive_img" />
          <p>
            After selecting an client and the period, click on the show results
            button.
          </p>
          <p>Reports shows 4 tabs: </p>
          <ul style={{ listStyle: "circle" }}>
            <li>Calendar</li>
            <li>Information</li>
            <li>All Agents Statistics</li>
            <li>Comparison to other clients for this period</li>
          </ul>
        </span>
        <hr />
        <h3 className="dox_h3">Calendar</h3>
        <span>
          <p>
            If there are results for the selected period of the client, a
            calendar will appear with the groups the client attended.
          </p>
          <img src={CalendarExample} alt="" className="dox_responsive_img" />
          <p>Red boxes indicate days which the client didn't have any group</p>
          <p>
            Green boxes indicate days which the client had groups, inside the
            box the group's refcode is displayed.
          </p>
        </span>
        <hr />

        <h3 className="dox_h3">Information</h3>
        <span>
          <p> Information tab shows: </p>
          <ul style={{ listStyle: "circle" }}>
            <li>1) Total groups</li>
            <li>2) Total number of people</li>
            <li>3) People per group</li>
            <li>4) Datatable with details for each group</li>
          </ul>
        </span>
        <hr />

        <h3 className="dox_h3">All client statistics</h3>
        <span>
          <p> All client statistics tab shows: </p>
          <ul style={{ listStyle: "circle" }}>
            <li>1) Total groups</li>
            <li>2) Total number of people</li>
            <li>3) People per group</li>
          </ul>
        </span>
        <hr />

        <h3 className="dox_h3">Comparison to other clients for this period</h3>
        <span>
          <p>Contains a bar graph with the agents having at least one group </p>
          <p>
            This component also allows the user to download the statistics as
            SVG, PNG or CSV clicking the sandwich button on the top right
          </p>
        </span>
        <hr />
      </div>
    </>
  );
};

const CoachOperators = () => {
  return (
    <>
      <div className="paper_dox">
        <h1 className="dox_h1">Coach Operator Reports</h1>
        <hr />
        <h3 className="dox_h3">General</h3>
        <span>
          <p>
            Coach Operator Reports displays coach operators and data related to
            groups.
          </p>
          <p>
            to see the reports, first you have to select the period you would
            like to see using the datepicker
          </p>
          <p>
            For example, to see the reports for April 2022 , see the example
            below:
          </p>
          <img src={DatepickerRange} alt="" className="dox_responsive_img" />
          <br />
          <p>
            After selecting the period, you have to select a specific coach
            operator to see his results.
          </p>
          <p>
            Select the coach operator using the autocomplete dropdown list in
            the middle of the page:
          </p>
          <img
            src={SelectCoachOperator}
            alt=""
            className="dox_responsive_img"
          />
          <p>
            After selecting an coach operator and the period, click on the show
            results button.
          </p>
          <p>Reports shows 3 tabs: </p>
          <ul style={{ listStyle: "circle" }}>
            <li>Information</li>
            <li>All Coach Operators Statistics</li>
            <li>Comparison to other coach operators for this period</li>
          </ul>
        </span>
        <hr />
        <h3 className="dox_h3">Information</h3>
        <span>
          <p> Information tab shows: </p>
          <ul style={{ listStyle: "circle" }}>
            <li>1) Total groups</li>
            <li>2) Total number of people</li>
            <li>3) People per group</li>
            <li>4) Datatable with details for each group</li>
            <li>5) Empty KM table.</li>
            <p>
              Empty KM table calculates the kilometers the driver did, without a
              group.
            </p>
            <p>
              To see the data table with the details, click on the accordion
              which will appear of the middle of the page.
            </p>
            <p style={{ color: "red" }}>
              If the driver had no groups for 90 days, empty KM will be
              calculated.
            </p>
            <img src={ShowEmptyKMTable} alt="" className="dox_responsive_img" />
            <p style={{ color: "red" }}>
              You have to enter the distance from each airport, to get a full
              report.
            </p>
            <p>Example of table without distances set: </p>
            <img
              src={EmptyKMTableNoDistances}
              alt=""
              className="dox_responsive_img"
            />
            <p>Example of table with distances set: </p>
            <img
              src={EmptyKMTableWithDistances}
              alt=""
              className="dox_responsive_img"
            />
          </ul>
        </span>
        <hr />

        <h3 className="dox_h3">All coach operator statistics</h3>
        <span>
          <p> All coach operator statistics tab shows: </p>
          <ul style={{ listStyle: "circle" }}>
            <li>1) Total groups</li>
            <li>2) Total number of people</li>
            <li>3) People per group</li>
          </ul>
        </span>
        <hr />

        <h3 className="dox_h3">
          Comparison to other coach operators for this period
        </h3>
        <span>
          <p>
            Contains a bar graph with the coach operators having at least one
            group
          </p>
          <p>
            This component also allows the user to download the statistics as
            SVG, PNG or CSV clicking the sandwich button on the top right
          </p>
        </span>
        <hr />
      </div>
    </>
  );
};

const Drivers = () => {
  return (
    <>
      <div className="paper_dox">
        <h1 className="dox_h1">Driver Reports</h1>
        <hr />
        <h3 className="dox_h3">General</h3>
        <span>
          <p>Driver Reports displays drivers and data related to groups.</p>
          <p>
            to see the reports, first you have to select the period you would
            like to see using the datepicker
          </p>
          <p>
            For example, to see the reports for April 2022 , see the example
            below:
          </p>
          <img src={DatepickerRange} alt="" className="dox_responsive_img" />
          <br />
          <p>
            After selecting the period, you have to select a specific driver to
            see his results.
          </p>
          <p>
            Select the driver using the autocomplete dropdown list in the middle
            of the page:
          </p>
          <img src={SelectDriver} alt="" className="dox_responsive_img" />
          <p>
            After selecting an driver and the period, click on the show results
            button.
          </p>
          <p>Reports shows 4 tabs: </p>
          <ul style={{ listStyle: "circle" }}>
            <li>Calendar</li>
            <li>Information</li>
            <li>All Agents Statistics</li>
            <li>Comparison to other agents for this period</li>
          </ul>
        </span>
        <hr />
        <h3 className="dox_h3">Calendar</h3>
        <span>
          <p>
            If there are results for the selected period of the driver, a
            calendar will appear with the groups the driver attended.
          </p>
          <img src={CalendarExample} alt="" className="dox_responsive_img" />
          <p>Red boxes indicate days which the driver didn't have any group</p>
          <p>
            Green boxes indicate days which the driver had groups, inside the
            box the group's refcode is displayed.
          </p>
        </span>
        <hr />

        <h3 className="dox_h3">Information</h3>
        <span>
          <p> Information tab shows: </p>
          <ul style={{ listStyle: "circle" }}>
            <li>1) Total groups</li>
            <li>2) Total number of people</li>
            <li>3) People per group</li>
            <li>4) Datatable with details for each group</li>
          </ul>
        </span>
        <hr />

        <h3 className="dox_h3">All driver statistics</h3>
        <span>
          <p> All driver statistics tab shows: </p>
          <ul style={{ listStyle: "circle" }}>
            <li>1) Total groups</li>
            <li>2) Total number of people</li>
            <li>3) People per group</li>
          </ul>
        </span>
        <hr />

        <h3 className="dox_h3">Comparison to other drivers for this period</h3>
        <span>
          <p>Contains a bar graph with the drivers having at least one group</p>
          <p>
            This component also allows the user to download the statistics as
            SVG, PNG or CSV clicking the sandwich button on the top right
          </p>
        </span>
        <hr />
      </div>
    </>
  );
};

const ExpiringDocuments = () => {
  return (
    <>
      <div className="paper_dox">
        <h1 className="dox_h1">Expiring Documents</h1>
        <hr />
        <h3 className="dox_h3">General</h3>
        <span>
          <p>
            Expiring Documents reports page contains a data table with the
            following columns:
          </p>
          <br />
          <b>Colors: </b>
          <br />
          <p style={{ color: "red" }}>
            If the row's color is red, that means that the document has expired.
          </p>
          <p style={{ color: "orange" }}>
            If the row's color is yellow, that means that the document is
            expiring in less than 30 days.
          </p>
          <p style={{ color: "green" }}>
            If the row's color is green, that means that the document is
            expiring in 30 days or more.
          </p>
          <p>
            Example: ( Screenshot was made at 16/05/2022 and entries inserted
            are for testing purposes only)
          </p>
          <img src={ColorsExpiringDox} alt="" className="dox_responsive_img" />
        </span>
        <hr />
        <h3 className="dox_h3">Data table</h3>
        <br />
        <span>
          <ul style={{ listStyle: "square", marginLeft: 40 }}>
            <li>
              <p>1) File name</p>
            </li>
            <p>File's name as uploaded by the user</p>
            <li>
              <p>2) Type</p>
            </li>
            <p>File's type, more details: </p>
            <p>
              <b>Driver:</b>
            </p>
            <ul style={{ listStyle: "disc", marginLeft: 40 }}>
              <li>Driver's License</li>
              <li>Tachograph Card</li>
              <li>Passport</li>
              <li>Identification Card</li>
            </ul>
            <p>
              <b>Coach:</b>
            </p>
            <ul style={{ listStyle: "disc", marginLeft: 40 }}>
              <li>Vehicle technical control (KTEO)</li>
              <li>Vehicle insurance</li>
              <li>Lease contract</li>
              <li>Vehicle registration</li>
              <li>Tachograph documents</li>
              <li>EU community passenger transport license</li>
            </ul>
            <li>
              <p>3) Exp. Date</p>
            </li>
            <p>File's expiration date</p>
            <li>
              <p>4) Driver / Coach</p>
            </li>
            <p>This column shows if the entry regards to a driver or a coach</p>
            <li>
              <p>5) Name</p>
            </li>
            <p> Driver or Coach's name</p>
            <li>
              <p>6) Last updated</p>
            </li>
            <li>
              <p>7) File Size</p>
            </li>
            <hr />
          </ul>
        </span>
        <hr />
      </div>
    </>
  );
};

const GroupLeaders = () => {
  return (
    <>
      <div className="paper_dox">
        <h1 className="dox_h1">Leader Reports</h1>
        <hr />
        <h3 className="dox_h3">General</h3>
        <span>
          <p>Leader Reports displays leaders and data related to groups.</p>
          <p>
            to see the reports, first you have to select the period you would
            like to see using the datepicker
          </p>
          <p>
            For example, to see the reports for April 2022 , see the example
            below:
          </p>
          <img src={DatepickerRange} alt="" className="dox_responsive_img" />
          <br />
          <p>
            After selecting the period, you have to select a specific leader to
            see his results.
          </p>
          <p>
            Select the leader using the autocomplete dropdown list in the middle
            of the page:
          </p>
          <img src={SelectLeader} alt="" className="dox_responsive_img" />
          <p>
            After selecting an leader and the period, click on the show results
            button.
          </p>
          <p>Reports shows 4 tabs: </p>
          <ul style={{ listStyle: "circle" }}>
            <li>Calendar</li>
            <li>Information</li>
            <li>All Leaders Statistics</li>
            <li>Comparison to other leaders for this period</li>
          </ul>
        </span>
        <hr />
        <h3 className="dox_h3">Calendar</h3>
        <span>
          <p>
            If there are results for the selected period of the leader, a
            calendar will appear with the groups the leader attended.
          </p>
          <img src={CalendarExample} alt="" className="dox_responsive_img" />
          <p>Red boxes indicate days which the leader didn't have any group</p>
          <p>
            Green boxes indicate days which the leader had groups, inside the
            box the group's refcode is displayed.
          </p>
        </span>
        <hr />

        <h3 className="dox_h3">Information</h3>
        <span>
          <p> Information tab shows: </p>
          <ul style={{ listStyle: "circle" }}>
            <li>1) Total groups</li>
            <li>2) Total number of people</li>
            <li>3) People per group</li>
            <li>4) Datatable with details for each group</li>
          </ul>
        </span>
        <hr />

        <h3 className="dox_h3">All leader statistics</h3>
        <span>
          <p> All leader statistics tab shows: </p>
          <ul style={{ listStyle: "circle" }}>
            <li>1) Total groups</li>
            <li>2) Total number of people</li>
            <li>3) People per group</li>
          </ul>
        </span>
        <hr />

        <h3 className="dox_h3">Comparison to other leaders for this period</h3>
        <span>
          <p>Contains a bar graph with the leaders having at least one group</p>
          <p>
            This component also allows the user to download the statistics as
            SVG, PNG or CSV clicking the sandwich button on the top right
          </p>
        </span>
        <hr />
      </div>
    </>
  );
};

const Hotels = () => {
  return (
    <>
      <div className="paper_dox">
        <h1 className="dox_h1">Hotel Reports</h1>
        <hr />
        <h3 className="dox_h3">General ( Statistics Tab )</h3>
        <span>
          <p>Hotel Reports displays hotels and data related to groups.</p>
          <p>
            to see the reports, first you have to select the period you would
            like to see using the datepicker
          </p>
          <p>
            For example, to see the reports for April 2022 , see the example
            below:
          </p>
          <img src={DatepickerRange} alt="" className="dox_responsive_img" />
          <br />
          <p>
            After selecting the period, you have to select a specific hotel to
            see his results.
          </p>
          <p>
            Select the hotel using the autocomplete dropdown list in the middle
            of the page:
          </p>
          <img src={SelectHotel} alt="" className="dox_responsive_img" />
          <p>
            After selecting an hotel and the period, click on the show results
            button.
          </p>
          <p>Reports shows 5 tabs: </p>
          <ul style={{ listStyle: "circle" }}>
            <li>Information</li>
            <li>All Hotels Statistics</li>
            <li>Comparison to other hotels for this period</li>
            <li>Stats by city</li>
            <li>Stats by country</li>
          </ul>
        </span>
        <hr />
        <h3 className="dox_h3">Information</h3>
        <span>
          <p> Information tab shows: </p>
          <ul style={{ listStyle: "circle" }}>
            <li>1) Total groups</li>
            <li>2) Total number of people</li>
            <li>3) People per group</li>
            <li>4) Datatable with details for each group</li>
          </ul>
        </span>
        <hr />

        <h3 className="dox_h3">All hotel statistics</h3>
        <span>
          <p> All hotel statistics tab shows: </p>
          <ul style={{ listStyle: "circle" }}>
            <li>1) Total groups</li>
            <li>2) Total number of people</li>
            <li>3) People per group</li>
          </ul>
        </span>
        <hr />

        <h3 className="dox_h3">Comparison to other hotels for this period</h3>
        <span>
          <p>Contains a bar graph with the hotels having at least one group </p>
          <p>
            This component also allows the user to download the statistics as
            SVG, PNG or CSV clicking the sandwich button on the top right
          </p>
        </span>
        <hr />

        <h3 className="dox_h3">Stats by city</h3>
        <span>
          <p>
            Contains a bar graph with the hotels having at least one group per
            city
          </p>
          <p>
            This component also allows the user to download the statistics as
            SVG, PNG or CSV clicking the sandwich button on the top right
          </p>
        </span>
        <hr />

        <h3 className="dox_h3">Stats by country</h3>
        <span>
          <p>
            Contains a bar graph with the hotels having at least one group per
            country
          </p>
          <p>
            This component also allows the user to download the statistics as
            SVG, PNG or CSV clicking the sandwich button on the top right
          </p>
        </span>
        <hr />

        <h3 className="dox_h3">Schedule tab</h3>
        <span>
          <p>Schedule tab includes a data table with the following columns: </p>
          <img
            src={HotelScheduleTabTableHeaders}
            alt=""
            className="dox_responsive_img"
          />
        </span>
        <hr />
      </div>
    </>
  );
};

const Maps = () => {
  return (
    <>
      <div className="paper_dox">
        <h1 className="dox_h1">Reports City Map</h1>
        <hr />
        <h3 className="dox_h3">City</h3>
        <span>
          <p>
            City Map Reports displays a map with values inserted in group plan's
            data management.
          </p>
          <p>Lat/Lng is needed to properly show the entries on the map.</p>
          <p>
            to see the reports you either need to fill select city, select all
            cities of a country, or specify lat/lng
          </p>
          <p>
            For example, if we select Paris at the first drop down and click
            show results, an orange pin with the location of Paris will appear
            on the map:
          </p>
          <img src={CityLoc} alt="" className="dox_responsive_img" />
          <p>
            by hovering over the pin, we can see city's name, country, locality,
            district and landmark.
          </p>
          <p> by left clicking the pin, a modal with 4 options will appear:</p>
          <img src={ShowNearbyModal} alt="" className="dox_responsive_img" />
          <p>
            This modal is used to show nearby entries, based on a distance
            radius with a kilometer range.
          </p>
          <p>Range's minimum value is 0 and maximum value is 200</p>
          <p>
            Example of showing all hotels with a 10 kilometer distance around
            the center of Paris:
          </p>
          <img
            src={ShowNearbyHotelsResult}
            alt=""
            className="dox_responsive_img"
          />
          <p>
            By hovering to each hotel, we can see the hotel's name, email and
            tel. number.
          </p>
          <p>
            Group Plan also gives us the option to send an email to all the
            hotels included into the results.
          </p>
          <p>We can do this by clicking the Send Massive Email button</p>
          <p>
            After we click this button, a modal with the following values will
            appear:
          </p>
          <img src={SendMassMailHotels} alt="" className="dox_responsive_img" />
          <br />
        </span>
        <hr />
        <h3 className="dox_h3">Repair Shops</h3>
        <span>
          <p>In this page, we can see repair shops in the map.</p>
          <p>
            The user can filter by repair shop types, or Show every repair shop
            in a city or country
          </p>
          <p>
            By hovering over the repair shop icon we can see the shop's details
          </p>
          <p>Example of Electrician typed repair shops in Greece:</p>
          <img src={RepairShopsCityMap} alt="" className="dox_responsive_img" />
        </span>
        <hr />
        <h3 className="dox_h3">Coach Operators</h3>
        <span>
          <p>In this page, we can see coach operators in the map.</p>
          <p>
            The user can filter by local and non local coach operators, or Show
            every repair shop in a city or country
          </p>
          <p>By hovering over the coach operator icon we can see his details</p>
          <p>Example of all coach operators in France:</p>
          <img
            src={CoachOperatorsCityMap}
            alt=""
            className="dox_responsive_img"
          />
        </span>
      </div>
    </>
  );
};

const SentEmails = () => {
  return (
    <>
      <p style={{ color: "red" }}>
        Sent Emails page is about to be developed, therefore it redirects to
        under construction page.
      </p>
    </>
  );
};

const Users = () => {
  return (
    <>
      <div className="paper_dox">
        <h1 className="dox_h1">User Reports</h1>
        <hr />
        <h3 className="dox_h3">General</h3>
        <span>
          <p>
            to see the reports, first you have to select the period you would
            like to see using the datepicker
          </p>
          <p>
            For example, to see the reports for April 2022 , see the example
            below:
          </p>
          <img src={DatepickerRange} alt="" className="dox_responsive_img" />
          <br />
          <p>
            After selecting the period, you have to select a specific user to
            see his results.
          </p>
          <p>
            Select the user using the autocomplete dropdown list in the middle
            of the page:
          </p>
          <img src={SelectUser} alt="" className="dox_responsive_img" />
          <p>
            After selecting a user and the period, click on the show results
            button.
          </p>
          <p>User Reports is constructed by three tabs:</p>
          <ul>
            <li>Information</li>
            <li>Actions/Logs</li>
            <li>Object Based Permissions</li>
          </ul>
        </span>
        <hr />
        <h3 className="dox_h3">Information</h3>
        <span>
          <p>User information example: </p>
          <img src={ReportsUserInfoTab} alt="" className="dox_responsive_img" />
        </span>
        <hr />

        <h3 className="dox_h3">Actions / Logs</h3>
        <span>
          <p>Actions / Logs include a data table with the following columns:</p>
          <img
            src={ReportsUserActionsTableHeaders}
            alt=""
            className="dox_responsive_img"
          />
          <br />
          <p>
            At this table, we can see what interactions a user had with entries
            in the database.
          </p>
        </span>
        <hr />

        <h3 className="dox_h3">Object based permissions</h3>
        <span>
          <p>
            At this page, we can see what permissions each user has, by clicking
            each button from the ones below:
          </p>
          <img
            src={ReportsUserPermissions}
            alt=""
            className="dox_responsive_img"
          />
          <p>
            After clicking a button, a data table will appear like the
            following:
          </p>
          <img
            src={ReportsUserPermissionsTable}
            alt=""
            className="dox_responsive_img"
          />
        </span>
        <hr />
      </div>
    </>
  );
};

class Reports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupActive: "General",
    };
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleGroupItemClick = this.handleGroupItemClick.bind(this);
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  handleGroupItemClick = (e, { name }) => this.setState({ groupActive: name });

  render() {
    return (
      <>
        <Grid.Column width={2}>
          <Menu pointing vertical>
            <Menu.Item
              name="General"
              active={this.state.groupActive === "General"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="Agents"
              active={this.state.groupActive === "Agents"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="Airports"
              active={this.state.groupActive === "Airports"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="City Groups"
              active={this.state.groupActive === "City Groups"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="Clients"
              active={this.state.groupActive === "Clients"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="Coach Operators"
              active={this.state.groupActive === "Coach Operators"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="Drivers"
              active={this.state.groupActive === "Drivers"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="Expiring Documents"
              active={this.state.groupActive === "Expiring Documents"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="Group Leaders"
              active={this.state.groupActive === "Group Leaders"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="Hotels"
              active={this.state.groupActive === "Hotels"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="Maps"
              active={this.state.groupActive === "Maps"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="Sent Emails"
              active={this.state.groupActive === "Sent Emails"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="Users"
              active={this.state.groupActive === "Users"}
              onClick={this.handleGroupItemClick}
            />
          </Menu>
        </Grid.Column>

        <Grid.Column style={{ marginLeft: 10, width: "70%" }}>
          {this.state.groupActive === "General" ? <General /> : ""}
          {this.state.groupActive === "Agents" ? <Agents /> : ""}
          {this.state.groupActive === "Airports" ? <Airports /> : ""}
          {this.state.groupActive === "City Groups" ? <CityGroups /> : ""}
          {this.state.groupActive === "Clients" ? <Clients /> : ""}
          {this.state.groupActive === "Coach Operators" ? (
            <CoachOperators />
          ) : (
            ""
          )}
          {this.state.groupActive === "Drivers" ? <Drivers /> : ""}
          {this.state.groupActive === "Expiring Documents" ? (
            <ExpiringDocuments />
          ) : (
            ""
          )}
          {this.state.groupActive === "Group Leaders" ? <GroupLeaders /> : ""}
          {this.state.groupActive === "Hotels" ? <Hotels /> : ""}
          {this.state.groupActive === "Maps" ? <Maps /> : ""}
          {this.state.groupActive === "Sent Emails" ? <SentEmails /> : ""}
          {this.state.groupActive === "Users" ? <Users /> : ""}
        </Grid.Column>
      </>
    );
  }
}

export default Reports;
