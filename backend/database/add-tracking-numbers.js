// Script to add tracking numbers to existing buses
const mongoose = require('mongoose');
require('dotenv').config();

// Import Bus model
const Bus = require('../models/Bus');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-bus-db');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

// Add tracking numbers to existing buses
const addTrackingNumbers = async () => {
  try {
    console.log('\n🔢 Adding tracking numbers to existing buses...');
    
    // Get all buses without tracking numbers
    const buses = await Bus.find({ trackingNumber: { $exists: false } });
    
    if (buses.length === 0) {
      console.log('✅ All buses already have tracking numbers');
      return;
    }
    
    console.log(`Found ${buses.length} buses without tracking numbers`);
    
    for (const bus of buses) {
      // Generate tracking number
      const cityCode = bus.city.substring(0, 2).toUpperCase();
      const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      const trackingNumber = `${cityCode}${randomNum}`;
      
      // Update bus with tracking number
      bus.trackingNumber = trackingNumber;
      await bus.save();
      
      console.log(`✅ Added tracking number ${trackingNumber} to ${bus.busName}`);
    }
    
    console.log(`🎉 Successfully added tracking numbers to ${buses.length} buses`);
  } catch (error) {
    console.error('❌ Error adding tracking numbers:', error.message);
  }
};

// Add sample route stops to buses without them
const addRouteStops = async () => {
  try {
    console.log('\n🚏 Adding route stops to buses...');
    
    const buses = await Bus.find({ routeStops: { $exists: false } });
    
    if (buses.length === 0) {
      console.log('✅ All buses already have route stops');
      return;
    }
    
    console.log(`Found ${buses.length} buses without route stops`);
    
    for (const bus of buses) {
      // Create basic route stops
      const routeStops = [
        { 
          busStand: bus.from, 
          estimatedArrival: bus.departureTime, 
          actualArrival: bus.departureTime, 
          status: 'departed' 
        },
        { 
          busStand: bus.to, 
          estimatedArrival: bus.arrivalTime, 
          actualArrival: null, 
          status: 'pending' 
        }
      ];
      
      bus.routeStops = routeStops;
      bus.currentStatus = 'not_started';
      bus.delayMinutes = 0;
      
      await bus.save();
      
      console.log(`✅ Added route stops to ${bus.busName}`);
    }
    
    console.log(`🎉 Successfully added route stops to ${buses.length} buses`);
  } catch (error) {
    console.error('❌ Error adding route stops:', error.message);
  }
};

// Main function
const main = async () => {
  try {
    await connectDB();
    await addTrackingNumbers();
    await addRouteStops();
    
    console.log('\n🎉 All updates completed successfully!');
  } catch (error) {
    console.error('❌ Script failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  }
};

// Run if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = {
  addTrackingNumbers,
  addRouteStops
};
