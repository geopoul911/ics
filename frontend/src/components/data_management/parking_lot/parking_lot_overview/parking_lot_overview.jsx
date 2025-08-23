// Built-ins
import React from "react";

// Icons / Images
import { BsInfoSquare } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaHashtag, FaCheck } from "react-icons/fa";
import { FaAddressCard } from "react-icons/fa";
import { BsFillTelephoneFill } from "react-icons/bs";
import { MdAlternateEmail } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { FaMinus } from "react-icons/fa";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { GiConvergenceTarget } from "react-icons/gi";
import { BsMailbox } from "react-icons/bs";

// Functions / modules
import GoogleMap from "../../../core/map/map";
import axios from "axios";
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import Swal from "sweetalert2";

// Custom Made Components
import ChangeName from "../../../modals/change_name";
import ChangeAddress from "../../../modals/change_address";
import ChangeAddress2 from "../../../modals/change_address2";
import ChangeEmail from "../../../modals/change_email";
import ChangePostal from "../../../modals/change_postal";
import ChangeEnabled from "../../../modals/change_enabled";
import ChangeTel from "../../../modals/change_tel";
import ChangeLatLng from "../../../modals/change_lat_lng";
import ChangeRegion from "../../../modals/change_region";
import DeleteObjectModal from "../../../modals/delete_object";
import Notes from "../../../core/notes/notes";

// Global Variables
import {
  headers,
  loader,
  pageHeader,
  iconStyle,
  forbidden,
  restrictedUsers,
} from "../../../global_vars";

// Variables
const VIEW_PARKING_LOT = "http://localhost:8000/api/data_management/parking_lot/";

let overviewIconStyle = { color: "#F3702D", marginRight: "0.5em" };

function getParkingLotId() {
  return window.location.pathname.split("/")[3];
}

// Variables
window.Swal = Swal;

class ParkingLotOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      parking_lot: {
        notes: [],
      },
      contact_persons: [],
      is_loaded: false,
      forbidden: false,
      show_tel2: false,
      show_address2: false,
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
      .get(VIEW_PARKING_LOT + getParkingLotId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          parking_lot: res.data.parking_lot,
          notes: res.data.parking_lot.notes,
          contact_persons: res.data.parking_lot.contact_persons,
          is_loaded: true,
        });
      })
      .catch((e) => {
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
    this.setState({ parking_lot: update_state });
  };

  update_notes = (notes) => {
    var parking_lot = { ...this.state.parking_lot };
    parking_lot.notes = notes;
    this.setState({
      parking_lot: parking_lot,
    });
  };

  render() {
    return (
      <>
        <div className="mainContainer">
          {pageHeader("parking_lot_overview", this.state.parking_lot.name)}
          {this.state.forbidden ? (
            <> {forbidden("Parking Lot Overview")} </>
          ) : this.state.is_loaded ? (
            <>
              <Grid columns={2} divided stackable>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <BsInfoSquare style={iconStyle} />
                      Parking Lot Information
                    </Card.Header>
                    <Card.Body>
                      <div className={"info_descr"}>
                        <FaHashtag style={overviewIconStyle} /> Name
                      </div>
                      <div className={"info_span"}>
                        {this.state.parking_lot.name ? this.state.parking_lot.name : "N/A"}
                      </div>
                      <ChangeName
                        object_id={this.state.parking_lot.id}
                        object_name={this.state.parking_lot.name}
                        object_type={"ParkingLot"}
                        update_state={this.update_state}
                      />
                      <div className={"info_descr"}>
                        <FaAddressCard style={overviewIconStyle} /> Address
                      </div>
                      <div className={"info_span"}>
                        {this.state.parking_lot.contact.address
                          ? this.state.parking_lot.contact.address
                          : "N/A"}
                      </div>
                      <ChangeAddress
                        object_id={this.state.parking_lot.id}
                        object_name={this.state.parking_lot.name}
                        object_type={"ParkingLot"}
                        update_state={this.update_state}
                        address={this.state.parking_lot.contact.address ? this.state.parking_lot.contact.address : "N/A"}
                      />
                      {this.state.show_address2 ? (
                        <>
                          <div className={"info_descr"}>
                            <FaAddressCard style={overviewIconStyle} /> Address 2
                          </div>
                          <div className={"info_span"}>
                            {this.state.parking_lot.contact.address2 ? this.state.parking_lot.contact.address2 : "N/A"}
                          </div>
                          <FaMinus
                            className="minus-icon"
                            title="Hide address 2"
                            style={{ marginLeft: 20 }}
                            onClick={() => this.setState({ show_address2: false })}
                          />
                          <ChangeAddress2
                            object_id={this.state.parking_lot.id}
                            object_name={this.state.parking_lot.name}
                            object_type={"ParkingLot"}
                            update_state={this.update_state}
                            address={this.state.parking_lot.contact.address2 ? this.state.parking_lot.contact.address2 : "N/A"}
                          />
                        </>
                      ) : (
                        <>
                          <AiOutlinePlusSquare
                            className="plus-icon"
                            title="Show Address 2"
                            style={{ marginLeft: 20 }}
                            onClick={() => this.setState({ show_address2: true })}
                          />
                        </>
                      )}
                      <div className={"info_descr"}>
                        <BsFillTelephoneFill style={overviewIconStyle} /> Tel
                      </div>
                      <div className={"info_span"}>
                        {this.state.parking_lot.contact.tel
                          ? this.state.parking_lot.contact.tel
                          : "N/A"}
                      </div>
                      <ChangeTel
                        object_id={this.state.parking_lot.id}
                        object_name={this.state.parking_lot.name}
                        object_type={"ParkingLot"}
                        tel_num={"tel"}
                        update_state={this.update_state}
                        telephone={this.state.parking_lot.contact.tel ? this.state.parking_lot.contact.tel : "N/A"}
                      />
                      {this.state.show_tel2 ? (
                        <>
                          <div className={"info_descr"}>
                            <BsFillTelephoneFill style={overviewIconStyle} />
                            Tel. 2
                          </div>
                          <div className={"info_span"}>
                            {this.state.parking_lot.contact.tel2 ? this.state.parking_lot.contact.tel2 : "N/A"}
                          </div>

                          <ChangeTel
                            object_id={this.state.parking_lot.id}
                            object_name={this.state.parking_lot.name}
                            object_type={"ParkingLot"}
                            tel_num={"tel2"}
                            update_state={this.update_state}
                            telephone={this.state.parking_lot.contact.tel2 ? this.state.parking_lot.contact.tel2 : "N/A"}
                          />
                          <div className={"info_descr"}>
                            <BsFillTelephoneFill style={overviewIconStyle} />
                            Tel. 3
                          </div>
                          <div className={"info_span"}>
                            {this.state.parking_lot.contact.tel3 ? this.state.parking_lot.contact.tel3 : "N/A"}
                          </div>

                          <FaMinus
                            className="minus-icon"
                            title="Hide address 2"
                            style={{ marginLeft: 20 }}
                            onClick={() => this.setState({ show_tel2: false })}
                          />

                          <ChangeTel
                            object_id={this.state.parking_lot.id}
                            object_name={this.state.parking_lot.name}
                            object_type={"ParkingLot"}
                            tel_num={"tel3"}
                            update_state={this.update_state}
                            telephone={
                              this.state.parking_lot.contact.tel3
                                ? this.state.parking_lot.contact.tel3
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
                        {this.state.parking_lot.contact.email ? this.state.parking_lot.contact.email : "N/A"}
                      </div>
                      <ChangeEmail
                        object_id={this.state.parking_lot.id}
                        object_name={this.state.parking_lot.name}
                        object_type={"ParkingLot"}
                        update_state={this.update_state}
                        email={this.state.parking_lot.contact.email ? this.state.parking_lot.contact.email : "N/A"}
                      />

                      <div className={"info_descr"}>
                        <GiConvergenceTarget style={overviewIconStyle} /> Region
                      </div>

                      <div className={"info_span"}>
                        {this.state.parking_lot.region ? this.state.parking_lot.region : 'N/A'}
                      </div>

                      <ChangeRegion
                        object_id={this.state.parking_lot.id}
                        object_name={this.state.parking_lot.name}
                        object_type={"ParkingLot"}
                        update_state={this.update_state}
                      />

                      <div className={"info_descr"}>
                        <BsMailbox style={overviewIconStyle} />
                        Postal / Zip code
                      </div>
                      <div className={"info_span"}>
                        {this.state.parking_lot.contact.postal ? this.state.parking_lot.contact.postal : "N/A"}
                      </div>
                      <ChangePostal
                        object_id={this.state.parking_lot.id}
                        object_name={this.state.parking_lot.name}
                        object_type={"ParkingLot"}
                        update_state={this.update_state}
                        postal={this.state.parking_lot.contact.postal ? this.state.parking_lot.contact.postal : "N/A"}
                      />

                      <div className={"info_descr"}>
                        <FaMapMarkerAlt style={overviewIconStyle} />
                        Lat / Lng
                      </div>
                      <ChangeLatLng
                        object_id={this.state.parking_lot.id}
                        object_name={this.state.parking_lot.name}
                        object_type={"ParkingLot"}
                        update_state={this.update_state}
                        lat={this.state.parking_lot.lat}
                        lng={this.state.parking_lot.lng}
                      />
                      <div className={"lat_lng_span"}>
                        {this.state.parking_lot.lat ? this.state.parking_lot.lat : "N/A"}
                      </div>
                      <div style={{ marginLeft: 35 }} className={"lat_lng_span"}>
                        {this.state.parking_lot.lng ? this.state.parking_lot.lng : "N/A"}
                      </div>
                      <div className={"info_descr"}>
                        {this.state.parking_lot.enabled ? (<FaCheck style={overviewIconStyle} />) : (<ImCross style={overviewIconStyle} />)}
                        Enabled
                      </div>
                      <div className={"info_span"}>
                        {this.state.parking_lot.enabled ? "Enabled" : "Disabled"}
                      </div>
                      <ChangeEnabled
                        object_id={this.state.parking_lot.id}
                        object_name={this.state.parking_lot.name}
                        object_type={"ParkingLot"}
                        update_state={this.update_state}
                      />
                    </Card.Body>
                    <Card.Footer>
                      <DeleteObjectModal
                        object_id={this.state.parking_lot.id}
                        object_name={this.state.parking_lot.name}
                        object_type={"Parking Lot"}
                        update_state={this.update_state}
                      />
                    </Card.Footer>
                  </Card>
                </Grid.Column>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <FaMapMarkerAlt
                        style={{
                          color: "#F3702D",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      Map with Parking lot's location
                    </Card.Header>
                    {this.state.parking_lot.lat ||
                    this.state.parking_lot.lng ? (
                      <>
                        <Card.Body>
                          <GoogleMap object={this.state.parking_lot} />
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
                        Update latitude / longitude to show parking_lot\'s
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
                        Changing parking_lot's lat/lng will also change the
                        map's pin
                      </small>
                    </Card.Footer>
                  </Card>
                  <Notes
                    update_notes={this.update_notes}
                    object_id={this.state.parking_lot.id}
                    object_name={this.state.parking_lot.name}
                    object_type={"Parking Lot"}
                    update_state={this.update_state}
                    notes={this.state.parking_lot.notes}
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

export default ParkingLotOverView;
