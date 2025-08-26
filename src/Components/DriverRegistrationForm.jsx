import React, { useState } from 'react';
import './DriverRegistrationForm.css';
import axios from 'axios';

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

  // Validation functions
  const validateName = (name) => /^[a-zA-Z\s]+$/.test(name);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => {
    const cleaned = phone.replace(/[\s-]/g, '');
    return /^0\d{9}$/.test(cleaned) || /^7\d{8}$/.test(cleaned);
  };
  const validateLicense = (license) => /^[a-zA-Z0-9]+$/.test(license);
  const validatePassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Terms checkbox
    if (!form.agree) {
      alert('You must agree to the Terms and Conditions and Privacy Policy.');
      return;
    }

    // Field validation
    if (!validateName(form.name)) {
      alert('Name can only contain letters and spaces.');
      return;
    }
    if (!validateEmail(form.email)) {
      alert('Invalid email format.');
      return;
    }
    if (!validatePhone(form.phone)) {
      alert('Phone number must be 10 digits starting with 0 or 9 digits starting with 7.');
      return;
    }
    if (!validateLicense(form.license_no)) {
      alert('License number must not contain symbols or spaces.');
      return;
    }
    if (!form.vehicle_type) {
      alert('Please select a vehicle type.');
      return;
    }
    if (isNaN(form.experience) || Number(form.experience) < 0) {
      alert('Experience must be a non-negative number.');
      return;
    }
    if (!form.location) {
      alert('Location is required.');
      return;
    }
    if (!validatePassword(form.password)) {
      alert('Password must be at least 8 characters and include letters, numbers, and a special character.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    // Prepare data
    const { confirmPassword, agree, ...submitData } = form;
    submitData.role = 'driver';

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost/RoutePro-backend/app/controllers/DriverController.php',
        submitData
      );

      if (response.data.success) {
        alert('Driver registered successfully!');
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
        alert('Error: ' + (response.data.message || 'Unknown server error'));
      }
    } catch (error) {
      console.error('Axios error:', error);
      alert('Network error. Please check your backend server and try again.');
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
        <input name="name" type="text" placeholder="Full Name" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="example@mail.com" value={form.email} onChange={handleChange} required />
        <input name="phone" type="tel" placeholder="Phone (starts with 0 or 7)" value={form.phone} onChange={handleChange} required />
        <input name="license_no" type="text" placeholder="License Number" value={form.license_no} onChange={handleChange} required />

        <select name="vehicle_type" value={form.vehicle_type} onChange={handleChange} required>
          <option value="">Select vehicle type</option>
          <option value="car">Car</option>
          <option value="minicar">Mini Car</option>
          <option value="van">Van</option>
          <option value="bike">Bike</option>
          <option value="tuk">Tuk</option>
        </select>

        <input name="experience" type="number" min="0" placeholder="Years of Experience" value={form.experience} onChange={handleChange} required />
        <input name="location" type="text" placeholder="Location" value={form.location} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password (min 8 chars)" value={form.password} onChange={handleChange} required />
        <input name="confirmPassword" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />

        <div className="checkbox-container">
          <label className="checkbox-label">
            <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} />
            I agree to the{' '}
            <a href="/termsconditions" target="_blank" rel="noopener noreferrer">Terms and Conditions</a>{' '}
            and{' '}
            <a href="/privacypolicy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
          </label>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Registering...' : 'Create Driver Account'}
        </button>

        <p className="signin-link">
          Already have an account? <a href="/user-login">Sign in here</a>
        </p>
      </form>
    </div>
  );
}
