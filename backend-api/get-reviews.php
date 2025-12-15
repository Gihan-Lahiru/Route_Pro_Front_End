<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3002');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "route_pro_db";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get the user_id from query parameters
    $user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : null;
    $role = isset($_GET['role']) ? $_GET['role'] : 'driver'; // default to driver

    if (!$user_id) {
        echo json_encode([
            'success' => false,
            'message' => 'User ID is required'
        ]);
        exit;
    }

    // Query to get reviews for the user
    $sql = "SELECT 
                rr.review_id,
                rr.rating,
                rr.review_text,
                b.created_at as review_date,
                u.name as reviewer_name
            FROM ratings_review rr
            JOIN booking b ON rr.booking_id = b.booking_id
            JOIN users u ON b.user_id = u.id
            WHERE rr.reviewed_user_id = :user_id
            ORDER BY b.created_at DESC
            LIMIT 10";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->execute();

    $reviews = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $reviews[] = [
            'review_id' => $row['review_id'],
            'rating' => (float)$row['rating'],
            'user_name' => $row['reviewer_name'],
            'date' => date('Y-m-d', strtotime($row['review_date'])),
            'text' => $row['review_text']
        ];
    }

    // Calculate average rating
    $avgSql = "SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews 
               FROM ratings_review 
               WHERE reviewed_user_id = :user_id";
    $avgStmt = $conn->prepare($avgSql);
    $avgStmt->bindParam(':user_id', $user_id);
    $avgStmt->execute();
    $avgResult = $avgStmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'reviews' => $reviews,
        'average_rating' => $avgResult['avg_rating'] ? round((float)$avgResult['avg_rating'], 1) : 0,
        'total_reviews' => (int)$avgResult['total_reviews']
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}

$conn = null;
