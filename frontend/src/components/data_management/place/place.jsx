// Built-ins
import React from "react";

// Modules
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// CSS
import "react-tabs/style/react-tabs.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import PlaceOverView from "./place_overview/place_overview";
import PlaceAttraction from "./place_attractions/place_attractions";

// place page Class
class Place extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      place: {},
    };
  }

  render() {
    return (
      <div>
        <NavigationBar />
        <Tabs>
          <TabList>
            <Tab> Overview </Tab>
            <Tab> Attractions </Tab>
          </TabList>
          <TabPanel>
            <PlaceOverView />
          </TabPanel>
          <TabPanel>
            <PlaceAttraction />
          </TabPanel>
        </Tabs>
        <Footer />
      </div>
    );
  }
}

export default Place;
