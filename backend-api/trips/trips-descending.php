<?php

/**
 * Trips API with Descending Order Support
 * Fetches driver and guide trip details sorted by trip_id in descending order
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
    // Database connection
    $host = 'localhost';
    $dbname = 'route_pro_db';
    $username = 'root';
    $password = '';

    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get query parameters
        $driver_id = isset($_GET['driver_id']) ? intval($_GET['driver_id']) : null;
        $guide_id = isset($_GET['guide_id']) ? intval($_GET['guide_id']) : null;
        $traveler_id = isset($_GET['traveler_id']) ? intval($_GET['traveler_id']) : null;
        $status = isset($_GET['status']) ? $_GET['status'] : null;
        $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50; // Default limit

        // Build the base query with descending order
        $sql = "
            SELECT 
                t.trip_id,
                t.traveler_id,
                t.driver_id,
                t.guide_id,
                t.route_id,
                t.date,
                t.start_time,
                t.trip_status,
                t.created_at,
                t.route_cost,
                t.driver_cost,
                t.guide_cost,
                t.total_cost,
                t.special_requests,
                t.start_location,
                t.end_location,
                t.auto_completed,
                t.started_at,
                t.completed_at,
                t.actual_duration_minutes,
                t.has_rating,
                
                -- Traveler details
                u_traveler.name as traveler_name,
                u_traveler.email as traveler_email,
                tr.phone as traveler_phone,
                
                -- Driver details
                u_driver.name as driver_name,
                u_driver.email as driver_email,
                d.phone as driver_phone,
                d.vehicle_type as driver_vehicle_type,
                d.capacity as driver_capacity,
                d.location as driver_location,
                
                -- Guide details
                u_guide.name as guide_name,
                u_guide.email as guide_email,
                g.phone as guide_phone,
                g.languages as guide_languages,
                g.experience_years as guide_experience,
                g.location as guide_location,
                
                -- Route details
                r.start_location as route_start,
                r.end_location as route_end,
                r.distance_km,
                r.estimated_time
                
            FROM trips t
            
            -- Join traveler details
            LEFT JOIN users u_traveler ON t.traveler_id = u_traveler.id
            LEFT JOIN travellers tr ON t.traveler_id = tr.user_id
            
            -- Join driver details
            LEFT JOIN drivers d ON t.driver_id = d.id
            LEFT JOIN users u_driver ON d.user_id = u_driver.id
            
            -- Join guide details
            LEFT JOIN guides g ON t.guide_id = g.id
            LEFT JOIN users u_guide ON g.user_id = u_guide.id
            
            -- Join route details
            LEFT JOIN routes r ON t.route_id = r.route_id
            
            WHERE 1=1
        ";

        $params = [];

        // Add filters based on parameters
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

        // Add descending order by trip_id (newest trips first)
        $sql .= " ORDER BY t.trip_id DESC";

        // Add limit
        if ($limit > 0) {
            $sql .= " LIMIT ?";
            $params[] = $limit;
        }

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $trips = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Process trips to include additional data
        foreach ($trips as &$trip) {
            // Format dates
            if ($trip['date']) {
                $trip['formatted_date'] = date('Y-m-d', strtotime($trip['date']));
                $trip['formatted_date_readable'] = date('M j, Y', strtotime($trip['date']));
            }

            if ($trip['start_time']) {
                $trip['formatted_time'] = date('H:i', strtotime($trip['start_time']));
                $trip['formatted_time_readable'] = date('g:i A', strtotime($trip['start_time']));
            }

            // Calculate status badges
            $trip['status_class'] = strtolower(str_replace('_', '-', $trip['trip_status']));

            // Distance formatting
            if ($trip['distance_km']) {
                $trip['distance_display'] = $trip['distance_km'] < 1
                    ? round($trip['distance_km'] * 1000) . ' m'
                    : round($trip['distance_km'], 1) . ' km';
            }
        }

        // Group response data
        $response = [
            'success' => true,
            'message' => 'Trips retrieved successfully (descending order)',
            'trips' => $trips,
            'total_trips' => count($trips),
            'filters_applied' => [
                'driver_id' => $driver_id,
                'guide_id' => $guide_id,
                'traveler_id' => $traveler_id,
                'status' => $status,
                'limit' => $limit
            ],
            'sort_order' => 'descending_by_trip_id',
            'note' => 'Trips are sorted by trip_id in descending order (newest first)'
        ];

        echo json_encode($response);
    } else {
        // Handle other HTTP methods (POST, PUT, DELETE) if needed
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'message' => 'Method not allowed for this endpoint'
        ]);
    }
} catch (PDOException $e) {
    error_log("Database error in trips-descending.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error occurred'
    ]);
} catch (Exception $e) {
    error_log("General error in trips-descending.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred while processing the request'
    ]);
}
