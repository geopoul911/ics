// Built-ins
import React from "react";

// Modules
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// CSS
import "react-tabs/style/react-tabs.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import SportEventSupplierOverView from "./sport_event_supplier_overview/sport_event_supplier_overview";
import Gallery from "../../core/gallery/gallery";
import Documents from "../../core/documents/documents";
import SportEventSupplierGroups from "./sport_event_supplier_groups/sport_event_supplier_groups";
// Global Variables
import {
  headers,
  restrictedUsers,
} from "../../global_vars";

import axios from "axios";
import Swal from "sweetalert2";

// Variables
window.Swal = Swal;

function getSportEventSupplierId() {
  return window.location.pathname.split("/")[3];
}


// Variables
const VIEW_SPORT_EVENT_SUPPLIER = "http://localhost:8000/api/data_management/sport_event_supplier/";

// sport_event_supplier page Class
class SportEventSupplier extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sport_event_supplier: {},
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
      .get(VIEW_SPORT_EVENT_SUPPLIER + getSportEventSupplierId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          sport_event_supplier: res.data.sport_event_supplier,
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
      .get(VIEW_SPORT_EVENT_SUPPLIER + getSportEventSupplierId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          sport_event_supplier: res.data.sport_event_supplier,
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
            <SportEventSupplierOverView />
          </TabPanel>
          <TabPanel>
            <Gallery
              object={this.state.sport_event_supplier}
              object_type={"Sport Event Supplier"}
            />
          </TabPanel>
          <TabPanel>
            <Documents object={this.state.sport_event_supplier} is_loaded={this.state.is_loaded} object_type={"SportEventSupplier"} update_state={this.update_state} />
          </TabPanel>
          <TabPanel>
            <SportEventSupplierGroups />
          </TabPanel>
        </Tabs>
        <Footer />
      </div>
    );
  }
}

export default SportEventSupplier;
