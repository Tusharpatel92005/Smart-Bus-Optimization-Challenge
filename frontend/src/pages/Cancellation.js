import React, { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import "./Cancellation.css";

function Cancellation() {
  const [pnrNumber, setPnrNumber] = useState("");
  const [foundTicket, setFoundTicket] = useState(null);
  const [cancelledTickets, setCancelledTickets] = useState([]);
  const [message, setMessage] = useState("");
  const [showRefund, setShowRefund] = useState(false);
  const [refundAmount, setRefundAmount] = useState(0);

  // Load cancelled tickets from localStorage
  React.useEffect(() => {
    const savedCancelledTickets = localStorage.getItem('cancelledTickets');
    if (savedCancelledTickets) {
      setCancelledTickets(JSON.parse(savedCancelledTickets));
    }
  }, []);

  const handlePnrLookup = () => {
    if (pnrNumber.trim() === "") {
      setMessage("❌ Please enter a valid PNR number.");
      setFoundTicket(null);
      return;
    }

    // Get all bookings from localStorage
    const allBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const ticket = allBookings.find(booking => booking.pnr === pnrNumber.trim());

    if (ticket) {
      // Check if ticket is already cancelled
      const isCancelled = cancelledTickets.some(cancelled => cancelled.pnr === pnrNumber);
      if (isCancelled) {
        setMessage("❌ This ticket has already been cancelled.");
        setFoundTicket(null);
        return;
      }
      
      setFoundTicket(ticket);
      setMessage("✅ Ticket found! You can now cancel it below.");
    } else {
      setMessage("❌ No ticket found with this PNR number.");
      setFoundTicket(null);
    }
  };

  const handleCancelTicket = () => {
    if (!foundTicket) {
      setMessage("❌ No ticket selected for cancellation.");
      return;
    }

    // Calculate refund (70% of ticket price)
    const ticketPrice = 100; // Assuming base ticket price
    const refund = Math.round(ticketPrice * 0.7);
    setRefundAmount(refund);

    // Add to cancelled tickets
    const cancelledTicket = {
      ...foundTicket,
      cancelledAt: new Date().toISOString(),
      refundAmount: refund,
      status: 'cancelled'
    };

    const newCancelledTickets = [...cancelledTickets, cancelledTicket];
    setCancelledTickets(newCancelledTickets);
    localStorage.setItem('cancelledTickets', JSON.stringify(newCancelledTickets));

    // Free up the seat
    const busKey = `${foundTicket.busName}_${foundTicket.selectedCity}_${foundTicket.from}_${foundTicket.to}_${foundTicket.date}`;
    const bookedSeats = JSON.parse(localStorage.getItem(`bookedSeats_${busKey}`) || '[]');
    const updatedSeats = bookedSeats.filter(seat => seat !== foundTicket.seatNumber);
    localStorage.setItem(`bookedSeats_${busKey}`, JSON.stringify(updatedSeats));

    // Remove from active bookings
    const allBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const updatedBookings = allBookings.filter(booking => booking.pnr !== foundTicket.pnr);
    localStorage.setItem('userBookings', JSON.stringify(updatedBookings));

    setMessage(`✅ Ticket cancelled successfully! Refund: ₹${refund} (70% of ticket price)`);
    setFoundTicket(null);
    setPnrNumber("");
    setShowRefund(true);
  };

  return (
    <div className="cancellation-page">
      <Navbar />

      <div className="cancellation-container">
        <h1>🛑 Cancel Your Ticket</h1>

        <div className="pnr-lookup-section">
          <h2>Enter PNR Number</h2>
          <div className="pnr-form">
            <input
              type="text"
              placeholder="Enter your PNR number"
              value={pnrNumber}
              onChange={(e) => setPnrNumber(e.target.value)}
              className="pnr-input"
            />
            <button onClick={handlePnrLookup} className="lookup-btn">
              🔍 Lookup Ticket
            </button>
          </div>
        </div>

        {message && <p className="cancellation-message">{message}</p>}

        {foundTicket && (
          <div className="ticket-details">
            <h2>📋 Your Ticket Details</h2>
            <div className="ticket-card">
              <div className="ticket-header">
                <h3>Smart Bus Ticket</h3>
                <span className="pnr-badge">PNR: {foundTicket.pnr}</span>
              </div>
              <div className="ticket-body">
                <div className="ticket-row">
                  <span className="label">Bus:</span>
                  <span className="value">{foundTicket.busName}</span>
                </div>
                <div className="ticket-row">
                  <span className="label">Route:</span>
                  <span className="value">{foundTicket.from} → {foundTicket.to}</span>
                </div>
                <div className="ticket-row">
                  <span className="label">Date:</span>
                  <span className="value">{foundTicket.date}</span>
                </div>
                <div className="ticket-row">
                  <span className="label">Seat:</span>
                  <span className="value">#{foundTicket.seatNumber}</span>
                </div>
                <div className="ticket-row">
                  <span className="label">Passenger:</span>
                  <span className="value">{foundTicket.customerDetails.name}</span>
                </div>
                <div className="ticket-row">
                  <span className="label">Email:</span>
                  <span className="value">{foundTicket.customerDetails.email}</span>
                </div>
                <div className="ticket-row">
                  <span className="label">Phone:</span>
                  <span className="value">{foundTicket.customerDetails.phone}</span>
                </div>
              </div>
              <div className="ticket-footer">
                <div className="refund-info">
                  <p>💰 Refund Amount: ₹70 (70% of ₹100)</p>
                  <p className="refund-note">*Refund will be processed within 3-5 business days</p>
                </div>
                <button onClick={handleCancelTicket} className="cancel-ticket-btn">
                  🛑 Cancel Ticket
                </button>
              </div>
            </div>
          </div>
        )}

        {showRefund && (
          <div className="refund-success">
            <h2>✅ Cancellation Successful!</h2>
            <div className="refund-details">
              <p>Your ticket has been cancelled successfully.</p>
              <p>Refund Amount: <strong>₹{refundAmount}</strong></p>
              <p>Refund will be processed within 3-5 business days.</p>
              <button onClick={() => setShowRefund(false)} className="close-refund-btn">
                Close
              </button>
            </div>
          </div>
        )}

        {cancelledTickets.length > 0 && (
          <div className="cancelled-list">
            <h2>📋 Cancelled Tickets History</h2>
            <div className="cancelled-tickets-grid">
              {cancelledTickets.map((ticket, index) => (
                <div key={index} className="cancelled-ticket-card">
                  <div className="cancelled-ticket-header">
                    <span className="pnr">PNR: {ticket.pnr}</span>
                    <span className="status cancelled">Cancelled</span>
                  </div>
                  <div className="cancelled-ticket-body">
                    <p><strong>Bus:</strong> {ticket.busName}</p>
                    <p><strong>Route:</strong> {ticket.from} → {ticket.to}</p>
                    <p><strong>Date:</strong> {ticket.date}</p>
                    <p><strong>Seat:</strong> #{ticket.seatNumber}</p>
                    <p><strong>Refund:</strong> ₹{ticket.refundAmount}</p>
                    <p><strong>Cancelled:</strong> {new Date(ticket.cancelledAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cancellation;
