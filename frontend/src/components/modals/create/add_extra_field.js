// Modules / Functions
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

// Variables
export const AddExtraField = (props) => {
  let result = <></>;

  /* HOTEL */
  if (
    props.service_type === "Accomodation" ||
    props.service_type === "Driver Accomodation" ||
    props.service_type === "Tour Leader's Accomodation"
  ) {
    result = (
      <>
        <label style={{ minHeight: 45, paddingTop: 15 }}>Select Hotel</label>
        <Autocomplete
          options={props.AllHotels}
          className="add_service_input"
          onChange={(e) => {
            props.setHotel(e.target.innerText);
          }}
          getOptionLabel={(option) => option.name}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Select hotel" variant="outlined" />
          )}
        />
        <hr />

        {props.hotel !== "" && props.hotel !== undefined ? (
          <>
            <label style={{ paddingTop: 5 }}> Single : </label>
            <input
              type="number"
              value={props.single}
              onInput={(e) => {
                e.target.value = Math.max(0, parseInt(e.target.value))
                  .toString()
                  .slice(0, 3);
              }}
              className="form-control add_service_input"
              onChange={(e) => props.setSingle(e.currentTarget.value)}
            ></input>
            <hr />
            <label style={{ paddingTop: 5 }}> Double : </label>
            <input
              type="number"
              value={props.double}
              onInput={(e) => {
                e.target.value = Math.max(0, parseInt(e.target.value))
                  .toString()
                  .slice(0, 3);
              }}
              className="form-control add_service_input"
              onChange={(e) => props.setDouble(e.currentTarget.value)}
            ></input>
            <hr />
            <label style={{ paddingTop: 5 }}> Twin : </label>
            <input
              type="number"
              value={props.twin}
              onInput={(e) => {
                e.target.value = Math.max(0, parseInt(e.target.value))
                  .toString()
                  .slice(0, 3);
              }}
              className="form-control add_service_input"
              onChange={(e) => props.setTwin(e.currentTarget.value)}
            ></input>
            <hr />
            <label style={{ paddingTop: 5 }}> Triple : </label>
            <input
              type="number"
              value={props.triple}
              onInput={(e) => {
                e.target.value = Math.max(0, parseInt(e.target.value))
                  .toString()
                  .slice(0, 3);
              }}
              className="form-control add_service_input"
              onChange={(e) => props.setTriple(e.currentTarget.value)}
            ></input>
            <hr />
            <label style={{ paddingTop: 5 }}> Quadrable : </label>
            <input
              type="number"
              value={props.quadrable}
              onInput={(e) => {
                e.target.value = Math.max(0, parseInt(e.target.value))
                  .toString()
                  .slice(0, 3);
              }}
              className="form-control add_service_input"
              onChange={(e) => props.setQuadrable(e.currentTarget.value)}
            ></input>
            <hr />
            <label> Select Meal Description </label>
            <select
              required
              className="form-control add_service_input"
              id="officeSelect"
              onChange={(e) => props.setMealDescription(e.currentTarget.value)}
            >
              <option selected disabled>
                Choose one
              </option>
              <option value="BB"> Breakfast Board </option>
              <option value="HB"> Half Board </option>
              <option value="FB"> Full Board </option>
              <option value="RO"> Room Only </option>
            </select>
            <hr />
          </>
        ) : (
          ""
        )}
      </>
    );
  } else if (props.service_type === "Hotel Porterage") {
    result = (
      <>
        <label style={{ minHeight: 45, paddingTop: 15 }}> Select Hotel </label>
        <Autocomplete
          options={props.AllHotels}
          className="add_service_input"
          onChange={(e) => {
            props.setHotel(e.target.innerText);
          }}
          getOptionLabel={(option) => option.name}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Select Hotel" variant="outlined" />
          )}
        />
        <hr />
      </>
    );
  } else if (
    /* AIRLINE */
    props.service_type === "Air Ticket" ||
    props.service_type === "Tour Leader's Air Ticket"
  ) {
    result = (
      <>
        <label style={{ minHeight: 45, paddingTop: 15 }}>Select Airline</label>
        <Autocomplete
          options={props.AllAirlines}
          className="add_service_input"
          onChange={(e) => {
            props.setAirline(e.target.innerText);
          }}
          getOptionLabel={(option) => option.name}
          style={{ width: 300 }}
          disableClearable
          renderInput={(params) => (
            <TextField {...params} label="Select Airline" variant="outlined" />
          )}
        />
        <hr />
      </>
    );
  } else if (props.service_type === "Airport Porterage") {
    /* GROUND HANDLING COMPANY */
    result = (
      <>
        <label style={{ minHeight: 45, paddingTop: 15 }}>Select DMC</label>
        <Autocomplete
          options={props.AllDMCs}
          className="add_service_input"
          onChange={(e) => {
            props.setDMC(e.target.innerText);
          }}
          getOptionLabel={(option) => option.name}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Select DMC" variant="outlined" />
          )}
        />
        <hr />
      </>
    );
  } else if (
    /* FERRY TICKETS AGENCY */
    props.service_type === "Coach's Ferry Ticket" ||
    props.service_type === "Ferry Ticket"
  ) {
    result = (
      <>
        <label style={{ minHeight: 45, paddingTop: 15 }}>
          Select Ferry Ticket Agency
        </label>
        <Autocomplete
          options={props.AllFerryTicketAgencies}
          className="add_service_input"
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
        <hr />
      </>
    );
  } else if (props.service_type === "Cruise") {
    /* CRUISING COMPANY */
    result = (
      <>
        <label style={{ minHeight: 45, paddingTop: 15 }}>
          Select Cruising Company
        </label>
        <Autocomplete
          options={props.AllCruisingCompanies}
          className="add_service_input"
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
        <hr />
      </>
    );
  } else if (props.service_type === "Local Guide") {
    /* GUIDE */
    result = (
      <>
        <label style={{ minHeight: 45, paddingTop: 15 }}>Select Guide</label>
        <Autocomplete
          options={props.AllGuides}
          className="add_service_input"
          onChange={(e) => {
            props.setGuide(e.target.innerText);
          }}
          getOptionLabel={(option) => option.name}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Select Guide" variant="outlined" />
          )}
        />
        <hr />
      </>
    );
  } else if (props.service_type === "Restaurant") {
    /* RESTAURANT */
    result = (
      <>
        <label style={{ minHeight: 45, paddingTop: 15 }}>
          Select Restaurant
        </label>
        <Autocomplete
          options={props.AllRestaurants}
          className="add_service_input"
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
        <hr />
      </>
    );
  } else if (props.service_type === "Sport Event") {
    /*  SPORT EVENT SUPPLIER */
    result = (
      <>
        <label style={{ minHeight: 45, paddingTop: 15 }}>
          Select Sport Event Supplier
        </label>
        <Autocomplete
          options={props.AllSportEventSuppliers}
          className="add_service_input"
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
        <hr />
      </>
    );
  } else if (props.service_type === "Teleferik") {
    /* TELEFERIK COMPANY */
    result = (
      <>
        <label style={{ minHeight: 45, paddingTop: 15 }}>
          Select Teleferik Company
        </label>
        <Autocomplete
          options={props.AllTeleferikCompanies}
          className="add_service_input"
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
        <hr />
      </>
    );
  } else if (props.service_type === "Theater") {
    /* THEATER */
    result = (
      <>
        <label style={{ minHeight: 45, paddingTop: 15 }}>Select Theater</label>
        <Autocomplete
          options={props.AllTheaters}
          className="add_service_input"
          onChange={(e) => {
            props.setTheater(e.target.innerText);
          }}
          getOptionLabel={(option) => option.name}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Select Theater" variant="outlined" />
          )}
        />
        <hr />
      </>
    );
  } else if (props.service_type === "Tour Leader") {
    /* TOUR LEADER */
    result = (
      <>
        <label style={{ minHeight: 45, paddingTop: 15 }}>
          Select Tour Leader
        </label>
        <Autocomplete
          options={props.AllTourLeaders}
          className="add_service_input"
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
        <hr />
      </>
    );
  } else if (props.service_type === "Train Ticket") {
    /* TRAIN TICKET AGENCY */
    result = (
      <>
        <label style={{ minHeight: 45, paddingTop: 15 }}>
          Select Train Ticket Agency
        </label>
        <Autocomplete
          options={props.AllTrainTicketAgencies}
          className="add_service_input"
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
        <hr />
      </>
    );
  }
  return result;
};
