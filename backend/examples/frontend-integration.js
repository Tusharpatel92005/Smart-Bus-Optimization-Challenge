// Frontend Integration Examples
// This file shows how to integrate the backend API with the React frontend

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    ...options
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication API calls
export const authAPI = {
  // Register user
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // Login user
  login: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  // Get current user
  getCurrentUser: async () => {
    return apiRequest('/auth/me');
  },

  // Update profile
  updateProfile: async (profileData) => {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }
};

// Buses API calls
export const busesAPI = {
  // Get all buses
  getAllBuses: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters);
    return apiRequest(`/buses?${queryParams}`);
  },

  // Get single bus
  getBus: async (busId) => {
    return apiRequest(`/buses/${busId}`);
  },

  // Get available seats
  getAvailableSeats: async (busId) => {
    return apiRequest(`/buses/${busId}/seats`);
  }
};

// Bookings API calls
export const bookingsAPI = {
  // Create booking
  createBooking: async (bookingData) => {
    return apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
  },

  // Get user bookings
  getUserBookings: async () => {
    return apiRequest('/bookings');
  },

  // Get booking by PNR
  getBookingByPNR: async (pnr) => {
    return apiRequest(`/bookings/pnr/${pnr}`);
  },

  // Cancel booking
  cancelBooking: async (bookingId) => {
    return apiRequest(`/bookings/${bookingId}/cancel`, {
      method: 'PUT'
    });
  },

  // Get booking statistics
  getBookingStats: async () => {
    return apiRequest('/bookings/stats/overview');
  }
};

// Bus Passes API calls
export const busPassesAPI = {
  // Create bus pass
  createBusPass: async (passData) => {
    return apiRequest('/buspasses', {
      method: 'POST',
      body: JSON.stringify(passData)
    });
  },

  // Get user bus passes
  getUserBusPasses: async () => {
    return apiRequest('/buspasses');
  },

  // Use bus pass
  useBusPass: async (passId) => {
    return apiRequest(`/buspasses/${passId}/use`, {
      method: 'POST'
    });
  },

  // Validate bus pass
  validateBusPass: async (passId) => {
    return apiRequest(`/buspasses/${passId}/validate`);
  }
};

// Example usage in React components:

/*
// In your React component
import { authAPI, busesAPI, bookingsAPI } from './api';

// Login example
const handleLogin = async (email, password) => {
  try {
    const response = await authAPI.login({ email, password });
    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    // Redirect to dashboard
  } catch (error) {
    console.error('Login failed:', error.message);
  }
};

// Get buses example
const loadBuses = async (city, from, to) => {
  try {
    const response = await busesAPI.getAllBuses({ city, from, to });
    setBuses(response.data);
  } catch (error) {
    console.error('Failed to load buses:', error.message);
  }
};

// Create booking example
const handleBooking = async (busId, seatNumber, travelDate, passengerDetails) => {
  try {
    const response = await bookingsAPI.createBooking({
      busId,
      seatNumber,
      travelDate,
      passengerDetails
    });
    console.log('Booking created:', response.data);
  } catch (error) {
    console.error('Booking failed:', error.message);
  }
};
*/
