-- Smart Bus Management System Database Schema
-- This file contains all the database tables with columns used by the frontend

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE users (
    id VARCHAR(24) PRIMARY KEY,  -- MongoDB ObjectId format
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(10) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    isActive BOOLEAN DEFAULT TRUE,
    lastLogin TIMESTAMP NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_role (role),
    INDEX idx_isActive (isActive)
);

-- =============================================
-- BUSES TABLE
-- =============================================
CREATE TABLE buses (
    id VARCHAR(24) PRIMARY KEY,  -- MongoDB ObjectId format
    busName VARCHAR(100) NOT NULL,
    busNumber VARCHAR(20) UNIQUE NOT NULL,
    city VARCHAR(50) NOT NULL,
    from_location VARCHAR(100) NOT NULL,  -- 'from' is reserved keyword
    to_location VARCHAR(100) NOT NULL,    -- 'to' is reserved keyword
    departureTime TIME NOT NULL,
    arrivalTime TIME NOT NULL,
    totalSeats INT NOT NULL CHECK (totalSeats > 0 AND totalSeats <= 100),
    availableSeats INT NOT NULL CHECK (availableSeats >= 0),
    bookedSeats JSON,  -- Array of booked seat numbers
    fare DECIMAL(10,2) NOT NULL CHECK (fare >= 0),
    busType ENUM('AC', 'Non-AC', 'Sleeper', 'Semi-Sleeper') DEFAULT 'Non-AC',
    amenities JSON,  -- Array of amenities
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    INDEX idx_city (city),
    INDEX idx_busNumber (busNumber),
    INDEX idx_from_to (from_location, to_location),
    INDEX idx_departureTime (departureTime),
    INDEX idx_isActive (isActive),
    INDEX idx_fare (fare)
);

-- =============================================
-- BOOKINGS TABLE
-- =============================================
CREATE TABLE bookings (
    id VARCHAR(24) PRIMARY KEY,  -- MongoDB ObjectId format
    pnr VARCHAR(10) UNIQUE NOT NULL,
    user_id VARCHAR(24) NOT NULL,
    bus_id VARCHAR(24) NOT NULL,
    busName VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    from_location VARCHAR(100) NOT NULL,
    to_location VARCHAR(100) NOT NULL,
    travelDate DATE NOT NULL,
    seatNumber INT NOT NULL CHECK (seatNumber > 0),
    
    -- Passenger Details (JSON for flexibility)
    passengerDetails JSON NOT NULL,  -- Contains: name, email, phone
    
    fare DECIMAL(10,2) NOT NULL CHECK (fare >= 0),
    status ENUM('confirmed', 'cancelled', 'completed') DEFAULT 'confirmed',
    paymentStatus ENUM('pending', 'paid', 'refunded') DEFAULT 'paid',
    paymentMethod ENUM('cash', 'card', 'upi', 'netbanking') DEFAULT 'cash',
    bookingTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancellationTime TIMESTAMP NULL,
    refundAmount DECIMAL(10,2) DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE,
    
    -- Indexes for performance
    INDEX idx_pnr (pnr),
    INDEX idx_user_id (user_id),
    INDEX idx_bus_id (bus_id),
    INDEX idx_travelDate (travelDate),
    INDEX idx_status (status),
    INDEX idx_paymentStatus (paymentStatus),
    INDEX idx_bookingTime (bookingTime)
);

-- =============================================
-- BUS PASSES TABLE
-- =============================================
CREATE TABLE bus_passes (
    id VARCHAR(24) PRIMARY KEY,  -- MongoDB ObjectId format
    user_id VARCHAR(24) NOT NULL,
    passType ENUM('daily', 'weekly', 'monthly', 'yearly') NOT NULL,
    city VARCHAR(50) NOT NULL,
    validFrom DATE NOT NULL,
    validTo DATE NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    status ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
    usageCount INT DEFAULT 0,
    maxUsage INT DEFAULT 0,  -- 0 means unlimited
    qrCode VARCHAR(50) UNIQUE,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Indexes for performance
    INDEX idx_user_id (user_id),
    INDEX idx_passType (passType),
    INDEX idx_city (city),
    INDEX idx_validFrom (validFrom),
    INDEX idx_validTo (validTo),
    INDEX idx_status (status),
    INDEX idx_qrCode (qrCode),
    INDEX idx_isActive (isActive)
);

-- =============================================
-- CITIES AND LOCATIONS TABLE (Reference Data)
-- =============================================
CREATE TABLE cities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cityName VARCHAR(50) UNIQUE NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city_id INT NOT NULL,
    locationName VARCHAR(100) NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE,
    UNIQUE KEY unique_city_location (city_id, locationName),
    INDEX idx_city_id (city_id)
);

-- =============================================
-- PAYMENT TRANSACTIONS TABLE
-- =============================================
CREATE TABLE payment_transactions (
    id VARCHAR(24) PRIMARY KEY,  -- MongoDB ObjectId format
    booking_id VARCHAR(24) NOT NULL,
    user_id VARCHAR(24) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    paymentMethod ENUM('cash', 'card', 'upi', 'netbanking') NOT NULL,
    paymentStatus ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    transactionId VARCHAR(100) UNIQUE,
    paymentGateway VARCHAR(50),
    paymentDate TIMESTAMP NULL,
    refundDate TIMESTAMP NULL,
    refundAmount DECIMAL(10,2) DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_booking_id (booking_id),
    INDEX idx_user_id (user_id),
    INDEX idx_paymentStatus (paymentStatus),
    INDEX idx_transactionId (transactionId),
    INDEX idx_paymentDate (paymentDate)
);

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================
CREATE TABLE notifications (
    id VARCHAR(24) PRIMARY KEY,  -- MongoDB ObjectId format
    user_id VARCHAR(24) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('booking', 'cancellation', 'payment', 'bus_pass', 'general') NOT NULL,
    isRead BOOLEAN DEFAULT FALSE,
    relatedId VARCHAR(24),  -- ID of related booking, bus pass, etc.
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_isRead (isRead),
    INDEX idx_createdAt (createdAt)
);

-- =============================================
-- SYSTEM SETTINGS TABLE
-- =============================================
CREATE TABLE system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    settingKey VARCHAR(100) UNIQUE NOT NULL,
    settingValue TEXT NOT NULL,
    description TEXT,
    isActive BOOLEAN DEFAULT TRUE,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- AUDIT LOG TABLE
-- =============================================
CREATE TABLE audit_logs (
    id VARCHAR(24) PRIMARY KEY,  -- MongoDB ObjectId format
    user_id VARCHAR(24),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id VARCHAR(24) NOT NULL,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_table_name (table_name),
    INDEX idx_record_id (record_id),
    INDEX idx_createdAt (createdAt)
);

-- =============================================
-- INSERT DEFAULT DATA
-- =============================================

-- Insert default cities
INSERT INTO cities (cityName) VALUES 
('Delhi'), ('Mumbai'), ('Bangalore'), ('Chennai'), 
('Pune'), ('Hyderabad'), ('Kolkata');

-- Insert default locations for each city
INSERT INTO locations (city_id, locationName) VALUES 
-- Delhi locations
(1, 'Connaught Place'), (1, 'Karol Bagh'), (1, 'Dwarka'), (1, 'Rohini'),
-- Mumbai locations  
(2, 'Andheri'), (2, 'Bandra'), (2, 'Dadar'), (2, 'Colaba'),
-- Bangalore locations
(3, 'Majestic'), (3, 'Whitefield'), (3, 'Koramangala'), (3, 'Indiranagar'),
-- Chennai locations
(4, 'T. Nagar'), (4, 'Anna Nagar'), (4, 'Adyar'), (4, 'Tambaram'),
-- Pune locations
(5, 'Shivaji Nagar'), (5, 'Kothrud'), (5, 'Hadapsar'), (5, 'Aundh'),
-- Hyderabad locations
(6, 'Secunderabad'), (6, 'Banjara Hills'), (6, 'Hitech City'), (6, 'Miyapur'),
-- Kolkata locations
(7, 'Salt Lake'), (7, 'Esplanade'), (7, 'Howrah'), (7, 'Park Street');

-- Insert system settings
INSERT INTO system_settings (settingKey, settingValue, description) VALUES 
('bus_pass_daily_price', '50', 'Daily bus pass price'),
('bus_pass_weekly_price', '300', 'Weekly bus pass price'),
('bus_pass_monthly_price', '1000', 'Monthly bus pass price'),
('bus_pass_yearly_price', '10000', 'Yearly bus pass price'),
('cancellation_refund_percentage', '70', 'Percentage of fare refunded on cancellation'),
('cancellation_hours_limit', '24', 'Hours before travel when cancellation is allowed'),
('max_seats_per_bus', '100', 'Maximum seats allowed per bus'),
('default_bus_type', 'Non-AC', 'Default bus type for new buses');

-- Create admin user (password: admin123)
INSERT INTO users (id, name, email, phone, password, role) VALUES 
('507f1f77bcf86cd799439011', 'Admin User', 'admin@smartbus.com', '9999999999', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Kz8KzK', 'admin');
