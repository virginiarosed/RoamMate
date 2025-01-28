<?php
// Define database connection parameters
$servername = "localhost"; // or your host
$username = "root"; // your database username
$password = ""; // your database password
$dbname = "roammate_db"; // your database name

// Create a connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
