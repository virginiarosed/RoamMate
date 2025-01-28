<?php
// Database connection details
$servername = "localhost"; // Replace with your database server (e.g., "127.0.0.1" or "localhost")
$username = "root"; // Replace with your database username
$password = ""; // Replace with your database password
$dbname = "roammate_db"; // Replace with your database name

// Create a new database connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'];
    
    // Prepare a statement to check if the email exists in the database
    $stmt = $conn->prepare("SELECT email FROM admin_users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    // If the email exists, return an error message
    if ($stmt->num_rows > 0) {
        echo json_encode(['exists' => true]);
    } else {
        echo json_encode(['exists' => false]);
    }
    
    $stmt->close();
    $conn->close();
}
?>
