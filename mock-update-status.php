<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid JSON input'
    ]);
    exit();
}

// Validate required fields
if (!isset($input['trip_id']) || !isset($input['status'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Missing required fields: trip_id and status'
    ]);
    exit();
}

$tripId = $input['trip_id'];
$status = $input['status'];
$autoCompleted = isset($input['auto_completed']) ? $input['auto_completed'] : false;
$completedAt = isset($input['completed_at']) ? $input['completed_at'] : date('Y-m-d H:i:s');

// Mock successful update
echo json_encode([
    'success' => true,
    'message' => "Trip #{$tripId} status updated to '{$status}' successfully",
    'trip_id' => $tripId,
    'status' => $status,
    'auto_completed' => $autoCompleted,
    'completed_at' => $completedAt,
    'note' => 'This is mock data for testing auto-completion functionality'
]);
