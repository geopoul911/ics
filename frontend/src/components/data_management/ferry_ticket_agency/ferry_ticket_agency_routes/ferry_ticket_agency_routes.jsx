// Built-ins
import React from "react";

// Modules / Functions
import axios from "axios";
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import Swal from "sweetalert2";

// Icons / Images
import { BsInfoSquare } from "react-icons/bs";

// Custom Made Components
import AddRoute from "../../../modals/ferry_ticket_agencies/add_route";
import DeleteRoute from "../../../modals/ferry_ticket_agencies/delete_route";

// Global Variables
import {
  headers,
  loader,
  pageHeader,
  forbidden,
  restrictedUsers,
  iconStyle,
} from "../../../global_vars";

// Variables
window.Swal = Swal;

const VIEW_FERRY_TICKET_AGENCY = "http://localhost:8000/api/data_management/ferry_ticket_agency/";

function getFerryTicketAgencyId() {
  return window.location.pathname.split("/")[3];
}

class FerryTicketAgencyRoutes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ferry_ticket_agency: {},
      contact_persons: [],
      is_loaded: false,
      forbidden: false,
    };
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_FERRY_TICKET_AGENCY + getFerryTicketAgencyId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          ferry_ticket_agency: res.data.ferry_ticket_agency,
          is_loaded: true,
        });
      })
      .catch((e) => {
        if (e.response.status === 401) {
          this.setState({
            forbidden: true,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An unknown error has occured.",
          });
        }
      });
    }

  update_state = (update_state) => {
    this.setState({ ferry_ticket_agency: update_state });
  };

  refresh = () => {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_FERRY_TICKET_AGENCY + getFerryTicketAgencyId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          ferry_ticket_agency: res.data.ferry_ticket_agency,
          is_loaded: true,
        });
      });
  };

  update_ferry_ticket_agency = (ferry_ticket_agency) => {
    this.setState({ ferry_ticket_agency: ferry_ticket_agency });
  };

  render() {

    console.log(this.state.ferry_ticket_agency)
    return (
      <>
        <div className="mainContainer">
          {pageHeader("ferry_ticket_agency_routes", this.state.ferry_ticket_agency.name)}
          {this.state.forbidden ? (
            <>{forbidden("All Ferry Ticket Agencies")}</>
          ) : this.state.is_loaded ? (
            <>
              <Grid divided stackable>
                <Grid.Column width={8}>
                  <Card>
                    <Card.Header>
                      <BsInfoSquare style={iconStyle} /> Routes
                    </Card.Header>
                    <Card.Body>
                      {this.state.ferry_ticket_agency.ferry_ticket_agency_route.length === 0 ? (
                        <p> This Ferry Ticket Agency has no routes. </p>
                      ) : (
                        ""
                      )}

                      {this.state.ferry_ticket_agency.ferry_ticket_agency_route.map((e, j) => {
                        return (
                          <>
                            <DeleteRoute
                              route_id={e.id}
                              update_state={this.update_state}
                            />
                            <p>
                              {j + 1}) {e.source} {" >>-----> "} {e.destination}
                            </p>
                            <hr />
                          </>
                        );
                      })}
                    </Card.Body>
                    <Card.Footer>
                      <AddRoute
                        fta_id={this.state.ferry_ticket_agency.id}
                        update_state={this.update_state}
                      />
                    </Card.Footer>
                  </Card>
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

export default FerryTicketAgencyRoutes;
