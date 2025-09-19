<?php
try {
    $pdo = new PDO('mysql:host=localhost;dbname=route_pro_db', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Add registration_data column
    $pdo->exec('ALTER TABLE user_otps ADD COLUMN registration_data TEXT DEFAULT NULL');
    echo "Added registration_data column\n";

    // Make user_id nullable
    $pdo->exec('ALTER TABLE user_otps MODIFY COLUMN user_id INT NULL');
    echo "Made user_id column nullable\n";

    echo "Database updated successfully for secure registration!\n";
} catch (PDOException $e) {
    if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
        echo "registration_data column already exists\n";

        // Still try to make user_id nullable
        try {
            $pdo->exec('ALTER TABLE user_otps MODIFY COLUMN user_id INT NULL');
            echo "Made user_id column nullable\n";
        } catch (PDOException $e2) {
            echo "user_id column might already be nullable\n";
        }

        echo "Database schema is ready for secure registration!\n";
    } else {
        echo "Error: " . $e->getMessage() . "\n";
    }
}
