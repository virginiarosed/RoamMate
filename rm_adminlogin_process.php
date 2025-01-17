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

// Define maximum attempts and lockout duration
$maxAttempts = 3;
$lockoutTime = 5; // 5 minutes (no need to multiply by 60)

// Query to check login attempts and lockout expiry time
$sql = "SELECT failed_attempts, last_failed_attempt, lockout_expiry, password FROM admin_users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    // Check if account is locked and if the lockout period has expired
    $currentTime = time();  // Current time in seconds
    $lockoutExpiry = strtotime($user['lockout_expiry']);  // Lockout expiry time in seconds

    if ($user['failed_attempts'] >= $maxAttempts && $currentTime < $lockoutExpiry) {
        // Send the exact lockout expiry time to the front end
        $lockoutExpiryTimestamp = strtotime($user['lockout_expiry']);
        header("Location: rm_adminlogin.html?error=Locked&lockout_expiry=$lockoutExpiryTimestamp");
        exit();
    }

    // Check password using password_verify() instead of SHA2
    if (password_verify($password, $user['password'])) {
        // Reset failed attempts and lockout expiry on successful login
        $sql = "UPDATE admin_users SET failed_attempts = 0, lockout_expiry = NULL WHERE email = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();

        // Redirect to the admin dashboard
        header("Location: rm_home.html");
        exit();
    } else {
        // Increment failed attempts and update the last failed attempt and lockout expiry if needed
        $newFailedAttempts = $user['failed_attempts'] + 1;
        $lockoutExpiryTime = ($newFailedAttempts >= $maxAttempts) ? date("Y-m-d H:i:s", $currentTime + ($lockoutTime * 60)) : NULL;

        $sql = "UPDATE admin_users SET failed_attempts = ?, last_failed_attempt = NOW(), lockout_expiry = ? WHERE email = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("iss", $newFailedAttempts, $lockoutExpiryTime, $email);
        $stmt->execute();

        // Ensure the error message is passed with the redirect
        header("Location: rm_adminlogin.html?error=Invalid credentials");
        exit();
    }
} else {
    // Handle case where email doesn't exist
    header("Location: rm_adminlogin.html?error=Invalid credentials");
    exit();
}

// Close connection
$stmt->close();
$conn->close();
?>
