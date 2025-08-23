// Built-ins
import React from "react";

// Modules
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// CSS
import "react-tabs/style/react-tabs.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import TrainTicketAgencyOverView from "./train_ticket_agency_overview/train_ticket_agency_overview";
import Documents from "../../core/documents/documents";
import TrainTicketAgencyGroups from "./train_ticket_agency_groups/train_ticket_agency_groups";

// Global Variables
import {
  headers,
  restrictedUsers,
} from "../../global_vars";

import axios from "axios";
import Swal from "sweetalert2";

// Variables
window.Swal = Swal;

function getTrainTicketAgencyId() {
  return window.location.pathname.split("/")[3];
}


// Variables
const VIEW_TRAIN_TICKET_AGENCY = "http://localhost:8000/api/data_management/train_ticket_agency/";

class TrainTicketAgency extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      train_ticket_agency: {},
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
      .get(VIEW_TRAIN_TICKET_AGENCY + getTrainTicketAgencyId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          train_ticket_agency: res.data.train_ticket_agency,
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
      .get(VIEW_TRAIN_TICKET_AGENCY + getTrainTicketAgencyId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          train_ticket_agency: res.data.train_ticket_agency,
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
            <Tab>Documents</Tab>
            <Tab>Groups</Tab>
          </TabList>
          <TabPanel>
            <TrainTicketAgencyOverView />
          </TabPanel>
          <TabPanel>
            <Documents object={this.state.train_ticket_agency} is_loaded={this.state.is_loaded} object_type={"TrainTicketAgency"} update_state={this.update_state} />
          </TabPanel>
          <TabPanel>
            <TrainTicketAgencyGroups />
          </TabPanel>
        </Tabs>
        <Footer />
      </div>
    );
  }
}

export default TrainTicketAgency;
