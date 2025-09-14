const express = require('express');
const router = express.Router();
const BusPass = require('../models/BusPass');
const { protect } = require('../middleware/auth');
const { validateBusPass } = require('../middleware/validation');

// @desc    Create new bus pass
// @route   POST /api/buspasses
// @access  Private
router.post('/', protect, validateBusPass, async (req, res) => {
  try {
    const { passType, city, validFrom, validTo } = req.body;

    // Calculate price based on pass type
    const prices = {
      daily: 50,
      weekly: 300,
      monthly: 1000,
      yearly: 10000
    };

    // Calculate max usage based on pass type
    const maxUsages = {
      daily: 10,
      weekly: 50,
      monthly: 200,
      yearly: 2000
    };

    const busPass = await BusPass.create({
      user: req.user._id,
      passType,
      city,
      validFrom: new Date(validFrom),
      validTo: new Date(validTo),
      price: prices[passType],
      maxUsage: maxUsages[passType]
    });

    res.status(201).json({
      success: true,
      message: 'Bus pass created successfully',
      data: busPass
    });
  } catch (error) {
    console.error('Create bus pass error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating bus pass'
    });
  }
});

// @desc    Get user bus passes
// @route   GET /api/buspasses
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const busPasses = await BusPass.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: busPasses.length,
      data: busPasses
    });
  } catch (error) {
    console.error('Get bus passes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bus passes'
    });
  }
});

// @desc    Get single bus pass
// @route   GET /api/buspasses/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const busPass = await BusPass.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!busPass) {
      return res.status(404).json({
        success: false,
        message: 'Bus pass not found'
      });
    }

    res.status(200).json({
      success: true,
      data: busPass
    });
  } catch (error) {
    console.error('Get bus pass error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bus pass'
    });
  }
});

// @desc    Use bus pass
// @route   POST /api/buspasses/:id/use
// @access  Private
router.post('/:id/use', protect, async (req, res) => {
  try {
    const busPass = await BusPass.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!busPass) {
      return res.status(404).json({
        success: false,
        message: 'Bus pass not found'
      });
    }

    if (!busPass.canBeUsed()) {
      return res.status(400).json({
        success: false,
        message: 'Bus pass is not valid or has expired'
      });
    }

    await busPass.usePass();

    res.status(200).json({
      success: true,
      message: 'Bus pass used successfully',
      data: {
        usageCount: busPass.usageCount,
        remainingUsage: busPass.maxUsage === 0 ? 'Unlimited' : busPass.maxUsage - busPass.usageCount
      }
    });
  } catch (error) {
    console.error('Use bus pass error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while using bus pass'
    });
  }
});

// @desc    Validate bus pass
// @route   GET /api/buspasses/:id/validate
// @access  Private
router.get('/:id/validate', protect, async (req, res) => {
  try {
    const busPass = await BusPass.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!busPass) {
      return res.status(404).json({
        success: false,
        message: 'Bus pass not found'
      });
    }

    const isValid = busPass.isValid();

    res.status(200).json({
      success: true,
      data: {
        isValid,
        passType: busPass.passType,
        city: busPass.city,
        validFrom: busPass.validFrom,
        validTo: busPass.validTo,
        usageCount: busPass.usageCount,
        maxUsage: busPass.maxUsage,
        status: busPass.status
      }
    });
  } catch (error) {
    console.error('Validate bus pass error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while validating bus pass'
    });
  }
});

// @desc    Get bus pass statistics
// @route   GET /api/buspasses/stats/overview
// @access  Private
router.get('/stats/overview', protect, async (req, res) => {
  try {
    const totalPasses = await BusPass.countDocuments({ user: req.user._id });
    const activePasses = await BusPass.countDocuments({ 
      user: req.user._id, 
      status: 'active' 
    });
    const expiredPasses = await BusPass.countDocuments({ 
      user: req.user._id, 
      status: 'expired' 
    });

    res.status(200).json({
      success: true,
      data: {
        totalPasses,
        activePasses,
        expiredPasses
      }
    });
  } catch (error) {
    console.error('Get bus pass stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bus pass statistics'
    });
  }
});

module.exports = router;
