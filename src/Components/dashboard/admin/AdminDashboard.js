import React from 'react';
import MetricsSummary from './MetricsSummary';
import TripTable from './TripTable';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <MetricsSummary />
      <TripTable />
    </div>
  );
};

export default AdminDashboard;
