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

// Retrieve main itinerary data
$client_name = $_POST['client-name'];
$destination = $_POST['destination'];
$start_date = $_POST['start_date'];
$end_date = $_POST['end_date'];
$lodging = $_POST['lodging'];

// Calculate duration
$start = new DateTime($start_date);
$end = new DateTime($end_date);
$duration_days = $start->diff($end)->days + 1; // Duration in days (inclusive of start day)
$nights = max(0, $duration_days - 1); // Nights are days - 1, but can't be negative

// Determine the proper wording for days and nights
$days_text = $duration_days === 1 ? "Day" : "Days";
$nights_text = $nights <= 1 ? "Night" : "Nights";

// Check if the duration is 1 Day and 0 Night, and change to "Roundtrip"
if ($duration_days === 1 && $nights === 0) {
    $formatted_duration = "Roundtrip";
} else {
    // Otherwise, use the regular days and nights format
    $formatted_duration = "$duration_days $days_text, $nights $nights_text";
}

// Insert data into the requested_itineraries table
$sql = "INSERT INTO requested_itineraries (client_name, destination, start_date, end_date, lodging, duration, formatted_duration) 
        VALUES ('$client_name', '$destination', '$start_date', '$end_date', '$lodging', '$duration_days', '$formatted_duration')";

if ($conn->query($sql) === TRUE) {
    $itinerary_id = $conn->insert_id;  // Get the inserted itinerary's ID

    // Insert days and activities if day data exists
    if (isset($_POST['day_number']) && isset($_POST['date']) && isset($_POST['day']) && isset($_POST['start_time']) && isset($_POST['end_time']) && isset($_POST['activity'])) {
        $day_numbers = $_POST['day_number']; // array
        $dates = $_POST['date']; // array
        $days = $_POST['day']; // array
        $start_times = $_POST['start_time']; // array
        $end_times = $_POST['end_time']; // array
        $activities = $_POST['activity']; // array

        // Insert each day's activity into the requested_itinerary_days table
        for ($i = 0; $i < count($day_numbers); $i++) {
            $day_number = $day_numbers[$i];
            $date = $dates[$i];  // The date should be in 'YYYY-MM-DD' format now
            $day = $days[$i];
            $start_time = $start_times[$i];
            $end_time = $end_times[$i];
            $activity = $activities[$i];

            // Prepare the query to insert the day data
            $sql_day = "INSERT INTO requested_itinerary_days (itinerary_id, day_number, date, day, start_time, end_time, activity) 
                        VALUES ('$itinerary_id', '$day_number', '$date', '$day', '$start_time', '$end_time', '$activity')";

            // Execute the query for each day
            if (!$conn->query($sql_day)) {
                // If there is an error in the day's insertion, output the error
                echo "Error: " . $sql_day . "<br>" . $conn->error;
                exit();
            }
        }
    }

    // Return success message as JSON
    echo json_encode([
        "status" => "success",
        "message" => "Itinerary has been successfully added!"
    ]);
} else {
    // Return error message if the main itinerary insertion fails
    echo json_encode([
        "status" => "error",
        "message" => "Error: " . $conn->error
    ]);
}

$conn->close();
?>
