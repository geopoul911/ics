// Built-ins
import React from "react";

// Icons
import { AiFillLock } from "react-icons/ai";

// Locked notice component for Axes lockouts
function LockedNotice({ username, ip, attemptsRemaining }) {
  return (
    <div style={{ textAlign: "center", marginTop: 24 }}>
      <AiFillLock style={{ fontSize: 56, color: "#d33", marginBottom: 12 }} />
      <h4 style={{ color: "#d33", marginBottom: 8 }}>Your access has been locked</h4>
      <p style={{ margin: 0 }}>Too many failed login attempts were detected.</p>
      <p style={{ margin: 0 }}>Username: <strong>{username || "Unknown"}</strong></p>
      <p style={{ marginTop: 4 }}>IP Address: <strong>{ip || "Unknown"}</strong></p>
      <p style={{ marginTop: 12, color: "#666" }}>
        Attempts remaining: <strong>{attemptsRemaining ?? 0}</strong>
      </p>
      <p style={{ marginTop: 12, color: "#666" }}>
        Please contact ICS's IT department to unblock your account.
      </p>
    </div>
  );
}

export default LockedNotice;


