const express = require('express');
const router = express.Router();
const Bus = require('../models/Bus');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get all buses
// @route   GET /api/buses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { city, from, to, date } = req.query;
    let query = { isActive: true };

    // Filter by city
    if (city) {
      query.city = new RegExp(city, 'i');
    }

    // Filter by route
    if (from && to) {
      query.from = new RegExp(from, 'i');
      query.to = new RegExp(to, 'i');
    }

    const buses = await Bus.find(query)
      .select('-bookedSeats')
      .sort({ departureTime: 1 });

    res.status(200).json({
      success: true,
      count: buses.length,
      data: buses
    });
  } catch (error) {
    console.error('Get buses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching buses'
    });
  }
});

// @desc    Get single bus
// @route   GET /api/buses/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    res.status(200).json({
      success: true,
      data: bus
    });
  } catch (error) {
    console.error('Get bus error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bus'
    });
  }
});

// @desc    Create new bus
// @route   POST /api/buses
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const bus = await Bus.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Bus created successfully',
      data: bus
    });
  } catch (error) {
    console.error('Create bus error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating bus'
    });
  }
});

// @desc    Update bus
// @route   PUT /api/buses/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Bus updated successfully',
      data: bus
    });
  } catch (error) {
    console.error('Update bus error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating bus'
    });
  }
});

// @desc    Delete bus
// @route   DELETE /api/buses/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Bus deleted successfully'
    });
  } catch (error) {
    console.error('Delete bus error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting bus'
    });
  }
});

// @desc    Get available seats for a bus
// @route   GET /api/buses/:id/seats
// @access  Public
router.get('/:id/seats', async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    const availableSeats = [];
    for (let i = 1; i <= bus.totalSeats; i++) {
      if (!bus.bookedSeats.includes(i)) {
        availableSeats.push(i);
      }
    }

    res.status(200).json({
      success: true,
      data: {
        totalSeats: bus.totalSeats,
        availableSeats,
        bookedSeats: bus.bookedSeats,
        availableCount: availableSeats.length
      }
    });
  } catch (error) {
    console.error('Get seats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching seats'
    });
  }
});

module.exports = router;
