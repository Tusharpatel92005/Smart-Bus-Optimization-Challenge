// API Configuration and Utilities
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Create an Axios instance
const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------------- AUTH ----------------
export const authAPI = {
  // Register user
  register: (userData) => API.post("/auth/register", userData),

  // Login user
  login: (credentials) => API.post("/auth/login", credentials),

  // Get current user
  getCurrentUser: () => API.get("/auth/me"),

  // Update profile
  updateProfile: (profileData) => API.put("/auth/profile", profileData),
};

// ---------------- BUSES ----------------
export const busesAPI = {
  // Get all buses
  getAllBuses: (filters = {}) =>
    API.get("/buses", { params: filters }),

  // Get single bus
  getBus: (busId) => API.get(`/buses/${busId}`),

  // Get available seats
  getAvailableSeats: (busId) => API.get(`/buses/${busId}/seats`),
};

// ---------------- BOOKINGS ----------------
export const bookingsAPI = {
  // Create booking
  createBooking: (bookingData) => API.post("/bookings", bookingData),

  // Get user bookings
  getUserBookings: () => API.get("/bookings"),

  // Get booking by PNR
  getBookingByPNR: (pnr) => API.get(`/bookings/pnr/${pnr}`),

  // Cancel booking
  cancelBooking: (bookingId) => API.put(`/bookings/${bookingId}/cancel`),

  // Get booking statistics
  getBookingStats: () => API.get("/bookings/stats/overview"),
};

// ---------------- BUS PASSES ----------------
export const busPassesAPI = {
  // Create bus pass
  createBusPass: (passData) => API.post("/buspasses", passData),

  // Get user bus passes
  getUserBusPasses: () => API.get("/buspasses"),

  // Get single bus pass
  getBusPass: (passId) => API.get(`/buspasses/${passId}`),

  // Use bus pass
  useBusPass: (passId) => API.post(`/buspasses/${passId}/use`),

  // Validate bus pass
  validateBusPass: (passId) => API.get(`/buspasses/${passId}/validate`),

  // Get bus pass statistics
  getBusPassStats: () => API.get("/buspasses/stats/overview"),
};

// ---------------- BUS TRACKING ----------------
export const busTrackingAPI = {
  // Track bus by tracking number
  trackBus: (trackingNumber) => API.get(`/bus-tracking/${trackingNumber}`),

  // Get all buses in a city
  getCityBuses: (city) => API.get(`/bus-tracking/city/${city}`),

  // Get bus route details
  getBusRoute: (trackingNumber) =>
    API.get(`/bus-tracking/${trackingNumber}/route`),

  // Update bus location (for drivers/admin)
  updateBusLocation: (trackingNumber, locationData) =>
    API.put(`/bus-tracking/${trackingNumber}/location`, locationData),

  // Update bus status (for drivers/admin)
  updateBusStatus: (trackingNumber, statusData) =>
    API.put(`/bus-tracking/${trackingNumber}/status`, statusData),
};

export default {
  authAPI,
  busesAPI,
  bookingsAPI,
  busPassesAPI,
  busTrackingAPI,
};
