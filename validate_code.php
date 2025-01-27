<?php
// Validate Company Code
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve the company code from the POST request
    $company_code = isset($_POST['company_code']) ? trim($_POST['company_code']) : '';

    // The correct company code
    $correct_code = '4B-TRVL-ND-TRS';

    // Sanitize the input to avoid any malicious code
    $company_code = filter_var($company_code, FILTER_SANITIZE_STRING);

    // Check if the entered company code is correct
    if ($company_code === $correct_code) {
        // Respond with success if the code is valid
        echo json_encode(['valid' => true]);
    } else {
        // Respond with failure if the code is invalid
        echo json_encode(['valid' => false, 'message' => 'Invalid company code.']);
    }
}
?>
