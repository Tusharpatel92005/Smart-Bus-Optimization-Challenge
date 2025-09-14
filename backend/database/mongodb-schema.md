# Smart Bus Management System - MongoDB Database Schema

This document defines the MongoDB collections and their schemas based on the frontend requirements.

## 📋 Collections Overview

### 1. **users** Collection
```javascript
{
  _id: ObjectId,
  name: String,           // Full name (required)
  email: String,          // Email address (unique, required)
  phone: String,          // 10-digit phone number (required)
  password: String,       // Hashed password (required)
  role: String,           // "user" or "admin" (default: "user")
  isActive: Boolean,      // Account status (default: true)
  lastLogin: Date,        // Last login timestamp
  createdAt: Date,        // Account creation date
  updatedAt: Date         // Last update timestamp
}
```

### 2. **buses** Collection
```javascript
{
  _id: ObjectId,
  busName: String,        // Bus name (required)
  busNumber: String,      // Unique bus number (required)
  city: String,           // City name (required)
  from: String,           // Starting location (required)
  to: String,             // Destination location (required)
  departureTime: String,  // Time in HH:MM format (required)
  arrivalTime: String,    // Time in HH:MM format (required)
  totalSeats: Number,     // Total seats (1-100, required)
  availableSeats: Number, // Available seats (required)
  bookedSeats: [Number],  // Array of booked seat numbers
  fare: Number,           // Fare amount (required)
  busType: String,        // "AC", "Non-AC", "Sleeper", "Semi-Sleeper"
  amenities: [String],    // Array of amenities
  isActive: Boolean,      // Bus status (default: true)
  createdAt: Date,        // Creation timestamp
  updatedAt: Date         // Last update timestamp
}
```

### 3. **bookings** Collection
```javascript
{
  _id: ObjectId,
  pnr: String,            // 10-character PNR (unique, required)
  user: ObjectId,         // Reference to users collection
  bus: ObjectId,          // Reference to buses collection
  busName: String,        // Bus name (required)
  city: String,           // City name (required)
  from: String,           // Starting location (required)
  to: String,             // Destination location (required)
  travelDate: Date,       // Travel date (required)
  seatNumber: Number,     // Seat number (required)
  passengerDetails: {     // Passenger information
    name: String,         // Passenger name (required)
    email: String,        // Passenger email (required)
    phone: String         // Passenger phone (required)
  },
  fare: Number,           // Fare amount (required)
  status: String,         // "confirmed", "cancelled", "completed"
  paymentStatus: String,  // "pending", "paid", "refunded"
  paymentMethod: String,  // "cash", "card", "upi", "netbanking"
  bookingTime: Date,      // Booking timestamp
  cancellationTime: Date, // Cancellation timestamp
  refundAmount: Number,   // Refund amount
  createdAt: Date,        // Creation timestamp
  updatedAt: Date         // Last update timestamp
}
```

### 4. **buspasses** Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId,         // Reference to users collection
  passType: String,       // "daily", "weekly", "monthly", "yearly"
  city: String,           // City name (required)
  validFrom: Date,        // Pass validity start date
  validTo: Date,          // Pass validity end date
  price: Number,          // Pass price (required)
  status: String,         // "active", "expired", "cancelled"
  usageCount: Number,     // Number of times used (default: 0)
  maxUsage: Number,       // Maximum usage allowed (0 = unlimited)
  qrCode: String,         // Unique QR code
  isActive: Boolean,      // Pass status (default: true)
  createdAt: Date,        // Creation timestamp
  updatedAt: Date         // Last update timestamp
}
```

### 5. **cities** Collection (Reference Data)
```javascript
{
  _id: ObjectId,
  cityName: String,       // City name (unique, required)
  isActive: Boolean,      // City status (default: true)
  createdAt: Date         // Creation timestamp
}
```

### 6. **locations** Collection (Reference Data)
```javascript
{
  _id: ObjectId,
  city: ObjectId,         // Reference to cities collection
  locationName: String,   // Location name (required)
  isActive: Boolean,      // Location status (default: true)
  createdAt: Date         // Creation timestamp
}
```

### 7. **payment_transactions** Collection
```javascript
{
  _id: ObjectId,
  booking: ObjectId,      // Reference to bookings collection
  user: ObjectId,         // Reference to users collection
  amount: Number,         // Transaction amount
  paymentMethod: String,  // "cash", "card", "upi", "netbanking"
  paymentStatus: String,  // "pending", "completed", "failed", "refunded"
  transactionId: String,  // Unique transaction ID
  paymentGateway: String, // Payment gateway used
  paymentDate: Date,      // Payment completion date
  refundDate: Date,       // Refund date
  refundAmount: Number,   // Refund amount
  createdAt: Date,        // Creation timestamp
  updatedAt: Date         // Last update timestamp
}
```

### 8. **notifications** Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId,         // Reference to users collection
  title: String,          // Notification title
  message: String,        // Notification message
  type: String,           // "booking", "cancellation", "payment", "bus_pass", "general"
  isRead: Boolean,        // Read status (default: false)
  relatedId: ObjectId,    // ID of related document
  createdAt: Date         // Creation timestamp
}
```

### 9. **system_settings** Collection
```javascript
{
  _id: ObjectId,
  settingKey: String,     // Setting key (unique, required)
  settingValue: String,   // Setting value (required)
  description: String,    // Setting description
  isActive: Boolean,      // Setting status (default: true)
  updatedAt: Date         // Last update timestamp
}
```

### 10. **audit_logs** Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId,         // Reference to users collection (optional)
  action: String,         // Action performed
  tableName: String,      // Collection name
  recordId: ObjectId,     // Document ID
  oldValues: Object,      // Previous values
  newValues: Object,      // New values
  ipAddress: String,      // IP address
  userAgent: String,      // User agent string
  createdAt: Date         // Creation timestamp
}
```

## 🔗 Relationships

### User Relationships
- **users** → **bookings** (One-to-Many)
- **users** → **buspasses** (One-to-Many)
- **users** → **payment_transactions** (One-to-Many)
- **users** → **notifications** (One-to-Many)

### Bus Relationships
- **buses** → **bookings** (One-to-Many)

### Booking Relationships
- **bookings** → **payment_transactions** (One-to-Many)

### City Relationships
- **cities** → **locations** (One-to-Many)
- **cities** → **buses** (One-to-Many)
- **cities** → **buspasses** (One-to-Many)

## 📊 Indexes

### Performance Indexes
```javascript
// Users collection
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "phone": 1 })
db.users.createIndex({ "role": 1 })
db.users.createIndex({ "isActive": 1 })

// Buses collection
db.buses.createIndex({ "busNumber": 1 }, { unique: true })
db.buses.createIndex({ "city": 1 })
db.buses.createIndex({ "from": 1, "to": 1 })
db.buses.createIndex({ "departureTime": 1 })
db.buses.createIndex({ "isActive": 1 })

// Bookings collection
db.bookings.createIndex({ "pnr": 1 }, { unique: true })
db.bookings.createIndex({ "user": 1 })
db.bookings.createIndex({ "bus": 1 })
db.bookings.createIndex({ "travelDate": 1 })
db.bookings.createIndex({ "status": 1 })
db.bookings.createIndex({ "bookingTime": 1 })

// Bus Passes collection
db.buspasses.createIndex({ "user": 1 })
db.buspasses.createIndex({ "passType": 1 })
db.buspasses.createIndex({ "city": 1 })
db.buspasses.createIndex({ "validFrom": 1, "validTo": 1 })
db.buspasses.createIndex({ "status": 1 })
db.buspasses.createIndex({ "qrCode": 1 }, { unique: true })

// Cities collection
db.cities.createIndex({ "cityName": 1 }, { unique: true })

// Locations collection
db.locations.createIndex({ "city": 1 })
db.locations.createIndex({ "city": 1, "locationName": 1 }, { unique: true })
```

## 🎯 Frontend Data Mapping

### Form Fields Used in Frontend:

#### User Registration/Login:
- `name` (Signup form)
- `email` (Login/Signup forms)
- `phone` (Signup form)
- `password` (Login/Signup forms)

#### Bus Search/Booking:
- `city` (Booking, Itineraries)
- `from` (Booking, Itineraries)
- `to` (Booking, Itineraries)
- `date` (Booking)
- `seatNumber` (BookSeat)
- `passengerDetails.name` (BookSeat)
- `passengerDetails.email` (BookSeat)
- `passengerDetails.phone` (BookSeat)

#### Bus Pass:
- `passType` (BusPass form)
- `city` (BusPass form)
- `validFrom` (BusPass form)
- `validTo` (BusPass form)

#### Ticket Tracking:
- `pnr` (ViewTicket, TrackTicket)
- `ticketNumber` (ViewTicket)
- `ticketId` (TrackTicket)

## 🔧 Sample Data

### Default Cities and Locations:
```javascript
// Cities
{ cityName: "Delhi" }
{ cityName: "Mumbai" }
{ cityName: "Bangalore" }
{ cityName: "Chennai" }
{ cityName: "Pune" }
{ cityName: "Hyderabad" }
{ cityName: "Kolkata" }

// Locations for Delhi
{ city: ObjectId("..."), locationName: "Connaught Place" }
{ city: ObjectId("..."), locationName: "Karol Bagh" }
{ city: ObjectId("..."), locationName: "Dwarka" }
{ city: ObjectId("..."), locationName: "Rohini" }
```

### System Settings:
```javascript
{ settingKey: "bus_pass_daily_price", settingValue: "50" }
{ settingKey: "bus_pass_weekly_price", settingValue: "300" }
{ settingKey: "bus_pass_monthly_price", settingValue: "1000" }
{ settingKey: "bus_pass_yearly_price", settingValue: "10000" }
{ settingKey: "cancellation_refund_percentage", settingValue: "70" }
{ settingKey: "cancellation_hours_limit", settingValue: "24" }
```

This schema ensures all frontend data requirements are met with proper relationships, indexes, and validation rules.
