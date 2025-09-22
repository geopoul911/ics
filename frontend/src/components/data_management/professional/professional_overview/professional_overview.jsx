// Built-ins
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Custom Made Components
import NavigationBar from "../../../core/navigation_bar/navigation_bar";
import Footer from "../../../core/footer/footer";
import axios from "axios";

// Modules / Functions
import Swal from "sweetalert2";
import { Card } from "react-bootstrap";
import { Grid, Button } from "semantic-ui-react";
import DeleteObjectModal from "../../../modals/delete_object";
import { pageHeader } from "../../../global_vars";
import { FaIdBadge, FaUser, FaStickyNote, FaStop } from "react-icons/fa";
import AddClientContactModal from "../../../modals/create/add_client_contact";
import {
  EditProfessionalFullnameModal,
  EditProfessionalProfessionModal,
  EditProfessionalCityModal,
  EditProfessionalAddressModal,
  EditProfessionalEmailModal,
  EditProfessionalPhoneModal,
  EditProfessionalMobileModal,
  EditProfessionalReliabilityModal,
  EditProfessionalActiveModal,
  EditProfessionalNotesModal,
} from "../../../modals/professional_edit_modals";

// Global Variables
import { headers } from "../../../global_vars";

// API endpoint
const VIEW_PROFESSIONAL = "https://ultima.icsgr.com/api/data_management/professional/";

function ProfessionalOverview() {
  const { id } = useParams();
  const [professional, setProfessional] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [projectContacts, setProjectContacts] = useState([]);

  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        const currentHeaders = {
          ...headers,
          "Authorization": "Token " + localStorage.getItem("userToken")
        };

        const response = await axios.get(`${VIEW_PROFESSIONAL}${id}/`, {
          headers: currentHeaders,
        });

        const data = response.data || {};
        setProfessional(data);
        setProjectContacts(Array.isArray(data.project_contacts) ? data.project_contacts : []);
        setIsLoaded(true);
      } catch (e) {
        console.error('Error fetching professional:', e);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load professional. Please try again.",
        });
        setIsLoaded(true);
      }
    };

    fetchProfessional();
  }, [id]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!professional) {
    return <div>No professional found.</div>;
  }

  return (
    <>
      <NavigationBar />
      <div className="mainContainer">
        {pageHeader("professional_overview", `Professional: ${professional.professional_id}`)}
        <div className="contentContainer">
          <div className="contentBody">
            <style>{`
              .pillLink { color: inherit; text-decoration: none; }
              .pillLink:hover { color: #93ab3c; text-decoration: none; }
            `}</style>
            <Grid stackable columns={2} divided>
              <Grid.Column>
                <Card>
                  <Card.Header>
                    <FaIdBadge style={{ color: "#93ab3c", marginRight: "0.5em" }} />
                    Basic Information
                  </Card.Header>
                  <Card.Body>
                    <div className={"info_descr"}>
                      <FaIdBadge style={{ color: "#93ab3c", marginRight: "0.5em" }} /> ID
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {professional.professional_id}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <Button size="tiny" basic disabled title="ID is immutable"><FaStop style={{ marginRight: 6, color: "red" }} />ID</Button>
                      </span>
                    </div>

                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaIdBadge style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Full name
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {professional.fullname || 'N/A'}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <EditProfessionalFullnameModal professional={professional} update_state={setProfessional} />
                      </span>
                    </div>

                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaIdBadge style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Profession
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {professional.profession?.title || 'N/A'}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <EditProfessionalProfessionModal professional={professional} update_state={setProfessional} />
                      </span>
                    </div>

                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaIdBadge style={{ color: "#93ab3c", marginRight: "0.5em" }} /> City
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {professional.city?.title || 'N/A'}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <EditProfessionalCityModal professional={professional} update_state={setProfessional} />
                      </span>
                    </div>

                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaIdBadge style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Reliability
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {professional.reliability || 'N/A'}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <EditProfessionalReliabilityModal professional={professional} update_state={setProfessional} />
                      </span>
                    </div>
                  </Card.Body>
                  <Card.Footer>
                    <DeleteObjectModal objectType="Professional" objectId={professional.professional_id} objectName={professional.professional_id} />
                  </Card.Footer>
                </Card>
                <Card style={{ marginTop: 16 }}>
                  <Card.Header>
                    <FaStickyNote style={{ color: "#93ab3c", marginRight: "0.5em" }} />
                    Notes
                  </Card.Header>
                  <Card.Body>
                    <div className={"info_descr"}>
                      <FaStickyNote style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Notes
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {professional.notes || 'N/A'}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <EditProfessionalNotesModal professional={professional} update_state={setProfessional} />
                      </span>
                    </div>
                  </Card.Body>
                </Card>
              </Grid.Column>

              <Grid.Column>
                <Card>
                  <Card.Header>
                    <FaUser style={{ color: "#93ab3c", marginRight: "0.5em" }} />
                    Contact
                  </Card.Header>
                  <Card.Body>
                    <div className={"info_descr"}>
                      <FaUser style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Address
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {professional.address || 'N/A'}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <EditProfessionalAddressModal professional={professional} update_state={setProfessional} />
                      </span>
                    </div>

                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaUser style={{ color: "#93ab3c", marginRight: "0.5em" }} /> E-mail
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {professional.email || 'N/A'}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <EditProfessionalEmailModal professional={professional} update_state={setProfessional} />
                      </span>
                    </div>

                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaUser style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Telephone
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {professional.phone || 'N/A'}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <EditProfessionalPhoneModal professional={professional} update_state={setProfessional} />
                      </span>
                    </div>

                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaUser style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Cell phone
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {professional.mobile || 'N/A'}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <EditProfessionalMobileModal professional={professional} update_state={setProfessional} />
                      </span>
                    </div>

                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaUser style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Active
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {professional.active ? 'Yes' : 'No'}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <EditProfessionalActiveModal professional={professional} update_state={setProfessional} />
                      </span>
                    </div>
                  </Card.Body>
                </Card>

                <Card style={{ marginTop: 16 }}>
                  <Card.Header>
                    <FaUser style={{ color: "#93ab3c", marginRight: "0.5em" }} />
                    Client contacts
                  </Card.Header>
                  <Card.Body>
                    {Array.isArray(projectContacts) && projectContacts.length > 0 ? (
                      <ul className="list-unstyled" style={{ margin: 0 }}>
                        {projectContacts.map((cc, idx) => (
                          <li key={cc.clientcont_id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                              <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '999px', background: '#f5f5f5', color: '#666', fontSize: 12, fontWeight: 600 }}>#</span>
                              <span style={{ fontWeight: 700 }}>{idx + 1}</span>
                              <span style={{ width: 10 }} />
                              <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '999px', background: '#f5f5f5', color: '#666', fontSize: 12, fontWeight: 600 }}>ID</span>
                              <a href={`/data_management/client_contact/${cc.clientcont_id}`} className="pillLink" style={{ fontWeight: 700 }}>{cc.clientcont_id}</a>
                              <span style={{ width: 10 }} />
                              <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '999px', background: '#f5f5f5', color: '#666', fontSize: 12, fontWeight: 600 }}>Full name</span>
                              <span style={{ fontWeight: 700 }}>{cc.fullname}</span>
                              {cc.project?.title ? (<>
                                <span style={{ width: 10 }} />
                                <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '999px', background: '#f5f5f5', color: '#666', fontSize: 12, fontWeight: 600 }}>Project</span>
                                <a href={`/data_management/project/${cc.project.project_id}`} className="pillLink" style={{ fontWeight: 700 }}>{cc.project.title}</a>
                              </>) : null}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div>No client contacts</div>
                    )}
                  </Card.Body>
                  <Card.Footer>
                    <AddClientContactModal defaultProfessionalId={professional.professional_id} lockProfessional={true} refreshData={() => window.location.reload()} />
                  </Card.Footer>
                </Card>

              </Grid.Column>
            </Grid>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProfessionalOverview;
