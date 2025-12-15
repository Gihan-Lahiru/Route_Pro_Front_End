-- Fix Route Distances in Database
-- The current distances are off by a factor of 1000
-- This script updates them to realistic values

USE route_pro_db;

-- Update route distances to realistic values (multiply by 1000 + adjust)
UPDATE routes SET distance_km = 40.0 WHERE route_id = 1;  -- galle to matara: 40 km
UPDATE routes SET distance_km = 116.0 WHERE route_id = 2; -- galle to colombo: 116 km  
UPDATE routes SET distance_km = 156.0 WHERE route_id = 3; -- matara to colombo: 156 km
UPDATE routes SET distance_km = 238.0 WHERE route_id = 4; -- galle to badulla: 238 km
UPDATE routes SET distance_km = 420.0 WHERE route_id = 5; -- galle to jaffna: 420 km
UPDATE routes SET distance_km = 150.0 WHERE route_id = 6; -- galle to kandy: 150 km
UPDATE routes SET distance_km = 442.0 WHERE route_id = 7; -- matara to jaffna: 442 km
UPDATE routes SET distance_km = 320.0 WHERE route_id = 8; -- badulla to jaffna: 320 km
UPDATE routes SET distance_km = 320.0 WHERE route_id = 9; -- jaffna to badulla: 320 km
UPDATE routes SET distance_km = 420.0 WHERE route_id = 10; -- jaffna to galle: 420 km
UPDATE routes SET distance_km = 40.0 WHERE route_id = 11; -- matara to galle: 40 km
UPDATE routes SET distance_km = 116.0 WHERE route_id = 12; -- colombo to galle: 116 km
UPDATE routes SET distance_km = 280.0 WHERE route_id = 13; -- kandy to jaffna: 280 km
UPDATE routes SET distance_km = 150.0 WHERE route_id = 14; -- kandy to galle: 150 km
UPDATE routes SET distance_km = 280.0 WHERE route_id = 15; -- jaffna to kandy: 280 km
UPDATE routes SET distance_km = 156.0 WHERE route_id = 16; -- colombo to matara: 156 km
UPDATE routes SET distance_km = 410.0 WHERE route_id = 17; -- jaffna to hambantota: 410 km
UPDATE routes SET distance_km = 240.0 WHERE route_id = 18; -- puttalam to ampara: 240 km
UPDATE routes SET distance_km = 300.0 WHERE route_id = 19; -- mannar to ampara: 300 km
UPDATE routes SET distance_km = 350.0 WHERE route_id = 20; -- jaffna to ampara: 350 km

-- Also update estimated times to be more realistic (in hours)
UPDATE routes SET estimated_time = '1.5' WHERE route_id = 1;  -- galle to matara: 1.5 hours
UPDATE routes SET estimated_time = '3.0' WHERE route_id = 2;  -- galle to colombo: 3 hours
UPDATE routes SET estimated_time = '4.0' WHERE route_id = 3;  -- matara to colombo: 4 hours
UPDATE routes SET estimated_time = '6.0' WHERE route_id = 4;  -- galle to badulla: 6 hours
UPDATE routes SET estimated_time = '8.5' WHERE route_id = 5;  -- galle to jaffna: 8.5 hours
UPDATE routes SET estimated_time = '4.0' WHERE route_id = 6;  -- galle to kandy: 4 hours
UPDATE routes SET estimated_time = '9.0' WHERE route_id = 7;  -- matara to jaffna: 9 hours
UPDATE routes SET estimated_time = '7.0' WHERE route_id = 8;  -- badulla to jaffna: 7 hours
UPDATE routes SET estimated_time = '7.0' WHERE route_id = 9;  -- jaffna to badulla: 7 hours
UPDATE routes SET estimated_time = '8.5' WHERE route_id = 10; -- jaffna to galle: 8.5 hours
UPDATE routes SET estimated_time = '1.5' WHERE route_id = 11; -- matara to galle: 1.5 hours
UPDATE routes SET estimated_time = '3.0' WHERE route_id = 12; -- colombo to galle: 3 hours
UPDATE routes SET estimated_time = '6.5' WHERE route_id = 13; -- kandy to jaffna: 6.5 hours
UPDATE routes SET estimated_time = '4.0' WHERE route_id = 14; -- kandy to galle: 4 hours
UPDATE routes SET estimated_time = '6.5' WHERE route_id = 15; -- jaffna to kandy: 6.5 hours
UPDATE routes SET estimated_time = '4.0' WHERE route_id = 16; -- colombo to matara: 4 hours
UPDATE routes SET estimated_time = '8.0' WHERE route_id = 17; -- jaffna to hambantota: 8 hours
UPDATE routes SET estimated_time = '5.5' WHERE route_id = 18; -- puttalam to ampara: 5.5 hours
UPDATE routes SET estimated_time = '6.5' WHERE route_id = 19; -- mannar to ampara: 6.5 hours
UPDATE routes SET estimated_time = '7.5' WHERE route_id = 20; -- jaffna to ampara: 7.5 hours

-- Also update costs to be proportional to distance (Rs 15 per km base rate)
UPDATE routes SET cost = distance_km * 15 WHERE route_id BETWEEN 1 AND 20;

-- Check the updated values
SELECT 
    route_id,
    start_location,
    end_location,
    distance_km,
    estimated_time,
    cost
FROM routes 
ORDER BY route_id;

-- Also fix any existing trips that have the old distance values
UPDATE trips t
JOIN routes r ON (
    (t.start_location = r.start_location AND t.end_location = r.end_location) OR
    (t.start_location = r.end_location AND t.end_location = r.start_location)
)
SET t.distance_km = r.distance_km,
    t.estimated_time = CONCAT(r.estimated_time, ' hrs')
WHERE t.distance_km < 1;

COMMIT;