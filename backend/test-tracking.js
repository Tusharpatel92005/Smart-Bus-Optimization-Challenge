// Test script to verify tracking functionality
const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Bus = require('./models/Bus');
const Booking = require('./models/Booking');
const User = require('./models/User');

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

// Test PNR tracking
const testPnrTracking = async () => {
  try {
    console.log('\n📋 Testing PNR Tracking...');
    
    const bookings = await Booking.find({}).populate('bus user');
    console.log(`Found ${bookings.length} bookings in database`);
    
    if (bookings.length > 0) {
      const booking = bookings[0];
      console.log(`✅ Sample PNR: ${booking.pnr}`);
      console.log(`   Passenger: ${booking.passengerDetails.name}`);
      console.log(`   Bus: ${booking.bus.busName}`);
      console.log(`   Route: ${booking.bus.from} → ${booking.bus.to}`);
    } else {
      console.log('❌ No bookings found in database');
    }
  } catch (error) {
    console.error('❌ PNR tracking test failed:', error.message);
  }
};

// Test bus tracking
const testBusTracking = async () => {
  try {
    console.log('\n🚌 Testing Bus Tracking...');
    
    const buses = await Bus.find({});
    console.log(`Found ${buses.length} buses in database`);
    
    if (buses.length > 0) {
      const bus = buses[0];
      console.log(`✅ Sample Bus: ${bus.busName}`);
      console.log(`   Bus Number: ${bus.busNumber}`);
      console.log(`   Tracking Number: ${bus.trackingNumber || 'NOT SET'}`);
      console.log(`   City: ${bus.city}`);
      console.log(`   Route: ${bus.from} → ${bus.to}`);
      console.log(`   Status: ${bus.currentStatus || 'NOT SET'}`);
      
      if (!bus.trackingNumber) {
        console.log('⚠️ Bus does not have tracking number - this will cause tracking to fail');
      }
    } else {
      console.log('❌ No buses found in database');
    }
  } catch (error) {
    console.error('❌ Bus tracking test failed:', error.message);
  }
};

// Add tracking numbers to buses that don't have them
const addTrackingNumbers = async () => {
  try {
    console.log('\n🔢 Adding tracking numbers to buses...');
    
    const buses = await Bus.find({ trackingNumber: { $exists: false } });
    console.log(`Found ${buses.length} buses without tracking numbers`);
    
    for (const bus of buses) {
      const cityCode = bus.city.substring(0, 2).toUpperCase();
      const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      const trackingNumber = `${cityCode}${randomNum}`;
      
      bus.trackingNumber = trackingNumber;
      bus.currentStatus = 'running';
      bus.delayMinutes = 0;
      
      // Add basic route stops if not present
      if (!bus.routeStops || bus.routeStops.length === 0) {
        bus.routeStops = [
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
      }
      
      // Add current location if not present
      if (!bus.currentLocation) {
        bus.currentLocation = {
          busStand: bus.from,
          latitude: 28.6139, // Delhi coordinates as default
          longitude: 77.2090,
          lastUpdated: new Date()
        };
      }
      
      await bus.save();
      console.log(`✅ Added tracking number ${trackingNumber} to ${bus.busName}`);
    }
  } catch (error) {
    console.error('❌ Error adding tracking numbers:', error.message);
  }
};

// Main test function
const runTests = async () => {
  try {
    await connectDB();
    await testPnrTracking();
    await testBusTracking();
    await addTrackingNumbers();
    
    console.log('\n🎉 Testing completed!');
    console.log('\n📋 Sample data for testing:');
    
    // Show sample PNRs
    const bookings = await Booking.find({}).limit(2);
    if (bookings.length > 0) {
      console.log('   PNR Numbers:');
      bookings.forEach(booking => {
        console.log(`   - ${booking.pnr}`);
      });
    }
    
    // Show sample tracking numbers
    const buses = await Bus.find({ trackingNumber: { $exists: true } }).limit(3);
    if (buses.length > 0) {
      console.log('   Bus Tracking Numbers:');
      buses.forEach(bus => {
        console.log(`   - ${bus.trackingNumber} (${bus.busName})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  }
};

// Run if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  testPnrTracking,
  testBusTracking,
  addTrackingNumbers
};
