// Built-ins
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useState } from "react";

// Core
import Home from "./components/core/home/home";
import About from "./components/core/about/about";
import Terms from "./components/core/terms/terms";
import Help from "./components/core/help/help";
import FourOFour from "./components/core/404/404";
import UnderConstruction from "./components/core/under_construction/under_construction";
import Login from "./components/core/login/login";
import DataManagementRoot from "./components/data_management/data_management_root/data_management_root";
import Clients from "./components/data_management/clients/clients";
import ClientDetail from "./components/data_management/clients/client_detail";
import InsuranceCarriers from "./components/data_management/insurance_carriers/insurance_carriers";
import InsuranceCarrierDetail from "./components/data_management/insurance_carriers/insurance_carrier_detail";
import ProjectCategories from "./components/data_management/project_categories/project_categories";
import ProjectCategoryDetail from "./components/data_management/project_categories/project_category_detail";
import TaskCategories from "./components/data_management/task_categories/task_categories";
import TaskCategoryDetail from "./components/data_management/task_categories/task_category_detail";
import Professions from "./components/data_management/professions/professions";
import ProfessionDetail from "./components/data_management/professions/profession_detail";
import Banks from "./components/data_management/banks/banks";
import BankDetail from "./components/data_management/banks/bank_detail";
import Consultants from "./components/data_management/consultants/consultants";
import ConsultantDetail from "./components/data_management/consultants/consultant_detail";
import Projects from "./components/data_management/projects/projects";
import ProjectDetail from "./components/data_management/projects/project_detail";
import ProjectTasks from "./components/data_management/project_tasks/project_tasks";
import ProjectTaskDetail from "./components/data_management/project_tasks/project_task_detail";
import BankClientAccounts from "./components/data_management/bank_client_accounts/bank_client_accounts";
import BankClientAccountDetail from "./components/data_management/bank_client_accounts/bank_client_account_detail";
import Documents from "./components/data_management/documents/documents";
import DocumentDetail from "./components/data_management/documents/document_detail";
import Properties from "./components/data_management/properties/properties";
import PropertyDetail from "./components/data_management/properties/property_detail";
import Cash from "./components/data_management/cash/cash";
import CashDetail from "./components/data_management/cash/cash_detail";
import ClientContacts from "./components/data_management/client_contacts/client_contacts";
import ClientContactDetail from "./components/data_management/client_contacts/client_contact_detail";
import Professionals from "./components/data_management/professionals/professionals";
import ProfessionalDetail from "./components/data_management/professionals/professional_detail";
import TaskComments from "./components/data_management/task_comments/task_comments";
import TaskCommentDetail from "./components/data_management/task_comments/task_comment_detail";
import TaxationProjects from "./components/data_management/taxation_projects/taxation_projects";
import TaxationProjectDetail from "./components/data_management/taxation_projects/taxation_project_detail";
import RegionRoot from "./components/regions/region_root/region_root";
import AdministrationRoot from "./components/administration/administration_root/administration_root";
import ReportsRoot from "./components/reports/reports_root/reports_root";
import Dashboard from "./components/dashboard/Dashboard";

import ProtectedRoute from "./components/core/router/protected_route";


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
          path="/dashboard"
          render={(props) => <Dashboard {...props} setUserToken={setUserToken} />}
        />
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
          path="/help"
          render={(props) => <Help {...props} setUserToken={setUserToken} />}
        />

        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/under_construction"
          render={(props) => (
            <UnderConstruction {...props} setUserToken={setUserToken} />
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
          path="/data_management/clients"
          render={(props) => (
            <Clients {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/clients/:id"
          render={(props) => (
            <ClientDetail {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/insurance_carriers"
          render={(props) => (
            <InsuranceCarriers {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/insurance_carriers/:id"
          render={(props) => (
            <InsuranceCarrierDetail {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/project_categories"
          render={(props) => (
            <ProjectCategories {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/project_categories/:id"
          render={(props) => (
            <ProjectCategoryDetail {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/task_categories"
          render={(props) => (
            <TaskCategories {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/task_categories/:id"
          render={(props) => (
            <TaskCategoryDetail {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/professions"
          render={(props) => (
            <Professions {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/professions/:id"
          render={(props) => (
            <ProfessionDetail {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/banks"
          render={(props) => (
            <Banks {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/banks/:id"
          render={(props) => (
            <BankDetail {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/consultants"
          render={(props) => (
            <Consultants {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/consultants/:id"
          render={(props) => (
            <ConsultantDetail {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/projects"
          render={(props) => (
            <Projects {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/projects/:id"
          render={(props) => (
            <ProjectDetail {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/project_tasks"
          render={(props) => (
            <ProjectTasks {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/project_tasks/:id"
          render={(props) => (
            <ProjectTaskDetail {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/bank_client_accounts"
          render={(props) => (
            <BankClientAccounts {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/bank_client_accounts/:id"
          render={(props) => (
            <BankClientAccountDetail {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/documents"
          render={(props) => (
            <Documents {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/documents/:id"
          render={(props) => (
            <DocumentDetail {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/properties"
          render={(props) => (
            <Properties {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/properties/:id"
          render={(props) => (
            <PropertyDetail {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/cash"
          render={(props) => (
            <Cash {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/cash/:id"
          render={(props) => (
            <CashDetail {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/client_contacts"
          render={(props) => (
            <ClientContacts {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/client_contacts/:id"
          render={(props) => (
            <ClientContactDetail {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/professionals"
          render={(props) => (
            <Professionals {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/professionals/:id"
          render={(props) => (
            <ProfessionalDetail {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/task_comments"
          render={(props) => (
            <TaskComments {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/task_comments/:id"
          render={(props) => (
            <TaskCommentDetail {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/taxation_projects"
          render={(props) => (
            <TaxationProjects {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/data_management/taxation_projects/:id"
          render={(props) => (
            <TaxationProjectDetail {...props} setUserToken={setUserToken} />
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
          path="/reports/root"
          render={(props) => (
            <ReportsRoot {...props} setUserToken={setUserToken} />
          )}
        />

        <ProtectedRoute

          isLoggedIn={!!userToken}
          exact={true}
          path="/administration/root"
          render={(props) => (
            <AdministrationRoot {...props} setUserToken={setUserToken} />
          )}
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
