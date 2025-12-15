<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Mock confirmed trips data for testing auto-completion
$mockTrips = [
    [
        'trip_id' => 175,
        'traveler_id' => 101,
        'driver_id' => 201,
        'guide_id' => 301,
        'trip_status' => 'confirmed',
        'created_at' => date('Y-m-d H:i:s', strtotime('-6 minutes')), // 6 minutes ago (should auto-complete immediately)
        'auto_completed' => false,
        'start_location' => 'Galle',
        'end_location' => 'Jaffna',
        'distance_km' => 420
    ],
    [
        'trip_id' => 2,
        'traveler_id' => 102,
        'driver_id' => 202,
        'guide_id' => 302,
        'trip_status' => 'confirmed',
        'created_at' => date('Y-m-d H:i:s', strtotime('-3 minutes')), // 3 minutes ago (2 more minutes to go)
        'auto_completed' => false,
        'start_location' => 'Colombo',
        'end_location' => 'Kandy',
        'distance_km' => 115
    ],
    [
        'trip_id' => 3,
        'traveler_id' => 103,
        'driver_id' => 203,
        'guide_id' => 303,
        'trip_status' => 'confirmed',
        'created_at' => date('Y-m-d H:i:s', strtotime('-1 minute')), // 1 minute ago (4 more minutes to go)
        'auto_completed' => false,
        'start_location' => 'Negombo',
        'end_location' => 'Sigiriya',
        'distance_km' => 165
    ]
];

echo json_encode([
    'success' => true,
    'message' => 'Mock confirmed trips retrieved successfully',
    'trips' => $mockTrips,
    'total_trips' => count($mockTrips),
    'note' => 'This is mock data for testing auto-completion functionality'
]);
