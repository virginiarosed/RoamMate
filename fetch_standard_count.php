<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "roammate_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Query to get the count of rows in the 'itineraries' table
$query = "SELECT COUNT(id) AS total_itineraries FROM itineraries";
$result = mysqli_query($conn, $query);

// Check if the query was successful
if ($result) {
    $row = mysqli_fetch_assoc($result);
    $count = $row['total_itineraries'];
    echo json_encode(['count' => $count]); // Send the count as JSON
} else {
    // Handle query error
    echo json_encode(['error' => 'Failed to fetch data']);
}

// Close the database connection
mysqli_close($conn);
?>
