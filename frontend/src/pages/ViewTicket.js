import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import "./ViewTicket.css";
import { bookingsAPI } from "../utils/api";

function ViewTicket() {
  const navigate = useNavigate();
  const [pnrNumber, setPnrNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ticketInfo, setTicketInfo] = useState(null);
  const [showTicket, setShowTicket] = useState(false);

  const handleSearch = async () => {
    if (!pnrNumber.trim()) {
      setError("Please enter a PNR number.");
      return;
    }

    setLoading(true);
    setError("");
    setTicketInfo(null);
    setShowTicket(false);

    try {
      console.log('Searching for PNR:', pnrNumber.toUpperCase());
      const response = await bookingsAPI.getBookingByPNR(pnrNumber.toUpperCase());
      console.log('PNR Response:', response);
      
      if (response.success && response.data) {
        setTicketInfo(response.data);
        setShowTicket(true);
      } else {
        setError("Ticket not found with this PNR number.");
      }
    } catch (error) {
      console.error('PNR Search Error:', error);
      setError(error.message || "Failed to find ticket. Please check the PNR number.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = () => {
    navigate("/home");
  };

  const handleNewSearch = () => {
    setPnrNumber("");
    setTicketInfo(null);
    setShowTicket(false);
    setError("");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return '#48bb78';
      case 'cancelled': return '#f56565';
      case 'pending': return '#ed8936';
      default: return '#a0aec0';
    }
  };

  return (
    <div className="viewticket-page">
      <Navbar />

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-main">🎫 View Your Ticket</span>
              <span className="title-sub">Enter PNR to view booking details</span>
            </h1>
            <p className="hero-description">
              Retrieve your ticket information using your PNR number
            </p>
          </div>
          <div className="hero-visual">
            <div className="ticket-animation">
              <div className="ticket-icon">🎫</div>
              <div className="ticket-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="viewticket-container">
        {!showTicket ? (
          /* PNR Search Section */
          <div className="search-section animate-fade-in">
            <div className="section-header">
              <div className="section-icon">🔍</div>
              <div className="section-content">
                <h2>Enter PNR Number</h2>
                <p>Please enter your PNR number to view ticket details</p>
              </div>
            </div>

            <div className="search-form">
              <div className="input-group">
                <div className="input-icon">🎫</div>
                <input
                  type="text"
                  placeholder="Enter PNR Number (e.g., PNR123456)"
                  value={pnrNumber}
                  onChange={(e) => setPnrNumber(e.target.value.toUpperCase())}
                  maxLength="10"
                  className="search-input"
                />
                <div className="input-decoration"></div>
              </div>
              <button 
                onClick={handleSearch} 
                disabled={loading}
                className="search-button"
              >
                {loading ? (
                  <div className="button-loading">
                    <div className="spinner"></div>
                    <span>Searching...</span>
                  </div>
                ) : (
                  <div className="button-content">
                    <span>View Ticket</span>
                    <div className="button-icon">🔍</div>
                  </div>
                )}
              </button>
            </div>

            {error && (
              <div className="error-message animate-slide-down">
                <div className="error-icon">⚠️</div>
                <div className="error-content">
                  <h4>Error</h4>
                  <p>{error}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Ticket Display Section */
          <div className="ticket-section animate-fade-in">
            <div className="ticket-header">
              <div className="header-content">
                <div className="header-icon">🎫</div>
                <div className="header-text">
                  <h2>Your Ticket</h2>
                  <p>Booking confirmed successfully</p>
                </div>
              </div>
              <div className="header-actions">
                <button onClick={handleNewSearch} className="action-button secondary">
                  New Search
                </button>
                <button onClick={handleGoHome} className="action-button primary">
                  Go to Home
                </button>
              </div>
            </div>

            <div className="ticket-card">
              <div className="ticket-header-bar">
                <div className="ticket-logo">🚌 Smart Bus</div>
                <div className="ticket-status" style={{ color: getStatusColor(ticketInfo.status) }}>
                  {ticketInfo.status}
                </div>
              </div>

              <div className="ticket-content">
                <div className="ticket-main-info">
                  <div className="route-info">
                    <div className="route-from">
                      <div className="location-label">FROM</div>
                      <div className="location-name">{ticketInfo.bus?.from || 'N/A'}</div>
                    </div>
                    <div className="route-arrow">→</div>
                    <div className="route-to">
                      <div className="location-label">TO</div>
                      <div className="location-name">{ticketInfo.bus?.to || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="journey-details">
                    <div className="detail-item">
                      <span className="detail-label">Journey Date</span>
                      <span className="detail-value">{formatDate(ticketInfo.journeyDate)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Bus Name</span>
                      <span className="detail-value">{ticketInfo.bus?.busName || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Bus Number</span>
                      <span className="detail-value">{ticketInfo.bus?.busNumber || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="ticket-sidebar">
                  <div className="pnr-section">
                    <div className="pnr-label">PNR Number</div>
                    <div className="pnr-number">{ticketInfo.pnr}</div>
                  </div>

                  <div className="passenger-section">
                    <div className="passenger-label">Passenger</div>
                    <div className="passenger-name">{ticketInfo.passengerDetails?.name || 'N/A'}</div>
                    <div className="passenger-details">
                      <div className="passenger-email">{ticketInfo.passengerDetails?.email || 'N/A'}</div>
                      <div className="passenger-phone">{ticketInfo.passengerDetails?.phone || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="seat-section">
                    <div className="seat-label">Seat Number</div>
                    <div className="seat-number">{ticketInfo.passengerDetails?.seatNumber || 'N/A'}</div>
                  </div>

                  <div className="fare-section">
                    <div className="fare-label">Fare</div>
                    <div className="fare-amount">₹{ticketInfo.fare || 'N/A'}</div>
                  </div>
                </div>
              </div>

              <div className="ticket-footer">
                <div className="footer-info">
                  <p>Thank you for choosing Smart Bus!</p>
                  <p>For support, contact: support@smartbus.in</p>
                </div>
                <div className="footer-qr">
                  <div className="qr-placeholder">QR Code</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewTicket;
