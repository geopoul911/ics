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
import { FaIdBadge, FaStickyNote, FaStop } from "react-icons/fa";
import {
  EditTaxProjClientModal,
  EditTaxProjConsultantModal,
  EditTaxProjTaxUseModal,
  EditTaxProjDeadlineModal,
  EditTaxProjDeclaredModal,
  EditTaxProjDeclarationDateModal,
  EditTaxProjCommentModal,
} from "../../../modals/taxation_project_edit_modals";

// Global Variables
import { headers } from "../../../global_vars";

// API endpoint
const VIEW_TAXATION = "https://ultima.icsgr.com/api/data_management/taxation_project/";

function TaxationProjectOverview() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const currentHeaders = {
          ...headers,
          "Authorization": "Token " + localStorage.getItem("userToken")
        };

        const response = await axios.get(`${VIEW_TAXATION}${id}/`, {
          headers: currentHeaders,
        });

        setItem(response.data);
        setIsLoaded(true);
      } catch (e) {
        console.error('Error fetching taxation project:', e);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load taxation project. Please try again.",
        });
        setIsLoaded(true);
      }
    };

    fetchItem();
  }, [id]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!item) {
    return <div>No taxation project found.</div>;
  }

  return (
    <>
      <NavigationBar />
      <div className="mainContainer">
        {pageHeader("taxation_project_overview", `Taxation Project: ${item.taxproj_id}`)}
        <div className="contentContainer">
          <div className="contentBody">
            <Grid stackable columns={2} divided>
              <Grid.Column>
                <Card>
                  <Card.Header><FaIdBadge style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Basic Information</Card.Header>
                  <Card.Body>
                    <div className={"info_descr"}><FaIdBadge style={{ color: "#93ab3c", marginRight: "0.5em" }} /> ID</div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {item.taxproj_id}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <Button size="tiny" basic disabled title="ID is immutable"><FaStop style={{ marginRight: 6, color: "red" }} />ID</Button>
                      </span>
                    </div>

                    <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Client</div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {item.client ? `${item.client.surname} ${item.client.name}` : 'N/A'}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <EditTaxProjClientModal item={item} update_state={setItem} />
                      </span>
                    </div>

                    <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Consultant</div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {item.consultant?.fullname || 'N/A'}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <EditTaxProjConsultantModal item={item} update_state={setItem} />
                      </span>
                    </div>

                    <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Tax Use</div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {item.taxuse}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <EditTaxProjTaxUseModal item={item} update_state={setItem} />
                      </span>
                    </div>

                    <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Deadline</div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {item.deadline || 'N/A'}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <EditTaxProjDeadlineModal item={item} update_state={setItem} />
                      </span>
                    </div>
                  </Card.Body>
                  <Card.Footer>
                    <DeleteObjectModal objectType="TaxationProject" objectId={item.taxproj_id} objectName={item.taxproj_id} />
                  </Card.Footer>
                </Card>
              </Grid.Column>

              <Grid.Column>
                <Card>
                  <Card.Header><FaStickyNote style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Status</Card.Header>
                  <Card.Body>
                    <div className={"info_descr"}><FaStickyNote style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Declared</div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {item.declaredone ? 'Yes' : 'No'}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <EditTaxProjDeclaredModal item={item} update_state={setItem} />
                      </span>
                    </div>

                    {item.declaredone && (
                      <>
                        <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Declaration Date</div>
                        <div className={"info_span"} style={{ position: "relative" }}>
                          {item.declarationdate || 'N/A'}
                          <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                            <EditTaxProjDeclarationDateModal item={item} update_state={setItem} />
                          </span>
                        </div>
                      </>
                    )}
                  </Card.Body>
                </Card>
                <Card style={{ marginTop: 16 }}>
                  <Card.Header><FaStickyNote style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Comment</Card.Header>
                  <Card.Body>
                    <div className={"info_descr"}><FaStickyNote style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Comment</div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {item.comment || 'N/A'}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <EditTaxProjCommentModal item={item} update_state={setItem} />
                      </span>
                    </div>
                  </Card.Body>
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

export default TaxationProjectOverview;
