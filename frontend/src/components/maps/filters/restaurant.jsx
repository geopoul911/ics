// Built-ins
import React from "react";
import { useState } from "react";
import axios from "axios";

// Modules / Functions
import Swal from "sweetalert2";
import Select from "react-select";
import { ListGroup } from "react-bootstrap";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

const GET_RESTAURANT_TYPES =
  "http://localhost:8000/api/view/get_all_restaurant_types/";

const RestaurantFilters = (props) => {
  let [AllRestaurantTypes, setAllRestaurantTypes] = useState([]);

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

  return (
    <ListGroup.Item>
      <label> Types : </label>
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
    </ListGroup.Item>
  );
};

export default RestaurantFilters;
