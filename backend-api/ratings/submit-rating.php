<?php

/**
 * Submit Trip Rating API
 * Handles rating submissions for drivers and guides
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

    // Database connection
    $host = 'localhost';
    $dbname = 'route_pro_db';
    $username = 'root';
    $password = '';

    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Start transaction
    $pdo->beginTransaction();

    // Check if trip exists and is completed
    $checkSql = "
        SELECT 
            t.trip_status, 
            t.traveler_id, 
            t.driver_id, 
            t.guide_id,
            t.start_location,
            t.end_location
        FROM trips t 
        WHERE t.trip_id = ?
    ";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute([$tripId]);
    $trip = $checkStmt->fetch(PDO::FETCH_ASSOC);

    if (!$trip) {
        throw new Exception('Trip not found');
    }

    if ($trip['trip_status'] !== 'completed') {
        throw new Exception('Trip must be completed before rating');
    }

    // Check if rating already exists for this trip
    $existingRatingSql = "SELECT rating_review_id FROM rating_review WHERE trip_id = ?";
    $existingStmt = $pdo->prepare($existingRatingSql);
    $existingStmt->execute([$tripId]);

    if ($existingStmt->fetch()) {
        throw new Exception('Rating already exists for this trip');
    }

    // Insert driver rating into rating_review table
    if ($trip['driver_id']) {
        $insertDriverRatingSql = "
            INSERT INTO rating_review (
                trip_id,
                traveler_id,
                service_provider_id,
                service_type,
                rating,
                review_text,
                created_at
            ) VALUES (?, ?, ?, 'driver', ?, ?, NOW())
        ";

        $insertDriverStmt = $pdo->prepare($insertDriverRatingSql);
        $insertDriverStmt->execute([
            $tripId,
            $trip['traveler_id'],
            $trip['driver_id'],
            $driverRating,
            $driverComment
        ]);
    }

    // Insert guide rating into rating_review table
    if ($trip['guide_id']) {
        $insertGuideRatingSql = "
            INSERT INTO rating_review (
                trip_id,
                traveler_id,
                service_provider_id,
                service_type,
                rating,
                review_text,
                created_at
            ) VALUES (?, ?, ?, 'guide', ?, ?, NOW())
        ";

        $insertGuideStmt = $pdo->prepare($insertGuideRatingSql);
        $insertGuideStmt->execute([
            $tripId,
            $trip['traveler_id'],
            $trip['guide_id'],
            $guideRating,
            $guideComment
        ]);
    }

    // Update trip to mark as rated
    $updateTripSql = "UPDATE trips SET has_rating = 1 WHERE trip_id = ?";
    $updateTripStmt = $pdo->prepare($updateTripSql);
    $updateTripStmt->execute([$tripId]);

    // Update average ratings for driver
    if ($trip['driver_id']) {
        $updateDriverSql = "
            UPDATE drivers 
            SET 
                rating = (
                    SELECT AVG(rating) 
                    FROM rating_review 
                    WHERE service_provider_id = ? AND service_type = 'driver'
                )
            WHERE id = ?
        ";
        $updateDriverStmt = $pdo->prepare($updateDriverSql);
        $updateDriverStmt->execute([$trip['driver_id'], $trip['driver_id']]);
    }

    // Update average ratings for guide
    if ($trip['guide_id']) {
        $updateGuideSql = "
            UPDATE guides 
            SET 
                rating = (
                    SELECT AVG(rating) 
                    FROM rating_review 
                    WHERE service_provider_id = ? AND service_type = 'guide'
                )
            WHERE id = ?
        ";
        $updateGuideStmt = $pdo->prepare($updateGuideSql);
        $updateGuideStmt->execute([$trip['guide_id'], $trip['guide_id']]);
    }

    // Create notification for successful rating
    $notificationSql = "
        INSERT INTO notifications (
            user_id, 
            type, 
            title, 
            message, 
            trip_id, 
            priority, 
            created_at
        ) VALUES (?, ?, ?, ?, ?, ?, NOW())
    ";

    $notificationMessage = sprintf(
        'Thank you for rating your trip from %s to %s! Your feedback helps us improve our service.',
        $trip['start_location'],
        $trip['end_location']
    );

    $notificationStmt = $pdo->prepare($notificationSql);
    $notificationStmt->execute([
        $trip['traveler_id'],
        'rating_submitted',
        'Rating Submitted Successfully',
        $notificationMessage,
        $tripId,
        'low'
    ]);

    // Commit transaction
    $pdo->commit();

    // Get the inserted rating data from rating_review table
    $getRatingSql = "
        SELECT 
            rr.*,
            u_driver.name as driver_name,
            u_guide.name as guide_name
        FROM rating_review rr
        LEFT JOIN drivers d ON rr.service_provider_id = d.id AND rr.service_type = 'driver'
        LEFT JOIN users u_driver ON d.user_id = u_driver.id
        LEFT JOIN guides g ON rr.service_provider_id = g.id AND rr.service_type = 'guide'
        LEFT JOIN users u_guide ON g.user_id = u_guide.id
        WHERE rr.trip_id = ?
        ORDER BY rr.rating_review_id DESC
        LIMIT 2
    ";
    $getRatingStmt = $pdo->prepare($getRatingSql);
    $getRatingStmt->execute([$tripId]);
    $ratingData = $getRatingStmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'message' => 'Rating submitted successfully',
        'ratings' => $ratingData,
        'trip_id' => $tripId
    ]);
} catch (PDOException $e) {
    // Rollback transaction on database error
    if (isset($pdo)) {
        $pdo->rollBack();
    }

    error_log("Database error in submit-rating.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error occurred'
    ]);
} catch (Exception $e) {
    // Rollback transaction on general error
    if (isset($pdo)) {
        $pdo->rollBack();
    }

    error_log("General error in submit-rating.php: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
