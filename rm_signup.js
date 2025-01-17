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

emailInput.addEventListener('input', function () {
    const emailValue = emailInput.value;
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;  // Email validation regex

    if (regex.test(emailValue)) {
        emailIcon.classList.remove('fa-envelope');    // Remove default envelope icon
        emailIcon.classList.add('fa-check-circle');  // Add check-circle icon
        emailIcon.style.color = '#585D27';            // Change icon color to green (valid)
    } else {
        emailIcon.classList.remove('fa-check-circle'); // Remove check-circle icon
        emailIcon.classList.add('fa-envelope');        // Add default envelope icon
        emailIcon.style.color = 'red';                  // Change icon color to red (invalid)
    }
});

