// Built-ins
import React from "react";

// Modules
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// CSS
import "react-tabs/style/react-tabs.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import RailwayStationOverView from "./railway_station_overview/railway_station_overview";

class RailwayStation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      railway_station: {},
    };
  }

  render() {
    return (
      <div>
        <NavigationBar />
        <Tabs>
          <TabList>
            <Tab>Overview</Tab>
          </TabList>
          <TabPanel>
            <RailwayStationOverView />
          </TabPanel>
        </Tabs>
        <Footer />
      </div>
    );
  }
}

export default RailwayStation;
