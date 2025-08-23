// Built-ins
import React from "react";

// Modules
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// CSS
import "react-tabs/style/react-tabs.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import CoachOperatorOverView from "./coach_operator_overview/coach_operator_overview";
import CoachOperatorCoaches from "./coach_operator_coaches/coach_operator_coaches";
import CoachOperatorGroups from "./coach_operator_groups/coach_operator_groups";
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

function getCoachOperatorId() {
  return window.location.pathname.split("/")[3];
}


// Variables
const VIEW_COACH_OPERATOR = "http://localhost:8000/api/data_management/coach_operator/";

class CoachOperator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coach_operator: {},
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
      .get(VIEW_COACH_OPERATOR + getCoachOperatorId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          coach_operator: res.data.coach_operator,
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
      .get(VIEW_COACH_OPERATOR + getCoachOperatorId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          coach_operator: res.data.coach_operator,
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
            <Tab> Coaches </Tab>
            <Tab> Gallery </Tab>
            <Tab>Documents</Tab>
            <Tab>Groups</Tab>
          </TabList>
          <TabPanel>
            <CoachOperatorOverView />
          </TabPanel>
          <TabPanel>
            <CoachOperatorCoaches />
          </TabPanel>
          <TabPanel>
            <Gallery
              object={this.state.coach_operator}
              object_type={"Coach Operator"}
            />
          </TabPanel>
          <TabPanel>
            <Documents object={this.state.coach_operator} is_loaded={this.state.is_loaded} object_type={"CoachOperator"} update_state={this.update_state} />
          </TabPanel>
          <TabPanel>
            <CoachOperatorGroups />
          </TabPanel>
        </Tabs>
        <Footer />
      </div>
    );
  }
}

export default CoachOperator;
