-- Add auto-completion columns to trips table
ALTER TABLE trips 
ADD COLUMN IF NOT EXISTS auto_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS started_at TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS actual_duration_minutes INT NULL,
ADD COLUMN IF NOT EXISTS has_rating BOOLEAN DEFAULT FALSE;

-- Show the updated table structure
DESCRIBE trips;