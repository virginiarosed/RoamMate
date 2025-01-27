<?php
header('Content-Type: application/json');

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "roammate_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    error_log('Database connection failed: ' . $conn->connect_error); // Debugging statement
    die(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
}

// Get day_id and itinerary_id from the query parameters
$day_id = isset($_GET['day_id']) ? intval($_GET['day_id']) : 0;
$itinerary_id = isset($_GET['itinerary_id']) ? intval($_GET['itinerary_id']) : 0;

error_log("Received day_id: $day_id, itinerary_id: $itinerary_id"); // Debugging statement

if ($day_id > 0 && $itinerary_id > 0) {
    $sql = "SELECT * FROM requested_itinerary_days WHERE id = $day_id AND itinerary_id = $itinerary_id";
    error_log("Executing SQL: $sql"); // Debugging statement
    $result = $conn->query($sql);

    if ($result === false) {
        error_log("SQL error: " . $conn->error); // Debugging statement
        echo json_encode(['error' => 'SQL error: ' . $conn->error]);
    } elseif ($result->num_rows > 0) {
        $day = $result->fetch_assoc();
        error_log("Fetched day details: " . json_encode($day)); // Debugging statement
        echo json_encode($day);
    } else {
        error_log("No day found with the provided id"); // Debugging statement
        echo json_encode(['error' => 'No day found with the provided id']);
    }
} else {
    error_log("Invalid day_id or itinerary_id"); // Debugging statement
    echo json_encode(['error' => 'Invalid day_id or itinerary_id']);
}

$conn->close();
?>
