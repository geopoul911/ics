// Modules / Functions
import { Breadcrumb } from "react-bootstrap";


// Icons / Images
import {
  BiHelpCircle,
} from "react-icons/bi";
import {
  AiOutlineLogin,
} from "react-icons/ai";
import { GoLaw } from "react-icons/go";
import {
  MdUpdate,
} from "react-icons/md";
import {
  FaDatabase,
  FaBriefcase,
  FaInfo,
  FaUser,
  FaArrowRight ,
  FaChartLine,
} from "react-icons/fa";
import { FaGlobe } from "react-icons/fa";

export const iconStyle = {
  color: "#2a9fd9",
  fontSize: "1.5em",
  marginRight: "0.5em",
};

// Loader
export const loader = () => {
  return (
    <div className="spinner">
      <span> Loading... </span>
      <div className="half-spinner"></div>
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
  "Authorization": `Token ${localStorage.getItem('userToken')}`,
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
  } else if (value === "country_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaArrowRight style={iconStyle} /> Country Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/regions/root">
              Regions
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  }  else if (value === "city_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaArrowRight style={iconStyle} /> City Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/regions/root">
              Regions
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
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
            <FaBriefcase style={iconStyle} /> All Clients
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
  } else if (value === "all_countries") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaArrowRight style={iconStyle} /> All Countries
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/regions/root">
              Regions
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Countries</Breadcrumb.Item>
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
            <FaArrowRight style={iconStyle} /> Client Overview
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
  } else if (value === "all_client_contacts") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaArrowRight style={iconStyle} /> All Client Contacts
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Client Contacts</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "client_contact_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaArrowRight style={iconStyle} /> Client Contact Overview
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
  } else if (value === "all_bank_client_accounts") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaArrowRight style={iconStyle} /> All Bank Client Accounts
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Bank Client Accounts</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
                } else if (value === "bank_client_account_overview") {
                return (
                  <>
                    <div className="page_header">
                      <h2>
                        <FaArrowRight style={iconStyle} /> Bank Client Account Overview
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
              } else if (value === "all_projects") {
                return (
                  <>
                    <div className="page_header">
                      <h2>
                        <FaArrowRight style={iconStyle} /> All Projects
                      </h2>
                      <Breadcrumb>
                        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item href="/data_management/root">
                          Data Management
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active>All Projects</Breadcrumb.Item>
                      </Breadcrumb>
                    </div>
                    <hr />
                  </>
                );
              } else if (value === "project_overview") {
                return (
                  <>
                    <div className="page_header">
                      <h2>
                        <FaArrowRight style={iconStyle} /> Project Overview
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
              } else if (value === "all_associated_clients") {
                return (
                  <>
                    <div className="page_header">
                      <h2>
                        <FaArrowRight style={iconStyle} /> All Associated Clients
                      </h2>
                      <Breadcrumb>
                        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item href="/data_management/root">
                          Data Management
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active>Associated Clients</Breadcrumb.Item>
                      </Breadcrumb>
                    </div>
                    <hr />
                  </>
                );
              } else if (value === "associated_client_overview") {
                return (
                  <>
                    <div className="page_header">
                      <h2>
                        <FaArrowRight style={iconStyle} /> Associated Client Overview
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
              } else if (value === "all_task_comments") {
                return (
                  <>
                    <div className="page_header">
                      <h2>
                        <FaArrowRight style={iconStyle} /> All Task Comments
                      </h2>
                      <Breadcrumb>
                        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item href="/data_management/root">
                          Data Management
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active>Task Comments</Breadcrumb.Item>
                      </Breadcrumb>
                    </div>
                    <hr />
                  </>
                );
              } else if (value === "all_project_tasks") {
                return (
                  <>
                    <div className="page_header">
                      <h2>
                        <FaArrowRight style={iconStyle} /> All Project Tasks
                      </h2>
                      <Breadcrumb>
                        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item href="/data_management/root">
                          Data Management
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active>Project Tasks</Breadcrumb.Item>
                      </Breadcrumb>
                    </div>
                    <hr />
                  </>
                );
              } else if (value === "task_comment_overview") {
                return (
                  <>
                    <div className="page_header">
                      <h2>
                        <FaArrowRight style={iconStyle} /> Task Comment Overview
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
              } else if (value === "all_cities") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaArrowRight style={iconStyle} /> All Cities
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/regions/root">
              Regions
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Cities</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "city_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaArrowRight style={iconStyle} /> City Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/regions/root">
              Regions
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_provinces") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaArrowRight style={iconStyle} /> All Provinces
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/regions/root">
              Regions
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Provinces</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "province_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaArrowRight style={iconStyle} /> Province Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/regions/root">
              Regions
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
  } else if (value === "region_root") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaGlobe style={iconStyle} /> Regions
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active> Regions </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
    } else if (value === "administration_root") {
      return (
        <>
          <div className="page_header">
            <h2>
              <FaUser style={iconStyle} /> Administration
            </h2>
            <Breadcrumb>
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active> Administration </Breadcrumb.Item>
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
              <FaChartLine style={iconStyle} /> Reports
            </h2>
            <Breadcrumb>
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active> Reports </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <hr />
        </>
      );
  } else if (value === "all_consultants") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaArrowRight style={iconStyle} /> All Consultants
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/administration/root">
              Administration
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Consultants</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  }  else if (value === "consultant_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaArrowRight style={iconStyle} /> Consultant Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/administration/root">
              Administration
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_banks") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaArrowRight style={iconStyle} /> All Banks
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/administration/root">
              Administration
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Banks</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "bank_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaArrowRight style={iconStyle} /> Bank Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/administration/root">
              Administration
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_insurance_carriers") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaArrowRight style={iconStyle} /> All Insurance Carriers
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/administration/root">
              Administration
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Insurance Carriers</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "insurance_carrier_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaArrowRight style={iconStyle} /> Insurance Carrier Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/administration/root">
              Administration
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_professions") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaArrowRight style={iconStyle} /> All Professions
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/administration/root">
              Administration
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Professions</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "profession_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaArrowRight style={iconStyle} /> Profession Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/administration/root">
              Administration
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_project_categories") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaArrowRight style={iconStyle} /> All Project Categories
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/administration/root">
              Administration
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Project Categories</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "project_category_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaArrowRight style={iconStyle} /> Project Category Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/administration/root">
              Administration
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_task_categories") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaArrowRight style={iconStyle} /> All Task Categories
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/administration/root">
              Administration
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Task Categories</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "task_category_overview") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaArrowRight style={iconStyle} /> Task Category Overview
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/administration/root">
              Administration
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview of {objName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "all_documents") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaArrowRight style={iconStyle} /> All Documents
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/administration/root">
              Administration
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Documents</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "documents") {
    return (
      <>
        <div className="page_header">
          <h2>
            <FaArrowRight style={iconStyle} /> All Documents
          </h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/data_management/root">
              Data Management
            </Breadcrumb.Item>
            <Breadcrumb.Item active>All Documents</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr />
      </>
    );
  } else if (value === "documents") {
           return (
             <>
               <div className="page_header">
                 <h2>
                   <FaArrowRight style={iconStyle} /> All Documents
                 </h2>
                 <Breadcrumb>
                   <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                   <Breadcrumb.Item href="/data_management/root">
                     Data Management
                   </Breadcrumb.Item>
                   <Breadcrumb.Item active>All Documents</Breadcrumb.Item>
                 </Breadcrumb>
               </div>
               <hr />
             </>
           );
         } else if (value === "document_overview") {
           return (
             <>
               <div className="page_header">
                 <h2>
                   <FaArrowRight style={iconStyle} /> Document Overview
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
         } else if (value === "cash_overview") {
           return (
             <>
               <div className="page_header">
                 <h2>
                   <FaArrowRight style={iconStyle} /> Cash Overview
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
         else if (value === "all_cash") {
           return (
             <>
               <div className="page_header">
                 <h2>
                   <FaArrowRight style={iconStyle} /> All Cash
                 </h2>
                 <Breadcrumb>
                   <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                   <Breadcrumb.Item href="/data_management/root">
                     Data Management
                   </Breadcrumb.Item>
                   <Breadcrumb.Item active>All Cash</Breadcrumb.Item>
                 </Breadcrumb>
               </div>
               <hr />
             </>
           );
         }
         else if (value === "bank_project_account_overview") {
           return (
             <>
               <div className="page_header">
                 <h2>
                   <FaArrowRight style={iconStyle} /> Bank Project Account Overview {objName} 
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
         else if (value === "all_bank_project_accounts") {  
           return (
             <>
               <div className="page_header">
                 <h2>
                   <FaArrowRight style={iconStyle} /> All Bank Project Accounts
                 </h2>
                 <Breadcrumb>
                   <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                   <Breadcrumb.Item href="/data_management/root">
                     Data Management
                   </Breadcrumb.Item>
                   <Breadcrumb.Item active>All Bank Project Accounts</Breadcrumb.Item>
                 </Breadcrumb>
               </div>
               <hr />
             </>
           );
         }
         else if (value === "all_properties") {
           return (
             <>
               <div className="page_header">
                 <h2>
                   <FaArrowRight style={iconStyle} /> All Properties
                 </h2>
                 <Breadcrumb>
                   <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                   <Breadcrumb.Item href="/data_management/root">
                     Data Management
                   </Breadcrumb.Item>
                   <Breadcrumb.Item active>All Properties</Breadcrumb.Item>
                 </Breadcrumb>
               </div>
               <hr />
             </>
           );
         } else if (value === "all_taxation_projects") {
           return (
             <>
               <div className="page_header">
                 <h2>
                   <FaArrowRight style={iconStyle} /> All Taxation Projects
                 </h2>
                 <Breadcrumb>
                   <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                   <Breadcrumb.Item href="/data_management/root">
                     Data Management
                   </Breadcrumb.Item>
                   <Breadcrumb.Item active>All Taxation Projects</Breadcrumb.Item>
                 </Breadcrumb>
               </div>
               <hr />
             </>
           );
         }
         else if (value === "taxation_project_overview") {
           return (
             <>
               <div className="page_header">
                 <h2>
                   <FaArrowRight style={iconStyle} /> Taxation Project Overview
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
         else if (value === "all_professionals") {
           return (
             <>
               <div className="page_header">
                 <h2>
                   <FaArrowRight style={iconStyle} /> All Professionals
                 </h2>
                 <Breadcrumb>
                   <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                   <Breadcrumb.Item href="/data_management/root">
                     Data Management
                   </Breadcrumb.Item>
                   <Breadcrumb.Item active>All Professionals</Breadcrumb.Item>
                 </Breadcrumb>
               </div>
               <hr />
             </>
           );
         }  
         else if (value === "professional_overview") {
           return (
             <>
               <div className="page_header">
                 <h2>
                   <FaArrowRight style={iconStyle} /> Professional Overview
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
         else if (value === "property_overview") {
           return (
             <>
               <div className="page_header">
                 <h2>
                   <FaArrowRight style={iconStyle} /> Property Overview
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
  return <></>;
}
