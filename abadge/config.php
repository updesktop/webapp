<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

$con=0;
if($con==0){
    define('DB_HOST', 'localhost');      // your host
    define('DB_NAME', 'abadge_db');        				// your DB name
    define('DB_USER', 'root');                  // your username
    define('DB_PASS', '');       // your password
}else{
    define('DB_HOST', 'sql108.infinityfree.com');      // your host
    define('DB_NAME', 'if0_42294762_jmsg');        				// your DB name
    define('DB_USER', 'if0_42294762');                  // your username
    define('DB_PASS', 'Vw6smpLccM');       // your password
}

try {
    $pdo = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME.";charset=utf8mb4", DB_USER, DB_PASS, [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
} catch(Exception $e) {
    echo json_encode(['error'=>'DB fail: '.$e->getMessage()]); exit;
}
?>