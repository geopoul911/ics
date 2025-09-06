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
          <Tab>Related Objects</Tab>
          <Tab>Tasks</Tab>
        </TabList>
        <TabPanel>
          <ProjectOverview />
        </TabPanel>
        <TabPanel>
          <RelatedObjects />
        </TabPanel>
        <TabPanel>
          <Tasks />
        </TabPanel>
      </Tabs>
      <Footer />
    </div>
  );
}

export default Project;


