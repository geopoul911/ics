// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import CoachAvailability from "./coach_availability/coach_availability";
import DriverAvailability from "./driver_availability/driver_availability";

// Modules / Functions
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// CSS
import "react-tabs/style/react-tabs.css";

class Availability extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group: {},
    };
  }

  render() {
    return (
      <div>
        <NavigationBar />
        <Tabs>
          <TabList>
            <Tab>Coach</Tab>
            <Tab>Driver</Tab>
          </TabList>
          <TabPanel>
            <CoachAvailability />
          </TabPanel>
          <TabPanel>
            <DriverAvailability />
          </TabPanel>
        </Tabs>
        <Footer />
      </div>
    );
  }
}

export default Availability;
