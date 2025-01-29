document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector('.requested-record-container');
    const filterButton = document.getElementById('filter-btn');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');

    // Function to format the date range
    function formatDateRange(startDate, endDate) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const start = new Date(startDate).toLocaleDateString('en-US', options);
        const end = new Date(endDate).toLocaleDateString('en-US', options);
        return `${start} - ${end}`;
    }

    // Function to check if two date ranges overlap
    function isDateRangeOverlap(itineraryStart, itineraryEnd, filterStart, filterEnd) {
        const itineraryStartDate = new Date(itineraryStart);
        const itineraryEndDate = new Date(itineraryEnd);
        const filterStartDate = new Date(filterStart);
        const filterEndDate = new Date(filterEnd);

        // Check if there is an overlap between the two date ranges
        return (itineraryStartDate <= filterEndDate && itineraryEndDate >= filterStartDate);
    }

    // Function to fetch and display itineraries
    function fetchItineraries(startDate = '', endDate = '') {
        fetch('fetch_requested_itineraries.php')
        .then(response => response.json())
        .then(data => {
            // Clear the previous results
            container.innerHTML = '';

            // Loop through the data and create the itinerary widgets
            data.forEach(itinerary => {
                // Check if itinerary's date range overlaps with the filter date range
                if (startDate && endDate) {
                    if (isDateRangeOverlap(itinerary.start_date, itinerary.end_date, startDate, endDate)) {
                        const formattedDates = formatDateRange(itinerary.start_date, itinerary.end_date);

                        const itineraryWidget = document.createElement('div');
                        itineraryWidget.classList.add('itinerary-widget');
                        itineraryWidget.innerHTML = `
                            <div class="widget-content">
                                <h4>${itinerary.client_name}</h4>
                                <p><strong>Destination:</strong> ${itinerary.destination}</p>
                                <p><strong>Date:</strong> ${formattedDates}</p>
                                <p><strong>Duration:</strong> ${itinerary.formatted_duration}</p>
                                <p><strong>Lodging:</strong> ${itinerary.lodging}</p>
                            </div>
                            <button class="edit-details-btn" data-id="${itinerary.id}">Edit</button>
                            <button class="view-details-btn" data-id="${itinerary.id}">View Details</button>
                        `;
                        container.appendChild(itineraryWidget);

                        // Add event listeners for View and Edit buttons
                        itineraryWidget.querySelector('.view-details-btn').addEventListener('click', function () {
                            showItineraryDetails(itinerary.id, data);
                        });

                        itineraryWidget.querySelector('.edit-details-btn').addEventListener('click', function () {
                            openEditModal(itinerary);
                        });
                    }
                } else {
                    // No filter applied, display all itineraries
                    const formattedDates = formatDateRange(itinerary.start_date, itinerary.end_date);

                    const itineraryWidget = document.createElement('div');
                    itineraryWidget.classList.add('itinerary-widget');
                    itineraryWidget.innerHTML = `
                        <div class="widget-content">
                            <h4>${itinerary.client_name}</h4>
                            <p><strong>Destination:</strong> ${itinerary.destination}</p>
                            <p><strong>Date:</strong> ${formattedDates}</p>
                            <p><strong>Duration:</strong> ${itinerary.formatted_duration}</p>
                            <p><strong>Lodging:</strong> ${itinerary.lodging}</p>
                        </div>
                        <button class="edit-details-btn" data-id="${itinerary.id}">Edit</button>
                        <button class="view-details-btn" data-id="${itinerary.id}">View Details</button>
                    `;
                    container.appendChild(itineraryWidget);

                    // Add event listeners for View and Edit buttons
                    itineraryWidget.querySelector('.view-details-btn').addEventListener('click', function () {
                        showItineraryDetails(itinerary.id, data);
                    });

                    itineraryWidget.querySelector('.edit-details-btn').addEventListener('click', function () {
                        openEditModal(itinerary);
                    });
                }
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('Failed to fetch itineraries.');
        });
    }

    // Initial fetch to display all itineraries on page load
    fetchItineraries();

    // Handle filter button click
    filterButton.addEventListener('click', function () {
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;

        // If no dates are selected, alert the user
        if (!startDate || !endDate) {
            alert('Please select both start and end dates.');
            return;
        }

        // Fetch and display filtered itineraries
        fetchItineraries(startDate, endDate);

        // Change the button text to "Clear"
        filterButton.textContent = 'Clear';

        // Add event listener for the "Clear" button
        filterButton.removeEventListener('click', handleFilterClick);  // Remove filter handler
        filterButton.addEventListener('click', handleClearClick); // Add clear handler
    });

    // Handle clear button click
    function handleClearClick() {
        // Reset the date inputs
        startDateInput.value = '';
        endDateInput.value = '';

        // Fetch and display all itineraries again
        fetchItineraries();

        // Change the button text back to "Filter"
        filterButton.textContent = 'Filter';

        // Add event listener for the "Filter" button
        filterButton.removeEventListener('click', handleClearClick);  // Remove clear handler
        filterButton.addEventListener('click', handleFilterClick); // Add filter handler back
    }

    // Handle the filter button click event (before "Clear" button is activated)
    function handleFilterClick() {
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;

        // If no dates are selected, alert the user
        if (!startDate || !endDate) {
            alert('Please select both start and end dates.');
            return;
        }

        // Fetch and display filtered itineraries
        fetchItineraries(startDate, endDate);

        // Change the button text to "Clear"
        filterButton.textContent = 'Clear';

        // Add event listener for the "Clear" button
        filterButton.removeEventListener('click', handleFilterClick);  // Remove filter handler
        filterButton.addEventListener('click', handleClearClick); // Add clear handler
    }
});

    function openEditModal(itinerary) {
        const modal = document.createElement('div');
        modal.classList.add('modal');
    
        // Store the original data for comparison later
        const originalData = { ...itinerary };
    
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h1>Edit Itinerary</h1>
                <form id="edit-itinerary-form">
                    <div class="form-group">
                        <label>Client Name:</label>
                        <input type="text" name="client_name" value="${itinerary.client_name}" required />
                    </div>
                    <div class="form-group">
                        <label>Destination:</label>
                        <input type="text" name="destination" value="${itinerary.destination}" required />
                    </div>
                    <div class="form-group">
                        <label>Lodging:</label>
                        <input type="text" name="lodging" value="${itinerary.lodging}" required />
                    </div>
                    <!-- These fields are removed, but still part of the update logic -->
                    <input type="hidden" name="start_date" value="${itinerary.start_date}" />
                    <input type="hidden" name="end_date" value="${itinerary.end_date}" />
                    <input type="hidden" name="formatted_duration" value="${itinerary.formatted_duration}" />
                    
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
    
        // Handle form submission to update itinerary
        const form = document.getElementById('edit-itinerary-form');
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(form);
            const updatedData = {
                id: itinerary.id,
                client_name: formData.get('client_name'),
                destination: formData.get('destination'),
                lodging: formData.get('lodging'),
                start_date: formData.get('start_date'),
                end_date: formData.get('end_date'),
                formatted_duration: formData.get('formatted_duration')
            };
            updateItinerary(updatedData, modal, originalData); // Pass original data for comparison
        });
    }
    
    function updateItinerary(updatedData, modal, originalData) {
        // Check if the values are different from the original ones
        const isUpdated = updatedData.client_name !== originalData.client_name ||
                          updatedData.destination !== originalData.destination ||
                          updatedData.lodging !== originalData.lodging;
    
        if (!isUpdated) {
            // If no updates were made, show the 'No changes were made' toast
            showToast('No changes were made', 'error');
            modal.style.display = 'none';
            modal.remove();
            return;
        }
    
        fetch('update_requested_itinerary.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Show the success toast
                showToast('Itinerary updated successfully', 'success');
                modal.style.display = 'none';
                modal.remove();
                
                // Delay the page reload by 3 seconds (to allow the toast to fade)
                setTimeout(() => {
                    location.reload(); // Reload the page after the toast fades
                }, 2000); // Adjust time to match your toast's duration
            } else {
                showToast('Error updating itinerary', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('Failed to update itinerary', 'error');
        });
    }

// Function to convert 24-hour time to 12-hour format
function convertTo12HourFormat(time) {
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12; // 12 AM or 12 PM
    return `${hour}:${minutes} ${ampm}`;
}


function showItineraryDetails(itineraryId, data) {
    const itinerary = data.find(itinerary => itinerary.id == itineraryId);
    const modal = document.createElement('div');
    modal.classList.add('modal');


    // Grouping the days by day_number
    const dayGroups = groupByDay(itinerary.days);


    // Helper function to format date ranges
    function formatDateRange(startDate, endDate) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const start = new Date(startDate).toLocaleDateString('en-US', options);
        const end = new Date(endDate).toLocaleDateString('en-US', options);
        return `${start} - ${end}`;
    }


    // Format the itinerary date range
    const formattedDateRange = formatDateRange(itinerary.start_date, itinerary.end_date);


    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h1>${itinerary.destination}</h1>
            <p><strong>Client's Name:</strong> ${itinerary.client_name}</p>
            <p><strong>Destination:</strong> ${itinerary.destination}</p>
            <p><strong>Date:</strong> ${formattedDateRange}</p>
            <p><strong>Lodging:</strong> ${itinerary.lodging}</p>
            <p><strong>Duration:</strong> ${itinerary.formatted_duration}</p>


            <div class="day-groups">
                ${Object.keys(dayGroups).map(dayNumber => {
                    const day = dayGroups[dayNumber][0]; // First day object for this day_number


                    // Format the day's date
                    const formattedDayDate = new Date(day.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });


                    return `
                        <div class="day-group">
                            <h2>Day ${dayNumber}: ${formattedDayDate} (${day.day})</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Activity</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${dayGroups[dayNumber].map(day => `
                                        <tr>
                                            <td style="text-align: center; font-weight:">${convertTo12HourFormat(day.start_time)} - ${convertTo12HourFormat(day.end_time)}</td>
                                            <td>${day.activity}</td>
                                            <td><button class="edit-day-btn" data-day-id="${day.id}" data-itinerary-id="${itineraryId}">Edit</button></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `;
                }).join('')}
            </div>
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
   
    // Add the event listener for the delete button
    document.getElementById('delete-itinerary').addEventListener('click', function() {
        deleteItinerary(itineraryId, modal);
    });

    // Add event listeners for edit buttons
    modal.querySelectorAll('.edit-day-btn').forEach(button => {
        button.addEventListener('click', function() {
            const dayId = this.getAttribute('data-day-id');
            const itineraryId = this.getAttribute('data-itinerary-id');
            openEditDayModal(dayId, itineraryId);
        });
    });
}

function openEditDayModal(dayId, itineraryId) {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    // Fetch the day details using dayId and itineraryId
    const fetchUrl = `fetch_day_details.php?day_id=${dayId}&itinerary_id=${itineraryId}`;
    fetch(fetchUrl)
        .then(response => response.json())
        .then(day => {
            if (day.error) {
                alert('Failed to fetch day details');
                return;
            }

            const originalData = { // Save the original data
                start_time: day.start_time,
                end_time: day.end_time,
                activity: day.activity
            };

            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h1>Edit Day</h1>
                    <form id="edit-day-form">
                        <div class="form-group">
                            <label>Start Time:</label>
                            <input type="time" name="start_time" value="${day.start_time}" required />
                        </div>
                        <div class="form-group">
                            <label>End Time:</label>
                            <input type="time" name="end_time" value="${day.end_time}" required />
                        </div>
                        <div class="form-group">
                            <label>Activity:</label>
                            <input type="text" name="activity" value="${day.activity}" required />
                        </div>
                        <button type="submit">Save Changes</button>
                    </form>
                </div>
            `;

            // Attach the modal to the body and display it
            document.body.appendChild(modal);
            modal.style.display = 'block';

            // Close the modal when clicking on the close button
            modal.querySelector('.close').addEventListener('click', function () {
                modal.style.display = 'none';
                modal.remove();
            });

            // Handle form submission to update day details
            const form = document.getElementById('edit-day-form');
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                const formData = new FormData(form);
                const updatedDayData = {
                    day_id: dayId,
                    itinerary_id: itineraryId,
                    start_time: formData.get('start_time'),
                    end_time: formData.get('end_time'),
                    activity: formData.get('activity'),
                    original_start_time: originalData.start_time,
                    original_end_time: originalData.end_time,
                    original_activity: originalData.activity
                };
                updateDayDetails(updatedDayData, modal);
            });
        })
        .catch(error => {
            console.error('Error fetching day details:', error);
            alert('Failed to fetch day details');
        });
}

function updateDayDetails(updatedDayData, modal) {
    console.log('Updating day details with data:', updatedDayData); // Debugging statement

    // Check if any updates were actually made
    const isUpdated = updatedDayData.start_time !== updatedDayData.original_start_time ||
                      updatedDayData.end_time !== updatedDayData.original_end_time ||
                      updatedDayData.activity !== updatedDayData.original_activity;

    if (!isUpdated) {
        // Show a "No changes were made" toast if no changes are detected
        showToast('No changes were made', 'error');
        modal.style.display = 'none';
        modal.remove();
        return;
    }

    fetch('update_day_details.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDayData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Update response:', data); // Debugging statement

        if (data.success) {
            showToast('Day details updated successfully', 'success');
            modal.style.display = 'none';
            modal.remove();

            // Update the DOM with the new data
            const dayRow = document.querySelector(`button[data-day-id="${updatedDayData.day_id}"]`).closest('tr');
            dayRow.querySelector('td:nth-child(1)').textContent = `${convertTo12HourFormat(updatedDayData.start_time)} - ${convertTo12HourFormat(updatedDayData.end_time)}`;
            dayRow.querySelector('td:nth-child(2)').textContent = updatedDayData.activity;
        } else {
            showToast('Error updating day details', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Failed to update day details', 'error');
    });
}

/// Function to delete requested itinerary
function deleteItinerary(itineraryId, modal) {
    // Create the delete confirmation modal
    const confirmModal = document.createElement('div');
    confirmModal.classList.add('modal', 'confirmation-modal');
    
    // Modal content for confirmation
    confirmModal.innerHTML = `
        <div class="modal-content" style="width: 80%; max-width: 400px; margin-top: 150px;">
            <span class="close">&times;</span>
            <p style="color: black; font-weight= bolder; font-size: 18px;">Are you sure you want to delete this itinerary?</p>
            <div class="confirmation-buttons">
                <button id="confirm-delete" class="confirm-button">Yes, delete it</button>
                <button id="cancel-delete" class="cancel-button">Cancel</button>
            </div>
        </div>
    `;
    
    // Append the modal to the body
    document.body.appendChild(confirmModal);
    confirmModal.style.display = 'block';
    
    // Close the confirmation modal when clicking on the close button
    confirmModal.querySelector('.close').addEventListener('click', function () {
        confirmModal.style.display = 'none';
        confirmModal.remove();
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function (event) {
        if (event.target === confirmModal) {
            confirmModal.style.display = 'none';
            confirmModal.remove();
        }
    });
    
    // Handle the "Confirm" button click
    confirmModal.querySelector('#confirm-delete').addEventListener('click', function () {
        // Proceed with the itinerary deletion
        fetch(`delete_requested_itinerary.php?id=${itineraryId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Use the toast for success
                showToast('Itinerary deleted successfully', 'success');
                
                // Close and remove the modal
                modal.style.display = 'none';
                modal.remove();
                
                // Optionally, remove the deleted itinerary from the list if it's displayed elsewhere
                const itineraryButton = document.querySelector(`[data-id="${itineraryId}"]`);
                if (itineraryButton) {
                    itineraryButton.remove();
                }
                
                // Reload the page after the toast disappears (3 seconds after showing the toast)
                setTimeout(() => {
                    location.reload(); // This reloads the page
                }, 2000); // Adjust time to match your toast's duration
            } else {
                showToast('Error deleting itinerary', 'error');
            }
            // Close and remove the confirmation modal
            confirmModal.style.display = 'none';
            confirmModal.remove();
        })
        .catch(error => {
            console.error('Error deleting itinerary:', error);
            showToast('An error occurred while deleting the itinerary', 'error');
            confirmModal.style.display = 'none';
            confirmModal.remove();
        });
    });
    
    // Handle the "Cancel" button click
    confirmModal.querySelector('#cancel-delete').addEventListener('click', function () {
        // Just close the modal and do nothing
        confirmModal.style.display = 'none';
        confirmModal.remove();
    });
}


// Function to group days by day_number
function groupByDay(days) {
    return days.reduce((groups, day) => {
        if (!groups[day.day_number]) {
            groups[day.day_number] = [];
        }
        groups[day.day_number].push(day);
        return groups;
    }, {});

}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.classList.add('toast', type);
    toast.textContent = message;

    // Add the toast to the body
    document.body.appendChild(toast);

    // Remove the toast after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000); // Adjust time as needed
}