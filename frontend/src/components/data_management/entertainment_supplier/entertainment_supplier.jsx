// Built-ins
import React from "react";

// Modules
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// CSS
import "react-tabs/style/react-tabs.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import EntertainmentSupplierOverView from "./entertainment_supplier_overview/entertainment_supplier_overview";
import EntertainmentProducts from "./entertainment_supplier_products/entertainment_supplier_products";
import EntertainmentSupplierGroups from "./entertainment_supplier_groups/entertainment_supplier_groups";
import Gallery from "../../core/gallery/gallery";
import Documents from "../../core/documents/documents";

// Global Variables
import {
  headers,
  restrictedUsers,
} from "../../global_vars";

import axios from "axios";
import Swal from "sweetalert2";

// Variables
window.Swal = Swal;

function getEntertainmentSupplierId() {
  return window.location.pathname.split("/")[3];
}


// Variables
const VIEW_ENTERTAINMENT_SUPPLIER = "http://localhost:8000/api/data_management/entertainment_supplier/";


// entertainment_supplier page Class
class EntertainmentSupplier extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entertainment_supplier: {},
      is_loaded: false,
    };
  }

  componentDidMount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_ENTERTAINMENT_SUPPLIER + getEntertainmentSupplierId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          entertainment_supplier: res.data.entertainment_supplier,
          is_loaded: true,
        });
      })
      .catch((e) => {
        if (e.response.status === 401) {
          this.setState({
            forbidden: true,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An unknown error has occured.",
          });
        }
      });
  }

  update_state = () => {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_ENTERTAINMENT_SUPPLIER + getEntertainmentSupplierId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          entertainment_supplier: res.data.entertainment_supplier,
          is_loaded: true,
        });
      })
      .catch((e) => {
        if (e.response.status === 401) {
          this.setState({
            forbidden: true,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An unknown error has occured.",
          });
        }
      });
  };


  render() {
    return (
      <div>
        <NavigationBar />
        <Tabs>
          <TabList>
            <Tab>Overview</Tab>
            <Tab>Gallery</Tab>
            <Tab>Products</Tab>
            <Tab>Documents</Tab>
            <Tab>Groups</Tab>
          </TabList>
          <TabPanel>
            <EntertainmentSupplierOverView />
          </TabPanel>
          <TabPanel>
            <Gallery
              object={this.state.entertainment_supplier}
              object_type={"Entertainment Supplier"}
            />
          </TabPanel>
          <TabPanel>
            <EntertainmentProducts />
          </TabPanel>
          <TabPanel>
            <Documents object={this.state.entertainment_supplier} is_loaded={this.state.is_loaded} object_type={"EntertainmentSupplier"} update_state={this.update_state} />
          </TabPanel>
          <TabPanel>
            <EntertainmentSupplierGroups />
          </TabPanel>
        </Tabs>
        <Footer />
      </div>
    );
  }
}

export default EntertainmentSupplier;
