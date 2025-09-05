// Built-ins
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import axios from "axios";

// Modules / Functions
import Swal from "sweetalert2";
import { Card } from "react-bootstrap";
import { Grid, Button } from "semantic-ui-react";
import DeleteObjectModal from "../../modals/delete_object";
import { pageHeader } from "../../global_vars";
import { FaIdBadge, FaStickyNote, FaStop } from "react-icons/fa";
import { EditBPAProjectModal, EditBPAClientModal, EditBPABankClientAccountModal, EditBPANotesModal } from "../../modals/bank_project_account_edit_modals";

// Global Variables
import { headers } from "../../global_vars";

// API endpoint
const VIEW_BANK_PROJECT_ACCOUNT = "http://localhost:8000/api/data_management/bank_project_account/";

function BankProjectAccountOverview() {
  const { id } = useParams();
  const [bankProjectAccount, setBankProjectAccount] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchBankProjectAccount = async () => {
      try {
        const currentHeaders = {
          ...headers,
          "Authorization": "Token " + localStorage.getItem("userToken")
        };

        const response = await axios.get(`${VIEW_BANK_PROJECT_ACCOUNT}${id}/`, {
          headers: currentHeaders,
        });

        setBankProjectAccount(response.data);
        setIsLoaded(true);
      } catch (e) {
        console.error('Error fetching bank project account:', e);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load bank project account. Please try again.",
        });
        setIsLoaded(true);
      }
    };

    fetchBankProjectAccount();
  }, [id]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!bankProjectAccount) {
    return <div>No bank project account found.</div>;
  }

  return (
    <>
      <NavigationBar />
      <div className="mainContainer">
        {pageHeader("bank_project_account_overview", `Bank Project Account: ${bankProjectAccount.bankprojacco_id}`)}
        <div className="contentContainer">
          <div className="contentBody">
            <Grid stackable columns={2} divided>
              <Grid.Column>
                <Card>
                  <Card.Header><FaIdBadge style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Basic Information</Card.Header>
                  <Card.Body>
                    <div className={"info_descr"}><FaIdBadge style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Bank Project Account ID</div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {bankProjectAccount.bankprojacco_id}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <Button size="tiny" basic disabled title="ID is immutable"><FaStop style={{ marginRight: 6, color: "red" }} />ID</Button>
                      </span>
                    </div>

                    <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Project</div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {bankProjectAccount.project?.title || 'N/A'}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <EditBPAProjectModal bpa={bankProjectAccount} update_state={setBankProjectAccount} />
                      </span>
                    </div>

                    <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Client</div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {bankProjectAccount.client?.name || bankProjectAccount.client?.fullname || 'N/A'}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <EditBPAClientModal bpa={bankProjectAccount} update_state={setBankProjectAccount} />
                      </span>
                    </div>

                    <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Account number</div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {bankProjectAccount.bankclientacco?.accountnumber || 'N/A'}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <EditBPABankClientAccountModal bpa={bankProjectAccount} update_state={setBankProjectAccount} />
                      </span>
                    </div>
                  </Card.Body>
                  <Card.Footer>
                    <DeleteObjectModal objectType="BankProjectAccount"
                      objectId={bankProjectAccount.bankprojacco_id}
                      objectName={bankProjectAccount.bankprojacco_id}
                    />
                  </Card.Footer>
                </Card>
              </Grid.Column>

              <Grid.Column>
                <Card>
                  <Card.Header><FaStickyNote style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Additional Details</Card.Header>
                  <Card.Body>
                    <div className={"info_descr"}><FaStickyNote style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Notes</div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {bankProjectAccount.notes || 'N/A'}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <EditBPANotesModal bpa={bankProjectAccount} update_state={setBankProjectAccount} />
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

export default BankProjectAccountOverview;
