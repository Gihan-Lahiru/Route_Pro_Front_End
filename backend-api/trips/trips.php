<?php

/**
 * Trips API - Main endpoint for trip management
 * Handles trip creation, retrieval, updates, and deletion
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-CSRF-Token');
header('Access-Control-Allow-Credentials: false');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Database connection - using same credentials as working mock API
    $host = 'localhost';
    $dbname = 'route_pro_db';
    $username = 'root';
    $password = 'pubz';

    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Handle trip creation
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            throw new Exception('Invalid JSON input');
        }

        // Log the received data for debugging
        error_log("Received trip data: " . json_encode($input));

        // Validate required fields
        if (!isset($input['traveler_id']) || empty($input['traveler_id'])) {
            throw new Exception('Traveler ID is required');
        }

        // Extract and validate data
        $traveler_id = intval($input['traveler_id']);
        $route_id = isset($input['route_id']) ? intval($input['route_id']) : null;
        $driver_id = isset($input['driver_id']) ? intval($input['driver_id']) : null;
        $guide_id = isset($input['guide_id']) ? intval($input['guide_id']) : null;
        $date = isset($input['date']) ? $input['date'] : null;
        $start_time = isset($input['start_time']) ? $input['start_time'] : null;
        $trip_status = isset($input['trip_status']) ? $input['trip_status'] : 'confirmed';
        $route_cost = isset($input['route_cost']) ? floatval($input['route_cost']) : 0.00;
        $driver_cost = isset($input['driver_cost']) ? floatval($input['driver_cost']) : 0.00;
        $guide_cost = isset($input['guide_cost']) ? floatval($input['guide_cost']) : 0.00;
        $total_cost = isset($input['total_cost']) ? floatval($input['total_cost']) : 0.00;
        $system_fee = isset($input['system_fee']) ? floatval($input['system_fee']) : 0.00;
        $special_requests = isset($input['special_requests']) ? $input['special_requests'] : null;
        $start_location = isset($input['start_location']) ? $input['start_location'] : 'Start Location';
        $end_location = isset($input['end_location']) ? $input['end_location'] : 'End Location';

        // Ensure at least driver or guide is selected
        if (!$driver_id && !$guide_id) {
            throw new Exception('At least one driver or guide must be selected');
        }

        // Format dates if provided
        if ($date) {
            try {
                $date = date('Y-m-d H:i:s', strtotime($date));
            } catch (Exception $e) {
                $date = null;
            }
        }

        if ($start_time) {
            try {
                $start_time = date('Y-m-d H:i:s', strtotime($start_time));
            } catch (Exception $e) {
                $start_time = null;
            }
        }

        // Insert trip into database
        $sql = "INSERT INTO trips (
            traveler_id, route_id, driver_id, guide_id, date, start_time, 
            trip_status, route_cost, driver_cost, guide_cost, total_cost, 
            system_fee, special_requests, start_location, end_location, created_at
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW()
        )";

        $stmt = $pdo->prepare($sql);
        $result = $stmt->execute([
            $traveler_id,
            $route_id,
            $driver_id,
            $guide_id,
            $date,
            $start_time,
            $trip_status,
            $route_cost,
            $driver_cost,
            $guide_cost,
            $total_cost,
            $system_fee,
            $special_requests,
            $start_location,
            $end_location
        ]);

        if ($result) {
            $trip_id = $pdo->lastInsertId();

            // Log success
            error_log("Trip created successfully with ID: " . $trip_id);

            echo json_encode([
                'success' => true,
                'message' => 'Trip created successfully',
                'trip_id' => $trip_id,
                'data' => [
                    'trip_id' => $trip_id,
                    'traveler_id' => $traveler_id,
                    'driver_id' => $driver_id,
                    'guide_id' => $guide_id,
                    'route_id' => $route_id,
                    'trip_status' => $trip_status,
                    'total_cost' => $total_cost,
                    'created_at' => date('Y-m-d H:i:s')
                ]
            ]);
        } else {
            throw new Exception('Failed to create trip');
        }
    } else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Handle trip retrieval - delegate to trips-descending.php logic
        $driver_id = isset($_GET['driver_id']) ? intval($_GET['driver_id']) : null;
        $guide_id = isset($_GET['guide_id']) ? intval($_GET['guide_id']) : null;
        $traveler_id = isset($_GET['traveler_id']) ? intval($_GET['traveler_id']) : null;
        $status = isset($_GET['status']) ? $_GET['status'] : null;
        $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 100;

        // Build comprehensive query with all necessary joins
        $sql = "
            SELECT 
                t.trip_id,
                t.traveler_id,
                t.driver_id,
                t.guide_id,
                t.route_id,
                t.date as trip_date,
                t.start_time,
                t.trip_status,
                t.created_at,
                t.route_cost,
                t.driver_cost,
                t.guide_cost,
                t.total_cost,
                t.system_fee,
                t.special_requests,
                t.start_location,
                t.end_location,
                
                -- Traveler info with email and phone
                tr.name as traveler_name,
                u_traveler.email as traveler_email,
                tr.phone as traveler_phone,
                
                -- Driver info with email and phone
                d.name as driver_name,
                u_driver.email as driver_email,
                d.phone as driver_phone,
                
                -- Guide info with email and phone
                g.name as guide_name,
                u_guide.email as guide_email,
                g.phone as guide_phone,
                
                -- Route info for distance and estimated time
                r.distance_km,
                r.estimated_time,
                r.start_location as route_start_location,
                r.end_location as route_end_location
                
            FROM trips t
            
            -- Join traveler information
            LEFT JOIN travellers tr ON t.traveler_id = tr.user_id
            LEFT JOIN users u_traveler ON tr.user_id = u_traveler.id
            
            -- Join driver information
            LEFT JOIN drivers d ON t.driver_id = d.id
            LEFT JOIN users u_driver ON d.user_id = u_driver.id
            
            -- Join guide information
            LEFT JOIN guides g ON t.guide_id = g.id
            LEFT JOIN users u_guide ON g.user_id = u_guide.id
            
            -- Join route information for distance and time
            LEFT JOIN routes r ON t.route_id = r.route_id
            
            WHERE 1=1
        ";

        $params = [];

        // Add filters
        if ($driver_id) {
            $sql .= " AND t.driver_id = ?";
            $params[] = $driver_id;
        }

        if ($guide_id) {
            $sql .= " AND t.guide_id = ?";
            $params[] = $guide_id;
        }

        if ($traveler_id) {
            $sql .= " AND t.traveler_id = ?";
            $params[] = $traveler_id;
        }

        if ($status) {
            $sql .= " AND t.trip_status = ?";
            $params[] = $status;
        }

        // Order by trip_id descending (newest first)
        $sql .= " ORDER BY t.trip_id DESC";

        // Add limit (cast to int for security)
        if ($limit > 0) {
            $sql .= " LIMIT " . intval($limit);
        }

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $trips = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Format response
        echo json_encode([
            'success' => true,
            'message' => 'Trips retrieved successfully',
            'trips' => $trips,
            'total_trips' => count($trips),
            'filters_applied' => [
                'driver_id' => $driver_id,
                'guide_id' => $guide_id,
                'traveler_id' => $traveler_id,
                'status' => $status,
                'limit' => $limit
            ]
        ]);
    } else {
        // Handle other HTTP methods if needed
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'message' => 'Method not allowed'
        ]);
    }
} catch (PDOException $e) {
    error_log("Database error in trips.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error occurred',
        'error' => $e->getMessage()
    ]);
} catch (Exception $e) {
    error_log("General error in trips.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
