import React from "react";

// Modules
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import axios from "axios";
import Swal from "sweetalert2";

// CSS
import "react-tabs/style/react-tabs.css";
import "./group.css";

// Global Variables
import { headers } from "../../global_vars";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import GroupOverView from "./group_overview/group_overview";
import GroupSchedule from "./group_schedule/group_schedule";
import GroupServices from "./group_services/group_services";
import GroupPayments from "./group_payments/group_payments";
import GroupRoomingLists from "./group_rooming_lists/group_rooming_lists";
import GroupItinerary from "./group_itinerary/group_itinerary";
import GroupDocuments from "./group_documents/group_documents";
import GroupProformaInvoices from "./group_proforma_invoice/group_proforma_invoice";
import GroupRoute from "./group_route/group_route";

// Variables
window.Swal = Swal;

const VIEW_GROUP = "http://localhost:8000/api/groups/group/";

function getRefcode() {
  return window.location.pathname.split("/")[3];
}

// url path = '/group/TRB-LIN18062009GR'
class Group extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group: {
        notes: [],
      },
      arrival_lat: "",
      arrival_lng: "",
      departure_lat: "",
      departure_lng: "",
      isLoaded: false,
      selected_td_id: 0,
      selectedDate: "",
      cabin_lists: [],
      selectedView: "table",
      selectedTD: {
        hotel: "",
      },
    };
  }

  componentDidMount() {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_GROUP + getRefcode(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          group: res.data.group,
          notes: res.data.group.notes,
          coach_info_data: res.data.coach_info_data,
          can_del: res.data.can_del,
          arrival_lat: res.data.arrival_lat,
          arrival_lng: res.data.arrival_lng,
          departure_lat: res.data.departure_lat,
          departure_lng: res.data.departure_lng,
          cabin_lists: res.data.cabin_lists,
          isLoaded: true,
        });
      })
      .catch((e) => {
        console.log(e)
        Swal.fire({
          icon: "error",
          title: "Error status 401",
          text: e.response.data.errormsg,
        });
      });
  }

  update_state = () => {
    axios
      .get(VIEW_GROUP + getRefcode(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          group: res.data.group,
          notes: res.data.group.notes,
          coach_info_data: res.data.coach_info_data,
          can_del: res.data.can_del,
          arrival_lat: res.data.arrival_lat,
          arrival_lng: res.data.arrival_lng,
          departure_lat: res.data.departure_lat,
          departure_lng: res.data.departure_lng,
          cabin_lists: res.data.cabin_lists,
          isLoaded: true,
        });
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error status 401",
          text: e.response.data.errormsg,
        });
      });
  };

  update_notes = (notes) => {
    var group = { ...this.state.group };
    group.notes = notes;
    this.setState({
      group: group,
    });
  };

  setSelectedDate = (date) => {
    this.setState({
      selectedDate: date,
      selectedTD: this.state.group.group_travelday.filter(
        (td) => td.date === date
      )[0],
    });
  };

  setView = (view) => {
    this.setState({
      selectedView: view,
    });
  };

  updateIsLoaded = () => {
    this.setState({
      isLoaded: !this.state.isLoaded,
    });
  };

  render() {
    return (
      <div>
        <NavigationBar />
        <Tabs>
          <TabList>
            <Tab disabled={!this.state.isLoaded}>Overview</Tab>
            <Tab disabled={!this.state.isLoaded}>Schedule</Tab>
            <Tab disabled={!this.state.isLoaded}>Services</Tab>
            <Tab
              disabled={!this.state.isLoaded || this.state.group.status === '4'}
              title={this.state.group.status === '4' ? 'Cannot navigate to payments because group is cancelled.' : ''}
            >
              Payments
            </Tab>
            <Tab disabled={!this.state.isLoaded}>Rooming Lists</Tab>
            <Tab disabled={!this.state.isLoaded}>Itinerary</Tab>
            <Tab disabled={!this.state.isLoaded}>Documents</Tab>
            <Tab disabled={
              !this.state.isLoaded || 
              (localStorage.user_id !== "84" && 
              localStorage.user_id !== "87" && 
              localStorage.user_id !== "88")
            }>
              Proforma Invoices
            </Tab>
            <Tab disabled={!this.state.isLoaded}>Route</Tab>
          </TabList>
          <TabPanel>
            <GroupOverView
              group={this.state.group}
              can_del={this.state.can_del}
              isLoaded={this.state.isLoaded}
              coach_info_data={this.state.coach_info_data}
              update_state={this.update_state}
              update_notes={this.update_notes}
            />
          </TabPanel>
          <TabPanel>
            <GroupSchedule
              group={this.state.group}
              isLoaded={this.state.isLoaded}
              update_state={this.update_state}
              selected_td_id={this.state.selected_td_id}
              selectedDate={this.state.selectedDate}
              selectedView={this.state.selectedView}
              selectedTD={this.state.selectedTD}
              setSelectedDate={this.setSelectedDate}
              setView={this.setView}
              updateIsLoaded={this.updateIsLoaded}
            />
          </TabPanel>
          <TabPanel>
            <GroupServices
              group={this.state.group}
              isLoaded={this.state.isLoaded}
              update_state={this.update_state}
            />
          </TabPanel>
          <TabPanel>
            <GroupPayments
              group={this.state.group}
              isLoaded={this.state.isLoaded}
              update_state={this.update_state}
            />
          </TabPanel>
          <TabPanel>
            <GroupRoomingLists
              group={this.state.group}
              isLoaded={this.state.isLoaded}
              update_state={this.update_state}
            />
          </TabPanel>
          <TabPanel>
            <GroupItinerary
              group={this.state.group}
              isLoaded={this.state.isLoaded}
              coach_info_data={this.state.coach_info_data}
              update_state={this.update_state}
            />
          </TabPanel>
          <TabPanel>
            <GroupDocuments
              group={this.state.group}
              isLoaded={this.state.isLoaded}
              cabin_lists={this.state.cabin_lists}
              update_state={this.update_state}
            />
          </TabPanel>
          <TabPanel>
            <GroupProformaInvoices
              group={this.state.group}
              isLoaded={this.state.isLoaded}
              update_state={this.update_state}
              updateIsLoaded={this.updateIsLoaded}
            />
          </TabPanel>
          <TabPanel>
            <GroupRoute
              group={this.state.group}
              isLoaded={this.state.isLoaded}
              update_state={this.update_state}
              arrival_lat={this.state.arrival_lat}
              arrival_lng={this.state.arrival_lng}
              departure_lat={this.state.departure_lat}
              departure_lng={this.state.departure_lng}
            />
          </TabPanel>
        </Tabs>
        <Footer />
      </div>
    );
  }
}

export default Group;
