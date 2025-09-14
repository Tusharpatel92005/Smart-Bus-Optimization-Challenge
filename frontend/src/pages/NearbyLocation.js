import React, { useState } from "react";
import "./NearbyLocation.css";
import Navbar from "../components/navbar/Navbar";

function NearbyLocation() {
  const [location, setLocation] = useState("");
  const [places, setPlaces] = useState([]);

  const handleFind = () => {
    if (location) {
      setPlaces([
        `${location} Bus Stop`,
        `${location} Petrol Pump`,
        `${location} Restaurant`,
      ]);
    } else {
      alert("Please enter a location.");
    }
  };

  return (
    <div className="trackbus-page">
      <Navbar />
    <div className="nearby-container">
      <h2>Nearby Locations</h2>
      <input
        type="text"
        placeholder="Enter Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button onClick={handleFind}>Find Places</button>
      <ul>
        {places.map((place, index) => (
          <li key={index}>{place}</li>
        ))}
      </ul>
    </div>
    </div>
  );
}

export default NearbyLocation;
