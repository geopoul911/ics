// Built-ins
import React from "react";

// Modules
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// CSS
import "react-tabs/style/react-tabs.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import CharterBrokerOverView from "./charter_broker_overview/charter_broker_overview";
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

function getCharterBrokerId() {
  return window.location.pathname.split("/")[3];
}


// Variables
const VIEW_CHARTER_BROKER = "http://localhost:8000/api/data_management/charter_broker/";

class CharterBroker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      charter_broker: {},
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
      .get(VIEW_CHARTER_BROKER + getCharterBrokerId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          charter_broker: res.data.charter_broker,
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
      .get(VIEW_CHARTER_BROKER + getCharterBrokerId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          charter_broker: res.data.charter_broker,
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
          </TabList>
          <TabPanel>
            <CharterBrokerOverView />
          </TabPanel>
          <TabPanel>
            <Documents object={this.state.charter_broker} is_loaded={this.state.is_loaded} object_type={"CharterBroker"} update_state={this.update_state} />
          </TabPanel>
        </Tabs>
        <Footer />
      </div>
    );
  }
}

export default CharterBroker;
