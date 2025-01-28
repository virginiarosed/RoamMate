<?php
// Initialize an empty error message
$error_message = '';

// Define the predefined company code
$valid_company_code = '4B-TRVL-ND-TRS';

include 'db_connection.php';

// Check if the form is submitted
if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    // Get the submitted form values
    $email = $_POST['email'];
    $password = $_POST['password'];
    $password_confirmation = $_POST['password_confirmation'];
    $company_code = $_POST['company_code'];

    // Trim and sanitize input to avoid XSS or unnecessary spaces
    $email = htmlspecialchars(trim($email));
    $company_code = htmlspecialchars(trim($company_code));

    // Validate company code
    if ($company_code !== $valid_company_code) {
        $error_message = "Invalid company code.";
    }

    // Validate password match
    if ($password !== $password_confirmation) {
        $error_message = "Passwords do not match.";
    }

    // Validate email format (basic check)
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error_message = "Please enter a valid email address.";
    }

    // If there are no errors, proceed with registration
    if (empty($error_message)) {
        // Hash the password before storing it
        $hashed_password = password_hash($password, PASSWORD_BCRYPT);

        // Insert the user data into the admin_users table
        $stmt = $conn->prepare("INSERT INTO admin_users (email, password, company_code) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $email, $hashed_password, $company_code);

        if ($stmt->execute()) {
            // Redirect to the login page after successful registration
            header("Location: rm_adminlogin.html");
            exit;
        } else {
            $error_message = "There was an error processing your registration. Please try again later.";
        }
        $stmt->close();
    }

    // Close the database connection
    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RoamMate │ Admin Sign Up</title>
    <link rel="stylesheet" href="rm_signup.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="icon" href="icon.png" type="image/png">
</head>
<body>
    <div class="signup-form-container">
        <form class="signup-form" action="rm_signup_process.php" method="POST">
            <div id="initial-questions">
                <div class="form-header">
                    <div class="logo-container">
                        <img src="RoamMate_logo.svg" alt="Logo" class="logo">
                    </div>
                    <div class="title-container">
                        <img src="rm_create_title.svg" alt="Create an Account" class="title-image">
                    </div>
                </div>

                <!-- Email Input -->
                <div class="form-group email-group">
                    <input type="email" name="email" id="email" placeholder="Email" class="input-field full-width" required>
                    <i class="fas fa-envelope email-icon"></i>
                </div>
                                
                <div class="form-group row">
                    <div class="password-container">
                        <input type="password" name="password" id="password" placeholder="Password" class="input-field half-width" required>
                        <i class="fas fa-eye" id="togglePassword" style="cursor: pointer;"></i>
                    </div>
                    <div class="password-container">
                        <input type="password" name="password_confirmation" placeholder="Confirm Password" id="password_confirmation" class="input-field half-width" required>
                        <i class="fas fa-eye" id="togglePasswordConfirmation" style="cursor: pointer;"></i>
                    </div>                   
                </div>
                <div id="password-requirements" class="password-requirements" style="display: none;">
                    <p>Password must contain:</p>
                    <ul class="requirement-list">
                        <li>
                            <i class="fa-solid fa-circle"></i>
                            <span>At least 8 characters length</span>
                        </li>
                        <li>
                            <i class="fa-solid fa-circle"></i>
                            <span>At least 1 number (0-9)</span>
                        </li>
                        <li>
                            <i class="fa-solid fa-circle"></i>
                            <span>At least 1 lowercase letter (a-z)</span>
                        </li>
                        <li>
                            <i class="fa-solid fa-circle"></i>
                            <span>At least 1 special symbol (!, $, etc.)</span>
                        </li>
                        <li>
                            <i class="fa-solid fa-circle"></i>
                            <span>At least 1 uppercase letter (A-Z)</span>
                        </li>
                    </ul>
                    </div>
                    <div class="form-group">
                        <input
                            type="text"
                            id="company-code"
                            name="company_code"
                            class="input-field full-width"
                            placeholder="Enter Company Code"
                            required
                        />
                    </div>

                    <div id="email-error" style="color: red; display: none; font-size: 15px; text-align: center; margin: 0 auto; margin-bottom: 10px;">
                        <p>This email is already in use. Please choose another one.</p>
                    </div>
                    <div id="password-error" style="color: red; display: none; font-size: 15px; text-align: center; margin: 0 auto; margin-bottom: -10px;">
                        <p>Passwords do not match</p>
                    </div>
                    <div id="company-code-error" style="color: red; display: none; font-size: 15px; text-align: center; margin: 0 auto; margin-bottom: 10px;">
                        <p>Invalid company code. Please try again.</p>
                    </div>
                <button type="submit" class="signup-button">Sign Up</button>                 
                <p class="login-text">Already have an account? <a href="rm_adminlogin.html">Log In</a></p>
            </div>
        </form>
    </div>

    <script src="rm_signup.js"></script>
</body>
</html>
