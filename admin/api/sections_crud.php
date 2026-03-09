<?php
require 'auth.php';
checkAdminSession();
header('Content-Type: application/json');
require_once '../../user/api/db_connect.php';

$action = $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($action === 'list') {
        try {
            $stmt = $pdo->prepare("SELECT id, section_name, created_at FROM homepage_sections ORDER BY created_at ASC");
            $stmt->execute();
            $sections = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['success' => true, 'data' => $sections]);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        exit;
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if ($action === 'add') {
        $name = $data['section_name'] ?? '';
        try {
            $stmt = $pdo->prepare("INSERT INTO homepage_sections (section_name) VALUES (?)");
            $stmt->execute([$name]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        exit;
    }
    
    if ($action === 'update') {
        $id = $data['id'] ?? '';
        $name = $data['section_name'] ?? '';
        try {
            $stmt = $pdo->prepare("UPDATE homepage_sections SET section_name = ? WHERE id = ?");
            $stmt->execute([$name, $id]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        exit;
    }
    
    if ($action === 'delete') {
        $id = $data['id'] ?? '';
        try {
            $stmt = $pdo->prepare("DELETE FROM homepage_sections WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        exit;
    }
}
?>
