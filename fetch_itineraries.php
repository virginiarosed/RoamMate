<?php
// Database connection
$host = 'localhost';
$dbname = 'roammate_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Fetch itineraries
$sql = "SELECT id, destination, formatted_duration FROM itineraries";
$stmt = $pdo->query($sql);
$itineraries = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Return JSON response
header('Content-Type: application/json');
echo json_encode($itineraries);
?>