<?php
include 'config.php';
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$sender = trim($input['sender'] ?? '');
$receiver = trim($input['receiver'] ?? '');
$text = trim($input['text'] ?? '');

if (!$sender || !$receiver || !$text) {
    echo json_encode(['status' => 'error', 'message' => 'All fields are required']);
    exit;
}

// Get or create sender
$stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
$stmt->execute([$sender]);
$sender_id = $stmt->fetchColumn();
if (!$sender_id) {
    $pdo->prepare("INSERT INTO users (username) VALUES (?)")->execute([$sender]);
    $sender_id = $pdo->lastInsertId();
}

// Get or create receiver
$stmt->execute([$receiver]);
$receiver_id = $stmt->fetchColumn();
if (!$receiver_id) {
    $pdo->prepare("INSERT INTO users (username) VALUES (?)")->execute([$receiver]);
    $receiver_id = $pdo->lastInsertId();
}

// Save message
$pdo->prepare("INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)")
    ->execute([$sender_id, $receiver_id, $text]);

echo json_encode(['status' => 'success']);
?>