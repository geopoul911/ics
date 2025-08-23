// Built-Ins
import React, { Component } from "react";

// Modules / Functions
import GoogleMapReact from "google-map-react";
import Swal from "sweetalert2";

// Variables
window.Swal = Swal;

class GoogleMaps extends Component {
  constructor(props) {
    super(props);

    this.state = {
      source: { lat: 37.98146, lng: 23.72762 },
      dst: { lat: 37.98146, lng: 23.72762 },
    };
  }

  render() {
    const apiIsLoaded = (map, maps) => {
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);
      var renderOptions = { draggable: true };
      var directionDisplay = new window.google.maps.DirectionsRenderer(
        renderOptions
      );
      directionDisplay.setMap(map);
      // set the directions display panel
      // panel is usually just and empty div.
      // This is where the turn by turn directions appear.
      directionDisplay.setPanel();

      const waypoints = [];
      let hotels = [];

      // We also need to determine if its an airport/hotel/place giving the coordinates.
      // http://localhost:3000/group/TRB-AIR07112019XA
      // Check Errors in null values

      // eslint-disable-next-line
      this.props.group.group_travelday.map((td, index, array) => {
        if (td.hotel && !hotels.includes(td.hotel.id)) {
          waypoints.push({
            location: new window.google.maps.LatLng(td.hotel.lat, td.hotel.lng),
          });
          hotels.push(td.hotel.id);
        }
      });
      if (
        this.props.group.group_travelday.length > 0 &&
        this.props.departure_lat !== null &&
        this.props.group.group_travelday[0].hotel
      ) {
        directionsService.route(
          {
            origin: {
              location: new window.google.maps.LatLng(
                this.props.arrival_lat,
                this.props.arrival_lng
              ),
            },
            destination: {
              location: new window.google.maps.LatLng(
                this.props.departure_lat,
                this.props.departure_lng
              ),
            },
            travelMode: window.google.maps.TravelMode.DRIVING,
            waypoints: waypoints.slice(1),
          },
          (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              directionsRenderer.setDirections(result);
            } else {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "Directions request returned no results. Please Validate your Arrival, Departure and Schedule data.",
              });
            }
          }
        );
      }
    };
    return (
      <div style={{ height: "600px", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: "AIzaSyDZ84j6p11XCwuAfAge8IoOu2a-omdTCbc",
          }}
          defaultCenter={this.state.source}
          defaultZoom={4}
          center={this.state.source}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps)}
        />
      </div>
    );
  }
}
export default GoogleMaps;
