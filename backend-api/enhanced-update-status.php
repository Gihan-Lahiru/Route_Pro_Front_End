<?php

/**
 * Enhanced Update Trip Status API
 * Handles manual and automatic trip status updates with timestamps
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-CSRF-Token');
header('Access-Control-Allow-Credentials: false');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow PUT and POST requests
if (!in_array($_SERVER['REQUEST_METHOD'], ['PUT', 'POST'])) {
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
    if (empty($input['trip_id']) || empty($input['status'])) {
        throw new Exception('trip_id and status are required');
    }

    $tripId = intval($input['trip_id']);
    $newStatus = trim($input['status']);
    $isAutoCompleted = isset($input['auto_completed']) ? (bool)$input['auto_completed'] : false;
    $completedAt = isset($input['completed_at']) ? $input['completed_at'] : null;

    // Validate status
    $validStatuses = ['not_started', 'confirmed', 'in_progress', 'completed', 'cancelled'];
    if (!in_array($newStatus, $validStatuses)) {
        throw new Exception('Invalid status provided');
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

    // Check if trip exists and get current status
    $checkSql = "SELECT trip_status, traveler_id, start_location, end_location FROM trips WHERE trip_id = ?";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute([$tripId]);
    $trip = $checkStmt->fetch(PDO::FETCH_ASSOC);

    if (!$trip) {
        throw new Exception('Trip not found');
    }

    $currentStatus = $trip['trip_status'];
    $travelerId = $trip['traveler_id'];

    // Prepare update fields
    $updateFields = ['trip_status = ?'];
    $updateParams = [$newStatus];

    // Add timestamp tracking based on status
    if ($newStatus === 'in_progress' && $currentStatus !== 'in_progress') {
        // Trip is being started
        $updateFields[] = 'started_at = NOW()';
    } elseif ($newStatus === 'completed' && $currentStatus !== 'completed') {
        // Trip is being completed
        if ($completedAt) {
            $updateFields[] = 'completed_at = ?';
            $updateParams[] = $completedAt;
        } else {
            $updateFields[] = 'completed_at = NOW()';
        }

        // Calculate duration if we have started_at
        $updateFields[] = 'actual_duration_minutes = TIMESTAMPDIFF(MINUTE, started_at, completed_at)';
    }

    // Add auto-completion flag if applicable
    if ($isAutoCompleted) {
        $updateFields[] = 'auto_completed = 1';
    }

    // Update trip status
    $updateSql = "UPDATE trips SET " . implode(', ', $updateFields) . " WHERE trip_id = ?";
    $updateParams[] = $tripId;

    $updateStmt = $pdo->prepare($updateSql);
    $updateStmt->execute($updateParams);

    if ($updateStmt->rowCount() === 0) {
        throw new Exception('Failed to update trip status');
    }

    // Create notification for trip completion
    if ($newStatus === 'completed') {
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

        $notificationTitle = $isAutoCompleted ?
            'Trip Auto-Completed - Rate Your Experience' :
            'Trip Completed - Rate Your Experience';

        $notificationMessage = sprintf(
            'Your trip from %s to %s has been %s. Please rate your driver and guide.',
            $trip['start_location'],
            $trip['end_location'],
            $isAutoCompleted ? 'automatically completed' : 'completed'
        );

        $notificationStmt = $pdo->prepare($notificationSql);
        $notificationStmt->execute([
            $travelerId,
            'trip_completed',
            $notificationTitle,
            $notificationMessage,
            $tripId,
            'high'
        ]);
    }

    // Commit transaction
    $pdo->commit();

    // Get updated trip data
    $getUpdatedSql = "
        SELECT 
            t.*,
            TIMESTAMPDIFF(MINUTE, t.started_at, t.completed_at) as calculated_duration
        FROM trips t 
        WHERE t.trip_id = ?
    ";
    $getUpdatedStmt = $pdo->prepare($getUpdatedSql);
    $getUpdatedStmt->execute([$tripId]);
    $updatedTrip = $getUpdatedStmt->fetch(PDO::FETCH_ASSOC);

    $response = [
        'success' => true,
        'message' => $isAutoCompleted ?
            'Trip auto-completed successfully' :
            'Trip status updated successfully',
        'trip' => $updatedTrip,
        'previous_status' => $currentStatus,
        'new_status' => $newStatus,
        'auto_completed' => $isAutoCompleted
    ];

    if ($newStatus === 'completed' && $updatedTrip['calculated_duration']) {
        $response['duration_minutes'] = $updatedTrip['calculated_duration'];
    }

    echo json_encode($response);
} catch (PDOException $e) {
    // Rollback transaction on database error
    if (isset($pdo)) {
        $pdo->rollBack();
    }

    error_log("Database error in enhanced-update-status.php: " . $e->getMessage());
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

    error_log("General error in enhanced-update-status.php: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
