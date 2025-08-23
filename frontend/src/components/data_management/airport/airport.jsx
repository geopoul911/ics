// Built-ins
import React from "react";

// Modules
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// CSS
import "react-tabs/style/react-tabs.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import AirportOverView from "./airport_overview/airport_overview";
import AirportTerminal from "./airport_terminal/airport_terminal";

class Airport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      airport: {},
    };
  }

  render() {
    return (
      <div>
        <NavigationBar />
        <Tabs>
          <TabList>
            <Tab>Overview</Tab>
            <Tab>Terminal</Tab>
          </TabList>
          <TabPanel>
            <AirportOverView />
          </TabPanel>
          <TabPanel>
            <AirportTerminal />
          </TabPanel>
        </Tabs>
        <Footer />
      </div>
    );
  }
}

export default Airport;
