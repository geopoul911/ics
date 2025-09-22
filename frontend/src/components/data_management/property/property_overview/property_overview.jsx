// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../../core/navigation_bar/navigation_bar";
import Footer from "../../../core/footer/footer";

// Icons / Images
import { FaIdBadge, FaStickyNote, FaMapMarkerAlt, FaStop } from "react-icons/fa";

// Modules / Functions
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import axios from "axios";

// Global Variables
import { headers, pageHeader } from "../../../global_vars";
import {
  EditPropertyDescriptionModal,
  EditPropertyProjectModal,
  EditPropertyGeoLocationModal,
  EditPropertyLocationModal,
  EditPropertyTypeModal,
  EditPropertyConstructYearModal,
  EditPropertyStatusModal,
  EditPropertyMarketModal,
  EditPropertyBrokerModal,
  EditPropertyActiveModal,
  EditPropertyNotesModal,
} from "../../../modals/property_edit_modals";
import DeleteObjectModal from "../../../modals/delete_object";

const VIEW_PROPERTY = "https://ultima.icsgr.com/api/data_management/property/";

function getPropertyIdFromPath() {
  const pathParts = window.location.pathname.split('/');
  return pathParts[pathParts.length - 1];
}

let overviewIconStyle = { color: "#93ab3c", marginRight: "0.5em" };

class PropertyOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      property: {},
      is_loaded: false,
    };
  }

  componentDidMount() {
    this.fetchProperty();
  }

  fetchProperty = () => {
    const propertyId = getPropertyIdFromPath();
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    axios
      .get(VIEW_PROPERTY + propertyId + "/", {
        headers: currentHeaders,
      })
      .then((res) => {
        this.setState({
          property: res.data,
          is_loaded: true,
        });
      })
      .catch((e) => {
        console.error("Error fetching property:", e);
        this.setState({
          is_loaded: true,
        });
      });
  };

  update_state = (newData) => {
    this.setState({
      property: { ...this.state.property, ...newData },
    });
  };

  render() {
    const { property, is_loaded } = this.state;

    if (!is_loaded) {
      return (
        <>
          <NavigationBar />
          <div className="mainContainer">
            {pageHeader("property_overview", "Loading...")}
            <div className="contentContainer">
              <div className="contentBody">
                <div>Loading...</div>
              </div>
            </div>
          </div>
          <Footer />
        </>
      );
    }

    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("property_overview", `Property: ${property.property_id || "Loading..."}`)}
          <div className="contentContainer">
            <div className="contentBody">
              <Grid stackable columns={2} divided>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <FaIdBadge style={overviewIconStyle} /> Basic Information
                    </Card.Header>
                    <Card.Body>
                      <div className={"info_descr"}><FaIdBadge style={overviewIconStyle} /> Property ID</div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {property.property_id || "N/A"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <button className="ui button tiny basic" disabled title="ID is immutable"><FaStop style={{ marginRight: 6, color: "red" }} />ID</button>
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}><FaIdBadge style={overviewIconStyle} /> Description</div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {property.description || "N/A"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditPropertyDescriptionModal property={property} update_state={this.update_state} />
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={overviewIconStyle} /> Project</div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {property.project?.title || "N/A"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditPropertyProjectModal property={property} update_state={this.update_state} />
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={overviewIconStyle} /> Type</div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {property.type || "N/A"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditPropertyTypeModal property={property} update_state={this.update_state} />
                        </span>
                      </div>
                    </Card.Body>
                    <Card.Footer>
                      <DeleteObjectModal objectType="Property" objectId={property.property_id} objectName={property.property_id} />
                    </Card.Footer>
                  </Card>
                </Grid.Column>

                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <FaStickyNote style={overviewIconStyle} /> Details
                    </Card.Header>
                    <Card.Body>
                      <div className={"info_descr"}><FaMapMarkerAlt style={overviewIconStyle} /> Location</div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {property.location || "N/A"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditPropertyLocationModal property={property} update_state={this.update_state} />
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={overviewIconStyle} /> Construction Year</div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {property.constructyear || "N/A"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditPropertyConstructYearModal property={property} update_state={this.update_state} />
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}><FaMapMarkerAlt style={overviewIconStyle} /> Location</div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {(property.country?.title || property.country?.name || "N/A") + " / " + (property.province?.title || property.province?.name || "N/A") + " / " + (property.city?.title || property.city?.name || "N/A")}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditPropertyGeoLocationModal property={property} update_state={this.update_state} />
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={overviewIconStyle} /> Status</div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {property.status || "N/A"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditPropertyStatusModal property={property} update_state={this.update_state} />
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={overviewIconStyle} /> Market</div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {property.market || "N/A"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditPropertyMarketModal property={property} update_state={this.update_state} />
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={overviewIconStyle} /> Active</div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {property.active ? 'Yes' : 'No'}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditPropertyActiveModal property={property} update_state={this.update_state} />
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={overviewIconStyle} /> Broker</div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {property.broker || "N/A"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditPropertyBrokerModal property={property} update_state={this.update_state} />
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={overviewIconStyle} /> Notes</div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {property.notes || "N/A"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditPropertyNotesModal property={property} update_state={this.update_state} />
                        </span>
                      </div>
                    </Card.Body>
                  </Card>
                </Grid.Column>
              </Grid>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
}

export default PropertyOverview;
