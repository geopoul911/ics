// Built-ins
import React from "react";

// Modules
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// CSS
import "react-tabs/style/react-tabs.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import ServiceOverView from "./service_overview/service_overview";

class Service extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      service: {},
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
            <ServiceOverView />
          </TabPanel>
        </Tabs>
        <Footer />
      </div>
    );
  }
}

export default Service;
