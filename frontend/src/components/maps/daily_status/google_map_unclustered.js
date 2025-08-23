// Built-ins
import React, { useState, useRef } from "react";

// Modules / Functions
import GoogleMapReact from "google-map-react";
import { Card } from "react-bootstrap";

// Icons / Images
import { AiOutlinePhone } from "react-icons/ai";
import { GiSteeringWheel } from "react-icons/gi";
import { MdGroup } from "react-icons/md";
import { FaHotel } from "react-icons/fa";
import { FcBusinessman } from "react-icons/fc";
import { BiBriefcase } from "react-icons/bi";
import { AiFillStar } from "react-icons/ai";
import { BsStarHalf } from "react-icons/bs";
import { AiOutlineStar } from "react-icons/ai";

const modifyLongitude = (longitude, counter) => {
  let magic_number = 0.0007 * counter;
  return (longitude += magic_number);
};

// Variables
let starStyle = {
  color: "orange",
  fontSize: "1.5em",
  display: "inline-block",
};

const icons_style = {
  color: "#F3702D",
  fontSize: "1.5em",
  marginRight: "0.5em",
};

const calculateHotelStars = (rating) => {
  let results = [];
  let string_rating = "";

  // if rating = na , error
  if (rating === null) {
    string_rating = 0;
  } else {
    string_rating = rating.toString();
  }

  let fullStars = string_rating[0];
  let halfStars = string_rating[1];
  let emptyStars = 5 - parseInt(rating / 10);
  // full stars loop
  for (var i = 0; i < Number(fullStars); i++) {
    results.push(<AiFillStar style={starStyle} />);
  }
  // half star
  if (halfStars !== "0") {
    results.push(
      <BsStarHalf
        style={{ color: "orange", fontSize: "1.3em", display: "inline-block" }}
      />
    );
  }
  // empty star
  for (var l = 0; l < Number(emptyStars); l++) {
    if (fullStars === "4" && halfStars !== "0") {
    } else {
      results.push(<AiOutlineStar style={starStyle} />);
    }
  }
  return results;
};

function GroupMarker(props) {
  const [visibility, setVisibility] = useState(false);

  return (
    <div
      onMouseEnter={() => {
        setVisibility(true);
      }}
      onMouseLeave={() => {
        setVisibility(false);
      }}
    >
      {props.td.group_transfer.agent !== null ? (
          <img src={"http://localhost:8000" + props.td.group_transfer.agent.icon} alt="Agent Icon"/>
      ) : (
        ""
      )}
      {props.td.is_last_travelday ? (
        <img src={"http://localhost:8000/dj_static/images/agent_icons/./departure.png"} alt="Departure Icon"/>
      ) : (
        ""
      )}

      <Card
        border="primary"
        className="marker_tooltip"
        style={{ visibility: visibility ? "visible" : "hidden" }}
      >
        <Card.Header>
          <GiSteeringWheel style={icons_style} />
          {props.td.driver ? (
            <>
              <a
                href={"/data_management/driver/" + props.td.driver.id}
                target="_blank"
                rel="noreferrer"
              >
                {props.td.driver.name}
              </a>
            </>
          ) : (
            "N/A"
          )}
        </Card.Header>
        <Card.Body>
          <Card.Title>
            <MdGroup style={icons_style} />
            {props.td.group_transfer ? (
              <>
                <a
                  href={
                    "/group_management/group/" + props.td.group_transfer.refcode
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  {props.td.group_transfer.refcode}
                </a>
              </>
            ) : (
              "N/A"
            )}
          </Card.Title>
          <Card.Text>
            <hr style={{ margin: 0, padding: 0 }} />
            <ul>
              <li>
                <FcBusinessman style={icons_style} />
                Operator :
                {props.td.coach ? (
                  <>
                    <a
                      href={
                        "/data_management/coach_operator/" +
                        props.td.coach.coach_operator.id
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      {props.td.coach.coach_operator.name}
                    </a>
                  </>
                ) : (
                  "N/A"
                )}
              </li>
              <li>
                <BiBriefcase style={icons_style} />
                {props.td.group_transfer.agent ? "Agent : " : "Client : "}

                {props.td.group_transfer.agent ? (
                  <>
                    <a
                      href={
                        "/data_management/agent/" +
                        props.td.group_transfer.agent.id
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      {props.td.group_transfer.agent.name}
                    </a>
                  </>
                ) : (
                  <>
                    <a
                      href={
                        "/data_management/client/" +
                        props.td.group_transfer.client.id
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      {props.td.group_transfer.client.name}
                    </a>
                  </>
                )}
              </li>
              <li>
                <AiOutlinePhone style={icons_style} />
                Driver tel : {props.td.driver ? props.td.driver.tel : "N/A"}
              </li>
              <li>
                <FaHotel style={icons_style} />
                {props.td.hotel ? (
                  <>
                    <a
                      href={"/data_management/hotel/" + props.td.hotel.id}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {props.td.hotel.name}
                    </a>
                    <span style={{ display: "block", textAlign: "center" }}>
                      {calculateHotelStars(props.td.hotel.rating)}
                    </span>
                  </>
                ) : (
                  "N/A"
                )}
              </li>
            </ul>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

export default function Google_Map(props) {
  const mapRef = useRef();
  const data = props.data;

  let longitude_array = [];

  const points = data.map((td) => {
    if (td.hotel) {
      return {
        type: "Feature",
        properties: { cluster: false, id: td.id },
        geometry: {
          type: "Point",
          coordinates: [
            parseFloat(td.hotel ? td.hotel.lng : null),
            parseFloat(td.hotel ? td.hotel.lat : null),
          ],
        },
        td: td,
      };
    } else if (td.place) {
      return {
        type: "Feature",
        properties: { cluster: false, id: td.id },
        geometry: {
          type: "Point",
          coordinates: [
            parseFloat(td.place ? td.place.lng : null),
            parseFloat(td.place ? td.place.lat : null),
          ],
        },
        td: td,
      };
    } else if (td.is_last_travelday) {

      return {
        type: "Feature",
        properties: { cluster: false, id: td.id },
        geometry: {
          type: "Point",
          coordinates: [
            parseFloat(td.airport_lat ? td.airport_lng : null),
            parseFloat(td.airport_lng ? td.airport_lat : null),
          ],
        },
        td: td,
      };
    }
    else {
      return {
        type: "Feature",
        properties: { cluster: false, id: td.id },
        geometry: {
          type: "Point",
          coordinates: [parseFloat(null), parseFloat(null)],
        },
        td: td,
      };
    }
  });

  let counter = 1;

  return (
    <div style={{ height: "60vh" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyDZ84j6p11XCwuAfAge8IoOu2a-omdTCbc" }}
        defaultCenter={{ lat: 49.26959, lng: 16.97782 }}
        defaultZoom={4}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map }) => {
          mapRef.current = map;
        }}
      >
        {points.map((poi) => {
          let [longitude, latitude] = poi.geometry.coordinates;
          longitude_array.push(longitude);
          
          if (isNaN(latitude) || isNaN(longitude)) {
            // eslint-disable-next-line
            return;
          } else {

            if (new Set(longitude_array).size !== longitude_array.length) {
              // code block for same coordinates
              longitude = modifyLongitude(longitude, counter);
              counter += 1;
            }

            return (
              <GroupMarker
                key={poi.id}
                lat={latitude}
                lng={longitude}
                td={poi.td}
              />
            );
          }
        })}
      </GoogleMapReact>
    </div>
  );
}
