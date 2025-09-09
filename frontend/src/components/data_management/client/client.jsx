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
            <Tab>Overview</Tab>
            <Tab>Projects</Tab>
            <Tab>Properties</Tab>
            <Tab>Cash</Tab>
            <Tab>Documents</Tab>
            <Tab>Bank client accounts</Tab>
            <Tab>Bank project accounts</Tab>
          </TabList>
          <TabPanel>
            <ClientOverView />
          </TabPanel>
          <TabPanel>
            <RelatedObjects section="projects" />
          </TabPanel>
          <TabPanel>
            <RelatedObjects section="properties" />
          </TabPanel>
          <TabPanel>
            <RelatedObjects section="cash" />
          </TabPanel>
          <TabPanel>
            <RelatedObjects section="documents" />
          </TabPanel>
          <TabPanel>
            <RelatedObjects section="bank_client_accounts" />
          </TabPanel>
          <TabPanel>
            <RelatedObjects section="bank_project_accounts" />
          </TabPanel>
        </Tabs>
        <Footer />
      </div>
    );
  }
}

export default Client;
