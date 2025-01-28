<?php
header('Content-Type: application/json');

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "roammate_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
}

// Query to fetch the count of requested itineraries grouped by month
$sql = "SELECT MONTH(start_date) as month, COUNT(*) as count FROM requested_itineraries GROUP BY month ORDER BY month";
$result = $conn->query($sql);

$months = array_fill(0, 12, 0); // Initialize an array with 12 zeros

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $months[$row['month'] - 1] = $row['count']; // Fill the array with counts
    }

    echo json_encode(['counts' => $months]);
} else {
    echo json_encode(['error' => 'No data found']);
}

$conn->close();
?>
