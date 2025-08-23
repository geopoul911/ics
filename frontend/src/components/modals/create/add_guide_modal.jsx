// Built-ins
import { useState } from "react";

// Icons - Images
import { BiPlus } from "react-icons/bi";
import { BsInfoSquare } from "react-icons/bs";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { FaMinus } from "react-icons/fa";

// Modules / Functions
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Col, Form, Row } from "react-bootstrap";
import { Button, Checkbox } from "semantic-ui-react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import PhoneInput from "react-phone-input-2";
import { Grid } from "semantic-ui-react";

// CSS
import "react-phone-number-input/style.css";

// Global Variables
import { headers } from "../../global_vars";

// Custom Made Components
import AddRegionModal from "./add_region_modal";

// Variables
window.Swal = Swal;

let warningStyle = {
  fontSize: 18,
  marginRight: 6,
};

let checkStyle = {
  fontSize: 18,
  marginRight: 6,
};

const allowAlpha = (value) => {
  return value.replace(/[^\w\s.\-/&\u4e00-\u9eff]{1,20}$/g, "");
};

const ADD_GUIDE = "http://localhost:8000/api/view/add_guide/";
const GET_CONTINENTS = "http://localhost:8000/api/view/get_all_continents/";
const GET_COUNTRIES = "http://localhost:8000/api/view/get_all_countries/";
const GET_STATES = "http://localhost:8000/api/view/get_all_states/";
const GET_CITIES = "http://localhost:8000/api/view/get_all_cities/";
const GET_AREAS = "http://localhost:8000/api/view/get_all_areas/";

function AddGuideModal() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [Name, setName] = useState("");
  const [Address, setAddress] = useState("");
  const [Address2, setAddress2] = useState("");
  const [showAddress2, setShowAddress2] = useState(false);
  const [postal, setPostal] = useState("");
  const [showTel2, setShowTel2] = useState(false);
  const [showTel3, setShowTel3] = useState(false);
  const [tel, setTel] = useState("");
  const [tel2, setTel2] = useState("");
  const [tel3, setTel3] = useState("");
  const [email, setEmail] = useState("");
  let [loaded, setLoaded] = useState(false);

  let [addPaymentDetails, setAddPaymentDetails] = useState(false);
  const [company, setCompany] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [iban, setIban] = useState("");
  const [swift, setSwift] = useState("");

  const [Continent, setContinent] = useState("");
  const [Country, setCountry] = useState("");
  const [State, setState] = useState("");
  const [City, setCity] = useState("");
  const [Area, setArea] = useState("");

  let [AllContinents, setAllContinents] = useState([]);
  let [AllCountries, setAllCountries] = useState([]);
  let [AllStates, setAllStates] = useState([]);
  let [AllCities, setAllCities] = useState([]);
  let [AllAreas, setAllAreas] = useState([]);

  const handleCheckBox = () => {
    setAddPaymentDetails(!addPaymentDetails);
  };

  const createNewGuide = () => {
    axios({
      method: "post",
      url: ADD_GUIDE,
      headers: headers,
      data: {
        name: Name,
        address: Address,
        email: email,
        tel: tel,
        tel2: tel2,
        tel3: tel3,
        company: company,
        currency: currency,
        iban: iban,
        swift: swift,
        address2: Address2,
        continent: Continent.name ? Continent.name : 'N/A',
        country: Country.name ? Country.name : 'N/A',
        state: State.name ? State.name : 'N/A',
        city: City.name ? City.name : 'N/A',
        area: Area.name ? Area.name : 'N/A',
        postal: postal,
      },
    })
      .then((res) => {
        window.location.href =
          "/data_management/guide/" + res.data.new_guide_id;
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: e.response.data.errormsg,
        });
      });
  };

  const getContinents = () => {
    axios
      .get(GET_CONTINENTS, {
        headers: headers,
      })
      .then((res) => {
        setAllContinents(res.data.all_continents);
        setLoaded(true);
      });
  };

  const getCountries = () => {
    axios
      .get(GET_COUNTRIES, {
        headers: headers,
      })
      .then((res) => {
        setAllCountries(res.data.all_countries);
        setLoaded(true);
      });
  };

  const getStates = () => {
    axios
      .get(GET_STATES, {
        headers: headers,
      })
      .then((res) => {
        setAllStates(res.data.all_states);
        setLoaded(true);
      });
  };

  const getCities = () => {
    axios
      .get(GET_CITIES, {
        headers: headers,
      })
      .then((res) => {
        setAllCities(res.data.all_cities);
        setLoaded(true);
      });
  };

  const getAreas = () => {
    axios
      .get(GET_AREAS, {
        headers: headers,
      })
      .then((res) => {
        setAllAreas(res.data.all_areas);
        setLoaded(true);
      });
  };

  const handleRegionChange = (event, value, type) => {
    // CASE 1 : CONTINENT
    if (type === "Continent") {
      setContinent(value || "");
      setCountry("");
      setState("");
      setCity("");
      setArea("");
    }

    // CASE 2 : COUNTRY
    else if (type === "Country") {
      setContinent(value && value.continent ? value.continent : "");
      setCountry(value || "");
      setState("");
      setCity("");
      setArea("");
    }

    // CASE 3: STATE
    else if (type === "State") {
      setContinent(
        value && value.country && value.country.continent
          ? value.country.continent
          : ""
      );
      setCountry(value && value.country ? value.country : "");
      setState(value || "");
      setCity("");
      setArea("");
    }

    // CASE 4 : CITY
    else if (type === "City") {
      if (value && value.state) {
        setCity(value || "");
        setContinent(
          value.state.country && value.state.country.continent
            ? value.state.country.continent
            : ""
        );
        setCountry(value.state.country ? value.state.country : "");
        setState(value.state || "");
        setArea("");
      } else {
        setCity(value || "");
        setContinent(
          value && value.country && value.country.continent
            ? value.country.continent
            : ""
        );
        setCountry(value && value.country ? value.country : "");
        setState(value && value.state ? value.state : "");
        setArea("");
      }
    }

    // CASE 5 : AREA
    else if (type === "Area") {
      if (value && value.city && value.city.country) {
        setCity(value.city || "");
        setContinent(value.city.country.continent || "");
        setCountry(value.city.country || "");
        setState(value.city.state || "");
        setArea(value || "");
      } else if (
        value &&
        value.city &&
        value.city.state &&
        value.city.state.country
      ) {
        setCity(value.city || "");
        setContinent(value.city.state.country.continent || "");
        setCountry(value.city.state.country || "");
        setState(value.city.state || "");
        setArea(value || "");
      } else {
        setCity("");
        setContinent("");
        setCountry("");
        setState("");
        setArea(value || "");
      }
    }
  };

  const getFilteredCountries = () => {
    if (Continent) {
      return AllCountries.filter(
        (country) =>
          country.continent && country.continent.name === Continent.name
      );
    } else {
      return AllCountries;
    }
  };

  const getFilteredStates = () => {
    if (Country) {
      return AllStates.filter(
        (state) => state.country && state.country.name === Country.name
      );
    } else if (Continent) {
      let countryNames = AllCountries.filter(
        (country) =>
          country.continent && country.continent.name === Continent.name
      ).map((country) => country.name);
      return AllStates.filter(
        (state) => state.country && countryNames.includes(state.country.name)
      );
    } else {
      return AllStates;
    }
  };

  const getFilteredCities = () => {
    if (State) {
      return AllCities.filter(
        (city) => city.state && city.state.name === State.name
      );
    } else if (Country) {
      let citiesWithCountryParent = AllCities.filter(
        (city) => city.country && city.country.name === Country.name
      );
      let statesInCountry = AllStates.filter(
        (state) => state.country && state.country.name === Country.name
      );
      let citiesWithStateParent = AllCities.filter((city) =>
        statesInCountry.some(
          (state) => city.state && city.state.name === state.name
        )
      );
      return [...citiesWithCountryParent, ...citiesWithStateParent];
    } else if (Continent) {
      let countriesInContinent = AllCountries.filter(
        (country) =>
          country.continent && country.continent.name === Continent.name
      );
      let countryNames = countriesInContinent.map((country) => country.name);

      let statesInContinent = AllStates.filter((state) =>
        countriesInContinent.some(
          (country) => country.name === state.country.name
        )
      );
      let stateNames = statesInContinent.map((state) => state.name);

      return AllCities.filter((city) => {
        if (city.country && countryNames.includes(city.country.name)) {
          return true;
        }
        if (city.state && stateNames.includes(city.state.name)) {
          return true;
        }
        return false;
      });
    } else {
      return AllCities;
    }
  };

  const getFilteredAreas = () => {
    if (Area) {
      return AllAreas.filter((area) => area.name === Area.name);
    } else if (City) {
      return AllAreas.filter(
        (area) => area.city && area.city.name === City.name
      );
    } else if (State) {
      return AllAreas.filter(
        (area) =>
          area.city && area.city.state && area.city.state.name === State.name
      );
    } else if (Country) {
      return AllAreas.filter(
        (area) =>
          area.city &&
          area.city.country &&
          area.city.country.name === Country.name
      );
    } else if (Continent) {
      let countryNames = AllCountries.filter(
        (country) =>
          country.continent && country.continent.name === Continent.name
      ).map((country) => country.name);
      return AllAreas.filter(
        (area) =>
          area.city &&
          area.city.country &&
          countryNames.includes(area.city.country.name)
      );
    } else {
      return AllAreas;
    }
  };

  const filterOptions = (options, { inputValue }) => {
    if (inputValue.length >= 2) {
      return options.filter((option) =>
        option.name.toLowerCase().includes(inputValue.toLowerCase())
      );
    }
    return [];
  };

  return (
    <>
      <Button
        color="green"
        style={{ margin: 20 }}
        onClick={() => {
          handleShow();
          setName("");
          setAddress("");
          setTel("");
          setTel2("");
          setTel3("");
          setEmail("");
          getContinents();
          getCountries();
          getStates();
          getCities();
          getAreas();
          setAddPaymentDetails(false);
        }}
      >
        <BiPlus
          style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }}
        />
        Create new Guide
      </Button>
      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title> Create new Guide </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="justify-content-md-center">
            <Col>
              <Form>
                <Form.Group>
                  <Form.Label>Name:</Form.Label>
                  <Form.Control
                    maxLength="63"
                    style={{ width: 400 }}
                    onChange={(e) =>
                      setName(allowAlpha(e.target.value.toUpperCase()))
                    }
                    value={Name}
                  />
                  <Form.Label>Address Line 1: </Form.Label>
                  <Form.Control
                    type="text"
                    style={{ width: "90%", display: "inline" }}
                    onChange={(e) => setAddress(e.target.value.toUpperCase())}
                    value={Address}
                  />
                  {!showAddress2 && (
                    <div style={{ float: "right" }}>
                      Add Address Line 2.
                      <AiOutlinePlusSquare
                        className="plus-icon"
                        onClick={() => setShowAddress2(true)}
                      />
                    </div>
                  )}
                </Form.Group>
                {showAddress2 && (
                  <>
                    <Form.Group>
                      <Form.Label>Address Line 2: </Form.Label>
                      <Form.Control
                        type="text"
                        style={{ width: "90%", display: "inline" }}
                        onChange={(e) =>
                          setAddress2(e.target.value.toUpperCase())
                        }
                        value={Address2}
                      />
                      <FaMinus
                        className="minus-icon"
                        onClick={() => setShowAddress2(false)}
                        style={{ float: "right" }}
                      />
                    </Form.Group>
                  </>
                )}
                <Form.Group>
                  <Form.Label>Postal / Zip code: </Form.Label>
                  <Form.Control
                    type="text"
                    style={{ width: 200 }}
                    onChange={(e) => setPostal(e.target.value)}
                    value={postal}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Region: </Form.Label>
                  <Grid columns={5}>
                    <Grid.Column>
                      <Autocomplete
                        options={AllContinents}
                        className="select_airport"
                        disabled={!loaded}
                        onChange={(event, value) =>
                          handleRegionChange(event, value, "Continent")
                        }
                        getOptionLabel={(option) => option.name}
                        value={Continent}
                        style={{ width: 140, margin: 0 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Continent"
                            variant="outlined"
                          />
                        )}
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <Autocomplete
                        options={getFilteredCountries()}
                        className="select_airport"
                        disabled={!loaded}
                        onChange={(event, value) =>
                          handleRegionChange(event, value, "Country")
                        }
                        value={Country}
                        getOptionLabel={(option) => option.name}
                        style={{ width: 140, margin: 0 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Country"
                            variant="outlined"
                          />
                        )}
                      />
                    </Grid.Column>

                    {getFilteredStates().length > 0 ? (
                      <Grid.Column>
                        <Autocomplete
                          options={getFilteredStates()}
                          className="select_airport"
                          disabled={!loaded}
                          onChange={(event, value) =>
                            handleRegionChange(event, value, "State")
                          }
                          value={State}
                          style={{ width: 140, margin: 0 }}
                          getOptionLabel={(option) => option.name}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="State"
                              variant="outlined"
                            />
                          )}
                        />
                      </Grid.Column>
                    ) : (
                      ""
                    )}
                    <Grid.Column>
                      <Autocomplete
                        options={getFilteredCities()}
                        className="select_airport"
                        disabled={!loaded}
                        onChange={(event, value) =>
                          handleRegionChange(event, value, "City")
                        }
                        value={City}
                        filterOptions={Country ? undefined : filterOptions}
                        style={{ width: 140, margin: 0 }}
                        getOptionLabel={(option) =>
                          option.country
                            ? option.name + " - " + option.country.name
                            : option.name
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="City"
                            variant="outlined"
                          />
                        )}
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <Autocomplete
                        options={getFilteredAreas()}
                        className="select_airport"
                        disabled={!loaded}
                        onChange={(event, value) =>
                          handleRegionChange(event, value, "Area")
                        }
                        value={Area}
                        style={{ width: 140, margin: 0 }}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Area"
                            variant="outlined"
                          />
                        )}
                      />
                    </Grid.Column>
                  </Grid>

                  <div style={{ float: "right" }}>
                    <AddRegionModal
                      redir={false}
                      get_cities={() => getCities()}
                    />
                  </div>

                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    maxLength="100"
                    style={{ width: 400, marginBottom: 20 }}
                    onChange={(e) => {
                      setEmail(e.target.value.toLowerCase());
                    }}
                    disableClearable
                    value={email}
                  />

                  <Grid columns={2}>
                    <Grid.Row style={{ marginLeft: 0, paddingTop: 0 }}>
                      <Grid.Column style={{ paddingTop: 0 }}>
                        <Form.Label>Tel: </Form.Label>
                        <PhoneInput
                          international
                          maxLength={20}
                          defaultCountry="GR"
                          countryCallingCodeEditable={false}
                          key={Country}
                          country={
                            Country.code ? Country.code.toLowerCase() : ""
                          }
                          value={tel}
                          onChange={setTel}
                        />
                      </Grid.Column>
                      <Grid.Column>
                        {!showTel2 && (
                          <div style={{ marginTop: 30 }}>
                            Add Tel 2.
                            <AiOutlinePlusSquare
                              className="plus-icon"
                              onClick={() => setShowTel2(true)}
                            />
                          </div>
                        )}
                      </Grid.Column>
                    </Grid.Row>

                    {showTel2 && (
                      <>
                        <Grid.Column style={{ margin: 0, paddingTop: 0 }}>
                          <Form.Label>Tel. 2: </Form.Label>
                          <PhoneInput
                            international
                            maxLength={20}
                            defaultCountry="GR"
                            countryCallingCodeEditable={false}
                            key={Country}
                            country={
                              Country.code ? Country.code.toLowerCase() : ""
                            }
                            value={tel2}
                            onChange={setTel2}
                          />
                        </Grid.Column>
                        <Grid.Column>
                          {!showTel3 && (
                            <>
                              <div style={{ marginTop: 16 }}>
                                Remove Tel 2.
                                <FaMinus
                                  className="minus-icon"
                                  style={{ marginRight: 50 }}
                                  onClick={() => setShowTel2(false)}
                                />
                                Add Tel 3.
                                <AiOutlinePlusSquare
                                  className="plus-icon"
                                  onClick={() => setShowTel3(true)}
                                />
                              </div>
                            </>
                          )}
                        </Grid.Column>
                      </>
                    )}

                    {showTel3 && (
                      <>
                        <Grid.Column style={{ margin: 0, paddingTop: 0 }}>
                          <Form.Label>Tel. 3: </Form.Label>
                          <PhoneInput
                            international
                            maxLength={20}
                            defaultCountry="GR"
                            countryCallingCodeEditable={false}
                            key={Country}
                            country={
                              Country.code ? Country.code.toLowerCase() : ""
                            }
                            value={tel3}
                            onChange={setTel3}
                          />
                        </Grid.Column>
                        <Grid.Column>
                          <div style={{ marginTop: 16 }}>
                            Remove Tel 3.
                            <FaMinus
                              className="minus-icon"
                              onClick={() => setShowTel3(false)}
                            />
                          </div>
                        </Grid.Column>
                      </>
                    )}
                  </Grid>

                  <div style={{ marginTop: 10 }}>
                    <Checkbox
                      label={"Add Payment Details?"}
                      value={addPaymentDetails}
                      onChange={handleCheckBox}
                    />
                  </div>

                  {addPaymentDetails ? (
                    <>
                      <Form.Label>Company:</Form.Label>
                      <Form.Control
                        maxLength="255"
                        onChange={(e) => setCompany(e.currentTarget.value)}
                        value={company}
                      />
                      <Form.Label>Currency:</Form.Label>
                      <select
                        className="form-control"
                        onChange={(e) => setCurrency(e.target.value)}
                        style={{ marginBottom: 10, width: "40%" }}
                      >
                        <option value="EUR"> € Euro (EUR) </option>
                        <option value="GBP"> £ Pound Sterling (GBP) </option>
                        <option value="USD"> $ US Dollar (USD) </option>
                        <option value="CAD"> $ Canadian Dollar (CAD) </option>
                        <option value="AUD"> $ Australian Dollar (AUD) </option>
                        <option value="CHF"> ₣ Swiss Franc (CHF) </option>
                        <option value="JPY"> ¥ Japanese Yen (JPY) </option>
                        <option value="NZD">
                          $ New Zealand Dollar (NZD)
                        </option>
                        <option value="CNY"> ¥ Chinese Yuan (CNY) </option>
                        <option value="SGD"> $ Singapore Dollar (SGD) </option>
                      </select>
                      <Form.Label>
                        {currency === "GBP" ? "Account Number" : "IBAN"} :
                      </Form.Label>
                      <Form.Control
                        maxLength="50"
                        onChange={(e) =>
                          setIban(e.currentTarget.value.toUpperCase())
                        }
                        value={iban}
                      />
                      <Form.Label>
                        {currency === "GBP" ? "Sort Code" : "Swift"} :
                      </Form.Label>
                      <Form.Control
                        maxLength="50"
                        onChange={(e) =>
                          setSwift(e.currentTarget.value.toUpperCase())
                        }
                        value={swift}
                      />
                    </>
                  ) : (
                    ""
                  )}
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            <BsInfoSquare
              style={{
                color: "#F3702D",
                fontSize: "1.5em",
                marginRight: "0.5em",
              }}
            />
            All fields except Tel2 and Tel3 and website are required to create a
            guide.
            {Name.length < 2 ||
            !tel ||
            !City ||
            (addPaymentDetails && !iban) ||
            (addPaymentDetails && !swift) ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {Name.length < 2 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Fill The Name Field.
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {!tel ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Fill The Tel Field.
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {addPaymentDetails && !iban ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Payment Details must include an IBAN or Account Number.
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {addPaymentDetails && !swift ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Payment Details must include either sort code or Swift.
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {!City ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Select A City
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                </ul>
              </>
            ) : (
              <>
                <ul
                  className="mr-auto"
                  style={{
                    margin: 0,
                    padding: 0,
                    marginTop: 10,
                    color: "green",
                  }}
                >
                  <li>
                    <AiOutlineCheckCircle style={checkStyle} />
                    Validated
                  </li>
                </ul>
              </>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              createNewGuide();
            }}
            disabled={
              Name.length < 2 ||
              !tel ||
              !City ||
              (addPaymentDetails && !iban) ||
              (addPaymentDetails && !swift)
            }
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddGuideModal;
