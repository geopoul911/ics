// Built-ins
import React from "react";

// Modules
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// CSS
import "react-tabs/style/react-tabs.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import AttractionOverView from "./attraction_overview/attraction_overview";
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

function getAttractionId() {
  return window.location.pathname.split("/")[3];
}


// Variables
const VIEW_ATTRACTION = "http://localhost:8000/api/data_management/attraction/";

// attraction page Class
class Attraction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attraction: {},
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
      .get(VIEW_ATTRACTION + getAttractionId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          attraction: res.data.attraction,
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
      .get(VIEW_ATTRACTION + getAttractionId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          attraction: res.data.attraction,
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
          </TabList>
          <TabPanel>
            <AttractionOverView />
          </TabPanel>
          <TabPanel>
            <Gallery
              object={this.state.attraction}
              object_type={"Attraction"}
            />
          </TabPanel>
          <TabPanel>
            <Documents object={this.state.attraction} is_loaded={this.state.is_loaded} object_type={"Attraction"} update_state={this.update_state} />
          </TabPanel>
        </Tabs>
        <Footer />
      </div>
    );
  }
}

export default Attraction;
