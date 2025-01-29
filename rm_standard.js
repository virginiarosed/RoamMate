function updateDurationTextAndDays() {
    const days = document.getElementById('duration-days').value;
    const nightsField = document.getElementById('duration-nights');
    const durationDisplay = document.getElementById('duration-text');
    const dayContainer = document.getElementById('main-day-container');
    const durationError = document.getElementById('duration-error');

    // Ensure the days input is a valid number greater than 0
    if (days && days > 0) {
        const nights = days - 1; // Nights will always be 1 less than the days
        nightsField.value = nights; // Set the number of nights
        nightsField.disabled = false; // Enable the nights input field

        // Check if nights is exactly one less than days
        if (nights !== parseInt(nightsField.value)) {
            durationError.style.display = 'block'; // Show error if not 1 less
            durationDisplay.textContent = 'Please make sure Nights is exactly 1 less than Days';
            return; // Prevent further execution
        } else {
            durationError.style.display = 'none'; // Hide error if valid
        }

        durationDisplay.innerHTML = `<strong>Duration:</strong> ${days} Days, ${nights} Nights`;

        // Generate the day input containers dynamically based on the number of days
        dayContainer.innerHTML = ''; // Clear previous day containers

        for (let i = 1; i <= days; i++) {
            const newDayContainer = document.createElement('div');
            newDayContainer.classList.add('day-input-container');

            newDayContainer.innerHTML = `
                <div class="day-container" data-day="${i}">
                    <h3>Day ${i}</h3>
                    <!-- Empty div for the time slot and activity fields (initially empty) -->
                    <div class="time-slot-container" data-day="${i}"></div>
                    <!-- Add Time button moved below the input fields -->
                    <button type="button" class="add-time-btn" data-day="${i}">+ Add Time</button>
                </div>
            `;

            dayContainer.appendChild(newDayContainer);
        }
    } else {
        durationDisplay.textContent = 'Please enter a valid number of days.';
        nightsField.value = '';  // Reset nights field if days is invalid
        nightsField.disabled = true; // Disable nights input field when days is invalid
    }
}

// Event listener for updating duration text and dynamically generating day input containers
document.getElementById('duration-days').addEventListener('change', updateDurationTextAndDays);
document.getElementById('duration-nights').addEventListener('change', updateDurationTextAndDays);

// Initial call to ensure proper synchronization of Duration (Days) and Duration (Nights)
updateDurationTextAndDays();

// Fetch and display itineraries as buttons
document.addEventListener("DOMContentLoaded", function () {
    fetchItineraries();

    function fetchItineraries() {
        fetch('fetch_itineraries.php')
            .then(response => response.json())
            .then(data => {
                const itineraryButtons = document.getElementById('itinerary-buttons');
                itineraryButtons.innerHTML = ''; // Clear any existing buttons
    
                data.forEach(itinerary => {
                    const button = document.createElement('button');
                    button.textContent = `${itinerary.destination} (${itinerary.formatted_duration})`;
                    button.classList.add('itinerary-btn');
                    button.setAttribute('data-id', itinerary.id);
                    itineraryButtons.appendChild(button);
                });
            })
            .catch(error => {
                console.error('Error fetching itineraries:', error);
            });
    }

    // Event listener for itinerary button clicks
    document.getElementById('itinerary-buttons').addEventListener('click', function (event) {
        if (event.target.classList.contains('itinerary-btn')) {
            const itineraryId = event.target.getAttribute('data-id');
            fetch(`fetch_itinerary_details.php?id=${itineraryId}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);  // Log the data to check the structure
                    displayModal(data);
                })
                .catch(error => {
                    console.error('Error fetching itinerary details:', error);
                });
        }
    });

    function displayModal(data) {
        const modal = document.getElementById('itinerary-modal');
        const modalContent = document.getElementById('modal-content');
        
        // Check if data exists and log to debug
        if (!data || !data.itinerary || !data.days) {
            console.error('Invalid data received:', data);
            return;
        }
    
        // Populate modal with data
        modalContent.innerHTML = `
            <h1>${data.itinerary.destination}</h1>
            <p><strong>Duration:</strong> ${data.itinerary.duration_days} Days ${data.itinerary.duration_nights} Nights</p>
            <p style="margin-bottom: 30px;"><strong>Lodging:</strong> ${data.itinerary.lodging}</p>
            <div id="schedule-container">
                ${data.days.map(day => `
                    <div class="day-container">
                        <h2>Day ${day.day_number}</h2>
                        <!-- Table for activities -->
                        <table class="activity-table">
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Activity</th>
                                    <th>Action</th> <!-- New Action column -->
                                </tr>
                            </thead>
                            <tbody>
                                ${day.activities.map(activity => `
                                    <tr>
                                        <td style="text-align: center; font-weight:">${activity.start_time} - ${activity.end_time}</td>
                                        <td>${activity.activity}</td>
                                        <td><button class="edit-day-btn" 
                                            data-day-id="${activity.id}" 
                                            data-itinerary-id="${data.itinerary.id}"
                                            data-destination="${data.itinerary.destination}"
                                            data-lodging="${data.itinerary.lodging}">
                                            Edit
                                        </button></td> <!-- Edit button -->
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `).join('')}
            </div>
            <button id="modal-close" class="modal-close">&times;</button> <!-- Close button inside the modal -->
            <button id="delete-itinerary" class="delete-button"
                style="display: block;
                background-color: #BC6C25;
                color: white;
                padding: 10px 20px;
                font-family: 'Montserrat-Medium', sans-serif;
                font-size: 14px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                text-align: center;
                margin-top: 20px;
                margin-left: auto;
                margin-right: auto;"
                onmouseover="this.style.backgroundColor='#DDA15E';"
                onmouseout="this.style.backgroundColor='#BC6C25';">
            Delete Itinerary
        </button>
        `;
    
        // Show modal
        modal.style.display = 'block';
        
        // Close modal when the close button is clicked
        document.getElementById('modal-close').addEventListener('click', function () {
            modal.style.display = 'none';
        });
    
        // Close modal when clicking outside of it
        window.addEventListener('click', function (event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    
        // Adding event listener to the delete button inside the modal
        document.getElementById('delete-itinerary').addEventListener('click', function() {
            const itineraryId = data.itinerary.id; // Get the itinerary ID from the modal data
            deleteItinerary(itineraryId);
        });

        modal.querySelectorAll('.edit-day-btn').forEach(button => {
            button.addEventListener('click', function() {
                const dayId = this.getAttribute('data-day-id');
                const itineraryId = this.getAttribute('data-itinerary-id');
                const destination = this.getAttribute('data-destination');
                const lodging = this.getAttribute('data-lodging');
                openEditDayModal(dayId, itineraryId, destination, lodging);
            });
        });
    }

    function openEditDayModal(dayId, itineraryId, destination, lodging) {
        console.log(`Opening edit modal for dayId: ${dayId}, itineraryId: ${itineraryId}`); // Debugging statement
    
        const modal = document.createElement('div');
        modal.classList.add('modal');
    
        // Fetch the day details using dayId and itineraryId
        const fetchUrl = `fetch_standard_details.php?day_id=${dayId}&itinerary_id=${itineraryId}`;
        console.log(`Fetching day details from URL: ${fetchUrl}`); // Debugging statement
    
        fetch(fetchUrl)
            .then(response => response.json())
            .then(day => {
                console.log('Fetched day details:', day); // Debugging statement
    
                if (day.error) {
                    console.error('Error fetching day details:', day.error);
                    alert('Failed to fetch day details: ' + day.error);
                    return;
                }
    
                const startTime = day.start_time || '';
                const endTime = day.end_time || '';
                const activity = day.activity || '';
    
                console.log(`Setting modal values - Start Time: ${startTime}, End Time: ${endTime}, Activity: ${activity}`); // Debugging statement
    
                modal.innerHTML = `
                    <div class="modal-content">
                        <span class="close">&times;</span>
                        <h1>Edit Day</h1>
                        <form id="edit-day-form">
                            <div class="form-group">
                                <label>Destination:</label>
                                <input type="text" name="destination" value="${destination}" required />
                            </div>
                            <div class="form-group">
                                <label>Lodging:</label>
                                <input type="text" name="lodging" value="${lodging}" required />
                            </div>
                            <div class="time-container">
                                <div class="form-group">
                                    <label>Start Time:</label>
                                    <input type="time" name="start_time" value="${startTime}" required />
                                </div>
                                <div class="form-group">
                                    <label>End Time:</label>
                                    <input type="time" name="end_time" value="${endTime}" required />
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Activity:</label>
                                <input type="text" name="activity" value="${activity}" required />
                            </div>
                            <button type="submit">Save Changes</button>
                        </form>
                    </div>
                `;
    
                document.body.appendChild(modal);
                modal.style.display = 'block';
    
                // Close the modal when clicking on the close button
                modal.querySelector('.close').addEventListener('click', function () {
                    modal.style.display = 'none';
                    modal.remove();
                });
    
                // Close modal when clicking outside of it
                window.addEventListener('click', function (event) {
                    if (event.target === modal) {
                        modal.style.display = 'none';
                    }
                });
    
                // Handle form submission to update day details
                const form = document.getElementById('edit-day-form');
                form.addEventListener('submit', function (e) {
                    e.preventDefault();
                    const formData = new FormData(form);
                    const updatedDayData = {
                        day_id: dayId,
                        itinerary_id: itineraryId,
                        destination: formData.get('destination'),
                        lodging: formData.get('lodging'),
                        start_time: formData.get('start_time'),
                        end_time: formData.get('end_time'),
                        activity: formData.get('activity')
                    };
                    updateDayDetails(updatedDayData, modal);
                });
            })
            .catch(error => {
                console.error('Error fetching day details:', error);
                alert('Failed to fetch day details');
            });
    }
    
    function editActivity(activityId) {
        // Implement the logic to edit the activity
        console.log(`Edit activity with ID: ${activityId}`);
    }
    
    // Function to show notifications
    function showNotification(message, type = 'success') {
        // Create a new div for the notification
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.classList.add(type); // 'success' or 'error' class for styling
    
        // Set the message text
        notification.innerText = message;
    
        // Add the notification to the container
        const container = document.getElementById('notification-container');
        container.appendChild(notification);
    
        // Auto-dismiss the notification after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0'; // Fade out
            setTimeout(() => {
                container.removeChild(notification); // Remove from DOM
                // Refresh the page after the notification disappears
                location.reload(); // This will reload the page
            }, 500); // After fade-out
        }, 1000); // 1 second duration
    }
    
    // Function to update day details
    function updateDayDetails(updatedDayData, modal) {
        console.log('Updating day details with data:', updatedDayData);
    
        fetch('update_standard_details.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedDayData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Update response:', data);
    
            if (data.success) {
                showNotification('Day details updated successfully', 'success');
                modal.style.display = 'none';
                modal.remove();
            } else if (data.error === 'No changes were made. Please modify the details before saving.') {
                showNotification('No changes were made', 'error');
                modal.style.display = 'none';
                modal.remove();
            } else {
                console.error('Error response from server:', data);
                showNotification('Error updating day details', 'error');
            }
        })
        .catch(error => {
            console.error('Error during update request:', error);
            showNotification('Failed to update day details', 'error');
        });
    }
    
    // Function to delete itinerary
    function deleteItinerary(itineraryId) {
        // Get modal elements
        const modal = document.getElementById('confirmation-modal');
        const confirmButton = document.getElementById('confirm-delete-btn');
        const cancelButton = document.getElementById('cancel-delete-btn');
        const closeButton = document.getElementById('modal-close');
    
        // Show the confirmation modal
        modal.style.display = 'block';
    
        // Close the modal when clicking the close button
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    
        // Close the modal when clicking the cancel button
        cancelButton.addEventListener('click', () => {
            modal.style.display = 'none';
            console.log('Deletion cancelled');
        });
    
        // Proceed with deletion if the user confirms
confirmButton.addEventListener('click', () => {
    fetch(`delete_itinerary.php?id=${itineraryId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Show the success toast
            showSuccessToast('Itinerary deleted successfully');
            
            // Close the modal
            modal.style.display = 'none';

            // Optionally, remove the itinerary from the list if it's displayed elsewhere
            const itineraryButton = document.querySelector(`[data-id="${itineraryId}"]`);
            if (itineraryButton) {
                itineraryButton.remove(); // Remove the itinerary button
            }
        } else {
            alert('Error deleting itinerary');
        }
    })
    .catch(error => {
        console.error('Error deleting itinerary:', error);
        alert('An error occurred while deleting the itinerary');
        modal.style.display = 'none';
    });
});
    }

// New function to show a success toast and reload the page after it disappears
function showSuccessToast(message) {
    // Create the toast container div
    const toast = document.createElement('div');
    toast.classList.add('toast', 'success');
    toast.innerHTML = message;

    // Append the toast to the body or a specific container
    document.body.appendChild(toast);

    // Remove the toast after 3 seconds and reload the page
    setTimeout(() => {
        toast.remove();  // Remove the toast
        window.location.reload();  // Reload the page
    }, 3000);
}

function updateDurationTextAndDays() {
    const days = document.getElementById("duration-days").value;
    const nights = document.getElementById("duration-nights").value;
    const durationDisplay = document.getElementById("duration-text");
    const dayContainer = document.getElementById("main-day-container");
  
    // Check if the number of days is 1 and the number of nights is 0
    if (days == 1 && nights == 0) {
      durationDisplay.innerHTML = `<strong>Duration:</strong> Roundtrip`;
      // Ensure Day 1 container is still generated
      dayContainer.innerHTML = ""; // Clear previous day containers
      const newDayContainer = document.createElement("div");
      newDayContainer.classList.add("day-input-container");
      newDayContainer.innerHTML = `
              <div class="day-container" data-day="1">
                  <h3>Day 1</h3>
                  <div class="time-slot-container" data-day="1"></div>
                  <button type="button" class="add-time-btn" data-day="1">+ Add Time</button>
              </div>
          `;
      dayContainer.appendChild(newDayContainer);
    } else if (days && nights >= 0) {
      durationDisplay.innerHTML = `<strong>Duration:</strong> ${days} Days, ${nights} Nights`;
  
      // Generate the day input containers dynamically based on the number of days
      dayContainer.innerHTML = ""; // Clear previous day containers
  
      for (let i = 1; i <= days; i++) {
        const newDayContainer = document.createElement("div");
        newDayContainer.classList.add("day-input-container");
        newDayContainer.innerHTML = `
                  <div class="day-container" data-day="${i}">
                      <h3>Day ${i}</h3>
                      <div class="time-slot-container" data-day="${i}"></div>
                      <button type="button" class="add-time-btn" data-day="${i}">+ Add Time</button>
                  </div>
              `;
        dayContainer.appendChild(newDayContainer);
      }
    } else {
      durationDisplay.textContent = "Please enter valid duration.";
    }
  }
  
  // Event listener for updating duration text and dynamically generating day input containers
  document
    .getElementById("duration-days")
    .addEventListener("change", updateDurationTextAndDays);
  document
    .getElementById("duration-nights")
    .addEventListener("change", updateDurationTextAndDays);
  
  let endTimes = [];
  
  // Function to add more time inputs dynamically for any day
  document.addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains("add-time-btn")) {
        const dayNumber = event.target.getAttribute("data-day");
        const dayContainer = document.querySelector(
            `.day-container[data-day="${dayNumber}"]`
        );
        const timeSlotContainer = dayContainer.querySelector(".time-slot-container");

        // Find the last index for this day (based on the number of time slots already added)
        const timeInputs = timeSlotContainer.querySelectorAll(
            `input[name="time_range[${dayNumber}][]"]`
        ).length;

        // Create new time slot and activity input fields
        const newTimeContainer = document.createElement("div");
        newTimeContainer.classList.add("form-group");
        newTimeContainer.dataset.day = dayNumber;

        newTimeContainer.innerHTML = `
            <input type="time" id="time-range-${dayNumber}-${timeInputs + 1}" name="time_range[${dayNumber}][]" required>
            <input type="time" id="time-range-end-${dayNumber}-${timeInputs + 1}" name="time_range[${dayNumber}][]" required disabled>
            <input type="text" id="activity-${dayNumber}-${timeInputs + 1}" name="activity[${dayNumber}][]" placeholder="Activity..." required>
            <button type="button" class="delete-time-btn" data-day="${dayNumber}" data-index="${timeInputs + 1}">
                <i class="fas fa-trash"></i> <!-- Updated delete icon -->
            </button>
            <div class="divider"></div>
        `;

        // Append the new time slot input fields below the current time slots
        timeSlotContainer.appendChild(newTimeContainer);

        // Add event listener to validate time inputs
        const startTimeInput = newTimeContainer.querySelector("input[type='time']:nth-child(1)");
        const endTimeInput = newTimeContainer.querySelector("input[type='time']:nth-child(2)");

        // Event listener to check if startTime is earlier than endTime
        startTimeInput.addEventListener("change", validateTime);
        endTimeInput.addEventListener("change", validateTime);

        function validateTime() {
            const startTimeValue = startTimeInput.value;
            const endTimeValue = endTimeInput.value;

            if (startTimeValue && !endTimeValue) {
                endTimeInput.disabled = false;
            }

            if (endTimes.length && startTimeValue && !endTimeValue) {
                const startTimeDate = new Date(`1970-01-01T${startTimeValue}:00`);
                const lastTimeDate = new Date(`1970-01-01T${endTimes[dayNumber - 1]}:00`);

                // If the start time is earlier than the last end time, show a toast inside the corresponding day container
                if (startTimeDate < lastTimeDate) {
                    showToast(`Start time cannot be earlier than ${endTimes[dayNumber - 1]}`, dayNumber, 'error');
                    startTimeInput.value = "";
                    endTimeInput.disabled = true;
                    return; // Prevent adding the time slot
                }
            }

            if (startTimeValue && endTimeValue) {
                const startTimeDate = new Date(`1970-01-01T${startTimeValue}:00`);
                const endTimeDate = new Date(`1970-01-01T${endTimeValue}:00`);

                if (startTimeDate >= endTimeDate) {
                    showToast("Start time must be earlier than end time.", dayNumber, 'error');
                    endTimeInput.value = "";
                    endTimeInput.setCustomValidity("Start time must be earlier than end time.");
                } else {
                    endTimeInput.setCustomValidity(""); // Clear any previous validation messages
                    if (!endTimes.length) {
                        endTimes.push(endTimeValue);
                    } else {
                        endTimes[dayNumber - 1] = endTimeValue;
                    }
                }
            }
        }
    }
});

  
    // Delete a time slot and activity
    if (event.target && event.target.closest(".delete-time-btn")) {
      const button = event.target.closest(".delete-time-btn");
      const dayNumber = button.getAttribute("data-day");
      const index = button.getAttribute("data-index");
      const dayContainer = document.querySelector(
        `.day-container[data-day="${dayNumber}"]`
      );
      const timeSlotContainer = dayContainer.querySelector(
        ".time-slot-container"
      );
  
      // Remove the corresponding time and activity input fields
      const timeContainers = timeSlotContainer.querySelectorAll(`.form-group`);
  
      // Loop through all form groups (time slot containers) and remove the one corresponding to the button clicked
      for (let i = 0; i < timeContainers.length; i++) {
        const currentContainer = timeContainers[i];
        const currentIndex = currentContainer
          .querySelector("button")
          .getAttribute("data-index");
  
        if (currentIndex == index) {
          if (endTimes.length) {
            const previous = currentContainer.previousElementSibling;
            if (previous) {
              endTimes[previous.dataset.day - 1] = previous.querySelector(
                "input[type='time']:nth-child(2)"
              ).value;
            } else if (endTimes[currentContainer.dataset.day - 1]) {
              endTimes.splice(currentContainer.dataset.day - 1, 1);
            }
          }
  
          timeSlotContainer.removeChild(currentContainer); // Remove the entire row (time slot + activity + button)
          break; // Stop the loop once the correct row is found and removed
        }
      }
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    const destinationInput = document.getElementById("destination");
    const destinationError = document.getElementById("destination-error");
    const lodgingInput = document.getElementById("lodging");
    const lodgingError = document.getElementById("lodging-error");
    const form = document.getElementById("itinerary-form"); // Assuming the form has this id

    // Regular expressions for destination validation
    const invalidStartRegex = /^[\s][a-zA-Z0-9]/;
    const isOnlySpaceRegex = /^\s*$/;
    const isTooShortRegex = /^.{1}$/;
    const startsWithSpecialCharRegex = /^[^\w\s]/;

    // Regular expression for lodging validation
    const specialCharRegex = /^[^a-zA-Z0-9]/;

    // Flag to track if the user has interacted with destination input
    let hasInteractedWithDestination = false;

    // Validate destination input
    function validateDestination() {
        const value = destinationInput.value;

        if (hasInteractedWithDestination) {
            if (isOnlySpaceRegex.test(value) || invalidStartRegex.test(value) || isTooShortRegex.test(value) || startsWithSpecialCharRegex.test(value)) {
                destinationError.style.display = "block"; // Show error if invalid input
                return false;
            } else {
                destinationError.style.display = "none"; // Hide error if valid input
                return true;
            }
        }

        destinationError.style.display = "none"; // Hide error if the user hasn't interacted
        return true;
    }

    // Validate lodging input
    function validateLodging() {
        const value = lodgingInput.value.trim();

        if (value.length === 0 || specialCharRegex.test(value)) {
            lodgingError.style.display = "block"; // Show error if invalid input
            return false;
        } else {
            lodgingError.style.display = "none"; // Hide error if valid input
            return true;
        }
    }

    // Add event listener for validating destination input
    destinationInput.addEventListener("keyup", () => {
        hasInteractedWithDestination = true;
        validateDestination();
    });

    destinationInput.addEventListener("blur", () => {
        hasInteractedWithDestination = true;
        validateDestination();
    });

    // Add event listener for validating lodging input
    lodgingInput.addEventListener("keyup", validateLodging);
    lodgingInput.addEventListener("blur", validateLodging);

    // Form submission prevention if any validation fails
    form.addEventListener("submit", (event) => {
        const isDestinationValid = validateDestination();
        const isLodgingValid = validateLodging();

        // If either destination or lodging is invalid, prevent form submission
        if (!isDestinationValid || !isLodgingValid) {
            event.preventDefault(); // Prevent form submission
            console.log("Form submission prevented due to invalid inputs.");
        } else {
            console.log("Form submitted successfully.");
        }
    });
});
  
  const submitButton = document.querySelector("#submit-button");
  destinationInput.addEventListener("keyup", () => {
    submitButton.disabled = isInvalid;
  });

  function showToast(message, dayNumber, type = 'error') {
    // Find the specific day container by day number
    const dayContainer = document.querySelector(`.day-container[data-day="${dayNumber}"]`);
    
    // Create the toast container div
    const toast = document.createElement('div');
    toast.classList.add('toast', type);
    toast.innerHTML = message;
    
    // Append the toast inside the day container
    dayContainer.appendChild(toast);
    
    // Remove the toast after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}