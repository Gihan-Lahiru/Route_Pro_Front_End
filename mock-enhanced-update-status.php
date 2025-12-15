<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Get request body
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
    exit();
}

// Validate required fields
if (empty($input['trip_id']) || empty($input['status'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'trip_id and status are required']);
    exit();
}

$tripId = intval($input['trip_id']);
$newStatus = trim($input['status']);
$isAutoCompleted = isset($input['auto_completed']) ? (bool)$input['auto_completed'] : false;
$completedAt = isset($input['completed_at']) ? $input['completed_at'] : date('Y-m-d H:i:s');

// Log the auto-completion request
error_log("Mock API: Trip #{$tripId} being updated to '{$newStatus}'" . ($isAutoCompleted ? " (AUTO-COMPLETED)" : ""));

// Mock successful response
$response = [
    'success' => true,
    'message' => $isAutoCompleted ?
        "Trip #{$tripId} auto-completed successfully (MOCK)" :
        "Trip status updated successfully (MOCK)",
    'trip' => [
        'trip_id' => $tripId,
        'trip_status' => $newStatus,
        'completed_at' => $completedAt,
        'auto_completed' => $isAutoCompleted,
        'previous_status' => 'confirmed',
        'new_status' => $newStatus,
        'start_location' => $tripId == 175 ? 'Galle' : 'Unknown',
        'end_location' => $tripId == 175 ? 'Jaffna' : 'Unknown'
    ],
    'auto_completed' => $isAutoCompleted,
    'note' => 'This is mock data for testing auto-completion functionality'
];

if ($newStatus === 'completed') {
    $response['duration_minutes'] = 5; // Mock 5 minute duration
    $response['message'] .= " - Trip completed after 5 minutes from booking time";
}

echo json_encode($response);
