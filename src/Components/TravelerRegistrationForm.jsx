import React, { useState } from 'react';
import './TravelerRegistrationForm.css';
import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json'
  }
});

// API Configuration - can be changed easily
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost/RoutePro-backend(02)/public';

export default function TravelerRegistrationForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const validateName = (name) => {
    return /^[a-zA-Z\s]+$/.test(name);
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/[\s-]/g, '');
    return /^0\d{9}$/.test(cleaned) || /^7\d{8}$/.test(cleaned);
  };

  const validatePassword = (password) => {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Step 1: Terms agreement must be ticked
    if (!form.agree) {
      alert('You must agree to the Terms and Conditions and Privacy Policy.');
      return;
    }

    // Step 2: Validate each field in order
    if (!validateName(form.name)) {
      alert('Name can only contain letters and spaces.');
      return;
    }

    if (!validateEmail(form.email)) {
      alert('Invalid email format.');
      return;
    }

    if (!validatePhone(form.phone)) {
      alert('Phone number must be either 10 digits starting with 0 or 9 digits starting with 7.');
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
    
    // Add role to the payload
    submitData.role = 'traveller';

    setLoading(true);
    try {
      const response = await api.post(
        `${API_BASE_URL}/auth/register`,
        submitData
      );

      if (response.data.success) {
        alert('Traveller registered successfully!');
        setForm({
          name: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          agree: false,
        });
        // Redirect to login page after user clicks OK on alert
        window.location.href = '/user-login';
      } else {
        alert('Error: ' + (response.data.message || 'Unknown server error'));
      }
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || 
                           error.response.data?.error || 
                           `Server error: ${error.response.status}`;
        alert('Registration failed: ' + errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        alert('Network error: Unable to connect to server. Please check if the backend is running.');
      } else {
        // Something else happened
        alert('Registration failed: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="traveler-form-container">
      <div className="form-header">
        <div className="icon-circle">✈️</div>
        <h2>Join as Traveller</h2>
        <p>Create your Traveller account</p>
      </div>

      <form onSubmit={handleSubmit} className="traveler-form">
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
          placeholder="example@mail.com" 
          value={form.email} 
          onChange={handleChange} 
          required 
        />
        
        <input 
          name="phone" 
          type="tel" 
          placeholder="Phone (starts with 0 or 7)" 
          value={form.phone} 
          onChange={handleChange} 
          required 
        />
        
        <input 
          name="password" 
          type="password" 
          placeholder="Password (min 8 chars)" 
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
            <a href="/termsconditions" target="_blank" rel="noopener noreferrer">
              Terms and Conditions
            </a>{' '}
            and{' '}
            <a href="/privacypolicy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
          </label>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Registering...' : 'Create Traveller Account'}
        </button>

        <div className="signin-text">
          Already have an account? <a href="/user-login">Sign in here</a>
        </div>
      </form>
    </div>
  );
}
