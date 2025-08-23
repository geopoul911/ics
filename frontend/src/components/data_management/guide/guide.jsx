// Built-ins
import React from "react";

// Modules
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// CSS
import "react-tabs/style/react-tabs.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import GuideOverView from "./guide_overview/guide_overview";
import Gallery from "../../core/gallery/gallery";
import Documents from "../../core/documents/documents";
import GuideGroups from "./guide_groups/guide_groups";

// Global Variables
import {
  headers,
  restrictedUsers,
} from "../../global_vars";

import axios from "axios";
import Swal from "sweetalert2";

// Variables
window.Swal = Swal;

function getGuideId() {
  return window.location.pathname.split("/")[3];
}


// Variables
const VIEW_GUIDE = "http://localhost:8000/api/data_management/guide/";

class Guide extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      guide: {},
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
      .get(VIEW_GUIDE + getGuideId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          guide: res.data.guide,
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
      .get(VIEW_GUIDE + getGuideId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          guide: res.data.guide,
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
            <Tab> Gallery </Tab>
            <Tab>Documents</Tab>
            <Tab>Groups</Tab>
          </TabList>
          <TabPanel>
            <GuideOverView />
          </TabPanel>
          <TabPanel>
            <Gallery object={this.state.guide} object_type={"Guide"} />
          </TabPanel>
          <TabPanel>
            <Documents object={this.state.guide} is_loaded={this.state.is_loaded} object_type={"Guide"} update_state={this.update_state} />
          </TabPanel>
          <TabPanel>
            <GuideGroups />
          </TabPanel>
        </Tabs>
        <Footer />
      </div>
    );
  }
}

export default Guide;
