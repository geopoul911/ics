// Built-ins
import React from "react";

// Modules
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// CSS
import "react-tabs/style/react-tabs.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import ParkingLotOverView from "./parking_lot_overview/parking_lot_overview";
import Gallery from "../../core/gallery/gallery";

class ParkingLot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      parking_lot: {},
    };
  }

  render() {
    return (
      <div>
        <NavigationBar />
        <Tabs>
          <TabList>
            <Tab>Overview</Tab>
            <Tab>Gallery</Tab>
          </TabList>
          <TabPanel>
            <ParkingLotOverView />
          </TabPanel>
          <TabPanel>
            <Gallery object={this.state.parking_lot} object_type={"Parking Lot"}/>
          </TabPanel>
        </Tabs>
        <Footer />
      </div>
    );
  }
}

export default ParkingLot;
