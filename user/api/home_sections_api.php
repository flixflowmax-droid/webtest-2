<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

// Fetch all sections
$sections = [];
try {
    $stmt = $pdo->query("SELECT id, section_name FROM homepage_sections ORDER BY id ASC");
    $sections = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {}

// Fetch mappings
$mappings = [];
try {
    $stmt = $pdo->query("SELECT product_id, section_id FROM product_section_mapping");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $mappings[$row['section_id']][] = $row['product_id'];
    }
} catch (PDOException $e) {}

// Load all products metadata
$json_file = '../products.json';
$all_products = [];
if (file_exists($json_file)) {
    $all_products = json_decode(file_get_contents($json_file), true) ?: [];
}

// Convert product array to associative by id for easy lookup
$productDict = [];
foreach ($all_products as $p) {
    $productDict[$p['id']] = $p;
}

// Prepare sales data for Trending section (last 7 days)
$salesCount = [];
try {
    $stmt = $pdo->query("SELECT order_details FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $details = json_decode($row['order_details'], true) ?: [];
        foreach ($details as $item) {
            $pid = $item['id'] ?? ($item['product_id'] ?? null);
            $qty = intval($item['quantity'] ?? 1);
            if ($pid) {
                if (!isset($salesCount[$pid])) $salesCount[$pid] = 0;
                $salesCount[$pid] += $qty;
            }
        }
    }
} catch(PDOException $e) {}

// Determine overall top-selling product(s) across the store
$topSellingProductIds = [];
if (!empty($salesCount)) {
    arsort($salesCount); // Sort by highest sales
    $maxSales = reset($salesCount);
    // Get all products that share the max sales count
    foreach ($salesCount as $pid => $count) {
        if ($count == $maxSales && isset($productDict[$pid])) {
            $topSellingProductIds[] = $pid;
        }
    }
}

// Assemble data per section
$result = [];
foreach ($sections as $sec) {
    $secId = $sec['id'];
    $secName = $sec['section_name'];
    $mappedIds = $mappings[$secId] ?? [];
    
    $sectionProducts = [];
    
    // Standard tracking matching
    foreach ($mappedIds as $pid) {
        if (isset($productDict[$pid])) {
            $sectionProducts[] = $productDict[$pid];
        }
    }
    
    $result[] = [
        'id' => $secId,
        'name' => $secName,
        'products' => array_slice($sectionProducts, 0, 7) // Limit up to 7 side-by-side
    ];
}

echo json_encode(['success' => true, 'data' => $result]);
?>
