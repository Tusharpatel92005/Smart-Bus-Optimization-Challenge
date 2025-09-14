import React, { useState } from "react";
import "./CurrentStatus.css";
import Navbar from "../components/navbar/Navbar";

function CurrentStatus() {
  const [status] = useState("All systems operational. No delays reported.");

  return (
    <div className="trackbus-page">
      <Navbar />
    <div className="status-container">
      <h2>Current Status</h2>
      <p>{status}</p>
    </div>
    </div>
  );
}

export default CurrentStatus;
