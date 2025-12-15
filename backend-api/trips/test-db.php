<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    $host = 'localhost';
    $dbname = 'route_pro_db';
    $username = 'root';
    $password = 'pubz';

    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Check existing users
    $stmt = $pdo->query("SELECT id, name, email, role FROM users LIMIT 10");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Check existing drivers table
    $stmt = $pdo->query("SELECT id, name FROM drivers LIMIT 5");
    $drivers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Check existing guides table  
    $stmt = $pdo->query("SELECT id, name FROM guides LIMIT 5");
    $guides = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Check existing trips
    $stmt = $pdo->query("SELECT COUNT(*) as trip_count FROM trips");
    $tripCount = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'message' => 'Database connection successful',
        'users' => $users,
        'drivers' => $drivers,
        'guides' => $guides,
        'trip_count' => $tripCount['trip_count']
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
