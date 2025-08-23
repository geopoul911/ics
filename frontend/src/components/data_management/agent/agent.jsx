// Built-ins
import React from "react";

// Modules
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// CSS
import "react-tabs/style/react-tabs.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import AgentOverView from "./agent_overview/agent_overview";
import AgentGroups from "./agent_groups/agent_groups";
import Gallery from "../../core/gallery/gallery";
import Documents from "../../core/documents/documents";

// Global Variables
import {
  headers,
  restrictedUsers,
} from "../../global_vars";

import axios from "axios";
import Swal from "sweetalert2";

// Variables
window.Swal = Swal;

function getAgentId() {
  return window.location.pathname.split("/")[3];
}


// Variables
const VIEW_AGENT = "http://localhost:8000/api/data_management/agent/";

class Agent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      agent: {},
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
      .get(VIEW_AGENT + getAgentId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          agent: res.data.agent,
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
      .get(VIEW_AGENT + getAgentId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          agent: res.data.agent,
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
            <Tab>Overview</Tab>
            <Tab>Gallery</Tab>
            <Tab>Documents</Tab>
            <Tab>Groups</Tab>
          </TabList>
          <TabPanel>
            <AgentOverView />
          </TabPanel>
          <TabPanel>
            <Gallery object={this.state.agent} object_type={"Agent"} />
          </TabPanel>
          <TabPanel>
            <Documents object={this.state.agent} is_loaded={this.state.is_loaded} object_type={"Agent"} update_state={this.update_state} />
          </TabPanel>
          <TabPanel>
            <AgentGroups />
          </TabPanel>
        </Tabs>
        <Footer />
      </div>
    );
  }
}

export default Agent;
