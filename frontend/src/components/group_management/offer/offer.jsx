// Built-ins
import React from "react";

// Modules
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// CSS
import "react-tabs/style/react-tabs.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import OfferOverview from "./offer_overview/offer_overview";
import OfferTemplates from "./offer_templates/offer_templates";

class Offer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offer: {},
    };
  }

  render() {
    return (
      <div>
        <NavigationBar />
        <Tabs>
          <TabList>
            <Tab>Overview</Tab>
            <Tab>Templates</Tab>
          </TabList>
          <TabPanel>
            <OfferOverview />
          </TabPanel>
          <TabPanel>
            <OfferTemplates />
          </TabPanel>
        </Tabs>
        <Footer />
      </div>
    );
  }
}

export default Offer;
