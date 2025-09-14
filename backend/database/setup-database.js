// Database Setup Script for Smart Bus Management System
// This script creates all collections, indexes, and sample data

const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Bus = require('../models/Bus');
const Booking = require('../models/Booking');
const BusPass = require('../models/BusPass');

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

// Create indexes for all collections
const createIndexes = async () => {
  try {
    console.log('\n🔧 Creating database indexes...');

    // Users collection indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ phone: 1 });
    await User.collection.createIndex({ role: 1 });
    await User.collection.createIndex({ isActive: 1 });
    console.log('✅ Users indexes created');

    // Buses collection indexes
    await Bus.collection.createIndex({ busNumber: 1 }, { unique: true });
    await Bus.collection.createIndex({ city: 1 });
    await Bus.collection.createIndex({ from: 1, to: 1 });
    await Bus.collection.createIndex({ departureTime: 1 });
    await Bus.collection.createIndex({ isActive: 1 });
    console.log('✅ Buses indexes created');

    // Bookings collection indexes
    await Booking.collection.createIndex({ pnr: 1 }, { unique: true });
    await Booking.collection.createIndex({ user: 1 });
    await Booking.collection.createIndex({ bus: 1 });
    await Booking.collection.createIndex({ travelDate: 1 });
    await Booking.collection.createIndex({ status: 1 });
    await Booking.collection.createIndex({ bookingTime: 1 });
    console.log('✅ Bookings indexes created');

    // Bus Passes collection indexes
    await BusPass.collection.createIndex({ user: 1 });
    await BusPass.collection.createIndex({ passType: 1 });
    await BusPass.collection.createIndex({ city: 1 });
    await BusPass.collection.createIndex({ validFrom: 1, validTo: 1 });
    await BusPass.collection.createIndex({ status: 1 });
    await BusPass.collection.createIndex({ qrCode: 1 }, { unique: true });
    console.log('✅ Bus Passes indexes created');

    console.log('🎉 All indexes created successfully!');
  } catch (error) {
    console.error('❌ Error creating indexes:', error.message);
  }
};

// Create sample buses data
const createSampleBuses = async () => {
  try {
    console.log('\n🚌 Creating sample buses...');
    
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
        currentLocation: {
          busStand: 'Connaught Place',
          latitude: 28.6315,
          longitude: 77.2167,
          lastUpdated: new Date()
        },
        routeStops: [
          { busStand: 'Connaught Place', estimatedArrival: '08:00', actualArrival: '08:00', status: 'departed' },
          { busStand: 'Rajiv Chowk', estimatedArrival: '08:15', actualArrival: '08:15', status: 'departed' },
          { busStand: 'Karol Bagh', estimatedArrival: '08:45', actualArrival: null, status: 'pending' }
        ],
        currentStatus: 'running',
        delayMinutes: 0
      },
      {
        busName: 'Delhi Local Bus 2',
        busNumber: 'DL002',
        city: 'Delhi',
        from: 'Karol Bagh',
        to: 'Dwarka',
        departureTime: '10:30',
        arrivalTime: '11:30',
        totalSeats: 30,
        availableSeats: 30,
        bookedSeats: [],
        fare: 30,
        busType: 'AC',
        amenities: ['WiFi', 'Charging Point', 'Water Bottle'],
        currentLocation: {
          busStand: 'Karol Bagh',
          latitude: 28.6517,
          longitude: 77.1909,
          lastUpdated: new Date()
        },
        routeStops: [
          { busStand: 'Karol Bagh', estimatedArrival: '10:30', actualArrival: '10:30', status: 'departed' },
          { busStand: 'Rajouri Garden', estimatedArrival: '10:50', actualArrival: '10:52', status: 'departed' },
          { busStand: 'Dwarka', estimatedArrival: '11:30', actualArrival: null, status: 'pending' }
        ],
        currentStatus: 'delayed',
        delayMinutes: 5
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
        currentLocation: {
          busStand: 'Andheri',
          latitude: 19.1136,
          longitude: 72.8697,
          lastUpdated: new Date()
        },
        routeStops: [
          { busStand: 'Andheri', estimatedArrival: '09:00', actualArrival: '09:00', status: 'departed' },
          { busStand: 'Vile Parle', estimatedArrival: '09:20', actualArrival: '09:18', status: 'departed' },
          { busStand: 'Bandra', estimatedArrival: '09:45', actualArrival: null, status: 'pending' }
        ],
        currentStatus: 'running',
        delayMinutes: 0
      },
      {
        busName: 'Mumbai Local Bus 2',
        busNumber: 'MB002',
        city: 'Mumbai',
        from: 'Dadar',
        to: 'Colaba',
        departureTime: '14:00',
        arrivalTime: '15:00',
        totalSeats: 30,
        availableSeats: 30,
        bookedSeats: [],
        fare: 25,
        busType: 'AC',
        amenities: ['WiFi', 'Charging Point', 'Water Bottle']
      },
      {
        busName: 'Bangalore Local Bus 1',
        busNumber: 'BL001',
        city: 'Bangalore',
        from: 'Majestic',
        to: 'Whitefield',
        departureTime: '07:30',
        arrivalTime: '08:30',
        totalSeats: 30,
        availableSeats: 30,
        bookedSeats: [],
        fare: 35,
        busType: 'AC',
        amenities: ['WiFi', 'Charging Point', 'Water Bottle', 'TV']
      },
      {
        busName: 'Bangalore Local Bus 2',
        busNumber: 'BL002',
        city: 'Bangalore',
        from: 'Koramangala',
        to: 'Indiranagar',
        departureTime: '16:00',
        arrivalTime: '16:45',
        totalSeats: 30,
        availableSeats: 30,
        bookedSeats: [],
        fare: 20,
        busType: 'Non-AC',
        amenities: ['Water Bottle']
      },
      {
        busName: 'Chennai Local Bus 1',
        busNumber: 'CH001',
        city: 'Chennai',
        from: 'T. Nagar',
        to: 'Anna Nagar',
        departureTime: '08:15',
        arrivalTime: '09:00',
        totalSeats: 30,
        availableSeats: 30,
        bookedSeats: [],
        fare: 22,
        busType: 'Non-AC',
        amenities: ['Water Bottle']
      },
      {
        busName: 'Chennai Local Bus 2',
        busNumber: 'CH002',
        city: 'Chennai',
        from: 'Adyar',
        to: 'Tambaram',
        departureTime: '12:30',
        arrivalTime: '13:30',
        totalSeats: 30,
        availableSeats: 30,
        bookedSeats: [],
        fare: 28,
        busType: 'AC',
        amenities: ['WiFi', 'Charging Point', 'Water Bottle']
      },
      {
        busName: 'Pune Local Bus 1',
        busNumber: 'PN001',
        city: 'Pune',
        from: 'Shivaji Nagar',
        to: 'Kothrud',
        departureTime: '09:30',
        arrivalTime: '10:15',
        totalSeats: 30,
        availableSeats: 30,
        bookedSeats: [],
        fare: 18,
        busType: 'Non-AC',
        amenities: ['Water Bottle']
      },
      {
        busName: 'Pune Local Bus 2',
        busNumber: 'PN002',
        city: 'Pune',
        from: 'Hadapsar',
        to: 'Aundh',
        departureTime: '15:00',
        arrivalTime: '16:00',
        totalSeats: 30,
        availableSeats: 30,
        bookedSeats: [],
        fare: 25,
        busType: 'AC',
        amenities: ['WiFi', 'Charging Point', 'Water Bottle']
      }
    ];

    // Clear existing buses
    await Bus.deleteMany({});
    
    // Insert sample buses
    await Bus.insertMany(sampleBuses);
    console.log(`✅ Created ${sampleBuses.length} sample buses`);
  } catch (error) {
    console.error('❌ Error creating sample buses:', error.message);
  }
};

// Create sample bookings data
const createSampleBookings = async () => {
  try {
    console.log('\n📋 Creating sample bookings...');
    
    const Bus = require('../models/Bus');
    const User = require('../models/User');
    const Booking = require('../models/Booking');
    
    // Get a sample bus and user
    const sampleBus = await Bus.findOne();
    const sampleUser = await User.findOne();
    
    if (!sampleBus || !sampleUser) {
      console.log('⚠️ No sample bus or user found, skipping bookings');
      return;
    }
    
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
    
    const bookings = await Booking.insertMany(sampleBookings);
    console.log(`✅ Created ${bookings.length} sample bookings`);
    console.log(`📋 Sample PNR Numbers: PNR123456, PNR789012`);
  } catch (error) {
    console.error('❌ Error creating bookings:', error.message);
  }
};

// Create admin user
const createAdminUser = async () => {
  try {
    console.log('\n👤 Creating admin user...');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@smartbus.com' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@smartbus.com',
      phone: '9999999999',
      password: 'admin123',
      role: 'admin'
    });

    console.log('✅ Admin user created successfully');
    console.log('   Email: admin@smartbus.com');
    console.log('   Password: admin123');
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
};

// Create system settings
const createSystemSettings = async () => {
  try {
    console.log('\n⚙️ Creating system settings...');
    
    const settings = [
      { settingKey: 'bus_pass_daily_price', settingValue: '50', description: 'Daily bus pass price' },
      { settingKey: 'bus_pass_weekly_price', settingValue: '300', description: 'Weekly bus pass price' },
      { settingKey: 'bus_pass_monthly_price', settingValue: '1000', description: 'Monthly bus pass price' },
      { settingKey: 'bus_pass_yearly_price', settingValue: '10000', description: 'Yearly bus pass price' },
      { settingKey: 'cancellation_refund_percentage', settingValue: '70', description: 'Percentage of fare refunded on cancellation' },
      { settingKey: 'cancellation_hours_limit', settingValue: '24', description: 'Hours before travel when cancellation is allowed' },
      { settingKey: 'max_seats_per_bus', settingValue: '100', description: 'Maximum seats allowed per bus' },
      { settingKey: 'default_bus_type', settingValue: 'Non-AC', description: 'Default bus type for new buses' }
    ];

    // Create a simple settings collection if it doesn't exist
    const db = mongoose.connection.db;
    const settingsCollection = db.collection('system_settings');
    
    // Clear existing settings
    await settingsCollection.deleteMany({});
    
    // Insert settings
    await settingsCollection.insertMany(settings);
    console.log(`✅ Created ${settings.length} system settings`);
  } catch (error) {
    console.error('❌ Error creating system settings:', error.message);
  }
};

// Main setup function
const setupDatabase = async () => {
  try {
    await connectDB();
    await createIndexes();
    await createSampleBuses();
    await createAdminUser();
    await createSampleBookings();
    await createSystemSettings();
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Database connected');
    console.log('   ✅ Indexes created');
    console.log('   ✅ Sample buses added');
    console.log('   ✅ Admin user created');
    console.log('   ✅ Sample bookings added');
    console.log('   ✅ System settings configured');
    
    console.log('\n🚀 Your Smart Bus Management System is ready!');
    console.log('   Backend API: http://localhost:5000');
    console.log('   Frontend: http://localhost:3000');
    console.log('   Admin Login: admin@smartbus.com / admin123');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  }
};

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = {
  setupDatabase,
  createIndexes,
  createSampleBuses,
  createAdminUser,
  createSystemSettings
};
