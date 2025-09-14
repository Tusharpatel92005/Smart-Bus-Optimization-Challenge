const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Bus = require('../models/Bus');
const { protect } = require('../middleware/auth');
const { validateBooking } = require('../middleware/validation');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
router.post('/', protect, validateBooking, async (req, res) => {
  try {
    const { busId, seatNumber, travelDate, passengerDetails } = req.body;

    // Get bus details
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    // Check if seat is available
    if (!bus.isSeatAvailable(seatNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Seat is already booked'
      });
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      bus: busId,
      busName: bus.busName,
      city: bus.city,
      from: bus.from,
      to: bus.to,
      travelDate,
      seatNumber,
      passengerDetails,
      fare: bus.fare
    });

    // Book the seat in bus
    await bus.bookSeat(seatNumber);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating booking'
    });
  }
});

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('bus', 'busName busNumber city from to departureTime arrivalTime')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings'
    });
  }
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('bus', 'busName busNumber city from to departureTime arrivalTime');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching booking'
    });
  }
});

// @desc    Get booking by PNR
// @route   GET /api/bookings/pnr/:pnr
// @access  Public
router.get('/pnr/:pnr', async (req, res) => {
  try {
    const booking = await Booking.findOne({ pnr: req.params.pnr.toUpperCase() })
      .populate('bus', 'busName busNumber city from to departureTime arrivalTime')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found with this PNR'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking by PNR error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching booking'
    });
  }
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    if (!booking.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled within 24 hours of travel'
      });
    }

    // Cancel booking
    await booking.cancelBooking();

    // Free up the seat
    const bus = await Bus.findById(booking.bus);
    if (bus) {
      await bus.cancelSeat(booking.seatNumber);
    }

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: {
        refundAmount: booking.refundAmount,
        cancellationTime: booking.cancellationTime
      }
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling booking'
    });
  }
});

// @desc    Get booking statistics
// @route   GET /api/bookings/stats/overview
// @access  Private
router.get('/stats/overview', protect, async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments({ user: req.user._id });
    const confirmedBookings = await Booking.countDocuments({ 
      user: req.user._id, 
      status: 'confirmed' 
    });
    const cancelledBookings = await Booking.countDocuments({ 
      user: req.user._id, 
      status: 'cancelled' 
    });

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        confirmedBookings,
        cancelledBookings
      }
    });
  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching booking statistics'
    });
  }
});

module.exports = router;
