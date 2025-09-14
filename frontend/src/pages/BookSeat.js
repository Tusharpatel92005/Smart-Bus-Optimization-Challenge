import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import "./BookSeat.css";

function BookSeat() {
  const location = useLocation();
  const navigate = useNavigate();
  const { busName, selectedCity, from, to, date } = location.state || {};

  const [selectedSeat, setSelectedSeat] = useState("");
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [viewTicket, setViewTicket] = useState(false);
  const [pnrNumber, setPnrNumber] = useState("");
  const [bookedSeats, setBookedSeats] = useState(new Set());

  const seats = Array.from({ length: 30 }, (_, i) => i + 1); // 30 seats

  // Load booked seats from localStorage on component mount
  useEffect(() => {
    const busKey = `${busName}_${selectedCity}_${from}_${to}_${date}`;
    const savedBookedSeats = localStorage.getItem(`bookedSeats_${busKey}`);
    if (savedBookedSeats) {
      setBookedSeats(new Set(JSON.parse(savedBookedSeats)));
    }
  }, [busName, selectedCity, from, to, date]);

  const handleDetailsChange = (e) => {
    setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
  };

  const generatePnr = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
    let digits = "";
    for (let i = 0; i < 9; i++) {
      digits += Math.floor(Math.random() * 10);
    }
    return randomLetter + digits;
  };

  const handleSeatClick = (seatNumber) => {
    // Don't allow selection of already booked seats
    if (bookedSeats.has(seatNumber)) {
      alert("❌ This seat is already booked by another passenger!");
      return;
    }
    setSelectedSeat(seatNumber);
  };

  const handleConfirmBooking = () => {
    if (!selectedSeat || !customerDetails.name || !customerDetails.email || !customerDetails.phone) {
      alert("❌ Please fill all details and select a seat.");
      return;
    }

    // Check if seat is still available (in case someone else booked it)
    if (bookedSeats.has(selectedSeat)) {
      alert("❌ Sorry, this seat was just booked by another passenger. Please select another seat.");
      return;
    }

    const pnr = generatePnr();
    setPnrNumber(pnr);
    
    // Add the seat to booked seats
    const newBookedSeats = new Set([...bookedSeats, selectedSeat]);
    setBookedSeats(newBookedSeats);
    
    // Save to localStorage
    const busKey = `${busName}_${selectedCity}_${from}_${to}_${date}`;
    localStorage.setItem(`bookedSeats_${busKey}`, JSON.stringify([...newBookedSeats]));
    
    // Save booking details
    const bookingDetails = {
      pnr,
      busName,
      selectedCity,
      from,
      to,
      date,
      seatNumber: selectedSeat,
      customerDetails,
      bookingTime: new Date().toISOString()
    };
    
    const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    existingBookings.push(bookingDetails);
    localStorage.setItem('userBookings', JSON.stringify(existingBookings));
    
    setPaymentConfirmed(true);
  };

  const handleDownloadTicket = () => {
    const ticketContent = `
🎫 Smart Bus Ticket

PNR Number: ${pnrNumber}
Bus: ${busName}
City: ${selectedCity}
From: ${from}
To: ${to}
Date: ${date}
Seat Number: ${selectedSeat}

Passenger Name: ${customerDetails.name}
Email: ${customerDetails.email}
Phone: ${customerDetails.phone}

Payment: Cash Payment
    `;

    const blob = new Blob([ticketContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SmartBus_Ticket_${pnrNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bookseat-page">
      <Navbar />

      <div className="bookseat-container">
        <h1>🎫 Book Your Seat</h1>

        <div className="bus-info">
          <p><strong>Bus:</strong> {busName}</p>
          <p><strong>City:</strong> {selectedCity}</p>
          <p><strong>From:</strong> {from}</p>
          <p><strong>To:</strong> {to}</p>
          <p><strong>Date:</strong> {date}</p>
        </div>

        {!paymentConfirmed ? (
          <>
            <h2>Select Your Seat</h2>
            <div className="seat-legend">
              <div className="legend-item">
                <div className="seat available"></div>
                <span>Available</span>
              </div>
              <div className="legend-item">
                <div className="seat selected"></div>
                <span>Selected</span>
              </div>
              <div className="legend-item">
                <div className="seat booked"></div>
                <span>Booked</span>
              </div>
            </div>
            <div className="seat-grid">
              {seats.map((seat) => {
                const isBooked = bookedSeats.has(seat);
                const isSelected = selectedSeat === seat;
                
                return (
                  <div
                    key={seat}
                    className={`seat ${
                      isBooked ? "booked" : isSelected ? "selected" : "available"
                    }`}
                    onClick={() => handleSeatClick(seat)}
                    title={isBooked ? "This seat is already booked" : `Seat ${seat}`}
                  >
                    {seat}
                  </div>
                );
              })}
            </div>

            <h2>Enter Your Details</h2>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={customerDetails.name}
              onChange={handleDetailsChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={customerDetails.email}
              onChange={handleDetailsChange}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={customerDetails.phone}
              onChange={handleDetailsChange}
            />

            <button className="confirm-btn" onClick={handleConfirmBooking}>
              💵 Confirm & Pay (Cash Payment)
            </button>
          </>
        ) : (
          <>
            <p className="confirmation-message">
              ✅ Booking Confirmed! Your PNR Number: <strong>{pnrNumber}</strong>
            </p>

            <div className="post-booking-options">
              <button onClick={() => setViewTicket(true)}>📄 View Ticket</button>
              <button onClick={handleDownloadTicket}>⬇️ Download Ticket</button>
              <button onClick={() => navigate("/")}>🏠 Go to Home</button>
            </div>

            {viewTicket && (
              <div className="ticket-details">
                <h2>Your Bus Ticket</h2>
                <p><strong>PNR Number:</strong> {pnrNumber}</p>
                <p><strong>Bus:</strong> {busName}</p>
                <p><strong>City:</strong> {selectedCity}</p>
                <p><strong>From:</strong> {from}</p>
                <p><strong>To:</strong> {to}</p>
                <p><strong>Date:</strong> {date}</p>
                <p><strong>Seat Number:</strong> {selectedSeat}</p>
                <p><strong>Passenger Name:</strong> {customerDetails.name}</p>
                <p><strong>Email:</strong> {customerDetails.email}</p>
                <p><strong>Phone:</strong> {customerDetails.phone}</p>
                <p><strong>Payment:</strong> Cash Payment</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default BookSeat;
