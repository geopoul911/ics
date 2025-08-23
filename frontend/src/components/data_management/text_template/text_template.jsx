// Built-ins
import React from "react";

// Modules
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// CSS
import "react-tabs/style/react-tabs.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import TextTemplateOverView from "./text_template_overview/text_template_overview";

// text_template page Class
class TextTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text_template: {},
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
            <TextTemplateOverView />
          </TabPanel>
        </Tabs>
        <Footer />
      </div>
    );
  }
}

export default TextTemplate;
