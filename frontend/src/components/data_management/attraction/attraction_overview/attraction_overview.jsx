// Built-ins
import React from "react";

// Icons-images
import { BsInfoSquare } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";
import { 
  FaHashtag,
  // FaMinus
} from "react-icons/fa";
import { FiType } from "react-icons/fi";
import { GiConvergenceTarget } from "react-icons/gi";
// import { BsFillTelephoneFill } from "react-icons/bs";
// import { MdAlternateEmail } from "react-icons/md";
// import { AiOutlinePlusSquare } from "react-icons/ai";

// Custom Made Components
import GoogleMap from "../../../core/map/map";
import ChangeName from "../../../modals/change_name";
import ChangeAttType from "../../../modals/attractions/change_type";
import ChangeLatLng from "../../../modals/change_lat_lng";
// import ChangeEmail from "../../../modals/change_email";
// import ChangeTel from "../../../modals/change_tel";
import DeleteObjectModal from "../../../modals/delete_object";
import Notes from "../../../core/notes/notes";
import ChangeRegion from "../../../modals/change_region";

// Functions / modules
import axios from "axios";
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import {
  headers,
  loader,
  pageHeader,
  forbidden,
  restrictedUsers,
} from "../../../global_vars";

// Variables
window.Swal = Swal;

const VIEW_ATTRACTION = "http://localhost:8000/api/data_management/attraction/";

const AttractionDescr = {
  HS: "Historical Sites",
  MS: "Museums",
  TP: "Theme Parks",
  NP: "Natural Parks",
  ZA: "Zoos And Aquariums",
  BG: "Botanical Gardens",
  LM: "Landmarks",
  AM: "Architectural Marvels",
  AG: "Art Galleries",
  CF: "Cultural Festivals",
  SA: "Sport Arenas",
  BC: "Beaches and Coastal Areas",
  SD: "Shopping Districts",
  AD: "Adventure Parks",
  SC: "Science Centers",
  OS: "Observatory",
  CP: "Castles and Palaces",
  WV: "Wineries and Vineyards",
  CT: "Culinary Tours",
  CD: "Cathedrals And Churches",
};

function getAttractionId() {
  return window.location.pathname.split("/")[3];
}

let overviewIconStyle = { color: "#F3702D", marginRight: "0.5em" };

// url path = 'http://localhost:3000/attraction/1'
class AttractionOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attraction: {
        notes: [],
      },
      is_loaded: false,
      forbidden: false,
    };
  }

  componentDidMount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_ATTRACTION + getAttractionId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          attraction: res.data.attraction,
          is_loaded: true,
        });
      })
      .catch((e) => {
        console.log(e)
        if (e.response.status === 401) {
          this.setState({
            forbidden: true,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An unknown error has occured.",
          });
        }
      });
  }

  update_state = (update_state) => {
    this.setState({ attraction: update_state });
  };

  update_notes = (notes) => {
    var attraction = { ...this.state.attraction };
    attraction.notes = notes;
    this.setState({
      attraction: attraction,
    });
  };

  render() {
    return (
      <>
        <div className="mainContainer">
          {pageHeader("attraction_overview", this.state.attraction.name)}
          {this.state.forbidden ? (
            <>{forbidden("Museum / Attraction Overview")}</>
          ) : this.state.is_loaded ? (
            <>
              <Grid stackable columns={2} divided>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <BsInfoSquare
                        style={{
                          color: "#F3702D",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      Museum / Attraction Information
                    </Card.Header>
                    <Card.Body>
                      <div className={"info_descr"}>
                        <FaHashtag style={overviewIconStyle} /> Name
                      </div>
                      <div className={"info_span"}>
                        {this.state.attraction.name
                          ? this.state.attraction.name
                          : "N/A"}
                      </div>
                      <ChangeName
                        object_id={this.state.attraction.id}
                        object_name={this.state.attraction.name}
                        object_type={"Attraction"}
                        update_state={this.update_state}
                      />
                      <div className={"info_descr"}>
                        <FiType style={overviewIconStyle} /> Type
                      </div>
                      <div className={"info_span"}>
                        {this.state.attraction.type
                          ? AttractionDescr[this.state.attraction.type]
                          : "N/A"}
                      </div>
                      <ChangeAttType
                        object_id={this.state.attraction.id}
                        object_name={this.state.attraction.name}
                        object_type={"Attraction"}
                        update_state={this.update_state}
                        attraction_type={
                          this.state.attraction.type
                            ? this.state.attraction.type
                            : ""
                        }
                      />
                      <div className={"info_descr"}>
                        <GiConvergenceTarget style={overviewIconStyle} /> Region
                      </div>

                      <div className={"info_span"}>
                        {this.state.attraction.region ? this.state.attraction.region : 'N/A'}
                      </div>

                      <ChangeRegion
                        object_id={this.state.attraction.id}
                        object_name={this.state.attraction.name}
                        object_type={"Attraction"}
                        update_state={this.update_state}
                      />

                        {/* <div className={"info_descr"}>
                          <BsFillTelephoneFill style={overviewIconStyle} /> Tel
                        </div>
                        <div className={"info_span"}>
                          {this.state.attraction.contact.tel
                            ? this.state.attraction.contact.tel
                            : "N/A"}
                        </div>
                        <ChangeTel
                          object_id={this.state.attraction.id}
                          object_name={this.state.attraction.name}
                          object_type={"Attraction"}
                          tel_num={"tel"}
                          update_state={this.update_state}
                          telephone={
                            this.state.attraction.contact.tel
                              ? this.state.attraction.contact.tel
                              : "N/A"
                          }
                        />
                        {this.state.show_tel2 ? (
                          <>
                            <div className={"info_descr"}>
                              <BsFillTelephoneFill style={overviewIconStyle} />
                              Tel. 2
                            </div>
                            <div className={"info_span"}>
                              {this.state.attraction.contact.tel2
                                ? this.state.attraction.contact.tel2
                                : "N/A"}
                            </div>

                            <ChangeTel
                              object_id={this.state.attraction.id}
                              object_name={this.state.attraction.name}
                              object_type={"Attraction"}
                              tel_num={"tel2"}
                              update_state={this.update_state}
                              telephone={
                                this.state.attraction.contact.tel2
                                  ? this.state.attraction.contact.tel2
                                  : "N/A"
                              }
                            />
                            <div className={"info_descr"}>
                              <BsFillTelephoneFill style={overviewIconStyle} />
                              Tel. 3
                            </div>
                            <div className={"info_span"}>
                              {this.state.attraction.contact.tel3
                                ? this.state.attraction.contact.tel3
                                : "N/A"}
                            </div>

                            <FaMinus
                              className="minus-icon"
                              title="Hide address 2"
                              style={{ marginLeft: 20 }}
                              onClick={() =>
                                this.setState({ show_tel2: false })
                              }
                            />

                            <ChangeTel
                              object_id={this.state.attraction.id}
                              object_name={this.state.attraction.name}
                              object_type={"Attraction"}
                              tel_num={"tel3"}
                              update_state={this.update_state}
                              telephone={
                                this.state.attraction.contact.tel3
                                  ? this.state.attraction.contact.tel3
                                  : "N/A"
                              }
                            />
                          </>
                        ) : (
                          <>
                            <AiOutlinePlusSquare
                              className="plus-icon"
                              title="Show Tel 2"
                              style={{ marginLeft: 20 }}
                              onClick={() => this.setState({ show_tel2: true })}
                            />
                          </>
                        )}

                      
                        <div className={"info_descr"}>
                          <MdAlternateEmail style={overviewIconStyle} />
                          Email
                        </div>
                        <div className={"info_span"}>
                          {this.state.attraction.contact.email
                            ? this.state.attraction.contact.email
                            : "N/A"}
                        </div>
                        <ChangeEmail
                          object_id={this.state.attraction.id}
                          object_name={this.state.attraction.name}
                          object_type={"Attraction"}
                          update_state={this.update_state}
                          email={
                            this.state.attraction.contact.email
                              ? this.state.attraction.contact.email
                              : ""
                          }
                        /> */}
                      <div className={"info_descr"}>
                        <FaMapMarkerAlt style={overviewIconStyle} /> Lat / Lng
                      </div>
                      <ChangeLatLng
                        object_id={this.state.attraction.id}
                        object_name={this.state.attraction.name}
                        object_type={"Attraction"}
                        update_state={this.update_state}
                        lat={this.state.attraction.lat}
                        lng={this.state.attraction.lng}
                      />
                      <div className={"lat_lng_span"}>
                        {this.state.attraction.lat
                          ? this.state.attraction.lat
                          : "N/A"}
                      </div>
                      <div
                        style={{ marginLeft: 35 }}
                        className={"lat_lng_span"}
                      >
                        {this.state.attraction.lng
                          ? this.state.attraction.lng
                          : "N/A"}
                      </div>
                    </Card.Body>
                    <Card.Footer>
                      <DeleteObjectModal
                        object_id={this.state.attraction.id}
                        object_name={this.state.attraction.name}
                        object_type={"Attraction"}
                        update_state={this.update_state}
                      />
                    </Card.Footer>
                  </Card>

                  <Card>
                    <Card.Header>
                      <FaMapMarkerAlt
                        style={{
                          color: "#F3702D",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      Map with attraction's location
                    </Card.Header>
                    {this.state.attraction.lat || this.state.attraction.lng ? (
                      <>
                        <Card.Body>
                          <GoogleMap object={this.state.attraction} />
                        </Card.Body>
                      </>
                    ) : (
                      <strong
                        style={{
                          textAlign: "center",
                          margin: 20,
                          padding: 20,
                        }}
                      >
                        Update latitude / longitude to show attraction\'s
                        location on map
                      </strong>
                    )}
                    <Card.Footer>
                      <small className="mr-auto">
                        <BsInfoSquare
                          style={{
                            color: "#F3702D",
                            fontSize: "1.5em",
                            marginRight: "0.5em",
                          }}
                        />
                        Changing attraction's lat/lng will also change the map's
                        pin
                      </small>
                    </Card.Footer>
                  </Card>
                </Grid.Column>
                <Grid.Column>
                  <Notes
                    update_notes={this.update_notes}
                    object_id={this.state.attraction.id}
                    object_name={this.state.attraction.name}
                    object_type={"Attraction"}
                    update_state={this.update_state}
                    notes={this.state.attraction.notes}
                  />
                </Grid.Column>
              </Grid>
            </>
          ) : (
            loader()
          )}
        </div>
      </>
    );
  }
}

export default AttractionOverView;
