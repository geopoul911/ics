// Built-ins
import React from "react";

// Modules
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// CSS
import "react-tabs/style/react-tabs.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import ClientOverView from "./client_overview/client_overview";
import Gallery from "../../core/gallery/gallery";
import ClientGroups from "./client_groups/client_groups";
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

function getClientId() {
  return window.location.pathname.split("/")[3];
}


// Variables
const VIEW_CLIENT = "http://localhost:8000/api/data_management/client/";

// Client page Class
class Client extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      client: {},
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
      .get(VIEW_CLIENT + getClientId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          client: res.data.client,
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
      .get(VIEW_CLIENT + getClientId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          client: res.data.client,
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
            <Tab>Groups</Tab>
            <Tab>Documents</Tab>
          </TabList>
          <TabPanel>
            <ClientOverView />
          </TabPanel>
          <TabPanel>
            <Gallery object={this.state.client} object_type={"Client"} />
          </TabPanel>
          <TabPanel>
            <ClientGroups />
          </TabPanel>
          <TabPanel>
            <Documents object={this.state.client} is_loaded={this.state.is_loaded} object_type={"Client"} update_state={this.update_state} />
          </TabPanel>
        </Tabs>
        <Footer />
      </div>
    );
  }
}

export default Client;
