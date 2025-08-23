// Built-ins
import React from "react";

// Modules / Functions
import axios from "axios";
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import Swal from "sweetalert2";

// Icons / Images
import { BsInfoSquare } from "react-icons/bs";
import { MdBlock } from "react-icons/md";

import { MdOutlineSupportAgent } from "react-icons/md"; // Charter Broker
import { GiPlaneWing } from "react-icons/gi";
import { BsCalendarDate } from "react-icons/bs";

// Custom Made Components
import DeleteObjectModal from "../../../modals/delete_object";
import ChangeYear from "../../../modals/aircrafts/change_year";

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

let overviewIconStyle = { color: "#93ab3c", marginRight: "0.5em" };

const VIEW_AIRCRAFT = "http://localhost:8000/api/data_management/aircraft/";

function getAircraftId() {
  return window.location.pathname.split("/")[3];
}

const aircrafts = {
  "ATR 42": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/ATR_42-500_Hop%21_%28HOP%29_F-GPYK_-_MSN_537_%2810276128103%29.jpg/480px-ATR_42-500_Hop%21_%28HOP%29_F-GPYK_-_MSN_537_%2810276128103%29.jpg",
  "ATR 72": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/F-WWEZ_%28948%29_ATR.72-212A%28500%29_FlyFireFly_TLS_30AUG11_%286097869500%29_%28cropped%29.jpg/300px-F-WWEZ_%28948%29_ATR.72-212A%28500%29_FlyFireFly_TLS_30AUG11_%286097869500%29_%28cropped%29.jpg",
  "Airbus A220": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Airbus_A220-300.jpg/480px-Airbus_A220-300.jpg",
  "Airbus A300": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Iran_Air_Airbus_A300B4-605R_EP-IBD_%2823416357051%29.jpg/480px-Iran_Air_Airbus_A300B4-605R_EP-IBD_%2823416357051%29.jpg",
  "Airbus A310": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Air_Transat_A310_%28C-GTSF%29_%40_LHR%2C_Aug_2009.jpg/480px-Air_Transat_A310_%28C-GTSF%29_%40_LHR%2C_Aug_2009.jpg",
  "Airbus A318": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/F-GUGI_CDG_%2849806325246%29.jpg/480px-F-GUGI_CDG_%2849806325246%29.jpg",
  "Airbus A319": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/United_Airbus_A319_%2813942617705%29.jpg/480px-United_Airbus_A319_%2813942617705%29.jpg",
  "Airbus A320": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Airbus_A320-214%2C_Airbus_Industrie_JP7617615.jpg/480px-Airbus_A320-214%2C_Airbus_Industrie_JP7617615.jpg",
  "Airbus A321": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Airbus_A321-231%28w%29_%E2%80%98N915US%E2%80%99_American_Airlines_%2828442733186%29.jpg/480px-Airbus_A321-231%28w%29_%E2%80%98N915US%E2%80%99_American_Airlines_%2828442733186%29.jpg",
  "Airbus A330": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Turkish_Airlines%2C_Airbus_A330-300_TC-JNL_NRT_%2823708073592%29.jpg/480px-Turkish_Airlines%2C_Airbus_A330-300_TC-JNL_NRT_%2823708073592%29.jpg",
  "Airbus A340": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Turkish_Airlines%2C_Airbus_A330-300_TC-JNL_NRT_%2823708073592%29.jpg/480px-Turkish_Airlines%2C_Airbus_A330-300_TC-JNL_NRT_%2823708073592%29.jpg",
  "Airbus A350": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/EGLF_-_Airbus_A350-941_-_F-WZNW.jpg/480px-EGLF_-_Airbus_A350-941_-_F-WZNW.jpg",
  "Airbus A380": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/A6-EDY_A380_Emirates_31_jan_2013_jfk_%288442269364%29_%28cropped%29.jpg/480px-A6-EDY_A380_Emirates_31_jan_2013_jfk_%288442269364%29_%28cropped%29.jpg",
  "Beechcraft 200 Super King Air": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Royal_Air_Force_King_Air_B200_Training_Aircraft_MOD_45153010.jpg/480px-Royal_Air_Force_King_Air_B200_Training_Aircraft_MOD_45153010.jpg",
  "British Aerospace BAe 146": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Lufthansa.rj85.arp.jpg/480px-Lufthansa.rj85.arp.jpg",
  "Boeing 757": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/N34131_757_United_LIS.jpg/480px-N34131_757_United_LIS.jpg",
  "Boeing 767": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Delta_Air_Lines_B767-332_N130DL.jpg/480px-Delta_Air_Lines_B767-332_N130DL.jpg",
  "Boeing 777": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Cathay_Pacific_Boeing_777-200%3B_B-HNL%40HKG.jpg/480px-Cathay_Pacific_Boeing_777-200%3B_B-HNL%40HKG.jpg",
  "Boeing 787": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Boeing_787_N1015B_ANA_Airlines_%2827611880663%29_%28cropped%29.jpg/480px-Boeing_787_N1015B_ANA_Airlines_%2827611880663%29_%28cropped%29.jpg",
  "Bombardier CRJ-100": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/N466SW_LAX_%2830314755488%29.jpg/480px-N466SW_LAX_%2830314755488%29.jpg",
  "Bombardier CRJ-200": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/N466SW_LAX_%2830314755488%29.jpg/480px-N466SW_LAX_%2830314755488%29.jpg",
  "Bombardier CRJ-700": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/EC-JTU_%288544702097%29.jpg/480px-EC-JTU_%288544702097%29.jpg",
  "Bombardier CRJ-900": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/EC-JTU_%288544702097%29.jpg/480px-EC-JTU_%288544702097%29.jpg",
  "Bombardier Dash 8": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Airberlin_Q400_%28cropped%29.jpg/480px-Airberlin_Q400_%28cropped%29.jpg",
  "CASA C-212 Aviocar": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/CASA_212-200_%E2%80%98T.12D-74_-_54-11%E2%80%99_%2826795714424%29.jpg/480px-CASA_212-200_%E2%80%98T.12D-74_-_54-11%E2%80%99_%2826795714424%29.jpg",
  "Cessna 208": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Iraqi_Air_Force_Cessna_208_Caravan_training_mission.jpg/480px-Iraqi_Air_Force_Cessna_208_Caravan_training_mission.jpg",
  "Cessna 404": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Cessna_404_G-EXEX_IMG_7659_%289502692081%29.jpg/480px-Cessna_404_G-EXEX_IMG_7659_%289502692081%29.jpg",
  "Convair CV5800": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/SAS_Convair_CV-440_Metropolitan%2C_Ivar_Viking_LN-KLB_in_the_air%2C_in_flight.jpg/480px-SAS_Convair_CV-440_Metropolitan%2C_Ivar_Viking_LN-KLB_in_the_air%2C_in_flight.jpg",
  "De Havilland Canada Dash 7": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/De_Havilland_Canada_DHC-7-110_Dash_7%2C_Brymon_Airways_AN2141415.jpg/480px-De_Havilland_Canada_DHC-7-110_Dash_7%2C_Brymon_Airways_AN2141415.jpg",
  "De Havilland Canada Dash 8": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Airberlin_Q400_%28cropped%29.jpg/480px-Airberlin_Q400_%28cropped%29.jpg",
  "Dornier 328": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Sun-Air_Do-328.jpg/480px-Sun-Air_Do-328.jpg",
  "Embraer EMB 121 Xingu": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Xingu.jpg/480px-Xingu.jpg",
  "Embraer EMB 120 Brasilia": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/N569SW_LAX_%2826322494726%29.jpg/480px-N569SW_LAX_%2826322494726%29.jpg",
  "Embraer ERJ 135": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Embraer_ERJ-145LU%2C_Air_France_%28Regional_Compagnie_Aerienne%29_JP6914566.jpg/480px-Embraer_ERJ-145LU%2C_Air_France_%28Regional_Compagnie_Aerienne%29_JP6914566.jpg",
  "Embraer ERJ 140": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Embraer_ERJ-145LU%2C_Air_France_%28Regional_Compagnie_Aerienne%29_JP6914566.jpg/480px-Embraer_ERJ-145LU%2C_Air_France_%28Regional_Compagnie_Aerienne%29_JP6914566.jpg",
  "Embraer ERJ 145": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Embraer_ERJ-145LU%2C_Air_France_%28Regional_Compagnie_Aerienne%29_JP6914566.jpg/480px-Embraer_ERJ-145LU%2C_Air_France_%28Regional_Compagnie_Aerienne%29_JP6914566.jpg",
  "Embraer 170": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/N247JB_KJFK_%2837103752403%29.jpg/480px-N247JB_KJFK_%2837103752403%29.jpg",
  "Embraer 175": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/N247JB_KJFK_%2837103752403%29.jpg/480px-N247JB_KJFK_%2837103752403%29.jpg",
  "Embraer 190": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/N247JB_KJFK_%2837103752403%29.jpg/480px-N247JB_KJFK_%2837103752403%29.jpg",
  "Embraer 195": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/N247JB_KJFK_%2837103752403%29.jpg/480px-N247JB_KJFK_%2837103752403%29.jpg",
  "Fairchild Dornier 328JET": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Cirrus_Airlines_Dornier_328JET%2C_D-BGAQ%40ZRH%2C26.02.2008-502aq_-_Flickr_-_Aero_Icarus.jpg/480px-Cirrus_Airlines_Dornier_328JET%2C_D-BGAQ%40ZRH%2C26.02.2008-502aq_-_Flickr_-_Aero_Icarus.jpg",
  "Fokker 50": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/CityJet_Fokker_50_OO-VLN_LUX_2010-2-27.png/480px-CityJet_Fokker_50_OO-VLN_LUX_2010-2-27.png",
  "Fokker 70": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/PH-JCT_Fokker_70_KLM_cityhopper.JPG/480px-PH-JCT_Fokker_70_KLM_cityhopper.JPG",
  "Fokker 100": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Fokker_100_%28KLM%29_PH-OFN_%2810676665315%29.jpg/480px-Fokker_100_%28KLM%29_PH-OFN_%2810676665315%29.jpg",
  "Sukhoi Superjet 100": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Sukhoi_Superjet_100_%285096752902%29_%28cropped%29.jpg/480px-Sukhoi_Superjet_100_%285096752902%29_%28cropped%29.jpg",
  "Yakovlev Yak-42": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/International_Jet_Tour_Yakovlev_Yak-42D_Nikiforov.jpg/480px-International_Jet_Tour_Yakovlev_Yak-42D_Nikiforov.jpg",
  "Saab 2000": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Etihad_Saab_2000_take_off.jpg/480px-Etihad_Saab_2000_take_off.jpg",
};

class AircraftOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      aircraft: {
        notes: {},
      },
      charter_broker: "",
      is_loaded: false,
    };
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_AIRCRAFT + getAircraftId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          aircraft: res.data.aircraft,
          charter_broker: res.data.charter_broker,
          notes: res.data.aircraft.notes,
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

  update_notes = (notes) => {
    var aircraft = { ...this.state.aircraft };
    aircraft.notes = notes;
    this.setState({
      aircraft: aircraft,
    });
  };

  update_state = (update_state) => {
    this.setState({ aircraft: update_state });
  };

  refresh = () => {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_AIRCRAFT + getAircraftId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          aircraft: res.data.aircraft,
          charter_broker: res.data.charter_broker,
          notes: res.data.aircraft.notes,
          is_loaded: true,
        });
      });
  };

  update_aircraft_op = (charter_broker) => {
    this.setState({ charter_broker: charter_broker });
  };

  render() {
    return (
      <>
        <div className="mainContainer">
          {pageHeader("aircraft_overview", this.state.aircraft.model)}
          {this.state.forbidden ? (
            <>{forbidden("Aircraft Overview")}</>
          ) : this.state.is_loaded ? (
            <>
              <Grid stackable columns={2} divided>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <BsInfoSquare
                        style={{
                          color: "#93ab3c",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      Aircraft Information
                    </Card.Header>
                    <Card.Body>
                      <div className={"info_descr"}>
                        <MdOutlineSupportAgent style={overviewIconStyle} />
                        Charter Broker
                      </div>
                      <div className={"info_span"}>
                        {this.state.aircraft.charter_broker ? this.state.aircraft.charter_broker.name : "N/A"}
                      </div>
                      <MdBlock
                        title={"Aircraft's Charter Broker cannot be changed"}
                        style={{
                          color: "red",
                          fontSize: 16,
                          float: "right",
                          marginTop: 5,
                          cursor: "unset",
                        }}
                        className={"edit_icon"}
                      />
                      <div className={"info_descr"}>
                        <GiPlaneWing style={overviewIconStyle} /> Model
                      </div>
                      <div className={"info_span"}>
                        {this.state.aircraft.model ? this.state.aircraft.model : "N/A"}
                      </div>
                      <MdBlock
                        title={"Aircraft's Model cannot be changed"}
                        style={{
                          color: "red",
                          fontSize: 16,
                          float: "right",
                          marginTop: 5,
                          cursor: "unset",
                        }}
                        className={"edit_icon"}
                      />
                      <div className={"info_descr"}>
                        <BsCalendarDate style={overviewIconStyle} /> Year
                      </div>
                      <div className={"info_span"}>
                        {this.state.aircraft.year ? this.state.aircraft.year : "N/A"}
                      </div>
                      <ChangeYear
                        aircraft_id={this.state.aircraft.id}
                        update_state={this.update_state}
                        year={this.state.aircraft.year ? this.state.aircraft.year : ""}
                      />
                    </Card.Body>
                    <Card.Footer>
                      <DeleteObjectModal
                        object_id={this.state.aircraft.id}
                        object_name={this.state.aircraft.model}
                        object_type={"Aircraft"}
                        update_state={this.update_state}
                      />
                    </Card.Footer>
                  </Card>
                </Grid.Column>
                <Grid.Column width={5}>
                  <Card>
                    <Card.Header>
                      <BsInfoSquare
                        style={{
                          color: "#93ab3c",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      Aircraft's Model Image
                    </Card.Header>
                    <Card.Body>
                    {aircrafts[this.state.aircraft.model] && (
                      <img 
                        src={aircrafts[this.state.aircraft.model]} 
                        alt={this.state.aircraft.model} 
                        style={{ width: '400px', margin: 20, height: 'auto' }} 
                      />
                    )}
                    </Card.Body>
                    <Card.Footer>
                    </Card.Footer>
                  </Card>
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

export default AircraftOverView;
