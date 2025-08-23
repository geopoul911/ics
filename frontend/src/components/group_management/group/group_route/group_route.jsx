// Built-ins
import React from "react";

// Icons
import { BsInfoSquare } from "react-icons/bs";

// Functions
import { Card } from "react-bootstrap";

// Custom Made Components
import GoogleMap from "./maps/google_map";

// CSS
import "react-tabs/style/react-tabs.css";

// Global Variables
import { pageHeader, loader } from "../../../global_vars";

class GroupRoute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return this.props.isLoaded ? (
      <>
        <div className="rootContainer">
          {pageHeader("group_route", this.props.group.refcode)}
          <Card>
            <Card.Header>Group's Route</Card.Header>
            <Card.Body>
              {this.props.group.group_travelday.length > 0 ? (
                <GoogleMap
                  group={this.props.group}
                  departure_lat={this.props.departure_lat}
                  departure_lng={this.props.departure_lng}
                  arrival_lat={this.props.arrival_lat}
                  arrival_lng={this.props.arrival_lng}
                />
              ) : (
                <h2
                  style={{
                    textAlign: "center",
                    margin: "0 auto",
                    paddingTop: 60,
                    paddingBottom: 60,
                  }}
                >
                  No data to show. Please update Group's Schedule to see the
                  route.
                </h2>
              )}
            </Card.Body>
            <Card.Footer>
              <small className="mr-auto">
                <BsInfoSquare
                  style={{
                    color: "#F3702D",
                    fontSize: "1.5em",
                    marginRight: "0.5em",
                  }}
                />
                Route is calculated using group's schedule data
              </small>
            </Card.Footer>
          </Card>
        </div>
      </>
    ) : (
      <div style={{ minHeight: 776 }}>{loader()}</div>
    );
  }
}

export default GroupRoute;
