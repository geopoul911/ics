// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../navigation_bar/navigation_bar";
import Footer from "../footer/footer";

// CSS
import "./about.css";

// Icons
import {
  FaFacebookF,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

// Global Variables
import { pageHeader } from "../../global_vars";

// url path = '/about'
class About extends React.Component {
  // Contains information About Cosmoplan
  render() {
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("about")}
          <div style={{ marginLeft: "10%", marginRight: "10%" }}>
            {/* This text is written by chatgpt. */}
            <h1> About us </h1>
            <hr />
            <p>
              Cosmoplan International Travel is a company that specializes in
              creating innovative solutions for the travel industry.
            </p>
            <p>
              Our flagship product, Group Plan, is a cutting-edge travel
              itinerary planner that helps individuals and travel agencies plan,
              book, and manage their trips with ease.
            </p>
            <hr />
            <h1> Our Mission </h1>
            <hr />
            <p>
              Our mission is to make the travel planning process as seamless and
              stress-free as possible.
            </p>
            <p>
              With Group Plan, users can easily search for flights, hotels, and
              activities, create custom itineraries, and even collaborate with
              travel partners and friends.
            </p>
            <p>
              Our user-friendly interface and advanced features make it easy for
              anyone to plan their dream trip.
            </p>
            <hr />
            <h1> Solutions </h1>
            <hr />
            <p>
              In addition to Group Plan, we also offer a variety of other
              travel-related software solutions, such as our popular travel
              budget tracker and destination guide.
            </p>
            <p>
              Our team of experienced software developers and travel experts are
              dedicated to creating the best possible products for our
              customers.
            </p>
            <p>
              At Cosmoplan, we believe that everyone should be able to
              experience the world, and we're committed to making that happen
              through our innovative software solutions.
            </p>
            <p>Thank you for considering us for your travel needs.</p>
            <hr />
            <ul className="social_ul">
              <li>
                <a href="https://www.facebook.com/Cosmoplan.gr/">
                  <FaFacebookF
                    style={{
                      fontSize: "1.5em",
                      margin: 10,
                      color: "#4267B2",
                    }}
                  />
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/company/cosmoplan/">
                  <FaLinkedin
                    style={{
                      fontSize: "1.5em",
                      margin: 10,
                      color: "#0072B1",
                    }}
                  />
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/Cosmoplan.gr">
                  <FaInstagram
                    style={{
                      fontSize: "1.5em",
                      margin: 10,
                      color: "#C13584",
                    }}
                  />
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@cosmoplan192">
                  <FaYoutube
                    style={{
                      fontSize: "1.5em",
                      margin: 10,
                      color: "#FF0000",
                    }}
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <Footer />
      </>
    );
  }
}

export default About;
