// Built-ins
import React, { useState, useEffect } from "react";

// Functions / Modules
import axios from "axios";
import Swal from "sweetalert2";
import * as L from "leaflet";
import { MapContainer, TileLayer, Circle, Popup, Marker } from "react-leaflet";
import { ListGroup } from "react-bootstrap";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

// Icons / Images
import { MdSupportAgent } from "react-icons/md";
import { AiFillStar } from "react-icons/ai";
import { BsStarHalf } from "react-icons/bs";
import { AiOutlineStar } from "react-icons/ai";
import { BiRestaurant, BiFootball, BiTransfer } from "react-icons/bi";
import { FaScrewdriver, FaHotel, FaTheaterMasks } from "react-icons/fa";
import { GiBattleship, GiShipWheel, GiEarthAmerica, GiMagickTrick } from "react-icons/gi";
import { WiTrain } from "react-icons/wi";
import { FaParking, FaCar, FaIdeal, } from "react-icons/fa";
import { RiAdvertisementFill } from "react-icons/ri";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import SendMassiveEmail from "../modals/SendMassiveEmail";
import GetSurroundingPOIS from "../modals/GetSurroundingPOIS";
import cruisingCompanyMarkerImage from "../../../images/generic/map_markers/cruising_company.png";
import coachOperatorMarkerImage from "../../../images/generic/map_markers/operator.png";
import ferryTicketAgencyMarkerImage from "../../../images/generic/map_markers/ferry_ticket_agency.png";
import DMCMarkerImage from "../../../images/generic/map_markers/dmc.png";
import hotelMarkerImage from "../../../images/generic/map_markers/hotel.png";
import restaurantMarkerImage from "../../../images/generic/map_markers/restaurant.png";
import sportEventSupplierMarkerImage from "../../../images/generic/map_markers/sport_event_supplier.png";
import teleferikCompanyMarkerImage from "../../../images/generic/map_markers/teleferik.png";
import theaterMarkerImage from "../../../images/generic/map_markers/theater.png";
import trainTicketAgencyMarkerImage from "../../../images/generic/map_markers/train.png";
import parkingLotMarkerImage from "../../../images/generic/map_markers/parking.png";
import entertainmentProductsMarkerImage from "../../../images/generic/map_markers/entertainment_product.png";
import MarkerImage from "../../../images/generic/map_markers/marker_null.png";
import repairShopMarkerImage from "../../../images/generic/map_markers/repair_shop.png";
// Repair Shop Icons
import ACMarkerImage from "../../../images/generic/map_markers/repair_icons/air_condition.png";
import ElectricianMarkerImage from "../../../images/generic/map_markers/repair_icons/electricity.png";
import EvobusMarkerImage from "../../../images/generic/map_markers/repair_icons/evobus_bus.png";
import OilChangeMarkerImage from "../../../images/generic/map_markers/repair_icons/oil.png";
import DAFMarkerImage from "../../../images/generic/map_markers/repair_icons/daf_bus.png";
import GeneralMarkerImage from "../../../images/generic/map_markers/repair_icons/garage.png";
import MANMarkerImage from "../../../images/generic/map_markers/repair_icons/man_bus.png";
import BatteryMarkerImage from "../../../images/generic/map_markers/repair_icons/battery.png";
import TEMSAMarkerImage from "../../../images/generic/map_markers/repair_icons/temsa_bus.png";
import VolvoMarkerImage from "../../../images/generic/map_markers/repair_icons/volvo_bus.png";
import SetraMarkerImage from "../../../images/generic/map_markers/repair_icons/setra_bus.png";
import VanhoolMarkerImage from "../../../images/generic/map_markers/repair_icons/vanhool_bus.png";
import VDLMarkerImage from "../../../images/generic/map_markers/repair_icons/vdl_bus.png";
import BovaMarkerImage from "../../../images/generic/map_markers/repair_icons/bova_bus.png";
import IrisbusMarkerImage from "../../../images/generic/map_markers/repair_icons/irisbus_bus.png";
import IvecoMarkerImage from "../../../images/generic/map_markers/repair_icons/iveco_bus.png";
import MercedesMarkerImage from "../../../images/generic/map_markers/repair_icons/mercedes_bus.png";
import TyresMarkerImage from "../../../images/generic/map_markers/repair_icons/tires.png";
import TowingMarkerImage from "../../../images/generic/map_markers/repair_icons/towing.png";
import NeoplanMarkerImage from "../../../images/generic/map_markers/repair_icons/neoplan_bus.png";
import ScaniaMarkerImage from "../../../images/generic/map_markers/repair_icons/scavia_bus.png";
import WindScreensMarkerImage from "../../../images/generic/map_markers/repair_icons/windscreens.png";
import BodyRepairsMarkerImage from "../../../images/generic/map_markers/repair_icons/body_repairs.png";
import BrakesMarkerImage from "../../../images/generic/map_markers/repair_icons/brakes.png";
import SparePartsAccessoriesMarkerImage from "../../../images/generic/map_markers/repair_icons/spare_parts.png";
import UpholsteryMarkerImage from "../../../images/generic/map_markers/repair_icons/upholstery_shop.png";
import GearbboxMarkerImage from "../../../images/generic/map_markers/repair_icons/gearbox.png";
import TachographMarkerImage from "../../../images/generic/map_markers/repair_icons/tachograph.png";
import TwentyFourMarkerImage from "../../../images/generic/map_markers/repair_icons/24hours.png";

// FILTERS
import HotelFilters from "../filters/hotel";
import CoachOperatorFilters from "../filters/coach_operator";
import RepairShopFilters from "../filters/repair_shop";
import RestaurantFilters from "../filters/restaurant";

// Global Variables
import {
  headers,
  loader,
  pageHeader,
  restrictedUsers,
} from "../../global_vars";

// CSS
import "leaflet/dist/leaflet.css";
import "react-leaflet-fullscreen/dist/styles.css";
import { Grid, Button } from "semantic-ui-react";

// Variables
window.Swal = Swal;

const SHOW_RESULTS = "http://localhost:8000/api/maps/show_results/";
const GET_SURROUNDING_POIS = "http://localhost:8000/api/maps/get_surrounding_pois/";
const GET_CONTINENTS = "http://localhost:8000/api/view/get_all_continents/";
const GET_COUNTRIES = "http://localhost:8000/api/view/get_all_countries/";
const GET_STATES = "http://localhost:8000/api/view/get_all_states/";
const GET_CITIES = "http://localhost:8000/api/view/get_all_cities/";
const GET_AREAS = "http://localhost:8000/api/view/get_all_areas/";

function createIcon(url) {
  return new L.Icon({
    iconUrl: url,
    title: 'hello',
  });
}

const objectToLink = {
  'Advertisement Companies': 'advertisement_company',
  'Car Hire': 'car_hire_company',
  'Charter Airlines & Brokers': 'charter_broker',
  "Coach Operators": "coach_operator",
  "Cruising Companies": "cruising_company",
  "Ferry Ticket Agencies": "ferry_ticket_agency",
  "DMCs": "dmc",
  "Hotels": "hotel",
  "Repair Shops": "repair_shop",
  "Restaurants": "restaurant",
  "Sport Event Suppliers": "sport_event_supplier",
  "Teleferik Companies": "teleferik_company",
  "Theaters": "theater",
  "Train Ticket Agencies": "train_ticket_agency",
  "Parking Lots": "parking_lot",
  "Shows & Entertainment": "entertainment_supplier",
};

function renderIcon(type) {
  let iconStyle = { color: "#06ABE0", fontSize: "1.5em", marginRight: "0.5em" };

  if (type === "Coach Operators") {
    return <MdSupportAgent style={iconStyle} />;
  } 
  else if (type === "Advertisement Companies") {
    return <RiAdvertisementFill style={iconStyle} />;
  } 
  else if (type === "Car Hire") {
    return <FaCar style={iconStyle} />;
  } 
  else if (type === "Charter Airlines & Brokers") {
    return <FaIdeal style={iconStyle} />;
  } 
  else if (type === "Cruising Companies") {
    return <GiShipWheel style={iconStyle} />;
  } else if (type === "Ferry Ticket Agencies") {
    return <GiBattleship style={iconStyle} />;
  } else if (type === "DMCs") {
    return <GiEarthAmerica style={iconStyle} />;
  } else if (type === "Hotels") {
    return <FaHotel style={iconStyle} />;
  } else if (type === "Repair Shops") {
    return <FaScrewdriver style={iconStyle} />;
  } else if (type === "Restaurants") {
    return <BiRestaurant style={iconStyle} />;
  } else if (type === "Sport Event Suppliers") {
    return <BiFootball style={iconStyle} />;
  } else if (type === "Teleferik Companies") {
    return <BiTransfer style={iconStyle} />;
  } else if (type === "Theaters") {
    return <FaTheaterMasks style={iconStyle} />;
  } else if (type === "Train Ticket Agencies") {
    return <WiTrain style={iconStyle} />;
  } else if (type === "Parking Lots") {
    return <FaParking style={iconStyle} />;
  } else if (type === "Shows & Entertainment") {
    return <GiMagickTrick style={iconStyle} />;
  } else {
    return <> </>;
  }
}

const calculateHotelStars = (rating) => {
  if (rating !== "" && rating !== null) {
    let results = [];
    let string_rating =  rating ? rating.toString() : '';
    let fullStars = string_rating[0];
    let halfStars = string_rating[1];
    let emptyStars = 5 - parseInt(rating / 10);
    // full stars loop
    for (var i = 0; i < Number(fullStars); i++) {
      results.push(<AiFillStar style={starStyle} />);
    }
    // half star
    if (halfStars === 5) {
      results.push(
        <BsStarHalf
          style={{
            color: "orange",
            fontSize: "1.3em",
            display: "inline-block",
          }}
        />
      );
    }
    // empty star
    for (var l = 0; l < Number(emptyStars); l++) {
      if (fullStars === "4" && halfStars !== "0") {
      } else {
        results.push(<AiOutlineStar style={starStyle} />);
      }
    }
    return results;
  }
};

let starStyle = {
  color: "orange",
  fontSize: "1.5em",
  display: "inline-block",
};

// Modal's content
function Maps() {
  const [isLoaded, setIsLoaded] = useState(true);

  const [Continent, setContinent] = useState("");
  const [Country, setCountry] = useState("");
  const [State, setState] = useState("");
  const [City, setCity] = useState("");
  const [Area, setArea] = useState("");

  let [AllContinents, setAllContinents] = useState([]);
  let [AllCountries, setAllCountries] = useState([]);
  let [AllStates, setAllStates] = useState([]);
  let [AllCities, setAllCities] = useState([]);
  let [AllAreas, setAllAreas] = useState([]);

  const [surrOpen, setSurrOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [repairShopTypes, setRepairShopTypes] = React.useState([]);
  const [restaurantTypes, setRestaurantTypes] = React.useState([]);

  const [pin, setPin] = useState({
    name: "",
    lat: 48.662587263997416,
    lng: 17.784588140899487,
  });

  const [radius, setRadius] = useState(0);
  const [showing, setShowing] = useState("Coach Operators");
  const [POIS, setPOIS] = useState([]);

  const [results, setResults] = useState([]);

  let [minPrice, setMinPrice] = useState(0);
  let [maxPrice, setMaxPrice] = useState(300);

  let [forbidden, setForbidden] = useState(false);

  const handleRegionChange = (event, value, type) => {
    // CASE 1 : CONTINENT
    if (type === "Continent") {
      setContinent(value || "");
      setCountry("");
      setState("");
      setCity("");
      setArea("");
    }

    // CASE 2 : COUNTRY
    else if (type === "Country") {
      setContinent(value && value.continent ? value.continent : "");
      setCountry(value || "");
      setState("");
      setCity("");
      setArea("");
      console.log(value);
    }

    // CASE 3: STATE
    else if (type === "State") {
      setContinent(
        value && value.country && value.country.continent
          ? value.country.continent
          : ""
      );
      setCountry(value && value.country ? value.country : "");
      setState(value || "");
      setCity("");
      setArea("");
    }

    // CASE 4 : CITY
    else if (type === "City") {
      if (value && value.state) {
        setCity(value || "");
        setContinent(
          value.state.country && value.state.country.continent
            ? value.state.country.continent
            : ""
        );
        setCountry(value.state.country ? value.state.country : "");
        setState(value.state || "");
        setArea("");
      } else {
        setCity(value || "");
        setContinent(
          value && value.country && value.country.continent
            ? value.country.continent
            : ""
        );
        setCountry(value && value.country ? value.country : "");
        setState(value && value.state ? value.state : "");
        setArea("");
      }
    }

    // CASE 5 : AREA
    else if (type === "Area") {
      if (value && value.city && value.city.country) {
        setCity(value.city || "");
        setContinent(value.city.country.continent || "");
        setCountry(value.city.country || "");
        setState(value.city.state || "");
        setArea(value || "");
      } else if (
        value &&
        value.city &&
        value.city.state &&
        value.city.state.country
      ) {
        setCity(value.city || "");
        setContinent(value.city.state.country.continent || "");
        setCountry(value.city.state.country || "");
        setState(value.city.state || "");
        setArea(value || "");
      } else {
        setCity("");
        setContinent("");
        setCountry("");
        setState("");
        setArea(value || "");
      }
    }
  };

  // Countries OK
  const getFilteredCountries = () => {
    if (Continent) {
      return AllCountries.filter(
        (country) =>
          country.continent && country.continent.name === Continent.name
      );
    } else {
      return AllCountries;
    }
  };

  // States OK
  const getFilteredStates = () => {
    if (Country) {
      return AllStates.filter(
        (state) => state.country && state.country.name === Country.name
      );
    } else if (Continent) {
      let countryNames = AllCountries.filter(
        (country) =>
          country.continent && country.continent.name === Continent.name
      ).map((country) => country.name);
      return AllStates.filter(
        (state) => state.country && countryNames.includes(state.country.name)
      );
    } else {
      return AllStates;
    }
  };

  // Cities
  const getFilteredCities = () => {
    if (State) {
      return AllCities.filter(
        (city) => city.state && city.state.name === State.name
      );
    } else if (Country) {
      let citiesWithCountryParent = AllCities.filter(
        (city) => city.country && city.country.name === Country.name
      );
      let statesInCountry = AllStates.filter(
        (state) => state.country && state.country.name === Country.name
      );
      let citiesWithStateParent = AllCities.filter((city) =>
        statesInCountry.some(
          (state) => city.state && city.state.name === state.name
        )
      );
      return [...citiesWithCountryParent, ...citiesWithStateParent];
    } else if (Continent) {
      let countriesInContinent = AllCountries.filter(
        (country) =>
          country.continent && country.continent.name === Continent.name
      );
      let countryNames = countriesInContinent.map((country) => country.name);

      let statesInContinent = AllStates.filter((state) =>
        countriesInContinent.some(
          (country) => country.name === state.country.name
        )
      );
      let stateNames = statesInContinent.map((state) => state.name);

      return AllCities.filter((city) => {
        if (city.country && countryNames.includes(city.country.name)) {
          return true;
        }
        if (city.state && stateNames.includes(city.state.name)) {
          return true;
        }
        return false;
      });
    } else {
      return AllCities;
    }
  };

  // Areas
  const getFilteredAreas = () => {
    if (Area) {
      return AllAreas.filter((area) => area.name === Area.name);
    } else if (City) {
      return AllAreas.filter(
        (area) => area.city && area.city.name === City.name
      );
    } else if (Country) {
      return AllAreas.filter(
        (area) =>
          area.city &&
          area.city.country &&
          area.city.country.name === Country.name
      );
    } else if (Continent) {
      let countryNames = AllCountries.filter(
        (country) =>
          country.continent && country.continent.name === Continent.name
      ).map((country) => country.name);
      return AllAreas.filter(
        (area) =>
          area.city &&
          area.city.country &&
          countryNames.includes(area.city.country.name)
      );
    } else {
      return AllAreas;
    }
  };

  const filterOptions = (options, { inputValue }) => {
    if (inputValue.length >= 2) {
      return options.filter((option) =>
        option.name.toLowerCase().includes(inputValue.toLowerCase())
      );
    }
    return [];
  };

  let allPins = [...results, ...POIS];

  const erasePins = () => {
    setPin({ name: "", lat: 48.662587263997416, lng: 17.784588140899487 });
    setRadius(0);
    setPOIS([]);
    setResults([]);
    setSelectedRating([]);
    setRepairShopTypes([]);
    setRestaurantTypes([]);
  };

  const showResults = () => {
    console.log(repairShopTypes)
    setIsLoaded(false);
    axios
      .get(SHOW_RESULTS, {
        headers: headers,
        params: {
          showing: showing,
          continent: Continent && Continent.name,
          country: Country && Country.name,
          city: City && City.name,
          state: State && State.name,
          area: Area && Area.name,
          pin: pin,
          repair_shop_types: repairShopTypes.map((rType) => rType.id),
          restaurant_types: restaurantTypes.map((rType) => rType.id),
          rating: selectedRating,
          categories: selectedCategories,
          min_price: minPrice,
          max_price: maxPrice,
        },
      })
      .then((res) => {
        setResults(res.data.results);
        setPin(res.data.pin);
        setIsLoaded(true);
        setRepairShopTypes([]);
      })
      .catch((e) => {
        console.log(e)
        setIsLoaded(true);
        Swal.fire({
          icon: "error",
          title: "Try again",
          text: e.response.data.errormsg,
        });
      });
  };

  const showNearbyPOIS = () => {
    setIsLoaded(false);
    axios
      .get(GET_SURROUNDING_POIS, {
        headers: headers,
        params: {
          showing: showing,
          country: Country,
          radius: radius,
          object_type: showing,
          lat: pin["lat"],
          lng: pin["lng"],
        },
      })
      .then((res) => {
        setPOIS(res.data.pois);
        setIsLoaded(true);
      })
      .catch((e) => {
        setIsLoaded(true);
        Swal.fire({
          icon: "error",
          title: "Try again",
          text: e.response.data.errormsg,
        });
      });
  };

  const getContinents = () => {
    axios
      .get(GET_CONTINENTS, {
        headers: headers,
      })
      .then((res) => {
        setAllContinents(res.data.all_continents);
      });
  };

  const getCountries = () => {
    axios
      .get(GET_COUNTRIES, {
        headers: headers,
      })
      .then((res) => {
        setAllCountries(res.data.all_countries);
      });
  };

  const getStates = () => {
    axios
      .get(GET_STATES, {
        headers: headers,
      })
      .then((res) => {
        setAllStates(res.data.all_states);
      });
  };

  const getCities = () => {
    axios
      .get(GET_CITIES, {
        headers: headers,
      })
      .then((res) => {
        setAllCities(res.data.all_cities);
      });
  };

  const getAreas = () => {
    axios
      .get(GET_AREAS, {
        headers: headers,
      })
      .then((res) => {
        setAllAreas(res.data.all_areas);
      });
  };

  function getMarkerIcon(type, icon) {
    if (type === "Coach Operators") {
      return createIcon(coachOperatorMarkerImage);
    } else if (type === "Cruising Companies") {
      return createIcon(cruisingCompanyMarkerImage);
    } else if (type === "Ferry Ticket Agencies") {
      return createIcon(ferryTicketAgencyMarkerImage);
    } else if (type === "DMCs") {
      return createIcon(DMCMarkerImage);
    } else if (type === "Hotels") {
      return createIcon(hotelMarkerImage);
    } else if (type === "Repair Shops") {
      if (icon && icon === 'Air conditioning') {
        return createIcon(ACMarkerImage);
      } else if (icon && icon === 'Electrician') {
        return createIcon(ElectricianMarkerImage)
      } else if (icon && icon === 'Evobus') {
        return createIcon(EvobusMarkerImage)
      } else if (icon && icon === 'Oil change') {
        return createIcon(OilChangeMarkerImage)
      } else if (icon && icon === 'DAF') {
        return createIcon(DAFMarkerImage)
      } else if (icon && icon === 'General repairs') {
        return createIcon(GeneralMarkerImage)
      } else if (icon && icon === 'MAN') {
        return createIcon(MANMarkerImage)
      } else if (icon && icon === 'Battery-related') {
        return createIcon(BatteryMarkerImage)
      } else if (icon && icon === 'TEMSA') {
        return createIcon(TEMSAMarkerImage)
      } else if (icon && icon === 'Volvo') {
        return createIcon(VolvoMarkerImage)
      } else if (icon && icon === 'Setra') {
        return createIcon(SetraMarkerImage)
      } else if (icon && icon === 'Vanhool') {
        return createIcon(VanhoolMarkerImage)
      } else if (icon && icon === 'VDL') {
        return createIcon(VDLMarkerImage)
      } else if (icon && icon === 'Bova') {
        return createIcon(BovaMarkerImage)
      } else if (icon && icon === 'Irisbus') {
        return createIcon(IrisbusMarkerImage)
      } else if (icon && icon === 'Iveco') {
        return createIcon(IvecoMarkerImage)
      } else if (icon && icon === 'Mercedes') {
        return createIcon(MercedesMarkerImage)
      } else if (icon && icon === 'Tyres') {
        return createIcon(TyresMarkerImage)
      } else if (icon && icon === 'Towing') {
        return createIcon(TowingMarkerImage)
      } else if (icon && icon === 'Neoplan') {
        return createIcon(NeoplanMarkerImage)
      } else if (icon && icon === 'Scania') {
        return createIcon(ScaniaMarkerImage)
      } else if (icon && icon === 'Windscreens') {
        return createIcon(WindScreensMarkerImage)
      } else if (icon && icon === 'Body repairs') {
        return createIcon(BodyRepairsMarkerImage)
      } else if (icon && icon === 'Brakes') {
        return createIcon(BrakesMarkerImage)
      } else if (icon && icon === 'Spare parts and accessories') {
        return createIcon(SparePartsAccessoriesMarkerImage)
      } else if (icon && icon === 'Upholstery') {
        return createIcon(UpholsteryMarkerImage)
      } else if (icon && icon === 'Gearbbox repairs') {
        return createIcon(GearbboxMarkerImage)
      } else if (icon && icon === 'Tachograph engineers') {
        return createIcon(TachographMarkerImage)
      } else if (icon && icon === '24-hour service') {
        return createIcon(TwentyFourMarkerImage)
      } else {
        return createIcon(repairShopMarkerImage);
      }
    } else if (type === "Restaurants") {
      return createIcon(restaurantMarkerImage);
    } else if (type === "Sport Event Suppliers") {
      return createIcon(sportEventSupplierMarkerImage);
    } else if (type === "Teleferik Companies") {
      return createIcon(teleferikCompanyMarkerImage);
    } else if (type === "Theaters") {
      return createIcon(theaterMarkerImage);
    } else if (type === "Train Ticket Agencies") {
      return createIcon(trainTicketAgencyMarkerImage);
    } else if (type === "Parking Lots") {
      return createIcon(parkingLotMarkerImage);
    } else if (type === "Shows & Entertainment") {
      return createIcon(entertainmentProductsMarkerImage);
    }
    // default marker
    return createIcon(MarkerImage);
  }

  useEffect(() => {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      setForbidden(true);
      setShowing("Hotels");
    }
    getContinents();
    getCountries();
    getStates();
    getCities();
    getAreas();

    var elements = document.querySelectorAll(
      ".leaflet-control-zoom-fullscreen.fullscreen-icon"
    );

    // Loop through the elements starting from index 1 and make them invisible
    for (var i = 1; i < elements.length; i++) {
      elements[i].style.display = "none";
    }
  }, [pin]);

  return (
    <>
      <NavigationBar />
      <div className="rootContainer">
        {pageHeader("maps_explore")}
        {isLoaded ? (
          <>
            <Grid columns={2} stackable style={{ margin: 10 }}>
              <Grid.Row>
                <Grid.Column width={3}>
                  <ListGroup>
                    <ListGroup.Item>
                      <h4 style={{ textAlign: "center" }}>Select An object</h4>
                      <select
                        className="form-control"
                        style={{ marginTop: 20, marginBottom: 20 }}
                        value={showing}
                        onChange={(e) => {
                          setShowing(e.target.value);
                        }}
                      >
                        {forbidden ? (
                          <>
                            <option> Hotels </option>
                          </>
                        ) : (
                          <>
                            <option> Advertisement Companies </option>
                            <option> Car Hire</option>
                            <option> Charter Airlines & Brokers </option>
                            <option> Coach Operators </option>
                            <option> Cruising Companies </option>
                            <option> Ferry Ticket Agencies </option>
                            <option> DMCs </option>
                            <option> Hotels </option>
                            <option> Parking Lots </option>
                            <option> Repair Shops </option>
                            <option> Restaurants </option>
                            <option> Sport Event Suppliers </option>
                            <option> Teleferik Companies </option>
                            <option> Theaters </option>
                            <option> Train Ticket Agencies </option>
                            <option> Shows & Entertainment </option>
                          </>
                        )}
                      </select>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <h4 style={{ textAlign: "center" }}>Search Regions</h4>
                      <Autocomplete
                        options={AllContinents}
                        onChange={(event, value) =>
                          handleRegionChange(event, value, "Continent")
                        }
                        getOptionLabel={(option) => option.name}
                        value={Continent}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Continent"
                            variant="outlined"
                          />
                        )}
                      />
                      <hr />
                      <Autocomplete
                        options={getFilteredCountries()}
                        onChange={(event, value) =>
                          handleRegionChange(event, value, "Country")
                        }
                        value={Country}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Country"
                            variant="outlined"
                          />
                        )}
                      />
                      {getFilteredStates().length > 0 ? (
                        <>
                          <hr />
                          <Autocomplete
                            options={getFilteredStates()}
                            onChange={(event, value) =>
                              handleRegionChange(event, value, "State")
                            }
                            value={State}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="State"
                                variant="outlined"
                              />
                            )}
                          />
                        </>
                      ) : (
                        ""
                      )}
                      <hr />
                      <Autocomplete
                        options={getFilteredCities()}
                        onChange={(event, value) =>
                          handleRegionChange(event, value, "City")
                        }
                        value={City}
                        filterOptions={filterOptions}
                        getOptionLabel={(option) =>
                          option.country
                            ? option.name + " - " + option.country.name
                            : option.name
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="City"
                            variant="outlined"
                          />
                        )}
                      />
                      <hr />
                      <Autocomplete
                        options={getFilteredAreas()}
                        onChange={(event, value) =>
                          handleRegionChange(event, value, "Area")
                        }
                        value={Area}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Area"
                            variant="outlined"
                          />
                        )}
                      />
                    </ListGroup.Item>

                    {showing === "Hotels" ? (
                      <HotelFilters
                        selectedRating={selectedRating}
                        setSelectedRating={setSelectedRating}
                        showResults={showResults}
                        min_price={minPrice}
                        max_price={maxPrice}
                        set_min_price={(e) => setMinPrice(e)}
                        set_max_price={(e) => setMaxPrice(e)}
                        selectedCategories={selectedCategories}
                        setSelectedCategories={setSelectedCategories}
                        forbidden={forbidden}
                      />
                    ) : (
                      ""
                    )}

                    {showing === "Coach Operators" ? (
                      <CoachOperatorFilters
                        showResults={showResults}
                        selectedCategories={selectedCategories}
                        setSelectedCategories={setSelectedCategories}
                        forbidden={forbidden}
                      />
                    ) : (
                      ""
                    )}

                    {showing === "Repair Shops" ? (
                      <RepairShopFilters
                        country={Country}
                        setCountry={(e) => setCountry(e)}
                        showResults={showResults}
                        repair_shop_types={repairShopTypes}
                        set_repair_shop_types={(e) => setRepairShopTypes(e)}
                      />
                    ) : (
                      ""
                    )}

                    {showing === "Restaurants" ? (
                      <RestaurantFilters
                        country={Country}
                        setCountry={(e) => setCountry(e)}
                        showResults={showResults}
                        restaurant_types={restaurantTypes}
                        set_restaurant_types={(e) => setRestaurantTypes(e)}
                      />
                    ) : (
                      ""
                    )}
                  </ListGroup>
                  <hr />
                  <Button
                    color="blue"
                    id="show_results_button"
                    style={{ width: "100%", marginTop: 20 }}
                    onClick={() => showResults()}
                  >
                    Show results
                  </Button>
                  <hr />
                  Search Results :
                  <hr />
                  {results.filter((result) => result.type === "Coach Operators")
                    .length > 0 ? (
                    <>
                      Coach Operators :
                      {
                        results.filter(
                          (result) => result.type === "Coach Operators"
                        ).length
                      }
                    </>
                  ) : (
                    ""
                  )}
                  {results.filter(
                    (result) => result.type === "Cruising Companies"
                  ).length > 0 ? (
                    <>
                      Cruising Companies :
                      {
                        results.filter(
                          (result) => result.type === "Cruising Companies"
                        ).length
                      }
                    </>
                  ) : (
                    ""
                  )}
                  {results.filter(
                    (result) => result.type === "Ferry Ticket Agencies"
                  ).length > 0 ? (
                    <>
                      Ferry Ticket Agencies :
                      {
                        results.filter(
                          (result) => result.type === "Ferry Ticket Agencies"
                        ).length
                      }
                    </>
                  ) : (
                    ""
                  )}
                  {results.filter((result) => result.type === "DMCs").length >
                  0 ? (
                    <>
                      DMCs :
                      {
                        results.filter((result) => result.type === "DMCs")
                          .length
                      }
                    </>
                  ) : (
                    ""
                  )}
                  {results.filter((result) => result.type === "Hotels").length >
                  0 ? (
                    <>
                      Hotels :
                      {
                        results.filter((result) => result.type === "Hotels")
                          .length
                      }
                    </>
                  ) : (
                    ""
                  )}
                  {results.filter((result) => result.type === "Parking Lots")
                    .length > 0 ? (
                    <>
                      Parking Lots :
                      {
                        results.filter(
                          (result) => result.type === "Parking Lots"
                        ).length
                      }
                    </>
                  ) : (
                    ""
                  )}
                  {results.filter((result) => result.type === "Repair Shops")
                    .length > 0 ? (
                    <>
                      Repair Shops :
                      {
                        results.filter(
                          (result) => result.type === "Repair Shops"
                        ).length
                      }
                    </>
                  ) : (
                    ""
                  )}
                  {results.filter((result) => result.type === "Restaurants")
                    .length > 0 ? (
                    <>
                      Restaurants :
                      {
                        results.filter(
                          (result) => result.type === "Restaurants"
                        ).length
                      }
                    </>
                  ) : (
                    ""
                  )}
                  {results.filter(
                    (result) => result.type === "Sport Event Suppliers"
                  ).length > 0 ? (
                    <>
                      Sport Event Suppliers :
                      {
                        results.filter(
                          (result) => result.type === "Sport Event Suppliers"
                        ).length
                      }
                    </>
                  ) : (
                    ""
                  )}
                  {results.filter(
                    (result) => result.type === "Teleferik Companies"
                  ).length > 0 ? (
                    <>
                      Teleferik Companies :
                      {
                        results.filter(
                          (result) => result.type === "Teleferik Companies"
                        ).length
                      }
                    </>
                  ) : (
                    ""
                  )}
                  {results.filter((result) => result.type === "Theaters")
                    .length > 0 ? (
                    <>
                      Theaters :
                      {
                        results.filter((result) => result.type === "Theaters")
                          .length
                      }
                    </>
                  ) : (
                    ""
                  )}
                  {results.filter(
                    (result) => result.type === "Train Ticket Agencies"
                  ).length > 0 ? (
                    <>
                      Train Ticket Agencies :
                      {
                        results.filter(
                          (result) => result.type === "Train Ticket Agencies"
                        ).length
                      }
                    </>
                  ) : (
                    ""
                  )}
                  {POIS.length > 0 ? (
                    <>
                      <hr /> Points of Interest : <hr />
                      {POIS.filter((item) => item.type === "Coach Operators")
                        .length > 0 ? (
                        <>
                          Coach Operators :
                          {
                            POIS.filter(
                              (item) => item.type === "Coach Operators"
                            ).length
                          }
                          <hr />
                        </>
                      ) : (
                        ""
                      )}
                      {POIS.filter((item) => item.type === "Cruising Companies")
                        .length > 0 ? (
                        <>
                          Cruising Companies :
                          {
                            POIS.filter(
                              (item) => item.type === "Cruising Companies"
                            ).length
                          }
                          <hr />
                        </>
                      ) : (
                        ""
                      )}
                      {POIS.filter(
                        (item) => item.type === "Ferry Ticket Agencies"
                      ).length > 0 ? (
                        <>
                          Ferry Ticket Agencies :
                          {
                            POIS.filter(
                              (item) => item.type === "Ferry Ticket Agencies"
                            ).length
                          }
                          <hr />
                        </>
                      ) : (
                        ""
                      )}
                      {POIS.filter((item) => item.type === "DMCs").length >
                      0 ? (
                        <>
                          DMCs :
                          {POIS.filter((item) => item.type === "DMCs").length}
                          <hr />
                        </>
                      ) : (
                        ""
                      )}
                      {POIS.filter((item) => item.type === "Hotels").length >
                      0 ? (
                        <>
                          Hotels :
                          {
                            POIS.filter((item) => item.type === "Hotels").length
                          }
                          <hr />
                        </>
                      ) : (
                        ""
                      )}
                      {POIS.filter((item) => item.type === "Parking Lots")
                        .length > 0 ? (
                        <>
                          Parking Lots :
                          {
                            POIS.filter((item) => item.type === "Parking Lots")
                              .length
                          }
                          <hr />
                        </>
                      ) : (
                        ""
                      )}
                      {POIS.filter((item) => item.type === "Repair Shops")
                        .length > 0 ? (
                        <>
                          Repair Shops :
                          {
                            POIS.filter((item) => item.type === "Repair Shops")
                              .length
                          }
                          <hr />
                        </>
                      ) : (
                        ""
                      )}
                      {POIS.filter((item) => item.type === "Restaurants")
                        .length > 0 ? (
                        <>
                          Restaurants :
                          {
                            POIS.filter((item) => item.type === "Restaurants")
                              .length
                          }
                          <hr />
                        </>
                      ) : (
                        ""
                      )}
                      {POIS.filter(
                        (item) => item.type === "Sport Event Suppliers"
                      ).length > 0 ? (
                        <>
                          Sport Event Suppliers :
                          {
                            POIS.filter(
                              (item) => item.type === "Sport Event Suppliers"
                            ).length
                          }
                          <hr />
                        </>
                      ) : (
                        ""
                      )}
                      {POIS.filter(
                        (item) => item.type === "Teleferik Companies"
                      ).length > 0 ? (
                        <>
                          Teleferik Companies :
                          {
                            POIS.filter(
                              (item) => item.type === "Teleferik Companies"
                            ).length
                          }
                          <hr />
                        </>
                      ) : (
                        ""
                      )}
                      {POIS.filter((item) => item.type === "Theaters").length >
                      0 ? (
                        <>
                          Theaters :
                          {
                            POIS.filter((item) => item.type === "Theaters")
                              .length
                          }
                          <hr />
                        </>
                      ) : (
                        ""
                      )}
                      {POIS.filter(
                        (item) => item.type === "Train Ticket Agencies"
                      ).length > 0 ? (
                        <>
                          Train Ticket Agencies :
                          {
                            POIS.filter(
                              (item) => item.type === "Train Ticket Agencies"
                            ).length
                          }
                          <hr />
                        </>
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    ""
                  )}
                  {POIS.filter(
                    (item) => item.type === "Shows & Entertainment"
                  ).length > 0 ? (
                    <>
                      Shows & Entertainment :
                      {
                        POIS.filter(
                          (item) => item.type === "Shows & Entertainment"
                        ).length
                      }
                      <hr />
                    </>
                  ) : (
                    ""
                  )}
                </Grid.Column>
                <Grid.Column width={13}>
                  <MapContainer
                    fullscreenControl={true}
                    center={[pin.lat, pin.lng]}
                    zoom={4}
                    scrollWheelZoom
                    style={{ height: 700, width: "100%" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {allPins.map((item, index) => {
                      if (item.type === 'Shows & Entertainment') {
                        return (
                          <>
                            <Marker
                              key={index}
                              index={index}
                              position={[item.lat, item.lng]}
                              icon={getMarkerIcon(item.type)}
                              eventHandlers={{
                                contextmenu: () => {
                                  if (!forbidden) {
                                    setSurrOpen(true);
                                    setPin({
                                      name: item.name,
                                      lat: item.lat,
                                      lng: item.lng,
                                    });
                                  }
                                },
                              }}
                            >
                              <Popup>
                                <ul id="marker_card">
                                  <b style={{ textAlign: "center" }}>
                                    {renderIcon(item.type)}
                                      {item.name}
                                  </b>
                                  <hr />
                                  <li>Description: {item.description} </li>
                                  <li>Supplier: <b style={{ textAlign: "center" }}>
                                  <a target="_blank" rel="noreferrer" href={"/data_management/" + objectToLink[item.type] + "/" + item.entertainment_supplier_id }>
                                    {item.es_name}
                                  </a>
                                </b> </li>
                                </ul>
                              </Popup>
                            </Marker>
                          </>
                        )
                      } else if (item.type === 'Repair Shops') {
                        return (
                          <Marker
                            key={index}
                            index={index}
                            position={[item.lat, item.lng]}
                            icon={getMarkerIcon(item.type, item.icon)}
                            eventHandlers={{
                              contextmenu: () => {
                                if (!forbidden) {
                                  setSurrOpen(true);
                                  setPin({
                                    name: item.name,
                                    lat: item.lat,
                                    lng: item.lng,
                                  });
                                }
                              },
                            }}
                          >
                            <Popup>
                              <ul id="marker_card">
                                <b style={{ textAlign: "center" }}>
                                  {renderIcon(item.type)}
                                  <a target="_blank" rel="noreferrer" href={"/data_management/" + objectToLink[item.type] + "/" + item.id }>
                                    {item.name}
                                  </a>
                                </b>
                                <hr />
                                <li>Email: {item.email} </li>
                                <li>Address: {item.address} </li>
                                <li>Tel: {item.tel} </li>
                                <li>Type: {item.icon ? item.icon : 'N/A'} </li>
                              </ul>
                            </Popup>
                          </Marker>
                        );
                      } else {
                        return (
                          <Marker
                            key={index}
                            index={index}
                            position={[item.lat, item.lng]}
                            icon={getMarkerIcon(item.type)}
                            eventHandlers={{
                              contextmenu: () => {
                                if (!forbidden) {
                                  setSurrOpen(true);
                                  setPin({
                                    name: item.name,
                                    lat: item.lat,
                                    lng: item.lng,
                                  });
                                }
                              },
                            }}
                          >
                            <Popup>
                              <ul id="marker_card">
                                <b style={{ textAlign: "center" }}>
                                  {renderIcon(item.type)}
                                  <a target="_blank" rel="noreferrer" href={"/data_management/" + objectToLink[item.type] + "/" + item.id }>
                                    {item.name}
                                  </a>
                                </b>
                                <hr />
                                <li>Email: {item.email} </li>
                                <li>Address: {item.address} </li>
                                <li>Tel: {item.tel} </li>
                                {item.type === "Hotels" ? (
                                  <li>
                                    Rating: {item.rating === "N/A" ? "N/A" : calculateHotelStars(item.rating)}
                                  </li>
                                ) : (
                                  ""
                                )}
                              </ul>
                            </Popup>
                          </Marker>
                        );
                      }
                    })}

                    {radius !== 0 ? (
                      <Circle
                        center={[pin.lat, pin.lng]}
                        radius={radius * 1000}
                        pathOptions={{ color: "blue" }}
                      />
                    ) : (
                      ""
                    )}
                  </MapContainer>
                  <SendMassiveEmail
                    pois={POIS}
                    results={results}
                    forbidden={forbidden}
                  />
                  <Button
                    onClick={() => erasePins()}
                    style={{ marginTop: 20, marginLeft: 20 }}
                    color="orange"
                    disabled={POIS.length === 0 && results.length === 0}
                  >
                    Erase Pins
                  </Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </>
        ) : (
          <> {loader()} </>
        )}
      </div>
      <GetSurroundingPOIS
        open={surrOpen}
        setSurrOpen={setSurrOpen}
        radius={radius}
        setRadius={setRadius}
        showNearbyPOIS={showNearbyPOIS}
        showing={showing}
        setShowing={setShowing}
        rating={selectedRating}
        setRating={setSelectedRating}
      />
      <Footer />
    </>
  );
}

export default Maps;
