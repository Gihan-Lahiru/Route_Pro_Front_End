<?php

/**
 * Mock Rating Submission API
 * Simulates storing ratings in the rating_review table for testing
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-CSRF-Token');
header('Access-Control-Allow-Credentials: false');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    // Get request body
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        throw new Exception('Invalid JSON input');
    }

    // Validate required fields
    if (
        empty($input['trip_id']) ||
        empty($input['driver_rating']) ||
        empty($input['guide_rating'])
    ) {
        throw new Exception('trip_id, driver_rating, and guide_rating are required');
    }

    $tripId = intval($input['trip_id']);
    $driverRating = intval($input['driver_rating']);
    $guideRating = intval($input['guide_rating']);
    $driverComment = trim($input['driver_comment'] ?? '');
    $guideComment = trim($input['guide_comment'] ?? '');

    // Validate rating range (1-5)
    if ($driverRating < 1 || $driverRating > 5 || $guideRating < 1 || $guideRating > 5) {
        throw new Exception('Ratings must be between 1 and 5');
    }

    // Log the rating submission (in real implementation, this would go to database)
    error_log("Mock Rating Submission:");
    error_log("Trip ID: $tripId");
    error_log("Driver Rating: $driverRating ($driverComment)");
    error_log("Guide Rating: $guideRating ($guideComment)");

    // Simulate successful database insertion
    $mockRatingData = [
        [
            'rating_review_id' => rand(1000, 9999),
            'trip_id' => $tripId,
            'service_type' => 'driver',
            'rating' => $driverRating,
            'review_text' => $driverComment,
            'created_at' => date('Y-m-d H:i:s'),
            'driver_name' => 'Kamal Silva'
        ],
        [
            'rating_review_id' => rand(1000, 9999),
            'trip_id' => $tripId,
            'service_type' => 'guide',
            'rating' => $guideRating,
            'review_text' => $guideComment,
            'created_at' => date('Y-m-d H:i:s'),
            'guide_name' => 'Nimal Fernando'
        ]
    ];

    // Simulate a small delay like a real database operation
    usleep(500000); // 0.5 seconds

    echo json_encode([
        'success' => true,
        'message' => 'Rating submitted successfully (mock)',
        'ratings' => $mockRatingData,
        'trip_id' => $tripId,
        'note' => 'This is a mock API response. In production, ratings would be stored in the rating_review table.'
    ]);
} catch (Exception $e) {
    error_log("Error in mock submit-rating.php: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
