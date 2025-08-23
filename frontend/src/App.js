// Built-ins
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React, { useState } from "react";

// Core
import Home from "./components/core/home/home";
import About from "./components/core/about/about";
import Terms from "./components/core/terms/terms";
import Updates from "./components/core/updates/updates";
import Help from "./components/core/help/help";
import StaffDox from "./components/core/staff_dox/staff_dox";
import DevDox from "./components/core/dev_dox/dev_dox";
import UsefulLinks from "./components/core/useful_links/useful_links";
import FourOFour from "./components/core/404/404";
import UnderConstruction from "./components/core/under_construction/under_construction";
import Login from "./components/core/login/login";
import GroupManagementRoot from "./components/group_management/group_management_root/group_management_root";
import ReportsRoot from "./components/reports/reports_root/reports_root";
import DataManagementRoot from "./components/data_management/data_management_root/data_management_root";
import MapsRoot from "./components/maps/maps_root/maps_root";
import SiteAdministrationRoot from "./components/site_administration/site_administration_root/site_administration_root";
import FinancialRoot from "./components/financial/financial_root/financial_root";
import ProtectedRoute from "./components/core/router/protected_route";

// Group Management
import AllGroups from "./components/group_management/all_groups/all_groups";
import Group from "./components/group_management/group/group";
import AllGroupOffers from "./components/group_management/all_group_offers/all_group_offers";
import Offer from "./components/group_management/offer/offer";
import Availability from "./components/group_management/availability/availability";
import Pending from "./components/group_management/pending/pending";

// Data Management
import AllAgents from "./components/data_management/all_agents/all_agents";
import Agent from "./components/data_management/agent/agent";
import AllAirlines from "./components/data_management/all_airlines/all_airlines";
import Airline from "./components/data_management/airline/airline";
import AllAirports from "./components/data_management/all_airports/all_airports";
import Airport from "./components/data_management/airport/airport";
import AllAttractions from "./components/data_management/all_attractions/all_attractions";
import Attraction from "./components/data_management/attraction/attraction";
import AllClients from "./components/data_management/all_clients/all_clients";
import Client from "./components/data_management/client/client";
import AllCoachOperators from "./components/data_management/all_coach_operators/all_coach_operators";
import CoachOperator from "./components/data_management/coach_operator/coach_operator";
import AllCoaches from "./components/data_management/all_coaches/all_coaches";
import Coach from "./components/data_management/coach/coach";
import AllContracts from "./components/data_management/all_contracts/all_contracts";
import Contract from "./components/data_management/contract/contract";
import AllCruisingCompanies from "./components/data_management/all_cruising_companies/all_cruising_companies";
import CruisingCompany from "./components/data_management/cruising_company/cruising_company";
import AllRailwayStations from "./components/data_management/all_railway_stations/all_railway_stations";
import RailwayStation from "./components/data_management/railway_station/railway_station";
import AllDrivers from "./components/data_management/all_drivers/all_drivers";
import Driver from "./components/data_management/driver/driver";
import AllDMCs from "./components/data_management/all_dmcs/all_dmcs";
import DMC from "./components/data_management/dmc/dmc";
import AllGroupLeaders from "./components/data_management/all_group_leaders/all_group_leaders";
import GroupLeader from "./components/data_management/group_leader/group_leader";
import AllGuides from "./components/data_management/all_guides/all_guides";
import Guide from "./components/data_management/guide/guide";
import AllHotels from "./components/data_management/all_hotels/all_hotels";
import Hotel from "./components/data_management/hotel/hotel";
import AllPorts from "./components/data_management/all_ports/all_ports";
import Port from "./components/data_management/port/port";
import AllRepairShops from "./components/data_management/all_repair_shops/all_repair_shops";
import RepairShop from "./components/data_management/repair_shop/repair_shop";
import AllRestaurants from "./components/data_management/all_restaurants/all_restaurants";
import Restaurant from "./components/data_management/restaurant/restaurant";
import AllServices from "./components/data_management/all_services/all_services";
import Service from "./components/data_management/service/service";
import AllFerryTicketAgencies from "./components/data_management/all_ferry_ticket_agencies/all_ferry_ticket_agencies";
import FerryTicketAgency from "./components/data_management/ferry_ticket_agency/ferry_ticket_agency";
import AllTeleferikCompanies from "./components/data_management/all_teleferik_companies/all_teleferik_companies";
import TeleferikCompany from "./components/data_management/teleferik_company/teleferik_company";
import AllTextTemplates from "./components/data_management/all_text_templates/all_text_templates";
import TextTemplate from "./components/data_management/text_template/text_template";
import AllTheaters from "./components/data_management/all_theaters/all_theaters";
import Theater from "./components/data_management/theater/theater";
import AllTrainTicketAgencies from "./components/data_management/all_train_ticket_agencies/all_train_ticket_agencies";
import TrainTicketAgency from "./components/data_management/train_ticket_agency/train_ticket_agency";
import AllSportEventSuppliers from "./components/data_management/all_sport_event_suppliers/all_sport_event_suppliers";
import SportEventSupplier from "./components/data_management/sport_event_supplier/sport_event_supplier";
import AllParkingLots from "./components/data_management/all_parking_lots/all_parking_lots";
import ParkingLot from "./components/data_management/parking_lot/parking_lot";
import AllRegions from "./components/data_management/all_regions/all_regions";
import Region from "./components/data_management/region/region";
import AllEntertainmentSuppliers from "./components/data_management/all_entertainment_suppliers/all_entertainment_suppliers";
import EntertainmentSupplier from "./components/data_management/entertainment_supplier/entertainment_supplier";
import AllCarHireCompanies from "./components/data_management/all_car_hire_companies/all_car_hire_companies";
import CarHireCompany from "./components/data_management/car_hire_company/car_hire_company";
import AllAdvertisementCompanies from "./components/data_management/all_advertisement_companies/all_advertisement_companies";
import AdvertisementCompany from "./components/data_management/advertisement_company/advertisement_company";
import AllCharterBrokers from "./components/data_management/all_charter_brokers/all_charter_brokers";
import CharterBroker from "./components/data_management/charter_broker/charter_broker";
import AllAircrafts from "./components/data_management/all_aircrafts/all_aircrafts";
import Aircraft from "./components/data_management/aircraft/aircraft";


// Maps
import Maps from "./components/maps/explore/explore";
import DailyStatus from "./components/maps/daily_status/daily_status";

// Site Administration
import AccessHistory from "./components/site_administration/access_history/access_history";
import Conflicts from "./components/site_administration/conflicts/conflicts";
import IncompleteData from "./components/site_administration/incomplete_data/incomplete_data";
import Logs from "./components/site_administration/logs/logs";
import AllUsers from "./components/site_administration/all_users/all_users";
import User from "./components/site_administration/user/user";
import UserPermissions from "./components/site_administration/user_permissions/user_permissions";
import NasFolders from "./components/site_administration/nas_folders/nas_folders";

// Financial
import PaymentOrders from "./components/financial/payment_orders/payment_orders";
import Payments from "./components/financial/all_payments/all_payments";
import Deposits from "./components/financial/all_deposits/all_deposits";

// Reports
import ReportAgent from "./components/reports/agent/agent";
import ReportAirport from "./components/reports/airport/airport";
import ReportClient from "./components/reports/client/client";
import ReportCoachOperator from "./components/reports/coach_operator/coach_operator";
import ReportDriver from "./components/reports/driver/driver";
import ReportExpiringDocuments from "./components/reports/expiring_documents/expiring_documents";
import ReportGroupLeader from "./components/reports/group_leader/group_leader";
import ReportHotel from "./components/reports/hotel/hotel";
import ReportUser from "./components/reports/user/user";
import ReportSiteStatistics from "./components/reports/site_statistics/site_statistics";
import ReportService from "./components/reports/service/service";
import ReportSentEmails from "./components/reports/sent_emails/sent_emails";
import GroupStats from "./components/reports/group_stats/group_stats";
import OptionDates from "./components/reports/option_dates/option_dates";

// Mass Mailing
// import MassMailing from "./components/mass_mailing/mass_mailing";

// CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "@devexpress/dx-react-chart-bootstrap4/dist/dx-react-chart-bootstrap4.css";
import "./components/global.css";
import "./components/tables.css";
import "./components/media_queries.css";

// Rendered as main app
function App() {
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));
  return (
    <Router>
      <Switch>
        {/* Core */}
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/"
          render={(props) => <Home {...props} setUserToken={setUserToken} />}
        />
        <Route
          exact
          path="/login"
          render={(props) => <Login {...props} setUserToken={setUserToken} />}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/about"
          render={(props) => <About {...props} setUserToken={setUserToken} />}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/terms"
          render={(props) => <Terms {...props} setUserToken={setUserToken} />}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/help/updates"
          render={(props) => <Updates {...props} setUserToken={setUserToken} />}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/help"
          render={(props) => <Help {...props} setUserToken={setUserToken} />}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/help/staff_dox"
          render={(props) => (
            <StaffDox {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/help/dev_dox"
          render={(props) => <DevDox {...props} setUserToken={setUserToken} />}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/help/useful_links"
          render={(props) => (
            <UsefulLinks {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/under_construction"
          render={(props) => (
            <UnderConstruction {...props} setUserToken={setUserToken} />
          )}
        />

        {/* Groups */}
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/group_management/root"
          render={(props) => (
            <GroupManagementRoot {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/group_management/all_groups"
          render={(props) => (
            <AllGroups {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/group_management/group/:refcode"
          component={Group}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/group_management/all_group_offers"
          render={(props) => (
            <AllGroupOffers {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/group_management/offer/:id"
          component={Offer}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/group_management/availability"
          component={Availability}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/group_management/pending_groups"
          component={Pending}
        />

        {/* Reports */}
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/reports/root"
          render={(props) => (
            <ReportsRoot {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/reports/agent"
          render={(props) => (
            <ReportAgent {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/reports/client"
          render={(props) => (
            <ReportClient {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/reports/driver"
          render={(props) => (
            <ReportDriver {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/reports/group_leader"
          render={(props) => (
            <ReportGroupLeader {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/reports/coach_operator"
          render={(props) => (
            <ReportCoachOperator {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/reports/hotel"
          render={(props) => (
            <ReportHotel {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/reports/airport"
          render={(props) => (
            <ReportAirport {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/reports/user"
          render={(props) => (
            <ReportUser {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/reports/expiring_documents"
          render={(props) => (
            <ReportExpiringDocuments {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/reports/site_statistics"
          render={(props) => (
            <ReportSiteStatistics {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/reports/service"
          render={(props) => (
            <ReportService {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/reports/sent_emails"
          render={(props) => (
            <ReportSentEmails {...props} setUserToken={setUserToken} />
          )}
        />

        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/reports/group_stats"
          render={(props) => (
            <GroupStats {...props} setUserToken={setUserToken} />
          )}
        />

        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/reports/option_dates"
          render={(props) => (
            <OptionDates {...props} setUserToken={setUserToken} />
          )}
        />

        {/* Data management */}
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/root"
          render={(props) => (
            <DataManagementRoot {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/all_agents"
          render={(props) => (
            <AllAgents {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/agent/:id"
          component={Agent}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/all_clients"
          render={(props) => (
            <AllClients {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/client/:id"
          component={Client}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/all_hotels"
          render={(props) => (
            <AllHotels {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/hotel/:id"
          component={Hotel}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/all_drivers"
          render={(props) => (
            <AllDrivers {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/driver/:id"
          component={Driver}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/all_group_leaders"
          render={(props) => (
            <AllGroupLeaders {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/group_leader/:id"
          component={GroupLeader}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/all_coach_operators"
          render={(props) => (
            <AllCoachOperators {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/coach_operator/:id"
          component={CoachOperator}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/all_coaches"
          render={(props) => (
            <AllCoaches {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/coach/:id"
          component={Coach}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/all_contracts"
          render={(props) => (
            <AllContracts {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/contract/:id"
          component={Contract}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/all_airlines"
          render={(props) => (
            <AllAirlines {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/airline/:id"
          component={Airline}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/all_repair_shops"
          render={(props) => (
            <AllRepairShops {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/repair_shop/:id"
          component={RepairShop}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/all_airports"
          render={(props) => (
            <AllAirports {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/airport/:name"
          component={Airport}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/all_attractions"
          render={(props) => (
            <AllAttractions {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/attraction/:id"
          component={Attraction}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/all_guides"
          render={(props) => (
            <AllGuides {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/guide/:id"
          component={Guide}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/all_ports"
          render={(props) => (
            <AllPorts {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/port/:id"
          component={Port}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/all_ferry_ticket_agencies"
          render={(props) => (
            <AllFerryTicketAgencies {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/ferry_ticket_agency/:id"
          component={FerryTicketAgency}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/all_restaurants"
          render={(props) => (
            <AllRestaurants {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/restaurant/:id"
          component={Restaurant}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/all_theaters"
          render={(props) => (
            <AllTheaters {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/theater/:id"
          component={Theater}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/all_sport_event_suppliers"
          render={(props) => (
            <AllSportEventSuppliers {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/sport_event_supplier/:id"
          component={SportEventSupplier}
        />

        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/all_entertainment_suppliers"
          render={(props) => (
            <AllEntertainmentSuppliers {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/entertainment_supplier/:id"
          component={EntertainmentSupplier}
        />

        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/all_parking_lots"
          render={(props) => (
            <AllParkingLots {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/parking_lot/:id"
          component={ParkingLot}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/all_cruising_companies"
          render={(props) => (
            <AllCruisingCompanies {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/cruising_company/:id"
          component={CruisingCompany}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/all_railway_stations"
          render={(props) => (
            <AllRailwayStations {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/railway_station/:id"
          component={RailwayStation}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/all_teleferik_companies"
          render={(props) => (
            <AllTeleferikCompanies {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/teleferik_company/:id"
          component={TeleferikCompany}
        />

        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/all_car_hire_companies"
          render={(props) => (
            <AllCarHireCompanies {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/car_hire_company/:id"
          component={CarHireCompany}
        />

        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/all_advertisement_companies"
          render={(props) => (
            <AllAdvertisementCompanies {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/advertisement_company/:id"
          component={AdvertisementCompany}
        />

        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/all_charter_brokers"
          render={(props) => (
            <AllCharterBrokers {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/charter_broker/:id"
          component={CharterBroker}
        />

        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/all_aircrafts"
          render={(props) => (
            <AllAircrafts {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/aircraft/:id"
          component={Aircraft}
        />

        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/all_text_templates"
          render={(props) => (
            <AllTextTemplates {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/text_template/:id"
          component={TextTemplate}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/all_dmcs"
          render={(props) => <AllDMCs {...props} setUserToken={setUserToken} />}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/dmc/:id"
          component={DMC}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/all_train_ticket_agencies"
          render={(props) => (
            <AllTrainTicketAgencies {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/train_ticket_agency/:id"
          component={TrainTicketAgency}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/all_services"
          render={(props) => (
            <AllServices {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/service/:id"
          component={Service}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/all_regions"
          render={(props) => (
            <AllRegions {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/region/:type/:id"
          component={Region}
        />

        {/* Maps */}
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/maps/root"
          render={(props) => (
            <MapsRoot {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/maps/explore"
          render={(props) => <Maps {...props} setUserToken={setUserToken} />}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/maps/daily_status"
          render={(props) => (
            <DailyStatus {...props} setUserToken={setUserToken} />
          )}
        />

        {/* Site Administration */}
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/site_administration/all_users"
          render={(props) => (
            <AllUsers {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/site_administration/user/:id"
          component={User}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/site_administration/user_permissions"
          render={(props) => (
            <UserPermissions {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/site_administration/nas_folders"
          render={(props) => (
            <NasFolders {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/site_administration/root"
          render={(props) => (
            <SiteAdministrationRoot {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/site_administration/access_history"
          render={(props) => (
            <AccessHistory {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/site_administration/logs"
          render={(props) => <Logs {...props} setUserToken={setUserToken} />}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/site_administration/conflicts"
          render={(props) => (
            <Conflicts {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/site_administration/incomplete_data"
          render={(props) => (
            <IncompleteData {...props} setUserToken={setUserToken} />
          )}
        />

        {/* Financial */}
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/financial/root"
          render={(props) => (
            <FinancialRoot {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/financial/all_payments"
          render={(props) => (
            <Payments {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/financial/all_deposits"
          render={(props) => (
            <Deposits {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/financial/payment_orders"
          render={(props) => (
            <PaymentOrders {...props} setUserToken={setUserToken} />
          )}
        />

        {/* Mass Mailing */}
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/maps/explore/"
          render={(props) => (
            <Maps {...props} setUserToken={setUserToken} />
          )}
        />

        {/* 404 ( Has to be last ) */}
        <Route path="" component={FourOFour} />
      </Switch>
    </Router>
  );
}

export default App;
