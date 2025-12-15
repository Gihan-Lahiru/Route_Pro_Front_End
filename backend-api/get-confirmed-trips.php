<?php

/**
 * Get Confirmed Trips API
 * Returns all confirmed trips that may need auto-completion
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-CSRF-Token');
header('Access-Control-Allow-Credentials: false');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
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

    // Get all confirmed trips that are not auto-completed yet
    $sql = "
        SELECT 
            t.trip_id,
            t.traveler_id,
            t.trip_status,
            t.created_at,
            t.start_location,
            t.end_location,
            t.total_cost,
            tr.name as traveler_name,
            tr.email as traveler_email
        FROM trips t
        LEFT JOIN travelers tr ON t.traveler_id = tr.traveler_id
        WHERE t.trip_status = 'confirmed'
        AND t.created_at >= DATE_SUB(NOW(), INTERVAL 10 MINUTE)
        ORDER BY t.created_at DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $trips = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Calculate time remaining for each trip
    $processedTrips = [];
    foreach ($trips as $trip) {
        $createdTime = new DateTime($trip['created_at']);
        $now = new DateTime();
        $timeDiff = $now->getTimestamp() - $createdTime->getTimestamp();
        $timeRemaining = max(0, 300 - $timeDiff); // 300 seconds = 5 minutes

        $trip['time_remaining_seconds'] = $timeRemaining;
        $trip['should_complete'] = $timeRemaining <= 0;

        $processedTrips[] = $trip;
    }

    echo json_encode([
        'success' => true,
        'trips' => $processedTrips,
        'count' => count($processedTrips),
        'message' => 'Confirmed trips retrieved successfully'
    ]);
} catch (PDOException $e) {
    error_log("Database error in get-confirmed-trips.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error occurred'
    ]);
} catch (Exception $e) {
    error_log("General error in get-confirmed-trips.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred while processing the request'
    ]);
}
