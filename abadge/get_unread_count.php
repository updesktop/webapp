<?php
include 'config.php';
header('Content-Type: application/json');

$user = trim($_GET['user'] ?? '');
if (!$user) {
    echo json_encode(['unread' => 0]);
    exit;
}

$stmt = $pdo->prepare("
    SELECT COUNT(*) AS total
    FROM messages m
    JOIN users u ON m.receiver_id = u.id
    WHERE u.username = ? AND m.is_read = 0
");
$stmt->execute([$user]);
$count = (int)$stmt->fetchColumn();

echo json_encode(['unread' => $count]);
?>