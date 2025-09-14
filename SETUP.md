# Smart Bus Management System - Setup Guide

## Prerequisites

Before setting up the Smart Bus Management System, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

## Installation Steps

### 1. Database Setup

1. **Install MongoDB** (if not already installed):
   - Download from: https://www.mongodb.com/try/download/community
   - Follow installation instructions for your operating system
   - Start MongoDB service

2. **Create Database**:
   ```bash
   # MongoDB will create the database automatically when first accessed
   # Database name: smart-bus-db
   ```

### 2. Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd Smart-Bus/backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   - Copy `config.env` to `.env`:
   ```bash
   cp config.env .env
   ```
   - Update the `.env` file with your MongoDB connection string if needed

4. **Seed the database** (optional but recommended):
   ```bash
   npm run seed
   ```

5. **Start the backend server**:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

   The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd Smart-Bus/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the frontend development server**:
   ```bash
   npm start
   ```

   The frontend will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Buses
- `GET /api/buses` - Get all buses (with filters)
- `GET /api/buses/:id` - Get single bus
- `GET /api/buses/:id/seats` - Get available seats
- `POST /api/buses` - Create bus (Admin only)
- `PUT /api/buses/:id` - Update bus (Admin only)
- `DELETE /api/buses/:id` - Delete bus (Admin only)

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

## Default Admin Account

After running the seed script, you can use the following admin account:
- **Email**: admin@smartbus.com
- **Password**: admin123
- **Role**: admin

## Features

### User Features
- User registration and authentication
- Bus search and booking
- Bus pass creation and management
- Booking history and management
- Ticket cancellation and refunds

### Admin Features
- Bus management (CRUD operations)
- User management
- System statistics

### Bus Pass Types
- **Daily Pass**: ₹50 (10 uses)
- **Weekly Pass**: ₹300 (50 uses)
- **Monthly Pass**: ₹1000 (200 uses)
- **Yearly Pass**: ₹10000 (2000 uses)

## Database Models

### User
- name, email, phone, password
- role (user/admin)
- isActive, lastLogin

### Bus
- busName, busNumber, city
- from, to, departureTime, arrivalTime
- totalSeats, availableSeats, bookedSeats
- fare, busType, amenities

### Booking
- pnr, user, bus
- travelDate, seatNumber
- passengerDetails, fare
- status, paymentStatus

### BusPass
- user, passType, city
- validFrom, validTo, price
- usageCount, maxUsage
- qrCode, status

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running
   - Check connection string in `.env` file
   - Verify database permissions

2. **Port Already in Use**:
   - Change PORT in `.env` file
   - Kill existing processes using the port

3. **CORS Issues**:
   - Ensure frontend URL is correct in backend `.env`
   - Check if both servers are running

4. **Authentication Issues**:
   - Verify JWT_SECRET is set
   - Check token expiration settings

### Health Check

Visit `http://localhost:5000/health` to verify backend is running correctly.

## Development

### Adding New Features

1. **Backend**: Add routes in appropriate route files
2. **Frontend**: Add API calls in `utils/api.js`
3. **Models**: Update Mongoose schemas as needed
4. **Validation**: Add validation rules in `middleware/validation.js`

### Code Structure

```
Smart-Bus/
├── backend/
│   ├── config/          # Database configuration
│   ├── middleware/      # Authentication & validation
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── seeds/           # Database seeding
│   └── server.js        # Main server file
└── frontend/
    ├── src/
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   ├── utils/       # API utilities
    │   └── App.js       # Main app component
    └── public/          # Static files
```

## Production Deployment

1. **Environment Variables**: Set production environment variables
2. **Database**: Use MongoDB Atlas or production MongoDB instance
3. **Security**: Update JWT secrets and enable HTTPS
4. **Build**: Run `npm run build` for frontend
5. **Server**: Use PM2 or similar for process management

## Support

For issues or questions, please check the troubleshooting section or create an issue in the project repository.
