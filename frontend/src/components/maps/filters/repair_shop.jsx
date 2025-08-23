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

const GET_REPAIR_SHOP_TYPES =
  "http://localhost:8000/api/view/get_all_repair_shop_types/";

const RepairShopFilters = (props) => {
  let [AllRepairTypes, setAllRepairTypes] = useState([]);

  const getRepairTypes = () => {
    axios
      .get(GET_REPAIR_SHOP_TYPES, {
        headers: headers,
      })
      .then((res) => {
        setAllRepairTypes(res.data.all_repair_shop_types);
      });
  };

  AllRepairTypes.forEach(function (element) {
    element.value = element.description;
    element.label = element.description;
  });

  return (
    <ListGroup.Item>
      <label> Types : </label>
      <Select
        closeMenuOnSelect={false}
        onChange={(e) => {
          props.set_repair_shop_types(e);
        }}
        onFocus={(e) => {
          getRepairTypes();
        }}
        isMulti
        options={AllRepairTypes}
      />
    </ListGroup.Item>
  );
};

export default RepairShopFilters;
