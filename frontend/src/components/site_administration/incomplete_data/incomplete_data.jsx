// Built-ins
import React from "react";

// Modules / Functions
import axios from "axios";
import { Form, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";

// CSS
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-tabs/style/react-tabs.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import IncompleteGroup from "./tables/incomplete_group";
import IncompleteAgent from "./tables/incomplete_agent";
import IncompleteAirline from "./tables/incomplete_airline";
import IncompleteAttraction from "./tables/incomplete_attraction";
import IncompleteCruisingCompany from "./tables/incomplete_cruising_company";
import IncompleteDestinationManagement from "./tables/incomplete_dmc";
import IncompleteRestaurant from "./tables/incomplete_restaurant";
import IncompleteFerryTicketAgency from "./tables/incomplete_ferry_ticket_agency";
import IncompleteUser from "./tables/incomplete_user";
import IncompleteAirport from "./tables/incomplete_airport";
import IncompleteClient from "./tables/incomplete_client";
import IncompleteCoach from "./tables/incomplete_coach";
import IncompleteCoachOperator from "./tables/incomplete_coach_operator";
import IncompleteDriver from "./tables/incomplete_driver";
import IncompleteHotel from "./tables/incomplete_hotel";
import IncompleteLeader from "./tables/incomplete_leader";
import IncompleteRepairShop from "./tables/incomplete_repair_shop";
import IncompleteGuide from "./tables/incomplete_guide";
import IncompleteTeleferikCompany from "./tables/incomplete_teleferik_company";
import IncompleteTheater from "./tables/incomplete_theater";
import IncompleteTrainTicketAgency from "./tables/incomplete_train_ticket_agency";
import IncompleteSportEventSupplier from "./tables/incomplete_sport_event_supplier";

// Global Variables
import {
  headers,
  loader,
  pageHeader,
  forbidden,
  restrictedUsers,
} from "../../global_vars";

// Variables
window.Swal = Swal;

const GET_INCOMPLETE_DATA =
  "http://localhost:8000/api/site_admin/incomplete_data/";

const MODEL_NAMES = [
  "Agent",
  "Airline",
  "Airport",
  "Attraction",
  "Client",
  "Coach Operator",
  "Coach",
  "Cruising Company",
  "Driver",
  "DMC",
  "GroupTransfer",
  "Group Leader",
  "Guide",
  "Hotel",
  "Repair Shop",
  "Restaurant",
  "Ferry Ticket Agency",
  "Teleferik Company",
  "Theater",
  "Train Ticket Agency",
  "Sport Event Supplier",
  "User",
];

class IncompleteData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      is_loaded: false,
      incomplete_data: [],
      selected_model: "Agent",
      forbidden: false,
    };
    this.changeTab = this.changeTab.bind(this);
  }

  componentDidMount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    axios
      .get(GET_INCOMPLETE_DATA, {
        headers: headers,
        params: {
          selected_model: this.state.selected_model,
        },
      })
      .then((res) => {
        this.setState({
          incomplete_data: res.data.incomplete_data,
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

  changeTab(e) {
    this.setState({
      is_loaded: false,
      selected_model: e.target.value,
    });
    axios
      .get(GET_INCOMPLETE_DATA, {
        headers: headers,
        params: {
          selected_model: e.target.value,
        },
      })
      .then((res) => {
        this.setState({
          incomplete_data: res.data.incomplete_data,
          is_loaded: true,
        });
      });
  }

  render() {
    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("incomplete_data")}

          {this.state.forbidden ? (
            <>{forbidden("Incomplete Data")}</>
          ) : this.state.is_loaded ? (
            <>
              <Form.Group as={Row} style={{ margin: 20 }} className="mb-3">
                <Form.Label column sm="1">
                  Select Object:
                </Form.Label>
                <Col sm="6">
                  <select
                    className="form-control"
                    style={{ width: 300, marginBottom: 10 }}
                    onChange={(e) => this.changeTab(e)}
                    value={this.state.selected_model}
                  >
                    {MODEL_NAMES.map((model) => (
                      <option value={model}>{model}</option>
                    ))}
                  </select>
                </Col>
              </Form.Group>
              <hr />
              {this.state.selected_model === "GroupTransfer" ? (
                <IncompleteGroup data={this.state.incomplete_data} />
              ) : (
                ""
              )}
              {this.state.selected_model === "Agent" ? (
                <IncompleteAgent data={this.state.incomplete_data} />
              ) : (
                ""
              )}
              {this.state.selected_model === "Airline" ? (
                <IncompleteAirline data={this.state.incomplete_data} />
              ) : (
                ""
              )}
              {this.state.selected_model === "Attraction" ? (
                <IncompleteAttraction data={this.state.incomplete_data} />
              ) : (
                ""
              )}
              {this.state.selected_model === "User" ? (
                <IncompleteUser data={this.state.incomplete_data} />
              ) : (
                ""
              )}
              {this.state.selected_model === "Airport" ? (
                <IncompleteAirport data={this.state.incomplete_data} />
              ) : (
                ""
              )}
              {this.state.selected_model === "Client" ? (
                <IncompleteClient data={this.state.incomplete_data} />
              ) : (
                ""
              )}
              {this.state.selected_model === "Coach" ? (
                <IncompleteCoach data={this.state.incomplete_data} />
              ) : (
                ""
              )}
              {this.state.selected_model === "Coach Operator" ? (
                <IncompleteCoachOperator data={this.state.incomplete_data} />
              ) : (
                ""
              )}

              {this.state.selected_model === "Cruising Company" ? (
                <IncompleteCruisingCompany data={this.state.incomplete_data} />
              ) : (
                ""
              )}

              {this.state.selected_model === "Driver" ? (
                <IncompleteDriver data={this.state.incomplete_data} />
              ) : (
                ""
              )}

              {this.state.selected_model === "DMC" ? (
                <IncompleteDestinationManagement
                  data={this.state.incomplete_data}
                />
              ) : (
                ""
              )}

              {this.state.selected_model === "Group Leader" ? (
                <IncompleteLeader data={this.state.incomplete_data} />
              ) : (
                ""
              )}

              {this.state.selected_model === "Guide" ? (
                <IncompleteGuide data={this.state.incomplete_data} />
              ) : (
                ""
              )}

              {this.state.selected_model === "Hotel" ? (
                <IncompleteHotel data={this.state.incomplete_data} />
              ) : (
                ""
              )}

              {this.state.selected_model === "Restaurant" ? (
                <IncompleteRestaurant data={this.state.incomplete_data} />
              ) : (
                ""
              )}

              {this.state.selected_model === "Ferry Ticket Agency" ? (
                <IncompleteFerryTicketAgency
                  data={this.state.incomplete_data}
                />
              ) : (
                ""
              )}

              {this.state.selected_model === "Teleferik Company" ? (
                <IncompleteTeleferikCompany data={this.state.incomplete_data} />
              ) : (
                ""
              )}
              {this.state.selected_model === "Theater" ? (
                <IncompleteTheater data={this.state.incomplete_data} />
              ) : (
                ""
              )}

              {this.state.selected_model === "Train Ticket Agency" ? (
                <IncompleteTrainTicketAgency
                  data={this.state.incomplete_data}
                />
              ) : (
                ""
              )}

              {this.state.selected_model === "Repair Shop" ? (
                <IncompleteRepairShop data={this.state.incomplete_data} />
              ) : (
                ""
              )}

              {this.state.selected_model === "Sport Event Supplier" ? (
                <IncompleteSportEventSupplier
                  data={this.state.incomplete_data}
                />
              ) : (
                ""
              )}
            </>
          ) : (
            loader()
          )}
        </div>
        <Footer />
      </>
    );
  }
}

export default IncompleteData;
