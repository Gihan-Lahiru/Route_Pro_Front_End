<?php

/**
 * Mock Trips API with Descending Order Support
 * Returns mock driver and guide trip details sorted in descending order
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Get query parameters
$driver_id = isset($_GET['driver_id']) ? intval($_GET['driver_id']) : null;
$guide_id = isset($_GET['guide_id']) ? intval($_GET['guide_id']) : null;
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 20;

// Mock trip data sorted in descending order (newest first)
$mockTrips = [
    [
        'trip_id' => 178,
        'traveler_id' => 85,
        'driver_id' => 2,
        'guide_id' => 8,
        'trip_status' => 'completed',
        'created_at' => '2025-09-23 15:30:00',
        'date' => '2025-09-23 00:00:00',
        'start_time' => '2025-09-23 09:00:00',
        'start_location' => 'Colombo',
        'end_location' => 'Sigiriya',
        'distance_km' => 165,
        'total_cost' => 18500.00,
        'traveler_name' => 'John Smith',
        'traveler_email' => 'john@example.com',
        'driver_name' => 'Kasun Perera',
        'guide_name' => 'Nimal Fernando',
        'auto_completed' => true
    ],
    [
        'trip_id' => 177,
        'traveler_id' => 101,
        'driver_id' => 3,
        'guide_id' => 9,
        'trip_status' => 'confirmed',
        'created_at' => '2025-09-23 14:45:00',
        'date' => '2025-09-23 00:00:00',
        'start_time' => '2025-09-23 08:30:00',
        'start_location' => 'Kandy',
        'end_location' => 'Ella',
        'distance_km' => 95,
        'total_cost' => 12000.00,
        'traveler_name' => 'Sarah Wilson',
        'traveler_email' => 'sarah@example.com',
        'driver_name' => 'Ruwan Silva',
        'guide_name' => 'Chaminda Rajapakse',
        'auto_completed' => false
    ],
    [
        'trip_id' => 176,
        'traveler_id' => 102,
        'driver_id' => 1,
        'guide_id' => 7,
        'trip_status' => 'confirmed',
        'created_at' => '2025-09-23 13:20:00',
        'date' => '2025-09-24 00:00:00',
        'start_time' => '2025-09-24 07:00:00',
        'start_location' => 'Negombo',
        'end_location' => 'Anuradhapura',
        'distance_km' => 140,
        'total_cost' => 16800.00,
        'traveler_name' => 'Mike Johnson',
        'traveler_email' => 'mike@example.com',
        'driver_name' => 'Pradeep Kumar',
        'guide_name' => 'Lasantha Wijesinghe',
        'auto_completed' => false
    ],
    [
        'trip_id' => 175,
        'traveler_id' => 103,
        'driver_id' => 2,
        'guide_id' => 8,
        'trip_status' => 'completed',
        'created_at' => '2025-09-23 12:15:00',
        'date' => '2025-09-23 00:00:00',
        'start_time' => '2025-09-23 06:00:00',
        'start_location' => 'Galle',
        'end_location' => 'Jaffna',
        'distance_km' => 420,
        'total_cost' => 45000.00,
        'traveler_name' => 'Emma Brown',
        'traveler_email' => 'emma@example.com',
        'driver_name' => 'Kasun Perera',
        'guide_name' => 'Nimal Fernando',
        'auto_completed' => true
    ],
    [
        'trip_id' => 174,
        'traveler_id' => 104,
        'driver_id' => 4,
        'guide_id' => 10,
        'trip_status' => 'completed',
        'created_at' => '2025-09-23 11:00:00',
        'date' => '2025-09-23 00:00:00',
        'start_time' => '2025-09-23 05:30:00',
        'start_location' => 'Matara',
        'end_location' => 'Polonnaruwa',
        'distance_km' => 280,
        'total_cost' => 28500.00,
        'traveler_name' => 'David Lee',
        'traveler_email' => 'david@example.com',
        'driver_name' => 'Arjuna Bandara',
        'guide_name' => 'Sunil Jayawardena',
        'auto_completed' => false
    ]
];

// Filter trips based on driver_id or guide_id
$filteredTrips = array_filter($mockTrips, function ($trip) use ($driver_id, $guide_id) {
    if ($driver_id && $trip['driver_id'] != $driver_id) {
        return false;
    }
    if ($guide_id && $trip['guide_id'] != $guide_id) {
        return false;
    }
    return true;
});

// Apply limit
if ($limit > 0) {
    $filteredTrips = array_slice($filteredTrips, 0, $limit);
}

// Re-index array
$filteredTrips = array_values($filteredTrips);

// Add additional formatting
foreach ($filteredTrips as &$trip) {
    // Format dates
    $trip['formatted_date'] = date('M j, Y', strtotime($trip['date']));
    $trip['formatted_time'] = date('g:i A', strtotime($trip['start_time']));

    // Status formatting
    $trip['status_class'] = strtolower(str_replace('_', '-', $trip['trip_status']));
    $trip['status_display'] = ucwords(str_replace('_', ' ', $trip['trip_status']));

    // Distance formatting
    $trip['distance_display'] = $trip['distance_km'] . ' km';
}

$response = [
    'success' => true,
    'message' => 'Mock trips retrieved successfully (descending order)',
    'trips' => $filteredTrips,
    'total_trips' => count($filteredTrips),
    'filters_applied' => [
        'driver_id' => $driver_id,
        'guide_id' => $guide_id,
        'limit' => $limit
    ],
    'sort_order' => 'descending_by_trip_id',
    'note' => 'Mock data: Trips sorted by trip_id in descending order (newest first: #178, #177, #176...)'
];

echo json_encode($response);
