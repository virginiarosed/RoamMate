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

// Get the raw POST data
$data = json_decode(file_get_contents('php://input'), true);

$day_id = isset($data['day_id']) ? intval($data['day_id']) : 0;
$itinerary_id = isset($data['itinerary_id']) ? intval($data['itinerary_id']) : 0;
$start_time = isset($data['start_time']) ? $conn->real_escape_string($data['start_time']) : '';
$end_time = isset($data['end_time']) ? $conn->real_escape_string($data['end_time']) : '';
$activity = isset($data['activity']) ? $conn->real_escape_string($data['activity']) : '';
$destination = isset($data['destination']) ? $conn->real_escape_string($data['destination']) : '';
$lodging = isset($data['lodging']) ? $conn->real_escape_string($data['lodging']) : '';

error_log("Received data: " . json_encode($data)); // Debugging statement

$response = array();

if ($day_id > 0 && $itinerary_id > 0 && $start_time && $end_time && $activity && $destination && $lodging) {
    // Fetch current details to compare
    $sql_fetch = "SELECT * FROM itinerary_days WHERE id = $day_id AND itinerary_id = $itinerary_id";
    $result = $conn->query($sql_fetch);
    if ($result->num_rows > 0) {
        $currentData = $result->fetch_assoc();
        $isEqual = 
            (trim($currentData['start_time']) === trim($start_time)) &&
            (trim($currentData['end_time']) === trim($end_time)) &&
            (trim($currentData['activity']) === trim($activity));

        $sql_fetch_itinerary = "SELECT * FROM itineraries WHERE id = $itinerary_id";
        $result_itinerary = $conn->query($sql_fetch_itinerary);
        if ($result_itinerary->num_rows > 0) {
            $currentItineraryData = $result_itinerary->fetch_assoc();
            $isEqual = $isEqual &&
                (trim($currentItineraryData['destination']) === trim($destination)) &&
                (trim($currentItineraryData['lodging']) === trim($lodging));
        }

        if ($isEqual) {
            error_log("No changes detected. Update aborted."); // Debugging statement
            $response['success'] = false;
            $response['error'] = 'No changes were made. Please modify the details before saving.';
            echo json_encode($response);
            $conn->close();
            return;
        }
    }

    $sql = "UPDATE itinerary_days SET start_time = '$start_time', end_time = '$end_time', activity = '$activity' WHERE id = $day_id AND itinerary_id = $itinerary_id";
    error_log("Executing SQL: $sql"); // Debugging statement
    
    if ($conn->query($sql) === TRUE) {
        $sql_itinerary = "UPDATE itineraries SET destination = '$destination', lodging = '$lodging' WHERE id = $itinerary_id";
        error_log("Executing SQL for itinerary: $sql_itinerary"); // Debugging statement
        
        if ($conn->query($sql_itinerary) === TRUE) {
            $response['success'] = true;
        } else {
            error_log("Error updating itinerary: " . $conn->error); // Debugging statement
            $response['success'] = false;
            $response['error'] = 'Error updating itinerary: ' . $conn->error;
        }
    } else {
        error_log("Error updating record: " . $conn->error); // Debugging statement
        $response['success'] = false;
        $response['error'] = 'Error updating record: ' . $conn->error;
    }
} else {
    error_log("Invalid input data"); // Debugging statement
    $response['success'] = false;
    $response['error'] = 'Invalid input data';
}

echo json_encode($response);

$conn->close();
?>
