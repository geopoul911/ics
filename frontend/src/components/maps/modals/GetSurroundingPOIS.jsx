// Built-ins
import React from "react";
import { useState } from "react";

// Functions / Modules
import axios from "axios";

// Icons / Images
import {
  FaHotel,
  FaScrewdriver,
  FaTheaterMasks,
  FaParking,
} from "react-icons/fa";
import { BiRestaurant, BiFootball, BiTransfer } from "react-icons/bi";
import { ListGroup, Form } from "react-bootstrap";
import { WiTrain } from "react-icons/wi";
import { MdSupportAgent } from "react-icons/md";
import { GiEarthAmerica, GiBattleship, GiShipWheel } from "react-icons/gi";

// Modules / Functions
import { Button, Modal } from "semantic-ui-react";
import Swal from "sweetalert2";
import Select from "react-select";

// CSS
import "../../global.css";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

const GET_RESTAURANT_TYPES =
  "http://localhost:8000/api/view/get_all_restaurant_types/";
const GET_REPAIR_SHOP_TYPES =
  "http://localhost:8000/api/view/get_all_repair_shop_types/";

let icon_style = { color: "#F3702D", fontSize: "1.5em", marginRight: 40 };

const GetSurroundingPOIS = (props) => {
  let [AllRestaurantTypes, setAllRestaurantTypes] = useState([]);
  let [AllRepairShopTypes, setAllRepairShopTypes] = useState([]);

  const getRestaurantTypes = () => {
    axios
      .get(GET_RESTAURANT_TYPES, {
        headers: headers,
      })
      .then((res) => {
        setAllRestaurantTypes(res.data.all_restaurant_types);
      });
  };

  AllRestaurantTypes.forEach(function (element) {
    element.value = element.description;
    element.label = element.description;
  });

  const getRepairShopTypes = () => {
    axios
      .get(GET_REPAIR_SHOP_TYPES, {
        headers: headers,
      })
      .then((res) => {
        setAllRepairShopTypes(res.data.all_repair_shop_types);
      });
  };

  AllRepairShopTypes.forEach(function (element) {
    element.value = element.description;
    element.label = element.description;
  });

  return (
    <>
      <Modal
        onClose={() => props.setSurrOpen(false)}
        onOpen={() => props.setSurrOpen(true)}
        open={props.open}
        style={{
          top: "12%",
          left: "25%",
          maxHeight: 500,
          overflow: "visible",
          overflowY: "visible",
        }}
      >
        <Modal.Header>Show Surrouding Points Of Interest</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <ul id="pois_ul">
              <li>
                <Button
                  onClick={(e) => props.setShowing(e.target.value)}
                  value="Coach Operators"
                  color={
                    props.showing === "Coach Operators" ? "violet" : "facebook"
                  }
                >
                  <MdSupportAgent style={icon_style} /> Coach Operators
                </Button>
              </li>
              <li>
                <Button
                  onClick={(e) => props.setShowing(e.target.value)}
                  value="Cruising Companies"
                  color={
                    props.showing === "Cruising Companies"
                      ? "violet"
                      : "facebook"
                  }
                >
                  <GiShipWheel style={icon_style} /> Cruising Companies
                </Button>
              </li>
              <li>
                <Button
                  onClick={(e) => props.setShowing(e.target.value)}
                  value="Ferry Ticket Agencies"
                  color={
                    props.showing === "Ferry Ticket Agencies"
                      ? "violet"
                      : "facebook"
                  }
                >
                  <GiBattleship style={icon_style} /> Ferry Ticket Agencies
                </Button>
              </li>
              <li>
                <Button
                  onClick={(e) => props.setShowing(e.target.value)}
                  value="DMCs"
                  color={props.showing === "DMCs" ? "violet" : "facebook"}
                >
                  <GiEarthAmerica
                    style={{
                      color: "#F3702D",
                      fontSize: "1.7em",
                      marginRight: 40,
                    }}
                  />
                  DMCs
                </Button>
              </li>
              <li>
                <Button
                  onClick={(e) => props.setShowing(e.target.value)}
                  value="Hotels"
                  color={props.showing === "Hotels" ? "violet" : "facebook"}
                >
                  <FaHotel style={icon_style} /> Hotels
                </Button>
              </li>

              <li>
                <Button
                  onClick={(e) => props.setShowing(e.target.value)}
                  value="Parking Lots"
                  color={
                    props.showing === "Parking Lots" ? "violet" : "facebook"
                  }
                >
                  <FaParking style={icon_style} /> Parking Lots
                </Button>
              </li>

              <li>
                <Button
                  onClick={(e) => props.setShowing(e.target.value)}
                  value="Repair Shops"
                  color={props.showing === "Repair Shops" ? "violet" : "facebook"}
                >
                  <FaScrewdriver style={icon_style} /> Repair Shops
                </Button>
              </li>
              <li>
                <Button
                  onClick={(e) => props.setShowing(e.target.value)}
                  value="Restaurants"
                  color={props.showing === "Restaurants" ? "violet" : "facebook"}
                >
                  <BiRestaurant style={icon_style} /> Restaurants
                </Button>
              </li>
              <li>
                <Button
                  onClick={(e) => props.setShowing(e.target.value)}
                  value="Sport Event Suppliers"
                  color={props.showing === "Sport Event Suppliers" ? "violet" : "facebook"}
                >
                  <BiFootball style={icon_style} /> Sport Event Suppliers
                </Button>
              </li>
              <li>
                <Button
                  onClick={(e) => props.setShowing(e.target.value)}
                  value="Teleferik Companies"
                  color={props.showing === "Teleferik Companies" ? "violet" : "facebook"}
                >
                  <BiTransfer style={icon_style} /> Teleferik Companies
                </Button>
              </li>
              <li>
                <Button
                  onClick={(e) => props.setShowing(e.target.value)}
                  value="Theaters"
                  color={props.showing === "Theaters" ? "violet" : "facebook"}
                >
                  <FaTheaterMasks style={icon_style} /> Theaters
                </Button>
              </li>
              <li>
                <Button
                  onClick={(e) => props.setShowing(e.target.value)}
                  value="Train Ticket Agencies"
                  color={props.showing === "Train Ticket Agencies" ? "violet" : "facebook"}
                >
                  <WiTrain style={icon_style} /> Train Ticket Agencies
                </Button>
              </li>
            </ul>
            <hr />
            <ListGroup>
              <label>Set distance radius: </label>
              <Form.Control
                type="range"
                min={1}
                max={500}
                style={{ display: "inline-block", width: 300 }}
                onChange={(e) => {
                  props.setRadius(e.target.value);
                }}
                value={props.radius}
              />
              {props.radius} kilometers
              <hr />
              {props.showing === "Restaurants" ? (
                <>
                  <label> Filter Restaurants By Type :</label>
                  <Form.Label column sm="2">
                    Type:
                  </Form.Label>
                  <Select
                    closeMenuOnSelect={false}
                    onChange={(e) => {
                      props.set_restaurant_types(e);
                    }}
                    onFocus={(e) => {
                      getRestaurantTypes();
                    }}
                    isMulti
                    options={AllRestaurantTypes}
                  />
                </>
              ) : (
                ""
              )}
              {props.showing === "Repair Shops" ? (
                <>
                  <label> Filter Repair Shops By Type :</label>
                  <Form.Label column sm="2">
                    Type:
                  </Form.Label>
                  <Select
                    closeMenuOnSelect={false}
                    onChange={(e) => {
                      props.set_repair_shop_types(e);
                    }}
                    onFocus={(e) => {
                      getRepairShopTypes();
                    }}
                    isMulti
                    options={AllRepairShopTypes}
                  />
                </>
              ) : (
                ""
              )}
            </ListGroup>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button
            onClick={() => {
              props.showNearbyPOIS();
              props.setSurrOpen(false);
            }}
            color="green"
          >
            Show
          </Button>
          <Button onClick={() => props.setSurrOpen(false)} color="red">
            Close
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default GetSurroundingPOIS;
