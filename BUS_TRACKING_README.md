# 🚌 Smart Bus Tracking System

This document explains the bus tracking functionality that allows users to track buses using unique tracking numbers.

## 🎯 Features

### **Unique Bus Tracking Numbers**
- Each bus gets a unique 6-character tracking number (e.g., `DL1234`, `MB5678`)
- Format: `[City Code][4-digit number]`
- City codes: DL (Delhi), MB (Mumbai), BL (Bangalore), CH (Chennai), PN (Pune), HD (Hyderabad), KL (Kolkata)

### **Real-time Bus Information**
- Current bus location (bus stand name, GPS coordinates)
- Bus status (running, delayed, not started, completed, cancelled)
- Delay information (minutes delayed)
- Route stops with estimated arrival times
- Next upcoming stops

### **Comprehensive Route Details**
- Complete route from origin to destination
- All bus stops along the route
- Estimated vs actual arrival times
- Stop status (pending, arrived, departed, delayed)

## 🚀 How to Use

### **For Passengers:**

1. **Get Tracking Number**
   - Each bus has a unique tracking number displayed on the bus
   - Also available in booking confirmations and tickets

2. **Track Bus**
   - Go to "Track Bus" page
   - Enter the 6-character tracking number (e.g., `DL1234`)
   - Click "Track Bus" button

3. **View Information**
   - Current bus location and status
   - Estimated arrival times at upcoming stops
   - Complete route information
   - Delay notifications

### **For Bus Drivers/Admin:**

1. **Update Location**
   - Use API endpoint to update bus location
   - Include bus stand name and GPS coordinates

2. **Update Status**
   - Mark bus as running, delayed, or completed
   - Set delay minutes if applicable

## 📊 API Endpoints

### **Public Endpoints (No Authentication Required)**

#### Track Bus by Number
```http
GET /api/bus-tracking/:trackingNumber
```
**Example:** `GET /api/bus-tracking/DL1234`

**Response:**
```json
{
  "success": true,
  "data": {
    "bus": {
      "busName": "Delhi Local Bus 1",
      "busNumber": "DL001",
      "trackingNumber": "DL1234",
      "city": "Delhi",
      "from": "Connaught Place",
      "to": "Karol Bagh",
      "busType": "Non-AC",
      "currentStatus": "running",
      "delayMinutes": 0
    },
    "currentLocation": {
      "busStand": "Rajiv Chowk",
      "latitude": 28.6315,
      "longitude": 77.2167,
      "lastUpdated": "2024-01-15T10:30:00.000Z"
    },
    "routeStops": [
      {
        "busStand": "Connaught Place",
        "estimatedArrival": "08:00",
        "actualArrival": "08:00",
        "status": "departed"
      },
      {
        "busStand": "Rajiv Chowk",
        "estimatedArrival": "08:15",
        "actualArrival": "08:15",
        "status": "departed"
      },
      {
        "busStand": "Karol Bagh",
        "estimatedArrival": "08:45",
        "actualArrival": null,
        "status": "pending"
      }
    ],
    "nextStops": [
      {
        "busStand": "Karol Bagh",
        "estimatedArrival": "08:45",
        "status": "pending"
      }
    ],
    "schedule": {
      "departureTime": "08:00",
      "arrivalTime": "08:45",
      "estimatedArrival": "08:45"
    }
  }
}
```

#### Get All Buses in City
```http
GET /api/bus-tracking/city/:city
```
**Example:** `GET /api/bus-tracking/city/Delhi`

#### Get Bus Route Details
```http
GET /api/bus-tracking/:trackingNumber/route
```

### **Admin/Driver Endpoints (Authentication Required)**

#### Update Bus Location
```http
PUT /api/bus-tracking/:trackingNumber/location
```
**Body:**
```json
{
  "busStand": "Rajiv Chowk",
  "latitude": 28.6315,
  "longitude": 77.2167
}
```

#### Update Bus Status
```http
PUT /api/bus-tracking/:trackingNumber/status
```
**Body:**
```json
{
  "status": "delayed",
  "delayMinutes": 10
}
```

## 🗄️ Database Schema

### **Bus Model Updates**

```javascript
{
  // Existing fields...
  trackingNumber: String,        // Unique 6-character code
  currentLocation: {
    busStand: String,           // Current bus stand name
    latitude: Number,           // GPS latitude
    longitude: Number,          // GPS longitude
    lastUpdated: Date           // Last location update
  },
  routeStops: [{
    busStand: String,           // Bus stand name
    estimatedArrival: String,   // Estimated arrival time
    actualArrival: String,      // Actual arrival time
    status: String              // pending, arrived, departed, delayed
  }],
  currentStatus: String,        // not_started, running, delayed, completed, cancelled
  delayMinutes: Number          // Minutes delayed (0 if on time)
}
```

## 🛠️ Setup Instructions

### **1. Database Setup**
```bash
# Navigate to backend directory
cd Smart-Bus/backend

# Run database setup (creates buses with tracking numbers)
npm run setup-db

# Or add tracking numbers to existing buses
npm run add-tracking
```

### **2. Start Backend Server**
```bash
npm run dev
```

### **3. Start Frontend**
```bash
cd Smart-Bus/frontend
npm start
```

## 📱 Frontend Integration

### **TrackBus Component**
- Real-time bus tracking interface
- Displays comprehensive bus information
- Shows current location, status, and route details
- Responsive design for mobile and desktop

### **API Integration**
- Uses `busTrackingAPI` from `utils/api.js`
- Handles loading states and error messages
- Real-time updates every 30 seconds (optional)

## 🎨 UI Features

### **Bus Information Card**
- Bus name, number, and tracking number
- Current status with color coding
- Delay information if applicable

### **Location Display**
- Current bus stand name
- Last updated timestamp
- GPS coordinates (for admin use)

### **Route Information**
- Complete route with all stops
- Estimated vs actual arrival times
- Status badges for each stop
- Next upcoming stops highlighted

### **Status Indicators**
- 🟢 Running (green)
- 🟡 Delayed (yellow)
- ⚫ Not Started (gray)
- 🔵 Completed (blue)
- 🔴 Cancelled (red)

## 🔧 Configuration

### **Environment Variables**
```bash
MONGODB_URI=mongodb://localhost:27017/smart-bus-db
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
```

### **Tracking Number Format**
- City codes are automatically generated from city names
- 4-digit numbers are randomly generated
- Format: `[CITY_CODE][4_DIGITS]`
- Example: `DL1234`, `MB5678`, `BL9012`

## 🚨 Error Handling

### **Common Errors**
- **404**: Bus not found with tracking number
- **400**: Invalid tracking number format
- **500**: Server error

### **Error Messages**
- "Bus not found with this tracking number"
- "Please enter a tracking number"
- "Failed to track bus. Please check the tracking number"

## 📊 Sample Data

### **Sample Tracking Numbers**
- `DL1234` - Delhi Local Bus 1 (Connaught Place → Karol Bagh)
- `DL5678` - Delhi Local Bus 2 (Karol Bagh → Dwarka)
- `MB9012` - Mumbai Local Bus 1 (Andheri → Bandra)
- `MB3456` - Mumbai Local Bus 2 (Dadar → Colaba)

### **Sample Route Stops**
```javascript
// Delhi Bus Route
[
  { busStand: "Connaught Place", estimatedArrival: "08:00", status: "departed" },
  { busStand: "Rajiv Chowk", estimatedArrival: "08:15", status: "departed" },
  { busStand: "Karol Bagh", estimatedArrival: "08:45", status: "pending" }
]
```

## 🎯 Testing

### **Test Tracking Numbers**
1. Run `npm run setup-db` to create sample data
2. Use tracking numbers from the console output
3. Test the TrackBus page with these numbers

### **Test Scenarios**
- Track a running bus
- Track a delayed bus
- Track a bus that hasn't started
- Enter invalid tracking number
- Test mobile responsiveness

## 🚀 Future Enhancements

### **Planned Features**
- Real-time GPS tracking
- Push notifications for delays
- Bus arrival predictions
- Route optimization
- Passenger capacity tracking
- Integration with maps

### **Advanced Features**
- Live bus tracking on map
- Estimated time to reach specific stops
- Bus occupancy information
- Weather-based delay predictions
- Traffic integration

## 📞 Support

For issues or questions about the bus tracking system:
1. Check the console logs for error messages
2. Verify database connection
3. Ensure tracking numbers are properly generated
4. Check API endpoint responses

---

**🎉 Your Smart Bus Tracking System is now ready!**

Users can track buses using unique tracking numbers and get real-time information about bus location, status, and estimated arrival times.
