import React, { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import "./RescheduleTicket.css";

function RescheduleTicket() {
  const [ticketId, setTicketId] = useState("");
  const [newDate, setNewDate] = useState("");
  const [message, setMessage] = useState(null);

  const handleReschedule = () => {
    if (ticketId && newDate) {
      setMessage(`✅ Ticket ${ticketId} rescheduled to ${newDate}`);
      setTicketId("");
      setNewDate("");
    } else {
      alert("⚠️ Please fill in all fields.");
    }
  };

  return (
    <div className="trackbus-page">
      <Navbar />
    <div className="reschedule-container">
      <h1>🔄 Reschedule Ticket</h1>
      <input
        type="text"
        placeholder="Enter Ticket ID"
        value={ticketId}
        onChange={(e) => setTicketId(e.target.value)}
      />
      <input
        type="date"
        value={newDate}
        onChange={(e) => setNewDate(e.target.value)}
      />
      <button onClick={handleReschedule}>Reschedule</button>
      {message && <p className="message">{message}</p>}
    </div>
    </div>
  );
}

export default RescheduleTicket;
