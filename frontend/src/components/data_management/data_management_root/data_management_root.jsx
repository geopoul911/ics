// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Modules / Functions
import { Menu, Grid } from "semantic-ui-react";
import { Link } from "react-router-dom";

// Icons / Images
import { AiOutlineSetting } from "react-icons/ai";
import { TiGroupOutline } from "react-icons/ti";
import { BiBriefcase, BiFootball } from "react-icons/bi";
import { BiRestaurant } from "react-icons/bi";
import { RiGuideLine, RiAdvertisementFill } from "react-icons/ri";
import { WiTrain } from "react-icons/wi";
import { FaFileContract } from "react-icons/fa";
import { SiChinasouthernairlines } from "react-icons/si";
import { GiMagickTrick } from "react-icons/gi";
import {
  GiSteeringWheel,
  GiBus,
  GiEarthAmerica,
  GiBattleship,
  GiShipWheel,
  GiRailway,
  GiConvergenceTarget,
  GiCommercialAirplane,
} from "react-icons/gi";
import { BsFillPuzzleFill } from "react-icons/bs";
import { MdSupportAgent, MdLocalAirport } from "react-icons/md";
import {
  FaHotel,
  FaSuitcaseRolling,
  FaMapMarkedAlt,
  FaParking,
  FaCar,
  FaIdeal,
} from "react-icons/fa";
import { FaScrewdriver } from "react-icons/fa";
import { BiAnchor, BiTransfer } from "react-icons/bi";
import { FaTheaterMasks } from "react-icons/fa";

// Global Variables
import { rootIconStyle, pageHeader } from "../../global_vars";

class DataManagementRoot extends React.Component {
  render() {
    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("data_management_root")}
          <Grid divided stackable columns={4}>
            <Grid.Column>
              <Menu vertical className="dmRootMenu">
                <Menu.Item as={Link} to="/data_management/all_advertisement_companies">
                  <RiAdvertisementFill style={rootIconStyle} /> Advertisement Companies
                </Menu.Item>
                <Menu.Item as={Link} to="/data_management/all_agents">
                  <BiBriefcase style={rootIconStyle} /> Agents
                </Menu.Item>
                <Menu.Item as={Link} to="/data_management/all_aircrafts">
                  <GiCommercialAirplane style={rootIconStyle} /> Aircrafts
                </Menu.Item>
                <Menu.Item as={Link} to="/data_management/all_airlines">
                  <SiChinasouthernairlines style={rootIconStyle} /> Airlines
                </Menu.Item>
                <Menu.Item as={Link} to="/data_management/all_airports">
                  <MdLocalAirport style={rootIconStyle} /> Airports
                </Menu.Item>
                <Menu.Item as={Link} to="/data_management/all_attractions">
                  <FaMapMarkedAlt style={rootIconStyle} /> Museum & Attractions
                </Menu.Item>
                <Menu.Item as={Link} to="/data_management/all_car_hire_companies">
                  <FaCar style={rootIconStyle} /> Car Hire
                </Menu.Item>
                <Menu.Item as={Link} to="/data_management/all_charter_brokers">
                  <FaIdeal style={rootIconStyle} /> Charter Airlines & Brokers
                </Menu.Item>
              </Menu>
            </Grid.Column>
            <Grid.Column>
              <Menu vertical className="dmRootMenu">
                <Menu.Item as={Link} to="/data_management/all_clients">
                  <FaSuitcaseRolling style={rootIconStyle} /> Clients
                </Menu.Item>
                <Menu.Item as={Link} to="/data_management/all_coach_operators">
                  <MdSupportAgent style={rootIconStyle} /> Coach Operators
                </Menu.Item>
                <Menu.Item as={Link} to="/data_management/all_coaches">
                  <GiBus style={rootIconStyle} /> Coaches
                </Menu.Item>
                <Menu.Item as={Link} to="/data_management/all_contracts">
                  <FaFileContract style={rootIconStyle} /> Contracts
                </Menu.Item>
                <Menu.Item
                  as={Link}
                  to="/data_management/all_cruising_companies"
                >
                  <GiShipWheel style={rootIconStyle} /> Cruising Companies
                </Menu.Item>
                <Menu.Item as={Link} to="/data_management/all_dmcs">
                  <GiEarthAmerica style={rootIconStyle} /> DMCs
                </Menu.Item>
                <Menu.Item as={Link} to="/data_management/all_drivers">
                  <GiSteeringWheel style={rootIconStyle} /> Drivers
                </Menu.Item>
                <Menu.Item
                  as={Link}
                  to="/data_management/all_ferry_ticket_agencies"
                >
                  <GiBattleship style={rootIconStyle} /> Ferry Ticket Agencies
                </Menu.Item>
              </Menu>
            </Grid.Column>
            <Grid.Column>
              <Menu vertical className="dmRootMenu">
                <Menu.Item as={Link} to="/data_management/all_group_leaders">
                  <TiGroupOutline style={rootIconStyle} /> Group Leaders
                </Menu.Item>
                <Menu.Item as={Link} to="/data_management/all_guides">
                  <RiGuideLine style={rootIconStyle} /> Local Guides
                </Menu.Item>
                <Menu.Item as={Link} to="/data_management/all_hotels">
                  <FaHotel style={rootIconStyle} /> Hotels
                </Menu.Item>
                <Menu.Item as={Link} to="/data_management/all_parking_lots">
                  <FaParking style={rootIconStyle} /> Parking Lots
                </Menu.Item>
                <Menu.Item as={Link} to="/data_management/all_ports">
                  <BiAnchor style={rootIconStyle} /> Ports
                </Menu.Item>
                <Menu.Item
                  as={Link}
                  to="/data_management/all_railway_stations/"
                >
                  <GiRailway style={rootIconStyle} /> Railway Stations
                </Menu.Item>
                <Menu.Item as={Link} to="/data_management/all_regions/">
                  <GiConvergenceTarget style={rootIconStyle} /> Regions
                </Menu.Item>
                <Menu.Item as={Link} to="/data_management/all_repair_shops">
                  <FaScrewdriver style={rootIconStyle} /> Repair shops
                </Menu.Item>
              </Menu>
            </Grid.Column>
            <Grid.Column>
              <Menu vertical className="dmRootMenu">
                <Menu.Item as={Link} to="/data_management/all_restaurants">
                  <BiRestaurant style={rootIconStyle} /> Restaurants
                </Menu.Item>
                <Menu.Item as={Link} to="/data_management/all_services">
                  <AiOutlineSetting style={rootIconStyle} /> Services
                </Menu.Item>
                <Menu.Item as={Link} to="/data_management/all_entertainment_suppliers">
                  <GiMagickTrick style={rootIconStyle} /> Shows & Entertainment Suppliers
                </Menu.Item>
                <Menu.Item
                  as={Link}
                  to="/data_management/all_sport_event_suppliers"
                >
                  <BiFootball style={rootIconStyle} /> Sport Event Suppliers
                </Menu.Item>
                <Menu.Item
                  as={Link}
                  to="/data_management/all_teleferik_companies"
                >
                  <BiTransfer style={rootIconStyle} /> Teleferik Companies
                </Menu.Item>
                <Menu.Item as={Link} to="/data_management/all_text_templates">
                  <BsFillPuzzleFill style={rootIconStyle} /> Text Templates
                </Menu.Item>
                <Menu.Item as={Link} to="/data_management/all_theaters">
                  <FaTheaterMasks style={rootIconStyle} /> Theaters
                </Menu.Item>
                <Menu.Item
                  as={Link}
                  to="/data_management/all_train_ticket_agencies"
                >
                  <WiTrain style={rootIconStyle} /> Train Ticket Agencies
                </Menu.Item>
              </Menu>
            </Grid.Column>
          </Grid>
        </div>
        <Footer />
      </>
    );
  }
}

export default DataManagementRoot;
