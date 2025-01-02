<?php
// Get the email and new password
$email = $_POST['email'];
$password = $_POST['password']; // You should hash the password before storing it

// Hash the new password
$hashedPassword = SHA2($password, 256);

// Database connection
$conn = new mysqli('localhost', 'root', '', 'roammate_db');
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Update the password in the database
$sql = "UPDATE admin_users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $hashedPassword, $email);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo "Password successfully updated.";
} else {
    echo "There was an error updating your password.";
}

$stmt->close();
$conn->close();
?>
