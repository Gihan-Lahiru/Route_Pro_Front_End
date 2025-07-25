import React from 'react';
import './MetricsSummary.css';

const metrics = [
  { title: 'Total Trips', value: '156', subtext: 'All time bookings' },
  { title: 'Active Customers', value: '89', subtext: 'Currently active' },
  { title: 'Revenue', value: '$285,600', subtext: 'This year' },
  { title: 'Growth', value: '+12.5%', subtext: 'vs last month' }
];

const MetricsSummary = () => (
  <div className="metrics-row">
    {metrics.map((item, idx) => (
      <div key={idx} className="metric-card">
        <h3>{item.title}</h3>
        <p className="metric-value">{item.value}</p>
        <span className="metric-sub">{item.subtext}</span>
      </div>
    ))}
  </div>
);

export default MetricsSummary;
