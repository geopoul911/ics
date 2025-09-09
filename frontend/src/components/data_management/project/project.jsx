// Built-ins
import React from "react";

// Modules
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// CSS
import "react-tabs/style/react-tabs.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import ProjectOverview from "./project_overview/project_overview";
import RelatedObjects from "./related_objects/related_objects";
import Tasks from "./tasks/tasks";

function Project() {
  return (
    <div>
      <NavigationBar />
      <Tabs>
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Associated clients</Tab>
          <Tab>Clients</Tab>
          <Tab>Documents</Tab>
          <Tab>Client contacts</Tab>
          <Tab>Properties</Tab>
          <Tab>Bank project accounts</Tab>
          <Tab>Tasks</Tab>
          <Tab>Cash</Tab>
        </TabList>
        <TabPanel>
          <ProjectOverview />
        </TabPanel>
        <TabPanel>
          <RelatedObjects section="associated_clients" />
        </TabPanel>
        <TabPanel>
          <RelatedObjects section="clients" />
        </TabPanel>
        <TabPanel>
          <RelatedObjects section="documents" />
        </TabPanel>
        <TabPanel>
          <RelatedObjects section="client_contacts" />
        </TabPanel>
        <TabPanel>
          <RelatedObjects section="properties" />
        </TabPanel>
        <TabPanel>
          <RelatedObjects section="bank_project_accounts" />
        </TabPanel>
        <TabPanel>
          <Tasks />
        </TabPanel>
        <TabPanel>
          <RelatedObjects section="cash" />
        </TabPanel>
      </Tabs>
      <Footer />
    </div>
  );
}

export default Project;


