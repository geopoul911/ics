// Built-ins
import React from "react";

// Icons-images
import { BsInfoSquare } from "react-icons/bs";

// Custom Made Components
import AddTerminal from "../../../modals/airports/add_terminal";
import DeleteTerminal from "../../../modals/airports/delete_terminal";

// Functions / modules
import axios from "axios";
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import {
  headers,
  loader,
  iconStyle,
  pageHeader,
  forbidden,
} from "../../../global_vars";

// Variables
window.Swal = Swal;

const VIEW_AIRPORT = "http://localhost:8000/api/data_management/airport/";

function getAirportId() {
  return window.location.pathname.split("/")[3];
}

class AirportOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      airport: {},
      notes: {},
      is_loaded: false,
      forbidden: false,
    };
  }

  componentDidMount() {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_AIRPORT + getAirportId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          airport: res.data.airport,
          notes: res.data.airport.notes,
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
    this.setState({ airport: update_state });
  };

  render() {
    return (
      <>
        <div className="mainContainer">
          {pageHeader("airport_terminal", this.state.airport.name)}
          {this.state.forbidden ? (
            <>{forbidden("Updates")}</>
          ) : this.state.is_loaded ? (
            <>
              <Grid divided stackable>
                <Grid.Column width={4}>
                  <Card>
                    <Card.Header>
                      <BsInfoSquare style={iconStyle} />
                      Terminals
                    </Card.Header>
                    <Card.Body>
                      {this.state.airport.airport_terminal.length === 0 ? (
                        <p> This airport has no terminals added yet. </p>
                      ) : (
                        ""
                      )}
                      {this.state.airport.airport_terminal.map((e, j) => {
                        if (
                          this.state.airport.airport_terminal.length ===
                          j + 1
                        ) {
                          return (
                            <>
                              <DeleteTerminal
                                terminal_id={e.id}
                                update_state={this.update_state}
                              />
                              <p>
                                {j + 1}) {e.name}
                              </p>
                            </>
                          );
                        } else {
                          return (
                            <>
                              <DeleteTerminal
                                terminal_id={e.id}
                                update_state={this.update_state}
                              />
                              <p>
                                {j + 1}) {e.name}
                              </p>
                              <hr />
                            </>
                          );
                        }
                      })}
                    </Card.Body>
                    <Card.Footer>
                      <AddTerminal
                        name={this.state.airport.name}
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

export default AirportOverView;
