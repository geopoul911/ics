// Built-ins
import { useState, useEffect } from "react";

// Icons / Images
import { BiPlus } from "react-icons/bi";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";
import axios from "axios";

// Modules / Functions
import Swal from "sweetalert2";
import { Modal, Col, Form, Row } from "react-bootstrap";
import { Button } from "semantic-ui-react";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

// API endpoints - Using regions API
const ADD_CITY = "http://localhost:8000/api/view/add_city/";
const GET_COUNTRIES = "http://localhost:8000/api/regions/all_countries/";
const GET_PROVINCES = "http://localhost:8000/api/regions/all_provinces/";

// Helpers
const onlyUpperLetters = (value) => value.replace(/[^a-zA-Z]/g, "").toUpperCase();
const clampLen = (value, max) => value.slice(0, max);
const toSmallInt = (value) => {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return "";
  return Math.max(-32768, Math.min(32767, n)); // Django SmallIntegerField range
};

function AddCityModal() {
  const [show, setShow] = useState(false);
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);

  const [title, setTitle] = useState("");
  const [cityId, setCityId] = useState(""); // maps to city_id
  const [countryId, setCountryId] = useState(""); // maps to country_id
  const [provinceId, setProvinceId] = useState(""); // maps to province_id
  const [orderindex, setOrderindex] = useState(""); // required small int

  const resetForm = () => {
    setTitle("");
    setCityId("");
    setCountryId("");
    setProvinceId("");
    setOrderindex("");
  };

  const handleClose = () => setShow(false);
  const handleShow = () => {
    resetForm();
    setShow(true);
  };

  const isTitleValid = title.trim().length >= 2 && title.trim().length <= 40;
  const isCityIdValid = cityId.length >= 2 && cityId.length <= 10;
  const isCountryIdValid = countryId.length > 0;
  const isProvinceIdValid = provinceId.length > 0;
  const isOrderIndexValid = orderindex !== "" && Number.isInteger(+orderindex);

  const isFormValid = isTitleValid && isCityIdValid && isCountryIdValid && isProvinceIdValid && isOrderIndexValid;

  // Fetch countries for dropdown
  useEffect(() => {
    if (show) {
      // Try using axios directly with proper headers
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };
      
      console.log('Fetching countries from:', GET_COUNTRIES);
      console.log('Using headers:', currentHeaders);
      
      axios.get(GET_COUNTRIES, { headers: currentHeaders })
        .then((res) => {
          console.log('Countries API response:', res.data);
          // Handle different response structures
                     const countriesData = res.data?.all_countries || [];
          console.log('Processed countries data:', countriesData);
          console.log('Setting countries state with:', countriesData);
          setCountries(countriesData);
        })
        .catch((e) => {
          console.error("Failed to fetch countries:", e);
          console.error("Error response:", e.response?.data);
          setCountries([]);
        });
    }
  }, [show]);

  // Reset province when country changes
  useEffect(() => {
    setProvinceId("");
  }, [countryId]);

  // Fetch provinces when country changes
  useEffect(() => {
    if (countryId && show) {
      // Try using axios directly with proper headers
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };
      
      console.log('Fetching provinces from:', GET_PROVINCES);
      console.log('Fetching provinces for country:', countryId);
      
      axios.get(GET_PROVINCES, { headers: currentHeaders })
        .then((res) => {
          console.log('Provinces API response:', res.data);
          // Handle different response structures
                     const allProvinces = res.data?.all_provinces || [];
          console.log('All provinces data:', allProvinces);
          // Filter provinces by country
          const provincesData = allProvinces.filter(province => province.country?.country_id === countryId);
          console.log('Filtered provinces data:', provincesData);
          console.log('Setting provinces state with:', provincesData);
          setProvinces(provincesData);
        })
        .catch((e) => {
          console.error("Failed to fetch provinces:", e);
          console.error("Error response:", e.response?.data);
          setProvinces([]);
        });
    } else {
      setProvinces([]);
    }
  }, [countryId, show]);

  const createNewCity = async () => {
    try {
      // Update headers with current token
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const res = await axios({
        method: "post",
        url: ADD_CITY,
        headers: currentHeaders,
        data: {
          title: title.trim(),
          city_id: cityId,
          country_id: countryId, // Use country_id instead of country
          province_id: provinceId, // Use province_id instead of province
          orderindex: Number(orderindex),
        },
      });

      const newId = res?.data?.city_id || res?.data?.id || cityId;
      window.location.href = "/regions/city/" + newId;
    } catch (e) {
      const apiMsg =
        e?.response?.data?.errormsg ||
        e?.response?.data?.detail ||
        "Something went wrong while creating the city.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: apiMsg,
      });
    }
  };

  return (
    <>
      <Button color="green" style={{ margin: 20 }} onClick={handleShow}>
        <BiPlus
          style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }}
        />
        Create new City
      </Button>

      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Create new City</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row className="justify-content-md-center">
            <Col>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Title:</Form.Label>
                  <Form.Control
                    maxLength={40}
                    placeholder="e.g., ATHENS"
                    onChange={(e) =>
                      setTitle(clampLen(e.target.value.toUpperCase(), 40))
                    }
                    value={title}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>City ID:</Form.Label>
                  <Form.Control
                    maxLength={10}
                    placeholder="e.g., ATH"
                    onChange={(e) =>
                      setCityId(onlyUpperLetters(clampLen(e.target.value, 10)))
                    }
                    value={cityId}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Country:</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) => setCountryId(e.target.value)}
                    value={countryId}
                  >
                    <option value="">Select Country</option>
                    {Array.isArray(countries) && countries.map((country) => (
                      <option key={country.country_id} value={country.country_id}>
                        {country.title}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Province:</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) => setProvinceId(e.target.value)}
                    value={provinceId}
                    disabled={!countryId}
                  >
                    <option value="">Select Province</option>
                    {Array.isArray(provinces) && provinces.map((province) => (
                      <option key={province.province_id} value={province.province_id}>
                        {province.title}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Order Index:</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="e.g., 1"
                    onChange={(e) => setOrderindex(toSmallInt(e.target.value))}
                    value={orderindex}
                  />
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <small className="mr-auto">
            {!isFormValid ? (
              <ul
                className="mr-auto"
                style={{ margin: 0, padding: 0, color: "red" }}
              >
                {!isTitleValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Title is required (2–40 chars).
                  </li>
                )}
                {!isCityIdValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    City ID is required (2–10 chars).
                  </li>
                )}
                {!isCountryIdValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Country is required.
                  </li>
                )}
                {!isProvinceIdValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Province is required.
                  </li>
                )}
                {!isOrderIndexValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Order Index is required (integer).
                  </li>
                )}
              </ul>
            ) : (
              <ul
                className="mr-auto"
                style={{ margin: 0, padding: 0, color: "green" }}
              >
                <li>
                  <AiOutlineCheckCircle
                    style={{ fontSize: 18, marginRight: 6 }}
                  />
                  Validated
                </li>
              </ul>
            )}
          </small>

          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              createNewCity();
            }}
            disabled={!isFormValid}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddCityModal; 