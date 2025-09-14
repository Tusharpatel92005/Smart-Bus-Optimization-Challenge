import React, { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import "./Booking.css";
import { useNavigate } from "react-router-dom";

function Booking() {
    const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState("");
  const [form, setForm] = useState({
    from: "",
    to: "",
    date: "",
  });

  const [buses, setBuses] = useState([]);
  const [message, setMessage] = useState("");

  const cityLocations = {
    Delhi: ["Connaught Place", "Karol Bagh", "Dwarka", "Rohini"],
    Mumbai: ["Andheri", "Bandra", "Dadar", "Colaba"],
    Bangalore: ["Majestic", "Whitefield", "Koramangala", "Indiranagar"],
    Chennai: ["T. Nagar", "Anna Nagar", "Adyar", "Tambaram"],
    Pune: ["Shivaji Nagar", "Kothrud", "Hadapsar", "Aundh"],
    Hyderabad: ["Secunderabad", "Banjara Hills", "Hitech City", "Miyapur"],
    Kolkata: ["Salt Lake", "Esplanade", "Howrah", "Park Street"],
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setForm({ from: "", to: "", date: "" });
    setBuses([]);
    setMessage("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!form.from || !form.to || !form.date) {
      setMessage("❌ Please fill all fields!");
      setBuses([]);
      return;
    }
    if (form.from === form.to) {
      setMessage("❌ From and To cannot be the same!");
      setBuses([]);
      return;
    }

    // Simulated local bus search
    const availableBuses = [
      { name: `${selectedCity} Local Bus 1`, time: "08:00 AM" },
      { name: `${selectedCity} Local Bus 2`, time: "10:30 AM" },
      { name: `${selectedCity} Local Bus 3`, time: "02:00 PM" },
    ];

    setBuses(availableBuses);
    setMessage(`✅ Found ${availableBuses.length} buses for your route in ${selectedCity}.`);
  };

  const handleBook = (busName) => {

    navigate("/bookseat", { state: { 
      busName, 
      selectedCity, 
      from: form.from, 
      to: form.to, 
      date: form.date 
    } });
  };

  return (
    <div className="booking-page">
      <Navbar />

      <div className="booking-container">
        <h1>🚌 Book Local City Bus</h1>

        <label>Select City</label>
        <select value={selectedCity} onChange={handleCityChange}>
          <option value="">-- Select City --</option>
          {Object.keys(cityLocations).map((city, index) => (
            <option key={index} value={city}>{city}</option>
          ))}
        </select>

        {selectedCity && (
          <form className="booking-form" onSubmit={handleSearch}>
            <label>From</label>
            <select name="from" value={form.from} onChange={handleChange} required>
              <option value="">-- Select Starting Point --</option>
              {cityLocations[selectedCity].map((location, idx) => (
                <option key={idx} value={location}>{location}</option>
              ))}
            </select>

            <label>To</label>
            <select name="to" value={form.to} onChange={handleChange} required>
              <option value="">-- Select Destination --</option>
              {cityLocations[selectedCity].map((location, idx) => (
                <option key={idx} value={location}>{location}</option>
              ))}
            </select>

            <label>Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />

            <button type="submit" className="search-btn"> Search Buses</button>
          </form>
        )}

        {message && <p className="booking-message">{message}</p>}

        {buses.length > 0 && (
          <div className="bus-list">
            <h2>Available Local Buses</h2>
            <ul>
              {buses.map((bus, index) => (
                <li key={index}>
                  <span>{bus.name} - {bus.time}</span>
                  <button onClick={() => handleBook(bus.name)}>Book Seat</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Booking;
