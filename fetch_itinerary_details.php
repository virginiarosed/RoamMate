<?php
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

if (isset($_GET['id'])) {
    $id = $_GET['id'];

    // Get the main itinerary details
    $stmt = $pdo->prepare("SELECT * FROM itineraries WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $itinerary = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($itinerary) {
        // Get the days and activities for this itinerary
        $stmt = $pdo->prepare("SELECT id, day_number, start_time, end_time, activity FROM itinerary_days WHERE itinerary_id = :id ORDER BY day_number, start_time");
        $stmt->execute([':id' => $id]);
        $daysData = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Group activities by day
        $days = [];
        foreach ($daysData as $row) {
            $days[$row['day_number']]['day_number'] = $row['day_number'];
            $days[$row['day_number']]['activities'][] = [
                'id' => $row['id'], // Add the id field
                'start_time' => date("g:i A", strtotime($row['start_time'])), // Convert to 12-hour format
                'end_time' => date("g:i A", strtotime($row['end_time'])),     // Convert to 12-hour format
                'activity' => $row['activity']
            ];
        }

        echo json_encode(['itinerary' => $itinerary, 'days' => array_values($days)]);
    } else {
        echo json_encode(['error' => 'Itinerary not found.']);
    }
}
?>