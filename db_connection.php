<?php
// db_connection.php

function db_connect() {
    // Database connection details
    $servername = "localhost";  // Change this to your server if needed
    $username = "root";         // Your database username (default in XAMPP is 'root')
    $password = "";             // Your database password (default in XAMPP is empty)
    $dbname = "roammate_db";    // Your database name

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    return $conn;  // Return the connection object
}
?>
