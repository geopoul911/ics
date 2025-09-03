// Built-ins
import React from "react";

// Icons / Images
import { BsInfoSquare } from "react-icons/bs";
import { FaHashtag, FaStop } from "react-icons/fa";

// Modules / Functions
import { Card } from "react-bootstrap";
import { Grid, Button } from "semantic-ui-react";
import Swal from "sweetalert2";

// Custom Made Components
import NavigationBar from "../../../core/navigation_bar/navigation_bar";
import Footer from "../../../core/footer/footer";
import DeleteObjectModal from "../../../modals/delete_object";
import {
  EditProfessionTitleModal,
} from "../../../modals/profession_edit_modals";
import axios from "axios";

// Global Variables
import {
  headers,
  pageHeader,
  loader,
} from "../../../global_vars";

// API endpoint for profession
const VIEW_PROFESSION = "http://localhost:8000/api/administration/profession/";

// Helpers to read URL like: /administration/profession/<profession_id>
function getProfessionIdFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean); // removes '' from // or trailing /
  const idx = parts.indexOf("profession");
  if (idx === -1) return null;
  const id = parts[idx + 1] || null;
  return id ? decodeURIComponent(id) : null;
}

let overviewIconStyle = { color: "#2a9fd9", marginRight: "0.5em" };

class ProfessionOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profession: {},
      is_loaded: false,
    };
  }

  componentDidMount() {
    // Update headers with current token
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    const professionId = getProfessionIdFromPath();

    axios
      .get(`${VIEW_PROFESSION}${professionId}/`, { headers: currentHeaders })
      .then((res) => {
        // Accept a few possible payload shapes safely
        const profession =
          res?.data ||
          {};

        this.setState({
          profession,
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

  // When modals return a fresh object, replace state.profession
  update_state = (updated) => {
    this.setState({ profession: updated });
  };

  render() {
    const { profession } = this.state;
    
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("profession_overview", `Profession: ${profession.title || 'Loading...'}`)}
          {this.state.is_loaded ? (
            <>
              <Grid stackable columns={2} divided>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <BsInfoSquare
                        style={{
                          color: "#2a9fd9",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      Basic Information
                    </Card.Header>
                    <Card.Body>
                      {/* Profession ID */}
                      <div className={"info_descr"}>
                        <FaHashtag style={overviewIconStyle} /> Profession ID
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {profession.profession_id ? profession.profession_id : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <Button size="tiny" basic disabled>
                            <FaStop style={{ marginRight: 6, color: "red" }} title="Profession ID is immutable"/>
                            ID
                          </Button>
                        </span>
                      </div>

                      {/* Title */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <BsInfoSquare style={overviewIconStyle} /> Title
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {profession.title ? profession.title : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditProfessionTitleModal
                            profession={profession}
                            onProfessionUpdated={this.update_state}
                          />
                        </span>
                      </div>
                    </Card.Body>
                    <Card.Footer>
                      <DeleteObjectModal
                        objectId={profession.profession_id}
                        objectName={profession.title}
                        objectType="Profession"
                        warningMessage="This will also delete all professionals associated with this profession."
                        onObjectDeleted={() => {
                          window.location.href = "/administration/all_professions";
                        }}
                      />
                    </Card.Footer>
                  </Card>
                </Grid.Column>
              </Grid>
            </>
          ) : (
            loader()
          )}
        </div>
        <Footer />
      </>
    );
  }
}

export default ProfessionOverview;
