import React, { useState } from "react";
import "./BusPass.css";
import Navbar from "../components/navbar/Navbar";

function BusPass() {
  const [formData, setFormData] = useState({
    passType: "daily",
    city: "",
    validFrom: "",
    validTo: ""
  });
  const [busPass, setBusPass] = useState(null);
  const [showPass, setShowPass] = useState(false);

  // calculate ValidTo date automatically
  const calculateEndDate = (startDate, passType) => {
    const start = new Date(startDate);
    const end = new Date(start);

    switch (passType) {
      case "daily":
        end.setDate(start.getDate() + 1);
        break;
      case "weekly":
        end.setDate(start.getDate() + 7);
        break;
      case "monthly":
        end.setMonth(start.getMonth() + 1);
        break;
      case "yearly":
        end.setFullYear(start.getFullYear() + 1);
        break;
      default:
        end.setDate(start.getDate() + 1);
    }
    return end.toISOString().split("T")[0];
  };

  // handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "passType") {
      setFormData((prev) => ({
        ...prev,
        passType: value,
        validTo: prev.validFrom ? calculateEndDate(prev.validFrom, value) : ""
      }));
    } else if (name === "validFrom") {
      setFormData((prev) => ({
        ...prev,
        validFrom: value,
        validTo: calculateEndDate(value, prev.passType)
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // generate bus pass
  const handleGenerate = () => {
    if (!formData.city || !formData.validFrom) {
      alert("Please fill all required fields");
      return;
    }
    setBusPass({ ...formData });
    setShowPass(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="trackbus-page">
      <Navbar />
      <div className="buspass-container">
        <h2>Bus Pass Management</h2>

        {!showPass && (
          <div className="pass-form">
            <h3>Create New Bus Pass</h3>

            <div className="form-group">
              <label>Pass Type:</label>
              <select
                name="passType"
                value={formData.passType}
                onChange={handleChange}
              >
                <option value="daily">Daily Pass (₹50)</option>
                <option value="weekly">Weekly Pass (₹300)</option>
                <option value="monthly">Monthly Pass (₹1000)</option>
                <option value="yearly">Yearly Pass (₹10000)</option>
              </select>
            </div>

            <div className="form-group">
              <label>City:</label>
              <input
                type="text"
                name="city"
                placeholder="Enter city name"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Valid From:</label>
              <input
                type="date"
                name="validFrom"
                value={formData.validFrom}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Valid To:</label>
              <input type="date" name="validTo" value={formData.validTo} readOnly />
            </div>

            <button onClick={handleGenerate} className="generate-btn">
              Generate Bus Pass
            </button>
          </div>
        )}

        {showPass && busPass && (
          <div className="pass-card">
            <div className="pass-header">
              <h3>{busPass.passType.toUpperCase()} Pass</h3>
              <span className="status active">Active</span>
            </div>
            <div className="pass-details">
              <p>
                <strong>City:</strong> {busPass.city}
              </p>
              <p>
                <strong>Valid From:</strong> {formatDate(busPass.validFrom)}
              </p>
              <p>
                <strong>Valid To:</strong> {formatDate(busPass.validTo)}
              </p>
            </div>

            <div className="action-buttons">
              <button onClick={() => setShowPass(true)} className="view-btn">
                👀 View Bus Pass
              </button>
              <button onClick={() => window.print()} className="download-btn">
                ⬇ Download Bus Pass
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="home-btn"
              >
                🏠 Go to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BusPass;
