<?php
// Connect to the database
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "roammate_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the email from the request
$email = isset($_POST['email']) ? trim($_POST['email']) : '';

// Check if the email exists
$email_check_query = "SELECT * FROM admin_users WHERE email = ?";
$stmt = $conn->prepare($email_check_query);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

// Respond with a JSON message
if ($result->num_rows > 0) {
    echo json_encode(['exists' => true]);
} else {
    echo json_encode(['exists' => false]);
}

// Close the connection
$stmt->close();
$conn->close();
?>
