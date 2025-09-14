# Frontend to Database Field Mapping

This document maps all frontend form fields and data displays to their corresponding database columns.

## 📋 Complete Field Mapping

### 1. **User Authentication & Registration**

#### Signup Form (`Signup.js`)
| Frontend Field | Database Table | Column Name | Data Type | Validation |
|----------------|----------------|-------------|-----------|------------|
| `form.name` | users | name | String | Required, 2-50 chars |
| `form.email` | users | email | String | Required, unique, valid email |
| `form.phone` | users | phone | String | Required, 10 digits |
| `form.password` | users | password | String | Required, min 6 chars, hashed |
| `form.confirmPassword` | - | - | - | Frontend validation only |

#### Login Form (`Login.js`)
| Frontend Field | Database Table | Column Name | Data Type | Validation |
|----------------|----------------|-------------|-----------|------------|
| `form.email` | users | email | String | Required, valid email |
| `form.password` | users | password | String | Required, hashed comparison |

### 2. **Bus Search & Booking**

#### Booking Form (`Booking.js`)
| Frontend Field | Database Table | Column Name | Data Type | Validation |
|----------------|----------------|-------------|-----------|------------|
| `selectedCity` | buses | city | String | Required, from predefined list |
| `form.from` | buses | from | String | Required, from city locations |
| `form.to` | buses | to | String | Required, from city locations |
| `form.date` | bookings | travelDate | Date | Required, future date |

#### BookSeat Form (`BookSeat.js`)
| Frontend Field | Database Table | Column Name | Data Type | Validation |
|----------------|----------------|-------------|-----------|------------|
| `busName` | buses | busName | String | From booking selection |
| `selectedCity` | buses | city | String | From booking selection |
| `from` | buses | from | String | From booking selection |
| `to` | buses | to | String | From booking selection |
| `date` | bookings | travelDate | Date | From booking selection |
| `selectedSeat` | bookings | seatNumber | Number | Required, 1-100 |
| `customerDetails.name` | bookings | passengerDetails.name | String | Required, 2-50 chars |
| `customerDetails.email` | bookings | passengerDetails.email | String | Required, valid email |
| `customerDetails.phone` | bookings | passengerDetails.phone | String | Required, 10 digits |
| `pnrNumber` | bookings | pnr | String | Auto-generated, unique |

### 3. **Bus Pass Management**

#### BusPass Form (`BusPass.js`)
| Frontend Field | Database Table | Column Name | Data Type | Validation |
|----------------|----------------|-------------|-----------|------------|
| `formData.passType` | buspasses | passType | String | Required, enum: daily/weekly/monthly/yearly |
| `formData.city` | buspasses | city | String | Required, 2-50 chars |
| `formData.validFrom` | buspasses | validFrom | Date | Required, ISO date |
| `formData.validTo` | buspasses | validTo | Date | Auto-calculated based on passType |

#### BusPass Display Fields
| Frontend Display | Database Table | Column Name | Data Type | Description |
|------------------|----------------|-------------|-----------|-------------|
| `pass.passType` | buspasses | passType | String | Pass type (daily, weekly, etc.) |
| `pass.city` | buspasses | city | String | City name |
| `pass.validFrom` | buspasses | validFrom | Date | Validity start date |
| `pass.validTo` | buspasses | validTo | Date | Validity end date |
| `pass.price` | buspasses | price | Number | Pass price |
| `pass.usageCount` | buspasses | usageCount | Number | Times used |
| `pass.maxUsage` | buspasses | maxUsage | Number | Maximum allowed usage |
| `pass.qrCode` | buspasses | qrCode | String | Unique QR code |
| `pass.status` | buspasses | status | String | Pass status |

### 4. **Bus Information Display**

#### Itineraries Display (`Itineraries.js`)
| Frontend Display | Database Table | Column Name | Data Type | Description |
|------------------|----------------|-------------|-----------|-------------|
| `bus.busName` | buses | busName | String | Bus name |
| `bus.city` | buses | city | String | City name |
| `bus.from` | buses | from | String | Starting location |
| `bus.to` | buses | to | String | Destination location |
| `bus.departureTime` | buses | departureTime | String | Departure time (HH:MM) |
| `bus.arrivalTime` | buses | arrivalTime | String | Arrival time (HH:MM) |
| `bus.fare` | buses | fare | Number | Bus fare |
| `bus.busType` | buses | busType | String | AC/Non-AC/Sleeper |
| `bus.availableSeats` | buses | availableSeats | Number | Available seats count |

### 5. **Ticket Management**

#### ViewTicket Form (`ViewTicket.js`)
| Frontend Field | Database Table | Column Name | Data Type | Validation |
|----------------|----------------|-------------|-----------|------------|
| `ticketNumber` | bookings | pnr | String | Required, 10 characters |

#### TrackTicket Form (`TrackTicket.js`)
| Frontend Field | Database Table | Column Name | Data Type | Validation |
|----------------|----------------|-------------|-----------|------------|
| `ticketId` | bookings | pnr | String | Required, 10 characters |

#### Ticket Display Fields
| Frontend Display | Database Table | Column Name | Data Type | Description |
|------------------|----------------|-------------|-----------|-------------|
| `ticketInfo.ticketNumber` | bookings | pnr | String | PNR number |
| `ticketInfo.passengerName` | bookings | passengerDetails.name | String | Passenger name |
| `ticketInfo.journeyDate` | bookings | travelDate | Date | Travel date |
| `ticketInfo.from` | bookings | from | String | Starting location |
| `ticketInfo.to` | bookings | to | String | Destination location |
| `ticketInfo.status` | bookings | status | String | Booking status |

### 6. **City and Location Data**

#### City Selection (Multiple Components)
| Frontend Field | Database Table | Column Name | Data Type | Description |
|----------------|----------------|-------------|-----------|-------------|
| `selectedCity` | buses | city | String | Selected city name |
| `cityLocations[city]` | buses | from/to | String | Available locations in city |

#### Predefined City Locations
```javascript
// Frontend cityLocations object maps to database:
const cityLocations = {
  Delhi: ["Connaught Place", "Karol Bagh", "Dwarka", "Rohini"],
  Mumbai: ["Andheri", "Bandra", "Dadar", "Colaba"],
  Bangalore: ["Majestic", "Whitefield", "Koramangala", "Indiranagar"],
  Chennai: ["T. Nagar", "Anna Nagar", "Adyar", "Tambaram"],
  Pune: ["Shivaji Nagar", "Kothrud", "Hadapsar", "Aundh"],
  Hyderabad: ["Secunderabad", "Banjara Hills", "Hitec City", "Miyapur"],
  Kolkata: ["Salt Lake", "Esplanade", "Howrah", "Park Street"]
};
```

## 🔄 Data Flow Mapping

### 1. **User Registration Flow**
```
Frontend Form → API Call → Database Insert
Signup.js → authAPI.register() → users collection
```

### 2. **Bus Search Flow**
```
Frontend Selection → API Call → Database Query
Booking.js → busesAPI.getAllBuses() → buses collection
```

### 3. **Booking Creation Flow**
```
Frontend Form → API Call → Database Insert
BookSeat.js → bookingsAPI.createBooking() → bookings collection
```

### 4. **Bus Pass Creation Flow**
```
Frontend Form → API Call → Database Insert
BusPass.js → busPassesAPI.createBusPass() → buspasses collection
```

## 📊 Database Relationships

### User Relationships
- **users** → **bookings** (One-to-Many via `user` field)
- **users** → **buspasses** (One-to-Many via `user` field)

### Bus Relationships
- **buses** → **bookings** (One-to-Many via `bus` field)

### Booking Relationships
- **bookings** → **payment_transactions** (One-to-Many via `booking` field)

## 🎯 Validation Rules

### Frontend Validation
- Email format validation
- Phone number format (10 digits)
- Password strength requirements
- Required field validation
- Date range validation

### Database Validation
- Unique constraints (email, phone, pnr, qrCode)
- Enum constraints (role, status, passType, busType)
- Range constraints (seat numbers, fare amounts)
- Foreign key constraints
- Data type validation

## 🔧 API Endpoint Mapping

### Authentication Endpoints
- `POST /api/auth/register` → Insert into `users` collection
- `POST /api/auth/login` → Query `users` collection
- `GET /api/auth/me` → Query `users` collection

### Bus Endpoints
- `GET /api/buses` → Query `buses` collection
- `GET /api/buses/:id` → Query `buses` collection
- `GET /api/buses/:id/seats` → Query `buses` collection

### Booking Endpoints
- `POST /api/bookings` → Insert into `bookings` collection
- `GET /api/bookings` → Query `bookings` collection
- `GET /api/bookings/pnr/:pnr` → Query `bookings` collection

### Bus Pass Endpoints
- `POST /api/buspasses` → Insert into `buspasses` collection
- `GET /api/buspasses` → Query `buspasses` collection
- `POST /api/buspasses/:id/use` → Update `buspasses` collection

This mapping ensures that all frontend data requirements are properly stored and retrieved from the database with appropriate validation and relationships.
