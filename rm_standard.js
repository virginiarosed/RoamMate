// Function to calculate and display the duration text and generate day input containers
function updateDurationTextAndDays() {
    const days = document.getElementById('duration-days').value;
    const nights = document.getElementById('duration-nights').value;
    const durationDisplay = document.getElementById('duration-text');

    if (days && nights >= 0) {
        durationDisplay.innerHTML = `<strong>Duration:</strong> ${days} Days, ${nights} Nights`;

        // Generate the day input containers dynamically based on the number of days
        const dayContainer = document.getElementById('main-day-container');
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
        durationDisplay.textContent = 'Please enter valid duration.';
    }
}

// Event listener for updating duration text and dynamically generating day input containers
document.getElementById('duration-days').addEventListener('change', updateDurationTextAndDays);
document.getElementById('duration-nights').addEventListener('change', updateDurationTextAndDays);

// Function to add more time inputs dynamically for any day
document.addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('add-time-btn')) {
        const dayNumber = event.target.getAttribute('data-day');
        const dayContainer = document.querySelector(`.day-container[data-day="${dayNumber}"]`);
        const timeSlotContainer = dayContainer.querySelector('.time-slot-container');

        // Find the last index for this day (based on the number of time slots already added)
        const timeInputs = timeSlotContainer.querySelectorAll(`input[name="time_range[${dayNumber}][]"]`).length;

        // Create new time slot and activity input fields
        const newTimeContainer = document.createElement('div');
        newTimeContainer.classList.add('form-group');

        newTimeContainer.innerHTML = `
            <input type="time" id="time-range-${dayNumber}-${timeInputs + 1}" name="time_range[${dayNumber}][]">
            <input type="time" id="time-range-end-${dayNumber}-${timeInputs + 1}" name="time_range[${dayNumber}][]">
            <input type="text" id="activity-${dayNumber}-${timeInputs + 1}" name="activity[${dayNumber}][]" placeholder="Activity...">
            <button type="button" class="delete-time-btn" data-day="${dayNumber}" data-index="${timeInputs + 1}">
                <i class="fas fa-trash"></i> <!-- Updated delete icon -->
            </button>
        `;

        // Append the new time slot input fields below the current time slots
        timeSlotContainer.appendChild(newTimeContainer);
    }

    // Delete a time slot and activity
    if (event.target && event.target.closest('.delete-time-btn')) {
        const button = event.target.closest('.delete-time-btn'); // Ensure we're targeting the button itself
        const dayNumber = button.getAttribute('data-day');
        const index = button.getAttribute('data-index');
        const dayContainer = document.querySelector(`.day-container[data-day="${dayNumber}"]`);
        const timeSlotContainer = dayContainer.querySelector('.time-slot-container');

        // Remove the corresponding time and activity input fields
        const timeContainers = timeSlotContainer.querySelectorAll(`.form-group`);

        // Loop through all form groups (time slot containers) and remove the one corresponding to the button clicked
        for (let i = 0; i < timeContainers.length; i++) {
            const currentContainer = timeContainers[i];
            const currentIndex = currentContainer.querySelector('button').getAttribute('data-index');

            if (currentIndex == index) {
                timeSlotContainer.removeChild(currentContainer); // Remove the entire row (time slot + activity + button)
                break; // Stop the loop once the correct row is found and removed
            }
        }
    }
});

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
                    button.textContent = `${itinerary.destination} (${itinerary.duration_days}D ${itinerary.duration_nights}N)`;
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
                                </tr>
                            </thead>
                            <tbody>
                                ${day.activities.map(activity => `
                                    <tr>
                                        <td style="text-align: center; font-weight:">${activity.start_time} - ${activity.end_time}</td>
                                        <td>${activity.activity}</td>
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
    }

// Function to delete itinerary
function deleteItinerary(itineraryId) {
    // Show a confirmation prompt
    const isConfirmed = confirm("Are you sure you want to delete this itinerary?");
    
    // If the user confirms, proceed with the deletion
    if (isConfirmed) {
        fetch(`delete_itinerary.php?id=${itineraryId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Remove the deleted itinerary from the frontend
                alert('Itinerary deleted successfully');
                // Close the modal
                document.getElementById('itinerary-modal').style.display = 'none';
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
        });
    } else {
        // If the user cancels, do nothing
        console.log("Deletion cancelled");
    }
}

// Adding event listener to the delete button inside the modal
document.getElementById('delete-itinerary').addEventListener('click', function() {
    const itineraryId = data.itinerary.id; // Get the itinerary ID from the modal data
    deleteItinerary(itineraryId);
});

});