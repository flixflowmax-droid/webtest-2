<?php
require 'user/api/db_connect.php';

if ($pdo) {
    try {
        $sql = "
            CREATE TABLE IF NOT EXISTS orders (
                id VARCHAR(50) PRIMARY KEY,
                customer_name VARCHAR(255) NOT NULL,
                customer_phone VARCHAR(50) NOT NULL,
                division VARCHAR(100) NOT NULL,
                district VARCHAR(100) NOT NULL,
                city VARCHAR(255) NOT NULL,
                zip VARCHAR(50) NOT NULL,
                subtotal DECIMAL(10,2) NOT NULL,
                delivery_charge DECIMAL(10,2) NOT NULL,
                total DECIMAL(10,2) NOT NULL,
                items_json LONGTEXT NOT NULL,
                status VARCHAR(50) DEFAULT 'Processing',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ";
        $pdo->exec($sql);
        echo "Orders table created successfully.\n";
    } catch(PDOException $e) {
        echo "Error: " . $e->getMessage() . "\n";
    }
} else {
    echo "Database connection failed!\n";
}
?>
