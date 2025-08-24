// Built-ins
import React from "react";

// Custom made components
import NavigationBar from "../navigation_bar/navigation_bar";
import Footer from "../footer/footer";

// Modules / Functions
import Paper from "@material-ui/core/Paper";

// Global Variables
import { pageHeader } from "../../global_vars";

// CSS
import "./terms.css";

// url path = '/terms'
class Terms extends React.Component {
  render() {
    return (
      <>
        <NavigationBar />
        {pageHeader("terms")}
        <div className="mainContainer">
          <Paper className="termsPaper" style={{ backgroundColor: "#eee" }}>
            <h1>1) Introduction</h1>
            <p>
              These Terms and Conditions (“Terms”) govern your access to and use
              of ICS Ultima (the “Service”), a closed-source content & project
              management platform provided by ICS Ltd.
              (“Company”, “we”, “us”, or “our”).
            </p>

            <hr />
            <h1>2) Agreement to Terms</h1>
            <p>
              By accessing or using the Service, you agree to be bound by these
              Terms. If you do not agree, you must not use the Service.
            </p>

            <hr />
            <h1>3) Eligibility & Accounts</h1>
            <p>
              You represent that you are authorized to use the Service on behalf
              of your organization and that the information you provide is
              accurate and complete. You are responsible for maintaining the
              confidentiality of your credentials and for all activity under
              your account.
            </p>

            <hr />
            <h1>4) License & Acceptable Use</h1>
            <p>
              We grant you a limited, non-exclusive, non-transferable,
              revocable license to use the Service solely for your internal
              business purposes. You agree not to:
            </p>
            <ul>
              <li>copy, modify, reverse engineer, or create derivative works;</li>
              <li>circumvent security or access control features;</li>
              <li>use the Service for unlawful, harmful, or infringing activity;</li>
              <li>resell, sublicense, or provide the Service to third parties except as expressly permitted in writing.</li>
            </ul>

            <hr />
            <h1>5) Content & Intellectual Property</h1>
            <p>
              The Service, including all software, interfaces, and design, is
              owned by the Company and protected by intellectual property laws.
              You retain ownership of data you input (“Customer Data”). You grant
              us a limited license to process Customer Data solely to operate,
              maintain, and improve the Service.
            </p>

            <hr />
            <h1>6) Confidentiality & Data Protection</h1>
            <p>
              Each party will protect the other’s confidential information with
              reasonable care and use it only as necessary to perform under
              these Terms. We process personal data in accordance with
              applicable data-protection laws. You are responsible for obtaining
              any consents required to upload Customer Data to the Service.
            </p>

            <hr />
            <h1>7) Third-Party Services</h1>
            <p>
              The Service may interoperate with third-party tools or content.
              We are not responsible for third-party services and your use of
              them is governed by their terms.
            </p>

            <hr />
            <h1>8) Availability, Updates & Support</h1>
            <p>
              We strive for high availability but do not guarantee the Service
              will be uninterrupted or error-free. We may update, change, or
              discontinue features at any time. Reasonable support will be
              provided as communicated to you.
            </p>
            <hr />
            <h1>9) Term & Termination</h1>
            <p>
              We may suspend or terminate access immediately if you breach these
              Terms, cause security or legal risk, or fail to pay applicable
              fees. You may stop using the Service at any time. Upon
              termination, your license ends and we may delete your account and
              data after a reasonable retention period, subject to law.
            </p>

            <hr />
            <h1>10) Disclaimers</h1>
            <p>
              THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE.” WE DISCLAIM
              ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY,
              FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. We do not
              warrant that the Service will meet your requirements or be
              error-free.
            </p>

            <hr />
            <h1>11) Indemnification</h1>
            <p>
              You agree to defend, indemnify, and hold harmless the Company and
              its affiliates from and against any claims, damages, liabilities,
              and expenses arising from your use of the Service or breach of
              these Terms.
            </p>

            <hr />
            <h1>12) Changes to Terms</h1>
            <p>
              We may update these Terms from time to time. Material changes will
              be effective upon posting or as otherwise communicated. Continued
              use of the Service after changes become effective constitutes your
              acceptance of the updated Terms.
            </p>

            <hr />
            <h1>13) Governing Law & Jurisdiction</h1>
            <p>
              These Terms are governed by the laws of Greece, without regard to
              conflict-of-law principles. The courts of Athens, Greece shall
              have exclusive jurisdiction over any dispute arising out of or
              relating to these Terms or the Service.
            </p>
            <hr />
            <p style={{ fontSize: "0.9em", opacity: 0.8 }}>
              <em>
                Note: This document is provided for general informational
                purposes only and does not constitute legal advice. Please
                consult your legal counsel to adapt these Terms to your specific
                circumstances.
              </em>
            </p>
          </Paper>
        </div>
        <Footer />
      </>
    );
  }
}

export default Terms;
