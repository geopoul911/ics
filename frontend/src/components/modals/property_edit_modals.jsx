// Built-ins
import { useState, useEffect } from "react";

// Icons / Images
import { FiEdit } from "react-icons/fi";
import axios from "axios";

// Modules / Functions
import Swal from "sweetalert2";
import { Modal, Form } from "react-bootstrap";
import { Button } from "semantic-ui-react";

// Global Variables
import { headers } from "../global_vars";

// Variables
window.Swal = Swal;

// API endpoints
const UPDATE_PROPERTY = "http://localhost:8000/api/data_management/property/";

// Edit Property ID Modal
export function EditPropertyIdModal({ property, update_state }) {
  const [show, setShow] = useState(false);
  const [property_id, setPropertyId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setPropertyId(property.property_id || "");
    }
  }, [show, property]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    if (!property_id.trim()) {
      Swal.fire("Error", "Property ID is required", "error");
      return;
    }

    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        UPDATE_PROPERTY + property.property_id + "/",
        { property_id: property_id.trim() },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Property ID updated successfully", "success");
      if (update_state) update_state(response.data);
      handleClose();
    } catch (e) {
      console.error('Error updating property ID:', e);
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update property ID";
      Swal.fire("Error", apiMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit ID</Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Property ID</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Property ID *:</Form.Label>
              <Form.Control
                type="text"
                value={property_id}
                onChange={(e) => setPropertyId(e.target.value)}
                placeholder="Enter property ID"
                maxLength={10}
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: property_id.trim() ? "green" : "red" }}>{property_id.trim() ? "Looks good." : "Property ID is required."}</div></small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={!property_id.trim() || isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Property Description Modal
export function EditPropertyDescriptionModal({ property, update_state }) {
  const [show, setShow] = useState(false);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setDescription(property.description || "");
    }
  }, [show, property]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    if (!description.trim()) {
      Swal.fire("Error", "Description is required", "error");
      return;
    }

    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        UPDATE_PROPERTY + property.property_id + "/",
        { description: description.trim() },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Description updated successfully", "success");
      if (update_state) update_state(response.data);
      handleClose();
    } catch (e) {
      console.error('Error updating description:', e);
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update description";
      Swal.fire("Error", apiMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Description</Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Description</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Description *:</Form.Label>
              <Form.Control
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                maxLength={80}
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: description.trim() ? "green" : "red" }}>{description.trim() ? "Looks good." : "Description is required."}</div></small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={!description.trim() || isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Property Project Modal
export function EditPropertyProjectModal({ property, update_state }) {
  const [show, setShow] = useState(false);
  const [project, setProject] = useState("");
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setProject(property.project?.project_id || "");
      loadProjects();
    }
  }, [show, property]);

  const loadProjects = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };
      const response = await axios.get("http://localhost:8000/api/data_management/all_projects/", {
        headers: currentHeaders
      });
      const projectsData = response?.data?.all_projects || [];
      setProjects(projectsData);
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    if (!project.trim()) {
      Swal.fire("Error", "Project is required", "error");
      return;
    }

    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        UPDATE_PROPERTY + property.property_id + "/",
        { project_id: project },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Project updated successfully", "success");
      if (update_state) update_state(response.data);
      handleClose();
    } catch (e) {
      console.error('Error updating project:', e);
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update project";
      Swal.fire("Error", apiMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Project</Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Project *:</Form.Label>
              <Form.Control
                as="select"
                value={project}
                onChange={(e) => setProject(e.target.value)}
              >
                <option value="">Select Project</option>
                {projects.map((proj) => (
                  <option key={proj.project_id} value={proj.project_id}>
                    {proj.title}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: project.trim() ? "green" : "red" }}>{project.trim() ? "Looks good." : "Project is required."}</div></small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={!project.trim() || isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Property Country Modal
export function EditPropertyCountryModal({ property, update_state }) {
  const [show, setShow] = useState(false);
  const [country, setCountry] = useState("");
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setCountry(property.country?.country_id || "");
      loadCountries();
    }
  }, [show, property]);

  const loadCountries = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };
              const response = await axios.get("http://localhost:8000/api/regions/all_countries/", {
        headers: currentHeaders
      });
      const countriesData = response?.data?.all_countries || [];
      setCountries(countriesData);
    } catch (error) {
      console.error('Error loading countries:', error);
      setCountries([]);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    if (!country.trim()) {
      Swal.fire("Error", "Country is required", "error");
      return;
    }

    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        UPDATE_PROPERTY + property.property_id + "/",
        { country_id: country },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Country updated successfully", "success");
      if (update_state) update_state(response.data);
      handleClose();
    } catch (e) {
      console.error('Error updating country:', e);
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update country";
      Swal.fire("Error", apiMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Country</Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Country</Modal.Title>
        </Modal.Header>
        <Modal.Body>  
            <Form.Group>
              <Form.Label>Country *:</Form.Label>
              <Form.Control
                as="select"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">Select Country</option>
                {countries.map((cntry) => (
                  <option key={cntry.country_id} value={cntry.country_id}>
                    {cntry.country_id} - {cntry.title}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: country.trim() ? "green" : "red" }}>{country.trim() ? "Looks good." : "Country is required."}</div></small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={!country.trim() || isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Property Province Modal
export function EditPropertyProvinceModal({ property, update_state }) {
  const [show, setShow] = useState(false);
  const [province, setProvince] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setProvince(property.province?.province_id || "");
      loadProvinces();
    }
  }, [show, property]);

  const loadProvinces = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };
              const response = await axios.get("http://localhost:8000/api/regions/all_provinces/", {
        headers: currentHeaders
      });
      const provincesData = response?.data?.all_provinces || [];
      setProvinces(provincesData);
    } catch (error) {
      console.error('Error loading provinces:', error);
      setProvinces([]);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    if (!province.trim()) {
      Swal.fire("Error", "Province is required", "error");
      return;
    }

    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        UPDATE_PROPERTY + property.property_id + "/",
        { province_id: province },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Province updated successfully", "success");
      if (update_state) update_state(response.data);
      handleClose();
    } catch (e) {
      console.error('Error updating province:', e);
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update province";
      Swal.fire("Error", apiMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Province</Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Province</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Province *:</Form.Label>
              <Form.Control
                as="select"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
              >
                <option value="">Select Province</option>
                {provinces.map((prov) => (
                  <option key={prov.province_id} value={prov.province_id}>
                    {prov.province_id} - {prov.title}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: province.trim() ? "green" : "red" }}>{province.trim() ? "Looks good." : "Province is required."}</div></small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={!province.trim() || isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Property City Modal
export function EditPropertyCityModal({ property, update_state }) {
  const [show, setShow] = useState(false);
  const [city, setCity] = useState("");
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setCity(property.city?.city_id || "");
      loadCities();
    }
  }, [show, property]);

  const loadCities = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };
              const response = await axios.get("http://localhost:8000/api/regions/all_cities/", {
        headers: currentHeaders
      });
      const citiesData = response?.data?.all_cities || [];
      setCities(citiesData);
    } catch (error) {
      console.error('Error loading cities:', error);
      setCities([]);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    if (!city.trim()) {
      Swal.fire("Error", "City is required", "error");
      return;
    }

    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        UPDATE_PROPERTY + property.property_id + "/",
        { city_id: city },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "City updated successfully", "success");
      if (update_state) update_state(response.data);
      handleClose();
    } catch (e) {
      console.error('Error updating city:', e);
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update city";
      Swal.fire("Error", apiMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit City</Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit City</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>City *:</Form.Label>
              <Form.Control
                as="select"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <option value="">Select City</option>
                {cities.map((cty) => (
                  <option key={cty.city_id} value={cty.city_id}>
                    {cty.city_id} - {cty.title}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: city.trim() ? "green" : "red" }}>{city.trim() ? "Looks good." : "City is required."}</div></small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={!city.trim() || isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Property Geo Location (Country + Province + City) Modal
export function EditPropertyGeoLocationModal({ property, update_state }) {
  const [show, setShow] = useState(false);
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (show) {
      // Prefill from current property
      const currentCountry = property.country?.country_id || property.country?.country_id || property.country?.id || "";
      const currentProvince = property.province?.province_id || property.province?.id || "";
      const currentCity = property.city?.city_id || property.city?.id || "";
      setCountry(currentCountry);
      setProvince(currentProvince);
      setCity(currentCity);
      loadCountries().then(() => {
        if (currentCountry) {
          loadProvinces(currentCountry).then(() => {
            if (currentProvince) {
              loadCities(currentProvince);
            }
          });
        }
      });
    } else {
      // reset when closing
      setCountries([]);
      setProvinces([]);
      setCities([]);
      setCountry("");
      setProvince("");
      setCity("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const loadCountries = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };
      const response = await axios.get("http://localhost:8000/api/regions/all_countries/", { headers: currentHeaders });
      const countriesData = response?.data?.all_countries || [];
      setCountries(countriesData);
    } catch (error) {
      console.error('Error loading countries:', error);
      setCountries([]);
    }
  };

  const loadProvinces = async (countryId) => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };
      const response = await axios.get(`http://localhost:8000/api/regions/all_provinces/?country=${countryId}`, { headers: currentHeaders });
      const provincesData = response?.data?.all_provinces || [];
      setProvinces(provincesData);
    } catch (error) {
      console.error('Error loading provinces:', error);
      setProvinces([]);
    }
  };

  const loadCities = async (provinceId) => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };
      const response = await axios.get(`http://localhost:8000/api/regions/all_cities/?province=${provinceId}`, { headers: currentHeaders });
      const citiesData = response?.data?.all_cities || [];
      setCities(citiesData);
    } catch (error) {
      console.error('Error loading cities:', error);
      setCities([]);
    }
  };

  // Cascading resets/fetches
  useEffect(() => {
    if (!show) return;
    if (country) {
      setProvince("");
      setCity("");
      loadProvinces(country);
    } else {
      setProvinces([]);
      setCities([]);
      setProvince("");
      setCity("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);

  useEffect(() => {
    if (!show) return;
    if (province) {
      setCity("");
      loadCities(province);
    } else {
      setCities([]);
      setCity("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [province]);

  const isValid = Boolean(country && province && city);

  const handleSave = async () => {
    if (!isValid) return;
    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        UPDATE_PROPERTY + property.property_id + "/",
        { country_id: country, province_id: province, city_id: city },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Location updated successfully", "success");
      if (update_state) update_state(response.data);
      handleClose();
    } catch (e) {
      console.error('Error updating location (C/P/C):', e);
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update location";
      Swal.fire("Error", apiMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Location</Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Country *:</Form.Label>
              <Form.Control as="select" value={country} onChange={(e) => setCountry(e.target.value)}>
                <option value="">Select Country</option>
                {countries.map((cntry) => (
                  <option key={cntry.country_id} value={cntry.country_id}>
                    {cntry.name || cntry.title}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Province *:</Form.Label>
              <Form.Control as="select" value={province} onChange={(e) => setProvince(e.target.value)} disabled={!country}>
                <option value="">Select Province</option>
                {provinces.map((prov) => (
                  <option key={prov.province_id} value={prov.province_id}>
                    {prov.name || prov.title}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>City *:</Form.Label>
              <Form.Control as="select" value={city} onChange={(e) => setCity(e.target.value)} disabled={!province}>
                <option value="">Select City</option>
                {cities.map((cty) => (
                  <option key={cty.city_id} value={cty.city_id}>
                    {cty.name || cty.title}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: isValid ? "green" : "red" }}>{isValid ? "Looks good." : "Country, Province and City are required."}</div></small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={!isValid || isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Property Location Modal
export function EditPropertyLocationModal({ property, update_state }) {
  const [show, setShow] = useState(false);
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setLocation(property.location || "");
    }
  }, [show, property]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    if (!location.trim()) {
      Swal.fire("Error", "Location is required", "error");
      return;
    }

    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        UPDATE_PROPERTY + property.property_id + "/",
        { location: location.trim() },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Location updated successfully", "success");
      if (update_state) update_state(response.data);
      handleClose();
    } catch (e) {
      console.error('Error updating location:', e);
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update location";
      Swal.fire("Error", apiMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Location</Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Location *:</Form.Label>
              <Form.Control
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location"
                maxLength={80}
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: location.trim() ? "green" : "red" }}>{location.trim() ? "Looks good." : "Location is required."}</div></small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={!location.trim() || isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Property Type Modal
export function EditPropertyTypeModal({ property, update_state }) {
  const [show, setShow] = useState(false);
  const [type, setType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const typeChoices = [
    { value: "Plot", label: "Αγροτεμάχιο" },
    { value: "Land", label: "Οικόπεδο" },
    { value: "House", label: "Μονοκατοικία" },
    { value: "Apartment", label: "Διαμέρισμα" },
    { value: "Store", label: "Κατάστημα" },
    { value: "Other", label: "Άλλο" },
  ];

  useEffect(() => {
    if (show) {
      setType(property.type || "");
    }
  }, [show, property]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    if (!type.trim()) {
      Swal.fire("Error", "Type is required", "error");
      return;
    }

    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        UPDATE_PROPERTY + property.property_id + "/",
        { type: type },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Type updated successfully", "success");
      if (update_state) update_state(response.data);
      handleClose();
    } catch (e) {
      console.error('Error updating type:', e);
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update type";
      Swal.fire("Error", apiMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Type</Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Type *:</Form.Label>
              <Form.Control
                as="select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">Select Type</option>
                {typeChoices.map((choice) => (
                  <option key={choice.value} value={choice.value}>
                    {choice.label}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: type.trim() ? "green" : "red" }}>{type.trim() ? "Looks good." : "Type is required."}</div></small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={!type.trim() || isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Property Construction Year Modal
export function EditPropertyConstructYearModal({ property, update_state }) {
  const [show, setShow] = useState(false);
  const [constructyear, setConstructYear] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setConstructYear(property.constructyear || "");
    }
  }, [show, property]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const isValidYear = () => {
    if (String(constructyear).trim() === "") return true; // optional
    const y = parseInt(constructyear, 10);
    return Number.isInteger(y) && y >= 1800 && y <= 2100;
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        UPDATE_PROPERTY + property.property_id + "/",
        { constructyear: (String(constructyear).trim() === "" ? null : String(constructyear).trim()) },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Construction year updated successfully", "success");
      if (update_state) update_state(response.data);
      handleClose();
    } catch (e) {
      console.error('Error updating construction year:', e);
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update construction year";
      Swal.fire("Error", apiMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Construction Year</Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Construction Year</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Construction Year:</Form.Label>
              <Form.Control
                type="number"
                value={constructyear}
                onChange={(e) => setConstructYear(e.target.value)}
                placeholder="Enter year (1800 - 2100)"
                min={1800}
                max={2100}
                step={1}
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: isValidYear() ? "green" : "red" }}>{isValidYear() ? "Looks good." : "Please enter a valid year."}</div></small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={!isValidYear() || isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Property Status Modal
export function EditPropertyStatusModal({ property, update_state }) {
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const statusChoices = [
    { value: "", label: "No Status" },
    { value: "Empty", label: "Άδειο" },
    { value: "Rented", label: "Ενοικιασμένο" },
    { value: "Unfinished", label: "Ημιτελές" },
  ];

  useEffect(() => {
    if (show) {
      setStatus(property.status || "");
    }
  }, [show, property]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        UPDATE_PROPERTY + property.property_id + "/",
        { status: status || null },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Status updated successfully", "success");
      if (update_state) update_state(response.data);
      handleClose();
    } catch (e) {
      console.error('Error updating status:', e);
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update status";
      Swal.fire("Error", apiMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Status</Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Status:</Form.Label>
              <Form.Control
                as="select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {statusChoices.map((choice) => (
                  <option key={choice.value} value={choice.value}>
                    {choice.label}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: "green" }}>Looks good.</div></small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Property Market Modal
export function EditPropertyMarketModal({ property, update_state }) {
  const [show, setShow] = useState(false);
  const [market, setMarket] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const marketChoices = [
    { value: "", label: "No Market" },
    { value: "ShortTerm", label: "Βραχυπρόθεσμη Ενοικίαση" },
    { value: "LongTerm", label: "Μακροπρόθεσμη Ενοικίαση" },
    { value: "Sale", label: "Πώληση" },
    { value: "Wait", label: "Αναμονή" },
    { value: "Own", label: "Ιδιοκατοίκηση" },
  ];

  useEffect(() => {
    if (show) {
      setMarket(property.market || "");
    }
  }, [show, property]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        UPDATE_PROPERTY + property.property_id + "/",
        { market: market || null },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Market updated successfully", "success");
      if (update_state) update_state(response.data);
      handleClose();
    } catch (e) {
      console.error('Error updating market:', e);
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update market";
      Swal.fire("Error", apiMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Market</Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Market</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Market:</Form.Label>
              <Form.Control
                as="select"
                value={market}
                onChange={(e) => setMarket(e.target.value)}
              >
                {marketChoices.map((choice) => (
                  <option key={choice.value} value={choice.value}>
                    {choice.label}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: "green" }}>Looks good.</div></small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Property Broker Modal
export function EditPropertyBrokerModal({ property, update_state }) {
  const [show, setShow] = useState(false);
  const [broker, setBroker] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setBroker(property.broker || "");
    }
  }, [show, property]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        UPDATE_PROPERTY + property.property_id + "/",
        { broker: broker.trim() || null },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Broker updated successfully", "success");
      if (update_state) update_state(response.data);
      handleClose();
    } catch (e) {
      console.error('Error updating broker:', e);
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update broker";
      Swal.fire("Error", apiMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Broker</Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Broker</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Broker:</Form.Label>
              <Form.Control
                type="text"
                value={broker}
                onChange={(e) => setBroker(e.target.value)}
                placeholder="Enter broker name"
                maxLength={120}
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: "green" }}>Looks good.</div></small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Property Active Modal
export function EditPropertyActiveModal({ property, update_state }) {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setActive(property.active || false);
    }
  }, [show, property]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        UPDATE_PROPERTY + property.property_id + "/",
        { active: active },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Active status updated successfully", "success");
      if (update_state) update_state(response.data);
      handleClose();
    } catch (e) {
      console.error('Error updating active status:', e);
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update active status";
      Swal.fire("Error", apiMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Active</Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Active Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Is Active Property"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: "green" }}>Looks good.</div></small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Property Notes Modal
export function EditPropertyNotesModal({ property, update_state }) {
  const [show, setShow] = useState(false);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setNotes(property.notes || "");
    }
  }, [show, property]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        UPDATE_PROPERTY + property.property_id + "/",
        { notes: notes.trim() || null },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Notes updated successfully", "success");
      if (update_state) update_state(response.data);
      handleClose();
    } catch (e) {
      console.error('Error updating notes:', e);
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update notes";
      Swal.fire("Error", apiMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Notes</Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Notes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Notes:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter notes"
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: "green" }}>Looks good.</div></small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
