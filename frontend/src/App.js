// Built-ins
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useState } from "react";

// Core
import About from "./components/core/about/about";
import Terms from "./components/core/terms/terms";
import Help from "./components/core/help/help";
import FourOFour from "./components/core/404/404";
import UnderConstruction from "./components/core/under_construction/under_construction";
import Login from "./components/core/login/login";

import ProtectedRoute from "./components/core/router/protected_route";

// Data Management
import DataManagementRoot from "./components/data_management/data_management_root/data_management_root";
import AllDocuments from "./components/data_management/all_documents/all_documents";
import DocumentOverview from "./components/data_management/document/document_overview/document_overview";
import AllClients from "./components/data_management/all_clients/all_clients";
import ClientOverview from "./components/data_management/client/client_overview/client_overview";
import AllClientContacts from "./components/data_management/all_client_contacts/all_client_contacts";
import ClientContactOverview from "./components/data_management/client_contact/client_contact_overview/client_contact_overview";
import AllBankClientAccounts from "./components/data_management/all_bank_client_accounts/all_bank_client_accounts";
import BankClientAccountOverview from "./components/data_management/bank_client_account/bank_client_account_overview/bank_client_account_overview";
import AllProjects from "./components/data_management/all_projects/all_projects";
import ProjectOverview from "./components/data_management/project/project_overview/project_overview";
import AllAssociatedClients from "./components/data_management/all_associated_clients/all_associated_clients";
import AssociatedClientOverview from "./components/data_management/associated_client/associated_client_overview/associated_client_overview";
import AllTaskComments from "./components/data_management/all_task_comments/all_task_comments";
import TaskCommentOverview from "./components/data_management/task_comment/task_comment_overview/task_comment_overview";
import AllProjectTasks from "./components/data_management/all_project_tasks/all_project_tasks";
import ProjectTaskOverview from "./components/data_management/project_task/project_task_overview/project_task_overview";

import AllProperties from "./components/data_management/all_properties/all_properties";
import PropertyOverview from "./components/data_management/property/property_overview/property_overview";
import AllCash from "./components/data_management/all_cash/all_cash";
import CashOverview from "./components/data_management/cash/cash_overview/cash_overview";
import AllBankProjectAccounts from "./components/data_management/all_bank_project_accounts/all_bank_project_accounts";
import BankProjectAccountOverview from "./components/data_management/bank_project_account/bank_project_account_overview";
import AllProfessionals from "./components/data_management/all_professionals/all_professionals";
import ProfessionalOverview from "./components/data_management/professional/professional_overview/professional_overview";
import AllTaxationProjects from "./components/data_management/all_taxation_projects/all_taxation_projects";
import TaxationProjectOverview from "./components/data_management/taxation_project/taxation_project_overview/taxation_project_overview";

// Reports
import ReportsRoot from "./components/reports/reports_root/reports_root";
import Dashboard from "./components/dashboard/Dashboard";

// Administration
import AllConsultants from "./components/administration/all_consultants/all_consultants";
import Consultant from "./components/administration/consultant/consultant";
import AllBanks from "./components/administration/all_banks/all_banks";
import Bank from "./components/administration/bank/bank_overview/bank_overview";
import AllInsuranceCarriersComponent from "./components/administration/all_insurance_carriers/all_insurance_carriers";
import InsuranceCarrier from "./components/administration/insurance_carrier/insurance_carrier_overview/insurance_carrier_overview";
import AllProfessionsComponent from "./components/administration/all_professions/all_professions";
import Profession from "./components/administration/profession/profession_overview/profession_overview";
import AllProjectCategoriesComponent from "./components/administration/all_project_categories/all_project_categories";
import ProjectCategory from "./components/administration/project_category/project_category_overview/project_category_overview";
import AllTaskCategoriesComponent from "./components/administration/all_task_categories/all_task_categories";
import TaskCategoryOverview from "./components/administration/task_category/task_category_overview/task_category_overview";
import AdministrationRoot from "./components/administration/administration_root/administration_root";


// Regions
import RegionRoot from "./components/regions/region_root/region_root";
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
          render={(props) => <Dashboard {...props} setUserToken={setUserToken} />}
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
          path="/administration/all_insurance_carriers"
          render={(props) => (
            <AllInsuranceCarriersComponent {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/administration/insurance_carrier/:id"
          render={(props) => (
            <InsuranceCarrier {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/administration/all_professions"
          render={(props) => (
            <AllProfessionsComponent {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/administration/profession/:id"
          render={(props) => (
            <Profession {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/administration/all_project_categories"
          render={(props) => (
            <AllProjectCategoriesComponent {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/administration/project_category/:id"
          render={(props) => (
            <ProjectCategory {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/administration/all_task_categories"
          render={(props) => (
            <AllTaskCategoriesComponent {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/administration/task_category/:id"
          render={(props) => (
            <TaskCategoryOverview {...props} setUserToken={setUserToken} />
          )}
        />
                 <ProtectedRoute
           isLoggedIn={!!userToken}
           exact={true}
           path="/data_management/all_documents"
           render={(props) => (
             <AllDocuments {...props} setUserToken={setUserToken} />
           )}
         />
         <ProtectedRoute
           isLoggedIn={!!userToken}
           exact={true}
           path="/data_management/document/:id"
           render={(props) => (
             <DocumentOverview {...props} setUserToken={setUserToken} />
           )}
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
           render={(props) => (
             <ClientOverview {...props} setUserToken={setUserToken} />
           )}
         />
         <ProtectedRoute
           isLoggedIn={!!userToken}
           exact={true}
           path="/data_management/all_client_contacts"
           render={(props) => (
             <AllClientContacts {...props} setUserToken={setUserToken} />
           )}
         />
         <ProtectedRoute
           isLoggedIn={!!userToken}
           exact={true}
           path="/data_management/client_contact/:id"
           render={(props) => (
             <ClientContactOverview {...props} setUserToken={setUserToken} />
           )}
         />
         <ProtectedRoute
           isLoggedIn={!!userToken}
           exact={true}
           path="/data_management/all_bank_client_accounts"
           render={(props) => (
             <AllBankClientAccounts {...props} setUserToken={setUserToken} />
           )}
         />
                     <ProtectedRoute
              isLoggedIn={!!userToken}
              exact={true}
              path="/data_management/bank_client_account/:id"
              render={(props) => (
                <BankClientAccountOverview {...props} setUserToken={setUserToken} />
              )}
            />
            <ProtectedRoute
              isLoggedIn={!!userToken}
              exact={true}
              path="/data_management/all_projects"
              render={(props) => (
                <AllProjects {...props} setUserToken={setUserToken} />
              )}
            />
            <ProtectedRoute
              isLoggedIn={!!userToken}
              exact={true}
              path="/data_management/project/:id"
              render={(props) => (
                <ProjectOverview {...props} setUserToken={setUserToken} />
              )}
            />
            <ProtectedRoute
              isLoggedIn={!!userToken}
              exact={true}
              path="/data_management/all_associated_clients"
              render={(props) => (
                <AllAssociatedClients {...props} setUserToken={setUserToken} />
              )}
            />
            <ProtectedRoute
              isLoggedIn={!!userToken}
              exact={true}
              path="/data_management/associated_client/:id"
              render={(props) => (
                <AssociatedClientOverview {...props} setUserToken={setUserToken} />
              )}
            />
            <ProtectedRoute
              isLoggedIn={!!userToken}
              exact={true}
              path="/data_management/all_task_comments"
              render={(props) => (
                <AllTaskComments {...props} setUserToken={setUserToken} />
              )}
            />
            <ProtectedRoute
              isLoggedIn={!!userToken}
              exact={true}
              path="/data_management/all_project_tasks"
              render={(props) => (
                <AllProjectTasks {...props} setUserToken={setUserToken} />
              )}
            />
            <ProtectedRoute
              isLoggedIn={!!userToken}
              exact={true}
              path="/data_management/project_task/:id"
              render={(props) => (
                <ProjectTaskOverview {...props} setUserToken={setUserToken} />
              )}
            />
            <ProtectedRoute
              isLoggedIn={!!userToken}
              exact={true}
              path="/data_management/task_comment/:id"
              render={(props) => (
                <TaskCommentOverview {...props} setUserToken={setUserToken} />
              )}
            />
            <ProtectedRoute
              isLoggedIn={!!userToken}
              exact={true}
              path="/data_management/all_properties"
              render={(props) => (
                <AllProperties {...props} setUserToken={setUserToken} />
              )}
            />
            <ProtectedRoute
              isLoggedIn={!!userToken}
              exact={true}
              path="/data_management/property/:id"
              render={(props) => (
                <PropertyOverview {...props} setUserToken={setUserToken} />
              )}
            />
            <ProtectedRoute
              isLoggedIn={!!userToken}
              exact={true}
              path="/data_management/all_cash"
              render={(props) => (
                <AllCash {...props} setUserToken={setUserToken} />
              )}
            />
            <ProtectedRoute
              isLoggedIn={!!userToken}
              exact={true}
              path="/data_management/cash/:id"
              render={(props) => (
                <CashOverview {...props} setUserToken={setUserToken} />
              )}
            />
            <ProtectedRoute
              isLoggedIn={!!userToken}
              exact={true}
              path="/data_management/all_bank_project_accounts"
              render={(props) => (
                <AllBankProjectAccounts {...props} setUserToken={setUserToken} />
              )}
            />
            <ProtectedRoute
              isLoggedIn={!!userToken}
              exact={true}
              path="/data_management/bank_project_account/:id"
              render={(props) => (
                <BankProjectAccountOverview {...props} setUserToken={setUserToken} />
              )}
            />
            <ProtectedRoute
              isLoggedIn={!!userToken}
              exact={true}
              path="/data_management/all_professionals"
              render={(props) => (
                <AllProfessionals {...props} setUserToken={setUserToken} />
              )}
            />
            <ProtectedRoute
              isLoggedIn={!!userToken}
              exact={true}
              path="/data_management/professional/:id"
              render={(props) => (
                <ProfessionalOverview {...props} setUserToken={setUserToken} />
              )}
            />
            <ProtectedRoute
              isLoggedIn={!!userToken}
              exact={true}
              path="/data_management/all_taxation_projects"
              render={(props) => (
                <AllTaxationProjects {...props} setUserToken={setUserToken} />
              )}
            />
            <ProtectedRoute
              isLoggedIn={!!userToken}
              exact={true}
              path="/data_management/taxation_project/:id"
              render={(props) => (
                <TaxationProjectOverview {...props} setUserToken={setUserToken} />
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

        {/* Administration */}
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/administration/all_consultants"
          render={(props) => (
            <AllConsultants {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/administration/consultant/:id"
          component={Consultant}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/administration/all_banks"
          render={(props) => (
            <AllBanks {...props} setUserToken={setUserToken} />
          )}
        />
        <ProtectedRoute
          isLoggedIn={!!userToken}
          exact={true}
          path="/administration/bank/:id"
          component={Bank}
        />

        {/* 404 ( Has to be last ) */}
        <Route path="" component={FourOFour} />
      </Switch>
    </Router>
  );
}

export default App;
