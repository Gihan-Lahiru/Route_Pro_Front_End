<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Database configuration - connect without specifying database
$servername = "localhost";
$username = "root";
$passwords = ["", "root", "password", "admin"];

foreach ($passwords as $password) {
    try {
        // Connect without specifying database first
        $pdo = new PDO("mysql:host=$servername", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Check available databases
        $stmt = $pdo->query("SHOW DATABASES");
        $databases = $stmt->fetchAll(PDO::FETCH_COLUMN);

        // Check if route_pro_db exists
        $routeDbExists = in_array('route_pro_db', $databases);

        if ($routeDbExists) {
            // Try to connect to route_pro_db
            $pdo_db = new PDO("mysql:host=$servername;dbname=route_pro_db", $username, $password);
            $pdo_db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Check if trips table exists
            $stmt = $pdo_db->query("SHOW TABLES LIKE 'trips'");
            $tripsTableExists = $stmt->rowCount() > 0;

            echo json_encode([
                'success' => true,
                'message' => 'Database connection successful',
                'password_used' => $password === "" ? "empty" : $password,
                'databases_found' => $databases,
                'route_pro_db_exists' => true,
                'trips_table_exists' => $tripsTableExists,
                'server_info' => $pdo->getAttribute(PDO::ATTR_SERVER_VERSION)
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Connected to MySQL but route_pro_db database not found',
                'password_used' => $password === "" ? "empty" : $password,
                'databases_found' => $databases,
                'route_pro_db_exists' => false
            ]);
        }
        exit();
    } catch (PDOException $e) {
        // Continue trying next password
        continue;
    }
}

// If we get here, none of the passwords worked
echo json_encode([
    'success' => false,
    'message' => 'Cannot connect to MySQL server with any password',
    'tried_passwords' => ['empty', 'root', 'password', 'admin']
]);
