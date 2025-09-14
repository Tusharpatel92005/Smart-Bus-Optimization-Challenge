# Smart Bus Backend API

A comprehensive backend API for the Smart Bus Management System built with Node.js, Express.js, and MongoDB.

## 🚀 Features

- **User Authentication**: Registration, login, and profile management
- **Bus Management**: CRUD operations for buses and routes
- **Booking System**: Seat booking with real-time availability
- **Cancellation System**: Ticket cancellation with refund calculation
- **Bus Pass System**: Digital bus passes with QR codes
- **Real-time Data**: Live seat availability and booking status
- **Security**: JWT authentication, password hashing, input validation

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Smart-Bus/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/smart-bus-db
   DB_NAME=smart-bus-db

   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-very-long-and-secure
   JWT_EXPIRE=7d

   # CORS Configuration
   FRONTEND_URL=http://localhost:3000

   # API Configuration
   API_VERSION=v1
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system

5. **Seed the database**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 📊 Database Schema

### Users Collection
- `name`: User's full name
- `email`: Unique email address
- `phone`: 10-digit phone number
- `password`: Hashed password
- `role`: User role (user/admin)
- `isActive`: Account status
- `lastLogin`: Last login timestamp

### Buses Collection
- `busName`: Name of the bus
- `busNumber`: Unique bus number
- `city`: Operating city
- `from`: Starting location
- `to`: Destination location
- `departureTime`: Departure time
- `arrivalTime`: Arrival time
- `totalSeats`: Total number of seats
- `availableSeats`: Available seats count
- `fare`: Ticket price
- `busType`: AC/Non-AC/Sleeper
- `amenities`: Available amenities
- `bookedSeats`: Array of booked seat numbers

### Bookings Collection
- `pnr`: Unique booking reference
- `user`: User ID reference
- `bus`: Bus ID reference
- `seatNumber`: Booked seat number
- `travelDate`: Date of travel
- `passengerDetails`: Passenger information
- `fare`: Booking fare
- `status`: Booking status
- `paymentStatus`: Payment status
- `refundAmount`: Refund amount if cancelled

### BusPasses Collection
- `user`: User ID reference
- `passType`: Daily/Weekly/Monthly/Yearly
- `city`: Valid city
- `validFrom`: Pass start date
- `validTo`: Pass end date
- `price`: Pass price
- `status`: Pass status
- `usageCount`: Number of times used
- `maxUsage`: Maximum usage limit
- `qrCode`: Unique QR code

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Buses
- `GET /api/buses` - Get all buses
- `GET /api/buses/:id` - Get single bus
- `POST /api/buses` - Create bus (Admin only)
- `PUT /api/buses/:id` - Update bus (Admin only)
- `DELETE /api/buses/:id` - Delete bus (Admin only)
- `GET /api/buses/:id/seats` - Get available seats

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get single booking
- `GET /api/bookings/pnr/:pnr` - Get booking by PNR
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `GET /api/bookings/stats/overview` - Get booking statistics

### Bus Passes
- `POST /api/buspasses` - Create bus pass
- `GET /api/buspasses` - Get user bus passes
- `GET /api/buspasses/:id` - Get single bus pass
- `POST /api/buspasses/:id/use` - Use bus pass
- `GET /api/buspasses/:id/validate` - Validate bus pass
- `GET /api/buspasses/stats/overview` - Get bus pass statistics

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Input Validation**: express-validator for request validation
- **CORS Protection**: Configured CORS for frontend integration
- **Helmet**: Security headers for HTTP protection
- **Rate Limiting**: Protection against brute force attacks

## 📱 Frontend Integration

The backend is designed to work seamlessly with the React frontend. Update your frontend API calls to use the backend endpoints:

```javascript
// Example API call
const response = await fetch('http://localhost:5000/api/buses', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});
```

## 🧪 Testing

Test the API endpoints using tools like Postman or curl:

```bash
# Health check
curl http://localhost:5000/health

# Get buses
curl http://localhost:5000/api/buses

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","phone":"9876543210","password":"password123"}'
```

## 📈 Monitoring

- Health check endpoint: `GET /health`
- Request logging with Morgan
- Error handling and logging
- Database connection monitoring

## 🚀 Deployment

1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Install dependencies: `npm install`
4. Seed the database: `npm run seed`
5. Start the server: `npm start`

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please contact the development team.
