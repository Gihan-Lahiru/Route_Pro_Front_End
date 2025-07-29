import React, { useState } from 'react';
import './DriverRegistrationForm.css';
import axios from 'axios';
import DriverDashboard from './dashboard/driver/DriverDashboard/DriverDashboard';

export default function DriverRegistrationForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    license_no: '',
    vehicle_type: '',
    experience: '',
    location: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validations
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (!form.agree) {
      alert('Please agree to the terms and conditions');
      return;
    }

    if (isNaN(form.experience) || Number(form.experience) < 0) {
      alert('Experience must be a non-negative number');
      return;
    }

    setLoading(true);


    // Prepare data to send (exclude confirmPassword and agree)
    const { confirmPassword, agree, ...submitData } = form;


    try {
      const response = await axios.post(
        'http://localhost/RoutePro-backend/app/controllers/DriverController.php',
        submitData
      );

      console.log('Server Response:', response.data);

      if (response.data.success) {
        alert('Driver registered successfully!');
        // Reset form
        setForm({
          name: '',
          email: '',
          phone: '',
          license_no: '',
          vehicle_type: '',
          experience: '',
          location: '',
          password: '',
          confirmPassword: '',
          agree: false,
        });
      } else {
        alert('Error: ' + (response.data.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Something went wrong. Please try again.');
      console.error('Axios error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="driver-form-container">
      <div className="form-header">
        <div className="icon-circle">🚗</div>
        <h2>Become a Driver</h2>
        <p>Create your Driver account</p>
      </div>

      <form onSubmit={handleSubmit} className="driver-form">
        <input
          name="name"
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          type="tel"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <input
          name="license_no"
          type="text"
          placeholder="License Number"
          value={form.license_no}
          onChange={handleChange}
          required
        />

        <select
          name="vehicle_type"
          value={form.vehicle_type}
          onChange={handleChange}
          required
        >
          <option value="">Select vehicle type</option>
          <option value="car">Car</option>
          <option value="minicar">Mini Car</option>
          <option value="van">Van</option>
          <option value="bike">Bike</option>
          <option value="tuk">Tuk</option>
        </select>

        <input
          name="experience"
          type="number"
          placeholder="Years of Experience"
          value={form.experience}
          onChange={handleChange}
          required
          min="0"
        />
        <input
          name="location"
          type="text"
          placeholder="Location (city/area)"
          value={form.location}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <div className="checkbox-container">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
            />
            I agree to the{' '}
            <a href="/terms" target="_blank" rel="noopener noreferrer">
              Terms and Conditions
            </a>{' '}
            and{' '}
            <a href="/privacy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
          </label>
        </div>


        

        <p className="signin-link">
          Already have an account? <a href="/login">Sign in here</a>
        </p>
      </form>
    </div>
  );
}
