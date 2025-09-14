import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar"; 
import "./Home.css";

import {
  FaBus,
  FaCalendarAlt,
  FaTicketAlt,
  FaUndoAlt,
  FaSyncAlt,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaIdCard,
  FaListAlt,
  FaTimesCircle,
  FaSearch,
  FaClock,
  FaRoute,
  FaShieldAlt,
} from "react-icons/fa";

function Home() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const topFeatures = [
    { 
      icon: <FaCalendarAlt />, 
      label: "Book Ticket", 
      path: "/booking",
      description: "Book your bus ticket",
      color: "primary"
    },
    { 
      icon: <FaSearch />, 
      label: "Track Bus", 
      path: "/trackbus",
      description: "Real-time bus tracking",
      color: "secondary"
    },
    { 
      icon: <FaListAlt />, 
      label: "Itineraries", 
      path: "/itineraries",
      description: "View bus routes",
      color: "tertiary"
    },
    { 
      icon: <FaIdCard />, 
      label: "Bus Pass", 
      path: "/buspass",
      description: "Get your bus pass",
      color: "quaternary"
    },
  ];

  const mainFeatures = [
    // { icon: <FaTicketAlt />, label: "View Ticket", path: "/viewticket", description: "View your ticket" },
    { icon: <FaTimesCircle />, label: "Cancellation", path: "/cancellation", description: "Cancel booking" },
    { icon: <FaUndoAlt />, label: "Refund Status", path: "/refundstatus", description: "Check refund" },
    { icon: <FaSyncAlt />, label: "Reschedule", path: "/rescheduleticket", description: "Reschedule ticket" },
    { icon: <FaMapMarkerAlt />, label: "Nearby", path: "/nearbylocation", description: "Find locations" },
    { icon: <FaInfoCircle />, label: "Status", path: "/currentstatus", description: "Current status" },
  ];

  const stats = [
    { number: "500+", label: "Buses", icon: <FaBus /> },
    { number: "50+", label: "Routes", icon: <FaRoute /> },
    { number: "24/7", label: "Support", icon: <FaShieldAlt /> },
    { number: "99%", label: "On Time", icon: <FaClock /> },
  ];

  const handleFeatureClick = (item) => {
    navigate(item.path);
  };

  return (
    <div className={`home-container ${isLoaded ? 'loaded' : ''}`}>
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-main">🚌 Smart Bus</span>
              <span className="title-sub">Your Journey, Our Priority</span>
            </h1>
            <p className="hero-description">
              Experience seamless bus travel with real-time tracking, easy booking, and 24/7 support
            </p>
            <div className="hero-time">
              <FaClock className="time-icon" />
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="bus-animation">
              <div className="bus-icon">🚌</div>
              <div className="tracking-lines">
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Features */}
      <section className="feature-section top-features">
        <div className="section-header">
          <h2>Quick Actions</h2>
          <p>Most used features</p>
        </div>
        <div className="features-grid">
          {topFeatures.map((item, index) => (
            <div
              className={`feature-card ${item.color}`}
              key={index}
              onClick={() => handleFeatureClick(item)}
              style={{ cursor: "pointer" }}
            >
              <div className="feature-icon">{item.icon}</div>
              <div className="feature-content">
                <h3>{item.label}</h3>
                <p>{item.description}</p>
              </div>
              <div className="feature-arrow">→</div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Features */}
      <section className="feature-section main-features">
        <div className="section-header">
          <h2>All Services</h2>
          <p>Complete bus management</p>
        </div>
        <div className="features-grid secondary">
          {mainFeatures.map((item, index) => (
            <div
              className="feature-card secondary"
              key={index}
              onClick={() => handleFeatureClick(item)}
              style={{ cursor: "pointer" }}
            >
              <div className="feature-icon">{item.icon}</div>
              <div className="feature-content">
                <h3>{item.label}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section">
        <div className="footer-content">
          <div className="footer-text">
            <h3>🚌 Smart Bus</h3>
            <p>Explore, Experience, Enjoy Smart Bus Travel</p>
          </div>
          <div className="footer-info">
            <p>Visit: www.smartbus.in</p>
            <p>24/7 Customer Support</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;