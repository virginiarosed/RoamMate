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

// Get the date range from the request (if provided)
$start_date = isset($_GET['start_date']) ? $_GET['start_date'] : '';
$end_date = isset($_GET['end_date']) ? $_GET['end_date'] : '';

// Query to fetch data from requested_itineraries table
$sql = "SELECT * FROM requested_itineraries";
if ($start_date && $end_date) {
    $sql .= " WHERE start_date >= '$start_date' AND end_date <= '$end_date'";
}

$result = $conn->query($sql);

$itineraries = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $itinerary = [
            'id' => $row['id'],
            'client_name' => $row['client_name'],
            'destination' => $row['destination'],
            'start_date' => $row['start_date'],
            'end_date' => $row['end_date'],
            'lodging' => $row['lodging'],
            'formatted_duration' => $row['formatted_duration']
        ];
        
        // Fetch associated days and activities
        $day_sql = "SELECT * FROM requested_itinerary_days WHERE itinerary_id = " . $row['id'];
        $day_result = $conn->query($day_sql);
        $days = [];
        if ($day_result->num_rows > 0) {
            while ($day = $day_result->fetch_assoc()) {
                $days[] = [
                    'id' => $day['id'],
                    'day_number' => $day['day_number'],
                    'date' => $day['date'],
                    'day' => $day['day'],
                    'start_time' => $day['start_time'],
                    'end_time' => $day['end_time'],
                    'activity' => $day['activity']
                ];
            }
        }

        $itinerary['days'] = $days;
        $itineraries[] = $itinerary;
    }
}

$conn->close();

// Return itineraries as JSON
echo json_encode($itineraries);
?>
