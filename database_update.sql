-- Execute this SQL in your MySQL database to add auto-completion columns

USE route_pro_db;

-- Add auto-completion tracking columns to trips table
ALTER TABLE trips 
ADD COLUMN auto_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN started_at TIMESTAMP NULL,
ADD COLUMN completed_at TIMESTAMP NULL,
ADD COLUMN actual_duration_minutes INT NULL,
ADD COLUMN has_rating BOOLEAN DEFAULT FALSE;

-- Show the updated table structure
DESCRIBE trips;

-- Optional: Show existing trips to verify
SELECT trip_id, status, auto_completed, started_at, completed_at FROM trips LIMIT 5;