// Built-ins
import React from "react";

// Functions / Components
import { Menu, Grid } from "semantic-ui-react";

// Images / Icons
import FourOFourDoxImg from "../../../images/dox/404_dox.png";
import HelpDoxImg from "../../../images/dox/help_dox.png";
import UsefulLinksImg from "../../../images/dox/useful_links_dox.png";
import UnderConstructionDoxImg from "../../../images/dox/under_construction_dox.png";
import LoginDoxImg from "../../../images/dox/login_staff_dox.png";

// Introduction tab
const IntroDox = () => {
  return (
    <>
      <div>
        <h1 className="dox_h1">Introduction</h1>
        <hr />
        <h3 className="dox_h3">General Information</h3>
        <br />
        <span>
          <p>
            Group plan is a web application created at 2008.
            <br />
            The purpose of group plan is to make tour operators manipulate data
            related to groups traveling mostly around Europe.
            <br />
            Group Plan's V2 was build at 2022 by the development team of
            cosmoplan.
            <br />
            Group Plan is composed by group management, reporting, data
            management and site adminsitration.
            <br />
            It is an online system, accessible over the internet, it has a
            custom authentication and object based permission system.
            <hr />
            <p style={{ color: "red" }}>
              To have a better understanding of how things work, you can read
              the comments in the code of Group plan.
            </p>
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">Technologies used (last update: 05-07-2022)</h3>
        <br />
        <span>
          {/* Stack */}
          <ul style={{ listStyle: "circle" }}>
            <li>Back end: Django 3.2.5</li>
            <li>Front end: ReactJS 18.2.0</li>
            <li>SQL: PostgreSQL 12.3</li>
            <li>OS: Debian 11 Bullseye</li>
            <li>Programming languages: Python 3.9, HTML, CSS, Javascript</li>
            <li>Version Control System: Git</li>
            <li>Unit Testing: Selenium: 4.1.0</li>
          </ul>
        </span>
        <hr />
        <h3 className="dox_h3">Python requirements</h3>
        <br />
        <span>
          {/* from requirements.txt */}
          <ul style={{ listStyle: "circle" }}>
            <li>appdirs==1.4.4</li>
            <li>arabic-reshaper==2.1.3</li>
            <li>asgiref==3.3.4</li>
            <li>async-generator==1.10</li>
            <li>attrs==21.2.0</li>
            <li>beautifulsoup4==4.9.3</li>
            <li>certifi==2020.12.5</li>
            <li>cffi==1.15.0</li>
            <li>chardet==4.0.0</li>
            <li>cryptography==36.0.0</li>
            <li>cycler==0.10.0</li>
            <li>distlib==0.3.1</li>
            <li>Django==3.2.5</li>
            <li>django-axes==5.13.1</li>
            <li>django-bootstrap-form==3.4</li>
            <li>django-cors-headers==3.7.0</li>
            <li>django-helpdesk==0.2.23</li>
            <li>django-ipware==3.0.2</li>
            <li>django-markdown-deux==1.0.5</li>
            <li>django-rest-framework==0.1.0</li>
            <li>django-tinymce==3.3.0</li>
            <li>djangorestframework==3.12.4</li>
            <li>email-reply-parser==0.5.12</li>
            <li>filelock==3.0.12</li>
            <li>flake8==3.9.2</li>
            <li>future==0.18.2</li>
            <li>googlemaps==4.4.5</li>
            <li>h11==0.12.0</li>
            <li>html5lib==1.1</li>
            <li>idna==2.10</li>
            <li>kiwisolver==1.3.1</li>
            <li>lxml==4.6.3</li>
            <li>markdown2==2.4.0</li>
            <li>matplotlib==3.4.1</li>
            <li>mccabe==0.6.1</li>
            <li>numpy==1.20.2</li>
            <li>opencv-python==4.5.3.56</li>
            <li>outcome==1.1.0</li>
            <li>Pillow==8.2.0</li>
            <li>psycopg2==2.8.6</li>
            <li>pycodestyle==2.7.0</li>
            <li>pycparser==2.21</li>
            <li>pyflakes==2.3.1</li>
            <li>pyOpenSSL==21.0.0</li>
            <li>pyparsing==2.4.7</li>
            <li>PyPDF2==1.26.0</li>
            <li>python-bidi==0.4.2</li>
            <li>python-dateutil==2.8.1</li>
            <li>python-docx==0.8.10</li>
            <li>pytz==2021.1</li>
            <li>reportlab==3.5.67</li>
            <li>requests==2.25.1</li>
            <li>selenium==4.1.0</li>
            <li>simplejson==3.17.2</li>
            <li>six==1.15.0</li>
            <li>sniffio==1.2.0</li>
            <li>sortedcontainers==2.4.0</li>
            <li>soupsieve==2.2.1</li>
            <li>sqlparse==0.4.1</li>
            <li>torch==1.9.1</li>
            <li>torchvision==0.10.1</li>
            <li>trio==0.19.0</li>
            <li>trio-websocket==0.9.2</li>
            <li>typing-extensions==3.10.0.2</li>
            <li>urllib3==1.26.4</li>
            <li>virtualenv==20.4.6</li>
            <li>webencodings==0.5.1</li>
            <li>wsproto==1.0.0</li>
            <li>xhtml2pdf==0.2.5</li>
          </ul>
        </span>
        <hr />
        <h3 className="dox_h3">Node requirements</h3>
        <br />
        {/* from package.json */}
        <span>
          <ul style={{ listStyle: "circle" }}>
            <li>@devexpress/dx-react-chart: ^2.7.5</li>
            <li>@devexpress/dx-react-chart-bootstrap4: ^2.7.5</li>
            <li>@devexpress/dx-react-core: ^2.7.5</li>
            <li>@fortawesome/fontawesome-free: ^5.15.3</li>
            <li>@material-ui/core: ^4.11.4</li>
            <li>@material-ui/lab: ^4.0.0-alpha.46</li>
            <li>@testing-library/jest-dom: ^5.12.0</li>
            <li>@testing-library/react: ^11.2.6</li>
            <li>@tinymce/tinymce-react: ^3.12.6</li>
            <li>apexcharts: ^3.29.0</li>
            <li>axios: ^0.21.1</li>
            <li>bootstrap: ^4.6.0</li>
            <li>bootstrap-css-only: ^4.4.1</li>
            <li>google-map-react: ^2.1.9</li>
            <li>moment: ^2.29.1</li>
            <li>npm-overlapping-marker-spiderfier: ^1.0.3</li>
            <li>peekdata-datagateway-api-sdk: ^3.1.5</li>
            <li>rc-time-picker: ^3.7.3</li>
            <li>react: ^17.0.2</li>
            <li>react-apexcharts: ^1.3.9</li>
            <li>react-bootstrap: ^1.6.0</li>
            <li>react-bootstrap-table-next: ^4.0.3</li>
            <li>react-bootstrap-table2-paginator: ^2.1.2</li>
            <li>react-bootstrap-table2-toolkit: ^2.1.3</li>
            <li>react-clock: ^3.1.0</li>
            <li>react-country-flag: ^2.3.0</li>
            <li>react-date-picker: ^8.1.1</li>
            <li>react-date-range: ^1.3.0</li>
            <li>react-datepicker: ^3.8.0</li>
            <li>react-dom: ^17.0.2</li>
            <li>react-google-maps: ^9.4.5</li>
            <li>react-icons: ^4.3.1</li>
            <li>react-minimal-pie-chart: ^8.2.0</li>
            <li>react-phone-input-2: ^2.14.0</li>
            <li>react-phone-number-input: ^3.1.46</li>
            <li>react-router-dom: ^5.2.0</li>
            <li>react-scripts: 4.0.3</li>
            <li>react-select: ^4.3.1</li>
            <li>react-simple-maps: ^2.3.0</li>
            <li>react-tabs: ^3.2.2</li>
            <li>react-time-picker: ^4.5.0</li>
            <li>react-timekeeper: ^2.2.1</li>
            <li>semantic-ui-css: ^2.4.1</li>
            <li>semantic-ui-react: ^2.0.3</li>
            <li>simple-react-lightbox: ^3.6.9-0</li>
            <li>supercluster: ^7.1.3</li>
            <li>sweetalert2: ^11.0.16</li>
            <li>use-supercluster: ^0.2.9</li>
            <li>web-vitals: ^1.1.1</li>
          </ul>
        </span>
      </div>
    </>
  );
};

// Setup tab
const SetupDox = () => {
  return (
    <>
      <h1 className="dox_h1">How to set up Group Plan</h1>
      <hr />
      <h3 className="dox_h3">Backend settings</h3>
      <br />
      <span>
        <p>
          To start the django server, navigate to the project's root ( backend
          folder) and run python3 manage.py runserver command.
          <br />
          By default, there is a cronjob running this command each time the
          Debian 11 VM is started.
          <br />
          Django runs at the localhost:8000 port, and uses the Django rest
          framework to communicate with the front end.
          <br />
          In the "core" folder you can find the settings.py file, including all
          of the basic configurations of the project.
          <br />
          More about that can be found at the
          <a
            href="https://docs.djangoproject.com/en/3.2/ref/settings/"
            rel="noreferrer"
            target="_blank"
          >
            Official documentation
          </a>
        </p>
      </span>
      <hr />
      <h3 className="dox_h3">Frontend settings</h3>
      <br />
      <span>
        <p>
          To start the ReactJS sever, navigate to project's frontend root (
          frontend folder ) and run this command from a terminal: "npm run
          build"
          <br />
          By default, there is a cronjob running this command each time the
          Debian 11 VM is started.
          <br />
          React runs at the localhost:3000 port, and uses the axios module to
          communicate with the backend.
        </p>
      </span>
      <hr />
      <h3 className="dox_h3">Database settings</h3>
      <br />
      <span>
        <p>
          Group plan uses a database called "V2". There is a cronjob backing up
          this database each Sunday.
          <br />
          The db's user name is postgres and a password authentication is
          required to take access.
          <br />
        </p>
      </span>
    </>
  );
};

// Cyber security tab
const CyberSecurityDox = () => {
  return (
    <>
      <div className="">
        <h1 className="dox_h1">General Info</h1>
        <p>
          Below You can see what kind of defense mechanisms Group Plan uses to
          avoid exploits, viruses, bugs and other attacking practices.
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
            Ransomware is malware that employs encryption to hold a victim's
            information at ransom.
            <br />
            A user or organization's critical data is encrypted so that they
            cannot access files, databases, or applications.
            <br />
            A ransom is then demanded to provide access. Ransomware is often
            designed to spread across a network and target database and file
            servers,
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
            A CRLF injection attack is one of several types of injection
            attacks.
            <br />
            It can be used to escalate to more malicious attacks such as
            Cross-site Scripting (XSS),
            <br />
            page injection, web cache poisoning, cache-based defacement, and
            more.
            <br />
            A CRLF injection vulnerability exists if an attacker can inject the
            CRLF characters into a web application,
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

// URLS tab
const URLS = () => {
  return (
    <>
      <div className="paper_dox">
        <h1 className="dox_h1">All project's URLS</h1>
        <hr />
        {/* From app.js routing */}
        <ul style={{ listStyle: "circle" }}>
          <li>path="/" ( Home page )</li>
          <li>path="/login"</li>
          <li>path="/about"</li>
          <li>path="/terms"</li>
          <li>path="/help"</li>
          <li>path="/staff_dox"</li>
          <li>path="/dev_dox"</li>
          <li>path="/useful_links"</li>
          <li>path="/under_construction"</li>
          <li>path="/group_management_root"</li>
          <li>path="/all_groups"</li>
          <li>path="/group/:refcode"</li>
          <li>path="/group_stats"</li>
          <li>path="/daily_status"</li>
          <li>path="/all_group_offers"</li>
          <li>path="/offer/:id"</li>
          <li>path="/availability"</li>
          <li>path="/pending_groups"</li>
          <li>path="/reports_root"</li>
          <li>path="/reports_agent"</li>
          <li>path="/reports_client"</li>
          <li>path="/reports_driver"</li>
          <li>path="/reports_group_leader"</li>
          <li>path="/reports_coach_operator"</li>
          <li>path="/reports_hotel"</li>
          <li>path="/reports_airport"</li>
          <li>path="/reports_city"</li>
          <li>path="/reports_user"</li>
          <li>path="/reports_expiring_documents"</li>
          <li>path="/reports_maps/city"</li>
          <li>path="/reports_maps/repair_shop"</li>
          <li>path="/reports_maps/coach_operator"</li>
          <li>path="/data_management_root"</li>
          <li>path="/all_agents"</li>
          <li>path="/agent/:id"</li>
          <li>path="/all_clients"</li>
          <li>path="/client/:id"</li>
          <li>path="/all_hotels"</li>
          <li>path="/hotel/:id"</li>
          <li>path="/all_drivers"</li>
          <li>path="/driver/:id"</li>
          <li>path="/all_group_leaders"</li>
          <li>path="/group_leader/:id"</li>
          <li>path="/all_coach_operators"</li>
          <li>path="/coach_operator/:id"</li>
          <li>path="/all_coaches"</li>
          <li>path="/coach/:id"</li>
          <li>path="/all_airlines"</li>
          <li>path="/airline/:id"</li>
          <li>path="/all_places"</li>
          <li>path="/place/:id"</li>
          <li>path="/all_repair_shops"</li>
          <li>path="/repair_shop/:id"</li>
          <li>path="/all_repair_types"</li>
          <li>path="/repair_type/:id"</li>
          <li>path="/all_airports"</li>
          <li>path="/airport/:name"</li>
          <li>path="/all_attractions"</li>
          <li>path="/attraction/:id"</li>
          <li>path="/all_guides"</li>
          <li>path="/guide/:id"</li>
          <li>path="/all_ports"</li>
          <li>path="/port/:id"</li>
          <li>path="/all_ferry_ticket_agencies"</li>
          <li>path="/ferry_ticket_agency/:id"</li>
          <li>path="/all_restaurants"</li>
          <li>path="/restaurant/:id"</li>
          <li>path="/all_theaters"</li>
          <li>path="/theater/:id"</li>
          <li>path="/all_sport_event_suppliers"</li>
          <li>path="/sport_event_supplier/:id"</li>
          <li>path="/all_cruising_companies"</li>
          <li>path="/cruising_company/:id"</li>
          <li>path="/all_teleferik_companies"</li>
          <li>path="/teleferik_company/:id"</li>
          <li>path="/all_ground_handling_companies"</li>
          <li>path="/ground_handling_company/:id"</li>
          <li>path="/all_train_ticket_agencies"</li>
          <li>path="/train_ticket_agency/:id"</li>
          <li>path="/all_services"</li>
          <li>path="/service/:id"</li>
          <li>path="/all_users"</li>
          <li>path="/user/:id"</li>
          <li>path="/user_permissions"</li>
          <li>path="/site_administration_root"</li>
          <li>path="/access_history"</li>
          <li>path="/logs"</li>
          <li>path="/conflicts"</li>
          <li>path="/incomplete_data"</li>
          <li>path="" ( 404 page )</li>
        </ul>
        <hr />
      </div>
    </>
  );
};

// Login tab
const LoginDox = () => {
  return (
    <>
      <div className="paper_dox">
        <h1 className="dox_h1">Login</h1>
        <hr />
        <h3 className="dox_h3">How to get started</h3>
        <br />
        <span>
          <p>
            Accounts can only be created by Group Plan's Developers or super
            users.
          </p>
          <p>
            To log in you only need to type your username and password, there is
            no alternative way to log in.
          </p>
          <p style={{ color: "red" }}>
            There is nothing a user can do without logging in to Group Plan
            first.
          </p>
        </span>
        <hr />
        {/* django-axes */}
        <h3 className="dox_h3">Anti Brutal Force script prevention</h3>
        <br />
        <span>
          <p>
            Group Plan uses a defending mechanism called Anti Brutal Force
            script prevention.
            <br />
            This is done from a python package called django-axes.
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
            To prevent these attacks, the user can only attempt to log in 3
            times. If the user does not succeed, the username and IP will be
            locked
          </p>
          <img src={LoginDoxImg} alt="" className="dox_responsive_img" />
          <p style={{ color: "red" }}>
            <i>
              Group plan's super users and developers can unblock a locked
              account.
            </i>
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">WhiteListed IPs</h3>
        <br />
        <span>
          <p>Group Plan has a set of IPs in it's whitelist.</p>
          <p>
            To modify whitelisted IPs, go to backend/accounts/views.py file and
            edit the list variable.
          </p>
          <p>
            Whitelisted IPs will be excluded from the Anti Brutal Force script
            defending mechanism.
          </p>
          <p>
            For example, if you try to log in 3 times unsuccessfully from
            Cosmoplan's network, your account will not get locked.
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">BlackListed IPs</h3>
        <br />
        <span>
          <p>Group Plan will have a set of IPs in it's blacklist.</p>
          <p>
            Django-axes automatically handles IPs to be blacklisted. More about
            django-axes can be found
            <br />
            at the
            <a
              href="https://django-axes.readthedocs.io/en/latest/"
              target="_blank"
              rel="noreferrer"
            >
              Official documentation
            </a>
          </p>
          <p>
            Blacklisted IPs will never be able to log in or take any actions to
            Group Plan.
          </p>
          <p>
            IPs unsuccessfully trying to log in to Group Plan over an extended
            period of time will get Blacklisted.
          </p>
        </span>
      </div>
    </>
  );
};

// 404 page
const FourOFourDox = () => {
  return (
    <div className="paper_dox">
      <h1 className="dox_h1">404 Page</h1>
      <hr />
      <h3 className="dox_h3">404 Overview</h3>
      <br />
      <span>
        <p>
          When communicating via HTTP, a server is required to respond to a
          request, such as a web browser request for a web page, with a numeric
          response code and an optional, mandatory, or disallowed (based upon
          the status code) message. In code 404, the first digit indicates a
          client error, such as a mistyped Uniform Resource Locator (URL). The
          following two digits indicate the specific error encountered. HTTP's
          use of three-digit codes is similar to the use of such codes in
          earlier protocols such as FTP and NNTP. At the HTTP level, a 404
          response code is followed by a human-readable "reason phrase". The
          HTTP specification suggests the phrase "Not Found" and many web
          servers by default issue an HTML page that includes both the 404 code
          and the "Not Found" phrase.
        </p>
        <p>
          A 404 error is often returned when pages have been moved or deleted.
          In the first case, it is better to employ URL mapping or URL
          redirection by returning a 301 Moved Permanently response, which can
          be configured in most server configuration files, or through URL
          rewriting; in the second case, a 410 Gone should be returned. Because
          these two options require special server configuration, most websites
          do not make use of them.
        </p>
        <p>
          404 errors should not be confused with DNS errors, which appear when
          the given URL refers to a server name that does not exist. A 404 error
          indicates that the server itself was found, but that the server was
          not able to retrieve the requested page.
        </p>
      </span>
      <hr />
      <h3 className="dox_h3">Soft 404 Errors</h3>
      <br />
      <span>
        <p>
          Some websites report a "not found" error by returning a standard web
          page with a "200 OK" response code, falsely reporting that the page
          loaded properly; this is known as a soft 404. The term "soft 404" was
          introduced in 2004 by Ziv Bar-Yossef et al.
        </p>
        <p>
          Soft 404s are problematic for automated methods of discovering whether
          a link is broken. Some search engines, like Yahoo and Google, use
          automated processes to detect soft 404s. Soft 404s can occur as a
          result of configuration errors when using certain HTTP server
          software, for example with the Apache software, when an Error Document
          404 (specified in a .htaccess file) is specified as an absolute path
          (e.g. http://example.com/error.html) rather than a relative path
          (/error.html). This can also be done on purpose to force some browsers
          (like Internet Explorer) to display a customized 404 error message
          rather than replacing what is served with a browser-specific
          "friendly" error message (in Internet Explorer, this behavior is
          triggered when a 404 is served and the received HTML is shorter than a
          certain length, and can be manually disabled by the user).
        </p>
        <p>
          There are also "soft 3XX" errors where content is returned with a
          status 200 but comes from a redirected page, such as when missing
          pages are redirected to the domain root/home page.
        </p>
      </span>
      <hr />
      <h3 className="dox_h3">Proxy servers</h3>
      <br />
      <span>
        <p>
          Some proxy servers generate a 404 error when a 500-range error code
          would be more correct. If the proxy server is unable to satisfy a
          request for a page because of a problem with the remote host (such as
          hostname resolution failures or refused TCP connections), this should
          be described as a 5xx Internal Server Error, but might deliver a 404
          instead. This can confuse programs that expect and act on specific
          responses, as they can no longer easily distinguish between an absent
          web server and a missing web page on a web server that is present.
        </p>
      </span>
      <hr />
      <h3 className="dox_h3">Intentional 404s</h3>
      <br />
      <span>
        <p>
          In July 2004, the UK telecom provider BT Group deployed the Cleanfeed
          content blocking system, which returns a 404 error to any request for
          content identified as potentially illegal by the Internet Watch
          Foundation. Other ISPs return a HTTP 403 "forbidden" error in the same
          circumstances. The practice of employing fake 404 errors as a means to
          conceal censorship has also been reported in Thailand and Tunisia. In
          Tunisia, where censorship was severe before the 2011 revolution,
          people became aware of the nature of the fake 404 errors and created
          an imaginary character named "Ammar 404" who represents "the invisible
          censor".
        </p>
      </span>
      <hr />
      <h3 className="dox_h3">Substatus codes</h3>
      <br />
      <span>
        <p>
          Microsoft's IIS 7.0, IIS 7.5, and IIS 8.0 servers define the following
          HTTP substatus codes to indicate a more specific cause of a 404 error:
        </p>
        <p></p>
        <ul>
          <li>404.0 – Not found.</li>
          <li>404.1 – Site Not Found.</li>
          <li>404.2 – ISAPI or CGI restriction.</li>
          <li>404.3 – MIME type restriction.</li>
          <li>404.4 – No handler configured.</li>
          <li>404.5 – Denied by request filtering configuration.</li>
          <li>404.6 – Verb denied.</li>
          <li>404.7 – File extension denied.</li>
          <li>404.8 – Hidden namespace.</li>
          <li>404.9 – File attribute hidden.</li>
          <li>404.10 – Request header too long.</li>
          <li>404.11 – Request contains double escape sequence.</li>
          <li>404.12 – Request contains high-bit characters.</li>
          <li>404.13 – Content length too large.</li>
          <li>404.14 – Request URL too long.</li>
          <li>404.15 – Query string too long.</li>
          <li>404.16 – DAV request sent to the static file handler.</li>
          <li>
            404.17 – Dynamic content mapped to the static file handler via a
            wildcard MIME mapping.
          </li>
          <li>404.18 – Query string sequence denied.</li>
          <li>404.19 – Denied by filtering rule.</li>
          <li>404.20 – Too Many URL Segments.</li>
        </ul>
      </span>
      <h3 className="dox_h3">Group Plan and 404 errors</h3>
      <br />
      <span>
        <p>
          In Group Plan, we use a component Route matched to a custom made
          component. the above code located in app.js does the job.
        </p>
        <p>{" <Route path='' component={FourOFour} /> "}</p>
        <p>FourOFour Component is located at components/core/404/404.jsx.</p>
        <p>
          In order for this to work correctly, it has to be the last Route in
          order. React Routing works from top to bottom, so if there is no
          matching URL, 404 will be rendered.
        </p>
      </span>
      <img src={FourOFourDoxImg} alt="" className="dox_responsive_img" />
      <p>
        Source
        <a href="https://en.wikipedia.org/wiki/HTTP_404">wikipedia.com</a>
      </p>
    </div>
  );
};

// Protected Route
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
            Protected routes are those routes that only grant access to
            authorized users.
          </p>
          <p>
            This means that users must first meet certain conditions before
            accessing that specific route.
          </p>
          <p>
            For instance, your application can require only logged-in users be
            able to visit the dashboard page
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">Usage</h3>
        <br />
        <span>
          <p>
            Group Plan does not allow unauthorized users to navigate anywhere in
            the software
          </p>
          <p>
            This means that before you can do anything in Group plan, first you
            will have to log in
          </p>
        </span>
      </div>
    </>
  );
};

// url: help
const HelpDox = () => {
  return (
    <>
      <div className="paper_dox">
        <h1 className="dox_h1">Help</h1>
        <hr />
        <h3 className="dox_h3">Help page Links</h3>
        <br />
        <span>
          <img src={HelpDoxImg} alt="" />
        </span>
        <hr />
        <h3 className="dox_h3">1) Staff Documentation</h3>
        <br />
        <span>
          <p>
            This page is a manual created in order to help users figure out how
            to use Group Plan.
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">2) Developer Documentation</h3>
        <br />
        <span>
          <p>
            This page is a manual created in order to help developers figure out
            how to use, upgrade, modify, update and edit Group Plan.
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">3) About</h3>
        <br />
        <span>
          <p>Group Plan's about page.</p>
        </span>
        <hr />
        <h3 className="dox_h3">4) Terms</h3>
        <br />
        <span>
          <p>Group Plan's terms and conditions page.</p>
        </span>
      </div>
    </>
  );
};

// url: useful_links
const UsefulLinksDox = () => {
  return (
    <>
      <div className="paper_dox">
        <h1 className="dox_h1">Useful Links</h1>
        <hr />
        <h3 className="dox_h3">Information</h3>
        <br />
        <span>
          <p>All useful Links are external.</p>
          <p>
            This means that they do not belong to Group Plan and are not
            maintained by Cosmoplan.
          </p>
          <p>The User has to follow each site's terms and condition</p>
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
            In this page you can get each Airport's code and other information
            related to airports.
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">2) Passport Indexes</h3>
        <br />
        <span>
          <p>
            In this page you can get information related to passports all over
            the world.
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">3) Currency Exchange Rates</h3>
        <br />
        <span>
          <p>
            In this page you can find out the rates between currencies in real
            time.
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">4) Plane Finder</h3>
        <br />
        <span>
          <p>
            In this page you can track planes using satelite data in real time.
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">5) Ship Finder</h3>
        <br />
        <span>
          <p>
            In this page you can track planes using satelite data in real time.
          </p>
        </span>
        <hr />
        <h3 className="dox_h3">6) Information about Covid-19</h3>
        <br />
        <span>
          <p>
            In this page you can find information related to Covid-19, created
            by the European Commission.
          </p>
        </span>
      </div>
    </>
  );
};

// url: under_construction
const UnderConstructionDox = () => {
  return (
    <>
      <div>
        <h1 className="dox_h1">Under Construction</h1>
        <hr />
        <span>
          <p>A simple page containing an Image, Under construction is used</p>
          <p> on pages which are not live yet and are about to be developed.</p>
        </span>
        <br />
        <img
          src={UnderConstructionDoxImg}
          alt=""
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
      activeItem: "Introduction",
    };
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    return (
      <>
        <Grid stackable columns={2}>
          <Grid.Column width={2}>
            <Menu pointing vertical>
              <Menu.Item
                name="Introduction"
                active={this.state.activeItem === "Introduction"}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name="Setup"
                active={this.state.activeItem === "Setup"}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name="URLS"
                active={this.state.activeItem === "URLS"}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name="Cyber Security"
                active={this.state.activeItem === "Cyber Security"}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name="Login"
                active={this.state.activeItem === "Login"}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name="404"
                active={this.state.activeItem === "404"}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name="ProtectedRoute"
                active={this.state.activeItem === "ProtectedRoute"}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name="Help"
                active={this.state.activeItem === "Help"}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name="Useful Links"
                active={this.state.activeItem === "Useful Links"}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name="Under Construction"
                active={this.state.activeItem === "Under Construction"}
                onClick={this.handleItemClick}
              />
            </Menu>
          </Grid.Column>
          <Grid.Column>
            {this.state.activeItem === "Introduction" ? <IntroDox /> : ""}
            {this.state.activeItem === "Setup" ? <SetupDox /> : ""}
            {this.state.activeItem === "Cyber Security" ? (
              <CyberSecurityDox />
            ) : (
              ""
            )}
            {this.state.activeItem === "URLS" ? <URLS /> : ""}
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
        </Grid>
      </>
    );
  }
}

export default General;
