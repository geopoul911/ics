// Built-ins
import React from "react";

// Modules
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// CSS
import "react-tabs/style/react-tabs.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import FerryTicketAgencyOverView from "./ferry_ticket_agency_overview/ferry_ticket_agency_overview";
import FerryTicketAgencyRoutes from "./ferry_ticket_agency_routes/ferry_ticket_agency_routes";
import Documents from "../../core/documents/documents";
import FerryTicketAgencyGroups from "./ferry_ticket_agency_groups/ferry_ticket_agency_groups";

// Global Variables
import {
  headers,
  restrictedUsers,
} from "../../global_vars";

import axios from "axios";
import Swal from "sweetalert2";

// Variables
window.Swal = Swal;

function getFerryTicketAgencyId() {
  return window.location.pathname.split("/")[3];
}


// Variables
const VIEW_FERRY_TICKET_AGENCY = "http://localhost:8000/api/data_management/ferry_ticket_agency/";


class FerryTicketAgency extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ferry_ticket_agency: {},
      is_loaded: false,
    };
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

  update_state = () => {
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
  };


  render() {
    return (
      <div>
        <NavigationBar />
        <Tabs>
          <TabList>
            <Tab> Overview </Tab>
            <Tab> Routes </Tab>
            <Tab>Documents</Tab>
            <Tab>Groups</Tab>
          </TabList>
          <TabPanel>
            <FerryTicketAgencyOverView />
          </TabPanel>
          <TabPanel>
            <FerryTicketAgencyRoutes />
          </TabPanel>
          <TabPanel>
            <Documents object={this.state.ferry_ticket_agency} is_loaded={this.state.is_loaded} object_type={"FerryTicketAgency"} update_state={this.update_state} />
          </TabPanel>
          <TabPanel>
            <FerryTicketAgencyGroups />
          </TabPanel>
        </Tabs>
        <Footer />
      </div>
    );
  }
}

export default FerryTicketAgency;
