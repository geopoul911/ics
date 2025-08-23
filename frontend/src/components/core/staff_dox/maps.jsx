// Built-ins
import React from "react";

// Modules / Functions

// Icons / Images
import mapFilterImage from "../../../images/dox/map_filters.png";
import hoverHotelMapImage from "../../../images/dox/hover_hotel_map.png";
import getSurroudingObjectsModalImage from "../../../images/dox/get_surrounding_objects_modal.png";
import surroundingOperators from "../../../images/dox/surrounding_operators.png";
import sendMassMailImage from "../../../images/dox/send_mass_mail.png";

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
        <div>
          <h1 className="dox_h1">Maps</h1>
          <hr />
          <h3 className="dox_h3">What can I do on the maps page?</h3>
          <br />
          <span>
            <p>
              On the maps page, a user can see objects based on their lat/lng
              values.
            </p>
            <p>Values having no lat/lng are not visible.</p>
            <p>The objects available are:</p>
            <ul style={{ listStyle: "circle", marginLeft: 20 }}>
              <li> Coach Operators </li>
              <li> Cruising Companies </li>
              <li> Ferry Ticket Agencies </li>
              <li> DMCs </li>
              <li> Guides </li>
              <li> Hotels </li>
              <li> Repair Shops </li>
              <li> Restaurants </li>
              <li> Sport Event Suppliers </li>
              <li> Teleferik Companies </li>
              <li> Theaters </li>
              <li> Train Ticket Agencies </li>
            </ul>
            <p>
              Objects can be filtered either by selecting a specific object, or
              a place:
            </p>
            <img src={mapFilterImage} alt="" className="dox_responsive_img" />
          </span>
          <hr />
          <h3 className="dox_h3">Getting Surrounding Objects</h3>
          <br />
          <span>
            <p>
              After getting results on a map, if you hover over a pin, its
              details will show up. example:
            </p>
            <img
              src={hoverHotelMapImage}
              alt=""
              className="dox_responsive_img"
            />
            <p>
              In this example we see the hotel's pin getting the orange -black
              color, and it's details shown in a card.
            </p>
            <p>
              By clicking on a pin, a new modal opens up, which allows us to
              select surrounding objects. example:
            </p>
            <img
              src={getSurroudingObjectsModalImage}
              alt=""
              className="dox_responsive_img"
            />
            <p>
              fill the filters to get surrounding objects, here is an example of
              getting surrouding coach operators on a hotel:
            </p>
            <img
              src={surroundingOperators}
              alt=""
              className="dox_responsive_img"
            />
          </span>
          <hr />
          <h3 className="dox_h3">Other Functionalities</h3>
          <br />
          <span>
            <ul style={{ listStyle: "circle" }}>
              <li>Show As Cluster</li>
              <p>
                We can show pins as clusters, or show all of them individually
              </p>
              <li>Erase pins</li>
              <p> This button is removing all the pins of the map</p>
              <li> Send Massive Emails </li>
            </ul>
          </span>
          <hr />
          <h3 className="dox_h3">Sending Massive Emails</h3>
          <br />
          <span>
            <ul style={{ listStyle: "circle" }}>
              <li>
                All of the email addresses of the pin shown on the map, will be
                shown if the user presses the Send Massive email button.
              </li>
              <li>
                A new Modal will also appear with the email's details to fill.
              </li>
              <img
                src={sendMassMailImage}
                alt=""
                className="dox_responsive_img"
              />
              <li>
                At the end of the modal, email addresses will be shown next to
                checkboxes, check the boxes you want to make a list of the
                email's recipients.
                <br />
                or check the "Select All Email Recipients" box
              </li>
            </ul>
          </span>
        </div>
      </>
    );
  }
}

export default Reports;
