import React, { useState } from "react";
import "./TravelerRegistrationForm.css";
import axios from "axios";

// Updated API configuration for PHP backend
const API_CONFIG = {
  BASE_URL: 'http://localhost/RoutePro-backend(02)', // Your PHP backend path
  ENDPOINTS: {
    REGISTER: '/app/controllers/TravellerController.php' // Direct path to PHP controller
  }
};

export default function TravelerRegistrationForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const validateName = (name) => /^[a-zA-Z\s]+$/.test(name);
  const validatePhone = (phone) => {
    const cleaned = phone.replace(/[\s-]/g, "");
    return /^0\d{9}$/.test(cleaned) || /^7\d{8}$/.test(cleaned);
  };
  const validatePassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Step 1: Check if terms are agreed
    if (!form.agree) {
      alert('You must agree to the Terms and Conditions and Privacy Policy.');
      return;
    }

    if (!validateName(form.name)) {
      alert("Name can only contain letters and spaces.");
      return;
    }
    if (!validateEmail(form.email)) {
      alert("Invalid email format.");
      return;
    }
    if (!validatePhone(form.phone)) {
      alert("Phone number must be either 10 digits starting with 0 or 9 digits starting with 7.");
      return;
    }
    if (!validatePassword(form.password)) {
      alert("Password must be at least 8 characters and include letters, numbers, and a special character.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const { confirmPassword, agree, ...submitData } = form;
    
    // Add role to the payload
    submitData.role = 'traveller';
    // Add action for PHP controller
    submitData.action = 'register';
    
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REGISTER}`,
        submitData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000 // 10 second timeout
        }
      );

      // Handle different response formats from PHP
      const responseData = typeof response.data === 'string' ? 
        JSON.parse(response.data) : response.data;

      if (responseData.success) {
        alert("Traveler registered successfully!");
        setForm({
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          agree: false,
        });
        // Redirect to login page after successful registration
        window.location.href = '/user-login';
      } else {
        alert("Error: " + (responseData.error || responseData.message || "Unknown server error"));
      }
    } catch (error) {
      console.error("Registration error:", error);
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
        alert('Network error: Unable to connect to server. Please check if the backend is running and CORS is configured.');
      } else {
        // Something else happened
        alert('Registration failed: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* Left Section - Image */}
      <div className="image-section">
        <img src="/images/traverller-reg.png" alt="Traveler" />
      </div>

      {/* Right Section - Form */}
      <div className="form-section">
        <div className="traveler-form-container">
          <div className="form-header">
            <img className="logo-image" src="/images/new logo.png" alt="Logo" />
            <h2>Welcome</h2>
            <p>Create your traveler account</p>
          </div>

          <form onSubmit={handleSubmit} className="traveler-form">
            <input 
              name="name" 
              type="text" 
              placeholder="Enter your full name" 
              value={form.name} 
              onChange={handleChange} 
              required 
            />
            <input 
              name="phone" 
              type="tel" 
              placeholder="Enter your phone number" 
              value={form.phone} 
              onChange={handleChange} 
              required 
            />
            <input
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={form.email}
              onChange={handleChange}
              required
              onInvalid={(e) =>
                e.target.setCustomValidity("Please enter a valid email (e.g., user@example.com)")
              }
              onInput={(e) => e.target.setCustomValidity("")}
            />
            <input
              name="password"
              type="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />

           {/* Terms and Conditions Checkbox */}
            <div className="driver-checkbox-container">
              <label className="driver-checkbox-label">
                <input
                  type="checkbox"
                  name="agree"
                  checked={form.agree}
                  onChange={handleChange}
                  required
                />
                I agree to the{" "}
                <a href="/termsconditions" target="_blank" rel="noopener noreferrer">
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="/privacypolicy" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button 
              type="submit" 
              className="submit-btn" 
              disabled={loading || !form.agree}
            >
              {loading ? "Creating..." : "Create Traveler Account"}
            </button>

            <p className="signin-text">
              Already have an account? <a href="/user-login">Sign in</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}