// Built-ins
import React from "react";

// Modules
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// CSS
import "react-tabs/style/react-tabs.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import RepairShopOverView from "./repair_shop_overview/repair_shop_overview";
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

function getRepairShopId() {
  return window.location.pathname.split("/")[3];
}


// Variables
const VIEW_REPAIR_SHOP = "http://localhost:8000/api/data_management/repair_shop/";


class RepairShop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      repair_shop: {},
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
      .get(VIEW_REPAIR_SHOP + getRepairShopId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          repair_shop: res.data.repair_shop,
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
      .get(VIEW_REPAIR_SHOP + getRepairShopId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          repair_shop: res.data.repair_shop,
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
        <div id="dm_tab">
          <Tabs>
            <TabList>
              <Tab> Overview </Tab>
              <Tab>Documents</Tab>
            </TabList>
            <TabPanel>
              <RepairShopOverView />
            </TabPanel>
            <TabPanel>
            <Documents object={this.state.repair_shop} is_loaded={this.state.is_loaded} object_type={"RepairShop"} update_state={this.update_state} />
          </TabPanel>
          </Tabs>
        </div>
        <Footer />
      </div>
    );
  }
}

export default RepairShop;
