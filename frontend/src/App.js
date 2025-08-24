// Built-ins
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useState } from "react";

// Core
import Home from "./components/core/home/home";
import About from "./components/core/about/about";
import Terms from "./components/core/terms/terms";
import Updates from "./components/core/updates/updates";
import Help from "./components/core/help/help";
import StaffDox from "./components/core/staff_dox/staff_dox";
import DevDox from "./components/core/dev_dox/dev_dox";
import FourOFour from "./components/core/404/404";
import UnderConstruction from "./components/core/under_construction/under_construction";
import Login from "./components/core/login/login";
import SiteAdministrationRoot from "./components/site_administration/site_administration_root/site_administration_root";
import DataManagementRoot from "./components/data_management/data_management_root/data_management_root";
import RegionRoot from "./components/regions/region_root/region_root";

import ProtectedRoute from "./components/core/router/protected_route";

// Site Administration
import AccessHistory from "./components/site_administration/access_history/access_history";
import Logs from "./components/site_administration/logs/logs";
import AllUsers from "./components/site_administration/all_users/all_users";
import User from "./components/site_administration/user/user";

// Regions
import AllCountries from "./components/regions/all_countries/all_countries";
import Country from "./components/regions/country/country";
import AllProvinces from "./components/regions/all_provinces/all_provinces";
import Province from "./components/regions/province/province";
import AllCities from "./components/regions/all_cities/all_cities";
import City from "./components/regions/city/city";

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
          path="/under_construction"
          render={(props) => (
            <UnderConstruction {...props} setUserToken={setUserToken} />
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
          path="/site_administration/root"
          render={(props) => (
            <SiteAdministrationRoot {...props} setUserToken={setUserToken} />
          )}
        />
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
          path="/regions/root"
          render={(props) => (
            <RegionRoot {...props} setUserToken={setUserToken} />
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



        {/* Regions */}
         <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/regions/all_countries"
          render={(props) => (
            <AllCountries {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/regions/country/:id"
          component={Country}
        />
        
        
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/regions/all_provinces"
          render={(props) => (
            <AllProvinces {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/regions/province/:id"
          component={Province}
        />


        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/regions/all_cities"
          render={(props) => (
            <AllCities {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/regions/city/:id"
          component={City}
        />


        {/* 404 ( Has to be last ) */}
        <Route path="" component={FourOFour} />
      </Switch>
    </Router>
  );
}

export default App;
