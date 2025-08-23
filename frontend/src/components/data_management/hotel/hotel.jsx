// Built-ins
import React from "react";

// Modules
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// CSS
import "react-tabs/style/react-tabs.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import HotelOverView from "./hotel_overview/hotel_overview";
import Gallery from "../../core/gallery/gallery";
import HotelAmenities from "./hotel_amenities/hotel_amenities";
import HotelGroups from "./hotel_groups/hotel_groups";
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

function getHotelId() {
  return window.location.pathname.split("/")[3];
}


// Variables
const VIEW_AGENT = "http://localhost:8000/api/data_management/hotel/";

// hotel page Class
class Hotel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hotel: {},
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
      .get(VIEW_AGENT + getHotelId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          hotel: res.data.hotel,
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
      .get(VIEW_AGENT + getHotelId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          hotel: res.data.hotel,
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
            <Tab>Amenities</Tab>
            <Tab>Groups</Tab>
            <Tab>Documents</Tab>
          </TabList>
          <TabPanel>
            <HotelOverView />
          </TabPanel>
          <TabPanel>
            <Gallery object={this.state.hotel} object_type={"Hotel"} />
          </TabPanel>
          <TabPanel>
            <HotelAmenities />
          </TabPanel>
          <TabPanel>
            <HotelGroups />
          </TabPanel>
          <TabPanel>
            <Documents object={this.state.hotel} is_loaded={this.state.is_loaded} object_type={"Hotel"} update_state={this.update_state} />
          </TabPanel>
        </Tabs>
        <Footer />
      </div>
    );
  }
}

export default Hotel;
