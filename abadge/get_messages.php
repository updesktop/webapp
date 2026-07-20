<?php
include 'config.php';
header('Content-Type: application/json');

$user = trim($_GET['user'] ?? '');
$chat_with = trim($_GET['chat_with'] ?? '');

if (!$user || !$chat_with) {
    echo json_encode([]);
    exit;
}

$stmt = $pdo->prepare("SELECT id FROM users WHERE username IN (?, ?)");
$stmt->execute([$user, $chat_with]);
$ids = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
if (count($ids) !== 2) {
    echo json_encode([]);
    exit;
}
[$user_id, $other_id] = $ids;

// Get messages between the two users
$stmt = $pdo->prepare("
    SELECT m.message, m.created_at, u.username AS sender
    FROM messages m
    JOIN users u ON m.sender_id = u.id
    WHERE 
        (m.sender_id = ? AND m.receiver_id = ?)
        OR
        (m.sender_id = ? AND m.receiver_id = ?)
    ORDER BY m.created_at ASC
");
$stmt->execute([$user_id, $other_id, $other_id, $user_id]);
$messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Mark messages as read
$pdo->prepare("UPDATE messages SET is_read = 1 WHERE receiver_id = ? AND sender_id = ? AND is_read = 0")
    ->execute([$user_id, $other_id]);

echo json_encode($messages);
?>