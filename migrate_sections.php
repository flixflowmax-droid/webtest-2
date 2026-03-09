<?php
require_once 'user/api/db_connect.php';

$sql = "
CREATE TABLE IF NOT EXISTS `homepage_sections` (
    `id` int AUTO_INCREMENT PRIMARY KEY,
    `section_name` varchar(100) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `product_section_mapping` (
    `product_id` varchar(50) NOT NULL,
    `section_id` int NOT NULL,
    PRIMARY KEY (`product_id`, `section_id`),
    FOREIGN KEY (`section_id`) REFERENCES homepage_sections(`id`) ON DELETE CASCADE
);

INSERT INTO `homepage_sections` (`section_name`) 
SELECT 'Curated Shop' WHERE NOT EXISTS (SELECT 1 FROM homepage_sections WHERE section_name = 'Curated Shop');
INSERT INTO `homepage_sections` (`section_name`) 
SELECT 'New Arrivals' WHERE NOT EXISTS (SELECT 1 FROM homepage_sections WHERE section_name = 'New Arrivals');
INSERT INTO `homepage_sections` (`section_name`) 
SELECT 'Trending' WHERE NOT EXISTS (SELECT 1 FROM homepage_sections WHERE section_name = 'Trending');
INSERT INTO `homepage_sections` (`section_name`) 
SELECT 'Recommended For You' WHERE NOT EXISTS (SELECT 1 FROM homepage_sections WHERE section_name = 'Recommended For You');
";

try {
    $pdo->exec($sql);
    echo "Migration completed successfully.";
} catch (PDOException $e) {
    echo "Migration failed: " . $e->getMessage();
}
?>
