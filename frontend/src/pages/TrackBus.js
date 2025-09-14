import React, { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import "./TrackBus.css";
import { busTrackingAPI, bookingsAPI, busesAPI } from "../utils/api";

function TrackBus() {
  const [activeTab, setActiveTab] = useState("pnr");
  const [pnrNumber, setPnrNumber] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [busNumber, setBusNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pnrData, setPnrData] = useState(null);
  const [busData, setBusData] = useState(null);
  const [routeData, setRouteData] = useState(null);

  // Function 1: Track by PNR Number
  const handlePnrTrack = async () => {
    if (!pnrNumber.trim()) {
      setError("Please enter a PNR number.");
      return;
    }

    setLoading(true);
    setError("");
    setPnrData(null);

    try {
      console.log('Tracking PNR:', pnrNumber.toUpperCase());
      const response = await bookingsAPI.getBookingByPNR(pnrNumber.toUpperCase());
      console.log('PNR Response:', response);
      
      if (response.success && response.data) {
        setPnrData(response.data);
      } else {
        setError("Booking not found with this PNR number.");
      }
    } catch (error) {
      console.error('PNR Tracking Error:', error);
      setError(error.message || "Failed to track booking. Please check the PNR number.");
    } finally {
      setLoading(false);
    }
  };

  // Function 2: Track Bus by Tracking Number
  const handleBusTrack = async () => {
    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number.");
      return;
    }

    setLoading(true);
    setError("");
    setBusData(null);

    try {
      console.log('Tracking Bus:', trackingNumber.toUpperCase());
      const response = await busTrackingAPI.trackBus(trackingNumber.toUpperCase());
      console.log('Bus Response:', response);
      
      if (response.success && response.data) {
        setBusData(response.data);
      } else {
        setError("Bus not found with this tracking number.");
      }
    } catch (error) {
      console.error('Bus Tracking Error:', error);
      setError(error.message || "Failed to track bus. Please check the tracking number.");
    } finally {
      setLoading(false);
    }
  };

  // Function 3: Track Route by Bus Number
  const handleRouteTrack = async () => {
    if (!busNumber.trim()) {
      setError("Please enter a bus number.");
      return;
    }

    setLoading(true);
    setError("");
    setRouteData(null);

    try {
      console.log('Tracking Route:', busNumber.toUpperCase());
      const response = await busesAPI.getAllBuses({ busNumber: busNumber.toUpperCase() });
      console.log('Route Response:', response);
      
      if (response.success && response.data && response.data.length > 0) {
        setRouteData(response.data[0]);
    } else {
        setError("Bus not found with this number.");
      }
    } catch (error) {
      console.error('Route Tracking Error:', error);
      setError(error.message || "Failed to track route. Please check the bus number.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return timeString;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return '#28a745';
      case 'delayed': return '#ffc107';
      case 'not_started': return '#6c757d';
      case 'completed': return '#17a2b8';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'running': return 'Running';
      case 'delayed': return 'Delayed';
      case 'not_started': return 'Not Started';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  return (
    <div className="trackbus-page">
      <Navbar />

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-main">Smart Bus</span>
              <span className="title-sub">Tracking System</span>
            </h1>
            <p className="hero-description">
              Track your bus in real-time, check booking status, and get complete route information
            </p>
          </div>
          <div className="hero-visual">
            <div className="bus-animation">
              <div className="bus-icon">🚌</div>
              <div className="tracking-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="trackbus-container">
        {/* Tab Navigation */}
        <div className="tracking-tabs">
          <button 
            className={`tab-button ${activeTab === 'pnr' ? 'active' : ''}`}
            onClick={() => setActiveTab('pnr')}
          >
            <div className="tab-icon">📋</div>
            <div className="tab-content">
              <span className="tab-title">Track by PNR</span>
              <span className="tab-subtitle">Booking Details</span>
            </div>
          </button>
          <button 
            className={`tab-button ${activeTab === 'bus' ? 'active' : ''}`}
            onClick={() => setActiveTab('bus')}
          >
            <div className="tab-icon">🚌</div>
            <div className="tab-content">
              <span className="tab-title">Track Bus</span>
              <span className="tab-subtitle">Live Location</span>
            </div>
          </button>
          <button 
            className={`tab-button ${activeTab === 'route' ? 'active' : ''}`}
            onClick={() => setActiveTab('route')}
          >
            <div className="tab-icon">🗺️</div>
            <div className="tab-content">
              <span className="tab-title">Track Route</span>
              <span className="tab-subtitle">Route Info</span>
            </div>
          </button>
        </div>

        {/* Function 1: PNR Tracking */}
        {activeTab === 'pnr' && (
          <div className="tracking-section animate-fade-in">
            <div className="section-header">
              <div className="section-icon">📋</div>
              <div className="section-content">
                <h2>Track Your Booking</h2>
                <p>Enter your PNR number to get complete booking details</p>
              </div>
            </div>
            <div className="trackbus-form">
              <div className="input-group">
                <div className="input-icon">🎫</div>
                <input
                  type="text"
                  placeholder="Enter PNR Number (e.g., PNR123456)"
                  value={pnrNumber}
                  onChange={(e) => setPnrNumber(e.target.value.toUpperCase())}
                  maxLength="10"
                  className="tracking-input"
                />
                <div className="input-decoration"></div>
              </div>
              <button 
                onClick={handlePnrTrack} 
                disabled={loading}
                className="track-button primary"
              >
                {loading ? (
                  <div className="button-loading">
                    <div className="spinner"></div>
                    <span>Tracking...</span>
                  </div>
                ) : (
                  <div className="button-content">
                    <span>Track PNR</span>
                    <div className="button-icon">🔍</div>
                  </div>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Function 2: Bus Tracking */}
        {activeTab === 'bus' && (
          <div className="tracking-section animate-fade-in">
            <div className="section-header">
              <div className="section-icon">🚌</div>
              <div className="section-content">
                <h2>Track Bus Location</h2>
                <p>Enter tracking number to get real-time bus location and status</p>
              </div>
            </div>
            <div className="trackbus-form">
              <div className="input-group">
                <div className="input-icon">📍</div>
                <input
                  type="text"
                  placeholder="Enter Bus Tracking Number (e.g., DL1234)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                  maxLength="6"
                  className="tracking-input"
                />
                <div className="input-decoration"></div>
              </div>
              <button 
                onClick={handleBusTrack} 
                disabled={loading}
                className="track-button secondary"
              >
                {loading ? (
                  <div className="button-loading">
                    <div className="spinner"></div>
                    <span>Tracking...</span>
                  </div>
                ) : (
                  <div className="button-content">
                    <span>Track Bus</span>
                    <div className="button-icon">🚌</div>
                  </div>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Function 3: Route Tracking */}
        {activeTab === 'route' && (
          <div className="tracking-section animate-fade-in">
            <div className="section-header">
              <div className="section-icon">🗺️</div>
              <div className="section-content">
                <h2>Track Route Information</h2>
                <p>Enter bus number to get complete route details and schedule</p>
              </div>
            </div>
        <div className="trackbus-form">
              <div className="input-group">
                <div className="input-icon">🚍</div>
          <input
            type="text"
                  placeholder="Enter Bus Number (e.g., DL001)"
            value={busNumber}
                  onChange={(e) => setBusNumber(e.target.value.toUpperCase())}
                  maxLength="10"
                  className="tracking-input"
                />
                <div className="input-decoration"></div>
              </div>
              <button 
                onClick={handleRouteTrack} 
                disabled={loading}
                className="track-button tertiary"
              >
                {loading ? (
                  <div className="button-loading">
                    <div className="spinner"></div>
                    <span>Tracking...</span>
                  </div>
                ) : (
                  <div className="button-content">
                    <span>Track Route</span>
                    <div className="button-icon">🗺️</div>
                  </div>
                )}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message animate-slide-down">
            <div className="error-icon">⚠️</div>
            <div className="error-content">
              <h4>Error</h4>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* PNR Results */}
        {pnrData && (
          <div className="tracking-results animate-fade-in">
            <div className="info-card pnr-card">
              <div className="card-header">
                <div className="header-content">
                  <div className="header-icon">📋</div>
                  <div className="header-text">
                    <h2>Booking Details</h2>
                    <p>Your booking information</p>
                  </div>
                </div>
                <div className="status-badge confirmed">
                  <div className="badge-icon">✅</div>
                  <span>Confirmed</span>
                </div>
              </div>
              
              <div className="details-grid">
                <div className="detail-item">
                  <span className="label">PNR Number:</span>
                  <span className="value pnr-number">{pnrData.pnr}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Passenger Name:</span>
                  <span className="value">{pnrData.passengerDetails.name}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Journey Date:</span>
                  <span className="value">{new Date(pnrData.journeyDate).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <span className="label">From:</span>
                  <span className="value">{pnrData.bus.from}</span>
                </div>
                <div className="detail-item">
                  <span className="label">To:</span>
                  <span className="value">{pnrData.bus.to}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Bus Name:</span>
                  <span className="value">{pnrData.bus.busName}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Bus Number:</span>
                  <span className="value">{pnrData.bus.busNumber}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Seat Number:</span>
                  <span className="value seat-number">{pnrData.passengerDetails.seatNumber}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Fare:</span>
                  <span className="value fare">₹{pnrData.fare}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Status:</span>
                  <span className="value status">{pnrData.status}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bus Tracking Results */}
        {busData && (
          <div className="tracking-results">
            <div className="info-card">
              <div className="card-header">
                <h2>🚌 Bus Tracking Details</h2>
                <div className="bus-status" style={{ color: getStatusColor(busData.bus.currentStatus) }}>
                  {getStatusText(busData.bus.currentStatus)}
                  {busData.bus.delayMinutes > 0 && (
                    <span className="delay-info"> (Delayed by {busData.bus.delayMinutes} min)</span>
                  )}
                </div>
              </div>

              <div className="details-grid">
                <div className="detail-item">
                  <span className="label">Bus Name:</span>
                  <span className="value">{busData.bus.busName}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Bus Number:</span>
                  <span className="value">{busData.bus.busNumber}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Tracking Number:</span>
                  <span className="value tracking-number">{busData.bus.trackingNumber}</span>
                </div>
                <div className="detail-item">
                  <span className="label">City:</span>
                  <span className="value">{busData.bus.city}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Route:</span>
                  <span className="value">{busData.bus.from} → {busData.bus.to}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Bus Type:</span>
                  <span className="value">{busData.bus.busType}</span>
                </div>
              </div>

              {busData.currentLocation && (
                <div className="location-section">
                  <h3>📍 Current Location</h3>
                  <div className="location-details">
                    <p><strong>Bus Stand:</strong> {busData.currentLocation.busStand}</p>
                    <p><strong>Last Updated:</strong> {new Date(busData.currentLocation.lastUpdated).toLocaleString()}</p>
                  </div>
                </div>
              )}

              <div className="schedule-section">
                <h3>⏰ Schedule Information</h3>
                <div className="schedule-grid">
                  <div className="schedule-item">
                    <span className="schedule-label">Departure Time:</span>
                    <span className="schedule-value">{formatTime(busData.schedule.departureTime)}</span>
                  </div>
                  <div className="schedule-item">
                    <span className="schedule-label">Expected Arrival:</span>
                    <span className="schedule-value">{formatTime(busData.schedule.estimatedArrival)}</span>
                  </div>
                </div>
              </div>

              {busData.nextStops && busData.nextStops.length > 0 && (
                <div className="stops-section">
                  <h3>🚏 Next Bus Stops</h3>
                  <div className="stops-list">
                    {busData.nextStops.map((stop, index) => (
                      <div key={index} className="stop-item">
                        <div className="stop-info">
                          <span className="stop-name">{stop.busStand}</span>
                          <span className="stop-time">{formatTime(stop.estimatedArrival)}</span>
                        </div>
                        <div className="stop-status">
                          <span className={`status-badge ${stop.status}`}>{stop.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Route Tracking Results */}
        {routeData && (
          <div className="tracking-results">
            <div className="info-card">
              <div className="card-header">
                <h2>🗺️ Route Information</h2>
                <div className="status-badge active">Active Route</div>
              </div>

              <div className="details-grid">
                <div className="detail-item">
                  <span className="label">Bus Name:</span>
                  <span className="value">{routeData.busName}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Bus Number:</span>
                  <span className="value">{routeData.busNumber}</span>
                </div>
                <div className="detail-item">
                  <span className="label">City:</span>
                  <span className="value">{routeData.city}</span>
                </div>
                <div className="detail-item">
                  <span className="label">From:</span>
                  <span className="value">{routeData.from}</span>
                </div>
                <div className="detail-item">
                  <span className="label">To:</span>
                  <span className="value">{routeData.to}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Departure Time:</span>
                  <span className="value">{formatTime(routeData.departureTime)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Arrival Time:</span>
                  <span className="value">{formatTime(routeData.arrivalTime)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Bus Type:</span>
                  <span className="value">{routeData.busType}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Fare:</span>
                  <span className="value fare">₹{routeData.fare}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Available Seats:</span>
                  <span className="value seats">{routeData.availableSeats}</span>
                </div>
        </div>

              {routeData.amenities && routeData.amenities.length > 0 && (
                <div className="amenities-section">
                  <h3>🎯 Bus Amenities</h3>
                  <div className="amenities-list">
                    {routeData.amenities.map((amenity, index) => (
                      <span key={index} className="amenity-badge">{amenity}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackBus;
