const navbarLinks = document.querySelectorAll(".nav-menu .nav-link");
const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton = document.querySelector("#menu-close-button");

menuOpenButton.addEventListener("click", () => {
  // Toggle mobile menu visibility
  document.body.classList.toggle("show-mobile-menu");
});

// Close menu when the close button is clicked
menuCloseButton.addEventListener("click", () => menuOpenButton.click());

// Close menu when nav link is clicked
navbarLinks.forEach((link) => {
  link.addEventListener("click", () => menuOpenButton.click());
});

/* Initializing Swiper */
let swiper = new Swiper(".slider-wrapper", {
  loop: true,
  grabCursor: true,
  spaceBetween: 25,

  // Pagination bullets
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  /* Responsive breakpoints */
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

const form = document.querySelector('.contact-form');
const feedbackContainer = document.querySelector('#form-feedback');
const loadingSpinner = document.querySelector('#loading-spinner');

form.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent the default form submission

  // Clear any previous feedback
  feedbackContainer.style.display = 'none';
  feedbackContainer.classList.remove('success-feedback', 'error-feedback');
  loadingSpinner.style.display = 'block'; // Show the loading spinner

  // Form data
  const formData = new FormData(form);

  // AJAX request to submit the form data
  fetch('send_email.php', {
    method: 'POST',
    body: formData
  })
  .then(response => response.text())
  .then(data => {
    // Hide the loading spinner
    loadingSpinner.style.display = 'none';

    // Display success message
    feedbackContainer.textContent = 'Message sent successfully!';
    feedbackContainer.classList.add('success-feedback');
    feedbackContainer.style.display = 'block';

    // Hide the feedback message after 3 seconds
    setTimeout(() => {
      feedbackContainer.style.display = 'none';
    }, 3000);

    form.reset(); // Clear the form
  })
  .catch(error => {
    // Hide the loading spinner
    loadingSpinner.style.display = 'none';

    // Display error message
    feedbackContainer.textContent = 'There was an error sending the message.';
    feedbackContainer.classList.add('error-feedback');
    feedbackContainer.style.display = 'block';

    // Hide the feedback message after 3 seconds
    setTimeout(() => {
      feedbackContainer.style.display = 'none';
    }, 3000);
  });
});