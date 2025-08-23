// Modules / Functions
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
// Built-ins
import React, { useState } from "react";

// Global Variables
import { headers } from "../../../../global_vars";

const GET_ENTERTAINMENT_SUPPLIER = "http://localhost:8000/api/view/get_entertainment_supplier/";

const AddExtraField = (props) => {

  let [products, setProducts] = useState([]);

  const getEntertainmentSupplier = (es_name) => {
    axios
      .get(GET_ENTERTAINMENT_SUPPLIER + es_name, {
        headers: headers,
      })
      .then((res) => {
        setProducts(res.data.entertainment_supplier.entertainment_supplier_product);
      });
  };

  let result = <></>;

  if (
    props.service_type === "Accommodation" ||
    props.service_type === "Driver Accommodation" ||
    props.service_type === "Tour Leader's Accommodation"
  ) {
    result = (
      <>
        <Autocomplete
          options={props.AllHotels}
          disableClearable
          onChange={(e) => {
            props.setHotel(e.target.innerText);
          }}
          getOptionLabel={(option) => option.name}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Select hotel" variant="outlined" />
          )}
        />
      </>
    );
  } else if (props.service_type === "Hotel Porterage") {
    result = (
      <>
        <Autocomplete
          options={props.AllHotels}
          disableClearable
          onChange={(e) => {
            props.setHotel(e.target.innerText);
          }}
          getOptionLabel={(option) => option.name}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Select Hotel" variant="outlined" />
          )}
        />
      </>
    );
  } else if (
    props.service_type === "Air Ticket" ||
    props.service_type === "Tour Leader's Air Ticket"
  ) {
    result = (
      <>
        <Autocomplete
          options={props.AllAirlines}
          disableClearable
          onChange={(e) => {
            props.setAirline(e.target.innerText);
          }}
          getOptionLabel={(option) => option.name}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Select Airline" variant="outlined" />
          )}
        />
      </>
    );
  } else if (props.service_type === "Airport Porterage") {
    result = (
      <>
        <Autocomplete
          options={props.AllDMCs}
          disableClearable
          onChange={(e) => {
            props.setDMC(e.target.innerText);
          }}
          getOptionLabel={(option) => option.name}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Select DMC" variant="outlined" />
          )}
        />
      </>
    );
  } else if (
    props.service_type === "Coach's Ferry Ticket" ||
    props.service_type === "Ferry Ticket"
  ) {
    result = (
      <>
        <Autocomplete
          options={props.AllFerryTicketAgencies}
          disableClearable
          onChange={(e) => {
            props.setFerryTicketAgency(e.target.innerText);
          }}
          getOptionLabel={(option) => option.name}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Ferry Ticket Agency"
              variant="outlined"
            />
          )}
        />
      </>
    );
  } else if (props.service_type === "Cruise") {
    result = (
      <>
        <Autocomplete
          options={props.AllCruisingCompanies}
          disableClearable
          onChange={(e) => {
            props.setCruisingCompany(e.target.innerText);
          }}
          getOptionLabel={(option) => option.name}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Cruising Company"
              variant="outlined"
            />
          )}
        />
      </>
    );
  } else if (props.service_type === "Local Guide") {
    /* GUIDE */
    result = (
      <>
        <Autocomplete
          options={props.AllGuides}
          disableClearable
          onChange={(e) => {
            props.setGuide(e.target.innerText);
          }}
          getOptionLabel={(option) => option.name}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Select Guide" variant="outlined" />
          )}
        />
      </>
    );
  } else if (props.service_type === "Restaurant") {
    result = (
      <>
        <Autocomplete
          options={props.AllRestaurants}
          disableClearable
          onChange={(e) => {
            props.setRestaurant(e.target.innerText);
          }}
          getOptionLabel={(option) => option.name}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Restaurant"
              variant="outlined"
            />
          )}
        />
      </>
    );
  } else if (props.service_type === "Sport Event") {
    result = (
      <>
        <Autocomplete
          options={props.AllSportEventSuppliers}
          disableClearable
          onChange={(e) => {
            props.setSportEventSupplier(e.target.innerText);
          }}
          getOptionLabel={(option) => option.name}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Sport Event Supplier"
              variant="outlined"
            />
          )}
        />
      </>
    );
  } 
  else if (props.service_type === "Shows & Entertainment") {
    result = (
      <>
        <Autocomplete
          options={props.AllEntertainmentSuppliers}
          disableClearable
          onChange={(e) => {
            props.setEntertainmentSupplier(e.target.innerText);
            getEntertainmentSupplier(e.target.innerText);
          }}
          getOptionLabel={(option) => option.name}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Select Entertainment Supplier" variant="outlined" />
          )}
        />
        <Autocomplete
          options={products}
          disableClearable
          onChange={(e) => {
            props.setProduct(e.target.innerText);
          }}
          getOptionLabel={(option) => option.name}
          style={{ width: 300, marginTop: 10 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Product"
              variant="outlined"
            />
          )}
        />
      </>
    );
  } 
  else if (props.service_type === "Teleferik") {
    result = (
      <>
        <Autocomplete
          options={props.AllTeleferikCompanies}
          disableClearable
          onChange={(e) => {
            props.setTeleferikCompany(e.target.innerText);
          }}
          getOptionLabel={(option) => option.name}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Teleferik Company"
              variant="outlined"
            />
          )}
        />
      </>
    );
  } else if (props.service_type === "Theater") {
    result = (
      <>
        <Autocomplete
          options={props.AllTheaters}
          disableClearable
          onChange={(e) => {
            props.setTheater(e.target.innerText);
          }}
          getOptionLabel={(option) => option.name}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Select Theater" variant="outlined" />
          )}
        />
      </>
    );
  } else if (props.service_type === "Train Ticket") {
    result = (
      <>
        <Autocomplete
          options={props.AllTrainTicketAgencies}
          disableClearable
          onChange={(e) => {
            props.setTrainTicketAgency(e.target.innerText);
          }}
          getOptionLabel={(option) => option.name}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Train Ticket Agency"
              variant="outlined"
            />
          )}
        />
      </>
    );
  } else if (props.service_type === "Tour Leader") {
    result = (
      <>
        <Autocomplete
          options={props.AllTourLeaders}
          disableClearable
          onChange={(e) => {
            props.setTourLeader(e.target.innerText);
          }}
          getOptionLabel={(option) => option.name}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Tour Leader"
              variant="outlined"
            />
          )}
        />
      </>
    );
  } else if (props.service_type === "Transfer") {
    result = (
      <>
        <Autocomplete
          options={props.AllCoachOperators}
          disableClearable
          onChange={(e) => {
            props.setCoachOperator(e.target.innerText);
          }}
          getOptionLabel={(option) => option.name}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Coach Operator"
              variant="outlined"
            />
          )}
        />
      </>
    );
  }
  return result;
};

export default AddExtraField;