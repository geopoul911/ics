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
      <Container className="mainContainer">
        <h1>Taxation Project Overview</h1>
        <Row>
          <Col md={6}>
            <h5>Basic Information</h5>
            <p><strong>ID:</strong> {item.taxproj_id}</p>
            <p><strong>Client:</strong> {item.client ? `${item.client.surname} ${item.client.name}` : ''}</p>
            <p><strong>Consultant:</strong> {item.consultant?.fullname}</p>
            <p><strong>Tax Use:</strong> {item.taxuse}</p>
            <p><strong>Deadline:</strong> {item.deadline || 'N/A'}</p>
          </Col>
          <Col md={6}>
            <h5>Status</h5>
            <p><strong>Declared:</strong> {item.declaredone ? 'Yes' : 'No'}</p>
            <p><strong>Declaration Date:</strong> {item.declarationdate || 'N/A'}</p>
            <h5 className="mt-4">Comment</h5>
            <p>{item.comment || '—'}</p>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default TaxationProjectOverview;
