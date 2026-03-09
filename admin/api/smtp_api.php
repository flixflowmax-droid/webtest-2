<?php
require 'auth.php';
checkAdminSession();
header('Content-Type: application/json');

require_once '../../user/api/db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->prepare("SELECT sender_email, smtp_password, receiver_email FROM smtp_settings LIMIT 1");
        $stmt->execute();
        $settings = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$settings) {
            $settings = ['sender_email' => '', 'smtp_password' => '', 'receiver_email' => ''];
        }
        
        echo json_encode(['success' => true, 'data' => $settings]);
        exit;
    } catch (PDOException $e) {
        if ($e->getCode() == '42S02') { // Table not found
            echo json_encode(['success' => true, 'data' => ['sender_email' => '', 'smtp_password' => '', 'receiver_email' => '']]);
            exit;
        }
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        exit;
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $sender_email = $data['sender_email'] ?? '';
    $smtp_password = $data['smtp_password'] ?? '';
    $receiver_email = $data['receiver_email'] ?? '';
    
    try {
        // Check if row exists
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM smtp_settings");
        $stmt->execute();
        $count = $stmt->fetchColumn();
        
        if ($count > 0) {
            $stmt = $pdo->prepare("UPDATE smtp_settings SET sender_email = ?, smtp_password = ?, receiver_email = ? LIMIT 1");
            $stmt->execute([$sender_email, $smtp_password, $receiver_email]);
        } else {
            $stmt = $pdo->prepare("INSERT INTO smtp_settings (sender_email, smtp_password, receiver_email) VALUES (?, ?, ?)");
            $stmt->execute([$sender_email, $smtp_password, $receiver_email]);
        }
        
        echo json_encode(['success' => true, 'message' => 'SMTP Settings saved']);
        exit;
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        exit;
    }
}
?>
