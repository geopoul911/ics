// Built-ins
import React from "react";

// Modules
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// CSS
import "react-tabs/style/react-tabs.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import AdvertisementCompanyOverView from "./advertisement_company_overview/advertisement_company_overview";
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

function getAdvertisementCompanyId() {
  return window.location.pathname.split("/")[3];
}


// Variables
const VIEW_ADVERTISEMENT_COMPANY = "http://localhost:8000/api/data_management/advertisement_company/";

class AdvertisementCompany extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      advertisement_company: {},
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
      .get(VIEW_ADVERTISEMENT_COMPANY + getAdvertisementCompanyId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          advertisement_company: res.data.advertisement_company,
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
      .get(VIEW_ADVERTISEMENT_COMPANY + getAdvertisementCompanyId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          advertisement_company: res.data.advertisement_company,
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
            <AdvertisementCompanyOverView />
          </TabPanel>
          <TabPanel>
            <Documents object={this.state.advertisement_company} is_loaded={this.state.is_loaded} object_type={"AdvertisementCompany"} update_state={this.update_state} />
          </TabPanel>
        </Tabs>
        <Footer />
      </div>
    );
  }
}

export default AdvertisementCompany;
