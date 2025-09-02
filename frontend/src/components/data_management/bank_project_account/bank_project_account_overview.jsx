// Built-ins
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import axios from "axios";

// Modules / Functions
import Swal from "sweetalert2";
import { Container, Row, Col } from "react-bootstrap";

// Global Variables
import { headers } from "../../global_vars";

// API endpoint
const VIEW_BANK_PROJECT_ACCOUNT = "http://localhost:8000/api/data_management/bank_project_account/";

function BankProjectAccountOverview() {
  const { bankprojacco_id } = useParams();
  const [bankProjectAccount, setBankProjectAccount] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchBankProjectAccount = async () => {
      try {
        const currentHeaders = {
          ...headers,
          "Authorization": "Token " + localStorage.getItem("userToken")
        };

        const response = await axios.get(`${VIEW_BANK_PROJECT_ACCOUNT}${bankprojacco_id}/`, {
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
  }, [bankprojacco_id]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!bankProjectAccount) {
    return <div>No bank project account found.</div>;
  }

  return (
    <>
      <NavigationBar />
      <Container className="mainContainer">
        <h1>Bank Project Account Overview</h1>
        <Row>
          <Col md={6}>
            <h5>Basic Information</h5>
            <p><strong>Bank Project Account ID:</strong> {bankProjectAccount.bankprojacco_id}</p>
            <p><strong>Project:</strong> {bankProjectAccount.project?.title}</p>
            <p><strong>Client:</strong> {bankProjectAccount.client?.name}</p>
            <p><strong>Account Number:</strong> {bankProjectAccount.bankclientacco?.accountnumber}</p>
          </Col>
          <Col md={6}>
            <h5>Additional Details</h5>
            <p><strong>Notes:</strong> {bankProjectAccount.notes || 'N/A'}</p>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default BankProjectAccountOverview;
