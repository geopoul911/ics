// Built-ins
import React from "react";

// Modules / Functions
import { Accordion } from "semantic-ui-react";

// Icons / Images
import LoginDoxImg from "../../../images/dox/login_staff_dox.png";
import FourOFourDoxImg from "../../../images/dox/404_dox.png";
import HelpDoxImg from "../../../images/dox/help_dox.png";
import UsefulLinksImg from "../../../images/dox/useful_links_dox.png";
import UnderConstructionDoxImg from "../../../images/dox/under_construction_dox.png";

// Functions / Components
import { Menu, Grid } from "semantic-ui-react";

// Core
const core_pages = [
  "Home ( URL: / )",
  "About ( URL: /about )",
  "Terms ( URL: /terms )",
  "Login ( URL: /login )",
  "404 Page ( URL: /<not_matching_ips> )",
  'Help ( URL: "/help" )',
  "Staff Documentation ( URL: /staff_dox )",
  "Developer Documentation ( URL: /dev_dox )",
  "Useful Links ( URL: /useful_links )",
  "Under Construction ( URL: /under_construction )",
  "Updates ( URL: /help/updates )",
];

// Group management
const group_pages = [
  "Group Management Root ( URL: /group_management_root/ )",
  "All Groups ( URL: /all_groups )",
  "Group ( URL: /group/<refcode> )",
  "Overview ( URL: /group/<refcode> )",
  "Schedule ( URL: /group/<refcode> )",
  "Services ( URL: /group/<refcode> )",
  "Itinerary ( URL: /group/<refcode> )",
  "Rooming Lists ( URL: /group/<refcode> )",
  "Documents ( URL: /group/<refcode> )",
  "Group Route ( URL: /group/<refcode> )",
  "Group Stats ( URL: /group_stats )",
  "Daily Status ( URL: /daily_status )",
  "All Offers ( URL: /all_group_offers )",
  "Offer Overview ( URL: /offer/<offer_id> )",
  "Pending ( URL: /group_management/pending_groups )",
  "Availability ( URL: /group_management/availability )",
];

// Reports
const report_pages = [
  "Reports Root ( URL: /reports/root/ )",
  "Agents ( URL: /reports/agent )",
  "Airports ( URL: /reports/airport )",
  "Places ( URL: /reports/place )",
  "Clients ( URL: /reports/client )",
  "Coach Operators ( URL: /reports/coach_operator )",
  "Drivers ( URL: /reports/driver )",
  "Expiring Docs ( URL: /reports/expiring_documents )",
  "Group Leaders ( URL: /reports/group_leader )",
  "Hotels ( URL: /reports/hotel )",
  "Users ( URL: /reports/user )",
  "Sent emails ( URL: /reports/sent_emails )",
  "Services ( URL: /reports/service )",
  "Site Statistics ( URL: /reports/site_statistics )",
];

// Data management
const data_management_pages = [
  "Data Management Root ( URL: /data_management/root/ )",
  "All Agents ( URL: /data_management/all_agents )",
  "Agent Overview ( URL: /data_management/agent/<agent_id> )",
  "All Airlines ( URL: /data_management/all_airlines )",
  "Airline Overview ( URL: /data_management/airline/<airline_id> )",
  "All Airports ( URL: /data_management/all_airports )",
  "Airport Overview ( URL: /data_management/airport/<airport_name> )",
  "All Attractions ( URL: /data_management/all_attractions )",
  "Attraction Overview ( URL: /data_management/attraction/<attraction_id> )",
  "All Clients ( URL: /data_management/all_clients )",
  "Client Overview ( URL: /data_management/client/<client_id> )",
  "All Coach Operators ( URL: /data_management/all_coach_operators )",
  "Coach Operator Overview ( URL: /data_management/coach_operator/<coach_operator_id> )",
  "All Coaches ( URL: /data_management/all_coaches )",
  "Coach Overview ( URL: /data_management/coach/<coach_id> )",
  "All Contracts ( URL: /data_management/all_contracts )",
  "Contract Overview ( URL: /data_management/contract/<contract_id> )",
  "All Cruising Companies ( URL: /data_management/all_cruising_companies )",
  "Cruising Company Overview ( URL: /data_management/cruising_company/<cruising_company_id> )",
  "All Drivers ( URL: /data_management/all_drivers )",
  "Driver Overview ( URL: /data_management/driver/<driver_id> )",
  "All DMCs ( URL: /data_management/all_dmcs )",
  "DMC Overview ( URL: /data_management/dmc/<dmc_id> )",
  "All Group Leaders ( URL: ( URL: /data_management/all_group_leaders )",
  "Group Leader Overview ( URL: /data_management/group_leader/<group_leader_id> )",
  "All Guides ( URL: /data_management/all_guides )",
  "Guide Overview ( URL: /data_management/guide/<guide_id> )",
  "All Ferry Ticket Agencies ( URL: /data_management/all_ferry_ticket_agencies )",
  "Ferry Ticket Agency Overview ( URL: /data_management/ferry_ticket_agency/<ferry_ticket_agency_id> )",
  "All  Hotels ( URL: /data_management/all_hotels )",
  "Hotel Overview ( URL: /data_management/hotel/<hotel_id> )",
  "Hotel Amenities ( URL: /data_management/hotel/<hotel_id> )",
  "All Places ( URL: /data_management/all_places )",
  "Place Overview ( URL: /data_management/place/<place_id> )",
  "Place Attractions ( URL: /data_management/place/<place_id> )",
  "All Ports ( URL: /data_management/all_ports )",
  "Port Overview ( URL: /data_management/port/<port_id> )",
  "All Repair Shops ( URL: /data_management/all_repair_shops )",
  "Repair Shop Overview ( URL: /data_management/repair_shop/<repair_shop_id> )",
  "All Railway Stations ( URL: /data_management/all_railway_stations )",
  "Railway Station Overview ( URL: /data_management/railway_station/<railway_station_id> )",
  "All Restaurants ( URL: /data_management/all_restaurants )",
  "Restaurant Overview ( URL: /data_management/restaurant/<restaurant_id> )",
  "All Services ( URL: /data_management/all_services )",
  "Service Overview ( URL: /data_management/service/<service_id> )",
  "All Text Templates ( URL: /data_management/all_text_templates )",
  "Text Template Overview ( URL: /data_management/text_template/<text_template_id> )",
  "All Teleferik Companies ( URL: /data_management/all_teleferik_companies )",
  "Teleferik Company Overview ( URL: /data_management/teleferik_company/<teleferik_company_id> )",
  "All Theaters ( URL: /data_management/all_theaters )",
  "Theater Overview ( URL: /data_management/theater/<theater_id> )",
  "All Train Ticket Agencies ( URL: /data_management/all_train_ticket_agencies )",
  "Train Ticket Agency Overview ( URL: /data_management/train_ticket_agency/<train_ticket_agency_id> )",
  "All Sport Event Suppliers ( URL: /data_management/all_sport_event_suppliers )",
  "Sport Event Supplier Overview ( URL: /data_management/sport_event_supplier/<sport_event_supplier_id> )",
];

// Site administration
const maps_pages = [
  "Maps Root ( URL: /maps/root/ )",
  "Explore ( URL: /maps/explore/ )",
  "Daily Status ( URL: /maps/daily_status/ )",
];

const site_administration_pages = [
  "Site Administration Root ( URL: /site_administration/root/ )",
  "Access History ( URL: /access_history )",
  "Conflicts ( URL: /conflicts )",
  "Incomplete Data ( URL: /incomplete_data )",
  "Logs ( URL: /logs )",
  "All Users ( URL: /all_users )",
  "User Overview ( URL: /user/<user_id> )",
  "User Permissions ( URL: /user_permissions )",
];

// First menu
const pillars_panel = [
  {
    key: `panel-1`,
    title: "1) Core Pages",
    content: core_pages.map((page) => <li>{page}</li>),
  },
  {
    key: `panel-2`,
    title: "2) Group Management",
    content: group_pages.map((page) => <li>{page}</li>),
  },
  {
    key: `panel-3`,
    title: "3) Reports",
    content: report_pages.map((page) => <li>{page}</li>),
  },
  {
    key: `panel-4`,
    title: "4) Data Management",
    content: data_management_pages.map((page) => <li>{page}</li>),
  },
  {
    key: `panel-5`,
    title: "5) Maps",
    content: maps_pages.map((page) => <li>{page}</li>),
  },
  {
    key: `panel-6`,
    title: "6) Site Administration",
    content: site_administration_pages.map((page) => <li>{page}</li>),
  },
];

// Accordion used to show one page at a time
const Accordions = () => (
  <Accordion
    defaultActiveIndex={[]}
    panels={pillars_panel}
    exclusive={false}
    fluid
  />
);

// Home
const HomeDox = () => {
  return (
    <>
      <div>
        <h1 className="dox_h1">General Information</h1>
        <hr />
        <h3 className="dox_h3">What is Group Plan?</h3>
        <br />
        <span>
          <p>
            Group Plan stands as a bespoke web application thoughtfully crafted
            by the Cosmoplan development team. Its central objective is to
            streamline and elevate the handling of data pertaining to tour
            operations.
          </p>
          <p>It is founded on six fundamental pillars:</p>
          <ul style={{ listStyle: "inside" }}>
            <Accordions />
          </ul>
        </span>
        <hr />
        <h3 className="dox_h3">Getting Started</h3>
        <br />
        <span>
          <p>
            To commence your journey with Group Plan, your initial step is to
            acquire an account. Accounts can be created by Group Plan's
            superusers within the Site Administration / All Users section.
          </p>
          <p>
            Once your account has been established, you will need to obtain a
            set of permissions from a user with the necessary authorization to
            grant them.
          </p>
          <p>
            Depending on the permissions you are granted, you will gain access
            to various features within Group Plan, enabling you to navigate,
            view, add, update, and delete entries as needed.
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">Other information</h3>
        <br />
        <span>
          <ul style={{ listStyle: "circle", paddingLeft: 20 }}>
            <p>
              <li>
                Group Plan offers accessibility from anywhere, provided you have
                a stable internet connection.
              </li>
            </p>
            <p>
              <li>It has undergone over 12 years of continuous development.</li>
            </p>
            <p>
              <li>
                Group Plan utilizes geolocation data and maps, which are stored
                in its dedicated database or accessed through Google's API.
              </li>
            </p>
            <p>
              <li>
                Please note that Group Plan is not open-source software; all
                rights are reserved to Cosmoplan International Travel Ltd.
              </li>
            </p>
            <p>
              <li>
                It employs cutting-edge cybersecurity defense mechanisms to
                ensure data security.
              </li>
            </p>
          </ul>
        </span>
      </div>
    </>
  );
};

// Cyber Security
const CyberSecurityDox = () => {
  return (
    <>
      <div className="paper_dox">
        <h1 className="dox_h1">General Info</h1>
        <p>
          Below You can see what kind of defense mechanisms Group Plan uses to
          avoid exploits, viruses, bugs and other attacking practices used
          nowadays.
        </p>
        <hr />
        <h3 className="dox_h3">SSL Certificate</h3>
        <br />
        <span>
          <p>
            <b>Definition: </b>
          </p>
          <p>
            SSL stands for Secure Sockets Layer and, in short, it's the standard
            technology for keeping an
            <br />
            internet connection secure and safeguarding any sensitive data that
            is being sent between two systems,
            <br />
            preventing criminals from reading and modifying any information
            transferred, including potential personal details
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">Ransomware Protection</h3>
        <br />
        <span>
          <p>
            <b>Definition: </b>
          </p>
          <p>
            Ransomware is malware that employs encryption to hold a
            victim'sinformation at ransom.
            <br />A user or organization's critical data is encrypted so that
            theycannot access files, databases, or applications.
            <br />A ransom is then demanded to provide access. Ransomware is
            oftendesigned to spread across a network and target database and
            fileservers,
            <br />
            and can thus quickly paralyze an entire organization.
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">CSRF Prevention</h3>
        <br />
        <span>
          <p>
            <b>Definition: </b>
          </p>
          <p>
            Cross-site request forgery (also known as CSRF) is a web security
            vulnerability that allows
            <br />
            an attacker to induce users to perform actions that they do not
            intend to perform.
            <br />
            It allows an attacker to partly circumvent the same origin policy,
            <br />
            which is designed to prevent different websites from interfering
            with each other.
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">CRLF Injection Protection</h3>
        <hr />
        <span>
          <p>
            <b>Definition: </b>
          </p>
          <p>
            A CRLF injection attack is one of several types of injectionattacks.
            <br />
            It can be used to escalate to more malicious attacks such
            asCross-site Scripting (XSS),
            <br />
            page injection, web cache poisoning, cache-based defacement,
            andmore.
            <br />A CRLF injection vulnerability exists if an attacker can
            inject theCRLF characters into a web application,
            <br />
            for example using a user input form or an HTTP request.
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">Timing attack</h3>
        <hr />
        <span>
          <p>
            <b>Definition: </b>
          </p>
          <p>
            In cryptography, a timing attack is a side-channel attack in which
            the attacker attempts to compromise a cryptosystem by analyzing the
            timetaken to execute cryptographic algorithms.
            <br />
            Every logical operation in a computer takes time to execute, and the
            time can differ based on the input;
            <br />
            with precise measurements of the time for each operation, an
            attacker can work backwards to the input.
            <br />
            Finding secrets through timing information may be significantly
            easier than using cryptanalysis of known plaintext, ciphertext
            pairs.
            <br />
            Sometimes timing information is combined with cryptanalysis to
            increase the rate of information leakage
          </p>
        </span>
        <br />
        <h3 className="dox_h3">ClickJacking attack or UI redress attack</h3>
        <hr />
        <span>
          <p>
            <b>Definition: </b>
          </p>
          <p>
            Clickjacking, also known as a "UI redress attack", is when an
            attacker uses multiple transparent or opaque layers to trick a user
            into
            <br />
            clicking on a button or link on another page when they were
            intending to click on the top level page
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">SQL Injections</h3>
        <hr />
        <span>
          <p>
            <b>Definition: </b>
          </p>
          <p>
            SQL injection is a web security vulnerability that allows an
            attacker to interfere with the queries that an application makes to
            its database.
            <br />
            It generally allows an attacker to view data that they are not
            normally able to retrieve.
            <br />
            This might include data belonging to other users, or any other data
            that the application itself is able to access.
            <br />
            In many cases, an attacker can modify or delete this data, causing
            persistent changes to the application's content or behavior.
            <br />
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">Brute force attacks</h3>
        <hr />
        <span>
          <p>
            <b>Definition: </b>
          </p>
          <p>
            In cryptography, a brute-force attack consists of an attacker
            submitting many passwords or passphrases with the hope of eventually
            guessing correctly.
            <br />
            The attacker systematically checks all possible passwords and
            passphrases until the correct one is found.
            <br />
            Alternatively, the attacker can attempt to guess the key which is
            typically created from the password using a key derivation function.
            <br />
            This is known as an exhaustive key search.
            <br />
            A brute-force attack is a cryptanalytic attack that can, in theory,
            be used to attempt to decrypt any encrypted data
            <br />
            Such an attack might be used when it is not possible to take
            advantage of other weaknesses in an encryption system (if any exist)
            <br />
            that would make the task easier.
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">XSS ( Cross site scripting )</h3>
        <hr />
        <span>
          <p>
            <b>Definition: </b>
          </p>
          <p>
            Cross-Site Scripting (XSS) attacks are a type of injection, in which
            malicious scripts are injected into otherwise benign and trusted
            websites.
            <br />
            XSS attacks occur when an attacker uses a web application to send
            malicious code, generally in the form of a browser side script, to a
            different end user.
            <br />
            Flaws that allow these attacks to succeed are quite widespread and
            occur anywhere a web application uses input from a user within the
            output it generates
            <br />
            without validating or encoding it.
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">Safe password hash</h3>
        <hr />
        <span>
          <p>
            <b>Definition: </b>
          </p>
          <p>
            In cryptography, a hash function is a mathematical algorithm that
            maps data of any size to a bit string of a fixed size.
            <br />
            We can refer to the function input as message or simply as input.
            <br />
            The fixed-size string function output is known as the hash or the
            message digest.
          </p>
        </span>
      </div>
    </>
  );
};

// Login
const LoginDox = () => {
  return (
    <>
      <div className="paper_dox">
        <h1 className="dox_h1">Login</h1>
        <hr />
        <h3 className="dox_h3">Getting Started</h3>
        <br />
        <span>
          <p>
            Account creation is exclusively managed by Group Plan's developers
            or super users.
          </p>
          <p>
            To log in, simply enter your username and password; no other login
            methods are available.
          </p>
          <p style={{ color: "red" }}>
            It's important to note that accessing any functionality within Group
            Plan requires logging in first.
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">Anti Brutal Force script prevention</h3>
        <br />
        <span>
          <p>
            Group Plan uses a defending mechanism called Anti Brutal Force
            script prevention.
          </p>
          <p>
            <b>Brute-force attack definition: </b>
          </p>
          <p>
            <i>
              An attack in which cybercriminals utilize trial-and-error tactics
              to decode passwords, personal identification numbers (PINs),
            </i>
          </p>
          <p>
            <i>
              and other forms of login data by leveraging automated software to
              test large quantities of possible combinations.
            </i>
          </p>
          <hr />
          <p>
            To prevent these attacks, the user can only attempt to log in 5
            times. If the user does not succeed, the username and IP will be
            locked
          </p>
          <img src={LoginDoxImg} alt="" className="dox_responsive_img" />
          <p style={{ color: "red" }}>
            <i>
              Locked accounts can only be unlocked by Group Plan's super users
              and developers.
            </i>
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">Whitelisted IPs</h3>
        <br />
        <span>
          <p>
            Group Plan maintains a list of approved IP addresses in its
            whitelist.
          </p>
          <p>
            IP addresses included in the whitelist are exempt from the
            Anti-Bruteforce security mechanism.
          </p>
          <p>
            For instance, if you attempt to log in unsuccessfully up to 5 times
            from the Cosmoplan's network, your account will not be subject to
            automatic locking.
          </p>
        </span>

        <hr />
        <h3 className="dox_h3">Blacklisted IPs</h3>
        <br />
        <span>
          <p>
            Group Plan maintains a list of restricted IP addresses in its
            blacklist.
          </p>
          <p>
            IP addresses included in the blacklist are permanently denied access
            and cannot perform any actions within Group Plan.
          </p>
          <p>
            IPs that repeatedly attempt to log in unsuccessfully over an
            extended duration will be added to the blacklist.
          </p>
        </span>
      </div>
    </>
  );
};

// 404 page
const FourOFourDox = () => {
  return (
    <>
      <div className="paper_dox">
        <h1 className="dox_h1">404 Page</h1>
        <hr />
        <h3 className="dox_h3">Definition of the 404 Error Code</h3>
        <br />
        <span>
          <p>
            The 404 error code is a status code used to inform web users that a
            requested web page is unavailable.
          </p>
          <p>
            This code, along with other response status codes, is an integral
            part of the Hypertext Transfer Protocol (HTTP) used on the web.
          </p>
          <p>
            Specifically, the 404 code indicates that the server could not
            locate the webpage requested by the client.
          </p>
          <p>
            Variations of the error message include "404 Error," "404 Page Not
            Found," and "The requested URL was not found."
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">Example</h3>
        <br />
        <span>
          <p style={{ color: "red" }}>
            When a user enters a URL that doesn't match any of the software's
            valid URLs in their request, the 404 page will be displayed.
          </p>
          <p>
            For instance, if we are currently at the software's "/staff_dox" URL
            and input an incorrect URL, such as "/staff_dox123," we will
            encounter a 404 error.
          </p>
          <img src={FourOFourDoxImg} alt="" className="dox_responsive_img" />
        </span>
      </div>
    </>
  );
};

// Protected route
const ProtectedRouteDox = () => {
  return (
    <>
      <div className="paper_dox">
        <h1 className="dox_h1">Protected Route</h1>
        <hr />
        <h3 className="dox_h3">Definition</h3>
        <br />
        <span>
          <p>
            Protected routes are specific paths within the application that are
            only accessible to authorized users.
          </p>
          <p>
            To access these routes, users must meet specific criteria or
            conditions, typically related to their authentication status or
            permissions.
          </p>
          <p>
            For example, your application may restrict access to the dashboard
            page to only those users who are logged in.
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">Usage</h3>
        <br />
        <span>
          <p>
            In Group Plan, unauthorized users are not permitted to navigate
            through any part of the software.
          </p>
          <p>
            Therefore, to perform any actions or access any features within
            Group Plan, users are required to log in and obtain the necessary
            permissions.
          </p>
        </span>
      </div>
    </>
  );
};

// Help
const HelpDox = () => {
  return (
    <>
      <div className="paper_dox">
        <h1 className="dox_h1">Help</h1>
        <hr />
        <h3 className="dox_h3">Help Page Links</h3>
        <br />
        <span>
          <img src={HelpDoxImg} alt="" />
        </span>
        <hr />
        <h3 className="dox_h3">1) Staff Documentation</h3>
        <br />
        <span>
          <p>
            This page serves as a comprehensive manual designed to assist users
            in understanding how to effectively utilize Group Plan.
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">2) Developer Documentation</h3>
        <br />
        <span>
          <p>
            This page is an extensive manual tailored to help developers
            navigate, upgrade, modify, update, and edit Group Plan.
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">3) About</h3>
        <br />
        <span>
          <p>
            The "About" page provides insights into the background and overview
            of Group Plan.
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">4) Terms</h3>
        <br />
        <span>
          <p>
            The "Terms" page outlines the terms and conditions governing the
            usage of Group Plan.
          </p>
        </span>
      </div>
    </>
  );
};

// Usefull links
const UsefulLinksDox = () => {
  return (
    <>
      <div className="paper_dox">
        <h1 className="dox_h1">Useful Links</h1>
        <hr />
        <h3 className="dox_h3">Information</h3>
        <br />
        <span>
          <p>All of these useful links are external resources.</p>
          <p>
            This means that they are not part of Group Plan and are not
            maintained by Cosmoplan.
          </p>
          <p>
            Users are required to adhere to the terms and conditions of each
            respective site.
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">Links</h3>
        <span>
          <img src={UsefulLinksImg} alt="" className="dox_responsive_img" />
        </span>
        <hr />
        <h3 className="dox_h3">1) Airport Codes</h3>
        <br />
        <span>
          <p>
            This page provides access to airport codes and related information
            for airports worldwide.
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">2) Passport Indexes</h3>
        <br />
        <span>
          <p>
            This page offers information regarding passports from around the
            world.
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">3) Currency Exchange Rates</h3>
        <br />
        <span>
          <p>
            This page allows users to check real-time currency exchange rates
            between different currencies.
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">4) Plane Finder</h3>
        <br />
        <span>
          <p>
            This page enables users to track planes using real-time satellite
            data.
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">5) Ship Finder</h3>
        <br />
        <span>
          <p>
            This page offers real-time satellite-based ship tracking
            capabilities.
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">6) COVID-19 Information</h3>
        <br />
        <span>
          <p>
            This page provides information related to COVID-19, sourced from the
            European Commission.
          </p>
        </span>
      </div>
    </>
  );
};

// Under construction
const UnderConstructionDox = () => {
  return (
    <>
      <div className="paper_dox">
        <h1 className="dox_h1">Under Construction</h1>
        <hr />
        <span>
          <p>
            The "Under Construction" page is a simple placeholder that typically
            includes an image.
          </p>
          <p>
            It is used on pages that are not yet live and are currently in the
            development phase.
          </p>
        </span>
        <br />
        <img
          src={UnderConstructionDoxImg}
          alt="Under Construction"
          className="dox_responsive_img"
        />
      </div>
    </>
  );
};

class General extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "Home",
    };
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  // On click, render selected component
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    return (
      <>
        <Grid.Column width={2}>
          <Menu pointing vertical>
            {/* Home */}
            <Menu.Item
              name="Home"
              active={this.state.activeItem === "Home"}
              onClick={this.handleItemClick}
            />

            {/* Cyber Security */}
            <Menu.Item
              name="Cyber Security"
              active={this.state.activeItem === "Cyber Security"}
              onClick={this.handleItemClick}
            />

            {/* Login */}
            <Menu.Item
              name="Login"
              active={this.state.activeItem === "Login"}
              onClick={this.handleItemClick}
            />

            {/* 404 */}
            <Menu.Item
              name="404"
              active={this.state.activeItem === "404"}
              onClick={this.handleItemClick}
            />

            {/* Protected Route */}
            <Menu.Item
              name="ProtectedRoute"
              active={this.state.activeItem === "ProtectedRoute"}
              onClick={this.handleItemClick}
            />

            {/* Help */}
            <Menu.Item
              name="Help"
              active={this.state.activeItem === "Help"}
              onClick={this.handleItemClick}
            />

            {/* Useful Links */}
            <Menu.Item
              name="Useful Links"
              active={this.state.activeItem === "Useful Links"}
              onClick={this.handleItemClick}
            />

            {/* Under Construction */}
            <Menu.Item
              name="Under Construction"
              active={this.state.activeItem === "Under Construction"}
              onClick={this.handleItemClick}
            />
          </Menu>
        </Grid.Column>

        {/* General's sub categories */}
        <Grid.Column width={10}>
          {this.state.activeItem === "Home" ? <HomeDox /> : ""}
          {this.state.activeItem === "Cyber Security" ? (
            <CyberSecurityDox />
          ) : (
            ""
          )}
          {this.state.activeItem === "Login" ? <LoginDox /> : ""}
          {this.state.activeItem === "404" ? <FourOFourDox /> : ""}
          {this.state.activeItem === "ProtectedRoute" ? (
            <ProtectedRouteDox />
          ) : (
            ""
          )}
          {this.state.activeItem === "Help" ? <HelpDox /> : ""}
          {this.state.activeItem === "Useful Links" ? <UsefulLinksDox /> : ""}
          {this.state.activeItem === "Under Construction" ? (
            <UnderConstructionDox />
          ) : (
            ""
          )}
        </Grid.Column>
      </>
    );
  }
}

export default General;
