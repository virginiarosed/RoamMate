<?php
$host = 'localhost'; // Database host
$dbname = 'roammate_db'; // Database name
$username = 'root'; // Your database username
$password = ''; // Your database password

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data and cast to integers
    $destination = $_POST['destination'];
    $duration_days = (int) $_POST['duration_days']; // Cast to integer
    $duration_nights = (int) $_POST['duration_nights']; // Cast to integer
    $lodging = $_POST['lodging'];

    // Check if the duration is 1 Day and 0 Night, and change to "Roundtrip"
    if ($duration_days === 1 && $duration_nights === 0) {
        $formatted_duration = "Roundtrip";
    } else {
        // Otherwise, use the regular days and nights format without spaces
        $formatted_duration = "$duration_days" . "D" . "$duration_nights" . "N";
    }

    // Insert itinerary into the itineraries table
    $sql = "INSERT INTO itineraries (destination, duration_days, duration_nights, lodging, formatted_duration) 
            VALUES (:destination, :duration_days, :duration_nights, :lodging, :formatted_duration)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':destination' => $destination,
        ':duration_days' => $duration_days,
        ':duration_nights' => $duration_nights,
        ':lodging' => $lodging,
        ':formatted_duration' => $formatted_duration // Store the formatted duration
    ]);

    // Get the last inserted itinerary ID
    $itinerary_id = $pdo->lastInsertId();

    // Insert days and activities into the itinerary_days table
    for ($day_number = 1; $day_number <= $duration_days; $day_number++) {
        // Get the time ranges and activities for this day
        $time_ranges = isset($_POST['time_range'][$day_number]) ? $_POST['time_range'][$day_number] : [];
        $activities = isset($_POST['activity'][$day_number]) ? $_POST['activity'][$day_number] : [];

        // Check if there are time ranges for this day
        if (!empty($time_ranges) && !empty($activities)) {
            for ($i = 0; $i < count($time_ranges); $i++) {
                // Make sure there is a corresponding activity for each time range
                if (isset($time_ranges[$i * 2]) && isset($time_ranges[($i * 2) + 1]) && isset($activities[$i])) {
                    $start_time = $time_ranges[$i * 2];
                    $end_time = $time_ranges[($i * 2) + 1];
                    $activity = $activities[$i];

                    // Insert the day's details into the itinerary_days table
                    $sql = "INSERT INTO itinerary_days (itinerary_id, day_number, start_time, end_time, activity) 
                            VALUES (:itinerary_id, :day_number, :start_time, :end_time, :activity)";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([
                        ':itinerary_id' => $itinerary_id,
                        ':day_number' => $day_number,
                        ':start_time' => $start_time,
                        ':end_time' => $end_time,
                        ':activity' => $activity
                    ]);
                }
            }
        }
    }

    // Redirect to a success page or show a success message
    header("Location: rm_standard.html");
    exit();
}
?>
