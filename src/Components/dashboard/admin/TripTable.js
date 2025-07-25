import React from 'react';
import './TripTable.css';

const trips = [
  {
    id: 'TR-2024-001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    destination: 'Paris, France',
    dates: 'Mar 15–22, 2024',
    participants: 2,
    status: 'upcoming',
    amount: '$2,450'
  },
  {
    id: 'TR-2024-002',
    name: 'Mike Chen',
    email: 'mike.chen@email.com',
    destination: 'Tokyo, Japan',
    dates: 'Jan 10–20, 2024',
    participants: 1,
    status: 'completed',
    amount: '$3,200'
  },
    {
    id: 'TR-2024-001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    destination: 'Paris, France',
    dates: 'Mar 15–22, 2024',
    participants: 2,
    status: 'upcoming',
    amount: '$2,450'
  },
   {
    id: 'TR-2024-002',
    name: 'Mike Chen',
    email: 'mike.chen@email.com',
    destination: 'Tokyo, Japan',
    dates: 'Jan 10–20, 2024',
    participants: 1,
    status: 'completed',
    amount: '$3,200'
  },
  {
    id: 'TR-2024-001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    destination: 'Paris, France',
    dates: 'Mar 15–22, 2024',
    participants: 2,
    status: 'upcoming',
    amount: '$2,450'
  },
    {
    id: 'TR-2024-002',
    name: 'Mike Chen',
    email: 'mike.chen@email.com',
    destination: 'Tokyo, Japan',
    dates: 'Jan 10–20, 2024',
    participants: 1,
    status: 'completed',
    amount: '$3,200'
  },
  
];

const TripTable = () => (
  <div className="trip-table">
    <h2>Trip Management</h2>
    <table>
      <thead>
      <tr>
          <th>Booking ID</th>
          <th>Customer</th>
          <th>Destination</th>
          <th>Dates</th>
          <th>Participants</th>
          <th>Status</th>
          <th>Amount</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {trips.map(trip => (
          <tr key={trip.id}>
            <td>{trip.id}</td>
            <td>
              {trip.name}
              <br />
              <span className="email">{trip.email}</span>
            </td>
            <td> {trip.destination}</td>
            <td>{trip.dates}</td>
            <td>{trip.participants}</td>
            <td className={`status ${trip.status}`}>{trip.status}</td>
            <td>{trip.amount}</td>
            <td>
              <button>View</button>
              <button>Manage</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TripTable;
