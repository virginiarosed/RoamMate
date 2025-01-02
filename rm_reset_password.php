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

// Get token from URL
$token = $_GET['token'];

// Verify the token and check if it exists and is not expired
$sql = "SELECT * FROM password_resets WHERE token = ? AND expires > ?";
$stmt = $conn->prepare($sql);
$currentTime = time();
$stmt->bind_param("si", $token, $currentTime);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Token valid, allow password reset
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $newPassword = $_POST['password'];

        // Update the password
        $sql = "UPDATE admin_users SET password = SHA2(?, 256) WHERE email = (SELECT email FROM password_resets WHERE token = ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $newPassword, $token);
        $stmt->execute();

        // Delete the token from the database after use
        $sql = "DELETE FROM password_resets WHERE token = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $token);
        $stmt->execute();

        $message = 'Password successfully updated!';
        $modalType = 'success'; // Modal type to show success
    }
} else {
    $message = 'Invalid or expired token.';
    $modalType = 'error'; // Modal type to show error
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RoamMate │ Reset Password</title>
    <link rel="stylesheet" href="rm_adminlogin.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="icon" href="icon.png" type="image/png">
    <style>
        /* Modal styling */
        .modal {
            display: none;
            position: fixed;
            z-index: 1;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.4);
            overflow: auto;
            padding-top: 60px;
        }

        .modal-content {
            background-color: #FEFAE0;
            margin: 0;
            padding: 20px;
            border: 5px solid #BC6C25;
            border-radius: 15px;
            width: 50%;
            max-width: 300px;
            text-align: center;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #BC6C25;
        }

        .modal-content h3{
            font-family: 'Montserrat-Regular', sans-serif;
        }

        /* Password input container styling */
        .password-container {
            position: relative;
            width: 100%;
        }

        .password-input {
            font-family: 'Montserrat-Regular', sans-serif;
            padding: 10px;
            border: 3px solid #bc6c25;
            border-radius: 8px;
            width: 100%;
            box-sizing: border-box;
            outline: none;
        }

        .password-eye {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 18px;
            cursor: pointer;
        }

        a {
            text-decoration: none;
        }

        /* Style for Close button (button element) */
        .btn {
            padding: 10px;
            background-color: #bc6c25;
            color: white;
            font-family: 'Montserrat-Medium', sans-serif;
            font-size: 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            width: 30%;
            margin: 0 auto; /* Only horizontal centering */
        }

        .btn:hover {
            color: #fafae0;
            background: #dda15e;
        }
    </style>
</head>
<body>
    <div class="login-form-container">
        <form method="POST">
            <div class="forgot-logo-container">
                <img src="RoamMate_logo.svg" alt="Logo" class="forgot_logo">
            </div>
            <img src="rm_reset_title.svg" alt="Logo" class="reset">
            
            <div class="password-container">
                <input type="password" id="password" name="password" class="password-input" placeholder="Enter your new password" required>
                <i id="togglePassword" class="fas fa-eye password-eye"></i>
            </div>
            
            <button type="submit" class="reset-button">Reset Password</button>
        </form>
    </div>

    <!-- Modal for feedback -->
    <div id="feedbackModal" class="modal">
        <div class="modal-content">
            <?php if (isset($modalType) && $modalType == 'success'): ?>
                <h3 style="margin-bottom: 25px;"><?php echo $message; ?></h3>
                <a href="rm_adminlogin.html" class="btn" style="display: block; margin-bottom: 15px !important;">Login</a>
            <?php elseif (isset($modalType) && $modalType == 'error'): ?>
                <h3><?php echo $message; ?></h3>
                <button class="btn" onclick="closeModal()">Close</button>
            <?php endif; ?>
        </div>
    </div>

    <script>
        // Show modal if message is set
        <?php if (isset($message)): ?>
            var modal = document.getElementById('feedbackModal');
            modal.style.display = "block";
        <?php endif; ?>

        // Function to close modal
        function closeModal() {
            var modal = document.getElementById('feedbackModal');
            modal.style.display = "none";
        }

        // Toggle password visibility
        const togglePassword = document.getElementById('togglePassword');
        const passwordField = document.getElementById('password');

        togglePassword.addEventListener('click', function() {
            // Toggle the type of the password field
            const type = passwordField.type === 'password' ? 'text' : 'password';
            passwordField.type = type;

            // Toggle the eye icon
            this.classList.toggle('fa-eye-slash');
        });
    </script>
</body>
</html>
