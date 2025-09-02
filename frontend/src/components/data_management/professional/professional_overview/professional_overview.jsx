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
const VIEW_PROFESSIONAL = "http://localhost:8000/api/data_management/professional/";

function ProfessionalOverview() {
  const { id } = useParams();
  const [professional, setProfessional] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

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

        setProfessional(response.data);
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
      <Container className="mainContainer">
        <h1>Professional Overview</h1>
        <Row>
          <Col md={6}>
            <h5>Basic Information</h5>
            <p><strong>ID:</strong> {professional.professional_id}</p>
            <p><strong>Fullname:</strong> {professional.fullname}</p>
            <p><strong>Profession:</strong> {professional.profession?.title}</p>
            <p><strong>City:</strong> {professional.city?.title}</p>
            <p><strong>Reliability:</strong> {professional.reliability || 'N/A'}</p>
          </Col>
          <Col md={6}>
            <h5>Contact</h5>
            <p><strong>Address:</strong> {professional.address || 'N/A'}</p>
            <p><strong>Email:</strong> {professional.email || 'N/A'}</p>
            <p><strong>Phone:</strong> {professional.phone || 'N/A'}</p>
            <p><strong>Mobile:</strong> {professional.mobile || 'N/A'}</p>
            <p><strong>Active:</strong> {professional.active ? 'Yes' : 'No'}</p>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <h5>Notes</h5>
            <p>{professional.notes || '—'}</p>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default ProfessionalOverview;
