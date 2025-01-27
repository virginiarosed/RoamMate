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

// Query to fetch data from requested_itineraries table
$sql = "SELECT * FROM requested_itineraries";
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
