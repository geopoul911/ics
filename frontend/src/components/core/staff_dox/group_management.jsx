// Built-ins
import React from "react";

// Modules / Functions
import { Menu, Grid } from "semantic-ui-react";

// Icons / Images
import AddGroupBtnImg from "../../../images/dox/add_group_btn.png";
import DisabledBtnImg from "../../../images/dox/disabled_btn.png";
import OverviewInfoCardFooter from "../../../images/dox/group_overview_info_card_footer.png";
import Pencil from "../../../images/dox/pencil.png";
import AddNoteBtn from "../../../images/dox/add_note_btn.png";
import NoteSample from "../../../images/dox/note_sample.png";
import AddNewTdBtn from "../../../images/dox/add_new_td_btn.png";
import DelTdBtn from "../../../images/dox/delete_td_btn.png";
import ServiceTypes from "../../../images/dox/service_types.png";
import AddServiceBtn from "../../../images/dox/create_new_service_btn.png";
import DelServiceIcon from "../../../images/dox/delete_service_icon.png";
import SampleRouteMap from "../../../images/dox/sample_route_map.png";
import ScheduleForRouteSample from "../../../images/dox/schedule_for_route_sample.png";
import GroupDocumentsTableHeaders from "../../../images/dox/group_documents_table_headers.png";
import CloudIconSample from "../../../images/dox/cloud_icon_sample.png";
import TinyMCESample from "../../../images/dox/tiny_mce_sample.png";
import SendAllRoomingListBtn from "../../../images/dox/send_all_rooming_list_btn.png";
import AttractionsItinerarySample from "../../../images/dox/attractions_itinerary_sample.png";
import GroupStatsTab from "../../../images/dox/group_stats_tabs.png";
import ChartsStatsTab from "../../../images/dox/group_stats_charts.png";
import DatePickerSample from "../../../images/dox/datepicker_sample.png";
import DailyStatusChartSample from "../../../images/dox/daily_status_chart_sample.png";
import GoogleMapDailyStatus from "../../../images/dox/google_map_daily_status.png";
import DailyStatusTableSample from "../../../images/dox/daily_status_table_sample.png";
import AllOffersTableHeaders from "../../../images/dox/all_offers_table_headers.png";
import AddOfferBtnImg from "../../../images/dox/create_new_offer_btn.png";
import AddAccomodationService from "../../../images/dox/add_accomodation_service.png";
import AddNonCommonService from "../../../images/dox/add_non_common_service.png";
import AddCommonService from "../../../images/dox/add_common_service.png";
import ResultsPerPersonA from "../../../images/dox/results_per_person_a.png";
import ResultsPerPersonB from "../../../images/dox/results_per_person_b.png";
import ResultsPerScale from "../../../images/dox/results_per_scale.png";

const AllGroups = () => {
  return (
    <>
      <div className="paper_dox">
        <h1 className="dox_h1">All Groups</h1>
        <hr />
        <h3 className="dox_h3">General</h3>
        <span>
          <p>
            All groups feature a datatable that displays a comprehensive list of
            all the groups created within Group Plan.
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">Data table</h3>
        <br />
        <span>
          <p>
            All Groups page contains a data table with the following columns:
          </p>
          <ul style={{ listStyle: "circle", marginLeft: 20 }}>
            <li>ID</li>
            <li>Refcode</li>
            <li>Agent / Client</li>
            <li>Agent's / Client's Refcode</li>
            <li>Status</li>
            <li>Departure date</li>
            <li>Nationality</li>
            <li>PAX</li>
          </ul>
        </span>
        <hr />
        <h3 className="dox_h3">Add Group</h3>
        <br />
        <span>
          <p>
            To add a group, click the Create new group Button on the bottom left
            of the All groups page
          </p>
          <img src={AddGroupBtnImg} alt="" />
          <p>Next, you will have to to fill the following fields:</p>
          <ul style={{ listStyle: "circle", marginLeft: 20 }}>
            <li>Group's Office</li>
            <li>Agent/Client</li>
            <li>Rest Of Code</li>
            <li>Date</li>
          </ul>
          <p>
            All of these fields are required, therefore if they are empty, the
            green button will not be enabled to proceed.
          </p>
          <p>
            Below you can see what a disabled button ( Save changes ) looks like
            :
          </p>
          <img src={DisabledBtnImg} alt="" />
          <p>
            Once you have successfully created the Group, Group Plan will
            redirect you to Group's overview page.
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">Refcode</h3>
        <br />
        <span>
          <p>
            Refcode is formed by office, agent abbreviation, date and rest of
            code
          </p>
          <p>1) Refcode's first 3 characters are made of Group's Office.</p>
          <p>Athens = COA</p>
          <p>London = COL</p>
          <p>2) Dash ( - ) followed by the agent/client's Abbrevation </p>
          <p>3) Date</p>
          <p>4) Rest Of Code</p>
        </span>
        <br />
        <p>Example: COA-SOI21012020SY</p>
        <hr />
        <i style={{ color: "red" }}>
          Before the rebranding of the company, groups had TRA/TRL/TRB as the
          group's office options.
        </i>
      </div>
    </>
  );
};

const Overview = () => {
  return (
    <>
      <div className="paper_dox">
        <h1 className="dox_h1">Group Overview</h1>
        <hr />
        <h3 className="dox_h3">General</h3>
        <span>
          <p>Group Overview displays the group's core data. </p>
          <p>It is made of 4 cards: </p>
          <ul style={{ listStyle: "circle", marginLeft: 20 }}>
            <li>Information</li>
            <li>Agent / Client Information</li>
            <li>Coach and Driver Information</li>
            <li>Notes</li>
          </ul>
        </span>
        <hr />
        <h3 className="dox_h3">Group Information</h3>
        <br />
        <span>
          <p>
            To edit any value, click the pencil icon (
            <img src={Pencil} alt="" />) on the right of each entry.
          </p>
          <p>Group Information card contains the following values:</p>
          <ul style={{ listStyle: "circle", marginLeft: 20 }}>
            <li>Reference Code</li>
            <p>
              Change refcode modal is similar to the one creating a group. All
              fields are required to proceed and once you change the group's
              refcode successfully, group plan will redirect you to the new URL.
            </p>
            <li>Status</li>
            <p>
              Change status modal contains a drop down list with the options :
              Confirmed / Cancelled. Cancelled are the groups which did not
              travel in the end and will not be considered at reports.
            </p>
            <li>Arrival</li>
            <p>Arrival modal contains the following values : </p>
            <ul>
              <li>
                Transportation Type:
                <ul style={{ listStyle: "square", marginLeft: 40 }}>
                  <li>Unknown</li>
                  <li>Air</li>
                  <li>Sea</li>
                  <li>Train</li>
                </ul>
                <i>
                  By selecting the transportation type, the modal changes to
                  insert the values related to the option.
                </i>
              </li>
            </ul>
            <ul style={{ listStyle: "square", marginLeft: 40 }}>
              <li>
                Unknown:
                <ul style={{ listStyle: "square", marginLeft: 40 }}>
                  <li>Date and time</li>
                </ul>
                <p>
                  Arrival is formed by datetime.
                  <br />
                  Example: Thu Sep 28 2023 14:37
                </p>
              </li>
              <li>
                Air:
                <ul style={{ listStyle: "square", marginLeft: 40 }}>
                  <li>Date and time</li>
                  <li>Airport</li>
                  <li>Airline</li>
                  <li>Flight</li>
                </ul>
                <p>
                  Arrival is formed by date, time, airline's abbreviation,
                  flight number, airport 3 letter code, airport location, and
                  terminal.
                  <br />
                  Example: Thu Sep 28 2023 14:37 - KE 3333 - ALG - Algiers,
                  Algeria Houari Boumedienne - No Terminal
                </p>
              </li>
              <li>
                Sea:
                <ul style={{ listStyle: "square", marginLeft: 40 }}>
                  <li>Date and time</li>
                  <li>Port</li>
                  <li>Ferry Ticket Agency</li>
                  <li>Ship Name</li>
                </ul>
                <p>
                  Arrival is formed by date, time, port, country, ferry ticket
                  agency name, and ship name.
                  <br />
                  Example: Thu Sep 28 2023 14:37 - Allen - Philippines, ANEK
                  LINES, OLYMPIC CHAMPION
                </p>
              </li>
              <li>
                Train:
                <ul style={{ listStyle: "square", marginLeft: 40 }}>
                  <li>Date and time</li>
                  <li>Railway Station</li>
                  <li>Train Ticket Agency</li>
                  <li>Route</li>
                </ul>
                <p>
                  Arrival is formed by date, time, railway station, country,
                  train ticket agency name, and route.
                  <br />
                  Example: Thu Sep 28 2023 14:37 - 7070 - Germany, THALYS, THA
                  9328
                </p>
              </li>
            </ul>
            <li>Departure</li>
            <p> Same structure as Arrival</p>
            <li>Number Of People</li>
            <p>Modal contains an integer input field. Max number is 999</p>
            <li>Room Description</li>
            <p>
              Room description field is made of data used in services tab. It
              counts Accomodation's room total number for each type of room.
            </p>
            <p>Example: SGL: 1 / DBL: 2 / TWN: 3 / TRPL: 4 / QUAD: 5</p>
            <li>Meal Description</li>
            <p>
              Meal description field is made of data used in services tab. It
              counts each Accomodation's meal description.
            </p>
            <p>
              Example: 1) AUSTRIA TREND HOTEL SALZBURG MITTE : Breakfast
              Board(BB)
            </p>
            <li>Nationality / Flag</li>
            <p>
              Modal contains an autocomplete drop down list with all countries
            </p>
            <p>Group's nationality is not a required filed</p>
          </ul>
          <p>
            The Card's footer contains the Delete Group button and group's
            services as icons.
          </p>
          <p>Example: </p>
          <img
            src={OverviewInfoCardFooter}
            alt=""
            className="dox_responsive_img"
          />
          <p>By hovering to each icon, you can see the service's type.</p>
        </span>
        <hr />
        <h3 className="dox_h3">Agent/Client Information</h3>
        <br />
        <span>
          <p>
            Agent/Client information card contains the name and the refcode of
            the Client/Agent.
          </p>
          <p>
            If a group has been created with an Agent, The user cannot change
            the Agent to a Client.
          </p>
          <p>
            Change Agent/Client Modal contains an autocomplete drop down list
            with all Agents/Clients.
          </p>
          <p>
            If Agent/Client is changed, group's refcode will change too and
            there will be a redirection to the new URL.
          </p>
          <p>
            Change Agent/Client's Refcode Modal contains an alphanumerical input
            field, which only allows capitalized letters with max length of 20
            characters.
          </p>
          <p>
            Agent/Client's refcode is the name the agent or client gave to the
            group.
          </p>
        </span>
        <h3 className="dox_h3">Coach and Drivers Information</h3>
        <br />
        <span>
          <p>
            Coach And Drivers Information card contains a data table with the
            following columns:
          </p>
          <ul style={{ listStyle: "square", marginLeft: 40 }}>
            <li>Period</li>
            <li>Driver</li>
            <li>Coach Operator</li>
            <li>Coach Make</li>
            <li>Plate Number</li>
            <li>Seats</li>
          </ul>
        </span>
        <h3 className="dox_h3">Notes</h3>
        <br />
        <span>
          <p>
            Group notes card contains the notes with useful information not
            mentioned anywhere else in the page.
          </p>
          <p>Example: ONLY BUS</p>
          <p>Card's footer contains the Add Note button. </p>
          <img src={AddNoteBtn} alt="" />
          <p>Modal only contains a textarea for the note.</p>
          <p>
            Once the note has been created,it will appear in the card's body in
            a form of sticker
          </p>
          <p>
            Sticker Contains the note's creator username, date created and the
            text.
          </p>
          <p>Note Sample: </p>
          <img src={NoteSample} alt="" />
        </span>
      </div>
    </>
  );
};

const Schedule = () => {
  return (
    <>
      <div className="paper_dox">
        <h1 className="dox_h1">Group Schedule</h1>
        <hr />
        <h3 className="dox_h3">General</h3>
        <span>
          <p>
            Group Schedule page is used to store information about the group's
            travel data.
          </p>
          <p>This page only includes a data table</p>
        </span>
        <hr />
        <h3 className="dox_h3">Data table</h3>
        <br />
        <span>
          <p>
            Group Schedule page contains a data table with the following
            columns:
          </p>
          <ul style={{ listStyle: "square", marginLeft: 40 }}>
            <li>#</li>
            <li>Date</li>
            <li>Hotel</li>
            <li>Location</li>
            <li>Driver</li>
            <li>Coach</li>
            <li>Leader</li>
          </ul>
          <p>
            To edit any value, click the pencil icon (
            <img src={Pencil} alt="" />) on the right of each entry.
          </p>
          <ul style={{ listStyle: "square", marginLeft: 40 }}>
            <li>
              <p>1) Date</p>
              <p>Change Date modal only contains a date picker</p>
            </li>
            <hr />
            <li>
              2) Hotel
              <p>
                Change Hotel modal contains an autocomplete dropdown list with
                all the hotels
              </p>
              <p>Updating travelday's hotel will also update the location</p>
              <p>You cannot update the departure day's hotel value</p>
            </li>
            <hr />
            <li>
              3) Location
              <p>
                Location cannot be changed at days that already have a hotel,
                location value will come from hotel in that case.
              </p>
              <p>
                If a hotel is not inserted, the pencil will appear next to the
                location entry
              </p>
              <p>
                Change Location modal contains an autocomplete dropdown list
                with all the available places.
              </p>
              <p>You cannot update the departure day's location value</p>
            </li>
            <hr />
            <li>
              4) Driver
              <p>
                Change driver modal contains an autocomplete dropdown list with
                all the available drivers and a check box to set the driver for
                upcoming days too
              </p>
              <p>
                If the check box is checked, the driver will also be set on all
                the days after the selected days's date
              </p>
            </li>
            <hr />
            <li>
              5) Coach
              <p>
                Change coach modal contains an autocomplete dropdown list with
                all the available coaches and a check box to set the coach for
                upcoming days too
              </p>
              <p>
                If the check box is checked, the coach will also be set on all
                the days after the selected days's date
              </p>
            </li>
            <li>
              6) Leader
              <p>
                Change leader modal contains an autocomplete dropdown list with
                all the available leaders and a check box to set the leader for
                upcoming days too
              </p>
              <p>
                If the check box is checked, the leader will also be set on all
                the days after the selected days's date
              </p>
            </li>
          </ul>
        </span>
        <hr />
        <h3 className="dox_h3">Add Travelday</h3>
        <br />
        <span>
          <p>
            To add a travelday, click the Add new Travelday Button on the bottom
            left of the group schedule page
          </p>
          <img src={AddNewTdBtn} alt="" className="dox_responsive_img" />
          <p>
            If the schedule table is empty, a modal will render which will
            prompt you to select the first day's date.
          </p>
          <p>
            otherwise, Group Plan will find the last day's date and append the
            next one automatically.
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">Delete Travelday</h3>
        <br />
        <span>
          <p>
            To delete a travelday, click on the travelday you want to delete and
            then click the button Delete travelday.
          </p>
          <img src={DelTdBtn} alt="" className="dox_responsive_img" />
        </span>
        <hr />
        <h3 className="dox_h3">Conflicts</h3>
        <br />
        <span>
          <p>
            By changing values in the group schedule table, a conflict might
            occur.
          </p>
          <p>
            Conflicts occur when a driver or a coach are in more than one
            traveldays with the same date.
          </p>
          <p>
            More about this can be found in the Site Administration / Conflicts
            page.
          </p>
        </span>
        <hr />
      </div>
    </>
  );
};

const Services = () => {
  return (
    <>
      <div className="paper_dox">
        <h1 className="dox_h1">Group Services</h1>
        <hr />
        <h3 className="dox_h3">General</h3>
        <span>
          <p>
            Group Services are used to store information of services provided to
            a group.
          </p>
          <p>This information can be used on the Itinerary page.</p>
          <p>There are 23 available service types</p>
        </span>
        <hr />
        <h3 className="dox_h3">Add Service</h3>
        <br />
        <span>
          <p>
            To add a service, click the create new service Button on the bottom
            left of the group services page
          </p>
          <img src={AddServiceBtn} alt="" />
          <p>Then, enter following data to the modal:</p>
          <ul style={{ listStyle: "square", marginLeft: 40 }}>
            <li>Date</li>
            <li>Type</li>
            <li>Extra Field</li>
            <li>Start time</li>
            <li>Description</li>
          </ul>
        </span>
        <hr />
        <h3 className="dox_h3">Delete Service</h3>
        <br />
        <span>
          <p>
            To delete a service, click on the delete icon on the top right of
            the service's table row
          </p>
          <img src={DelServiceIcon} alt="" />
        </span>
        <hr />
        <h3 className="dox_h3">Filters</h3>
        <span>
          <p>
            Group Services Filters is a radio button list of all available
            services types on the left of the page.
          </p>
          <p>You can filter results in the table using the buttons.</p>
          <p>Types: </p>
          <img src={ServiceTypes} alt="" />
        </span>
        <hr />
        <h3 className="dox_h3">Data table</h3>
        <br />
        <br />
        <span>
          <p>
            Group Services page contains a data table with the following
            columns:
          </p>
          <ul style={{ listStyle: "square", marginLeft: 40 }}>
            <li>ID</li>
            <li>Type</li>
            <li>Date</li>
            <li>Start Time</li>
            <li>Description</li>
            <li>Delete</li>
          </ul>
        </span>
        <hr />
      </div>
    </>
  );
};

const Itinerary = () => {
  return (
    <>
      <div className="paper_dox">
        <h1 className="dox_h1">Group Itinerary</h1>
        <hr />
        <h3 className="dox_h3">General</h3>
        <hr />
        <span>
          <p>Itinerary Page is made by 3 components: </p>
          <ul style={{ listStyle: "square", marginLeft: 40 }}>
            <li>Remarks</li>
            <li>Attractions</li>
            <li>Contents</li>
          </ul>
        </span>
        <hr />
        <h3 className="dox_h3">Remarks</h3>
        <hr />
        <span>
          <p>
            The 'Remarks' section serves as a template and is additionally
            incorporated into the group documents, specifically within the
            itinerary, where it constitutes the fifth section of the document.
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">Attractions</h3>
        <hr />
        <span>
          <p>
            In the attractions section there is an accordion component for each
            hotel.
          </p>
          <p>
            By clicking the accordion, a list of checkboxes with all the
            inserted attractions of the place will appear.
          </p>
          <p>Checking attractions will include them in the exported PDFs</p>
          <p>Attractions can be added to places via Data management.</p>
          <p>
            Example of a Group going to Rome and seeing Colosseo, Fontana Di
            Trevi etc.
          </p>
          <img
            src={AttractionsItinerarySample}
            alt=""
            className="dox_responsive_img"
          />
        </span>
        <h3 className="dox_h3">Contents</h3>
        <hr />
        <span>
          <p>The contents categorize the group into the following sections: </p>
          <ul style={{ listStyle: "square", marginLeft: 40 }}>
            <li>Header</li>
            <li>Group Information</li>
            <li>Driver & Coach Information</li>
            <li>Driver Contact Info</li>
            <li>Group Leader Contact Info</li>
            <li>Hotel List</li>
            <li>Attention</li>
            <li>Itinerary</li>
            <li>Services</li>
            <li>Attractions</li>
            <li>Remarks</li>
            <li>Rooming List</li>
          </ul>
          <p>
            Each category is accompanied by a checkmark or cross, indicating
            whether the group's associated data has been completed or not.
          </p>
        </span>
      </div>
    </>
  );
};

const RoomingLists = () => {
  return (
    <>
      <div className="paper_dox">
        <h1 className="dox_h1">Group Rooming Lists</h1>
        <hr />
        <h3 className="dox_h3">General</h3>
        <hr />
        <span>
          <p>
            Rooming list card contains a page for all hotels and each hotel
            separately inserted into the group's schedule table.
          </p>
          <p>Rooming list text is a powerful and flexible rich text editor.</p>
          <p>
            Rich text editors allow us to paste a table of data directly into
            it, keeping the table's formation solid.
          </p>
          <p>
            In the picture below, we see a pasted table copied by an exceel
            sheet:
          </p>
          <img src={TinyMCESample} alt="" className="dox_responsive_img" />
        </span>
        <hr />
        <h3 className="dox_h3">All</h3>
        <br />
        <span>
          <p>
            A check box will appear in the top left of the card's body, with all
            the hotels inserted into the group's schedule table.
          </p>
          <p>
            These boxes are used to make multiple changes easier on the hotel's
            rooming lists.
          </p>
          <p>Fields to edit: </p>
          <ul style={{ listStyle: "square", marginLeft: 40 }}>
            <li>Room Desc</li>
            <li>Meal Desc</li>
            <li>Note</li>
          </ul>
          <p>
            All of these fields are free text inputs and will be included into
            the email.
          </p>
          <b style={{ color: "red" }}>
            Save the changes before sending any email
          </b>
          <p>
            To save changes, click the save changes button at the bottom of the
            card's body
          </p>
          <p>
            At the card's footer, you can find the send all Rooming lists button
          </p>
          <p>
            This button will send the rooming lists of each
            <b style={{ color: "red" }}>selected </b> hotel
          </p>
          <img
            src={SendAllRoomingListBtn}
            alt=""
            className="dox_responsive_img"
          />
        </span>
        <hr />
        <h3 className="dox_h3">Selected hotel</h3>
        <br />
        <span>
          <p>
            At each selected hotel's page, you can find the following inputs:
          </p>
          <ul style={{ listStyle: "square", marginLeft: 40 }}>
            <li>Send to</li>
            <p>
              Send to is set by default to the hotel's email address. It can
              also be changed, using the pencil on the right of the field
            </p>
            <li>Send From</li>
            <p>
              Send from is set by default to the user's email address. It cannot
              be changed.
            </p>
            <li>Date</li>
            <p>
              Date is set by the entry of the selected hotel on the schedule
              table's data. It cannot be changed.
            </p>
            <li>Nights</li>
            <p>
              Nights field also gets data from the schedule's table.It cannot be
              changed.
            </p>
            <li>Room Desc</li>
            <p>
              Free text field describing the hotel's rooms.It will be shown into
              the forwarded email.
            </p>
            <li>Meal Desc</li>
            <p>
              Free text field describing the hotel's meals.It will be shown into
              the forwarded email.
            </p>
            <li>Note</li>
            <p>
              Free text field. Used to point out anything not included on the
              page. Not required
            </p>
          </ul>
          <b>Room Text editor</b>
          <p>
            To update the room text's value , you need to press the save changes
            button underneath the editor
          </p>
        </span>
      </div>
    </>
  );
};

const Documents = () => {
  return (
    <>
      <div className="paper_dox">
        <h1 className="dox_h1">Group Documents</h1>
        <hr />
        <h3 className="dox_h3">General</h3>
        <hr />
        <span>
          <p>Group Documents page is used as a storage app.</p>
          <p>
            Here you can upload, store and download any document related to the
            group.
          </p>
          <p>Uploaded files cannot exceed 20 megabytes of data</p>
          <p style={{ color: "red" }}>Allowed extensions to be uploaded: </p>
          <p style={{ color: "red" }}>
            .PDF .XLSX .XLSM .XLSX .DOCX .DOC .TIF .TIFF .BMP .JPG .JPEG .PNG
            .CSV .DOT .DOTX .MP3 .MP4 .PPTX .ZIP .RAR .TXT .WAV .FLV
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">Data Table</h3>
        <hr />
        <span>
          <p>
            Group Documents page contains a data table with the following
            columns:
          </p>
          <img
            src={GroupDocumentsTableHeaders}
            alt=""
            className="dox_responsive_img"
          />
          <ul style={{ listStyle: "square", marginLeft: 40 }}>
            <li>1) ID</li>
            <li>2) File Name</li>
            <li>3) Description</li>
            <li>4) Uploaded by</li>
            <li>5) Uploaded at</li>
            <li>6) Size</li>
            <li>7) Download</li>
            <li>8) Delete</li>
          </ul>
          <p>Uploaded file's values cannot be changed.</p>
        </span>
        <hr />
        <h3 className="dox_h3">Add Document</h3>
        <br />
        <span>
          <p>
            To add a document, click the upload new file Button on the bottom
            left of the group documents page
          </p>
          <ul style={{ listStyle: "square", marginLeft: 40 }}>
            <p>Then, enter following data to the modal:</p>
            <li>Choose file</li>
            <li>Document's Description</li>
          </ul>
          <p style={{ color: "red" }}>
            Both description and file fields are required
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">Delete Document</h3>
        <br />
        <span>
          <p>
            To delete a document, click on the delete icon on the top right of
            the document's table row
          </p>
          <img src={DelServiceIcon} alt="" className="dox_responsive_img" />
        </span>
        <hr />
        <h3 className="dox_h3">Download Document</h3>
        <br />
        <span>
          <p>
            To download a document, click on the arrow-cloud icon on the right
            of the document's table row
          </p>
          <img src={CloudIconSample} alt="" className="dox_responsive_img" />
        </span>
        <hr />
      </div>
    </>
  );
};

const Route = () => {
  return (
    <>
      <div className="paper_dox">
        <h1 className="dox_h1">Group Route</h1>
        <hr />
        <h3 className="dox_h3">General</h3>
        <hr />
        <span>
          <p>Group Route is a page with a map.</p>
          <p>It uses Google's API to calculate the route a group makes</p>
          <p>The route is calculated based on the schedule table's data</p>
          <p>If there is no data in the schedule, the map will not appear.</p>
        </span>
        <hr />
        <h3 className="dox_h3">Example</h3>
        <hr />
        <span>
          <p>A Group with the following locations on its schedule: </p>
          <img
            src={ScheduleForRouteSample}
            alt=""
            className="dox_responsive_img"
          />
          <p>Will produce the following route: </p>
          <img src={SampleRouteMap} alt="" className="dox_responsive_img" />
        </span>
      </div>
    </>
  );
};

const GroupStats = () => {
  return (
    <>
      <div className="paper_dox">
        <h1 className="dox_h1">Group Stats</h1>
        <hr />
        <h3 className="dox_h3">General</h3>
        <hr />
        <span>
          <p>Group Stats is a reporting system.</p>
          <p>A User can see the following: </p>
          <p>Tabs with groups, days, services and other stats</p>
          <p>Office based pie chart</p>
          <p>Confirmed / Cancelled pie chart</p>
          <p>Country based pie chart</p>
        </span>
        <hr />
        <h3 className="dox_h3">Tabs</h3>
        <hr />
        <span>
          <p>Tabs example image: </p>
          <img src={GroupStatsTab} alt="" className="dox_responsive_img" />
        </span>
        <hr />
        <h3 className="dox_h3">Charts</h3>
        <hr />
        <span>
          <p>Charts example image: </p>
          <img src={ChartsStatsTab} alt="" className="dox_responsive_img" />
        </span>
      </div>
    </>
  );
};

const DailyStatus = () => {
  return (
    <>
      <div className="paper_dox">
        <h1 className="dox_h1">Daily Status</h1>
        <hr />
        <h3 className="dox_h3">General</h3>
        <hr />
        <span>
          <p>
            Daily Status is a system showing active groups at selected dates.
          </p>
          <p>By default, selected date is today's date.</p>
          <p>
            To change selected date's value, click on the top left input of the
            page:
          </p>
          <img src={DatePickerSample} alt="" className="dox_responsive_img" />
          <p>
            If the selected date has results, a pie chart will appear, showing
            up Office based groups.
          </p>
          <p>Example: </p>
          <img
            src={DailyStatusChartSample}
            alt=""
            className="dox_responsive_img"
          />
          <p>
            on the right side of the page, there is a google map, showing the
            location of the groups and information on hover about each one:
          </p>
          <img
            src={GoogleMapDailyStatus}
            alt=""
            className="dox_responsive_img"
          />
        </span>
        <hr />
        <h3 className="dox_h3">Data table</h3>
        <br />
        <span>
          <p>Table example: </p>
          <img
            src={DailyStatusTableSample}
            alt=""
            className="dox_responsive_img"
          />
        </span>
      </div>
    </>
  );
};

const AllOffers = () => {
  return (
    <>
      <div className="paper_dox">
        <h1 className="dox_h1">All Offers</h1>
        <hr />
        <h3 className="dox_h3">General</h3>
        <span>
          <p>
            All offers contain a data table with all the offers created in Group
            Plan
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">Data table</h3>
        <br />
        <span>
          <p>
            All Offers page contains a data table with the following columns:
          </p>
          <img
            src={AllOffersTableHeaders}
            alt=""
            className="dox_responsive_img"
          />
        </span>
        <hr />
        <h3 className="dox_h3">Add Offer</h3>
        <br />
        <span>
          <p>
            To add an offer, click the Create new offer Button on the bottom
            left of the All offers page
          </p>
          <img src={AddOfferBtnImg} alt="" className="dox_responsive_img" />
          <p>Next, you will have to to fill the following fields:</p>
          <ul style={{ listStyle: "circle" }}>
            <li>Group's Office</li>
            <li>Agent/Client</li>
            <li>Rest Of Code</li>
            <li>Date</li>
          </ul>
          <p>
            All of these fields are required, therefore if they are empty, the
            green button will not be enabled to proceed.
          </p>
          <p>
            Below you can see what a disabled button ( Save changes ) looks like
            :
          </p>
          <img src={DisabledBtnImg} alt="" />
          <p>
            Once you have successfully created the Offer, Group Plan will
            redirect you to Offer's overview page.
          </p>
        </span>
        <hr />
        <span>
          <p>
            Refcode is formed by office, agent abbreviation, date and rest of
            code
          </p>
          <p>1) Refcode's first 3 characters are made of Group's Office.</p>
          <p>Athens = TRA</p>
          <p>London = TRL</p>
          <p>Beijing = TRB</p>
          <p>2) Dash ( - ) followed by the agent/client's Abbrevation </p>
          <p>3) Date</p>
          <p>4) Rest Of Code</p>
        </span>
        <br />
        <p>Example: TRB-SOI21012020SY</p>
        <hr />
      </div>
    </>
  );
};

const OfferOverview = () => {
  return (
    <>
      <div className="paper_dox">
        <h1 className="dox_h1">Offer Overview</h1>
        <hr />
        <h3 className="dox_h3">General</h3>
        <span>
          <p>Offer overview contains three components:</p>
          <ul style={{ listStyle: "square" }}>
            <li>Info</li>
            <li>Services</li>
            <li>Results</li>
          </ul>
        </span>
        <hr />
        <h3 className="dox_h3">Info</h3>
        <br />
        <span>
          <p>Offer Info includes the following: </p>
          <ul style={{ listStyle: "circle" }}>
            <li>First Day's Date</li>
            <p>Displayed on exported PDF</p>
            <li>Refcode</li>
            <p>Refcode will be used to match groups, it cannot be edited</p>
            <li>Date Created</li>
            <p>Date created is an auto generated field, it cannot be edited</p>
            <li>Group's Name</li>
            <p>Free text field for the group's name</p>
            <li>PAX</li>
            <p>
              Number of people, Group plan calculates total cost net based on
              this number.
            </p>
            <li>Destination</li>
            <p>Free text field for the group's destination</p>
            <li>Profit %</li>
            <p>Amount of profit we will have, if the offer is accepted.</p>
            <li>Number of days</li>
            <p>Displayed on exported PDF</p>
            <li>Offer type</li>
            <br />
            <p>There are two offer types. Per person and by scale.</p>
            <p>
              <b>Per person</b> offer calculates based on PAX and Profit
            </p>
            <p>
              <b>By Scale</b> offer calculates on a scale of 10-14 / 15-19 /
              20-24 / 25-29 / 30-34 / 35-39 / 40-44 / 45 + PAX
            </p>
          </ul>
        </span>
        <hr />
        <h3 className="dox_h3">Services</h3>
        <br />
        <span>
          <p>Offer Services are divided into three categories: </p>
          <ul style={{ listStyle: "circle" }}>
            <li>
              <b>Accomodation</b>
            </li>
            <br />
            <p>
              To add an accomodation service, first you need to enter the hotel.
            </p>
            <p>
              Then, you need to enter the price per room type and the number of
              free room types:
            </p>
            <img
              src={AddAccomodationService}
              alt=""
              className="dox_responsive_img"
            />
            <p></p>
            <li>
              <b>Common</b>
            </li>
            <br />
            <p>
              Common services are the ones that every traveler has to get
              charged for.
            </p>
            <p>
              For a example, everyone has to pay for the services a local guide
              provides.
            </p>
            <p>
              Common services cost is divided by the number of people to find
              out the total cost per person.
            </p>
            <img src={AddCommonService} alt="" className="dox_responsive_img" />
            <br />
            <p>Common services types : </p>
            <ul style={{ listStyle: "square", marginLeft: 40 }}>
              <li>Transfers</li>
              <li>Tolls</li>
              <li>Permits</li>
              <li>Driver Accomodation</li>
              <li>Ferry Ticket For The Coach</li>
              <li>Local Guide</li>
              <li>Tour Leader</li>
              <li>Tour Leader Air Ticket</li>
              <li>Tour Leader Air Accomodation</li>
              <li>Restaurant</li>
              <li>Other</li>
            </ul>
            <li>
              <b>Non Common</b>
            </li>
            <br />
            <p>Non Common services are calculated per person.</p>
            <p>
              For a example, if someone wants to attend a sport event, they will
              be separately charged for that service.
            </p>
            <img
              src={AddNonCommonService}
              alt=""
              className="dox_responsive_img"
            />
            <br />
            <p>Non Common services types : </p>
            <ul style={{ listStyle: "square", marginLeft: 40 }}>
              <li>Air Ticket</li>
              <li>Meals</li>
              <li>Ferry Ticket</li>
              <li>Cruise</li>
              <li>Theater</li>
              <li>Train Ticket</li>
              <li>Sport Event</li>
              <li>Teleferik</li>
              <li>Hotel Porterage</li>
              <li>Airport Porterage</li>
            </ul>
          </ul>
        </span>
        <hr />
        <h3 className="dox_h3">Results</h3>
        <br />
        <span>
          <p>Results are divided into two categories:</p>
          <ul style={{ listStyle: "circle" }}>
            <li>Per Person</li>
            <br />
            <p style={{ color: "red" }}>
              If there is no PAX or Profit % value entered in offer info,
              results per person will not be able to calculate the costs for the
              offer.
            </p>
            <p>
              If the offer includes accomodation service, a table with price per
              room type will appear in the results tab:
            </p>
            <img
              src={ResultsPerPersonA}
              alt=""
              className="dox_responsive_img"
            />
            <p>Otherwise, the table will only show a row with cost : </p>
            <img
              src={ResultsPerPersonB}
              alt=""
              className="dox_responsive_img"
            />

            <li>By Scale</li>
            <p>
              By scale results will show a table with the price depending on the
              PAX of the group. Example:
            </p>
            <img src={ResultsPerScale} alt="" className="dox_responsive_img" />
          </ul>
        </span>
        <hr />
      </div>
    </>
  );
};

class GroupManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "Groups",
      groupActive: "All Groups",
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
              name="Groups"
              active={this.state.activeItem === "Groups"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name="Group Stats"
              active={this.state.activeItem === "Group Stats"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name="Daily Status"
              active={this.state.activeItem === "Daily Status"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name="All Offers"
              active={this.state.activeItem === "All Offers"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name="Offer Overview"
              active={this.state.activeItem === "Offer Overview"}
              onClick={this.handleItemClick}
            />
          </Menu>
        </Grid.Column>

        {this.state.activeItem === "Groups" ? (
          <>
            <Grid.Column width={2}>
              <Menu pointing vertical>
                <Menu.Item
                  name="All Groups"
                  active={this.state.groupActive === "All Groups"}
                  onClick={this.handleGroupItemClick}
                />
                <Menu.Item
                  name="Overview"
                  active={this.state.groupActive === "Overview"}
                  onClick={this.handleGroupItemClick}
                />
                <Menu.Item
                  name="Schedule"
                  active={this.state.groupActive === "Schedule"}
                  onClick={this.handleGroupItemClick}
                />
                <Menu.Item
                  name="Services"
                  active={this.state.groupActive === "Services"}
                  onClick={this.handleGroupItemClick}
                />
                <Menu.Item
                  name="Itinerary"
                  active={this.state.groupActive === "Itinerary"}
                  onClick={this.handleGroupItemClick}
                />
                <Menu.Item
                  name="Rooming Lists"
                  active={this.state.groupActive === "Rooming Lists"}
                  onClick={this.handleGroupItemClick}
                />
                <Menu.Item
                  name="Documents"
                  active={this.state.groupActive === "Documents"}
                  onClick={this.handleGroupItemClick}
                />
                <Menu.Item
                  name="Route"
                  active={this.state.groupActive === "Route"}
                  onClick={this.handleGroupItemClick}
                />
              </Menu>
            </Grid.Column>
            <Grid.Column>
              {this.state.groupActive === "All Groups" ? <AllGroups /> : ""}
              {this.state.groupActive === "Overview" ? <Overview /> : ""}
              {this.state.groupActive === "Schedule" ? <Schedule /> : ""}
              {this.state.groupActive === "Services" ? <Services /> : ""}
              {this.state.groupActive === "Itinerary" ? <Itinerary /> : ""}
              {this.state.groupActive === "Rooming Lists" ? (
                <RoomingLists />
              ) : (
                ""
              )}
              {this.state.groupActive === "Documents" ? <Documents /> : ""}
              {this.state.groupActive === "Route" ? <Route /> : ""}
            </Grid.Column>
          </>
        ) : (
          ""
        )}
        <Grid.Column>
          {this.state.activeItem === "Group Stats" ? <GroupStats /> : ""}
          {this.state.activeItem === "Daily Status" ? <DailyStatus /> : ""}
          {this.state.activeItem === "All Offers" ? <AllOffers /> : ""}
          {this.state.activeItem === "Offer Overview" ? <OfferOverview /> : ""}
        </Grid.Column>
      </>
    );
  }
}

export default GroupManagement;
