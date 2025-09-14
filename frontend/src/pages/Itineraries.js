import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar/Navbar";
import "./Itineraries.css";
import { busesAPI } from "../utils/api";

function Itineraries() {
  const [selectedCity, setSelectedCity] = useState("");
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const cities = [
    "Delhi", "Mumbai", "Bangalore", "Chennai", "Pune", "Hyderabad", "Kolkata"
  ];

  const cityLocations = {
    Delhi: ["Connaught Place", "Karol Bagh", "Dwarka", "Rohini"],
    Mumbai: ["Andheri", "Bandra", "Dadar", "Colaba"],
    Bangalore: ["Majestic", "Whitefield", "Koramangala", "Indiranagar"],
    Chennai: ["T. Nagar", "Anna Nagar", "Adyar", "Tambaram"],
    Pune: ["Shivaji Nagar", "Kothrud", "Hadapsar", "Aundh"],
    Hyderabad: ["Secunderabad", "Banjara Hills", "Hitech City", "Miyapur"],
    Kolkata: ["Salt Lake", "Esplanade", "Howrah", "Park Street"],
  };

  const loadCityBuses = async (city) => {
    if (!city) return;
    
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await busesAPI.getAllBuses({ city });
      setBuses(response.data);
      
      if (response.data.length === 0) {
        setMessage(`No buses found for ${city}. Please try another city.`);
      } else {
        setMessage(`Found ${response.data.length} buses in ${city}`);
      }
    } catch (error) {
      setError(error.message || "Failed to load buses");
      setBuses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    setBuses([]);
    setMessage("");
    setError("");
    
    if (city) {
      loadCityBuses(city);
    }
  };

  const formatTime = (timeString) => {
    return timeString || "N/A";
  };

  const calculateDuration = (departureTime, arrivalTime) => {
    if (!departureTime || !arrivalTime) return "N/A";
    
    const [depHour, depMin] = departureTime.split(':').map(Number);
    const [arrHour, arrMin] = arrivalTime.split(':').map(Number);
    
    const depMinutes = depHour * 60 + depMin;
    const arrMinutes = arrHour * 60 + arrMin;
    
    let diffMinutes = arrMinutes - depMinutes;
    if (diffMinutes < 0) diffMinutes += 24 * 60; // Handle overnight travel
    
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  };

  const getAvailableRoutes = () => {
    if (!selectedCity || buses.length === 0) return [];
    
    const routes = new Map();
    buses.forEach(bus => {
      const routeKey = `${bus.from} → ${bus.to}`;
      if (!routes.has(routeKey)) {
        routes.set(routeKey, {
          from: bus.from,
          to: bus.to,
          duration: calculateDuration(bus.departureTime, bus.arrivalTime),
          busCount: 0,
          minFare: bus.fare,
          maxFare: bus.fare,
          buses: []
        });
      }
      
      const route = routes.get(routeKey);
      route.busCount++;
      route.minFare = Math.min(route.minFare, bus.fare);
      route.maxFare = Math.max(route.maxFare, bus.fare);
      route.buses.push(bus);
    });
    
    return Array.from(routes.values());
  };

  const availableRoutes = getAvailableRoutes();

  return (
    <div className="itineraries-page">
      <Navbar />

      <div className="itineraries-container">
        <h1>🗺️ City Bus Itineraries</h1>
        
        <div className="city-selector">
          <label htmlFor="citySelect">Select City:</label>
          <select 
            id="citySelect"
            value={selectedCity} 
            onChange={handleCityChange}
            className="city-select"
          >
            <option value="">-- Choose a City --</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="loading-message">
            <div className="spinner"></div>
            Loading buses for {selectedCity}...
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
        {message && !loading && <div className="info-message">{message}</div>}

        {selectedCity && !loading && (
          <div className="city-info">
            <h2>📍 {selectedCity} Bus Routes</h2>
            <p className="city-description">
              Available locations in {selectedCity}: {cityLocations[selectedCity]?.join(", ")}
            </p>
          </div>
        )}

        {availableRoutes.length > 0 && (
          <div className="routes-section">
            <h3>🚌 Available Routes</h3>
            <div className="routes-grid">
              {availableRoutes.map((route, index) => (
                <div key={index} className="route-card">
                  <div className="route-header">
                    <h4>{route.from} → {route.to}</h4>
                    <span className="route-duration">{route.duration}</span>
                  </div>
                  <div className="route-details">
                    <p><strong>Buses Available:</strong> {route.busCount}</p>
                    <p><strong>Fare Range:</strong> ₹{route.minFare} - ₹{route.maxFare}</p>
                  </div>
                  <div className="route-buses">
                    <h5>Bus Details:</h5>
                    {route.buses.map((bus, busIndex) => (
                      <div key={busIndex} className="bus-item">
                        <span className="bus-name">{bus.busName}</span>
                        <span className="bus-time">{formatTime(bus.departureTime)} - {formatTime(bus.arrivalTime)}</span>
                        <span className="bus-fare">₹{bus.fare}</span>
                        <span className="bus-type">{bus.busType}</span>
                        <span className="bus-seats">{bus.availableSeats} seats available</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedCity && buses.length === 0 && !loading && !error && (
          <div className="no-buses">
            <p>No buses found for {selectedCity}. Please try another city.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Itineraries;
