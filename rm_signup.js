// Toggle Password Visibility
document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordInput = document.querySelector('input[name="password"]');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
});

document.getElementById('togglePasswordConfirmation').addEventListener('click', function () {
    const passwordConfirmationInput = document.querySelector('input[name="password_confirmation"]');
    const type = passwordConfirmationInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordConfirmationInput.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
});

// Password Validation
const passwordInput = document.getElementById("password");
const passwordConfirmationInput = document.getElementById("password_confirmation");
const requirementList = document.querySelectorAll(".requirement-list li");

// Password requirements validation
const requirements = [
    { regex: /.{8,}/, index: 0 }, // At least 8 characters
    { regex: /[0-9]/, index: 1 }, // At least one number
    { regex: /[a-z]/, index: 2 }, // At least one lowercase letter
    { regex: /[^A-Za-z0-9]/, index: 3 }, // At least one special character
    { regex: /[A-Z]/, index: 4 } // At least one uppercase letter
];

// Show password requirements when password input is focused
passwordInput.addEventListener("focus", function () {
    document.getElementById("password-requirements").style.display = 'block';
});

// Hide password requirements when focus is lost
passwordInput.addEventListener("blur", function () {
    document.getElementById("password-requirements").style.display = 'none';
});

passwordInput.addEventListener("keyup", function () {
    requirements.forEach(item => {
        const isValid = item.regex.test(passwordInput.value);
        const requirementItem = requirementList[item.index];
        if (isValid) {
            requirementItem.classList.add("valid");
            requirementItem.firstElementChild.className = "fa-solid fa-check";
        } else {
            requirementItem.classList.remove("valid");
            requirementItem.firstElementChild.className = "fa-solid fa-circle";
        }
    });
});

// Show Password Requirements when clicking "Next"
function showSecurityQuestions() {
    const password = document.querySelector('input[name="password"]').value;
    const passwordConfirmation = document.querySelector('input[name="password_confirmation"]').value;
    const passwordError = document.getElementById('password-error');
    
    // Check if passwords match
    if (password !== passwordConfirmation) {
        passwordError.style.display = 'block'; // Show error message if passwords don't match
        return; // Prevent transition to next section if passwords don't match
    }

    passwordError.style.display = 'none'; // Hide error message if passwords match

    // Check if the password meets all the criteria
    const isPasswordValid = requirements.every(item => item.regex.test(password));

    // Display the password requirements if password is invalid
    if (!isPasswordValid) {
        document.getElementById('password-requirements').style.display = 'block'; // Show requirement list if invalid
    } else {
        document.getElementById('password-requirements').style.display = 'none'; // Hide requirement list if valid
    }
}

// Check password validity when the user types in the confirmation password field
passwordConfirmationInput.addEventListener("keyup", checkPasswordValidity);

// Check password validity for confirmation field
function checkPasswordValidity() {
    const password = passwordInput.value;
    const passwordConfirmation = passwordConfirmationInput.value;
    const passwordError = document.getElementById('password-error');
    
    if (password !== passwordConfirmation) {
        passwordError.style.display = 'block';
    } else {
        passwordError.style.display = 'none';
    }
}

const emailInput = document.getElementById('email');
const emailIcon = document.querySelector('.email-icon');
const emailError = document.getElementById('email-error'); // Reference to the error message div

emailInput.addEventListener('input', function () {
    const emailValue = emailInput.value;

    // Only check if the email format is valid
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (regex.test(emailValue)) {
        // Make an AJAX request to check if the email is already in use
        fetch('check_email.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `email=${encodeURIComponent(emailValue)}`,
        })
            .then(response => response.json())
            .then(data => {
                if (data.exists) {
                    // Email already in use
                    emailError.style.display = 'block'; // Show error message
                    emailError.textContent = 'This email is already in use. Please choose another one.';

                    // Set envelope icon to invalid (red)
                    emailIcon.classList.remove('fa-check-circle'); // Remove valid icon
                    emailIcon.classList.add('fa-envelope'); // Add envelope icon
                    emailIcon.style.color = 'red'; // Set icon color to red
                } else {
                    // Email is available
                    emailError.style.display = 'none'; // Hide error message

                    // Set envelope icon to valid (green)
                    emailIcon.classList.remove('fa-envelope'); // Remove default icon
                    emailIcon.classList.add('fa-check-circle'); // Add valid icon
                    emailIcon.style.color = '#585D27'; // Set icon color to green
                }
            })
            .catch(error => console.error('Error:', error));
    } else {
        // If email format is invalid, reset the icon and hide error message
        emailError.style.display = 'none'; // Hide error message
        emailIcon.classList.remove('fa-check-circle'); // Remove valid icon
        emailIcon.classList.add('fa-envelope'); // Add default envelope icon
        emailIcon.style.color = 'red'; // Set icon color to red
    }
});

emailInput.addEventListener('input', function () {
    const emailValue = emailInput.value;

    // Only check if the email is valid (basic regex validation)
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (regex.test(emailValue)) {
        // Make an AJAX request to check if the email is already in use
        fetch('check_email.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `email=${encodeURIComponent(emailValue)}`,
        })
            .then(response => response.json())
            .then(data => {
                if (data.exists) {
                    // Email already in use
                    emailError.style.display = 'block';
                    emailError.textContent = 'This email is already in use. Please choose another one.';
                } else {
                    // Email is available
                    emailError.style.display = 'none';
                }
            })
            .catch(error => console.error('Error:', error));
    } else {
        // If email format is invalid, hide the error message
        emailError.style.display = 'none';
    }
});

const companyCodeInput = document.getElementById('company-code');
const companyCodeError = document.getElementById('company-code-error'); // Error message div

// Define the valid company code
const validCompanyCode = '4B-TRVL-ND-TRS';

// Listen for input changes in the company code field
companyCodeInput.addEventListener('input', function () {
    const companyCodeValue = companyCodeInput.value.trim(); // Get the entered value and trim spaces

    // Check if the entered code matches the predefined company code
    if (companyCodeValue === validCompanyCode) {
        companyCodeError.style.display = 'none'; // Hide error if valid
    } else {
        companyCodeError.style.display = 'block'; // Show error if invalid
    }
});

