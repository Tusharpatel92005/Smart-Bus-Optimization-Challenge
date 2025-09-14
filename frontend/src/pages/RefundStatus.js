import React, { useState } from "react";
import "./RefundStatus.css";
import Navbar from "../components/navbar/Navbar";

function RefundStatus() {
  const [ticketId, setTicketId] = useState("");
  const [status, setStatus] = useState(null);

  const handleCheck = () => {
    if (ticketId) {
      setStatus(`Refund for ticket ${ticketId} is being processed.`);
    } else {
      alert("Enter ticket ID.");
    }
  };

  return (
    <div className="trackbus-page">
      <Navbar />
    <div className="refund-container">
      <h2>Refund Status</h2>
      <input
        type="text"
        placeholder="Ticket ID"
        value={ticketId}
        onChange={(e) => setTicketId(e.target.value)}
      />
      <button onClick={handleCheck}>Check Status</button>
      {status && <p>{status}</p>}
    </div>
    </div>
  );
}

export default RefundStatus;
