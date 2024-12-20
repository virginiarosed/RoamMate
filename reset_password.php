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

// Retrieve the token from the URL
$token = $_GET['token'];

// Check if the token is valid and not expired
$sql = "SELECT * FROM admin_users WHERE reset_token = ? AND reset_expiry > NOW()";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Display reset password form
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $newPassword = $_POST['password'];
        $hashedPassword = hash('sha256', $newPassword);

        // Update the password in the database
        $sql = "UPDATE admin_users SET password = ?, reset_token = NULL, reset_expiry = NULL WHERE reset_token = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $hashedPassword, $token);
        $stmt->execute();

        echo "Password reset successful! You can now <a href='rm_adminlogin.html'>log in</a>.";
        exit();
    }
} else {
    echo "Invalid or expired token.";
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password</title>
</head>
<body>
    <div class="login-form-container">
        <form class="login-form" method="POST">
            <div class="form-header">
                <h2>Reset Password</h2>
            </div>
            <div class="form-group">
                <input type="password" name="password" placeholder="Enter new password" class="input-field full-width" required>
            </div>
            <div class="form-group">
                <button type="submit" class="login-button">Reset Password</button>
            </div>
        </form>
    </div>
</body>
</html>
