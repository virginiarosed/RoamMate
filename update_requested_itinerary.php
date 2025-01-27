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

// Get the incoming JSON data
$data = json_decode(file_get_contents('php://input'), true);

// Log incoming data (for debugging)
error_log(print_r($data, true));

// Check if necessary fields are provided
if (!isset($data['id'], $data['client_name'], $data['destination'], $data['start_date'], $data['end_date'], $data['lodging'], $data['formatted_duration'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Extract the updated itinerary data
$id = $data['id'];
$client_name = $data['client_name'];
$destination = $data['destination'];
$start_date = $data['start_date'];
$end_date = $data['end_date'];
$lodging = $data['lodging'];
$formatted_duration = $data['formatted_duration'];

// Update the requested_itineraries table
$update_sql = "UPDATE requested_itineraries 
               SET client_name = ?, destination = ?, start_date = ?, end_date = ?, lodging = ?, formatted_duration = ?
               WHERE id = ?";
$stmt = $conn->prepare($update_sql);
$stmt->bind_param("ssssssi", $client_name, $destination, $start_date, $end_date, $lodging, $formatted_duration, $id);

if ($stmt->execute()) {
    // Send success response
    echo json_encode(['success' => true]);
} else {
    // Send error response if itinerary update fails
    echo json_encode(['success' => false, 'message' => 'Failed to update itinerary']);
}

$stmt->close();
$conn->close();
?>
