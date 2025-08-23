// Built-ins
import React from "react";

// Modules
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// CSS
import "react-tabs/style/react-tabs.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import AirlineOverView from "./airline_overview/airline_overview";

class Airline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      airline: {},
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
            <AirlineOverView />
          </TabPanel>
        </Tabs>
        <Footer />
      </div>
    );
  }
}

export default Airline;
