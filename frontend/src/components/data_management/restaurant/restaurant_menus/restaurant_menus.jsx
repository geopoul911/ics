// Built-ins
import React from "react";

// Modules / Functions
import { Table } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import { Grid } from "semantic-ui-react";
import Swal from "sweetalert2";

// Custom Made Components
import AddMenuModal from "../../../modals/create/add_restaurant_menu_modal";
import DeleteRestaurantMenu from "../../../modals/restaurants/delete_restaurant_menu";

import ChangeDescription from "../../../modals/restaurants/change_menu_description";
import ChangePrice from "../../../modals/restaurants/change_menu_price";

// Global Variables
import {
  headers,
  loader,
  pageHeader,
  forbidden,
  restrictedUsers,
} from "../../../global_vars";

// Icons / Images
import { BsCloudDownload } from "react-icons/bs";

// Variables
window.Swal = Swal;
const VIEW_RESTAURANT = "http://localhost:8000/api/data_management/restaurant/";
const DOWNLOAD_RESTAURANT_MENU =
  "http://localhost:8000/api/data_management/download_restaurant_menu/";

// can achieve it with less lines
function renderSize(size) {
  if (size > 1024 * 1024) {
    return (size / 1024 / 1024).toFixed(2) + " MB";
  } else if (size > 1024) {
    return (size / 1024).toFixed(2) + " KB";
  } else {
    return size + " B";
  }
}

function getRestaurantId() {
  return window.location.pathname.split("/")[3];
}

let currenciesToSymbols = {
  "EUR": "€",
  "GBP": "£",
  "USD": "$",
  "CAD": "$",
  "AUD": "$",
  "CHF": "₣",
  "JPY": "¥",
  "NZD": "$",
  "CNY": "¥",
  "SGD": "$",
}

// Restaurant overview page Class
class RestaurantOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurant: {
        notes: [],
      },
      is_loaded: false,
      forbidden: false,
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
      .get(VIEW_RESTAURANT + getRestaurantId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          restaurant: res.data.restaurant,
          notes: res.data.restaurant.notes,
          contact_persons: res.data.restaurant.contact_persons,
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

  update_state = (update_state) => {
    this.setState({ restaurant: update_state });
  };

  downloadRestaurantMenu = (fileName, menu_id) => {
    axios
      .get(DOWNLOAD_RESTAURANT_MENU + window.location.pathname.split("/")[3], {
        headers: headers,
        params: {
          menu_id: menu_id,
          file: fileName,
        },
      })
      .then((res) => {
        window.open(
          DOWNLOAD_RESTAURANT_MENU +
            window.location.pathname.split("/")[3] +
            "?file=" +
            fileName
        );
      });
  };

  render() {

    return (
      <>
        <div className="mainContainer">
          {pageHeader("restaurant_menus", this.state.restaurant.name)}
          {this.state.forbidden ? (
            <>{forbidden("Restaurant Menus")}</>
          ) : this.state.is_loaded ? (
            <>
              <Grid stackable divided>
                <Grid.Row style={{ margin: 20 }}>
                  <Grid.Column>
                    <Table striped hover id="restaurant_menu_table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>File Name</th>
                          <th>Description</th>
                          <th>Price Per Person</th>
                          <th>Uploaded by</th>
                          <th>Uploaded at</th>
                          <th>Size</th>
                          <th>Download</th>
                          <th>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.restaurant.restaurant_menu.length > 0
                          ? this.state.restaurant.restaurant_menu.map((e, j) =>
                              !e.file ? (
                                <>
                                  <tr>
                                    <td>{j + 1}</td>
                                    <td>-</td>
                                    <td>
                                      {e.description}
                                      <ChangeDescription object_id={e.id} update_state={this.update_state} description={e.description} />
                                    </td>
                                    <td>
                                      {e.currency ? currenciesToSymbols[e.currency] : ''} {e.price_per_person}
                                      <ChangePrice object_id={e.id} update_state={this.update_state} price={e.price} />
                                    </td>
                                    <td>-</td>
                                    <td>{moment(e.date_created).format("MMMM Do YYYY, h:mm:ss a")}</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>
                                      <DeleteRestaurantMenu
                                        id="delete_doc_modal"
                                        restaurant_id={this.state.restaurant.id}
                                        menu_id={e.id}
                                        update_state={this.update_state}
                                      />
                                    </td>
                                  </tr>
                                </>
                              ) : (
                                <tr>
                                  <td>{j + 1}</td>
                                  <td>{e.file.name}</td>
                                  <td>{e.description}</td>
                                  <td>{e.price_per_person}</td>
                                  <td>
                                    <a
                                      href={
                                        "/site_administration/user/" +
                                        e.file.uploader.id
                                      }
                                      basic
                                      id="cell_link"
                                    >
                                      {e.file.uploader.username}
                                    </a>
                                  </td>
                                  <td>
                                    {moment(e.file.updated_at).format(
                                      "MMMM Do YYYY, h:mm:ss a"
                                    )}
                                  </td>
                                  <td>{renderSize(e.file.size)}</td>
                                  <td>
                                    <BsCloudDownload
                                      id="download_group_doc_icon"
                                      onClick={() => {
                                        this.downloadRestaurantMenu(
                                          e.file.name,
                                          e.id
                                        );
                                      }}
                                      style={{
                                        color: "#F3702D",
                                        fontSize: "1.5em",
                                        marginRight: "0.5em",
                                      }}
                                    />
                                  </td>
                                  <td>
                                    <DeleteRestaurantMenu
                                      id="delete_doc_modal"
                                      restaurant_id={this.state.restaurant.id}
                                      menu_id={e.id}
                                      document_id={e.file.id}
                                      document_name={e.file.name}
                                      update_state={this.update_state}
                                    />
                                  </td>
                                </tr>
                              )
                            )
                          : ""}
                      </tbody>
                    </Table>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <AddMenuModal
                restaurant_id={this.state.restaurant.id}
                update_state={this.update_state}
              />
            </>
          ) : (
            loader()
          )}
        </div>
      </>
    );
  }
}

export default RestaurantOverView;
