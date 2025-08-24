// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../navigation_bar/navigation_bar";
import Footer from "../footer/footer";

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
              Ultima is a next-generation Content & Project Management System designed to bring clarity,
              structure, and control to complex operations.
              Built with flexibility in mind, it helps our organization to manage clients, projects, documents, tasks, finances,
              and teams in one unified platform.
            </p>
            <hr />
            <h1> Our Mission </h1>
            <hr />
            <p>
              Our mission is to simplify management workflows and empower professionals with the tools they need to stay organized,
              efficient, and collaborative. ICS Ultima eliminates scattered data and manual processes,
              replacing them with a streamlined, centralized hub where every detail is accessible, trackable, and secure.
            </p>
            <hr />
            <h1> Solutions </h1>
            <hr />
            <p>
              From client management and document tracking to project planning, financial control, and task automation —
              Ultima covers the full lifecycle of organizational operations.
              Its modular design ensures it adapts to the needs of consultants, agencies, and enterprises alike.
            </p>
            <p>
              Our team of developers and domain experts are committed to building a system that grows with you —
              ensuring reliability, transparency, and productivity at every step.
            </p>
            <p>Thank you for trusting Ultima as the backbone of your work.</p>
            <hr />
          </div>
        </div>
        <Footer />
      </>
    );
  }
}

export default About;
