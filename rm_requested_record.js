document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector('.requested-record-container');

    function formatDateRange(startDate, endDate) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
    
        const start = new Date(startDate).toLocaleDateString('en-US', options);
        const end = new Date(endDate).toLocaleDateString('en-US', options);
    
        // Return the formatted range
        return `${start} - ${end}`;
    }

    // Fetch itineraries data from the PHP script
    fetch('fetch_requested_itineraries.php')
    .then(response => response.json())
    .then(data => {
        data.forEach(itinerary => {
            const formattedDates = formatDateRange(itinerary.start_date, itinerary.end_date);

            const itineraryWidget = document.createElement('div');
            itineraryWidget.classList.add('itinerary-widget');
            itineraryWidget.innerHTML = `
                <div class="widget-content">
                    <h4>${itinerary.client_name}</h4>
                    <p><strong>Destination:</strong> ${itinerary.destination}</p>
                    <p><strong>Duration:</strong> ${itinerary.formatted_duration}</p>
                    <p><strong>Lodging:</strong> ${itinerary.lodging}</p>
                    <p><strong>Date:</strong> ${formattedDates}</p>
                </div>
                <button class="view-details-btn" data-id="${itinerary.id}">View Details</button>
            `;
            container.appendChild(itineraryWidget);

            // Add event listener for both widget click and button click
            itineraryWidget.addEventListener('click', function () {
                showItineraryDetails(itinerary.id, data);
            });
        });


            // Add event listeners for "View Details" buttons
            document.querySelectorAll('.view-details-btn').forEach(button => {
                button.addEventListener('click', function () {
                    const itineraryId = this.getAttribute('data-id');
                    showItineraryDetails(itineraryId, data);
                });
            });
        });
});

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
                                    </tr>
                                </thead>
                                <tbody>
                                    ${dayGroups[dayNumber].map(day => `
                                        <tr>
                                            <td style="text-align: center; font-weight:">${convertTo12HourFormat(day.start_time)} - ${convertTo12HourFormat(day.end_time)}</td>
                                            <td>${day.activity}</td>
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
}

/// Function to delete requested itinerary
function deleteItinerary(itineraryId, modal) {
    // Show a confirmation prompt
    const isConfirmed = confirm("Are you sure you want to delete this itinerary?");
    
    // If the user confirms, proceed with the deletion
    if (isConfirmed) {
        fetch(`delete_requested_itinerary.php?id=${itineraryId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Remove the deleted itinerary from the frontend
                alert('Itinerary deleted successfully');
                // Close the modal
                modal.style.display = 'none';
                modal.remove();
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
