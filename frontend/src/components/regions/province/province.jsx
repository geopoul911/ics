// Built-ins
import React from "react";

// Modules
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// CSS
import "react-tabs/style/react-tabs.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import RegionOverView from "./province_overview/province_overview";

// region page Class
class Region extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {},
    };
  }

  render() {
    return (
      <div>
        <NavigationBar />
        <Tabs>
          <TabList>
            <Tab> Overview </Tab>
          </TabList>
          <TabPanel>
            <RegionOverView />
          </TabPanel>
        </Tabs>
        <Footer />
      </div>
    );
  }
}

export default Region;
