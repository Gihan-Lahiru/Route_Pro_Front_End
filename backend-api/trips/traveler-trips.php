<?php

/**
 * Traveler Trips API
 * Fetches all trips for a specific traveler with complete details
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
        $traveler_id = isset($_GET['traveler_id']) ? intval($_GET['traveler_id']) : null;
        $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 100; // Default to show more trips
        $status = isset($_GET['status']) ? $_GET['status'] : null;

        if (!$traveler_id) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Traveler ID is required'
            ]);
            exit();
        }

        // Build comprehensive query to fetch all trip details
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
                t.system_fee,
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
                
                -- Driver details (if assigned)
                u_driver.name as driver_name,
                u_driver.email as driver_email,
                d.phone as driver_phone,
                d.vehicle_type as driver_vehicle_type,
                d.capacity as driver_capacity,
                d.location as driver_location,
                
                -- Guide details (if assigned)
                u_guide.name as guide_name,
                u_guide.email as guide_email,
                g.phone as guide_phone,
                g.languages as guide_languages,
                g.experience_years as guide_experience,
                g.location as guide_location,
                
                -- Route details (if exists)
                r.start_location as route_start,
                r.end_location as route_end,
                r.distance_km,
                r.estimated_time
                
            FROM trips t
            
            -- Join traveler details
            LEFT JOIN users u_traveler ON t.traveler_id = u_traveler.id
            LEFT JOIN travellers tr ON t.traveler_id = tr.user_id
            
            -- Join driver details (optional)
            LEFT JOIN drivers d ON t.driver_id = d.id
            LEFT JOIN users u_driver ON d.user_id = u_driver.id
            
            -- Join guide details (optional)
            LEFT JOIN guides g ON t.guide_id = g.id
            LEFT JOIN users u_guide ON g.user_id = u_guide.id
            
            -- Join route details (optional)
            LEFT JOIN routes r ON t.route_id = r.route_id
            
            WHERE t.traveler_id = ?
        ";

        $params = [$traveler_id];

        // Add status filter if provided
        if ($status) {
            $sql .= " AND t.trip_status = ?";
            $params[] = $status;
        }

        // Order by trip_id descending (newest first)
        $sql .= " ORDER BY t.trip_id DESC";

        // Add limit
        if ($limit > 0) {
            $sql .= " LIMIT ?";
            $params[] = $limit;
        }

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $trips = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Process trips to enhance data
        foreach ($trips as &$trip) {
            // Ensure we have proper date field
            if (!$trip['trip_date'] && $trip['date']) {
                $trip['trip_date'] = $trip['date'];
            }

            // Format dates for display
            if ($trip['trip_date']) {
                $trip['formatted_date'] = date('Y-m-d', strtotime($trip['trip_date']));
                $trip['formatted_date_readable'] = date('M j, Y', strtotime($trip['trip_date']));
            }

            if ($trip['start_time']) {
                $trip['formatted_time'] = date('H:i', strtotime($trip['start_time']));
                $trip['formatted_time_readable'] = date('g:i A', strtotime($trip['start_time']));
            }

            // Handle driver assignment
            if (!$trip['driver_name'] || $trip['driver_name'] === 'null') {
                $trip['driver_name'] = null;
            }

            // Handle guide assignment
            if (!$trip['guide_name'] || $trip['guide_name'] === 'null') {
                $trip['guide_name'] = null;
            }

            // Distance formatting
            if ($trip['distance_km']) {
                $trip['distance_display'] = $trip['distance_km'] < 1
                    ? round($trip['distance_km'] * 1000) . ' m'
                    : round($trip['distance_km'], 1) . ' km';
            }

            // Status formatting
            $trip['status_class'] = strtolower(str_replace('_', '-', $trip['trip_status']));

            // Cost formatting
            $trip['route_cost'] = number_format($trip['route_cost'], 2);
            $trip['driver_cost'] = number_format($trip['driver_cost'] ?: 0, 2);
            $trip['guide_cost'] = number_format($trip['guide_cost'] ?: 0, 2);
            $trip['system_fee'] = number_format($trip['system_fee'] ?: 0, 2);
            $trip['total_cost'] = number_format($trip['total_cost'], 2);
        }

        // Group trips by status for statistics
        $stats = [
            'confirmed' => 0,
            'completed' => 0,
            'in_progress' => 0,
            'cancelled' => 0
        ];

        foreach ($trips as $trip) {
            if (isset($stats[$trip['trip_status']])) {
                $stats[$trip['trip_status']]++;
            }
        }

        $response = [
            'success' => true,
            'message' => 'Trips retrieved successfully',
            'trips' => $trips,
            'total_trips' => count($trips),
            'traveler_id' => $traveler_id,
            'statistics' => $stats,
            'filters_applied' => [
                'traveler_id' => $traveler_id,
                'status' => $status,
                'limit' => $limit
            ],
            'sort_order' => 'descending_by_trip_id'
        ];

        echo json_encode($response);
    } else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        // Handle trip cancellation
        $trip_id = isset($_GET['trip_id']) ? intval($_GET['trip_id']) : null;
        $traveler_id = isset($_GET['traveler_id']) ? intval($_GET['traveler_id']) : null;

        if (!$trip_id || !$traveler_id) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Trip ID and Traveler ID are required'
            ]);
            exit();
        }

        // Check if trip belongs to traveler and can be cancelled
        $checkSql = "SELECT trip_id, trip_status FROM trips WHERE trip_id = ? AND traveler_id = ?";
        $checkStmt = $pdo->prepare($checkSql);
        $checkStmt->execute([$trip_id, $traveler_id]);
        $trip = $checkStmt->fetch(PDO::FETCH_ASSOC);

        if (!$trip) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Trip not found or does not belong to this traveler'
            ]);
            exit();
        }

        if ($trip['trip_status'] !== 'confirmed') {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Only confirmed trips can be cancelled'
            ]);
            exit();
        }

        // Update trip status to cancelled
        $updateSql = "UPDATE trips SET trip_status = 'cancelled' WHERE trip_id = ? AND traveler_id = ?";
        $updateStmt = $pdo->prepare($updateSql);
        $updateStmt->execute([$trip_id, $traveler_id]);

        echo json_encode([
            'success' => true,
            'message' => 'Trip cancelled successfully',
            'trip_id' => $trip_id
        ]);
    } else {
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'message' => 'Method not allowed'
        ]);
    }
} catch (PDOException $e) {
    error_log("Database error in traveler-trips.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database connection error',
        'debug' => 'Check database connection and table structure'
    ]);
} catch (Exception $e) {
    error_log("General error in traveler-trips.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred while processing the request',
        'debug' => $e->getMessage()
    ]);
}
