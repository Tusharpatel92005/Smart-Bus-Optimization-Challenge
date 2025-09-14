// Fix tracking system - ensure all data is properly set up
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

// Fix buses - add tracking numbers and location data
const fixBuses = async () => {
  try {
    console.log('\n🚌 Fixing buses...');
    
    const buses = await Bus.find({});
    console.log(`Found ${buses.length} buses`);
    
    for (const bus of buses) {
      let needsUpdate = false;
      
      // Add tracking number if missing
      if (!bus.trackingNumber) {
        const cityCode = bus.city.substring(0, 2).toUpperCase();
        const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        bus.trackingNumber = `${cityCode}${randomNum}`;
        needsUpdate = true;
        console.log(`✅ Added tracking number ${bus.trackingNumber} to ${bus.busName}`);
      }
      
      // Add current status if missing
      if (!bus.currentStatus) {
        bus.currentStatus = 'running';
        needsUpdate = true;
      }
      
      // Add delay minutes if missing
      if (bus.delayMinutes === undefined) {
        bus.delayMinutes = 0;
        needsUpdate = true;
      }
      
      // Add route stops if missing
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
        needsUpdate = true;
      }
      
      // Add current location if missing
      if (!bus.currentLocation) {
        bus.currentLocation = {
          busStand: bus.from,
          latitude: 28.6139, // Default coordinates
          longitude: 77.2090,
          lastUpdated: new Date()
        };
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        await bus.save();
      }
    }
    
    console.log('✅ All buses fixed');
  } catch (error) {
    console.error('❌ Error fixing buses:', error.message);
  }
};

// Fix bookings - ensure they have proper structure
const fixBookings = async () => {
  try {
    console.log('\n📋 Fixing bookings...');
    
    const bookings = await Booking.find({});
    console.log(`Found ${bookings.length} bookings`);
    
    for (const booking of bookings) {
      let needsUpdate = false;
      
      // Ensure PNR exists
      if (!booking.pnr) {
        booking.pnr = `PNR${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
        needsUpdate = true;
        console.log(`✅ Added PNR ${booking.pnr} to booking`);
      }
      
      // Ensure passenger details exist
      if (!booking.passengerDetails) {
        booking.passengerDetails = {
          name: 'Sample Passenger',
          email: 'passenger@example.com',
          phone: '9876543210',
          seatNumber: 1
        };
        needsUpdate = true;
      }
      
      // Ensure status exists
      if (!booking.status) {
        booking.status = 'confirmed';
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        await booking.save();
      }
    }
    
    console.log('✅ All bookings fixed');
  } catch (error) {
    console.error('❌ Error fixing bookings:', error.message);
  }
};

// Create sample data if none exists
const createSampleData = async () => {
  try {
    console.log('\n📊 Creating sample data...');
    
    // Check if we have any buses
    const busCount = await Bus.countDocuments();
    if (busCount === 0) {
      console.log('Creating sample buses...');
      
      const sampleBuses = [
        {
          busName: 'Delhi Local Bus 1',
          busNumber: 'DL001',
          city: 'Delhi',
          from: 'Connaught Place',
          to: 'Karol Bagh',
          departureTime: '08:00',
          arrivalTime: '08:45',
          totalSeats: 30,
          availableSeats: 30,
          bookedSeats: [],
          fare: 25,
          busType: 'Non-AC',
          amenities: ['Water Bottle'],
          trackingNumber: 'DL1234',
          currentStatus: 'running',
          delayMinutes: 0,
          routeStops: [
            { busStand: 'Connaught Place', estimatedArrival: '08:00', actualArrival: '08:00', status: 'departed' },
            { busStand: 'Rajiv Chowk', estimatedArrival: '08:15', actualArrival: '08:15', status: 'departed' },
            { busStand: 'Karol Bagh', estimatedArrival: '08:45', actualArrival: null, status: 'pending' }
          ],
          currentLocation: {
            busStand: 'Rajiv Chowk',
            latitude: 28.6315,
            longitude: 77.2167,
            lastUpdated: new Date()
          }
        },
        {
          busName: 'Mumbai Local Bus 1',
          busNumber: 'MB001',
          city: 'Mumbai',
          from: 'Andheri',
          to: 'Bandra',
          departureTime: '09:00',
          arrivalTime: '09:45',
          totalSeats: 30,
          availableSeats: 30,
          bookedSeats: [],
          fare: 20,
          busType: 'Non-AC',
          amenities: ['Water Bottle'],
          trackingNumber: 'MB5678',
          currentStatus: 'running',
          delayMinutes: 0,
          routeStops: [
            { busStand: 'Andheri', estimatedArrival: '09:00', actualArrival: '09:00', status: 'departed' },
            { busStand: 'Vile Parle', estimatedArrival: '09:20', actualArrival: '09:18', status: 'departed' },
            { busStand: 'Bandra', estimatedArrival: '09:45', actualArrival: null, status: 'pending' }
          ],
          currentLocation: {
            busStand: 'Vile Parle',
            latitude: 19.1136,
            longitude: 72.8697,
            lastUpdated: new Date()
          }
        }
      ];
      
      await Bus.insertMany(sampleBuses);
      console.log('✅ Created sample buses');
    }
    
    // Check if we have any users
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Creating sample user...');
      
      const sampleUser = new User({
        name: 'Test User',
        email: 'test@example.com',
        phone: '9876543210',
        password: 'password123',
        role: 'user'
      });
      
      await sampleUser.save();
      console.log('✅ Created sample user');
    }
    
    // Check if we have any bookings
    const bookingCount = await Booking.countDocuments();
    if (bookingCount === 0) {
      console.log('Creating sample bookings...');
      
      const sampleBus = await Bus.findOne();
      const sampleUser = await User.findOne();
      
      if (sampleBus && sampleUser) {
        const sampleBookings = [
          {
            pnr: 'PNR123456',
            user: sampleUser._id,
            bus: sampleBus._id,
            passengerDetails: {
              name: 'John Doe',
              email: 'john@example.com',
              phone: '9876543210',
              seatNumber: 5
            },
            journeyDate: new Date(),
            fare: sampleBus.fare,
            status: 'confirmed'
          },
          {
            pnr: 'PNR789012',
            user: sampleUser._id,
            bus: sampleBus._id,
            passengerDetails: {
              name: 'Jane Smith',
              email: 'jane@example.com',
              phone: '9876543211',
              seatNumber: 12
            },
            journeyDate: new Date(),
            fare: sampleBus.fare,
            status: 'confirmed'
          }
        ];
        
        await Booking.insertMany(sampleBookings);
        console.log('✅ Created sample bookings');
      }
    }
    
  } catch (error) {
    console.error('❌ Error creating sample data:', error.message);
  }
};

// Main fix function
const fixTrackingSystem = async () => {
  try {
    await connectDB();
    await createSampleData();
    await fixBuses();
    await fixBookings();
    
    console.log('\n🎉 Tracking system fixed successfully!');
    console.log('\n📋 Test data available:');
    
    // Show sample PNRs
    const bookings = await Booking.find({}).limit(2);
    if (bookings.length > 0) {
      console.log('   PNR Numbers:');
      bookings.forEach(booking => {
        console.log(`   - ${booking.pnr}`);
      });
    }
    
    // Show sample tracking numbers
    const buses = await Bus.find({}).limit(3);
    if (buses.length > 0) {
      console.log('   Bus Tracking Numbers:');
      buses.forEach(bus => {
        console.log(`   - ${bus.trackingNumber} (${bus.busName})`);
      });
    }
    
    console.log('\n🚀 You can now test the tracking system!');
    
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  }
};

// Run if this file is executed directly
if (require.main === module) {
  fixTrackingSystem();
}

module.exports = {
  fixTrackingSystem,
  fixBuses,
  fixBookings,
  createSampleData
};
