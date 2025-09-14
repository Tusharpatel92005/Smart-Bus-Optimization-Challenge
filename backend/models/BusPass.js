const mongoose = require('mongoose');

const busPassSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  passType: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: [true, 'Pass type is required']
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  validFrom: {
    type: Date,
    required: [true, 'Valid from date is required']
  },
  validTo: {
    type: Date,
    required: [true, 'Valid to date is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active'
  },
  usageCount: {
    type: Number,
    default: 0
  },
  maxUsage: {
    type: Number,
    default: 0 // 0 means unlimited
  },
  qrCode: {
    type: String,
    unique: true
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

// Generate QR code before saving
busPassSchema.pre('save', function(next) {
  if (this.isNew && !this.qrCode) {
    const randomString = Math.random().toString(36).substring(2, 15) + 
                        Math.random().toString(36).substring(2, 15);
    this.qrCode = `PASS_${randomString.toUpperCase()}`;
  }
  next();
});

// Update updatedAt field
busPassSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Check if pass is valid
busPassSchema.methods.isValid = function() {
  const now = new Date();
  return this.status === 'active' && 
         this.validFrom <= now && 
         this.validTo >= now &&
         (this.maxUsage === 0 || this.usageCount < this.maxUsage);
};

// Use pass (increment usage count)
busPassSchema.methods.usePass = function() {
  if (this.isValid()) {
    this.usageCount += 1;
    return this.save();
  }
  throw new Error('Pass is not valid or has expired');
};

// Check if pass can be used
busPassSchema.methods.canBeUsed = function() {
  return this.isValid() && this.isActive;
};

module.exports = mongoose.model('BusPass', busPassSchema);
