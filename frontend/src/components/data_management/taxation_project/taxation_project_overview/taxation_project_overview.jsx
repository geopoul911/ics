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
const VIEW_TAXATION = "http://localhost:8000/api/data_management/taxation_project/";

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
                  <Card.Header>Basic Information</Card.Header>
                  <Card.Body>
                    <div className={"info_descr"}>ID</div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {item.taxproj_id}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <Button size="tiny" basic disabled title="ID is immutable">ID</Button>
                      </span>
                    </div>

                    <div className={"info_descr"} style={{ marginTop: 16 }}>Client</div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {item.client ? `${item.client.surname} ${item.client.name}` : 'N/A'}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <EditTaxProjClientModal item={item} update_state={setItem} />
                      </span>
                    </div>

                    <div className={"info_descr"} style={{ marginTop: 16 }}>Consultant</div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {item.consultant?.fullname || 'N/A'}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <EditTaxProjConsultantModal item={item} update_state={setItem} />
                      </span>
                    </div>

                    <div className={"info_descr"} style={{ marginTop: 16 }}>Tax Use</div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {item.taxuse}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <EditTaxProjTaxUseModal item={item} update_state={setItem} />
                      </span>
                    </div>

                    <div className={"info_descr"} style={{ marginTop: 16 }}>Deadline</div>
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
                  <Card.Header>Status</Card.Header>
                  <Card.Body>
                    <div className={"info_descr"}>Declared</div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {item.declaredone ? 'Yes' : 'No'}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <EditTaxProjDeclaredModal item={item} update_state={setItem} />
                      </span>
                    </div>

                    {item.declaredone && (
                      <>
                        <div className={"info_descr"} style={{ marginTop: 16 }}>Declaration Date</div>
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
                  <Card.Header>Comment</Card.Header>
                  <Card.Body>
                    <div className={"info_descr"}>Comment</div>
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
