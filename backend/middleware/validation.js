const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User registration validation
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('phone')
    .isMobilePhone('en-IN')
    .withMessage('Please provide a valid Indian phone number'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  handleValidationErrors
];

// User login validation
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Booking validation
const validateBooking = [
  body('busId')
    .isMongoId()
    .withMessage('Please provide a valid bus ID'),
  
  body('seatNumber')
    .isInt({ min: 1, max: 100 })
    .withMessage('Seat number must be between 1 and 100'),
  
  body('travelDate')
    .isISO8601()
    .withMessage('Please provide a valid travel date'),
  
  body('passengerDetails.name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Passenger name must be between 2 and 50 characters'),
  
  body('passengerDetails.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid passenger email'),
  
  body('passengerDetails.phone')
    .isMobilePhone('en-IN')
    .withMessage('Please provide a valid passenger phone number'),
  
  handleValidationErrors
];

// Bus pass validation
const validateBusPass = [
  body('passType')
    .isIn(['daily', 'weekly', 'monthly', 'yearly'])
    .withMessage('Pass type must be daily, weekly, monthly, or yearly'),
  
  body('city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  
  body('validFrom')
    .isISO8601()
    .withMessage('Please provide a valid start date'),
  
  body('validTo')
    .isISO8601()
    .withMessage('Please provide a valid end date'),
  
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateBooking,
  validateBusPass
};
