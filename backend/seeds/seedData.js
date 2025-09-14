const mongoose = require('mongoose');
const Bus = require('../models/Bus');
const User = require('../models/User');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-bus-db');
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

const seedBuses = async () => {
  const buses = [
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
      fare: 25,
      busType: 'Non-AC',
      amenities: ['Water Bottle'],
      bookedSeats: []
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
      fare: 30,
      busType: 'AC',
      amenities: ['WiFi', 'Charging Point', 'Water Bottle'],
      bookedSeats: []
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
      fare: 20,
      busType: 'Non-AC',
      amenities: ['Water Bottle'],
      bookedSeats: []
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
      fare: 25,
      busType: 'AC',
      amenities: ['WiFi', 'Charging Point', 'Water Bottle'],
      bookedSeats: []
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
      fare: 35,
      busType: 'AC',
      amenities: ['WiFi', 'Charging Point', 'Water Bottle', 'TV'],
      bookedSeats: []
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
      fare: 20,
      busType: 'Non-AC',
      amenities: ['Water Bottle'],
      bookedSeats: []
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
      fare: 22,
      busType: 'Non-AC',
      amenities: ['Water Bottle'],
      bookedSeats: []
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
      fare: 28,
      busType: 'AC',
      amenities: ['WiFi', 'Charging Point', 'Water Bottle'],
      bookedSeats: []
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
      fare: 18,
      busType: 'Non-AC',
      amenities: ['Water Bottle'],
      bookedSeats: []
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
      fare: 25,
      busType: 'AC',
      amenities: ['WiFi', 'Charging Point', 'Water Bottle'],
      bookedSeats: []
    }
  ];

  try {
    await Bus.deleteMany({});
    await Bus.insertMany(buses);
    console.log('✅ Buses seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding buses:', error);
  }
};

const seedAdminUser = async () => {
  try {
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
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
};

const runSeeder = async () => {
  await connectDB();
  await seedBuses();
  await seedAdminUser();
  console.log('🎉 Database seeding completed!');
  process.exit(0);
};

// Run seeder if this file is executed directly
if (require.main === module) {
  runSeeder();
}

module.exports = { seedBuses, seedAdminUser };
