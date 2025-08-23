// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../navigation_bar/navigation_bar";
import Footer from "../footer/footer";

// Modules / Functions
import { Menu } from "semantic-ui-react";

// Icons / Images
import { AiOutlineSearch } from "react-icons/ai";
import { BsCurrencyExchange } from "react-icons/bs";
import { MdLocalAirport } from "react-icons/md";
import { FaPassport, FaShieldVirus } from "react-icons/fa";
import { BiSearchAlt } from "react-icons/bi";

// Global Variables
import { rootIconStyle, pageHeader } from "../../global_vars";

// Useful Links page Class
// url path = '/useful_links'
class UsefulLinks extends React.Component {
  render() {
    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("useful_links")}

          <Menu vertical className="rootMenu">
            {/* Airport Codes */}
            <Menu.Item
              onClick={() =>
                window.open("https://www.world-airport-codes.com/", "_blank")
              }
            >
              <MdLocalAirport style={rootIconStyle} /> Airport Codes
            </Menu.Item>

            {/* Passport Indexes */}
            <Menu.Item
              onClick={() =>
                window.open("https://www.passportindex.org/", "_blank")
              }
            >
              <FaPassport style={rootIconStyle} /> Passport Indexes
            </Menu.Item>

            {/* Currency Exchange Rates */}
            <Menu.Item
              onClick={() => window.open("https://www.xe.com/", "_blank")}
            >
              <BsCurrencyExchange style={rootIconStyle} /> Currency Exchange
              Rates
            </Menu.Item>

            {/* Plane Finder */}
            <Menu.Item
              onClick={() => window.open("https://planefinder.net/", "_blank")}
            >
              <AiOutlineSearch style={rootIconStyle} /> Plane Finder
            </Menu.Item>

            {/* Ship Finder */}
            <Menu.Item
              onClick={() =>
                window.open("https://www.marinetraffic.com", "_blank")
              }
            >
              <BiSearchAlt style={rootIconStyle} /> Ship Finder
            </Menu.Item>

            {/* Ship Finder */}
            <Menu.Item
              onClick={() =>
                window.open(
                  "https://ec.europa.eu/info/live-work-travel-eu/coronavirus-response/safe-covid-19-vaccines-europeans/eu-digital-covid-certificate_en",
                  "_blank"
                )
              }
            >
              <FaShieldVirus style={rootIconStyle} /> Information about Covid-19
            </Menu.Item>
          </Menu>
        </div>
        <Footer />
      </>
    );
  }
}

export default UsefulLinks;
