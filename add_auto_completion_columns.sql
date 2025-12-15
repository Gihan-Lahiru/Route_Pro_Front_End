-- Add missing columns to trips table for auto-completion functionality

USE route_pro_db;

-- Add columns if they don't exist
ALTER TABLE trips 
ADD COLUMN IF NOT EXISTS auto_completed BOOLEAN DEFAULT FALSE COMMENT 'Whether trip was automatically completed',
ADD COLUMN IF NOT EXISTS started_at TIMESTAMP NULL COMMENT 'When trip was started',
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP NULL COMMENT 'When trip was completed',
ADD COLUMN IF NOT EXISTS actual_duration_minutes INT NULL COMMENT 'Actual trip duration in minutes',
ADD COLUMN IF NOT EXISTS has_rating BOOLEAN DEFAULT FALSE COMMENT 'Whether trip has been rated';

-- Update existing trips to default values
UPDATE trips 
SET auto_completed = FALSE, has_rating = FALSE 
WHERE auto_completed IS NULL OR has_rating IS NULL;

-- Check the table structure
DESCRIBE trips;

-- Show recent trips with new columns
SELECT 
    trip_id,
    trip_status,
    auto_completed,
    started_at,
    completed_at,
    actual_duration_minutes,
    has_rating,
    created_at
FROM trips 
ORDER BY trip_id DESC 
LIMIT 10;