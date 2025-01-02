<?php
// Include PHPMailer autoloader and use statements at the top
require 'vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

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

// Get email from form
$email = $_POST['email'];

// Check if email exists in the database
$sql = "SELECT * FROM admin_users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Email exists, proceed to send reset link
    $user = $result->fetch_assoc();

    // Generate a unique reset token
    $token = bin2hex(random_bytes(50)); // Generate a secure token
    $expires = date("U") + 3600; // Token expiration (1 hour)

    // Store the token and expiration in the database
    $sql = "INSERT INTO password_resets (email, token, expires) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssi", $email, $token, $expires);
    $stmt->execute();

    // Send reset email via SMTP
    $mail = new PHPMailer(true);
    
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';  // Set the SMTP server
        $mail->SMTPAuth = true;
        $mail->Username = 'roammate.system@gmail.com'; // SMTP username
        $mail->Password = 'nzob xalg skhv qmut'; // SMTP password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Recipients
        $mail->setFrom('roammate.system@gmail.com', 'RoamMate Admin');
        $mail->addAddress($email); // Add the user's email

        // Content
        $resetLink = "http://localhost/webdev_project/rm_reset_password.php?token=" . $token;
        $mail->isHTML(true);
        $mail->Subject = 'Password Reset Request';
        $mail->Body = "
        <div style='
            background-color: #fafae0;
            border: 5px solid #bc6c25;
            border-radius: 10px;
            padding: 20px;
            max-width: 600px;
            margin: 0 auto;
            text-align: center;
        '>
            <div style='margin-bottom: 20px;'>
                <img src='https://i.imgur.com/PeGpJSz.png' alt='RoamMate Logo' style='max-width: 150px;'>
            </div>
            <p style='font-size: 16px;'>
                There was recently a request to change the password for your account.
                <br><br>If you requested this change, set a new password here:
            </p>
            <p>
                <a href='$resetLink' style='
                    display: inline-block;
                    padding: 10px 20px;
                    font-size: 16px;
                    color: #ffffff;
                    text-decoration: none;
                    background-color: #bc6c25;
                    border-radius: 5px;
                    text-align: center;
                '>
                    RESET PASSWORD
                </a>
            </p>
            <p style='font-size: 14px; color: #555;'>
                If you did not make this request, you can ignore this email and your password will remain the same.
                <br><br>Should you need assistance about any other matter, please feel free to contact us at roammate.system@gmail.com
                <br><br>Thank you,
                <br>RoamMate
            </p>
        </div>
        ";
        $mail->send();

        // Redirect back to the forgot password page with success message
        header("Location: rm_forgot_password.html?message=Password reset link has been sent to your email.");
        exit();
    } catch (Exception $e) {
        // Redirect back with error message
        header("Location: rm_forgot_password.html?message=Message could not be sent. Mailer Error: {$mail->ErrorInfo}");
        exit();
    }

} else {
    // Email doesn't exist, redirect with error message
    header("Location: rm_forgot_password.html?message=This email is not registered.");
    exit();
}

$conn->close();
?>
