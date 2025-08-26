// Built-ins
import React from "react";

// Icons / Images
import { FaHashtag, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { BsInfoSquare } from "react-icons/bs";
import axios from "axios";

// Modules / Functions
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import {
  headers,
  pageHeader,
} from "../../global_vars";

// API (adjust port/path to match your backend)
const VIEW_CLIENT = "http://localhost:8000/api/data_management/clients/";

// Helpers to read URL like: /data_management/clients/<client_id>
function getClientIdFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const idx = parts.indexOf("clients");
  if (idx === -1) return null;
  const id = parts[idx + 1] || null;
  return id ? decodeURIComponent(id) : null;
}

let overviewIconStyle = { color: "#F3702D", marginRight: "0.5em" };

class ClientDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      client: {},
      is_loaded: false,
    };
  }

  componentDidMount() {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");

    const clientId = getClientIdFromPath();

    axios
      .get(`${VIEW_CLIENT}${clientId}`, { headers })
      .then((res) => {
        const client = res?.data?.client || res?.data || {};

        this.setState({
          client,
          is_loaded: true,
        });
      })
      .catch((e) => {
        if (e?.response?.status === 401) {
          this.setState({ forbidden: true });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An unknown error has occurred.",
          });
        }
      });
  }

  render() {
    const { client } = this.state;
    return (
      <>
        <div className="mainContainer">
          {pageHeader("client_overview", `${client.surname} ${client.name}`)}
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
                      Client Information
                    </Card.Header>
                  <Card.Body>
                    {/* Client ID */}
                    <div className={"info_descr"}>
                      <FaHashtag style={overviewIconStyle} /> Client ID
                    </div>
                    <div className={"info_span"}>
                      {client.client_id ? client.client_id : "N/A"}
                    </div>

                    {/* Name */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaUser style={overviewIconStyle} /> Name
                    </div>
                    <div className={"info_span"}>
                      {client.name ? client.name : "N/A"}
                    </div>

                    {/* Surname */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaUser style={overviewIconStyle} /> Surname
                    </div>
                    <div className={"info_span"}>
                      {client.surname ? client.surname : "N/A"}
                    </div>

                    {/* Email */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaEnvelope style={overviewIconStyle} /> Email
                    </div>
                    <div className={"info_span"}>
                      {client.email ? client.email : "N/A"}
                    </div>

                    {/* Phone */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaPhone style={overviewIconStyle} /> Phone
                    </div>
                    <div className={"info_span"}>
                      {client.phone1 ? client.phone1 : "N/A"}
                    </div>

                    {/* City */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaMapMarkerAlt style={overviewIconStyle} /> City
                    </div>
                    <div className={"info_span"}>
                      {client.city?.title ? client.city.title : "N/A"}
                    </div>

                    {/* Status */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaHashtag style={overviewIconStyle} /> Status
                    </div>
                    <div className={"info_span"}>
                      {client.active ? "Active" : "Inactive"}
                    </div>
                  </Card.Body>
                  </Card>
                </Grid.Column>
              </Grid>
        </div>
      </>
    );
  }
}

export default ClientDetail;
