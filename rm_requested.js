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

            // Update the duration text
            durationText.innerHTML = `<b>Duration:</b> ${duration} ${dayText}, ${nights} ${nightText}`;

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
        document.querySelectorAll(".add-time-btn").forEach(button => {
            button.addEventListener("click", function () {
                const dayNumber = this.getAttribute("data-day");
                addTimeSlot(dayNumber);
            });
        });
    }

    // Add a new time slot dynamically
    function addTimeSlot(dayNumber) {
        const timeSlotsContainer = document.getElementById(`time-slots-day-${dayNumber}`);
        const timeSlotDiv = document.createElement("div");
        timeSlotDiv.classList.add("time-slot");

        const uniqueId = Date.now(); // Unique ID for delete functionality
        timeSlotDiv.setAttribute("data-id", uniqueId);

        timeSlotDiv.innerHTML = ` 
           <div class="form-group time-slot-row">
                <input type="time" name="time_range[${dayNumber}][]" required>
                <input type="time" name="time_range[${dayNumber}][]" required>
                <input type="text" name="activity[${dayNumber}][]" placeholder="Activity..." required>
                <button type="button" class="delete-time-btn" data-id="${uniqueId}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        timeSlotsContainer.appendChild(timeSlotDiv);

        // Add event listener for the delete button
        timeSlotDiv.querySelector(".delete-time-btn").addEventListener("click", function () {
            deleteTimeSlot(uniqueId);
        });
    }

    // Delete a specific time slot
    function deleteTimeSlot(uniqueId) {
        const timeSlot = document.querySelector(`.time-slot[data-id="${uniqueId}"]`);
        if (timeSlot) {
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
            const endTime = timeSlot.querySelector("input[name^='time_range']").value;
            const activity = timeSlot.querySelector("input[name^='activity']").value;
    
            // Push values into the respective arrays
            dayNumbers.push(dayNumber);
            dates.push(formattedDate); // Push the properly formatted date
            days.push(dayOfWeek); // Use dayOfWeek instead of day
            startTimes.push(startTime);
            endTimes.push(endTime);
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
