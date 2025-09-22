// Built-ins
import React from "react";

// Icons / Images
import { FaStop } from "react-icons/fa";
import { FaIdBadge } from "react-icons/fa";
import { FaUserTag } from "react-icons/fa";

// Modules / Functions
import { Card } from "react-bootstrap";
import { Grid, Button } from "semantic-ui-react";
import Swal from "sweetalert2";
 

// Custom Made Components
import NavigationBar from "../../../core/navigation_bar/navigation_bar";
import Footer from "../../../core/footer/footer";
import DeleteObjectModal from "../../../modals/delete_object";
import AddProfessionalModal from "../../../modals/create/add_professional";
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

// API endpoints
const VIEW_PROFESSION = "https://ultima.icsgr.com/api/administration/profession/";
const ALL_PROFESSIONALS = "https://ultima.icsgr.com/api/data_management/all_professionals/";

// Helpers to read URL like: /administration/profession/<profession_id>
function getProfessionIdFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean); // removes '' from // or trailing /
  const idx = parts.indexOf("profession");
  if (idx === -1) return null;
  const id = parts[idx + 1] || null;
  return id ? decodeURIComponent(id) : null;
}

let overviewIconStyle = { color: "#93ab3c", marginRight: "0.5em" };
let labelPillStyle = { background: "#eef5ff", color: "#2c3e50", padding: "2px 10px", borderRadius: "12px", fontSize: "0.85em", marginRight: "8px", border: "1px solid #d6e4ff" };
let valueTextStyle = { fontWeight: 600, color: "#212529" };

class ProfessionOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profession: {},
      is_loaded: false,
      professionals: [],
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
      .then(async (res) => {
        // Accept a few possible payload shapes safely
        const profession =
          res?.data ||
          {};
        let professionals = profession.professionals || [];
        if (!Array.isArray(professionals) || professionals.length === 0) {
          try {
            const prosRes = await axios.get(ALL_PROFESSIONALS, { headers: currentHeaders });
            const allPros = prosRes?.data?.all_professionals || prosRes?.data?.results || prosRes?.data?.data || prosRes?.data || [];
            const pid = profession.profession_id;
            professionals = (Array.isArray(allPros) ? allPros : []).filter(p => (
              p.profession?.profession_id === pid || p.profession === pid
            ));
          } catch (_e) { professionals = []; }
        }

        this.setState({
          profession,
          professionals,
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
        <style>{`
          .pillLink { color: inherit; text-decoration: none; }
          .pillLink:hover { color: #93ab3c !important; text-decoration: none; }
        `}</style>
        <div className="mainContainer">
          {pageHeader("profession_overview", `Profession: ${profession.title || 'Loading...'}`)}
          {this.state.is_loaded ? (
            <>
              <Grid stackable columns={2} divided>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <FaIdBadge
                        style={{
                          color: "#93ab3c",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      Basic Information
                    </Card.Header>
                    <Card.Body>
                      {/* Profession ID */}
                      <div className={"info_descr"}>
                        <FaIdBadge style={overviewIconStyle} /> Profession ID
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
                        <FaIdBadge style={overviewIconStyle} /> Title
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
                        onObjectDeleted={() => {
                          window.location.href = "/administration/all_professions";
                        }}
                      />
                    </Card.Footer>
                  </Card>
                </Grid.Column>
                <Grid.Column>
                  <Card style={{ marginTop: 20 }}>
                    <Card.Header>
                      <FaUserTag
                        style={{
                          color: "#93ab3c",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      Professionals
                    </Card.Header>
                    <Card.Body>
                      {Array.isArray(this.state.professionals) && this.state.professionals.length > 0 ? (
                        <ul className="list-unstyled" style={{ margin: 0 }}>
                          {this.state.professionals.map((p, idx) => (
                            <li key={p.professional_id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                                <span style={labelPillStyle}>#</span>
                                <span style={valueTextStyle}>{idx + 1}</span>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>ID</span>
                                <a href={`/data_management/professional/${p.professional_id}`} className="pillLink" style={{ ...valueTextStyle }}>{p.professional_id}</a>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Full Name</span>
                                <span style={valueTextStyle}>{p.fullname || 'N/A'}</span>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>City</span>
                                <span style={valueTextStyle}>{p.city?.title || 'N/A'}</span>
                                {p.reliability ? (<>
                                  <span style={{ width: 10 }} />
                                  <span style={labelPillStyle}>Reliability</span>
                                  <span style={valueTextStyle}>{p.reliability}</span>
                                </>) : null}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div>No professionals</div>
                      )}
                    </Card.Body>
                    <Card.Footer>
                      <AddProfessionalModal
                        onProfessionalCreated={() => this.componentDidMount()}
                        defaultProfessionId={this.state.profession?.profession_id}
                        lockProfession={true}
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
