// Built-ins
import React from "react";

// Modules
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// CSS
import "react-tabs/style/react-tabs.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import CoachOverView from "./coach_overview/coach_overview";
import CoachGroups from "./coach_groups/coach_groups";
import Gallery from "../../core/gallery/gallery";

class Coach extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coach: {},
    };
  }

  render() {
    return (
      <div>
        <NavigationBar />
        <Tabs>
          <TabList>
            <Tab> Overview </Tab>
            <Tab> Gallery </Tab>
            <Tab> Groups </Tab>
          </TabList>
          <TabPanel>
            <CoachOverView />
          </TabPanel>
          <TabPanel>
            <Gallery object={this.state.coach} object_type={"Coach"} />
          </TabPanel>
          <TabPanel>
            <CoachGroups />
          </TabPanel>
        </Tabs>
        <Footer />
      </div>
    );
  }
}

export default Coach;
