<?php

/**
 * Mock Traveler Trips API
 * Provides sample trip data for testing purposes
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

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $traveler_id = isset($_GET['traveler_id']) ? intval($_GET['traveler_id']) : null;
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 100;

    if (!$traveler_id) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Traveler ID is required'
        ]);
        exit();
    }

    // Mock trip data with different statuses
    $mockTrips = [
        [
            'trip_id' => 125,
            'traveler_id' => $traveler_id,
            'driver_id' => 2,
            'guide_id' => 3,
            'route_id' => 1,
            'trip_date' => '2025-09-25',
            'start_time' => '09:00:00',
            'trip_status' => 'confirmed',
            'created_at' => '2025-09-23 10:00:00',
            'route_cost' => '1500.00',
            'driver_cost' => '800.00',
            'guide_cost' => '600.00',
            'system_fee' => '100.00',
            'total_cost' => '3000.00',
            'special_requests' => 'Pick up from hotel',
            'start_location' => 'Colombo',
            'end_location' => 'Kandy',
            'auto_completed' => 0,
            'started_at' => null,
            'completed_at' => null,
            'actual_duration_minutes' => null,
            'has_rating' => 0,
            'traveler_name' => 'John Traveler',
            'traveler_email' => 'john@example.com',
            'traveler_phone' => '+94771234567',
            'driver_name' => 'Kamal Silva',
            'driver_email' => 'kamal@example.com',
            'driver_phone' => '+94777654321',
            'driver_vehicle_type' => 'Car',
            'driver_capacity' => 4,
            'driver_location' => 'Colombo',
            'guide_name' => 'Nimal Fernando',
            'guide_email' => 'nimal@example.com',
            'guide_phone' => '+94778888888',
            'guide_languages' => 'English, Sinhala',
            'guide_experience' => 5,
            'guide_location' => 'Kandy',
            'route_start' => 'Colombo',
            'route_end' => 'Kandy',
            'distance_km' => 115.5,
            'estimated_time' => '3 hours'
        ],
        [
            'trip_id' => 124,
            'traveler_id' => $traveler_id,
            'driver_id' => 1,
            'guide_id' => null,
            'route_id' => 2,
            'trip_date' => '2025-09-20',
            'start_time' => '08:00:00',
            'trip_status' => 'completed',
            'created_at' => '2025-09-18 15:30:00',
            'route_cost' => '2000.00',
            'driver_cost' => '1200.00',
            'guide_cost' => '0.00',
            'system_fee' => '150.00',
            'total_cost' => '3350.00',
            'special_requests' => null,
            'start_location' => 'Galle',
            'end_location' => 'Mirissa',
            'auto_completed' => 1,
            'started_at' => '2025-09-20 08:00:00',
            'completed_at' => '2025-09-20 12:30:00',
            'actual_duration_minutes' => 270,
            'has_rating' => 0,
            'traveler_name' => 'John Traveler',
            'traveler_email' => 'john@example.com',
            'traveler_phone' => '+94771234567',
            'driver_name' => 'Pradeep Wickrema',
            'driver_email' => 'pradeep@example.com',
            'driver_phone' => '+94779999999',
            'driver_vehicle_type' => 'Van',
            'driver_capacity' => 8,
            'driver_location' => 'Galle',
            'guide_name' => 'Nimal Fernando',
            'guide_email' => 'nimal@example.com',
            'guide_phone' => '+94778888888',
            'guide_languages' => 'English, Sinhala',
            'guide_experience' => 5,
            'guide_location' => 'Kandy',
            'route_start' => 'Galle',
            'route_end' => 'Mirissa',
            'distance_km' => 25.3,
            'estimated_time' => '45 minutes'
        ],
        [
            'trip_id' => 122,
            'traveler_id' => $traveler_id,
            'driver_id' => 2,
            'guide_id' => 1,
            'route_id' => 4,
            'trip_date' => '2025-09-15',
            'start_time' => '07:30:00',
            'trip_status' => 'cancelled',
            'created_at' => '2025-09-10 09:00:00',
            'route_cost' => '2500.00',
            'driver_cost' => '1000.00',
            'guide_cost' => '800.00',
            'system_fee' => '120.00',
            'total_cost' => '4420.00',
            'special_requests' => 'Early morning departure',
            'start_location' => 'Ella',
            'end_location' => 'Horton Plains',
            'auto_completed' => 0,
            'started_at' => null,
            'completed_at' => null,
            'actual_duration_minutes' => null,
            'has_rating' => 0,
            'traveler_name' => 'John Traveler',
            'traveler_email' => 'john@example.com',
            'traveler_phone' => '+94771234567',
            'driver_name' => 'Kamal Silva',
            'driver_email' => 'kamal@example.com',
            'driver_phone' => '+94777654321',
            'driver_vehicle_type' => 'Car',
            'driver_capacity' => 4,
            'driver_location' => 'Ella',
            'guide_name' => 'Chamara Wijesinghe',
            'guide_email' => 'chamara@example.com',
            'guide_phone' => '+94774444444',
            'guide_languages' => 'English, French',
            'guide_experience' => 12,
            'guide_location' => 'Ella',
            'route_start' => 'Ella',
            'route_end' => 'Horton Plains',
            'distance_km' => 35.8,
            'estimated_time' => '2 hours'
        ],
        [
            'trip_id' => 121,
            'traveler_id' => $traveler_id,
            'driver_id' => 1,
            'guide_id' => 3,
            'route_id' => 5,
            'trip_date' => '2025-09-10',
            'start_time' => '10:00:00',
            'trip_status' => 'completed',
            'created_at' => '2025-09-05 14:00:00',
            'route_cost' => '1800.00',
            'driver_cost' => '900.00',
            'guide_cost' => '700.00',
            'system_fee' => '130.00',
            'total_cost' => '3530.00',
            'special_requests' => 'Temple visits requested',
            'start_location' => 'Anuradhapura',
            'end_location' => 'Polonnaruwa',
            'auto_completed' => 1,
            'started_at' => '2025-09-10 10:00:00',
            'completed_at' => '2025-09-10 16:30:00',
            'actual_duration_minutes' => 390,
            'has_rating' => 1,
            'traveler_name' => 'John Traveler',
            'traveler_email' => 'john@example.com',
            'traveler_phone' => '+94771234567',
            'driver_name' => 'Pradeep Wickrema',
            'driver_email' => 'pradeep@example.com',
            'driver_phone' => '+94779999999',
            'driver_vehicle_type' => 'Van',
            'driver_capacity' => 8,
            'driver_location' => 'Anuradhapura',
            'guide_name' => 'Nimal Fernando',
            'guide_email' => 'nimal@example.com',
            'guide_phone' => '+94778888888',
            'guide_languages' => 'English, Sinhala',
            'guide_experience' => 5,
            'guide_location' => 'Polonnaruwa',
            'route_start' => 'Anuradhapura',
            'route_end' => 'Polonnaruwa',
            'distance_km' => 104.7,
            'estimated_time' => '2.5 hours'
        ]
    ];

    // Apply limit
    $trips = array_slice($mockTrips, 0, $limit);

    // Calculate statistics
    $stats = [
        'confirmed' => 0,
        'completed' => 0,
        'cancelled' => 0
    ];

    foreach ($trips as $trip) {
        if (isset($stats[$trip['trip_status']])) {
            $stats[$trip['trip_status']]++;
        }
    }

    $response = [
        'success' => true,
        'message' => 'Mock trips retrieved successfully',
        'trips' => $trips,
        'total_trips' => count($trips),
        'traveler_id' => $traveler_id,
        'statistics' => $stats,
        'filters_applied' => [
            'traveler_id' => $traveler_id,
            'limit' => $limit
        ],
        'sort_order' => 'descending_by_trip_id',
        'note' => 'This is mock data for testing purposes'
    ];

    echo json_encode($response);
} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Mock trip cancellation
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

    echo json_encode([
        'success' => true,
        'message' => 'Trip cancelled successfully (mock)',
        'trip_id' => $trip_id
    ]);
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
}
