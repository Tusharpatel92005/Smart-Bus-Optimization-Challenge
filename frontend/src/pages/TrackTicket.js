import React, { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import "./TrackTicket.css";

function TrackTicket() {
  const [ticketId, setTicketId] = useState("");
  const [info, setInfo] = useState(null);

  const handleTrack = () => {
    if (ticketId) {
      setInfo(`✅ Ticket ${ticketId} is confirmed for 25th Sep 2025.`);
    } else {
      alert("⚠️ Please enter ticket ID.");
    }
  };

  return (
    <div className="trackbus-page">
      <Navbar />
    <div className="trackticket-container">
      <h1>🎫 Track Ticket</h1>
      <input
        type="text"
        placeholder="Enter Ticket ID"
        value={ticketId}
        onChange={(e) => setTicketId(e.target.value)}
      />
      <button onClick={handleTrack}>Track</button>
      {info && <p className="info-message">{info}</p>}
    </div>
    </div>
  );
}

export default TrackTicket;
