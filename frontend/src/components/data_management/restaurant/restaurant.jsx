// Built-ins
import React from "react";

// Modules
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// CSS
import "react-tabs/style/react-tabs.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import RestaurantOverView from "./restaurant_overview/restaurant_overview";
import Gallery from "../../core/gallery/gallery";
import RestaurantMenus from "./restaurant_menus/restaurant_menus";
import Documents from "../../core/documents/documents";
import RestaurantGroups from "./restaurant_groups/restaurant_groups";

// Global Variables
import {
  headers,
  restrictedUsers,
} from "../../global_vars";

import axios from "axios";
import Swal from "sweetalert2";

// Variables
window.Swal = Swal;

function getRestaurantId() {
  return window.location.pathname.split("/")[3];
}


// Variables
const VIEW_RESTAURANT = "http://localhost:8000/api/data_management/restaurant/";

class Restaurant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurant: {},
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
      .get(VIEW_RESTAURANT + getRestaurantId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          restaurant: res.data.restaurant,
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
      .get(VIEW_RESTAURANT + getRestaurantId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          restaurant: res.data.restaurant,
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
            <Tab>Menus</Tab>
            <Tab>Documents</Tab>
            <Tab>Groups</Tab>
          </TabList>
          <TabPanel>
            <RestaurantOverView />
          </TabPanel>
          <TabPanel>
            <Gallery
              object={this.state.restaurant}
              object_type={"Restaurant"}
            />
          </TabPanel>
          <TabPanel>
            <RestaurantMenus />
          </TabPanel>
          <TabPanel>
            <Documents object={this.state.restaurant} is_loaded={this.state.is_loaded} object_type={"Restaurant"} update_state={this.update_state} />
          </TabPanel>
          <TabPanel>
            <RestaurantGroups />
          </TabPanel>
        </Tabs>
        <Footer />
      </div>
    );
  }
}

export default Restaurant;
