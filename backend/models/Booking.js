const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  pnr: {
    type: String,
    required: [true, 'PNR is required'],
    unique: true,
    uppercase: true,
    length: [10, 'PNR must be exactly 10 characters']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: [true, 'Bus is required']
  },
  busName: {
    type: String,
    required: [true, 'Bus name is required']
  },
  city: {
    type: String,
    required: [true, 'City is required']
  },
  from: {
    type: String,
    required: [true, 'From location is required']
  },
  to: {
    type: String,
    required: [true, 'To location is required']
  },
  travelDate: {
    type: Date,
    required: [true, 'Travel date is required']
  },
  seatNumber: {
    type: Number,
    required: [true, 'Seat number is required'],
    min: [1, 'Seat number must be at least 1']
  },
  passengerDetails: {
    name: {
      type: String,
      required: [true, 'Passenger name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Passenger email is required'],
      lowercase: true
    },
    phone: {
      type: String,
      required: [true, 'Passenger phone is required']
    }
  },
  fare: {
    type: Number,
    required: [true, 'Fare is required'],
    min: [0, 'Fare cannot be negative']
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'paid'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'netbanking'],
    default: 'cash'
  },
  bookingTime: {
    type: Date,
    default: Date.now
  },
  cancellationTime: {
    type: Date
  },
  refundAmount: {
    type: Number,
    default: 0
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

// Generate PNR before saving
bookingSchema.pre('save', function(next) {
  if (this.isNew && !this.pnr) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
    let digits = '';
    for (let i = 0; i < 9; i++) {
      digits += Math.floor(Math.random() * 10);
    }
    this.pnr = randomLetter + digits;
  }
  next();
});

// Update updatedAt field
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Cancel booking method
bookingSchema.methods.cancelBooking = function() {
  this.status = 'cancelled';
  this.cancellationTime = new Date();
  this.refundAmount = Math.round(this.fare * 0.7); // 70% refund
  this.paymentStatus = 'refunded';
  return this.save();
};

// Check if booking can be cancelled (within 24 hours of travel)
bookingSchema.methods.canBeCancelled = function() {
  const now = new Date();
  const travelDate = new Date(this.travelDate);
  const timeDiff = travelDate.getTime() - now.getTime();
  const hoursDiff = timeDiff / (1000 * 3600);
  return hoursDiff > 24;
};

module.exports = mongoose.model('Booking', bookingSchema);
