<?php
// Database connection
$servername = "localhost";
$username = "root"; 
$password = "";     
$dbname = "roammate_db";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get user input
$email = $_POST['email'];
$password = $_POST['password'];

// Query to check credentials
$sql = "SELECT * FROM admin_users WHERE email = ? AND password = SHA2(?, 256)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $email, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Success: Redirect to the admin dashboard
    header("Location: rm_home.html"); // Replace with your admin dashboard page
    exit();
} else {
    // Failure: Redirect back to login with an error message
    header("Location: rm_adminlogin.html?error=Invalid credentials");
    exit();
}

// Close the connection
$stmt->close();
$conn->close();
?>
