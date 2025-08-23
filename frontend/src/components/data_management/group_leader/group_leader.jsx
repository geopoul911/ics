// Built-ins
import React from "react";

// Modules
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// CSS
import "react-tabs/style/react-tabs.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import GroupLeaderOverView from "./group_leader_overview/group_leader_overview";
import Gallery from "../../core/gallery/gallery";
import GroupLeaderGroups from "./leader_groups/leader_groups";
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

function getGroupLeaderId() {
  return window.location.pathname.split("/")[3];
}


// Variables
const VIEW_GROUP_LEADER = "http://localhost:8000/api/data_management/group_leader/";


class GroupLeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group_leader: {},
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
      .get(VIEW_GROUP_LEADER + getGroupLeaderId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          group_leader: res.data.group_leader,
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
      .get(VIEW_GROUP_LEADER + getGroupLeaderId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          group_leader: res.data.group_leader,
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
            <Tab> Groups </Tab>
            <Tab>Documents</Tab>
          </TabList>
          <TabPanel>
            <GroupLeaderOverView />
          </TabPanel>
          <TabPanel>
            <Gallery
              object={this.state.group_leader}
              object_type={"Group Leader"}
            />
          </TabPanel>
          <TabPanel>
            <GroupLeaderGroups />
          </TabPanel>
          <TabPanel>
            <Documents object={this.state.group_leader} is_loaded={this.state.is_loaded} object_type={"GroupLeader"} update_state={this.update_state} />
          </TabPanel>
        </Tabs>
        <Footer />
      </div>
    );
  }
}

export default GroupLeader;
