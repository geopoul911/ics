// Built-ins
import React from "react";

// Icons / Images
import { BsInfoSquare } from "react-icons/bs";

// Modules / Functions
import axios from "axios";
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import {
  headers,
  loader,
  pageHeader,
  forbidden,
  restrictedUsers,
} from "../../../global_vars";

// Variables
window.Swal = Swal;

const VIEW_PLACE = "http://localhost:8000/api/data_management/place/";

function getPlaceId() {
  return window.location.pathname.split("/")[3];
}

class PlaceOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      place: {},
      attractions: [],
      notes: {},
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
      .get(VIEW_PLACE + getPlaceId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          place: res.data.place,
          attractions: res.data.attractions,
          notes: res.data.place.notes,
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
    this.setState({ place: update_state });
  };

  refresh = () => {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_PLACE + getPlaceId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          place: res.data.place,
          coach_operator: res.data.coach_operator,
          notes: res.data.place.notes,
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
  };

  update_coach_op = (coach_operator) => {
    this.setState({ coach_operator: coach_operator });
  };

  render() {
    return (
      <>
        <div className="mainContainer">
          {pageHeader(
            "place_attractions",
            `${this.state.place.city} - ${this.state.place.country}`
          )}

          {this.state.forbidden ? (
            <>{forbidden("Place Attractions")}</>
          ) : this.state.is_loaded ? (
            <>
              <Grid columns={2} divided stackable>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <BsInfoSquare
                        style={{
                          color: "#F3702D",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      To add or edit attractions, head over to Data Management /
                      Attractions
                    </Card.Header>
                    <Card.Body>
                      {this.state.attractions.length > 0 ? (
                        this.state.attractions.map((e, j) => {
                          return (
                            <>
                              <a href={"/data_management/attraction/" + e.id}>
                                <p>
                                  {j + 1}) {e.name}
                                </p>
                              </a>
                              <hr />
                            </>
                          );
                        })
                      ) : (
                        <div style={{ textAlign: "center", color: "red" }}>
                          <b>This place has no attractions added yet.</b>
                        </div>
                      )}
                    </Card.Body>
                    <Card.Footer></Card.Footer>
                  </Card>
                </Grid.Column>
                <Grid.Column></Grid.Column>
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

export default PlaceOverView;
