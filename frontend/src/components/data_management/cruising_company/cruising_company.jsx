// Built-ins
import React from "react";

// Modules
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// CSS
import "react-tabs/style/react-tabs.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import CruisingCompanyOverView from "./cruising_company_overview/cruising_company_overview";
import CruisingCompanyGroups from "./cruising_company_groups/cruising_company_groups";
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

function getCruisingCompanyId() {
  return window.location.pathname.split("/")[3];
}


// Variables
const VIEW_CRUISING_COMPANY = "http://localhost:8000/api/data_management/cruising_company/";


class CruisingCompany extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cruising_company: {},
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
      .get(VIEW_CRUISING_COMPANY + getCruisingCompanyId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          cruising_company: res.data.cruising_company,
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
      .get(VIEW_CRUISING_COMPANY + getCruisingCompanyId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          cruising_company: res.data.cruising_company,
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
            <Tab>Groups</Tab>
          </TabList>
          <TabPanel>
            <CruisingCompanyOverView />
          </TabPanel>
          <TabPanel>
            <Documents object={this.state.cruising_company} is_loaded={this.state.is_loaded} object_type={"CruisingCompany"} update_state={this.update_state} />
          </TabPanel>
          <TabPanel>
            <CruisingCompanyGroups />
          </TabPanel>
        </Tabs>
        <Footer />
      </div>
    );
  }
}

export default CruisingCompany;
