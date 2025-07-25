import React from 'react';
import './TripDetails.css';

const TripDetails = () => (
  <div className="trip-details">
    <h2>Trip Details</h2>

    {/* Trip 1 */}
    <div className="trip-card">
      <p><strong>Passenger:</strong> Aashiq</p>
      <p><strong>Pickup Time:</strong> 2:00 PM</p>
      <p><strong>Fare:</strong> Rs. 2400</p>
      <p><strong>Pickup Location:</strong> Nuwara Eliya</p>
      <p><strong>Vehicle:</strong> Toyota Prius / WP CAB 1234</p>
      <div className="trip-actions">
        <button>Start Trip</button>
        <button>View Map Routes</button>
        <button>Contact Rider</button>
      </div>
    </div>
<br></br>
    {/* Trip 2 */}
    <div className="trip-card">
      <p><strong>Passenger:</strong> Nimesha</p>
      <p><strong>Pickup Time:</strong> 3:30 PM</p>
      <p><strong>Fare:</strong> Rs. 3100</p>
      <p><strong>Pickup Location:</strong> Kandy</p>
      <p><strong>Vehicle:</strong> Honda Fit / CP CAB 5678</p>
      <div className="trip-actions">
        <button>Start Trip</button>
        <button>View Map Routes</button>
        <button>Contact Rider</button>
      </div>
    </div>
    
  </div>
);

export default TripDetails;
