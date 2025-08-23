// Built-ins
import React from "react";

// Modules / Functions
import { Menu, Grid } from "semantic-ui-react";

// Icons / Images
import { AiOutlineSetting } from "react-icons/ai";
import { TiGroupOutline } from "react-icons/ti";
import { BiBriefcase, BiFootball } from "react-icons/bi";
import { BiRestaurant } from "react-icons/bi";
import { RiGuideLine } from "react-icons/ri";
import { WiTrain } from "react-icons/wi";
import { TiGroup } from "react-icons/ti";
import { SiChinasouthernairlines } from "react-icons/si";
import {
  GiSteeringWheel,
  GiBus,
  GiEarthAmerica,
  GiBattleship,
  GiShipWheel,
} from "react-icons/gi";
import { MdSupportAgent, MdLocalAirport } from "react-icons/md";
import { FaTint } from "react-icons/fa";
import {
  FaHotel,
  FaCity,
  FaSuitcaseRolling,
  FaMapMarkedAlt,
} from "react-icons/fa";
import { FaScrewdriver } from "react-icons/fa";
import { BiAnchor, BiTransfer } from "react-icons/bi";
import { FaTheaterMasks } from "react-icons/fa";

import AllAgentsDatatable from "../../../images/dox/all_agents_datatable.png";
import AddNewAgentDM from "../../../images/dox/add_new_agent_dm.png";
import DelNewAgentDM from "../../../images/dox/del_new_agent_dm.png";
import RestaurantInfoCardSample from "../../../images/dox/restaurant_info_card_sample.png";
import DMAgentsTableHeaders from "../../../images/dox/dm_agents_table_headers.png";
import FlagCodeDM from "../../../images/dox/flag_code_dm.png";
import AddNoteBtn from "../../../images/dox/add_note_btn.png";
import NoteSample from "../../../images/dox/note_sample.png";
import GalleryTab from "../../../images/dox/gallery_tab.png";
import GallerySample from "../../../images/dox/gallery_sample.png";
import SampleMapDM from "../../../images/dox/sample_map_dm.png";
import AllAirlinesDatatableHeaders from "../../../images/dox/all_airlines_datatable_headers.png";
import AllAirportsDatatableHeaders from "../../../images/dox/all_airports_datatable_headers.png";
import AllAttractionsDatatableHeaders from "../../../images/dox/all_attractions_datatable_headers.png";
import AllClientsDatatableHeaders from "../../../images/dox/all_clients_datatable_headers.png";
import AllCoachOperatorsDatatableHeaders from "../../../images/dox/all_coach_operators_datatable_headers.png";
import CoachDatatableHeaders from "../../../images/dox/coach_datatable_headers.png";
import ReportsNotification from "../../../images/dox/reports_notification.png";
import AllCruisingCompaniesTableHeaders from "../../../images/dox/all_cruising_companies_table_headers.png";
import AllDriversTableHeaders from "../../../images/dox/all_drivers_table_headers.png";
import GroupLeadersTableHeaders from "../../../images/dox/group_leaders_table_headers.png";
import AllGuidesTableHeaders from "../../../images/dox/all_guides_table_headers.png";
import AllHotelsTableHeaders from "../../../images/dox/all_hotels_table_headers.png";
import AlPlacesTableHeaders from "../../../images/dox/all_places_table_headers.png";
import AlPortsTableHeaders from "../../../images/dox/port_table_headers.png";
import RepairShopsTableHeaders from "../../../images/dox/repair_shops_table_headers.png";
import RepairTypesTableHeaders from "../../../images/dox/repair_type_table_headers.png";
import AllServicessTableHeaders from "../../../images/dox/all_services_table_headers.png";
import TimeFieldDropDown from "../../../images/dox/time_field_drop_down.png";
import AllTheatersTableHeaders from "../../../images/dox/all_theaters_table_headers.png";
import AllTrainTicketAgenciesCompaniesTableHeaders from "../../../images/dox/all_train_ticket_agencies_table_headers.png";

// Variables
let icon_style = { color: "#93ab3c", fontSize: "1.7em", margin: 10 };

const General = () => {
  return (
    <>
      <h1 className="dox_h1">General Info</h1>
      <hr />
      <h3 className="dox_h3">What is Data Management?</h3>
      <hr />
      <span>
        <p>
          Data management is the place where you can view, update, insert, and
          delete values about data entered in group plan.
        </p>
        <p>It has the following data objects: </p>
        <ul style={{ columns: 5 }} id="dm_dox_menu">
          <li>
            <BiBriefcase style={icon_style} /> Agents
          </li>
          <li>
            <SiChinasouthernairlines style={icon_style} /> Airlines
          </li>
          <li>
            <MdLocalAirport style={icon_style} /> Airports
          </li>
          <li>
            <FaMapMarkedAlt style={icon_style} /> Attractions
          </li>
          <li>
            <FaSuitcaseRolling style={icon_style} /> Clients
          </li>
          <li>
            <MdSupportAgent style={icon_style} /> Coach Operators
          </li>
          <li>
            <GiBus style={icon_style} /> Coaches
          </li>
          <li>
            <GiShipWheel style={icon_style} /> Cruising Companies
          </li>
          <li>
            <GiSteeringWheel style={icon_style} /> Drivers
          </li>
          <li>
            <GiEarthAmerica style={icon_style} /> DMCs
          </li>
          <li>
            <TiGroupOutline style={icon_style} /> Group Leaders
          </li>
          <li>
            <RiGuideLine style={icon_style} /> Guides
          </li>
          <li>
            <FaHotel style={icon_style} /> Hotels
          </li>
          <li>
            <FaCity style={icon_style} /> Places
          </li>
          <li>
            <BiAnchor style={icon_style} /> Ports
          </li>
          <li>
            <FaScrewdriver style={icon_style} /> Repair shops
          </li>
          <li>
            <FaTint style={icon_style} /> Repair types
          </li>
          <li>
            <BiRestaurant style={icon_style} /> Restaurants
          </li>
          <li>
            <AiOutlineSetting style={icon_style} /> Services
          </li>
          <li>
            <GiBattleship style={icon_style} /> Ferry Ticket Agencies
          </li>
          <li>
            <BiTransfer style={icon_style} /> Teleferik Companies
          </li>
          <li>
            <FaTheaterMasks style={icon_style} /> Theaters
          </li>
          <li>
            <TiGroup style={icon_style} /> Tour Leaders
          </li>
          <li>
            <WiTrain style={icon_style} /> Train Ticket Agencies
          </li>
          <li>
            <BiFootball style={icon_style} /> Sport Event Suppliers
          </li>
        </ul>
      </span>
      <hr />
      <h3 className="dox_h3">View</h3>
      <br />
      <span>
        <p>
          To view entries in data management, click on the selected object you
          want to view, then you will be redirected to a page containing a data
          table with all the selected object's values.
        </p>
        <p>
          For example, if we want to view all agents in group plan, we navigate
          to Data Management/Agents
        </p>
        <img src={AllAgentsDatatable} alt="" className="dox_responsive_img" />
        <br />
        <br />
        <p>
          Cells containing the name of the object, are linked to the object's
          overview page.
        </p>
        <p>
          So in the example we see, if we want to see ELINA TOURS overview page,
          we need to click on the name of the entry.
        </p>
      </span>
      <hr />
      <h3 className="dox_h3">Insert</h3>
      <br />
      <span>
        <p>
          To add entries in data management, click on the create new button on
          the bottom left of the all agents page.
        </p>
        <p>
          Each object has different required fields and validators to be filled,
          which will be discussed separately on each of the object's
          documentation page on the left menu.
        </p>
        <img src={AddNewAgentDM} alt="" className="dox_responsive_img" />
        <br />
        <br />
        <p>
          Once the object is successfully created, Group plan will redirect you
          to its overview page.
        </p>
        <br />
        <b style={{ color: "red" }}>
          All of the inputs in the modal are required.
        </b>
      </span>
      <hr />
      <h3 className="dox_h3">Delete</h3>
      <br />
      <span>
        <p>
          To delete an entry in group plan, you need to navigate to object's
          overview page and press the delete object button on the information
          card's footer
        </p>
        <img src={DelNewAgentDM} alt="" className="dox_responsive_img" />
        <p style={{ color: "red" }}>
          <b>
            Group Plan has a custom made safety mechanism in order to prevent
            data loss. This mechanism will not allow you to delete Entries
            linked to other entries.
          </b>
        </p>
        <p style={{ color: "red" }}>
          <b>
            For example, we cannot delete a restaurant which is used in at least
            one service of a group or an offer.
          </b>
        </p>
        <br />
        <br />
      </span>
      <hr />
      <h3 className="dox_h3">Update</h3>
      <br />
      <span>
        <p>
          To update an entry in group plan, you need to navigate to object's
          overview page and click on the pencil icons next to the entries.
        </p>
        <p>
          Each object has different required fields and validators to be filled,
          which will be discussed separately on each of the object's
          documentation page on the left menu.
        </p>
        <img
          src={RestaurantInfoCardSample}
          alt=""
          className="dox_responsive_img"
        />
        <br />
      </span>
      <hr />
    </>
  );
};

const Notes = () => {
  return (
    <>
      <h3 className="dox_h3">Notes</h3>
      <hr />
      <span>
        <p>
          Notes card contains the notes with useful information not mentioned
          anywhere else in the page.
        </p>
        <p>Example: ONLY BUS</p>
        <p>Card's footer contains the Add Note button. </p>
        <img src={AddNoteBtn} alt="" className="dox_responsive_img" />
        <p>Modal only contains a textarea for the note.</p>
        <p>
          Once the note has been created,it will appear in the card's body in a
          form of sticker
        </p>
        <p>
          Sticker Contains the note's creator username, date created and the
          text.
        </p>
        <p>Note Sample: </p>
        <img src={NoteSample} alt="" className="dox_responsive_img" />
      </span>
      <hr />
      <h3 className="dox_h3">Objects having notes</h3>
      <hr />
      <span>
        <ul
          style={{ listStyle: "square", marginLeft: 40, columns: 5 }}
          id="dm_dox_menu"
        >
          <li>
            <BiBriefcase style={icon_style} /> Agents
          </li>
          <li>
            <FaMapMarkedAlt style={icon_style} /> Attractions
          </li>
          <li>
            <FaSuitcaseRolling style={icon_style} /> Clients
          </li>
          <li>
            <MdSupportAgent style={icon_style} /> Coach Operators
          </li>
          <li>
            <GiBus style={icon_style} /> Coaches
          </li>
          <li>
            <GiSteeringWheel style={icon_style} /> Drivers
          </li>
          <li>
            <TiGroupOutline style={icon_style} /> Group Leaders
          </li>
          <li>
            <RiGuideLine style={icon_style} /> Guides
          </li>
          <li>
            <FaHotel style={icon_style} /> Hotels
          </li>
          <li>
            <FaScrewdriver style={icon_style} /> Repair shops
          </li>
          <li>
            <BiRestaurant style={icon_style} /> Restaurants
          </li>
          <li>
            <FaTheaterMasks style={icon_style} /> Theaters
          </li>
          <li>
            <TiGroup style={icon_style} /> Tour Leaders
          </li>
          <li>
            <BiFootball style={icon_style} /> Sport Event Suppliers
          </li>
        </ul>
      </span>
    </>
  );
};

const Maps = () => {
  return (
    <>
      <h3 className="dox_h3">Maps</h3>
      <hr />
      <span>
        <p>Map card contains a google map showing the entry's location.</p>
        <p>This is based on the lat / lng entries in overview</p>
        <p>Example:</p>
        <img src={SampleMapDM} alt="" className="dox_responsive_img" />
      </span>
      <hr />
      <h3 className="dox_h3">Objects having Maps</h3>
      <hr />
      <span>
        <ul
          style={{ listStyle: "square", marginLeft: 40, columns: 5 }}
          id="dm_dox_menu"
        >
          <li>
            <MdLocalAirport style={icon_style} />
            Airports
          </li>
          <li>
            <FaMapMarkedAlt style={icon_style} />
            Attractions
          </li>
          <li>
            <MdSupportAgent style={icon_style} />
            Coach Operators
          </li>
          <li>
            <GiShipWheel style={icon_style} />
            Cruising Companies
          </li>
          <li>
            <GiSteeringWheel style={icon_style} />
            Drivers
          </li>
          <li>
            <GiEarthAmerica style={icon_style} />
            DMCs
          </li>
          <li>
            <FaHotel style={icon_style} />
            Hotels
          </li>
          <li>
            <FaCity style={icon_style} />
            Places
          </li>
          <li>
            <BiAnchor style={icon_style} />
            Ports
          </li>
          <li>
            <FaScrewdriver style={icon_style} />
            Repair shops
          </li>
          <li>
            <BiRestaurant style={icon_style} />
            Restaurants
          </li>
          <li>
            <GiBattleship style={icon_style} />
            Ferry Ticket Agencies
          </li>
          <li>
            <BiTransfer style={icon_style} />
            Teleferik Companies
          </li>
          <li>
            <FaTheaterMasks style={icon_style} />
            Theaters
          </li>
          <li>
            <WiTrain style={icon_style} />
            Train Ticket Agencies
          </li>
          <li>
            <BiFootball style={icon_style} />
            Sport Event Suppliers
          </li>
        </ul>
      </span>
    </>
  );
};

const Gallery = () => {
  return (
    <>
      <h3 className="dox_h3">Gallery</h3>
      <hr />
      <span>
        <p>Gallery Page contains images for entries.</p>
        <p>
          You can find gallery next to overview tab on top of the entry's page.
        </p>
        <img src={GalleryTab} alt="" className="dox_responsive_img" />
        <p>
          In the gallery page you will find a card, containing the entry's
          images with a description on top.
        </p>
        <p>
          And a button which changes the image's description, and a button which
          deletes the image.
        </p>
        <img src={GallerySample} alt="" className="dox_responsive_img" />
        <p>
          To add an image, click the Upload new image button on the bottom of
          the page.
        </p>
      </span>
      <hr />
      <h3 className="dox_h3">Objects having a gallery</h3>
      <hr />
      <span>
        <ul
          style={{ listStyle: "square", marginLeft: 40, columns: 5 }}
          id="dm_dox_menu"
        >
          <li>
            <BiBriefcase style={icon_style} /> Agents
          </li>
          <li>
            <FaMapMarkedAlt style={icon_style} /> Attractions
          </li>
          <li>
            <FaSuitcaseRolling style={icon_style} /> Clients
          </li>
          <li>
            <MdSupportAgent style={icon_style} /> Coach Operators
          </li>
          <li>
            <GiBus style={icon_style} /> Coaches
          </li>
          <li>
            <GiSteeringWheel style={icon_style} /> Drivers
          </li>
          <li>
            <TiGroupOutline style={icon_style} /> Group Leaders
          </li>
          <li>
            <RiGuideLine style={icon_style} /> Guides
          </li>
          <li>
            <FaHotel style={icon_style} /> Hotels
          </li>
          <li>
            <BiRestaurant style={icon_style} /> Restaurants
          </li>
          <li>
            <FaTheaterMasks style={icon_style} /> Theaters
          </li>
          <li>
            <TiGroup style={icon_style} /> Tour Leaders
          </li>
          <li>
            <BiFootball style={icon_style} /> Sport Event Suppliers
          </li>
        </ul>
      </span>
    </>
  );
};

const Agents = () => {
  return (
    <>
      <h3 className="dox_h3"> Data table </h3>
      <hr />
      <span>
        <p>Data table has the following columns: </p>
        <img src={DMAgentsTableHeaders} alt="" className="dox_responsive_img" />
      </span>
      <hr />
      <h3 className="dox_h3">Agent fields and validators</h3>
      <hr />
      <span>
        <p>Information card has the following entries:</p>
        <ul style={{ listStyle: "square", marginLeft: 40 }}>
          <li>Name</li>
          <br />
          <p>
            Name is a free text field and it can only be composed by
            alphabetical characters and these three special characters ( . - & )
          </p>
          <p>Name's max length cannot exceed 50 characters</p>
          <li>Address</li>
          <p>
            Address is a free text field and it can only be composed by any
            alphabetical characters
          </p>
          <p>Address's max length cannot exceed 100 characters</p>
          <li>Tel Details</li>
          <p>Tel details has 4 fields: </p>
          <ul style={{ listStyle: "disk", marginLeft: 40 }}>
            <li>Tel</li>
            <li>Tel2</li>
            <li>Tel3</li>
          </ul>
          <p>
            On the left of each input, there is a flag. Selecting a flag will
            fix the number's country code.
          </p>
          <img src={FlagCodeDM} alt="" className="dox_responsive_img" />
          <p>
            After selecting the country, you need to fill the input field. It
            only accepts digits.
          </p>
          <p>This field's length cannot exceed 20 characters.</p>
          <p>Only Tel (1) field is required</p>
          <li>Email</li>
          <p>Email can be used to send information from group plan.</p>
          <p>
            This field needs to have at least one @ and its length cannot exceed
            50 characters.
          </p>
          <li>Icon</li>
          <p>Icon cannot be changed at the moment.</p>
          <p>It is used to distinguish agents on map objects.</p>
          <li>Abbreviation</li>
          <p>Abbreviation is a free text code.</p>
          <p>
            If an agent is inserted into a group, Agent's abbreviation is
            inserted into the group's refcode.
          </p>
          <p>
            Abbreviation input field automatically capitalizes characters and
            has a maximum length of three
          </p>
          <li>Country</li>
          <p>
            This input field contains an autocomplete dropdown list with all
            available countries.
          </p>
          <li>Enabled</li>
          <p>
            This input field contains a two option dropdown list with "enabled"
            and "disabled" values
          </p>
          <p style={{ color: "red" }}>
            Disabled agents will not be accessed through group plan for any use.
          </p>
        </ul>
      </span>
      <hr />
    </>
  );
};

const Airlines = () => {
  return (
    <>
      <h3 className="dox_h3">Data table</h3>
      <hr />
      <span>
        <p>Data table has the following columns: </p>
        <img
          src={AllAirlinesDatatableHeaders}
          alt=""
          className="dox_responsive_img"
        />
      </span>
      <hr />
      <h3 className="dox_h3">Airline fields and validators</h3>
      <hr />
      <span>
        <p>Information card has the following entries:</p>
        <ul style={{ listStyle: "square", marginLeft: 40 }}>
          <li>Name</li>
          <br />
          <p>
            Name is a free text field and it can only be composed by
            alphabetical characters and these three special characters ( . - & )
          </p>
          <p>Name's max length cannot exceed 50 characters</p>
          <li>Abbreviation</li>
          <p>
            Abbreviation is a free text code with a max length of 2 Characters.
          </p>
          <p>Abbreviation is automatically inserted on the flight's code.</p>
          <p>
            Characters inserted in this field are automatically capitalized.
          </p>
          <li>Enabled</li>
          <p>
            This input field contains a two option dropdown list with "enabled"
            and "disabled" values
          </p>
          <p style={{ color: "red" }}>
            Disabled airlines will not be accessed through group plan for any
            use.
          </p>
        </ul>
      </span>
      <hr />
    </>
  );
};

const Airports = () => {
  return (
    <>
      <h3 className="dox_h3">Data table</h3>
      <hr />
      <span>
        <p>Data table has the following columns: </p>
        <img
          src={AllAirportsDatatableHeaders}
          alt=""
          className="dox_responsive_img"
        />
      </span>
      <hr />
      <h3 className="dox_h3">Airport fields and validators</h3>
      <hr />
      <span>
        <p>Information card has the following entries:</p>
        <ul style={{ listStyle: "square", marginLeft: 40 }}>
          <li>Name</li>
          <br />
          <p>
            Name is a free text field and it can only be composed by
            alphabetical characters.
          </p>
          <p>Name's max length cannot exceed 3 characters</p>
          <li>Location</li>
          <p>Location is a free text field.</p>
          <p style={{ color: "red" }}>
            -90 to 90 for latitude and -180 to 180 for longitude.
          </p>
          <li>Lat / Lng</li>
          <p>
            Lat Lng field are two inputs indicating the location on the map.
          </p>
          <li>Enabled</li>
          <p>
            This input field contains a two option dropdown list with "enabled"
            and "disabled" values
          </p>
          <p style={{ color: "red" }}>
            Disabled airlines will not be accessed through group plan for any
            use.
          </p>
        </ul>
      </span>
      <hr />
    </>
  );
};

const Attractions = () => {
  return (
    <>
      <h3 className="dox_h3">Data table</h3>
      <hr />
      <span>
        <p>Data table has the following columns: </p>
        <img
          src={AllAttractionsDatatableHeaders}
          alt=""
          className="dox_responsive_img"
        />
      </span>
      <hr />
      <h3 className="dox_h3">Attraction fields and validators</h3>
      <hr />
      <span>
        <p>Information card has the following entries:</p>
        <ul style={{ listStyle: "square", marginLeft: 40 }}>
          <li>Name</li>
          <br />
          <p>
            Name is a free text field and it can only be composed by
            alphabetical characters.
          </p>
          <p>Name's max length cannot exceed 50 characters</p>
          <li>Place</li>
          <p>
            Place is composed by an autocomplete drop down list containing all
            the available places inserted into Group Plan.
          </p>
          <li>Lat / Lng</li>
          <p>
            Lat Lng field are two inputs indicating the location on the map.
          </p>
        </ul>
      </span>
    </>
  );
};

const Clients = () => {
  return (
    <>
      <h3 className="dox_h3">Data table</h3>
      <hr />
      <span>
        <p>Data table has the following columns: </p>
        <img
          src={AllClientsDatatableHeaders}
          alt=""
          className="dox_responsive_img"
        />
      </span>
      <hr />
      <h3 className="dox_h3">Client fields and validators</h3>
      <hr />
      <span>
        <p>Information card has the following entries:</p>
        <ul style={{ listStyle: "square", marginLeft: 40 }}>
          <li>Name</li>
          <br />
          <p>
            Name is a free text field and it can only be composed by
            alphabetical characters and these three special characters ( . - & )
          </p>
          <p>Name's max length cannot exceed 50 characters</p>
          <li>Address</li>
          <p>
            Address is a free text field and it can only be composed by any
            alphabetical characters
          </p>
          <p>Name's max length cannot exceed 100 characters</p>
          <li>Tel Details</li>
          <p>Tel details has 4 fields: </p>
          <ul style={{ listStyle: "disk", marginLeft: 40 }}>
            <li>Tel</li>
            <li>Tel2</li>
            <li>Tel3</li>
          </ul>
          <p>
            On the left of each input, there is a flag. Selecting a flag will
            fix the number's country code.
          </p>
          <img src={FlagCodeDM} alt="" className="dox_responsive_img" />
          <p>
            After selecting the country, you need to fill the input field. It
            only accepts digits.
          </p>
          <p>This field's length cannot exceed 20 characters.</p>
          <p>Only Tel (1) field is required</p>
          <li>Email</li>
          <p>Email can be used to send information from group plan.</p>
          <p>
            This field needs to have at least one @ and its length cannot exceed
            50 characters.
          </p>
          <li>Abbreviation</li>
          <p>Abbreviation is a free text code.</p>
          <p>
            If an client is inserted into a group, Client's abbreviation is
            inserted into the group's refcode.
          </p>
          <p>
            Abbreviation input field automatically capitalizes characters and
            has a maximum length of three
          </p>
          <li>Nationality</li>
          <p>
            This input field contains an autocomplete dropdown list with all
            available countries.
          </p>
          <li>Enabled</li>
          <p>
            This input field contains a two option dropdown list with "enabled"
            and "disabled" values
          </p>
          <p style={{ color: "red" }}>
            Disabled clients will not be accessed through group plan for any
            use.
          </p>
        </ul>
      </span>
      <hr />
    </>
  );
};

const CoachOperators = () => {
  return (
    <>
      <h3 className="dox_h3">Data table</h3>
      <hr />
      <span>
        <p>Data table has the following columns: </p>
        <img
          src={AllCoachOperatorsDatatableHeaders}
          alt=""
          className="dox_responsive_img"
        />
      </span>
      <hr />
      <h3 className="dox_h3">Coach Operator fields and validators</h3>
      <hr />
      <span>
        <p>Information card has the following entries:</p>
        <ul style={{ listStyle: "square", marginLeft: 40 }}>
          <li>Name</li>
          <br />
          <p>
            Name is a free text field and it can only be composed by
            alphabetical characters and these three special characters ( . - & )
          </p>
          <p>Name's max length cannot exceed 50 characters</p>
          <li>Place</li>
          <p>
            Place is composed by an autocomplete drop down list containing all
            the available places inserted into Group Plan.
          </p>
          <li>Address</li>
          <p>
            Address is a free text field and it can only be composed by any
            alphabetical characters
          </p>
          <p>Name's max length cannot exceed 100 characters</p>
          <li>Tel Details</li>
          <p>Tel details has 4 fields: </p>
          <ul style={{ listStyle: "disk", marginLeft: 40 }}>
            <li>Tel</li>
            <li>Tel2</li>
            <li>Tel3</li>
          </ul>
          <p>
            On the left of each input, there is a flag. Selecting a flag will
            fix the number's country code.
          </p>
          <img src={FlagCodeDM} alt="" className="dox_responsive_img" />
          <p>
            After selecting the country, you need to fill the input field. It
            only accepts digits.
          </p>
          <p>This field's length cannot exceed 20 characters.</p>
          <p>Only Tel (1) field is required</p>
          <li>Email</li>
          <p>Email can be used to send information from group plan.</p>
          <p>
            This field needs to have at least one @ and its length cannot exceed
            50 characters.
          </p>
          <li>Website</li>
          <p>This field's input cannot exceed 50 characters.</p>
          <li>Lat / Lng</li>
          <p>
            Lat Lng field are two inputs indicating the location on the map.
          </p>
          <li>Enabled</li>
          <p>
            This input field contains a two option dropdown list with "enabled"
            and "disabled" values
          </p>
          <p style={{ color: "red" }}>
            Disabled clients will not be accessed through group plan for any
            use.
          </p>
        </ul>
      </span>
    </>
  );
};

const Coaches = () => {
  return (
    <>
      <h3 className="dox_h3">Data table</h3>
      <hr />
      <span>
        <p>Data table has the following columns: </p>
        <img
          src={CoachDatatableHeaders}
          alt=""
          className="dox_responsive_img"
        />
      </span>
      <hr />
      <h3 className="dox_h3">Coachfields and validators</h3>
      <hr />
      <span>
        <p>Information card has the following entries:</p>
        <ul style={{ listStyle: "square", marginLeft: 40 }}>
          <li>Make</li>
          <br />
          <p>
            Make is a free text field and it can only be composed by
            alphabetical characters and these three special characters ( . - & )
          </p>
          <p>Make's max length cannot exceed 50 characters</p>
          <li>Body Number</li>
          <br />
          <p>Body Number is a free text field.</p>
          <p>Make's max length cannot exceed 50 characters</p>
          <li>Plate Number</li>
          <br />
          <p>Plate Number is a free text field.</p>
          <p>Make's max length cannot exceed 50 characters</p>
          <li>Number of seats</li>
          <br />
          <p>Plate Number is a numerical field.</p>
          <li>Emission</li>
          <br />
          <p>Emission has a drop down list with the following values: </p>
          <ul style={{ listStyle: "square", marginLeft: 40 }}>
            <li>N/A</li>
            <li>EURO 3</li>
            <li>EURO 4</li>
            <li>EURO 5</li>
            <li>EURO 6</li>
            <li>EURO 7</li>
          </ul>
          <li>Year</li>
          <br />
          <p>
            Year has a drop down list with options of each year from 2000 until
            today.
          </p>
          <li>Enabled</li>
          <p>
            This input field contains a two option dropdown list with "enabled"
            and "disabled" values
          </p>
          <p style={{ color: "red" }}>
            Disabled clients will not be accessed through group plan for any
            use.
          </p>
          <li> Coach Operator </li>
          <p> Coach Operator's value cannot be changed.</p>
          <br />
        </ul>
      </span>
      <h3 className="dox_h3">Coach's Documents</h3>
      <hr />
      <span>
        <p>In this card, a user can upload documents related to the coach.</p>
        <p>Document types:</p>
        <ul style={{ listStyle: "square", marginLeft: 40 }}>
          <li>Vehicle technical control (KTEO)</li>
          <li>Vehicle insurance</li>
          <li>Lease contract</li>
          <li>Vehicle registration</li>
          <li>Tachograph documents</li>
          <li>EU community passenger transport license</li>
        </ul>
        <p style={{ color: "red" }}>
          Each document must have an expiration date set to it.
        </p>
        <p style={{ color: "red" }}>
          Expired documents will be displayed a notifications at the reports tab
          until they are deleted or updated.
        </p>
        <img src={ReportsNotification} alt="" className="dox_responsive_img" />
      </span>
      <hr />
    </>
  );
};

const CruisingCompanies = () => {
  return (
    <>
      <h3 className="dox_h3">Data table</h3>
      <hr />
      <span>
        <p>Data table has the following columns: </p>
        <img
          src={AllCruisingCompaniesTableHeaders}
          alt=""
          className="dox_responsive_img"
        />
      </span>
      <hr />
      <h3 className="dox_h3">Cruising Company fields and validators</h3>
      <hr />
      <span>
        <p>Information card has the following entries:</p>
        <ul style={{ listStyle: "square", marginLeft: 40 }}>
          <li>Name</li>
          <br />
          <p>
            Name is a free text field and it can only be composed by
            alphabetical characters and these three special characters ( . - & )
          </p>
          <p>Name's max length cannot exceed 50 characters</p>
          <li>Address</li>
          <p>
            Address is a free text field and it can only be composed by any
            alphabetical characters
          </p>
          <p>Address's max length cannot exceed 100 characters</p>
          <li>Tel Details</li>
          <p>Tel details has 4 fields: </p>
          <ul style={{ listStyle: "disk", marginLeft: 40 }}>
            <li>Tel</li>
            <li>Tel2</li>
            <li>Tel3</li>
          </ul>
          <p>
            On the left of each input, there is a flag. Selecting a flag will
            fix the number's country code.
          </p>
          <img src={FlagCodeDM} alt="" className="dox_responsive_img" />
          <p>
            After selecting the country, you need to fill the input field. It
            only accepts digits.
          </p>
          <p>This field's length cannot exceed 20 characters.</p>
          <p>Only Tel (1) field is required</p>
          <li>Email</li>
          <p>Email can be used to send information from group plan.</p>
          <p>
            This field needs to have at least one @ and its length cannot exceed
            50 characters.
          </p>
          <li>Website</li>
          <p>This field's input cannot exceed 50 characters.</p>
          <li>Lat / Lng</li>
          <p>
            Lat Lng field are two inputs indicating the location on the map.
          </p>
          <li>Enabled</li>
          <p>
            This input field contains a two option dropdown list with "enabled"
            and "disabled" values
          </p>
          <p style={{ color: "red" }}>
            Disabled cruising companies will not be accessed through group plan
            for any use.
          </p>
        </ul>
      </span>
      <hr />
    </>
  );
};

const Drivers = () => {
  return (
    <>
      <h3 className="dox_h3">Data table</h3>
      <hr />
      <span>
        <p>Data table has the following columns: </p>
        <img
          src={AllDriversTableHeaders}
          alt=""
          className="dox_responsive_img"
        />
      </span>
      <hr />
      <h3 className="dox_h3">Driver fields and validators</h3>
      <hr />
      <span>
        <p>Information card has the following entries:</p>
        <ul style={{ listStyle: "square", marginLeft: 40 }}>
          <li>Name</li>
          <br />
          <p>
            Name is a free text field and it can only be composed by
            alphabetical characters and these three special characters ( . - & )
          </p>
          <p>Name's max length cannot exceed 50 characters</p>
          <li>Address</li>
          <p>
            Address is a free text field and it can only be composed by any
            alphabetical characters
          </p>
          <p> Address's max length cannot exceed 100 characters </p>
          <li>Tel Details</li>
          <p>Tel details has 4 fields: </p>
          <ul style={{ listStyle: "disk", marginLeft: 40 }}>
            <li>Tel</li>
            <li>Tel2</li>
            <li>Tel3</li>
          </ul>
          <p>
            On the left of each input, there is a flag. Selecting a flag will
            fix the number's country code.
          </p>
          <img src={FlagCodeDM} alt="" className="dox_responsive_img" />
          <p>
            After selecting the country, you need to fill the input field. It
            only accepts digits.
          </p>
          <p>This field's length cannot exceed 20 characters.</p>
          <p>Only Tel (1) field is required</p>
          <li>Email</li>
          <p>Email can be used to send information from group plan.</p>
          <p>
            This field needs to have at least one @ and its length cannot exceed
            50 characters.
          </p>
          <li>Enabled</li>
          <p>
            This input field contains a two option dropdown list with "enabled"
            and "disabled" values
          </p>
          <p style={{ color: "red" }}>
            Disabled drivers will not be accessed through group plan for any
            use.
          </p>
          <li> Coach Operator </li>
          <p> Coach Operator's value cannot be changed.</p>
        </ul>
      </span>
      <hr />
      <h3 className="dox_h3">Driver's Documents</h3>
      <hr />
      <span>
        <p>In this card, a user can upload documents related to the driver.</p>
        <p>Document types:</p>
        <ul style={{ listStyle: "square", marginLeft: 40 }}>
          <li>Driver's License</li>
          <li>Tachograph Card</li>
          <li>Passport</li>
          <li>Identification Card</li>
        </ul>
        <p style={{ color: "red" }}>
          Each document must have an expiration date set to it.
        </p>
        <p style={{ color: "red" }}>
          Expired documents will be displayed a notifications at the reports tab
          until they are deleted or updated.
        </p>
        <img src={ReportsNotification} alt="" className="dox_responsive_img" />
      </span>
      <hr />
    </>
  );
};

const DMCs = () => {
  return (
    <>
      <h3 className="dox_h3">Data table</h3>
      <hr />
      <span>
        <p>Data table has the following columns: </p>
        <img
          src={AllCruisingCompaniesTableHeaders}
          alt=""
          className="dox_responsive_img"
        />
      </span>
      <hr />
      <h3 className="dox_h3">DMC fields and validators</h3>
      <hr />
      <span>
        <p>Information card has the following entries:</p>
        <ul style={{ listStyle: "square", marginLeft: 40 }}>
          <li>Name</li>
          <br />
          <p>
            Name is a free text field and it can only be composed by
            alphabetical characters and these three special characters ( . - & )
          </p>
          <p>Name's max length cannot exceed 50 characters</p>
          <li>Address</li>
          <p>
            Address is a free text field and it can only be composed by any
            alphabetical characters
          </p>
          <p>Address's max length cannot exceed 100 characters</p>
          <li>Tel Details</li>
          <p>Tel details has 4 fields: </p>
          <ul style={{ listStyle: "disk", marginLeft: 40 }}>
            <li>Tel</li>
            <li>Tel2</li>
            <li>Tel3</li>
          </ul>
          <p>
            On the left of each input, there is a flag. Selecting a flag will
            fix the number's country code.
          </p>
          <img src={FlagCodeDM} alt="" className="dox_responsive_img" />
          <p>
            After selecting the country, you need to fill the input field. It
            only accepts digits.
          </p>
          <p>This field's length cannot exceed 20 characters.</p>
          <p>Only Tel (1) field is required</p>
          <li>Email</li>
          <p>Email can be used to send information from group plan.</p>
          <p>
            This field needs to have at least one @ and its length cannot exceed
            50 characters.
          </p>
          <li>Website</li>
          <p>This field's input cannot exceed 50 characters.</p>
          <li>Lat / Lng</li>
          <p>
            Lat Lng field are two inputs indicating the location on the map.
          </p>
          <li>Enabled</li>
          <p>
            This input field contains a two option dropdown list with "enabled"
            and "disabled" values
          </p>
          <p style={{ color: "red" }}>
            Disabled ground handling companies will not be accessed through
            group plan for any use.
          </p>
        </ul>
      </span>
      <hr />
    </>
  );
};

const GroupLeaders = () => {
  return (
    <>
      <h3 className="dox_h3">Data table</h3>
      <hr />
      <span>
        <p>Data table has the following columns: </p>
        <img
          src={GroupLeadersTableHeaders}
          alt=""
          className="dox_responsive_img"
        />
      </span>
      <hr />
      <h3 className="dox_h3">Group Leader fields and validators</h3>
      <hr />
      <span>
        <p>Information card has the following entries:</p>
        <ul style={{ listStyle: "square", marginLeft: 40 }}>
          <li>Name</li>
          <br />
          <p>
            Name is a free text field and it can only be composed by
            alphabetical characters and these three special characters ( . - & )
          </p>
          <p>Name's max length cannot exceed 50 characters</p>
          <li>Address</li>
          <p>
            Address is a free text field and it can only be composed by any
            alphabetical characters
          </p>
          <p>Address's max length cannot exceed 100 characters</p>
          <li>Tel Details</li>
          <p>Tel details has 4 fields: </p>
          <ul style={{ listStyle: "disk", marginLeft: 40 }}>
            <li>Tel</li>
            <li>Tel2</li>
            <li>Tel3</li>
          </ul>
          <p>
            On the left of each input, there is a flag. Selecting a flag will
            fix the number's country code.
          </p>
          <img src={FlagCodeDM} alt="" className="dox_responsive_img" />
          <p>
            After selecting the country, you need to fill the input field. It
            only accepts digits.
          </p>
          <p>This field's length cannot exceed 20 characters.</p>
          <p>Only Tel (1) field is required</p>
          <li>Email</li>
          <p>Email can be used to send information from group plan.</p>
          <p>
            This field needs to have at least one @ and its length cannot exceed
            50 characters.
          </p>
          <li>Website</li>
          <p>This field's input cannot exceed 50 characters.</p>
          <li>Lat / Lng</li>
          <p>
            Lat Lng field are two inputs indicating the location on the map.
          </p>
          <li>Enabled</li>
          <p>
            This input field contains a two option dropdown list with "enabled"
            and "disabled" values
          </p>
          <p style={{ color: "red" }}>
            Disabled group leaders will not be accessed through group plan for
            any use.
          </p>
        </ul>
      </span>
      <hr />
    </>
  );
};

const Guides = () => {
  return (
    <>
      <h3 className="dox_h3">Data table</h3>
      <hr />
      <span>
        <p>Data table has the following columns: </p>
        <img
          src={AllGuidesTableHeaders}
          alt=""
          className="dox_responsive_img"
        />
      </span>
      <hr />
      <h3 className="dox_h3">Guide fields and validators</h3>
      <hr />
      <span>
        <p>Information card has the following entries:</p>
        <ul style={{ listStyle: "square", marginLeft: 40 }}>
          <li>Name</li>
          <br />
          <p>
            Name is a free text field and it can only be composed by
            alphabetical characters and these three special characters ( . - & )
          </p>
          <p>Name's max length cannot exceed 50 characters</p>
          <li>Place</li>
          <p>
            Place is composed by an autocomplete drop down list containing all
            the available places inserted into Group Plan.
          </p>
          <li>Address</li>
          <p>
            Address is a free text field and it can only be composed by any
            alphabetical characters
          </p>
          <p>Address's max length cannot exceed 100 characters</p>
          <li>Tel Details</li>
          <p>Tel details has 4 fields: </p>
          <ul style={{ listStyle: "disk", marginLeft: 40 }}>
            <li>Tel</li>
            <li>Tel2</li>
            <li>Tel3</li>
          </ul>
          <p>
            On the left of each input, there is a flag. Selecting a flag will
            fix the number's country code.
          </p>
          <img src={FlagCodeDM} alt="" className="dox_responsive_img" />
          <p>
            After selecting the country, you need to fill the input field. It
            only accepts digits.
          </p>
          <p>This field's length cannot exceed 20 characters.</p>
          <p>Only Tel (1) field is required</p>
          <li>Email</li>
          <p>Email can be used to send information from group plan.</p>
          <p>
            This field needs to have at least one @ and its length cannot exceed
            50 characters.
          </p>
          <li>Website</li>
          <p>This field's input cannot exceed 50 characters.</p>
          <li>Languages</li>
          <p>
            This field includes a multiple selection autocomplete drop down list
            with all available countries to select the languages a guide speaks.
          </p>
          <li>Enabled</li>
          <p>
            This input field contains a two option dropdown list with "enabled"
            and "disabled" values
          </p>
          <p style={{ color: "red" }}>
            Disabled guides will not be accessed through group plan for any use.
          </p>
        </ul>
      </span>
      <hr />
    </>
  );
};

const Hotels = () => {
  return (
    <>
      <h3 className="dox_h3">Data table</h3>
      <hr />
      <span>
        <p>Data table has the following columns: </p>
        <img
          src={AllHotelsTableHeaders}
          alt=""
          className="dox_responsive_img"
        />
      </span>
      <hr />
      <h3 className="dox_h3">Hotel fields and validators</h3>
      <hr />
      <span>
        <p>Information card has the following entries:</p>
        <ul style={{ listStyle: "square", marginLeft: 40 }}>
          <li>Name</li>
          <br />
          <p>
            Name is a free text field and it can only be composed by
            alphabetical characters and these three special characters ( . - & )
          </p>
          <p>Name's max length cannot exceed 50 characters</p>
          <li>Rating</li>
          <br />
          <p>Rating is a field showing the hotel's number of stars.</p>
          <p>options are: </p>
          <ul style={{ listStyle: "square", marginLeft: 40 }}>
            <li>1 star</li>
            <li>2 stars</li>
            <li>3 stars</li>
            <li>4 stars</li>
            <li>4 stars plus</li>
            <li>5 stars</li>
            <li>5 stars plus</li>
          </ul>
          <li>Place</li>
          <p>
            Place is composed by an autocomplete drop down list containing all
            the available places inserted into Group Plan.
          </p>
          <li>Address</li>
          <p>
            Address is a free text field and it can only be composed by any
            alphabetical characters
          </p>
          <p>Address's max length cannot exceed 100 characters</p>
          <li>Tel Details</li>
          <p>Tel details has 4 fields: </p>
          <ul style={{ listStyle: "disk", marginLeft: 40 }}>
            <li>Tel</li>
            <li>Tel2</li>
            <li>Tel3</li>
          </ul>
          <p>
            On the left of each input, there is a flag. Selecting a flag will
            fix the number's country code.
          </p>
          <img src={FlagCodeDM} alt="" className="dox_responsive_img" />
          <p>
            After selecting the country, you need to fill the input field. It
            only accepts digits.
          </p>
          <p>This field's length cannot exceed 20 characters.</p>
          <p>Only Tel (1) field is required</p>
          <li>Email</li>
          <p>Email can be used to send information from group plan.</p>
          <p>
            This field needs to have at least one @ and its length cannot exceed
            50 characters.
          </p>
          <li>Website</li>
          <p>This field's input cannot exceed 50 characters.</p>
          <li>Lat / Lng</li>
          <p>
            Lat Lng field are two inputs indicating the location on the map.
          </p>
          <li>Enabled</li>
          <p>
            This input field contains a two option dropdown list with "enabled"
            and "disabled" values
          </p>
          <p style={{ color: "red" }}>
            Disabled hotels will not be accessed through group plan for any use.
          </p>
        </ul>
      </span>
      <hr />
    </>
  );
};

const Places = () => {
  return (
    <>
      <h3 className="dox_h3">Data table</h3>
      <hr />
      <span>
        <p>Data table has the following columns: </p>
        <img src={AlPlacesTableHeaders} alt="" className="dox_responsive_img" />
      </span>
      <hr />
      <h3 className="dox_h3">Place fields and validators</h3>
      <hr />
      <span>
        <p>Information card has the following entries:</p>
        <ul style={{ listStyle: "square", marginLeft: 40 }}>
          <li>City</li>
          <br />
          <p>City is a free text field.</p>
          <p>City's max length cannot exceed 50 characters</p>
          <li>Country</li>
          <br />
          <p>
            Country is drop down field with all the available countries entered
            in group plan.
          </p>
          <li>Locality</li>
          <br />
          <p>Locality is a free text field.</p>
          <p>Locality's max length cannot exceed 50 characters</p>
          <li>District</li>
          <br />
          <p>District is a free text field.</p>
          <p>District's max length cannot exceed 50 characters</p>
          <li>Landmark</li>
          <br />
          <p>Landmark is a free text field.</p>
          <p>Landmark's max length cannot exceed 50 characters</p>
          <li>Lat / Lng</li>
          <p>
            Lat Lng field are two inputs indicating the location on the map.
          </p>
        </ul>
      </span>
      <hr />
    </>
  );
};

const Ports = () => {
  return (
    <>
      <h3 className="dox_h3">Data table</h3>
      <hr />
      <span>
        <p>Data table has the following columns: </p>
        <img src={AlPortsTableHeaders} alt="" className="dox_responsive_img" />
      </span>
      <hr />
      <h3 className="dox_h3">Port fields and validators</h3>
      <hr />
      <span>
        <p>Information card has the following entries:</p>
        <ul style={{ listStyle: "square", marginLeft: 40 }}>
          <li>Name</li>
          <br />
          <p>
            Name is a free text field and it can only be composed by
            alphabetical characters and these three special characters ( . - & )
          </p>
          <p>Name's max length cannot exceed 50 characters</p>
          <li>Code</li>
          <br />
          <p>
            Code is a free text field and it can only be composed by
            alphabetical characters which will be automatically capitalized
          </p>
          <p>Code's max length cannot exceed 3 characters</p>
          <li>Size</li>
          <br />
          <p>Size's field is a drop down list having the following values: </p>
          <ul style={{ listStyle: "square", marginLeft: 40 }}>
            <li>Unknown</li>
            <li>Very small</li>
            <li>Small</li>
            <li>Medium</li>
            <li>Large</li>
            <li>Very large</li>
          </ul>
          <li>Max depth</li>
          <br />
          <p>Max depth's field is numerical input field. </p>
          <li>Lat / Lng</li>
          <p>
            Lat Lng field are two inputs indicating the location on the map.
          </p>
          <li>Enabled</li>
          <p>
            This input field contains a two option dropdown list with "enabled"
            and "disabled" values
          </p>
          <p style={{ color: "red" }}>
            Disabled ports will not be accessed through group plan for any use.
          </p>
          <li>Nationality</li>
          <br />
          <p>
            This input field contains an autocomplete dropdown list with all
            available countries.
          </p>
        </ul>
      </span>
      <hr />
    </>
  );
};

const RepairShops = () => {
  return (
    <>
      <h3 className="dox_h3">Data table</h3>
      <hr />
      <span>
        <p>Data table has the following columns: </p>
        <img
          src={RepairShopsTableHeaders}
          alt=""
          className="dox_responsive_img"
        />
      </span>
      <hr />
      <h3 className="dox_h3">Repair Shop fields and validators</h3>
      <hr />
      <span>
        <p>Information card has the following entries:</p>
        <ul style={{ listStyle: "square", marginLeft: 40 }}>
          <li>Name</li>
          <br />
          <p>
            Name is a free text field and it can only be composed by
            alphabetical characters and these three special characters ( . - & )
          </p>
          <p>Name's max length cannot exceed 50 characters</p>
          <li>Address</li>
          <p>
            Address is a free text field and it can only be composed by any
            alphabetical characters
          </p>
          <p>Address's max length cannot exceed 100 characters</p>
          <li>Tel Details</li>
          <p>Tel details has 4 fields: </p>
          <ul style={{ listStyle: "disk", marginLeft: 40 }}>
            <li>Tel</li>
            <li>Tel2</li>
            <li>Tel3</li>
          </ul>
          <p>
            On the left of each input, there is a flag. Selecting a flag will
            fix the number's country code.
          </p>
          <img src={FlagCodeDM} alt="" className="dox_responsive_img" />
          <p>
            After selecting the country, you need to fill the input field. It
            only accepts digits.
          </p>
          <p>This field's length cannot exceed 20 characters.</p>
          <p>Only Tel (1) field is required</p>
          <li>Email</li>
          <p>Email can be used to send information from group plan.</p>
          <p>
            This field needs to have at least one @ and its length cannot exceed
            50 characters.
          </p>
          <li>Lat / Lng</li>
          <p>
            Lat Lng field are two inputs indicating the location on the map.
          </p>
          <li>Enabled</li>
          <p>
            This input field contains a two option dropdown list with "enabled"
            and "disabled" values
          </p>
          <p style={{ color: "red" }}>
            Disabled repair shops will not be accessed through group plan for
            any use.
          </p>
        </ul>
      </span>
      <hr />
    </>
  );
};

const RepairTypes = () => {
  return (
    <>
      <h3 className="dox_h3">Data table</h3>
      <hr />
      <span>
        <p>Data table has the following columns: </p>
        <img
          src={RepairTypesTableHeaders}
          alt=""
          className="dox_responsive_img"
        />
      </span>
      <hr />
      <h3 className="dox_h3">Repair Shop fields and validators</h3>
      <hr />
      <span>
        <p>Information card has the following entries:</p>
        <ul style={{ listStyle: "square", marginLeft: 40 }}>
          <li>Description</li>
          <br />
          <p>
            Description is a free text field and it can only be composed by
            alphabetical characters and these three special characters ( . - & )
          </p>
          <p>Description's max length cannot exceed 50 characters</p>
          <li>Icon</li>
          <p>Icon is a file field,accepting the PNG file type.</p>
          <p style={{ color: "red" }}>Icon's size has to be 35 x 35 pixels.</p>
        </ul>
      </span>
      <hr />
    </>
  );
};

const Restaurants = () => {
  return (
    <>
      <h3 className="dox_h3">Data table</h3>
      <hr />
      <span>
        <p>Data table has the following columns: </p>
        <img
          src={AllHotelsTableHeaders}
          alt=""
          className="dox_responsive_img"
        />
      </span>
      <hr />
      <h3 className="dox_h3">Restaurant fields and validators</h3>
      <hr />
      <span>
        <p>Information card has the following entries:</p>
        <ul style={{ listStyle: "square", marginLeft: 40 }}>
          <li>Name</li>
          <br />
          <p>
            Name is a free text field and it can only be composed by
            alphabetical characters and these three special characters ( . - & )
          </p>
          <p>Name's max length cannot exceed 50 characters</p>
          <li>Rating</li>
          <br />
          <p>Rating is a field showing the hotel's number of stars.</p>
          <p>options are: </p>
          <ul style={{ listStyle: "square", marginLeft: 40 }}>
            <li>1 star</li>
            <li>2 stars</li>
            <li>3 stars</li>
            <li>4 stars</li>
            <li>4 stars plus</li>
            <li>5 stars</li>
            <li>5 stars plus</li>
          </ul>
          <li>Place</li>
          <p>
            Place is composed by an autocomplete drop down list containing all
            the available places inserted into Group Plan.
          </p>
          <li>Address</li>
          <p>
            Address is a free text field and it can only be composed by any
            alphabetical characters
          </p>
          <p>Address's max length cannot exceed 100 characters</p>
          <li>Tel Details</li>
          <p>Tel details has 4 fields: </p>
          <ul style={{ listStyle: "disk", marginLeft: 40 }}>
            <li>Tel</li>
            <li>Tel2</li>
            <li>Tel3</li>
          </ul>
          <p>
            On the left of each input, there is a flag. Selecting a flag will
            fix the number's country code.
          </p>
          <img src={FlagCodeDM} alt="" className="dox_responsive_img" />
          <p>
            After selecting the country, you need to fill the input field. It
            only accepts digits.
          </p>
          <p>This field's length cannot exceed 20 characters.</p>
          <p>Only Tel (1) field is required</p>
          <li>Email</li>
          <p>Email can be used to send information from group plan.</p>
          <p>
            This field needs to have at least one @ and its length cannot exceed
            50 characters.
          </p>
          <li>Website</li>
          <p>This field's input cannot exceed 50 characters.</p>
          <li>Lat / Lng</li>
          <p>
            Lat Lng field are two inputs indicating the location on the map.
          </p>
          <li>Enabled</li>
          <p>
            This input field contains a two option dropdown list with "enabled"
            and "disabled" values
          </p>
          <p style={{ color: "red" }}>
            Disabled restaurants will not be accessed through group plan for any
            use.
          </p>
        </ul>
      </span>
      <hr />
    </>
  );
};

const Services = () => {
  return (
    <>
      <h3 className="dox_h3">Data table</h3>
      <hr />
      <span>
        <p>Data table has the following columns: </p>
        <img
          src={AllServicessTableHeaders}
          alt=""
          className="dox_responsive_img"
        />
      </span>
      <hr />
      <h3 className="dox_h3">Service fields and validators</h3>
      <hr />
      <span>
        <p>Information card has the following entries:</p>
        <ul style={{ listStyle: "square", marginLeft: 40 }}>
          <li>Refcode</li>
          <br />
          <p style={{ color: "red" }}>Refcode cannot be changed.</p>
          <li>Type</li>
          <br />
          <p style={{ color: "red" }}>Service's type cannot be changed.</p>
          <li>Date</li>
          <p>Date can only be changed to group's schedule available dates</p>
          <li>Price</li>
          <p>Price is a numerical field with max value of 99999.</p>
          <li>Start time</li>
          <p>This is a drop down time field with the following format: </p>
          <img src={TimeFieldDropDown} alt="" className="dox_responsive_img" />
          <li>Description</li>
          <p>This is a free text area field.</p>
          <p>Description does not have any validators or limits.</p>
        </ul>
      </span>
      <hr />
    </>
  );
};

const FerryTicketAgencies = () => {
  return (
    <>
      <h3 className="dox_h3">Data table</h3>
      <hr />
      <span>
        <p>Data table has the following columns: </p>
        <img
          src={AllCruisingCompaniesTableHeaders}
          alt=""
          className="dox_responsive_img"
        />
      </span>
      <hr />
      <h3 className="dox_h3">Ferry Ticket Agencies fields and validators</h3>
      <hr />
      <span>
        <p>Information card has the following entries:</p>
        <ul style={{ listStyle: "square", marginLeft: 40 }}>
          <li>Name</li>
          <br />
          <p>
            Name is a free text field and it can only be composed by
            alphabetical characters and these three special characters ( . - & )
          </p>
          <p>Name's max length cannot exceed 50 characters</p>
          <li>Address</li>
          <p>
            Address is a free text field and it can only be composed by any
            alphabetical characters
          </p>
          <p>Address's max length cannot exceed 100 characters</p>
          <li>Tel Details</li>
          <p>Tel details has 4 fields: </p>
          <ul style={{ listStyle: "disk", marginLeft: 40 }}>
            <li>Tel</li>
            <li>Tel2</li>
            <li>Tel3</li>
          </ul>
          <p>
            On the left of each input, there is a flag. Selecting a flag will
            fix the number's country code.
          </p>
          <img src={FlagCodeDM} alt="" className="dox_responsive_img" />
          <p>
            After selecting the country, you need to fill the input field. It
            only accepts digits.
          </p>
          <p>This field's length cannot exceed 20 characters.</p>
          <p>Only Tel (1) field is required</p>
          <li>Email</li>
          <p>Email can be used to send information from group plan.</p>
          <p>
            This field needs to have at least one @ and its length cannot exceed
            50 characters.
          </p>
          <li>Website</li>
          <p>This field's input cannot exceed 50 characters.</p>
          <li>Lat / Lng</li>
          <p>
            Lat Lng field are two inputs indicating the location on the map.
          </p>
          <li>Enabled</li>
          <p>
            This input field contains a two option dropdown list with "enabled"
            and "disabled" values
          </p>
          <p style={{ color: "red" }}>
            Disabled ferry ticket agencies will not be accessed through group
            plan for any use.
          </p>
        </ul>
      </span>
      <hr />
    </>
  );
};

const TeleferikCompanies = () => {
  return (
    <>
      <h3 className="dox_h3">Data table</h3>
      <hr />
      <span>
        <p>Data table has the following columns: </p>
        <img
          src={AllCruisingCompaniesTableHeaders}
          alt=""
          className="dox_responsive_img"
        />
      </span>
      <hr />
      <h3 className="dox_h3">Teleferik Companies fields and validators</h3>
      <hr />
      <span>
        <p>Information card has the following entries:</p>
        <ul style={{ listStyle: "square", marginLeft: 40 }}>
          <li>Name</li>
          <br />
          <p>
            Name is a free text field and it can only be composed by
            alphabetical characters and these three special characters ( . - & )
          </p>
          <p>Name's max length cannot exceed 50 characters</p>
          <li>Address</li>
          <p>
            Address is a free text field and it can only be composed by any
            alphabetical characters
          </p>
          <p>Address's max length cannot exceed 100 characters</p>
          <li>Tel Details</li>
          <p>Tel details has 4 fields: </p>
          <ul style={{ listStyle: "disk", marginLeft: 40 }}>
            <li>Tel</li>
            <li>Tel2</li>
            <li>Tel3</li>
          </ul>
          <p>
            On the left of each input, there is a flag. Selecting a flag will
            fix the number's country code.
          </p>
          <img src={FlagCodeDM} alt="" className="dox_responsive_img" />
          <p>
            After selecting the country, you need to fill the input field. It
            only accepts digits.
          </p>
          <p>This field's length cannot exceed 20 characters.</p>
          <p>Only Tel (1) field is required</p>
          <li>Email</li>
          <p>Email can be used to send information from group plan.</p>
          <p>
            This field needs to have at least one @ and its length cannot exceed
            50 characters.
          </p>
          <li>Website</li>
          <p>This field's input cannot exceed 50 characters.</p>
          <li>Lat / Lng</li>
          <p>
            Lat Lng field are two inputs indicating the location on the map.
          </p>
          <li>Enabled</li>
          <p>
            This input field contains a two option dropdown list with "enabled"
            and "disabled" values
          </p>
          <p style={{ color: "red" }}>
            Disabled teleferik companies will not be accessed through group plan
            for any use.
          </p>
        </ul>
      </span>
      <hr />
    </>
  );
};

const Theaters = () => {
  return (
    <>
      <h3 className="dox_h3">Data table</h3>
      <hr />
      <span>
        <p>Data table has the following columns: </p>
        <img
          src={AllTheatersTableHeaders}
          alt=""
          className="dox_responsive_img"
        />
      </span>
      <hr />
      <h3 className="dox_h3">Theater fields and validators</h3>
      <hr />
      <span>
        <p>Information card has the following entries:</p>
        <ul style={{ listStyle: "square", marginLeft: 40 }}>
          <li>Name</li>
          <br />
          <p>
            Name is a free text field and it can only be composed by
            alphabetical characters and these three special characters ( . - & )
          </p>
          <p>Name's max length cannot exceed 50 characters</p>
          <li>Place</li>
          <p>
            Place is composed by an autocomplete drop down list containing all
            the available places inserted into Group Plan.
          </p>
          <li>Address</li>
          <p>
            Address is a free text field and it can only be composed by any
            alphabetical characters
          </p>
          <p>Address's max length cannot exceed 100 characters</p>
          <li>Tel Details</li>
          <p>Tel details has 4 fields: </p>
          <ul style={{ listStyle: "disk", marginLeft: 40 }}>
            <li>Tel</li>
            <li>Tel2</li>
            <li>Tel3</li>
          </ul>
          <p>
            On the left of each input, there is a flag. Selecting a flag will
            fix the number's country code.
          </p>
          <img src={FlagCodeDM} alt="" className="dox_responsive_img" />
          <p>
            After selecting the country, you need to fill the input field. It
            only accepts digits.
          </p>
          <p>This field's length cannot exceed 20 characters.</p>
          <p>Only Tel (1) field is required</p>
          <li>Email</li>
          <p>Email can be used to send information from group plan.</p>
          <p>
            This field needs to have at least one @ and its length cannot exceed
            50 characters.
          </p>
          <li>Website</li>
          <p>This field's input cannot exceed 50 characters.</p>
          <li>Lat / Lng</li>
          <p>
            Lat Lng field are two inputs indicating the location on the map.
          </p>
          <li>Enabled</li>
          <p>
            This input field contains a two option dropdown list with "enabled"
            and "disabled" values
          </p>
          <p style={{ color: "red" }}>
            Disabled theaters will not be accessed through group plan for any
            use.
          </p>
        </ul>
      </span>
      <hr />
    </>
  );
};

const TrainTicketAgencies = () => {
  return (
    <>
      <h3 className="dox_h3">Data table</h3>
      <hr />
      <span>
        <p>Data table has the following columns: </p>
        <img
          src={AllTrainTicketAgenciesCompaniesTableHeaders}
          alt=""
          className="dox_responsive_img"
        />
      </span>
      <hr />
      <h3 className="dox_h3">Train Ticket Agencies fields and validators</h3>
      <hr />
      <span>
        <p>Information card has the following entries:</p>
        <ul style={{ listStyle: "square", marginLeft: 40 }}>
          <li>Name</li>
          <br />
          <p>
            Name is a free text field and it can only be composed by
            alphabetical characters and these three special characters ( . - & )
          </p>
          <p>Name's max length cannot exceed 50 characters</p>
          <li>Address</li>
          <p>
            Address is a free text field and it can only be composed by any
            alphabetical characters
          </p>
          <p>Address's max length cannot exceed 100 characters</p>
          <li>Tel Details</li>
          <p>Tel details has 4 fields: </p>
          <ul style={{ listStyle: "disk", marginLeft: 40 }}>
            <li>Tel</li>
            <li>Tel2</li>
            <li>Tel3</li>
          </ul>
          <p>
            On the left of each input, there is a flag. Selecting a flag will
            fix the number's country code.
          </p>
          <img src={FlagCodeDM} alt="" className="dox_responsive_img" />
          <p>
            After selecting the country, you need to fill the input field. It
            only accepts digits.
          </p>
          <p>This field's length cannot exceed 20 characters.</p>
          <p>Only Tel (1) field is required</p>
          <li>Email</li>
          <p>Email can be used to send information from group plan.</p>
          <p>
            This field needs to have at least one @ and its length cannot exceed
            50 characters.
          </p>
          <li>Website</li>
          <p>This field's input cannot exceed 50 characters.</p>
          <li>Lat / Lng</li>
          <p>
            Lat Lng field are two inputs indicating the location on the map.
          </p>
          <li>Enabled</li>
          <p>
            This input field contains a two option dropdown list with "enabled"
            and "disabled" values
          </p>
          <p style={{ color: "red" }}>
            Disabled train ticket agencies will not be accessed through group
            plan for any use.
          </p>
        </ul>
      </span>
      <hr />
    </>
  );
};

const SportEventSuppliers = () => {
  return (
    <>
      <h3 className="dox_h3">Data table</h3>
      <hr />
      <span>
        <p>Data table has the following columns: </p>
        <img
          src={AllTrainTicketAgenciesCompaniesTableHeaders}
          alt=""
          className="dox_responsive_img"
        />
      </span>
      <hr />
      <h3 className="dox_h3">Sport event suppliers fields and validators</h3>
      <hr />
      <span>
        <p>Information card has the following entries:</p>
        <ul style={{ listStyle: "square", marginLeft: 40 }}>
          <li>Name</li>
          <br />
          <p>
            Name is a free text field and it can only be composed by
            alphabetical characters and these three special characters ( . - & )
          </p>
          <p>Name's max length cannot exceed 50 characters</p>
          <li>Address</li>
          <p>
            Address is a free text field and it can only be composed by any
            alphabetical characters
          </p>
          <p>Address's max length cannot exceed 100 characters</p>
          <li>Tel Details</li>
          <p>Tel details has 4 fields: </p>
          <ul style={{ listStyle: "disk", marginLeft: 40 }}>
            <li>Tel</li>
            <li>Tel2</li>
            <li>Tel3</li>
          </ul>
          <p>
            On the left of each input, there is a flag. Selecting a flag will
            fix the number's country code.
          </p>
          <img src={FlagCodeDM} alt="" className="dox_responsive_img" />
          <p>
            After selecting the country, you need to fill the input field. It
            only accepts digits.
          </p>
          <p>This field's length cannot exceed 20 characters.</p>
          <p>Only Tel (1) field is required</p>
          <li>Email</li>
          <p>Email can be used to send information from group plan.</p>
          <p>
            This field needs to have at least one @ and its length cannot exceed
            50 characters.
          </p>
          <li>Website</li>
          <p>This field's input cannot exceed 50 characters.</p>
          <li>Lat / Lng</li>
          <p>
            Lat Lng field are two inputs indicating the location on the map.
          </p>
          <li>Enabled</li>
          <p>
            This input field contains a two option dropdown list with "enabled"
            and "disabled" values
          </p>
          <p style={{ color: "red" }}>
            Disabled sport event suppliers will not be accessed through group
            plan for any use.
          </p>
        </ul>
      </span>
      <hr />
    </>
  );
};

class DataManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "General",
      groupActive: "General",
    };
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleGroupItemClick = this.handleGroupItemClick.bind(this);
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  handleGroupItemClick = (e, { name }) => {
    this.setState({ groupActive: name });
    window.scrollTo(0, 0);
  };

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
              name="Notes"
              active={this.state.groupActive === "Notes"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="Gallery"
              active={this.state.groupActive === "Gallery"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="Maps"
              active={this.state.groupActive === "Maps"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="Agents"
              active={this.state.groupActive === "Agents"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="Airlines"
              active={this.state.groupActive === "Airlines"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="Airports"
              active={this.state.groupActive === "Airports"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="Attractions"
              active={this.state.groupActive === "Attractions"}
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
              name="Coaches"
              active={this.state.groupActive === "Coaches"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="Cruising Companies"
              active={this.state.groupActive === "Cruising Companies"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="Drivers"
              active={this.state.groupActive === "Drivers"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="DMCs"
              active={this.state.groupActive === "DMCs"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="Group Leaders"
              active={this.state.groupActive === "Group Leaders"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="Guides"
              active={this.state.groupActive === "Guides"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="Hotels"
              active={this.state.groupActive === "Hotels"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="Places"
              active={this.state.groupActive === "Places"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="Ports"
              active={this.state.groupActive === "Ports"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="Repair Shops"
              active={this.state.groupActive === "Repair Shops"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="Repair Types"
              active={this.state.groupActive === "Repair Types"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="Restaurants"
              active={this.state.groupActive === "Restaurants"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="Services"
              active={this.state.groupActive === "Services"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="Ferry Ticket Agencies"
              active={this.state.groupActive === "Ferry Ticket Agencies"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="Teleferik Companies"
              active={this.state.groupActive === "Teleferik Companies"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="Theaters"
              active={this.state.groupActive === "Theaters"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="Train Ticket Agencies"
              active={this.state.groupActive === "Train Ticket Agencies"}
              onClick={this.handleGroupItemClick}
            />
            <Menu.Item
              name="Sport Event Suppliers"
              active={this.state.groupActive === "Sport Event Suppliers"}
              onClick={this.handleGroupItemClick}
            />
          </Menu>
        </Grid.Column>
        <Grid.Column>
          {this.state.groupActive === "General" ? <General /> : ""}
          {this.state.groupActive === "Notes" ? <Notes /> : ""}
          {this.state.groupActive === "Maps" ? <Maps /> : ""}
          {this.state.groupActive === "Gallery" ? <Gallery /> : ""}
          {this.state.groupActive === "Agents" ? <Agents /> : ""}
          {this.state.groupActive === "Airlines" ? <Airlines /> : ""}
          {this.state.groupActive === "Airports" ? <Airports /> : ""}
          {this.state.groupActive === "Attractions" ? <Attractions /> : ""}
          {this.state.groupActive === "Clients" ? <Clients /> : ""}
          {this.state.groupActive === "Coach Operators" ? (
            <CoachOperators />
          ) : (
            ""
          )}
          {this.state.groupActive === "Coaches" ? <Coaches /> : ""}
          {this.state.groupActive === "Cruising Companies" ? (
            <CruisingCompanies />
          ) : (
            ""
          )}
          {this.state.groupActive === "Drivers" ? <Drivers /> : ""}
          {this.state.groupActive === "DMCs" ? <DMCs /> : ""}
          {this.state.groupActive === "Group Leaders" ? <GroupLeaders /> : ""}
          {this.state.groupActive === "Guides" ? <Guides /> : ""}
          {this.state.groupActive === "Hotels" ? <Hotels /> : ""}
          {this.state.groupActive === "Places" ? <Places /> : ""}
          {this.state.groupActive === "Ports" ? <Ports /> : ""}
          {this.state.groupActive === "Repair Shops" ? <RepairShops /> : ""}
          {this.state.groupActive === "Repair Types" ? <RepairTypes /> : ""}
          {this.state.groupActive === "Restaurants" ? <Restaurants /> : ""}
          {this.state.groupActive === "Services" ? <Services /> : ""}
          {this.state.groupActive === "Ferry Ticket Agencies" ? (
            <FerryTicketAgencies />
          ) : (
            ""
          )}
          {this.state.groupActive === "Teleferik Companies" ? (
            <TeleferikCompanies />
          ) : (
            ""
          )}
          {this.state.groupActive === "Theaters" ? <Theaters /> : ""}
          {this.state.groupActive === "Train Ticket Agencies" ? (
            <TrainTicketAgencies />
          ) : (
            ""
          )}
          {this.state.groupActive === "Sport Event Suppliers" ? (
            <SportEventSuppliers />
          ) : (
            ""
          )}
        </Grid.Column>
      </>
    );
  }
}

export default DataManagement;
