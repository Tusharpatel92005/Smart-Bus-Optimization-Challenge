import React from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ use Link for navigation
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // clear session
    alert("👋 You have been logged out.");
    navigate("/login"); // redirect to login page
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">🚌 Smart Bus</div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        
        <li>
          <Link to="/">Live Status</Link>
        </li>
        <li>
          <Link to="/">Schedule</Link>
        </li>
        <li>
          <Link to="/">Announcements</Link>
        </li>
      </ul>
      <button className="logout-btn" onClick={handleLogout}>
         Logout
      </button>
    </nav>
  );
}

export default Navbar;
