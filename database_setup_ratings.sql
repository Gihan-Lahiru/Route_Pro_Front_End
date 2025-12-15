-- Trip Ratings Table Creation
-- Run this SQL to create the ratings system tables

-- Create trip_ratings table if it doesn't exist
CREATE TABLE IF NOT EXISTS trip_ratings (
    rating_id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    traveler_id INT NOT NULL,
    driver_id INT,
    guide_id INT,
    driver_rating INT CHECK (driver_rating >= 1 AND driver_rating <= 5),
    guide_rating INT CHECK (guide_rating >= 1 AND guide_rating <= 5),
    driver_comment TEXT,
    guide_comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_trip_id (trip_id),
    INDEX idx_traveler_id (traveler_id),
    INDEX idx_driver_id (driver_id),
    INDEX idx_guide_id (guide_id),
    UNIQUE KEY unique_trip_rating (trip_id),
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE
);

-- Add rating tracking columns to trips table if they don't exist
ALTER TABLE trips 
ADD COLUMN IF NOT EXISTS auto_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS started_at TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS actual_duration_minutes INT NULL,
ADD COLUMN IF NOT EXISTS has_rating BOOLEAN DEFAULT FALSE;

-- Add rating columns to drivers table if they don't exist
ALTER TABLE drivers 
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS total_ratings INT DEFAULT 0;

-- Add rating columns to guides table if they don't exist  
ALTER TABLE guides 
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS total_ratings INT DEFAULT 0;

-- Create notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    trip_id INT NULL,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_trip_id (trip_id),
    INDEX idx_created_at (created_at),
    INDEX idx_priority (priority)
);

-- Update existing trips to show completion capability
UPDATE trips 
SET has_rating = FALSE 
WHERE trip_status = 'completed' 
AND trip_id NOT IN (SELECT trip_id FROM trip_ratings);

-- Show current trip status
SELECT 
    t.trip_id,
    t.trip_status,
    t.auto_completed,
    t.has_rating,
    t.completed_at,
    CASE 
        WHEN tr.rating_id IS NOT NULL THEN 'YES'
        ELSE 'NO'
    END as has_rating_record
FROM trips t
LEFT JOIN trip_ratings tr ON t.trip_id = tr.trip_id
WHERE t.trip_status IN ('confirmed', 'completed')
ORDER BY t.trip_id DESC
LIMIT 10;