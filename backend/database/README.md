# Smart Bus Management System - Database Setup

This directory contains all database-related files for the Smart Bus Management System.

## 📁 Files Overview

- `schema.sql` - SQL schema for relational databases (MySQL/PostgreSQL)
- `mongodb-schema.md` - MongoDB collections and field definitions
- `setup-database.js` - Automated database setup script
- `frontend-database-mapping.md` - Complete mapping of frontend fields to database columns
- `README.md` - This file

## 🚀 Quick Setup

### Prerequisites
- MongoDB installed and running
- Node.js and npm installed
- Backend dependencies installed (`npm install`)

### Automated Setup
```bash
# Navigate to backend directory
cd Smart-Bus/backend

# Run the database setup script
npm run setup-db
```

This will:
- ✅ Connect to MongoDB
- ✅ Create all necessary indexes
- ✅ Insert sample bus data
- ✅ Create admin user
- ✅ Configure system settings

## 📊 Database Collections

### Core Collections
1. **users** - User accounts and authentication
2. **buses** - Bus information and routes
3. **bookings** - Bus ticket bookings
4. **buspasses** - Bus pass subscriptions

### Reference Collections
5. **cities** - Available cities
6. **locations** - Locations within cities
7. **system_settings** - Application configuration
8. **payment_transactions** - Payment records
9. **notifications** - User notifications
10. **audit_logs** - System audit trail

## 🔧 Manual Setup

If you prefer to set up the database manually:

### 1. Create Database
```bash
# Connect to MongoDB
mongo

# Create database
use smart-bus-db
```

### 2. Create Collections
The collections will be created automatically when you insert the first document.

### 3. Create Indexes
```javascript
// Users collection
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "phone": 1 })
db.users.createIndex({ "role": 1 })

// Buses collection
db.buses.createIndex({ "busNumber": 1 }, { unique: true })
db.buses.createIndex({ "city": 1 })
db.buses.createIndex({ "from": 1, "to": 1 })

// Bookings collection
db.bookings.createIndex({ "pnr": 1 }, { unique: true })
db.bookings.createIndex({ "user": 1 })
db.bookings.createIndex({ "bus": 1 })

// Bus Passes collection
db.buspasses.createIndex({ "user": 1 })
db.buspasses.createIndex({ "qrCode": 1 }, { unique: true })
```

### 4. Insert Sample Data
```javascript
// Insert sample buses
db.buses.insertMany([
  {
    busName: "Delhi Local Bus 1",
    busNumber: "DL001",
    city: "Delhi",
    from: "Connaught Place",
    to: "Karol Bagh",
    departureTime: "08:00",
    arrivalTime: "08:45",
    totalSeats: 30,
    availableSeats: 30,
    bookedSeats: [],
    fare: 25,
    busType: "Non-AC",
    amenities: ["Water Bottle"]
  }
  // ... more buses
])

// Create admin user
db.users.insertOne({
  name: "Admin User",
  email: "admin@smartbus.com",
  phone: "9999999999",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Kz8KzK",
  role: "admin"
})
```

## 📋 Frontend Field Mapping

All frontend form fields are mapped to database columns:

### User Registration
- `name` → `users.name`
- `email` → `users.email`
- `phone` → `users.phone`
- `password` → `users.password`

### Bus Booking
- `selectedCity` → `buses.city`
- `from` → `buses.from`
- `to` → `buses.to`
- `date` → `bookings.travelDate`
- `seatNumber` → `bookings.seatNumber`
- `passengerDetails` → `bookings.passengerDetails`

### Bus Pass
- `passType` → `buspasses.passType`
- `city` → `buspasses.city`
- `validFrom` → `buspasses.validFrom`
- `validTo` → `buspasses.validTo`

## 🔍 Data Validation

### Required Fields
- User: name, email, phone, password
- Bus: busName, busNumber, city, from, to, departureTime, arrivalTime, totalSeats, fare
- Booking: pnr, user, bus, travelDate, seatNumber, passengerDetails, fare
- Bus Pass: user, passType, city, validFrom, validTo, price

### Unique Constraints
- User email
- User phone
- Bus number
- Booking PNR
- Bus pass QR code

### Data Types
- Strings: names, emails, locations
- Numbers: seats, fares, prices
- Dates: travel dates, validity periods
- Arrays: booked seats, amenities
- Objects: passenger details

## 🎯 Sample Data

The setup script creates:

### Cities
- Delhi, Mumbai, Bangalore, Chennai, Pune, Hyderabad, Kolkata

### Bus Routes
- 10 sample buses across different cities
- Various routes within each city
- Different bus types (AC/Non-AC)
- Different amenities

### Admin User
- Email: admin@smartbus.com
- Password: admin123
- Role: admin

## 🔧 Configuration

### Environment Variables
```bash
MONGODB_URI=mongodb://localhost:27017/smart-bus-db
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

### System Settings
- Bus pass prices (daily: ₹50, weekly: ₹300, monthly: ₹1000, yearly: ₹10000)
- Cancellation refund percentage (70%)
- Cancellation time limit (24 hours)
- Maximum seats per bus (100)

## 🚨 Troubleshooting

### Common Issues

1. **Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env file
   - Verify database permissions

2. **Index Creation Failed**
   - Check for duplicate data
   - Ensure proper data types
   - Verify MongoDB version compatibility

3. **Sample Data Not Inserted**
   - Check for validation errors
   - Verify required fields
   - Check for duplicate constraints

### Reset Database
```bash
# Drop and recreate database
mongo smart-bus-db --eval "db.dropDatabase()"
npm run setup-db
```

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Frontend-Database Mapping](./frontend-database-mapping.md)
- [MongoDB Schema](./mongodb-schema.md)

## 🎉 Success!

Once setup is complete, you should see:
- ✅ Database connected
- ✅ Indexes created
- ✅ Sample buses added
- ✅ Admin user created
- ✅ System settings configured

Your Smart Bus Management System database is now ready for use!
