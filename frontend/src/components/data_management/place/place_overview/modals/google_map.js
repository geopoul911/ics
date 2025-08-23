// Built-ins
import React, { useRef } from "react";

// Custom Made Components
import GoogleMapReact from "google-map-react";

// Icons / Images
import MarkerImage from "../../../../../images/generic/pin_red.png";

function GroupMarker() {
  return (
    <div className="marker">
      <img
        src={MarkerImage}
        alt="group"
        style={{
          cursor: "pointer",
          marginTop: -40,
          marginLeft: -8,
          maxHeight: 26,
        }}
      />
    </div>
  );
}

export default function Google_Map(props) {
  const mapRef = useRef();
  const place = props.place;

  return (
    <div style={{ height: "34vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyDZ84j6p11XCwuAfAge8IoOu2a-omdTCbc" }}
        center={{ lat: place.lat, lng: place.lng }}
        defaultZoom={10}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map }) => {
          mapRef.current = map;
        }}
      >
        <GroupMarker lat={place.lat} lng={place.lng} />
      </GoogleMapReact>
    </div>
  );
}
