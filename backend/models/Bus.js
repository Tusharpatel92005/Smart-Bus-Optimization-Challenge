const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busName: {
    type: String,
    required: [true, 'Bus name is required'],
    trim: true,
    maxlength: [100, 'Bus name cannot be more than 100 characters']
  },
  busNumber: {
    type: String,
    required: [true, 'Bus number is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  trackingNumber: {
    type: String,
    unique: true,
    sparse: true  // Allows null values but ensures uniqueness when present
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  from: {
    type: String,
    required: [true, 'From location is required'],
    trim: true
  },
  to: {
    type: String,
    required: [true, 'To location is required'],
    trim: true
  },
  departureTime: {
    type: String,
    required: [true, 'Departure time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter time in HH:MM format']
  },
  arrivalTime: {
    type: String,
    required: [true, 'Arrival time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter time in HH:MM format']
  },
  totalSeats: {
    type: Number,
    required: [true, 'Total seats is required'],
    min: [1, 'Total seats must be at least 1'],
    max: [100, 'Total seats cannot exceed 100']
  },
  availableSeats: {
    type: Number,
    required: [true, 'Available seats is required'],
    min: [0, 'Available seats cannot be negative']
  },
  bookedSeats: {
    type: [Number],
    default: []
  },
  fare: {
    type: Number,
    required: [true, 'Fare is required'],
    min: [0, 'Fare cannot be negative']
  },
  busType: {
    type: String,
    enum: ['AC', 'Non-AC', 'Sleeper', 'Semi-Sleeper'],
    default: 'Non-AC'
  },
  amenities: [{
    type: String,
    enum: ['WiFi', 'Charging Point', 'Water Bottle', 'Blanket', 'Pillow', 'TV', 'Music']
  }],
  // Bus tracking and location information
  currentLocation: {
    busStand: String,     // Current bus stand name
    latitude: Number,     // GPS latitude
    longitude: Number,    // GPS longitude
    lastUpdated: Date     // Last location update
  },
  routeStops: [{
    busStand: String,     // Bus stand name
    estimatedArrival: String,  // Estimated arrival time
    actualArrival: String,     // Actual arrival time
    status: {
      type: String,
      enum: ['pending', 'arrived', 'departed', 'delayed'],
      default: 'pending'
    }
  }],
  currentStatus: {
    type: String,
    enum: ['not_started', 'running', 'delayed', 'completed', 'cancelled'],
    default: 'not_started'
  },
  delayMinutes: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update available seats when bookings change
busSchema.methods.updateAvailableSeats = function() {
  this.availableSeats = this.totalSeats - this.bookedSeats.length;
  return this.save();
};

// Check if seat is available
busSchema.methods.isSeatAvailable = function(seatNumber) {
  return !this.bookedSeats.includes(seatNumber);
};

// Book a seat
busSchema.methods.bookSeat = function(seatNumber) {
  if (this.isSeatAvailable(seatNumber)) {
    this.bookedSeats.push(seatNumber);
    this.availableSeats = this.totalSeats - this.bookedSeats.length;
    return this.save();
  }
  throw new Error('Seat is already booked');
};

// Cancel a seat
busSchema.methods.cancelSeat = function(seatNumber) {
  const index = this.bookedSeats.indexOf(seatNumber);
  if (index > -1) {
    this.bookedSeats.splice(index, 1);
    this.availableSeats = this.totalSeats - this.bookedSeats.length;
    return this.save();
  }
  throw new Error('Seat is not booked');
};

// Generate unique tracking number
busSchema.methods.generateTrackingNumber = function() {
  const cityCode = this.city.substring(0, 2).toUpperCase();
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  this.trackingNumber = `${cityCode}${randomNum}`;
  return this.trackingNumber;
};

// Update bus location
busSchema.methods.updateLocation = function(busStand, latitude, longitude) {
  this.currentLocation = {
    busStand,
    latitude,
    longitude,
    lastUpdated: new Date()
  };
  return this.save();
};

// Update bus status
busSchema.methods.updateStatus = function(status, delayMinutes = 0) {
  this.currentStatus = status;
  this.delayMinutes = delayMinutes;
  return this.save();
};

// Get estimated arrival time at a specific bus stand
busSchema.methods.getEstimatedArrival = function(busStand) {
  const stop = this.routeStops.find(stop => stop.busStand === busStand);
  if (!stop) return null;
  
  const baseTime = stop.estimatedArrival;
  if (this.delayMinutes > 0) {
    const [hours, minutes] = baseTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + this.delayMinutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
  }
  return baseTime;
};

// Get next bus stands
busSchema.methods.getNextStops = function() {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const currentTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
  
  return this.routeStops.filter(stop => {
    if (stop.status === 'departed' || stop.status === 'arrived') return false;
    return stop.estimatedArrival >= currentTimeStr;
  });
};

// Generate tracking number before saving
busSchema.pre('save', function(next) {
  if (this.isNew && !this.trackingNumber) {
    this.generateTrackingNumber();
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Bus', busSchema);
