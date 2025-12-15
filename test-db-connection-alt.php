<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Database configuration - trying different password options
$servername = "localhost";
$username = "root";
$dbname = "route_pro_db";

// Common XAMPP passwords to try
$passwords = ["", "root", "password", "admin"];

foreach ($passwords as $password) {
    try {
        $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Test if trips table exists
        $stmt = $pdo->query("SHOW TABLES LIKE 'trips'");
        $tableExists = $stmt->rowCount() > 0;

        echo json_encode([
            'success' => true,
            'message' => 'Database connection successful',
            'password_used' => $password === "" ? "empty" : $password,
            'trips_table_exists' => $tableExists,
            'server_info' => $pdo->getAttribute(PDO::ATTR_SERVER_VERSION)
        ]);
        exit();
    } catch (PDOException $e) {
        // Continue trying next password
        continue;
    }
}

// If we get here, none of the passwords worked
echo json_encode([
    'success' => false,
    'message' => 'Database connection failed with all attempted passwords',
    'tried_passwords' => ['empty', 'root', 'password', 'admin']
]);
