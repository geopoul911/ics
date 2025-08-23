// Built-ins
import React from "react";

// Modules
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// CSS
import "react-tabs/style/react-tabs.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import ContractOverView from "./contract_overview/contract_overview";
import ContractCalendar from "./contract_calendar/contract_calendar";

class Contract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contract: {},
    };
  }

  render() {
    return (
      <div>
        <NavigationBar />
        <Tabs>
          <TabList>
            <Tab>Overview</Tab>
            <Tab>Calendar</Tab>
          </TabList>
          <TabPanel>
            <ContractOverView />
          </TabPanel>
          <TabPanel>
            <ContractCalendar />
          </TabPanel>
        </Tabs>
        <Footer />
      </div>
    );
  }
}

export default Contract;
