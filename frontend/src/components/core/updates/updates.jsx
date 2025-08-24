// Built-ins
import React from "react";

// Custom made components
import NavigationBar from "../navigation_bar/navigation_bar";
import Footer from "../footer/footer";

// Modules / Functions
import { Accordion, Icon } from "semantic-ui-react";
import Swal from "sweetalert2";

// CSS
import "./updates.css";

// Icons / Images
import { MdUpdate } from "react-icons/md";

// Global Variables
import { pageHeader, forbidden, restrictedUsers } from "../../global_vars";

// Variables
window.Swal = Swal;

const updateIconStyle = {
  color: "#2a9fd9",
  fontSize: "1.2em",
  marginRight: "0.5em",
};

class Update extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: -1,
      forbidden: false,
    };
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  };

  componentDidMount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
  }

  render() {
    return (
      <div>
        <NavigationBar />
        {pageHeader("updates")}
        <div className="mainContainer">
          {this.state.forbidden ? (
            <>{forbidden("Updates")}</>
          ) : (
            <>
              <Accordion>
                <Accordion.Title
                  active={this.state.activeIndex === 19}
                  index={19}
                  onClick={this.handleClick}
                >
                  <Icon name="dropdown" />
                  <MdUpdate style={updateIconStyle} />
                  28-04-2023<b> Changed Lat/Lng Form.</b>
                </Accordion.Title>
                <Accordion.Content active={this.state.activeIndex === 19}>
                  <p>Lng Form now recognises lat and lng based on comma.</p>
                </Accordion.Content>
                <Accordion.Title
                  active={this.state.activeIndex === 18}
                  index={18}
                  onClick={this.handleClick}
                >
                  <Icon name="dropdown" />
                  <MdUpdate
                    style={{
                      color: "#2a9fd9",
                      fontSize: "1.2em",
                      marginRight: "0.5em",
                    }}
                  />
                  26-04-2023<b> Reworked Group's Arrival/Departure.</b>
                </Accordion.Title>
                <Accordion.Content active={this.state.activeIndex === 18}>
                  <p>
                    Group's Arrival Flight/Departure Flight is now renamed to :
                    Arrival / Departure.
                  </p>
                  <ol style={{ listStyle: "circle", marginLeft: 30 }}>
                    <li>
                      Trains Can be Included To arrival / departure fields.
                      <br />
                      Trains use Railway Stations and Train Ticket Agencies,
                      <br /> plus a free text field to use as Train's Route.
                    </li>
                    <li>
                      Ships Can be Included To arrival / departure fields.
                      <br />
                      Ships use Ports and Ferry Ticket Agencies,
                      <br /> plus a free text field to use as Ship's name.
                    </li>
                  </ol>
                </Accordion.Content>
                <Accordion.Title
                  active={this.state.activeIndex === 17}
                  index={17}
                  onClick={this.handleClick}
                >
                  <Icon name="dropdown" />
                  <MdUpdate style={updateIconStyle} />
                  26-04-2023<b> Reworked Daily Status.</b>
                </Accordion.Title>
                <Accordion.Content active={this.state.activeIndex === 17}>
                  <p>
                    Daily Status now show legends of Agents on the top right of
                    the page. It can also show Markers as clustered or
                    non-clustered.
                  </p>
                </Accordion.Content>
                <Accordion.Title
                  active={this.state.activeIndex === 16}
                  index={16}
                  onClick={this.handleClick}
                >
                  <Icon name="dropdown" />
                  <MdUpdate style={updateIconStyle} />
                  26-04-2023
                  <b> Removed Extra Rooming List Field from Itinerary</b>
                </Accordion.Title>
                <Accordion.Content active={this.state.activeIndex === 16}>
                  <p>
                    From now on, Group's Rooming list will be only in Rooming
                    list tab, on the All Page.
                  </p>
                </Accordion.Content>
                <Accordion.Title
                  active={this.state.activeIndex === 15}
                  index={15}
                  onClick={this.handleClick}
                >
                  <Icon name="dropdown" />
                  <MdUpdate style={updateIconStyle} />
                  25-04-2023
                  <b>
                    Added Textarea Field called comment on each travelday.
                  </b>
                </Accordion.Title>
                <Accordion.Content active={this.state.activeIndex === 15}>
                  <p>
                    Comments will be used like notes, but will only be included
                    on group's Itinerary PDF Document.
                  </p>
                </Accordion.Content>
                <Accordion.Title
                  active={this.state.activeIndex === 14}
                  index={14}
                  onClick={this.handleClick}
                >
                  <Icon name="dropdown" />
                  <MdUpdate style={updateIconStyle} />
                  24-04-2023
                  <b> Added create object button next to dropdowns </b>
                </Accordion.Title>
                <Accordion.Content active={this.state.activeIndex === 14}>
                  <p>
                    In order not to navigate to data management and to add
                    objects faster,
                    <br />
                    users can now create entries opening a second modal with a
                    new button next to dropdowns.
                  </p>
                </Accordion.Content>
                <Accordion.Title
                  active={this.state.activeIndex === 12}
                  index={12}
                  onClick={this.handleClick}
                >
                  <Icon name="dropdown" />
                  <MdUpdate style={updateIconStyle} />
                  18-04-2023<b> Increased Access Attempts Limit to 5 </b>
                </Accordion.Title>
                <Accordion.Content active={this.state.activeIndex === 12}>
                  <p>
                    Access Attempts Limit is now 5 from 3. London Office's IP is
                    also now whitelisted.
                  </p>
                </Accordion.Content>
                <Accordion.Title
                  active={this.state.activeIndex === 11}
                  index={11}
                  onClick={this.handleClick}
                >
                  <Icon name="dropdown" />
                  <MdUpdate style={updateIconStyle} />
                  14-04-2023<b> Added More Agent Icons. </b>
                </Accordion.Title>
                <Accordion.Content active={this.state.activeIndex === 11}>
                  <p>
                    Agent Icons increased by 500 by Lexis Digital's Graphic
                    Designers
                  </p>
                </Accordion.Content>
                <Accordion.Title
                  active={this.state.activeIndex === 10}
                  index={10}
                  onClick={this.handleClick}
                >
                  <Icon name="dropdown" />
                  <MdUpdate style={updateIconStyle} />
                  11-04-2023<b> Changed calls on group pages. </b>
                </Accordion.Title>
                <Accordion.Content active={this.state.activeIndex === 10}>
                  <p>
                    Now it calls GroupView once, and gets group's data for all
                    tabs, instead of one for each tab click
                  </p>
                </Accordion.Content>
                <Accordion.Title
                  active={this.state.activeIndex === 9}
                  index={9}
                  onClick={this.handleClick}
                >
                  <Icon name="dropdown" />
                  <MdUpdate style={updateIconStyle} />
                  11-04-2023
                  <b> Removed "is_local" field from coach operators</b>
                </Accordion.Title>
                <Accordion.Content active={this.state.activeIndex === 9}>
                  <p>is_local field was not of any use. </p>
                </Accordion.Content>
                <Accordion.Title
                  active={this.state.activeIndex === 8}
                  index={8}
                  onClick={this.handleClick}
                >
                  <Icon name="dropdown" />
                  <MdUpdate style={updateIconStyle} />
                  07-04-2023<b> Created Railway Station model</b>
                </Accordion.Title>
                <Accordion.Content active={this.state.activeIndex === 8}>
                  <p>Railway Station fields: </p>
                  <ol style={{ listStyle: "circle", marginLeft: 30 }}>
                    <li>ID</li>
                    <li>Name</li>
                    <li>Date Created</li>
                    <li>Code Three</li>
                    <li>Nationality</li>
                    <li>Place</li>
                    <li>Lat</li>
                    <li>Lng</li>
                    <li>Enabled</li>
                  </ol>
                </Accordion.Content>
                <Accordion.Title
                  active={this.state.activeIndex === 7}
                  index={7}
                  onClick={this.handleClick}
                >
                  <Icon name="dropdown" />
                  <MdUpdate style={updateIconStyle} />
                  04-04-2023<b> Added Change Agent Icon Mechanism</b>
                </Accordion.Title>
                <Accordion.Content active={this.state.activeIndex === 7}>
                  <p>Agent bus icons can now be selected from the UI </p>
                </Accordion.Content>
                <Accordion.Title
                  active={this.state.activeIndex === 6}
                  index={6}
                  onClick={this.handleClick}
                >
                  <Icon name="dropdown" />
                  <MdUpdate style={updateIconStyle} />
                  04-04-2023<b> Rebuilt Whole Itinerary PDF.</b>
                </Accordion.Title>
                <Accordion.Content active={this.state.activeIndex === 6}>
                  <p>Itinerary now includes: </p>
                  <ol style={{ listStyle: "circle", marginLeft: 30 }}>
                    <li>Header</li>
                    <li>Group Information</li>
                    <li>Arrival Flight Information</li>
                    <li>Departure Flight Information</li>
                    <li>Drivers & Coach Information</li>
                    <li>Leader Information</li>
                    <li>Hotel List</li>
                    <li>Itinerary</li>
                    <li>Remarks</li>
                    <li>Rooming List</li>
                  </ol>
                </Accordion.Content>
                <Accordion.Title
                  active={this.state.activeIndex === 5}
                  index={5}
                  onClick={this.handleClick}
                >
                  <Icon name="dropdown" />
                  <MdUpdate style={updateIconStyle} />
                  03-04-2023
                  <b> Moved PDF Generator buttons to group documents.</b>
                </Accordion.Title>
                <Accordion.Content active={this.state.activeIndex === 5}>
                  <p>
                    All Group PDF generated documents are going to be rows on
                    the Group Documents table.
                  </p>
                  <p>The documents are:</p>
                  <ol style={{ listStyle: "circle", marginLeft: 30 }}>
                    <li>Hotel List</li>
                    <li>Itinerary</li>
                    <li>Drivers Information</li>
                    <li>Name List</li>
                    <li>Rooming List</li>
                  </ol>
                </Accordion.Content>
                <Accordion.Title
                  active={this.state.activeIndex === 4}
                  index={4}
                  onClick={this.handleClick}
                >
                  <Icon name="dropdown" />
                  <MdUpdate style={updateIconStyle} />
                  31-03-2023 <b> Added Coach Operators to Group's Schedule</b>
                </Accordion.Title>
                <Accordion.Content active={this.state.activeIndex === 4}>
                  <p>
                    Coach Operators now have a one to one relationship to
                    Traveldays.
                  </p>
                  <p>
                    Users can add Coach Operators to each Travelday on Group's
                    Schedule.
                  </p>
                </Accordion.Content>
                <Accordion.Title
                  active={this.state.activeIndex === 3}
                  index={3}
                  onClick={this.handleClick}
                >
                  <Icon name="dropdown" />
                  <MdUpdate style={updateIconStyle} />
                  31-03-2023
                  <b>
                    Updated phone input library of react to its second version
                  </b>
                </Accordion.Title>
                <Accordion.Content active={this.state.activeIndex === 3}>
                  <p>
                    In this version, typing a code selects automatically the
                    flag.
                  </p>
                  <p>
                    Also it does not crash in case of user mistaken inputs.
                  </p>
                </Accordion.Content>
                <Accordion.Title
                  active={this.state.activeIndex === 2}
                  index={2}
                  onClick={this.handleClick}
                >
                  <Icon name="dropdown" />
                  <MdUpdate style={updateIconStyle} />
                  31-03-2023 <b>Deleted Fax Fields</b>
                </Accordion.Title>
                <Accordion.Content active={this.state.activeIndex === 2}>
                  <p>Removed Fax fields from the following models:</p>
                  <ul style={{ listStyle: "circle", marginLeft: 30 }}>
                    <li>Agent</li>
                    <li>Client</li>
                    <li>Coach Operator</li>
                    <li>Drivers</li>
                    <li>Group Leader</li>
                    <li>Guide</li>
                    <li>Hotel</li>
                    <li>Restaurant</li>
                    <li>Sport Event Supplier</li>
                    <li>Local Guides</li>
                  </ul>
                </Accordion.Content>
                <Accordion.Title
                  active={this.state.activeIndex === 1}
                  index={1}
                  onClick={this.handleClick}
                >
                  <Icon name="dropdown" />
                  <MdUpdate style={updateIconStyle} />
                  23-03-2023 <b>Added Ports</b>
                </Accordion.Title>
                <Accordion.Content active={this.state.activeIndex === 1}>
                  <p>
                    Populated the database with 2285 ports. Port Data includes:
                  </p>
                  <ul style={{ listStyle: "circle", marginLeft: 30 }}>
                    <li>ID</li>
                    <li>Name</li>
                    <li>Code</li>
                    <li>Latitude</li>
                    <li>Longitude</li>
                    <li>Nationality</li>
                  </ul>
                </Accordion.Content>
                <Accordion.Title
                  active={this.state.activeIndex === 0}
                  index={0}
                  onClick={this.handleClick}
                >
                  <Icon name="dropdown" />
                  <MdUpdate style={updateIconStyle} />
                  24-03-2023 <b>Created Updates Page</b>
                </Accordion.Title>
                <Accordion.Content active={this.state.activeIndex === 0}>
                  <p>
                    This page is created in order for users to see bug fixes,
                    updates and changes in Group Plan.
                  </p>
                  <p>
                    Each entry will have a date, a title and a paragraph
                    containing details about the change.
                  </p>
                </Accordion.Content>
              </Accordion>
            </>
          )}
        </div>
        <Footer />
      </div>
    );
  }
}

export default Update;
