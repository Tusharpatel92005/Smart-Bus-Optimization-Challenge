// Simple API test script to verify database operations
const mongoose = require('mongoose');
const User = require('./models/User');
const Bus = require('./models/Bus');
const Booking = require('./models/Booking');
const BusPass = require('./models/BusPass');

// Test database connection and operations
const testDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-bus-db');
    console.log('✅ Connected to MongoDB');

    // Test User operations
    console.log('\n🧪 Testing User operations...');
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      phone: '9876543210',
      password: 'test123'
    });
    console.log('✅ User created:', testUser.name);

    // Test Bus operations
    console.log('\n🧪 Testing Bus operations...');
    const testBus = await Bus.create({
      busName: 'Test Bus',
      busNumber: 'TB001',
      city: 'Test City',
      from: 'Point A',
      to: 'Point B',
      departureTime: '10:00',
      arrivalTime: '11:00',
      totalSeats: 30,
      availableSeats: 30,
      fare: 50,
      busType: 'AC',
      amenities: ['WiFi', 'Water Bottle']
    });
    console.log('✅ Bus created:', testBus.busName);

    // Test seat booking
    console.log('\n🧪 Testing seat booking...');
    await testBus.bookSeat(5);
    console.log('✅ Seat 5 booked');
    console.log('Available seats:', testBus.availableSeats);

    // Test Booking operations
    console.log('\n🧪 Testing Booking operations...');
    const testBooking = await Booking.create({
      user: testUser._id,
      bus: testBus._id,
      busName: testBus.busName,
      city: testBus.city,
      from: testBus.from,
      to: testBus.to,
      travelDate: new Date('2024-12-25'),
      seatNumber: 10,
      passengerDetails: {
        name: 'Test Passenger',
        email: 'passenger@example.com',
        phone: '9876543210'
      },
      fare: testBus.fare
    });
    console.log('✅ Booking created with PNR:', testBooking.pnr);

    // Test BusPass operations
    console.log('\n🧪 Testing BusPass operations...');
    const testPass = await BusPass.create({
      user: testUser._id,
      passType: 'daily',
      city: 'Test City',
      validFrom: new Date(),
      validTo: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      price: 50,
      maxUsage: 10
    });
    console.log('✅ Bus pass created with QR code:', testPass.qrCode);

    // Test pass validation
    const isValid = testPass.isValid();
    console.log('✅ Pass validation:', isValid ? 'Valid' : 'Invalid');

    // Test pass usage
    if (isValid) {
      await testPass.usePass();
      console.log('✅ Pass used successfully. Usage count:', testPass.usageCount);
    }

    // Clean up test data
    console.log('\n🧹 Cleaning up test data...');
    await User.findByIdAndDelete(testUser._id);
    await Bus.findByIdAndDelete(testBus._id);
    await Booking.findByIdAndDelete(testBooking._id);
    await BusPass.findByIdAndDelete(testPass._id);
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 All database operations working correctly!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  }
};

// Run the test
testDatabase();
