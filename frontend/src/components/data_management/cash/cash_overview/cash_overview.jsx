// Built-ins
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Custom Made Components
import NavigationBar from "../../../core/navigation_bar/navigation_bar";
import Footer from "../../../core/footer/footer";
import axios from "axios";

// Modules / Functions
import Swal from "sweetalert2";
import { Container, Row, Col } from "react-bootstrap";

// Global Variables
import { headers } from "../../../global_vars";

// API endpoint
const VIEW_CASH = "http://localhost:8000/api/data_management/cash/";

function CashOverview() {
  const { cash_id } = useParams();
  const [cash, setCash] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchCash = async () => {
      try {
        const currentHeaders = {
          ...headers,
          "Authorization": "Token " + localStorage.getItem("userToken")
        };

        const response = await axios.get(`${VIEW_CASH}${cash_id}/`, {
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
  }, [cash_id]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!cash) {
    return <div>No cash entry found.</div>;
  }

  return (
    <>
      <NavigationBar />
      <Container className="mainContainer">
        <h1>Cash Overview</h1>
        <Row>
          <Col md={6}>
            <h5>Basic Information</h5>
            <p><strong>Cash ID:</strong> {cash.cash_id}</p>
            <p><strong>Project:</strong> {cash.project?.title}</p>
            <p><strong>Country:</strong> {cash.country?.title}</p>
            <p><strong>Transaction Date:</strong> {new Date(cash.trandate).toLocaleDateString()}</p>
            <p><strong>Consultant:</strong> {cash.consultant?.fullname}</p>
            <p><strong>Kind:</strong> {cash.kind === 'E' ? 'Expense' : 'Payment'}</p>
          </Col>
          <Col md={6}>
            <h5>Financial Details</h5>
            <p><strong>Amount Expense:</strong> {cash.amountexp || 'N/A'}</p>
            <p><strong>Amount Payment:</strong> {cash.amountpay || 'N/A'}</p>
            <p><strong>Reason:</strong> {cash.reason || 'N/A'}</p>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default CashOverview;
