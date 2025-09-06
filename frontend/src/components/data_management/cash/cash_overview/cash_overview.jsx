// Built-ins
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Custom Made Components
import NavigationBar from "../../../core/navigation_bar/navigation_bar";
import Footer from "../../../core/footer/footer";
import axios from "axios";
import { Card } from "react-bootstrap";
import { Grid, Button } from "semantic-ui-react";
import DeleteObjectModal from "../../../modals/delete_object";
import {
  EditCashCountryModal,
  EditCashTrandateModal,
  EditCashConsultantModal,
  EditCashKindModal,
  EditCashAmountExpenseModal,
  EditCashAmountPaymentModal,
  EditCashReasonModal,
  EditCashCurrencyModal,
} from "../../../modals/cash_edit_modals";
import { pageHeader } from "../../../global_vars";
import { FaIdBadge, FaStickyNote, FaStop } from "react-icons/fa";

// Modules / Functions
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../../global_vars";

// API endpoint
const VIEW_CASH = "http://localhost:8000/api/data_management/cash/";

function CashOverview() {
  const { id } = useParams();
  const [cash, setCash] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchCash = async () => {
      try {
        const currentHeaders = {
          ...headers,
          "Authorization": "Token " + localStorage.getItem("userToken")
        };

        const response = await axios.get(`${VIEW_CASH}${id}/`, {
          headers: currentHeaders,
        });

        setCash(response.data);
        setIsLoaded(true);
      } catch (e) {
        console.error('Error fetching cash entry:', e);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load cash entry. Please try again.",
        });
        setIsLoaded(true);
      }
    };

    fetchCash();
  }, [id]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!cash) {
    return <div>No cash entry found.</div>;
  }

  return (
    <>
      <NavigationBar />
      <div className="mainContainer">
        {pageHeader("cash_overview", `Cash: ${cash.cash_id}`)}
        <div className="contentContainer">
          <div className="contentBody">
            <Grid stackable columns={2} divided>
              <Grid.Column>
                <Card>
                  <Card.Header><FaIdBadge style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Basic Information</Card.Header>
                  <Card.Body>
                    <div className={"info_descr"}><FaIdBadge style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Cash ID</div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {cash.cash_id}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <Button size="tiny" basic disabled title="ID is immutable"><FaStop style={{ marginRight: 6, color: "red" }} />ID</Button>
                      </span>
                    </div>

                    <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Project</div>
                    <div className={"info_span"}>{cash.project?.title || 'N/A'}</div>

                    <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Country</div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {cash.country?.title || 'N/A'}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <EditCashCountryModal cash={cash} update_state={setCash} />
                      </span>
                    </div>

                    <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Transaction date</div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {cash.trandate ? new Date(cash.trandate).toLocaleDateString() : 'N/A'}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <EditCashTrandateModal cash={cash} update_state={setCash} />
                      </span>
                    </div>

                    <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Consultant</div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {cash.consultant?.fullname || 'N/A'}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <EditCashConsultantModal cash={cash} update_state={setCash} />
                      </span>
                    </div>

                    <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Kind</div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {cash.kind === 'E' ? 'Expense' : 'Payment'}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <EditCashKindModal cash={cash} update_state={setCash} />
                      </span>
                    </div>

                    <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Currency</div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {cash.currency || 'N/A'}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <EditCashCurrencyModal cash={cash} update_state={setCash} />
                      </span>
                    </div>
                  </Card.Body>
                  <Card.Footer>
                    <DeleteObjectModal objectType="Cash" objectId={cash.cash_id} objectName={cash.cash_id} />
                  </Card.Footer>
                </Card>
              </Grid.Column>

              <Grid.Column>
                <Card>
                  <Card.Header><FaStickyNote style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Financial Details</Card.Header>
                  <Card.Body>
                    {cash.kind === 'E' && (
                    <>
                      <div className={"info_descr"}><FaStickyNote style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Amount expense</div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {cash.amountexp ?? 'N/A'}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditCashAmountExpenseModal cash={cash} update_state={setCash} />
                        </span>
                      </div>
                    </>
                    )}
                    {cash.kind === 'P' && (
                    <>
                      <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Amount payment</div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {cash.amountpay ?? 'N/A'}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditCashAmountPaymentModal cash={cash} update_state={setCash} />
                        </span>
                      </div>
                    </>
                    )}

                    <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Reason</div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {cash.reason || 'N/A'}
                      <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <EditCashReasonModal cash={cash} update_state={setCash} />
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

export default CashOverview;
