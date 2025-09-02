// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../../core/navigation_bar/navigation_bar";
import Footer from "../../../core/footer/footer";

// Icons / Images
import { BsInfoSquare } from "react-icons/bs";

// Modules / Functions
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import axios from "axios";

// Global Variables
import { headers, pageHeader } from "../../../global_vars";
import {
  EditPropertyIdModal,
  EditPropertyDescriptionModal,
  EditPropertyProjectModal,
  EditPropertyCountryModal,
  EditPropertyProvinceModal,
  EditPropertyCityModal,
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

const VIEW_PROPERTY = "http://localhost:8000/api/data_management/property/";

function getPropertyIdFromPath() {
  const pathParts = window.location.pathname.split('/');
  return pathParts[pathParts.length - 1];
}

let overviewIconStyle = { color: "#2a9fd9", marginRight: "0.5em" };

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
          {pageHeader("property_overview", property.property_id || "Not set")}
          <div className="contentContainer">
            <div className="contentBody">
              <Grid>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <Card>
                      <Card.Header>
                        <BsInfoSquare style={overviewIconStyle} />
                        Property Information
                      </Card.Header>
                      <Card.Body>
                        <Grid>
                          <Grid.Row>
                            <Grid.Column width={8}>
                              <p>
                                <strong>Property ID:</strong> {property.property_id || "Not set"}
                                <EditPropertyIdModal
                                  property={property}
                                  update_state={this.update_state}
                                />
                              </p>
                            </Grid.Column>
                            <Grid.Column width={8}>
                              <p>
                                <strong>Description:</strong> {property.description || "Not set"}
                                <EditPropertyDescriptionModal
                                  property={property}
                                  update_state={this.update_state}
                                />
                              </p>
                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row>
                            <Grid.Column width={8}>
                              <p>
                                <strong>Project:</strong> {property.project?.title || "Not set"}
                                <EditPropertyProjectModal
                                  property={property}
                                  update_state={this.update_state}
                                />
                              </p>
                            </Grid.Column>
                            <Grid.Column width={8}>
                              <p>
                                <strong>Type:</strong> {property.type || "Not set"}
                                <EditPropertyTypeModal
                                  property={property}
                                  update_state={this.update_state}
                                />
                              </p>
                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row>
                            <Grid.Column width={8}>
                              <p>
                                <strong>Location:</strong> {property.location || "Not set"}
                                <EditPropertyLocationModal
                                  property={property}
                                  update_state={this.update_state}
                                />
                              </p>
                            </Grid.Column>
                            <Grid.Column width={8}>
                              <p>
                                <strong>Construction Year:</strong> {property.constructyear || "Not set"}
                                <EditPropertyConstructYearModal
                                  property={property}
                                  update_state={this.update_state}
                                />
                              </p>
                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row>
                            <Grid.Column width={8}>
                              <p>
                                <strong>Country:</strong> {property.country?.name || "Not set"}
                                <EditPropertyCountryModal
                                  property={property}
                                  update_state={this.update_state}
                                />
                              </p>
                            </Grid.Column>
                            <Grid.Column width={8}>
                              <p>
                                <strong>Province:</strong> {property.province?.name || "Not set"}
                                <EditPropertyProvinceModal
                                  property={property}
                                  update_state={this.update_state}
                                />
                              </p>
                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row>
                            <Grid.Column width={8}>
                              <p>
                                <strong>City:</strong> {property.city?.name || "Not set"}
                                <EditPropertyCityModal
                                  property={property}
                                  update_state={this.update_state}
                                />
                              </p>
                            </Grid.Column>
                            <Grid.Column width={8}>
                              <p>
                                <strong>Status:</strong> {property.status || "Not set"}
                                <EditPropertyStatusModal
                                  property={property}
                                  update_state={this.update_state}
                                />
                              </p>
                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row>
                            <Grid.Column width={8}>
                              <p>
                                <strong>Market:</strong> {property.market || "Not set"}
                                <EditPropertyMarketModal
                                  property={property}
                                  update_state={this.update_state}
                                />
                              </p>
                            </Grid.Column>
                            <Grid.Column width={8}>
                              <p>
                                <strong>Active:</strong> {property.active ? "Yes" : "No"}
                                <EditPropertyActiveModal
                                  property={property}
                                  update_state={this.update_state}
                                />
                              </p>
                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row>
                            <Grid.Column width={16}>
                              <p>
                                <strong>Broker:</strong> {property.broker || "Not set"}
                                <EditPropertyBrokerModal
                                  property={property}
                                  update_state={this.update_state}
                                />
                              </p>
                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row>
                            <Grid.Column width={16}>
                              <p>
                                <strong>Notes:</strong> {property.notes || "Not set"}
                                <EditPropertyNotesModal
                                  property={property}
                                  update_state={this.update_state}
                                />
                              </p>
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      </Card.Body>
                    </Card>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <DeleteObjectModal
                      objectType="property"
                      objectId={property.property_id}
                      objectName={property.property_id}
                    />
                  </Grid.Column>
                </Grid.Row>
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
