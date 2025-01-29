document.addEventListener("DOMContentLoaded", function () {
    const startDateInput = document.getElementById("start-date");
    const endDateInput = document.getElementById("end-date");
    const durationText = document.getElementById("duration-text");
    const mainDayContainer = document.getElementById("main-day-container");
    const form = document.getElementById("itinerary-form");

    // Hide the "Add Itinerary" button initially
    document.querySelector('.add-itinerary-btn').style.display = 'none'; 

    // Listen for changes in the start and end dates
    function updateDuration() {
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);
    
        if (startDate && endDate && startDate <= endDate) {
            // Calculate the duration in days
            const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1; // +1 to include the start day
            const nights = duration > 1 ? duration - 1 : 0; // Nights is duration - 1, but can't be less than 0
            const dayText = duration === 1 ? "Day" : "Days";
            const nightText = nights === 1 ? "Night" : (nights === 0 ? "Night" : "Nights"); // Fix plural for 0 nights
    
            // Special condition for 1 Day and 0 Nights
            if (duration === 1 && nights === 0) {
                durationText.innerHTML = "<b>Duration:</b> Roundtrip";
            } else {
                // Update the duration text normally
                durationText.innerHTML = `<b>Duration:</b> ${duration} ${dayText}, ${nights} ${nightText}`;
            }
    
            // Generate day containers
            generateDayContainers(duration, startDate);
    
            // Show the "Add Itinerary" button only if there's at least one day-container
            if (duration > 0) {
                document.querySelector('.add-itinerary-btn').style.display = 'inline-block';
            }
        } else {
            durationText.innerHTML = `<b>Duration:</b> Invalid Dates`;
            mainDayContainer.innerHTML = ""; // Clear day containers
            document.querySelector('.add-itinerary-btn').style.display = 'none'; // Hide the button if dates are invalid
        }
    }

    // Generate day containers dynamically
    function generateDayContainers(duration, startDate) {
        mainDayContainer.innerHTML = ""; // Clear existing containers
        for (let i = 0; i < duration; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(currentDate.getDate() + i);

            // Format the date as 'Day #: Date (Day)'
            const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' }); // Get the day of the week
            const date = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); // Format the full date

            const dayContainer = document.createElement("div");
            dayContainer.classList.add("day-container");
            dayContainer.innerHTML = `
                <h3>Day ${i + 1}: ${date} (${dayOfWeek})</h3>
                <div class="time-slots-container" id="time-slots-day-${i + 1}">
                    <!-- Time slots will be added here -->
                </div>
                <button type="button" class="add-time-btn" data-day="${i + 1}">+ Add Time</button>
            `;
            mainDayContainer.appendChild(dayContainer);
        }

        // Add event listeners for "Add Time Slot" buttons
    document.querySelectorAll(".add-time-btn").forEach((button, index) => {
        button.addEventListener("click", function () {
          const dayNumber = button.getAttribute("data-day");
          const date = button.getAttribute("data-date");
          addTimeSlot(dayNumber, "", "", "", date);
        });
      });
    }
    
    let endTimes = [];
    // Add a new time slot dynamically
    function addTimeSlot(dayNumber, startTime = "", endTime = "", activity = "") {
      const timeSlotsContainer = document.getElementById(
        `time-slots-day-${dayNumber}`
      );
      const timeSlotDiv = document.createElement("div");
      timeSlotDiv.classList.add("time-slot");
      timeSlotDiv.dataset.day = dayNumber;
    
      const uniqueId = Date.now(); // Unique ID for delete functionality
      timeSlotDiv.setAttribute("data-id", uniqueId);
    
      timeSlotDiv.innerHTML = ` 
               <div class="form-group time-slot-row">
                    <input type="time" name="time_range[${dayNumber}][]" required value="${startTime}">
                    <input type="time" name="time_range[${dayNumber}][]" required value="${endTime}" disabled>
                    <input type="text" name="activity[${dayNumber}][]" placeholder="Activity..." required value="${activity}">
                    <button type="button" class="delete-time-btn" data-id="${uniqueId}">
                        <i class="fas fa-trash"></i>
                    </button>
                    <div class="divider"></div>
                </div>
            `;
    
      timeSlotsContainer.appendChild(timeSlotDiv);
    
      timeSlotDiv
        .querySelector(".delete-time-btn")
        .addEventListener("click", function () {
          deleteTimeSlot(uniqueId);
        });
    
      // Add event listener to validate time inputs
      const startTimeInput = timeSlotDiv.querySelector(
        "input[type='time']:nth-child(1)"
      );
      const endTimeInput = timeSlotDiv.querySelector(
        "input[type='time']:nth-child(2)"
      );
    
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
        
            // Locate the day-container
            const dayContainer = document.querySelector(`#time-slots-day-${dayNumber}`).closest('.day-container');
        
            // If it's not the first day, check that the startTime is not earlier than lastEndTime
            if (startTimeDate < lastTimeDate) {
                showToast(dayContainer, `Start time cannot be earlier than ${endTimes[dayNumber - 1]}`);
                startTimeInput.value = "";
                endTimeInput.disabled = true;
                return; // Prevent adding the time slot
            }
        }
        
        if (startTimeValue && endTimeValue) {
            const startTimeDate = new Date(`1970-01-01T${startTimeValue}:00`);
            const endTimeDate = new Date(`1970-01-01T${endTimeValue}:00`);
        
            // Locate the day-container
            const dayContainer = document.querySelector(`#time-slots-day-${dayNumber}`).closest('.day-container');
        
            if (startTimeDate >= endTimeDate) {
                showToast(dayContainer, "Start time must be earlier than end time.");
                endTimeInput.value = "";
                // Reset the end time if validation fails
                endTimeInput.setCustomValidity(
                    "Start time must be earlier than end time."
                );
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
    
    // Delete a specific time slot
    function deleteTimeSlot(uniqueId) {
      const timeSlot = document.querySelector(`.time-slot[data-id="${uniqueId}"]`);
      if (timeSlot) {
        if (endTimes.length) {
          const previous = timeSlot.previousElementSibling;
          if (previous) {
            endTimes[previous.dataset.day - 1] = previous.querySelector(
              "input[type='time']:nth-child(2)"
            ).value;
          } else if (endTimes[timeSlot.dataset.day - 1]) {
            endTimes.splice(timeSlot.dataset.day - 1, 1);
          }
        }
        timeSlot.remove();
      }
    }

    // Function to display the modal message
    function showModal(message, isError = false) {
        const modal = document.getElementById("modal-popup");
        const modalMessage = document.getElementById("modal-message");

        // Set the message
        modalMessage.textContent = message;

        // Add the appropriate class (error or success) based on the isError flag
        if (isError) {
            modal.classList.add("error-modal");
            modal.classList.remove("success-modal");
        } else {
            modal.classList.add("success-modal");
            modal.classList.remove("error-modal");
        }

        // Show the modal
        modal.style.display = "block";

        // Close the modal when the "close" button is clicked
        modal.querySelector(".close").addEventListener("click", function () {
            modal.style.display = "none";
        });
    }

    // Handle form submission and show modal
    document.querySelector(".add-itinerary-btn").addEventListener("click", function () {
        const dayNumbers = [];
        const dates = [];
        const days = [];
        const startTimes = [];
        const endTimes = [];
        const activities = [];
    
        // Collect day-wise data
        document.querySelectorAll(".day-container").forEach(function (dayContainer, index) {
            const dayNumber = index + 1;
        
            // Get the date and convert to YYYY-MM-DD format using local time
            const currentDate = new Date(dayContainer.querySelector("h3").innerText.split(":")[1].split("(")[0].trim());
            
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');  // Month is 0-based, so add 1
            const dayOfMonth = String(currentDate.getDate()).padStart(2, '0');  // Ensure two digits for the day
        
            const formattedDate = `${year}-${month}-${dayOfMonth}`;  // Format as YYYY-MM-DD
        
            const dayOfWeek = dayContainer.querySelector("h3").innerText.split("(")[1].split(")")[0].trim(); // Get the day of the week
        
            // Collect time slot data for the day
            const timeSlots = dayContainer.querySelectorAll(".time-slot");
            timeSlots.forEach(function (timeSlot) {
                const startTime = timeSlot.querySelector("input[name^='time_range']").value;
                const endTimeInput = timeSlot.querySelector("input[name^='time_range']:nth-child(2)");
                
                // Ensure the end time is enabled if there is a valid start time
                if (startTime && endTimeInput.disabled) {
                    endTimeInput.disabled = false;
                }
    
                const endTime = endTimeInput.value;
                const activity = timeSlot.querySelector("input[name^='activity']").value;
        
                // Push values into the respective arrays
                dayNumbers.push(dayNumber);
                dates.push(formattedDate); // Push the properly formatted date
                days.push(dayOfWeek); // Use dayOfWeek instead of day
                startTimes.push(startTime);
                endTimes.push(endTime); // Ensure end time is correctly captured
                activities.push(activity);
            });
        });    
    
        // Add hidden inputs for day data before submitting the form
        dayNumbers.forEach(function (value, index) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = "day_number[]";
            input.value = value;
            form.appendChild(input);
        });
    
        // Repeat for other day data arrays
        dates.forEach(function (value, index) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = "date[]";
            input.value = value;
            form.appendChild(input);
        });
    
        days.forEach(function (value, index) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = "day[]";
            input.value = value;
            form.appendChild(input);
        });
    
        startTimes.forEach(function (value, index) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = "start_time[]";
            input.value = value;
            form.appendChild(input);
        });
    
        endTimes.forEach(function (value, index) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = "end_time[]";
            input.value = value;
            form.appendChild(input);
        });
    
        activities.forEach(function (value, index) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = "activity[]";
            input.value = value;
            form.appendChild(input);
        });
    
        const formData = new FormData(form);
    
        fetch('submit_requested_itinerary.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            // Handle success
            if (data.includes("Itinerary has been successfully added")) {
                showModal("Itinerary has been successfully added!", false); // Success message
                form.reset(); // Reset form
                document.getElementById("duration-text").innerHTML = ""; // Clear duration text
                document.getElementById("main-day-container").innerHTML = ""; // Clear day containers
                document.querySelector('.add-itinerary-btn').style.display = 'none'; // Hide button
            } else {
                showModal("There was an error submitting your itinerary. \nPlease fill up all the required fields.", true); // Error message
            }
        })
        .catch(error => {
            showModal("Error: " + error.message, true);
        });
    });

    // Add event listeners
    startDateInput.addEventListener("change", updateDuration);
    endDateInput.addEventListener("change", updateDuration);
});

document.addEventListener("DOMContentLoaded", () => {
    // Client's Name Validation
    const clientNameInput = document.getElementById("client-name");
    const clientNameError = document.getElementById("client-name-error");

    // Regular expressions for Client's Name validation (same as destination)
    const invalidStartRegex = /^[\s][a-zA-Z0-9]/;
    const isOnlySpaceRegex = /^\s*$/;
    const isTooShortRegex = /^.{1}$/;
    const startsWithSpecialCharRegex = /^[^\w\s]/;

    // Flag to track if the user has interacted with client name input
    let hasInteractedWithClientName = false;

    // Validate Client's Name input
    function validateClientName() {
        const value = clientNameInput.value;

        if (hasInteractedWithClientName) {
            if (isOnlySpaceRegex.test(value) || invalidStartRegex.test(value) || isTooShortRegex.test(value) || startsWithSpecialCharRegex.test(value)) {
                clientNameError.style.display = "block"; // Show error if invalid input
                return false;
            } else {
                clientNameError.style.display = "none"; // Hide error if valid input
                return true;
            }
        }

        clientNameError.style.display = "none"; // Hide error if the user hasn't interacted
        return true;
    }

    // Add event listener for validating Client's Name input
    clientNameInput.addEventListener("keyup", () => {
        hasInteractedWithClientName = true;
        validateClientName();
    });

    clientNameInput.addEventListener("blur", () => {
        hasInteractedWithClientName = true;
        validateClientName();
    });

    // Destination Validation
    const destinationInput = document.getElementById("destination");
    const destinationError = document.getElementById("destination-error");

    // Regular expressions for destination validation
    const isOnlySpaceRegexDest = /^\s*$/;
    const invalidStartRegexDest = /^[\s][a-zA-Z0-9]/;
    const isTooShortRegexDest = /^.{1}$/;
    const startsWithSpecialCharRegexDest = /^[^\w\s]/;

    // Flag to track if the user has interacted with destination input
    let hasInteractedWithDestination = false;

    // Validate destination input
    function validateDestination() {
        const value = destinationInput.value;

        if (hasInteractedWithDestination) {
            if (isOnlySpaceRegexDest.test(value) || invalidStartRegexDest.test(value) || isTooShortRegexDest.test(value) || startsWithSpecialCharRegexDest.test(value)) {
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

    // Add event listener for validating destination input
    destinationInput.addEventListener("keyup", () => {
        hasInteractedWithDestination = true;
        validateDestination();
    });

    destinationInput.addEventListener("blur", () => {
        hasInteractedWithDestination = true;
        validateDestination();
    });

    // Lodging Validation
    const lodgingInput = document.getElementById("lodging");
    const lodgingError = document.getElementById("lodging-error");

    // Regular expression for lodging validation
    const specialCharRegex = /^[^a-zA-Z0-9]/;

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

    // Add event listener for validating lodging input
    lodgingInput.addEventListener("keyup", validateLodging);
    lodgingInput.addEventListener("blur", validateLodging);

    // Get the form for submission handling
    const form = document.getElementById("itinerary-form");

    // Form submission prevention if any validation fails
    form.addEventListener("submit", (event) => {
        const isDestinationValid = validateDestination();
        const isLodgingValid = validateLodging();
        const isClientNameValid = validateClientName(); // Add validation for Client's Name

        // If any validation fails, prevent form submission
        if (!isDestinationValid || !isLodgingValid || !isClientNameValid) {
            event.preventDefault(); // Prevent form submission
            console.log("Form submission prevented due to invalid inputs.");
        } else {
            console.log("Form submitted successfully.");
        }
    });
});

function showToast(dayContainer, message, isError = true) {
    // Check if there's already a toast and remove it to prevent duplicates
    const existingToast = dayContainer.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create a new toast element
    const toast = document.createElement('div');
    toast.className = `toast ${isError ? 'error-toast' : 'success-toast'}`;
    toast.textContent = message;

    // Style the toast
    toast.style.position = 'relative';
    toast.style.padding = '10px';
    toast.style.marginTop = '10px';
    toast.style.backgroundColor = isError ? 'rgba(255, 0, 0, 0.8)' : 'rgba(0, 255, 0, 0.8)';
    toast.style.color = '#fff';
    toast.style.borderRadius = '5px';
    toast.style.textAlign = 'center';
    toast.style.fontSize = '14px';
    toast.style.zIndex = '10';

    // Append the toast to the day container
    dayContainer.appendChild(toast);

    // Automatically remove the toast after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}