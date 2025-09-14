const express = require('express');
const router = express.Router();
const Bus = require('../models/Bus');

// @desc    Track bus by tracking number
// @route   GET /api/bus-tracking/:trackingNumber
// @access  Public
router.get('/:trackingNumber', async (req, res) => {
  try {
    const { trackingNumber } = req.params;

    const bus = await Bus.findOne({ trackingNumber: trackingNumber.toUpperCase() });

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found with this tracking number'
      });
    }

    // Get next stops
    const nextStops = bus.getNextStops();

    // Calculate estimated arrival times
    const routeWithEstimates = bus.routeStops.map(stop => ({
      ...stop.toObject(),
      estimatedArrival: bus.getEstimatedArrival(stop.busStand)
    }));

    res.status(200).json({
      success: true,
      data: {
        bus: {
          busName: bus.busName,
          busNumber: bus.busNumber,
          trackingNumber: bus.trackingNumber,
          city: bus.city,
          from: bus.from,
          to: bus.to,
          busType: bus.busType,
          currentStatus: bus.currentStatus,
          delayMinutes: bus.delayMinutes
        },
        currentLocation: bus.currentLocation,
        routeStops: routeWithEstimates,
        nextStops: nextStops,
        schedule: {
          departureTime: bus.departureTime,
          arrivalTime: bus.arrivalTime,
          estimatedArrival: bus.getEstimatedArrival(bus.to)
        }
      }
    });
  } catch (error) {
    console.error('Track bus error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while tracking bus'
    });
  }
});

// @desc    Get all buses in a city
// @route   GET /api/bus-tracking/city/:city
// @access  Public
router.get('/city/:city', async (req, res) => {
  try {
    const { city } = req.params;

    const buses = await Bus.find({ 
      city: new RegExp(city, 'i'),
      isActive: true 
    }).select('busName busNumber trackingNumber city from to currentStatus currentLocation delayMinutes');

    res.status(200).json({
      success: true,
      count: buses.length,
      data: buses
    });
  } catch (error) {
    console.error('Get city buses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching city buses'
    });
  }
});

// @desc    Update bus location (for bus drivers/admin)
// @route   PUT /api/bus-tracking/:trackingNumber/location
// @access  Private (Admin/Driver)
router.put('/:trackingNumber/location', async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const { busStand, latitude, longitude } = req.body;

    const bus = await Bus.findOne({ trackingNumber: trackingNumber.toUpperCase() });

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found with this tracking number'
      });
    }

    await bus.updateLocation(busStand, latitude, longitude);

    res.status(200).json({
      success: true,
      message: 'Bus location updated successfully',
      data: {
        currentLocation: bus.currentLocation
      }
    });
  } catch (error) {
    console.error('Update bus location error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating bus location'
    });
  }
});

// @desc    Update bus status (for bus drivers/admin)
// @route   PUT /api/bus-tracking/:trackingNumber/status
// @access  Private (Admin/Driver)
router.put('/:trackingNumber/status', async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const { status, delayMinutes } = req.body;

    const bus = await Bus.findOne({ trackingNumber: trackingNumber.toUpperCase() });

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found with this tracking number'
      });
    }

    await bus.updateStatus(status, delayMinutes || 0);

    res.status(200).json({
      success: true,
      message: 'Bus status updated successfully',
      data: {
        currentStatus: bus.currentStatus,
        delayMinutes: bus.delayMinutes
      }
    });
  } catch (error) {
    console.error('Update bus status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating bus status'
    });
  }
});

// @desc    Get bus route details
// @route   GET /api/bus-tracking/:trackingNumber/route
// @access  Public
router.get('/:trackingNumber/route', async (req, res) => {
  try {
    const { trackingNumber } = req.params;

    const bus = await Bus.findOne({ trackingNumber: trackingNumber.toUpperCase() });

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found with this tracking number'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        route: {
          from: bus.from,
          to: bus.to,
          city: bus.city,
          totalStops: bus.routeStops.length,
          stops: bus.routeStops.map(stop => ({
            busStand: stop.busStand,
            estimatedArrival: bus.getEstimatedArrival(stop.busStand),
            status: stop.status
          }))
        }
      }
    });
  } catch (error) {
    console.error('Get bus route error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bus route'
    });
  }
});

module.exports = router;
