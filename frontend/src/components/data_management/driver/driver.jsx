// Built-ins
import React from "react";

// Modules
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// CSS
import "react-tabs/style/react-tabs.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import DriverOverView from "./driver_overview/driver_overview";
import Gallery from "../../core/gallery/gallery";
import DriverGroups from "./driver_groups/driver_groups";

// driver page Class
class Driver extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      driver: {},
    };
  }

  render() {
    return (
      <div>
        <NavigationBar />
        <Tabs>
          <TabList>
            <Tab> Overview </Tab>
            <Tab> Gallery </Tab>
            <Tab> Groups </Tab>
          </TabList>
          <TabPanel>
            <DriverOverView />
          </TabPanel>
          <TabPanel>
            <Gallery object={this.state.driver} object_type={"Driver"} />
          </TabPanel>
          <TabPanel>
            <DriverGroups />
          </TabPanel>
        </Tabs>
        <Footer />
      </div>
    );
  }
}

export default Driver;
