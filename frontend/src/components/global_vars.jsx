// Modules / Functions
import { Breadcrumb, Card } from "react-bootstrap";
import { Popup, Button } from "semantic-ui-react";

// Icons / Images
import {
  BiHelpCircle,
  BiBriefcase,
  BiAnchor,
  BiRestaurant,
  BiFootball,
  BiTransfer,
  BiBus,
  BiStats,
  BiFolder,
  BiMailSend,
  BiUser,
} from "react-icons/bi";
import {
  AiOutlineLogin,
  AiOutlineSetting,
  AiOutlineWarning,
  AiOutlineUser,
  AiOutlineFileSearch,
  AiFillLock,
} from "react-icons/ai";
import { GoLaw } from "react-icons/go";
import {
  MdUpdate,
  MdLocalAirport,
  MdSupportAgent,
  MdEventAvailable,
  MdGroup,
  MdPendingActions,
  MdLocalOffer,
  MdAccessTime,
  MdOutlineIncompleteCircle,
  MdTravelExplore,
  MdOutlinePlaylistAdd,
  MdFolderShared,
} from "react-icons/md";
import { ImBooks, ImBlocked } from "react-icons/im";
import {
  FaCode,
  FaDatabase,
  FaFileContract,
  FaTheaterMasks,
  FaListUl,
  FaRegListAlt,
  FaRoute,
  FaSuitcaseRolling,
  FaInfo,
  FaHandshake,
  FaFileInvoice,
  FaPiggyBank,
  FaCar,
  FaIdeal,
} from "react-icons/fa";
import { BsFillKeyFill, BsFillPinMapFill } from "react-icons/bs";
import { RiGalleryFill, RiGuideLine, RiAdminLine, RiBusLine, RiAdvertisementFill } from "react-icons/ri";
import { SiChinasouthernairlines } from "react-icons/si";
import { FaMapMarkedAlt, FaParking, FaMapMarkerAlt } from "react-icons/fa";
import { IoIosOptions } from "react-icons/io";
import {
  GiBus,
  GiShipWheel,
  GiEarthAmerica,
  GiSteeringWheel,
  GiBattleship,
  GiRailway,
  GiConvergenceTarget,
  GiMagickTrick,
  GiCommercialAirplane,
} from "react-icons/gi";

import { TiGroupOutline, TiGroup } from "react-icons/ti";
import { FaHotel, FaCity, FaScrewdriver, FaChartLine } from "react-icons/fa";
import { BsFillPuzzleFill, BsBank } from "react-icons/bs";
import { WiTrain } from "react-icons/wi";
import { ImCalendar } from "react-icons/im";
import { HiDocumentSearch, HiOutlineDocumentReport } from "react-icons/hi";

export const iconStyle = {
  color: "#2a9fd9",
  fontSize: "1.5em",
  marginRight: "0.5em",
};

export const restrictedUsers = () => {
  return ["HCGBJ", "HCGSH", "HCGGZ", "HCGCD", "HCGWH", "HCGXM", "HCGAT"];
};

// Helper Component
const loginHelpContent = () => (
  <>
    <ul>
      <li>
        <h6>How Can I Create an account?</h6>
        <p>
          In order to create an account, contact Cosmoplan's IT department or a
          Group Plan's Superuser
        </p>
      </li>
      <hr />
      <li>
        <h6>What is a Whitelisted IP?</h6>
        <p>
          A whitelisted IP is an IP which is considered safe by Cosmoplan's IT
          dept. and will not be included to the auto ban mechanism
        </p>
      </li>
      <hr />
      <li>
        <h6>Why am I locked?</h6>
        <p>
          Group Plan uses a mechanism to avoid brutal force attacks. In case you
          fail to log in five times, your account will get locked
        </p>
      </li>
      <hr />
      <li>
        <h6>What do I have to do if I get locked?</h6>
        <p>
          If you get locked, you will have to contact Cosmoplan IT department or
          a Group Plan's Superuser
        </p>
      </li>
    </ul>
  </>
);

const allServicesHelpContent = () => (
  <>
    <ul style={{ listStyle: "circle" }}>
      <li>
        <h6> What are Group's Services? </h6>
        <p>
          Group's services are extra tour services we provide to a group.
          Available options are the icons on the left of the page
        </p>
      </li>
      <hr />
      <li>
        <h6> How can I add a service? </h6>
        <p>
          You can add a service by pressing the Create New Service button ,
          while having the appropriate permission to do so.
        </p>
      </li>
      <hr />
      <li>
        <h6> How can I see more details about each service? </h6>
        <p>
          To see more details about each service, select the appropriate
          category on the left
        </p>
      </li>
    </ul>
  </>
);

const allOffersHelpContent = () => (
  <>
    <ul>
      <li>
        <h6>What is n Offer?</h6>
        <p>Offer is used to calculate profits based on a group's services</p>
      </li>
      <hr />
      <li>
        <h6>Are Offers related to Groups?</h6>
        <p>
          Offers are not related to Groups. An offer can be created regardless
        </p>
      </li>
    </ul>
  </>
);

const coachAvailabilityHelpContent = () => (
  <>
    <ul style={{ listStyle: "circle" }}>
      <li>
        <h6>What is Availability?</h6>
        <p>
          Availability is a page showing whether a coach/driver is available on
          specific dates. Green boxes indicate that the driver is available,
          while red ones the opposite.
        </p>
      </li>
    </ul>
  </>
);

const driverAvailabilityHelpContent = () => (
  <>
    <ul style={{ listStyle: "circle" }}>
      <li>
        <h6>What is Availability?</h6>
        <p>
          Availability is a page showing whether a coach/driver is available on
          specific dates. Green boxes indicate that the driver is available,
          while red ones the opposite.
        </p>
      </li>
    </ul>
  </>
);

const dailyStatusHelpContent = () => (
  <>
    <ul style={{ listStyle: "circle" }}>
      <li>
        <h6> What is Daily Status? </h6>
        <p>
          Daily status is a page with all the ongoing groups of the selected
          date.
        </p>
      </li>
    </ul>
  </>
);

const groupOverviewHelpContent = () => (
  <>
    <ul style={{ listStyle: "circle" }}>
      <li>
        <h6> What is Group's Overview? </h6>
        <p>
          Group's Overview is the group's main tab. Here you can enter the core
          data of a group.
        </p>
      </li>
      <hr />
      <li>
        <h6> How does Coach and Drivers Information table work? </h6>
        <p>
          This table shows information based on group's schedule. Columns are:
          <ul style={{ listStyle: "upper-roman" }}>
            <li>Period</li>
            <li>Driver</li>
            <li>Coach Op.</li>
            <li>Coach Make</li>
            <li>Plate</li>
            <li>Num Seats</li>
          </ul>
        </p>
      </li>
    </ul>
  </>
);

const groupItineraryHelpContent = () => (
  <>
    <ul style={{ listStyle: "circle" }}>
      <li>
        <h6>What are the Group Itineraries? </h6>
        <p>
          Group itineraries are 2 types of documents showing details of the
          group in PDF format.
        </p>
      </li>
      <hr />
      <li>
        <h6> How should I decide which one suits best for me? </h6>
        <p>
          Types are:
          <ul style={{ listStyle: "upper-roman" }}>
            <li> Brief </li>
            <small>Brief Itinerary shows basic information of the group</small>
            <li> Extensive </li>
            <small>
              Extensive shows a detailed day by day itinerary of the group
            </small>
          </ul>
        </p>
      </li>
      <hr />
      <li>
        <h6>How can I input the rooming list?</h6>
        <p>
          Rooming list has a strict format. Group Plan only accepts a rooming
          list of table type, The default table shows how the headers should be
          structured, in order to be accepted by the PDF auto generated
          Itineraries.
        </p>
      </li>
    </ul>
  </>
);

const groupDocumentsHelpContent = () => (
  <>
    <ul style={{ listStyle: "circle" }}>
      <li>
        <h6> What are the Group Documents? </h6>
        <p>
          Group Documents page is a simple page to provide storage for any
          important group files.
        </p>
      </li>
    </ul>
  </>
);

const groupRoomingListsHelpContent = () => (
  <>
    <ul style={{ listStyle: "circle" }}>
      <li>
        <h6> What are Group's Rooming Lists? </h6>
        <p>
          Rooming lists contain the names and details of people staying in the
          hotels
        </p>
      </li>
      <hr />
      <li>
        <h6> What is the Text field on the bottom right of the page? </h6>
      </li>
    </ul>
  </>
);

const groupRouteHelpContent = () => (
  <>
    <ul>
      <li>
        <h6>How is Group's route rendered?</h6>
        <p>
          Group's route is based on the schedule's hotels data and the departure
          flight
        </p>
      </li>
      <hr />
      <li>
        <h6>Why can't I see the map?</h6>
        <p>
          If Group's departure flight is not filled and there are no hotels in
          schedule's traveldays, the map will not be rendered
        </p>
      </li>
    </ul>
  </>
);

const groupScheduleHelpContent = () => (
  <>
    <ul style={{ listStyle: "circle" }}>
      <li>
        <h6> What is Group's Schedule? </h6>
        <p>
          Schedule is a table with details about each travelday of the group
        </p>
      </li>
      <hr />
      <li>
        <h6> Why can't I change the last day's hotel or location? </h6>
        <p>
          Schedule's last day fetches information from the group's departure
          flight
        </p>
      </li>
      <hr />
      <li>
        <h6> How many traveldays can I add to the schedule? </h6>
        <p>
          Group's Schedule has no maximum limit of traveldays, however, if the
          dates of the days are not consecutive, a red message will appear at
          the bottom
        </p>
      </li>
    </ul>
  </>
);

// Variables
const groupServicesHelpContent = () => (
  <>
    <ul style={{ listStyle: "circle" }}>
      <li>
        <h6> What are Group's Services? </h6>
        <p>
          Group's services are extra tour services we provide to a group.
          Available options are the icons on the left of the page
        </p>
      </li>
      <hr />
      <li>
        <h6> How can I add a service? </h6>
        <p>
          You can add a service by pressing the Create New Service button ,
          while having the appropriate permission to do so.
        </p>
      </li>
      <hr />
      <li>
        <h6> How can I see more details about each service? </h6>
        <p>
          To see more details about each service, select the appropriate
          category on the left
        </p>
      </li>
    </ul>
  </>
);

// Variables
const groupStatsHelpContent = () => (
  <>
    <ul style={{ listStyle: "circle" }}>
      <li>
        <h6> What are Group's Stats? </h6>
        <p>
          Group Statistics is a group reporting page , constructed by a date
          picker, graphs and tables
        </p>
      </li>
      <hr />
      <li>
        <h6> What stats can we see in this page? </h6>
        <p>
          <ul style={{ listStyle: "upper-roman" }}>
            <li>Groups</li>
            <li>Days</li>
            <li>Services</li>
            <li>Office Based %</li>
            <li>Confirmed / Cancelled %</li>
            <li>Country Usage %</li>
            <li>Other stats</li>
          </ul>
        </p>
      </li>
    </ul>
  </>
);

const pendingHelpContent = () => (
  <>
    <ul style={{ listStyle: "circle" }}>
      <li>
        <h6>What is pending groups?</h6>
        <p>
          Pending groups is a page showing upcoming groups having not fulfilled
          data.
        </p>
      </li>
      <hr />
      <li>
        <h6> Data table: </h6>
        <p>
          Columns:
          <ul style={{ listStyle: "upper-roman" }}>
            <li>Hotels</li>
            <p>
              All group's days needs to have hotel except the departure date.
            </p>
            <li>Drivers</li>
            <p>All group's days needs to have driver</p>
            <li>Coaches</li>
            <p>All group's days needs to have driver</p>
            <li>Arrival</li>
            <p>Group's Arrival flight, find it in group's overview</p>
            <li>Departure</li>
            <p>Group's Departure flight, find it in group's overview</p>
            <li>PAX</li>
            <p>Group's number of people, find it in group's overview</p>
            <li>Leader</li>
            <p>Group's leader, find it in group's overview</p>
          </ul>
        </p>
      </li>
    </ul>
  </>
);

const offerOverviewHelpContent = () => (
  <>
    <ul style={{ listStyle: "circle" }}>
      <li>
        <h6> Offers have two types: </h6>
        <ul style={{ listStyle: "square" }}>
          <li>
            <p>Per Person</p>
            <p>This Offer type calculates the total cost per person</p>
          </li>
          <hr />
          <li>
            <p>By Scale</p>
            <p>
              This Offer type calculates the total cost based on the number of
              people.
            </p>
          </li>
        </ul>
      </li>
    </ul>
  </>
);

const offerTemplatesHelpContent = () => (
  <>
    <ul style={{ listStyle: "circle" }}>
      <li>
        <h6>What are templates used for?</h6>
        <ul style={{ listStyle: "square" }}>
          <li>
            <p>Text Templates are used for the final PDF</p>
          </li>
          <li>
            <p>
              Their purpose is to make the user enter the data related to the
              offer faster by using check boxes instead of typing .
            </p>
          </li>
        </ul>
      </li>
      <li>
        <h6>How do I add a template?</h6>
        <ul style={{ listStyle: "square" }}>
          <li>
            <p>
              All categories are free texted fields, text template entries can
              be edited in data management.
            </p>
          </li>
          <li>
            <p>
              Each text template is divided into the folowing 4 categories, plus
              the selected language.
            </p>
          </li>
        </ul>
      </li>
    </ul>
  </>
);

const accessHistoryHelpContent = () => (
  <>
    <ul style={{ listStyle: "circle" }}>
      <li>
        <h6> What is Access History? </h6>
        <p>
          In this page we can see all locked users, login attempts and logouts
        </p>
      </li>
      <hr />
      <li>
        <h6> How can I unlock a user ? </h6>
        <p>
          In order to remove a user's lock , you need the appropriate
          permissions
        </p>
      </li>
    </ul>
  </>
);

const conflictHelpContent = () => (
  <>
    <ul style={{ listStyle: "circle" }}>
      <li>
        <h6> What are the Conflicts? </h6>
        <p>
          When a driver or a coach are present at 2 traveldays with the same
          date, a conflict entry is created
        </p>
      </li>
      <hr />
      <li>
        <h6> What does the "Validate" button do? </h6>
        <p>
          The Validate button marks the days where the conflict is present as
          valid. Valid days will not be rendered in this table
        </p>
      </li>
      <hr />
      <li>
        <h6>
          What do I have to do if the conflict comes up after a wrong data
          entry?
        </h6>
        <p>
          The user should navigate to the group's schedule and correct the data
          accordingly
        </p>
      </li>
    </ul>
  </>
);

const userPermisssionHelpContent = () => (
  <>
    <ul style={{ listStyle: "circle" }}>
      <li>
        <h6> What are User Permissions? </h6>
        <p> Permissions allow you to take actions over objects </p>
      </li>
      <li>
        <h6> How can I update a value?</h6>
        <p>
          Group plan has a custom object based permission system. This means
          that each object in the database has its own set of the four
          permissions. For example, If you need to update an Agent's name, you
          need the Update Agent permission.
        </p>
      </li>
      <hr />
      <li>
        <h6>Why don't I have any permission?</h6>
        <p>
          Created users have zero permissions for Group Plan's enhanced
          security. If you need permissions you need to ask from the Cosmoplan's
          IT department, or a user with the permission to pass permissions
        </p>
      </li>
    </ul>
  </>
);

const logsHelpContent = () => (
  <>
    <ul style={{ listStyle: "circle" }}>
      <li>
        <h6> What are the Logs? </h6>
        <p>This page shows any action taken in Group Plan</p>
      </li>
      <hr />
      <li>
        <h6>Why can't I see the logs?</h6>
        <p>
          In order to see the logs you need to have the appropriate permission
        </p>
      </li>
    </ul>
  </>
);

const incompleteDataHelpContent = () => (
  <>
    <ul style={{ listStyle: "circle" }}>
      <li>
        <h6> What is Incomplete Data? </h6>
        <p>
          Incomplete data is an entry which does not have a required field
          filled.
        </p>
      </li>
      <hr />
      <li>
        <h6> How can an entry not have a required field filled? </h6>
        <p>Required field standards changed from group plan's first version</p>
      </li>
    </ul>
  </>
);

export const languagePerCountry = {
  "Afghanistan": "Pashto",
  "Albania": "Albanian",
  "Algeria": "Arabic",
  "Aland Islands": "Swedish",
  "American Samoa": "English",
  "Andorra": "Catalan",
  "Angola": "Portuguese",
  "Anguilla": "English",
  "Antigua and Barbuda": "English",
  "Argentina": "Spanish",
  "Armenia": "Armenian",
  "Aruba": "Dutch",
  "Australia": "English",
  "Austria": "German",
  "Azerbaijan": "Azerbaijani",
  "Bahamas": "English",
  "Bahrain": "Arabic",
  "Bangladesh": "Bengali",
  "Barbados": "English",
  "Belarus": "Belarusian",
  "Belgium": "Dutch",
  "Belize": "English",
  "Benin": "French",
  "Bermuda": "English",
  "Bhutan": "Dzongkha",
  "Bolivia": "Spanish",
  "Bosnia and Herzegovina": "Bosnian",
  "Botswana": "English",
  "Bouvet Island": "Norwegian",
  "Brazil": "Portuguese",
  "British Indian Ocean Territory": "English",
  "British Virgin Islands": "English",
  "Brunei Darussalam": "Malay",
  "Bulgaria": "Bulgarian",
  "Burkina Faso": "French",
  "Burundi": "Kirundi",
  "Cambodia": "Khmer",
  "Cameroon": "French",
  "Canada": "English",
  "Cape Verde": "Portuguese",
  "Cayman Islands": "English",
  "Central African Republic": "French",
  "Chad": "French",
  "Chile": "Spanish",
  "China": "Chinese",
  "Christmas Island": "English",
  "Cocos (Keeling) Islands": "English",
  "Colombia": "Spanish",
  "Comoros": "Comorian",
  "Congo (Brazzaville)": "French",
  "Democratic Republic of the Congo": "French",
  "Cook Islands": "English",
  "Costa Rica": "Spanish",
  "Côte d'Ivoire": "French",
  "Croatia": "Croatian",
  "Cuba": "Spanish",
  "Cyprus": "Greek",
  "Czechia": "Czech",
  "Denmark": "Danish",
  "Djibouti": "French",
  "Dominica": "English",
  "Dominican Republic": "Spanish",
  "Ecuador": "Spanish",
  "Egypt": "Arabic",
  "El Salvador": "Spanish",
  "Equatorial Guinea": "Spanish",
  "Eritrea": "Tigrinya",
  "Estonia": "Estonian",
  "Ethiopia": "Amharic",
  "Faroe Islands": "Faroese",
  "Falkland Islands (Malvinas)": "English",
  "Fiji": "Fijian",
  "Finland": "Finnish",
  "France": "French",
  "French Guiana": "French",
  "French Polynesia": "French",
  "French Southern Territories": "French",
  "Gabon": "French",
  "Gambia": "English",
  "Georgia": "Georgian",
  "Germany": "German",
  "Ghana": "English",
  "Gibraltar": "English",
  "Greece": "Greek",
  "Greenland": "Greenlandic",
  "Grenada": "English",
  "Guadeloupe": "French",
  "Guam": "English",
  "Guatemala": "Spanish",
  "Guernsey": "English",
  "Guinea": "French",
  "Guinea-Bissau": "Portuguese",
  "Guyana": "English",
  "Haiti": "Haitian Creole",
  "Honduras": "Spanish",
  "Hong Kong": "Chinese",
  "Hungary": "Hungarian",
  "Iceland": "Icelandic",
  "India": "Hindi",
  "Indonesia": "Indonesian",
  "Iran": "Persian",
  "Iraq": "Arabic",
  "Ireland": "Irish",
  "Isle of Man": "English",
  "Israel": "Hebrew",
  "Italy": "Italian",
  "Jamaica": "English",
  "Japan": "Japanese",
  "Jersey": "English",
  "Jordan": "Arabic",
  "Kazakhstan": "Kazakh",
  "Kenya": "English",
  "Kiribati": "Gilbertese",
  "Kuwait": "Arabic",
  "Kyrgyzstan": "Kyrgyz",
  "Laos": "Lao",
  "Latvia": "Latvian",
  "Lebanon": "Arabic",
  "Lesotho": "Sesotho",
  "Liberia": "English",
  "Libya": "Arabic",
  "Liechtenstein": "German",
  "Lithuania": "Lithuanian",
  "Luxembourg": "Luxembourgish",
  "Macao": "Chinese",
  "Madagascar": "Malagasy",
  "Malawi": "English",
  "Malaysia": "Malay",
  "Maldives": "Dhivehi",
  "Mali": "French",
  "Malta": "Maltese",
  "Marshall Islands": "Marshallese",
  "Martinique": "French",
  "Mauritania": "Arabic",
  "Mauritius": "English",
  "Mayotte": "French",
  "Mexico": "Spanish",
  "Micronesia": "English",
  "Moldova": "Romanian",
  "Monaco": "French",
  "Mongolia": "Mongolian",
  "Montenegro": "Montenegrin",
  "Montserrat": "English",
  "Morocco": "Arabic",
  "Mozambique": "Portuguese",
  "Myanmar": "Burmese",
  "Namibia": "English",
  "Nauru": "Nauruan",
  "Nepal": "Nepali",
  "Netherlands": "Dutch",
  "Netherlands Antilles": "Dutch",
  "New Caledonia": "French",
  "New Zealand": "English",
  "Nicaragua": "Spanish",
  "Niger": "French",
  "Nigeria": "English",
  "Niue": "Niuean",
  "Norfolk Island": "English",
  "North Korea": "Korean",
  "Norway": "Norwegian",
  "Oman": "Arabic",
  "Pakistan": "Urdu",
  "Palau": "Palauan",
  "Palestine": "Arabic",
  "Panama": "Spanish",
  "Papua New Guinea": "English",
  "Paraguay": "Spanish",
  "Peru": "Spanish",
  "Philippines": "Filipino",
  "Pitcairn": "English",
  "Poland": "Polish",
  "Portugal": "Portuguese",
  "Puerto Rico": "Spanish",
  "Qatar": "Arabic",
  "Romania": "Romanian",
  "Russia": "Russian",
  "Rwanda": "Kinyarwanda",
  "Saint-Barthélemy": "French",
  "Saint Helena": "English",
  "Saint Kitts and Nevis": "English",
  "Saint Lucia": "English",
  "Saint-Martin (French part)": "French",
  "Saint Pierre and Miquelon": "French",
  "Saint Vincent and Grenadines": "English",
  "Samoa": "Samoan",
  "San Marino": "Italian",
  "Sao Tome and Principe": "Portuguese",
  "Saudi Arabia": "Arabic",
  "Senegal": "French",
  "Serbia": "Serbian",
  "Seychelles": "English",
  "Sierra Leone": "English",
  "Singapore": "English",
  "Slovakia": "Slovak",
  "Slovenia": "Slovene",
  "Solomon Islands": "English",
  "Somalia": "Somali",
  "South Africa": "Afrikaans",
  "South Georgia and the South Sandwich Islands": "English",
  "South Korea": "Korean",
  "South Sudan": "English",
  "Spain": "Spanish",
  "Sri Lanka": "Sinhala",
  "Sudan": "Arabic",
  "Suriname": "Dutch",
  "Svalbard and Jan Mayen Islands": "Norwegian",
  "Swaziland": "Swazi",
  "Sweden": "Swedish",
  "Switzerland": "German",
  "Syria": "Arabic",
  "Taiwan": "Chinese",
  "Tajikistan": "Tajik",
  "Tanzania": "Swahili",
  "Thailand": "Thai",
  "Timor-Leste": "Tetum",
  "Togo": "French",
  "Tokelau": "Tokelauan",
  "Tonga": "Tongan",
  "Trinidad and Tobago": "English",
  "Tunisia": "Arabic",
  "Turkey": "Turkish",
  "Turkmenistan": "Turkmen",
  "Turks and Caicos Islands": "English",
  "Tuvalu": "Tuvaluan",
  "Uganda": "English",
  "Ukraine": "Ukrainian",
  "United Arab Emirates": "Arabic",
  "United Kingdom": "English",
  "United States": "English",
  "United States Minor Outlying Islands": "English",
  "Uruguay": "Spanish",
  "Uzbekistan": "Uzbek",
  "Vanuatu": "Bislama",
  "Vatican City": "Italian",
  "Venezuela": "Spanish",
  "Viet Nam": "Vietnamese",
  "Virgin Islands, US": "English",
  "Wallis and Futuna Islands": "French",
  "Western Sahara": "Arabic",
  "Yemen": "Arabic",
  "Zambia": "English",
  "Zimbabwe": "English"
}


// Loader
export const loader = () => {
  return (
    <div className="spinner">
      <span> Loading... </span>
      <div className="half-spinner"></div>
    </div>
  );
};

// No Permissions
export const forbidden = (pageName) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 360,
      }}
    >
      <Card style={{ width: "40%" }}>
        <Card.Header>
          <ImBlocked style={{ color: "red", marginRight: 10 }} />
          Error Status 401: Unauthorized.
        </Card.Header>
        <Card.Body
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AiFillLock style={{ fontSize: "4em", color: "red" }} />
          <p style={{ textAlign: "center", color: "red", fontSize: 20 }}>
            You do not have permissions to see the {pageName} page
          </p>
        </Card.Body>
        <Card.Footer></Card.Footer>
      </Card>
    </div>
  );
};

// Helper style
export const helpStyle = {
  borderRadius: 0,
  opacity: 0.9,
  padding: "1.5em",
  margin: 20,
};

// Headers
export const headers = {
  "Content-type": "Application/json",
  "User-Token": localStorage.userToken,
};

export const rootIconStyle = {
  color: "#2a9fd9",
  fontSize: "1.5em",
  marginRight: 20,
};

// Pagination options for all tables
export const paginationOptions = {
  paginationSize: 7,
  pageStartIndex: 1,
  alwaysShowAllBtns: true,
  firstPageText: "First",
  prePageText: "Previous",
  nextPageText: "Next",
  lastPageText: "Last",
  nextPageTitle: "Next page",
  prePageTitle: "Previous page",
  firstPageTitle: "First page",
  lastPageTitle: "Last page",
  showTotal: true,
  disablePageTitle: false,
  sizePerPageList: [
    { text: "20", value: 20 },
    { text: "50", value: 50 },
    { text: "100", value: 100 },
  ],
};

export function isLatitude(value) {
  // Check if the value is a valid number between -90 and 90
  return !isNaN(value) && value >= -90 && value <= 90;
}

export function isLongitude(value) {
  // Check if the value is a valid number between -180 and 180
  return !isNaN(value) && value >= -180 && value <= 180;
}

export function isValidLatLng(latLngString) {
  const [latitude, longitude] = latLngString.split(", ");

  // Check if both latitude and longitude are valid numbers
  if (
    !latitude ||
    !longitude ||
    !isLatitude(latitude) ||
    !isLongitude(longitude)
  ) {
    return false;
  }

  return true;
}

export const countryToCode = {
  "Finland": "FI",
  "Anguilla": "AI",
  "Burkina Faso": "BF",
  "Cape Verde": "CV",
  "Colombia": "CO",
  "Denmark": "DK",
  "Eritrea": "ER",
  "Gibraltar": "GI",
  "Malawi": "MW",
  "Guinea-Bissau": "GW",
  "Iran": "IR",
  "Japan": "JP",
  "Kuwait": "KW",
  "Venezuela": "VE",
  "Liechtenstein": "LI",
  "Montserrat": "MS",
  "Netherlands Antilles": "AN",
  "Pakistan": "PK",
  "Tuvalu": "TV",
  "Uzbekistan": "UZ",
  "Faroe Islands": "FO",
  "Gabon": "GA",
  "Grenada": "GD",
  "Guadeloupe": "GP",
  "Honduras": "HN",
  "Ireland": "IE",
  "Tunisia": "TN",
  "Kazakhstan": "KZ",
  "Antigua and Barbuda": "AG",
  "Argentina": "AR",
  "Latvia": "LV",
  "Armenia": "AM",
  "Luxembourg": "LU",
  "Aruba": "AW",
  "Australia": "AU",
  "Austria": "AT",
  "Myanmar": "MM",
  "Azerbaijan": "AZ",
  "Nicaragua": "NI",
  "Bahamas": "BS",
  "Palestine": "PS",
  "Bahrain": "BH",
  "Uganda": "UG",
  "Bangladesh": "BD",
  "Barbados": "BB",
  "Belarus": "BY",
  "Belgium": "BE",
  "Belize": "BZ",
  "Benin": "BJ",
  "Bermuda": "BM",
  "Bhutan": "BT",
  "Bolivia": "BO",
  "Bosnia and Herzegovina": "BA",
  "Botswana": "BW",
  "Bouvet Island": "BV",
  "Brazil": "BR",
  "Bulgaria": "BG",
  "Marshall Islands": "MH",
  "Martinique": "MQ",
  "Mauritania": "MR",
  "Mauritius": "MU",
  "Mexico": "MX",
  "Micronesia": "FM",
  "Moldova": "MD",
  "Burundi": "BI",
  "Central African Republic": "CF",
  "Cook Islands"	: "CK",
  "Dominica": "DM",
  "Fiji": "FJ",
  "Réunion": "RE",
  "France": "FR",
  "Gambia": "GM",
  "Germany": "DE",
  "Ghana": "GH",
  "Greece": "GR",
  "Greenland": "GL",
  "Malta": "MT",
  "Mali": "ML",
  "Malaysia": "MY",
  "Madagascar": "MG",
  "FYROM": "MK",
  "Guam": "GU",
  "Guatemala": "GT",
  "Guinea": "GN",
  "Guyana": "GY",
  "Haiti": "HT",
  "Vatican City": "VA",
  "United Kingdom": "GB",
  "British Indian Ocean Territory": "IO",
  "Brunei Darussalam": "BN",
  "Congo (Brazzaville)": "CG",
  "Democratic Republic of the Congo": "CD",
  "Ecuador": "EC",
  "French Guiana": "GF",
  "French Polynesia": "PF",
  "Heard Island and Mcdonald Islands": "HM",
  "Niue": "NU",
  "Norfolk Island": "NF",
  "Pitcairn": "PN",
  "Saint-Martin (French part)": "MF",
  "South Georgia and the South Sandwich Islands": "GS",
  "South Sudan": "SS",
  "Tokelau": "TK",
  "Wallis and Futuna Islands": "WF",
  "Afghanistan": "AF",
  "Albania": "AL",
  "American Samoa": "AS",
  "Angola": "AO",
  "Hungary": "HU",
  "Cameroon": "CM",
  "Canada": "CA",
  "Cayman Islands": "KY",
  "Chad": "TD",
  "Chile": "CL",
  "China": "CN",
  "Macao": "MO",
  "Comoros": "KM",
  "Costa Rica": "CR",
  "Croatia": "HR",
  "Cyprus": "CY",
  "Djibouti": "DJ",
  "Dominican Republic": "DO",
  "Egypt": "EG",
  "Equatorial Guinea": "GQ",
  "Estonia": "EE",
  "Ethiopia": "ET",
  "India": "IN",
  "Indonesia": "ID",
  "Iraq": "IQ",
  "Isle of Man": "IM",
  "Israel": "IL",
  "Jamaica": "JM",
  "Jersey": "JE",
  "Jordan": "JO",
  "Kiribati": "KI",
  "South Korea": "KR",
  "Kyrgyzstan": "KG",
  "Laos": "LA",
  "Lebanon": "LB",
  "Lesotho": "LS",
  "Libya": "LY",
  "Lithuania": "LT",
  "Monaco": "MC",
  "Mongolia": "MN",
  "Montenegro": "ME",
  "Morocco": "MA",
  "Mozambique": "MZ",
  "Namibia": "NA",
  "Nepal": "NP",
  "Netherlands": "NL",
  "New Caledonia": "NC",
  "New Zealand": "NZ",
  "Niger": "NE",
  "Norway": "NO",
  "Oman": "OM",
  "Palau": "PW",
  "Panama": "PA",
  "Saint Kitts and Nevis": "KN",
  "Philippines": "PH",
  "Aland Islands": "AX",
  "British Virgin Islands": "VG",
  "Christmas Island": "CX",
  "Cocos (Keeling) Islands": "CC",
  "Falkland Islands (Malvinas)": "FK",
  "French Southern Territories": "TF",
  "Mayotte": "YT",
  "Northern Mariana Islands": "MP",
  "Saint Helena": "SH",
  "Saint Pierre and Miquelon": "PM",
  "Svalbard and Jan Mayen Islands": "SJ",
  "Algeria": "DZ",
  "Andorra": "AD",
  "Cambodia": "KH",
  "Hong Kong": "HK",
  "Cuba": "CU",
  "Georgia": "GE",
  "El Salvador": "SV",
  "Maldives": "MV",
  "Guernsey": "GG",
  "Iceland": "IS",
  "Italy": "IT",
  "North Korea": "KP",
  "Poland": "PL",
  "Liberia": "LR",
  "Kenya": "KE",
  "Nauru": "NR",
  "Nigeria": "NG",
  "Papua New Guinea": "PG",
  "Paraguay": "PY",
  "Portugal": "PT",
  "Peru": "PE",
  "Saint Lucia": "LC",
  "Puerto Rico": "PR",
  "Qatar": "QA",
  "Romania": "RO",
  "Sao Tome and Principe": "ST",
  "Saint Vincent and Grenadines": "VC",
  "Samoa": "WS",
  "Czechia": "CZ",
  "San Marino": "SM",
  "Saudi Arabia": "SA",
  "Saint-Barthélemy": "BL",
  "Senegal": "SN",
  "Serbia": "RS",
  "United States": "US",
  "Zambia": "ZM",
  "Côte d'Ivoire": "CI",
  "Zimbabwe": "ZW",
  "Virgin Islands, US": "VI",
  "Western Sahara": "EH",
  "Yemen": "YE",
  "Viet Nam": "VN",
  "Rwanda": "RW",
  "Seychelles": "SC",
  "Sierra Leone": "SL",
  "Singapore": "SG",
  "Slovakia": "SK",
  "Slovenia": "SI",
  "Solomon Islands": "SB",
  "Somalia": "SO",
  "South Africa": "ZA",
  "Spain":"ES",
  "Sri Lanka": "LK",
  "Sudan": "SD",
  "Suriname": "SR",
  "Swaziland": "SZ",
  "Sweden": "SE",
  "Switzerland": "CH",
  "Syria": "SY",
  "Taiwan": "TW",
  "Tajikistan": "TJ",
  "Tanzania": "TZ",
  "Thailand": "TH",
  "Timor-Leste": "TL",
  "Togo": "TG",
  "Tonga": "TO",
  "Turks and Caicos Islands": "TC",
  "Trinidad and Tobago": "TT",
  "Turkey": "TR",
  "Turkmenistan": "TM",
  "Ukraine": "UA",
  "United Arab Emirates": "AE",
  "United States Minor Outlying Islands": "UM",
  "Uruguay": "UY",
  "Vanuatu": "VU",
  "Russia": "RU",
};

export function pageHeader(value, objName) {
  if (value === "about") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaInfo style={iconStyle} /> About us
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>About us</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "help") {
    return (
      <>
        <div className="page_header">
          <h2>
            <BiHelpCircle style={iconStyle} /> Help
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/"> Home </Breadcrumb.Item>
            <Breadcrumb.Item active> Help </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "login") {
    return (
      <>
        <div className="page_header">
          <h2>
            <AiOutlineLogin style={{ iconStyle }} /> Login
          </h2>
        </div>
        <Popup
          trigger={<Button color="blue" id="helper" icon="help" />}
          content={loginHelpContent}
          style={helpStyle}
          inverted
        />
        <hr />
      </>
    );
  } else if (value === "terms") {
    return (
      <>
        <div className="page_header">
          <h2>
            <GoLaw style={iconStyle} />
            Terms and conditions
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Terms and conditions</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "updates") {
    return (
      <>
        <div className="page_header">
          <h2>
            <MdUpdate style={iconStyle} />
            Updates
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/help/">Help</Breadcrumb.Item>
            <Breadcrumb.Item active>Updates</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "useful_links") {
    return (
      <>
        <div className="page_header">
          <h2>
            <ImBooks style={iconStyle} />
            Useful Links
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/"> Home </Breadcrumb.Item>
            <Breadcrumb.Item active> Useful Links </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "dev_dox") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaCode style={iconStyle} /> Developer Documentation
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/help">Help</Breadcrumb.Item>
            <Breadcrumb.Item active>Developer Documentation</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "staff_dox") {
    return (
      <>
        <div className="page_header">
          <h2>
            <BsFillKeyFill style={iconStyle} /> Staff Documentation
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/help">Help</Breadcrumb.Item>
            <Breadcrumb.Item active>Staff Documentation</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "agent_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <BiBriefcase style={iconStyle} /> Agent Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "agent_gallery") {
    return (
      <>
        <div className="page_header">
          <h2>
            <RiGalleryFill style={iconStyle} /> Agent Gallery
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Gallery of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "agent_groups") {
    return (
      <>
        <div className="page_header">
          <h2>
            <BiBriefcase style={iconStyle} /> Agent's Groups
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Groups of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "client_groups") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaSuitcaseRolling style={iconStyle} /> Client's Groups
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Groups of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "leader_groups") {
    return (
      <>
        <div className="page_header">
          <h2>
            <TiGroupOutline style={iconStyle} /> Group Leader's Groups
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Groups of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "driver_groups") {
    return (
      <>
        <div className="page_header">
          <h2>
            <GiSteeringWheel style={iconStyle} /> Driver's Groups
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Groups of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "hotel_groups") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaHotel style={iconStyle} /> Hotel's Groups
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Groups of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "airline_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <SiChinasouthernairlines style={iconStyle} /> Airline Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "airport_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <MdLocalAirport style={iconStyle} /> Airport Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "airport_terminal") {
    return (
      <>
        <div className="page_header">
          <h2>
            <MdLocalAirport style={iconStyle} /> Airport Terminal
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Terminals of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_agents") {
    return (
      <>
        <div className="page_header">
          <h2>
            <BiBriefcase style={iconStyle} /> All Agents
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Agents</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_airlines") {
    return (
      <>
        <div className="page_header">
          <h2>
            <SiChinasouthernairlines style={iconStyle} /> All Airlines
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Airlines</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_airports") {
    return (
      <>
        <div className="page_header">
          <h2>
            <MdLocalAirport style={iconStyle} /> All Airports
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Airports</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_attractions") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaMapMarkedAlt style={iconStyle} /> All Attractions
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Attractions</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_clients") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaSuitcaseRolling style={iconStyle} /> All Clients
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Clients</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_coaches") {
    return (
      <>
        <div className="page_header">
          <h2>
            <GiBus style={iconStyle} /> All Coaches
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Coaches</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "aircraft_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <GiCommercialAirplane style={iconStyle} /> Aircraft Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Coaches</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_coach_operators") {
    return (
      <>
        <div className="page_header">
          <h2>
            <MdSupportAgent style={iconStyle} /> All Coach Operators
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Coach Operators</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_contracts") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaFileContract style={iconStyle} /> All Contracts
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Contracts</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_cruising_companies") {
    return (
      <>
        <div className="page_header">
          <h2>
            <GiShipWheel style={iconStyle} /> All Cruising Companies
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Cruising Companies</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_dmcs") {
    return (
      <>
        <div className="page_header">
          <h2>
            <GiEarthAmerica style={iconStyle} /> All DMCs
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All DMCs</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_drivers") {
    return (
      <>
        <div className="page_header">
          <h2>
            <GiSteeringWheel style={iconStyle} /> All Drivers
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Drivers</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_ferry_ticket_agencies") {
    return (
      <>
        <div className="page_header">
          <h2>
            <GiBattleship style={iconStyle} /> All Ferry Ticket Agencies
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Ferry Ticket Agencies</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_group_leaders") {
    return (
      <>
        <div className="page_header">
          <h2>
            <TiGroupOutline style={iconStyle} /> All Group Leaders
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Group Leaders</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_guides") {
    return (
      <>
        <div className="page_header">
          <h2>
            <RiGuideLine style={iconStyle} /> All Local Guides
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Local Guides</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_hotels") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaHotel style={iconStyle} /> All Hotels
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Hotels</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_places") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaCity style={iconStyle} /> All Places
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Places</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_regions") {
    return (
      <>
        <div className="page_header">
          <h2>
            <GiConvergenceTarget style={iconStyle} /> All Regions
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Regions</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_ports") {
    return (
      <>
        <div className="page_header">
          <h2>
            <BiAnchor style={iconStyle} /> All Ports
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Ports</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_railway_stations") {
    return (
      <>
        <div className="page_header">
          <h2>
            <GiRailway style={iconStyle} /> All Railway Stations
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Railway Stations</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_repair_shops") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaScrewdriver style={iconStyle} /> All Repair Shops
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Repair Shops</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_restaurants") {
    return (
      <>
        <div className="page_header">
          <h2>
            <BiRestaurant style={iconStyle} /> All Restaurants
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Restaurants</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_services") {
    return (
      <>
        <div className="page_header">
          <h2>
            <AiOutlineSetting style={iconStyle} /> All Services
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Services</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Popup
          trigger={<Button color="blue" icon="help" />}
          content={allServicesHelpContent}
          id="helper"
          style={helpStyle}
          inverted
        />
        <hr />
      </>
    );
  } else if (value === "all_sport_event_suppliers") {
    return (
      <>
        <div className="page_header">
          <h2>
            <BiFootball style={iconStyle} /> All Sport Event Suppliers
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Sport Event Suppliers</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_entertainment_suppliers") {
    return (
      <>
        <div className="page_header">
          <h2> <GiMagickTrick style={iconStyle} /> All Shows & Entertainment Suppliers </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Entertainment Suppliers</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_teleferik_companies") {
    return (
      <>
        <div className="page_header">
          <h2>
            <BiTransfer style={iconStyle} /> All Teleferik Companies
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Teleferik Companies</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_car_hire_companies") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaCar style={iconStyle} /> All Car Hires
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Car Hires</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_advertisement_companies") {
    return (
      <>
        <div className="page_header">
          <h2>
            <RiAdvertisementFill style={iconStyle} /> All Advertisement Companies
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Advertisement Companies</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "advertisement_company_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <RiAdvertisementFill style={iconStyle} /> Advertisement Company Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_charter_brokers") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaIdeal style={iconStyle} /> All Charter Airlines & Brokers
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Charter Airlines & Brokers</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "charter_broker_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaIdeal style={iconStyle} /> Charter Airlines & Brokers Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active> Overview of {objName} </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_aircrafts") {
    return (
      <>
        <div className="page_header">
          <h2>
            <GiCommercialAirplane style={iconStyle} /> All Aircrafts
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Aircrafts</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_text_templates") {
    return (
      <>
        <div className="page_header">
          <h2>
            <BsFillPuzzleFill style={iconStyle} /> All Text Templates
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Text Templates</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_theaters") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaTheaterMasks style={iconStyle} /> All Theaters
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Theaters</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_train_ticket_agencies") {
    return (
      <>
        <div className="page_header">
          <h2>
            <WiTrain style={iconStyle} /> All Train Ticket Agencies
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Train Ticket Agencies</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "attraction_gallery") {
    return (
      <>
        <div className="page_header">
          <h2>
            <RiGalleryFill style={iconStyle} /> Attraction Gallery
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Gallery of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "attraction_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaMapMarkedAlt style={iconStyle} /> Attraction Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "region_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <GiConvergenceTarget style={iconStyle} /> Region Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "client_gallery") {
    return (
      <>
        <div className="page_header">
          <h2>
            <RiGalleryFill style={iconStyle} /> Client Gallery
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Gallery of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "client_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaSuitcaseRolling style={iconStyle} /> Client Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "coach_gallery") {
    return (
      <>
        <div className="page_header">
          <h2>
            <RiGalleryFill style={iconStyle} /> Coach Gallery
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Gallery of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "coach_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <GiBus style={iconStyle} /> Coach Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "coach_operator_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <MdSupportAgent style={iconStyle} /> Coach Operator Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "coach_operator_coaches") {
    return (
      <>
        <div className="page_header">
          <h2>
            <RiBusLine style={iconStyle} /> Coach Operator's Coaches
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active> Coaches Of {objName} </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "coach_operator_gallery") {
    return (
      <>
        <div className="page_header">
          <h2>
            <RiGalleryFill style={iconStyle} /> Coach Operator Gallery
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Gallery of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "contract_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaFileContract style={iconStyle} /> Contract Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "contract_calendar") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaFileContract style={iconStyle} /> Contract Calendar
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Calendar of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "cruising_company_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <GiShipWheel style={iconStyle} /> Cruising Company Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "data_management_root") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaDatabase style={iconStyle} /> Data Management
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active> Data Management </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "dmc_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <GiEarthAmerica style={iconStyle} /> DMC Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "driver_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <GiSteeringWheel style={iconStyle} /> Driver Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "driver_gallery") {
    return (
      <>
        <div className="page_header">
          <h2>
            <RiGalleryFill style={iconStyle} /> Driver Gallery
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Gallery of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "ferry_ticket_agency_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <GiBattleship style={iconStyle} /> Ferry Ticket Agency Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "group_leader_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <TiGroupOutline style={iconStyle} /> Group Leader Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "group_leader_gallery") {
    return (
      <>
        <div className="page_header">
          <h2>
            <RiGalleryFill style={iconStyle} /> Group Leader Gallery
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Gallery of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "guide_gallery") {
    return (
      <>
        <div className="page_header">
          <h2>
            <RiGalleryFill style={iconStyle} /> Guide Gallery
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Gallery of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "guide_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <RiGuideLine style={iconStyle} /> Local Guide Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "hotel_amenities") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaHotel style={iconStyle} /> Hotel Amenities
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Amenities of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "hotel_gallery") {
    return (
      <>
        <div className="page_header">
          <h2>
            <RiGalleryFill style={iconStyle} /> Hotel Gallery
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Gallery of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "hotel_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaHotel style={iconStyle} /> Hotel Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "place_attractions") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaMapMarkedAlt style={iconStyle} /> Place Attractions
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Attractions of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "place_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaCity style={iconStyle} /> Place Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "port_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <BiAnchor style={iconStyle} /> Port Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "railway_station_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <GiRailway style={iconStyle} /> Railway Station Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "repair_shop_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaScrewdriver style={iconStyle} /> Repair Shop Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "restaurant_gallery") {
    return (
      <>
        <div className="page_header">
          <h2>
            <RiGalleryFill style={iconStyle} /> Restaurant Gallery
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Gallery of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "restaurant_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <BiRestaurant style={iconStyle} /> Restaurant Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "restaurant_menus") {
    return (
      <>
        <div className="page_header">
          <h2>
            <BiRestaurant style={iconStyle} /> Restaurant Menus
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Menus of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "service_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <AiOutlineSetting style={iconStyle} /> Service Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "sport_event_supplier_gallery") {
    return (
      <>
        <div className="page_header">
          <h2>
            <RiGalleryFill style={iconStyle} /> Sport Event Supplier Gallery
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Gallery of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "entertainment_supplier_gallery") {
    return (
      <>
        <div className="page_header">
          <h2>
            <GiMagickTrick style={iconStyle} /> Shows & Entertainment Supplier Gallery
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Gallery of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "entertainment_supplier_products") {
    return (
      <>
        <div className="page_header">
          <h2>
            <GiMagickTrick style={iconStyle} /> Shows & Entertainment Supplier Products
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active> Products of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "sport_event_supplier_overview") {

    return (
      <>
        <div className="page_header">
          <h2>
            <BiFootball style={iconStyle} /> Sport Event Supplier Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  }
  else if (value === "entertainment_supplier_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <GiMagickTrick style={iconStyle} /> Shows & Entertainment Supplier Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "train_ticket_agency_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <WiTrain style={iconStyle} /> Train Ticket Agency Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "teleferik_company_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <BiTransfer style={iconStyle} /> Teleferik Company Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "car_hire_company_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaCar style={iconStyle} /> Car Hire Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  }else if (value === "text_template_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <BsFillPuzzleFill style={iconStyle} /> Text Template Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "theater_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaTheaterMasks style={iconStyle} /> Theater Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "theater_gallery") {
    return (
      <>
        <div className="page_header">
          <h2>
            <RiGalleryFill style={iconStyle} /> Theater Gallery
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Gallery of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "theater_gallery") {
    return (
      <>
        <div className="page_header">
          <h2>
            <WiTrain style={iconStyle} /> Train Ticket Agency Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "coach_availability") {
    return (
      <>
        <div className="page_header">
          <h2>
            <MdEventAvailable style={iconStyle} /> Coach Availability
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/group_management/root">
              Group Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Coach Availability</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Popup
          trigger={<Button color="blue" id="helper" icon="help" />}
          content={coachAvailabilityHelpContent}
          style={helpStyle}
          inverted
        />
        <hr />
      </>
    );
  } else if (value === "driver_availability") {
    return (
      <>
        <div className="page_header">
          <h2>
            <MdEventAvailable style={iconStyle} /> Driver Availability
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/group_management/root">
              Group Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Driver Availability</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Popup
          trigger={<Button color="blue" id="helper" icon="help" />}
          content={driverAvailabilityHelpContent}
          style={helpStyle}
          inverted
        />
        <hr />
      </>
    );
  } else if (value === "daily_status") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaMapMarkerAlt style={iconStyle} /> Daily Status
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/group_management/root">
              Group Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Daily Status</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Popup
          trigger={<Button color="blue" id="helper" icon="help" />}
          content={dailyStatusHelpContent}
          style={helpStyle}
          inverted
        />
        <hr />
      </>
    );
  } else if (value === "group_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <BiBus style={iconStyle} /> Group Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/group_management/root">
              Group Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Popup
          trigger={<Button color="blue" id="helper" icon="help" />}
          content={groupOverviewHelpContent}
          style={helpStyle}
          inverted
        />
        <hr />
      </>
    );
  } else if (value === "group_itinerary") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaListUl style={iconStyle} /> Group Itinerary
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/group_management/root">
              Group Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Itinerary of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Popup
          trigger={<Button color="blue" id="helper" icon="help" />}
          content={groupItineraryHelpContent}
          style={helpStyle}
          inverted
        />
        <hr />
      </>
    );
  } else if (value === "group_documents") {
    return (
      <>
        <div className="page_header">
          <h2>
            <BiFolder style={iconStyle} /> Group Documents
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/group_management/root">
              Group Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Documents of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Popup
          trigger={<Button color="blue" id="helper" icon="help" />}
          content={groupDocumentsHelpContent}
          style={helpStyle}
          inverted
        />
        <hr />
      </>
    );
  }  else if (value === "documents") {
    return (
      <>
        <div className="page_header">
          <h2>
            <BiFolder style={iconStyle} /> Documents
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Documents of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "group_rooming_lists") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaRegListAlt style={iconStyle} /> Group Rooming lists
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/group_management/root">
              Group Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Rooming lists of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Popup
          trigger={<Button color="blue" id="helper" icon="help" />}
          content={groupRoomingListsHelpContent}
          style={helpStyle}
          inverted
        />
        <hr />
      </>
    );
  } else if (value === "group_route") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaRoute style={iconStyle} /> Group Route
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/group_management/root">
              Group Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Route of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Popup
          trigger={<Button color="blue" id="helper" icon="help" />}
          content={groupRouteHelpContent}
          style={helpStyle}
          inverted
        />
        <hr />
      </>
    );
  } else if (value === "group_schedule") {
    return (
      <>
        <div className="page_header">
          <h2>
            <ImCalendar style={iconStyle} /> Group Schedule
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/group_management/root">
              Group Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Schedule of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Popup
          trigger={<Button color="blue" id="helper" icon="help" />}
          content={groupScheduleHelpContent}
          style={helpStyle}
          inverted
        />
        <hr />
      </>
    );
  } else if (value === "group_services") {
    return (
      <>
        <div className="page_header">
          <h2>
            <AiOutlineSetting style={iconStyle} /> Group Services
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/group_management/root">
              Group Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Services of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Popup
          trigger={<Button color="blue" id="helper" icon="help" />}
          content={groupServicesHelpContent}
          style={helpStyle}
          inverted
        />
        <hr />
      </>
    );
  } else if (value === "group_payments") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaHandshake style={iconStyle} /> Group Payments
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/group_management/root">
              Group Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Payments of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "group_management_root") {
    return (
      <>
        <div className="page_header">
          <h2>
            <MdGroup style={iconStyle} /> Group Management
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Group Management</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "group_stats") {
    return (
      <>
        <div className="page_header">
          <h2>
            <BiStats style={iconStyle} /> Group Stats
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/group_management/root">
              Group Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Group Stats</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Popup
          trigger={<Button color="blue" id="helper" icon="help" />}
          content={groupStatsHelpContent}
          style={helpStyle}
          inverted
        />
        <hr />
      </>
    );
  } else if (value === "pending") {
    return (
      <>
        <div className="page_header">
          <h2>
            <MdPendingActions style={iconStyle} /> Pending Groups
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/group_management/root">
              Group Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Pending Groups</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Popup
          trigger={<Button color="blue" id="helper" icon="help" />}
          content={pendingHelpContent}
          style={helpStyle}
          inverted
        />
        <hr />
      </>
    );
  } else if (value === "pending") {
    return (
      <>
        <div className="page_header">
          <h2>
            <BsFillPinMapFill style={iconStyle} /> Maps
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/maps/" active>
              Maps
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "offer_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <MdLocalOffer style={iconStyle} /> Offer Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/group_management/root">
              Group Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Popup
          trigger={<Button color="blue" id="helper" icon="help" />}
          content={offerOverviewHelpContent}
          style={helpStyle}
          inverted
        />
        <hr />
      </>
    );
  } else if (value === "offer_template") {
    return (
      <>
        <div className="page_header">
          <h2>
            <BsFillPuzzleFill style={iconStyle} /> Offer Templates
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/group_management/root">
              Group Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>
              Offer Templates of {this.state.offer.group_name}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Popup
          trigger={<Button color="blue" id="helper" icon="help" />}
          content={offerTemplatesHelpContent}
          style={helpStyle}
          inverted
        />
        <hr />
      </>
    );
  } else if (value === "reports_user") {
    return (
      <>
        <div className="page_header">
          <h2>
            <AiOutlineUser style={iconStyle} /> Reports User
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/reports/root">Reports</Breadcrumb.Item>
            <Breadcrumb.Item active> User </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "reports_site_statistics") {
    return (
      <>
        <div className="page_header">
          <h2>
            <BiStats style={iconStyle} /> Reports Site Statistics
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/reports/root">Reports</Breadcrumb.Item>
            <Breadcrumb.Item active> Site Stats </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "reports_agent") {
    return (
      <>
        <div className="page_header">
          <h2>
            <BiBriefcase style={iconStyle} /> Reports Agent
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/reports/root">Reports</Breadcrumb.Item>
            <Breadcrumb.Item active> Agent </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "reports_airport") {
    return (
      <>
        <div className="page_header">
          <h2>
            <MdLocalAirport style={iconStyle} /> Reports Airport
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/reports/root">Reports</Breadcrumb.Item>
            <Breadcrumb.Item active> Airport </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "reports_place") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaCity style={iconStyle} /> Reports Place
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/reports/root">Reports</Breadcrumb.Item>
            <Breadcrumb.Item active> Place </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "reports_client") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaSuitcaseRolling style={iconStyle} /> Reports Client
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/reports/root">Reports</Breadcrumb.Item>
            <Breadcrumb.Item active> Client </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "reports_coach_operator") {
    return (
      <>
        <div className="page_header">
          <h2>
            <MdSupportAgent style={iconStyle} /> Reports Coach Operator
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/reports/root">Reports</Breadcrumb.Item>
            <Breadcrumb.Item active> Coach Operator </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "reports_driver") {
    return (
      <>
        <div className="page_header">
          <h2>
            <GiSteeringWheel style={iconStyle} /> Reports Driver
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/reports/root">Reports</Breadcrumb.Item>
            <Breadcrumb.Item active> Driver </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "reports_expiring_documents") {
    return (
      <>
        <div className="page_header">
          <h2>
            <HiDocumentSearch style={iconStyle} /> Reports Expiring Documents
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/reports/root">Reports</Breadcrumb.Item>
            <Breadcrumb.Item active> Expiring Documents </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "reports_leader") {
    return (
      <>
        <div className="page_header">
          <h2>
            <TiGroupOutline style={iconStyle} /> Reports Group Leader
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/reports/root">Reports</Breadcrumb.Item>
            <Breadcrumb.Item active> Group Leader </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "reports_hotel") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaHotel style={iconStyle} /> Reports Hotel
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/reports/root">Reports</Breadcrumb.Item>
            <Breadcrumb.Item active> Hotel </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "reports_root") {
    return (
      <>
        <div className="page_header">
          <h2>
            <HiOutlineDocumentReport style={iconStyle} /> Reports
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Reports</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "sent_emails") {
    return (
      <>
        <div className="page_header">
          <h2>
            <BiMailSend style={iconStyle} /> Reports Sent Emails
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Sent Emails</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "access_history") {
    return (
      <>
        <div className="page_header">
          <h2>
            <MdAccessTime style={iconStyle} /> Access History
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/site_administration/root">
              Site administration
            </Breadcrumb.Item>
            <Breadcrumb.Item active> Access History </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Popup
          trigger={<Button color="blue" icon="help" />}
          content={accessHistoryHelpContent}
          style={helpStyle}
          inverted
          id="helper"
        />
        <hr />
      </>
    );
  } else if (value === "all_users") {
    return (
      <>
        <div className="page_header">
          <h2>
            <BiUser style={iconStyle} /> All Users
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/site_administration/root">
              Site Administration
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Users</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Popup
          trigger={<Button color="blue" icon="help" />}
          content={accessHistoryHelpContent}
          style={helpStyle}
          inverted
          id="helper"
        />
        <hr />
      </>
    );
  } else if (value === "conflicts") {
    return (
      <>
        <div className="page_header">
          <h2>
            <AiOutlineWarning style={iconStyle} /> Conflicts
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/site_administration/root">
              Site administration
            </Breadcrumb.Item>
            <Breadcrumb.Item active> Conflicts </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Popup
          trigger={<Button color="blue" id="helper" icon="help" />}
          content={conflictHelpContent}
          style={helpStyle}
          inverted
        />
        <hr />
      </>
    );
  } else if (value === "user_permissions") {
    return (
      <>
        <div className="page_header">
          <h2>
            <RiAdminLine style={iconStyle} /> User permissions
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/site_administration/root">
              Site administration
            </Breadcrumb.Item>
            <Breadcrumb.Item active> User permissions </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Popup
          trigger={<Button color="blue" id="helper" icon="help" />}
          content={userPermisssionHelpContent}
          style={helpStyle}
          inverted
        />
        <hr />
      </>
    );
  } else if (value === "logs") {
    return (
      <>
        <div className="page_header">
          <h2>
            <AiOutlineFileSearch style={iconStyle} /> Logs
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/site_administration/root">
              Site administration
            </Breadcrumb.Item>
            <Breadcrumb.Item active> Logs </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Popup
          trigger={<Button color="blue" id="helper" icon="help" />}
          content={logsHelpContent}
          style={helpStyle}
          inverted
        />
        <hr />
      </>
    );
  } else if (value === "site_admin_root") {
    return (
      <>
        <div className="page_header">
          <h2>
            <RiAdminLine style={iconStyle} /> Site Administration
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Site Administration</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "user_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <BiUser style={iconStyle} /> User Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/site_administration/root">
              Site Administration
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "incomplete_data") {
    return (
      <>
        <div className="page_header">
          <h2>
            <MdOutlineIncompleteCircle style={iconStyle} /> Incomplete Data
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/site_administration/root">
              Site administration
            </Breadcrumb.Item>
            <Breadcrumb.Item active> Incomplete Data </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Popup
          trigger={<Button color="blue" id="helper" icon="help" />}
          content={incompleteDataHelpContent}
          style={helpStyle}
          inverted
        />
        <hr />
      </>
    );
  } else if (value === "maps_root") {
    return (
      <>
        <div className="page_header">
          <h2>
            <BsFillPinMapFill style={iconStyle} /> Maps
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active> Maps </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "maps_explore") {
    return (
      <>
        <div className="page_header">
          <h2>
            <MdTravelExplore style={iconStyle} /> Explore
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active> Maps </Breadcrumb.Item>
            <Breadcrumb.Item active>Explore</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "reports_service") {
    return (
      <>
        <div className="page_header">
          <h2>
            <AiOutlineSetting style={iconStyle} /> Services
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/reports/root">Reports</Breadcrumb.Item>
            <Breadcrumb.Item active> Services </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_group_offers") {
    return (
      <>
        <div className="page_header">
          <h2>
            <MdLocalOffer style={iconStyle} /> All Offers
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/group_management/root">
              Group Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active> All Offers </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Popup
          trigger={<Button color="blue" id="helper" icon="help" />}
          content={allOffersHelpContent}
          style={helpStyle}
          inverted
        />
        <hr />
      </>
    );
  } else if (value === "all_groups") {
    return (
      <>
        <div className="page_header">
          <h2>
            <TiGroup style={iconStyle} /> All Groups
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/group_management/root">
              Group Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active> All Groups </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_parking_lots") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaParking style={iconStyle} /> All Parking Lots
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active> All Parking Lots </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_payments") {
    return (
      <>
        <div className="page_header">
          <h2>
            <BsBank style={iconStyle} /> All Payments
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/group_management/root">
              Group Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active> All Payments </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "financial_root") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaChartLine style={iconStyle} /> Financial
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active> Financial </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "payment_orders") {
    return (
      <>
        <div className="page_header">
          <h2>
            <MdOutlinePlaylistAdd style={iconStyle} /> Payment Orders
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active> Financial </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "mass_mailing") {
    return (
      <>
        <div className="page_header">
          <h2>
            <BiMailSend style={iconStyle} /> Mass Mailing
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active> Mass Mailing </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_deposits") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaPiggyBank style={iconStyle} /> All Deposits
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active> Financial </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "reports_option_dates") {
    return (
      <>
        <div className="page_header">
          <h2>
            <IoIosOptions style={iconStyle} /> Option Dates
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item> Reports </Breadcrumb.Item>
            <Breadcrumb.Item active> Option Dates </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "group_proforma_invoice") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaFileInvoice style={iconStyle} /> Group Proforma Invoice
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item> Group Management </Breadcrumb.Item>
            <Breadcrumb.Item active> Proforma Invoice of {objName} </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "ferry_ticket_agency_routes") {
    return (
      <>
        <div className="page_header">
          <h2>
            <GiBattleship style={iconStyle} /> Ferry Ticket Agency Routes
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Routes of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === 'nas_folders') {
    return (
      <>
        <div className="page_header">
          <h2>
            <MdFolderShared style={iconStyle} /> NAS Folders  
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/site_administration/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>NAS Folder</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  }
  return <></>;
}
