// Built-ins
import React from "react";

// Modules
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// CSS
import "react-tabs/style/react-tabs.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import ClientOverView from "./client_overview/client_overview";
import RelatedObjects from "./related_objects/related_objects";

class Client extends React.Component {

  render() {
    return (
      <div>
        <NavigationBar />
        <Tabs>
          <TabList>
            <Tab> Overview </Tab>
            <Tab>Related Objects</Tab>
          </TabList>
          <TabPanel>
            <ClientOverView />
          </TabPanel>
          <TabPanel>
            <RelatedObjects />
          </TabPanel>
        </Tabs>
        <Footer />
      </div>
    );
  }
}

export default Client;
