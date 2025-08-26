import React, { useState } from "react";
import "./TravelerRegistrationForm.css";
import axios from "axios";

// Create axios instance with default config (same as Driver form)
const api = axios.create({
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default function TravelerRegistrationForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  // 1. Full Name: Only letters and spaces allowed
  const validateName = (name) => /^[a-zA-Z\s]+$/.test(name);

  // 2. Email: Standard email format
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // 3. Phone: Either 10 digits starting with 0 or 9 digits starting with 7
  const validateName = (name) => /^[a-zA-Z\s]+$/.test(name);
  const validatePhone = (phone) => {
    const cleaned = phone.replace(/[\s-]/g, "");
    return /^0\d{9}$/.test(cleaned) || /^7\d{8}$/.test(cleaned);
  };

  // 4. Password: Minimum 8 characters, at least 1 letter, 1 number, 1 special character
  const validatePassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Step 1: Terms agreement must be ticked
    if (!form.agree) {
      alert('You must agree to the Terms and Conditions and Privacy Policy.');
      return;
    }

    // Step 2: Validate each field in order
    if (!validateName(form.name)) {
      alert("Full name can only contain letters and spaces.");
      return;
    }
    if (!validateEmail(form.email)) {
      alert("Invalid email format.");
      return;
    }
    if (!validatePhone(form.phone)) {
      alert("Phone number must be 10 digits starting with 0 or 9 digits starting with 7.");
      return;
    }
    if (!validatePassword(form.password)) {
      alert("Password must be at least 8 characters and include a letter, a number, and a special character.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Prepare data
    const { confirmPassword, agree, ...submitData } = form;
    
    // Add role to the payload - use 'traveller' to match backend
    submitData.role = 'traveller';
    
    setLoading(true);
    try {
      const response = await api.post(
        'http://localhost/RoutePro-backend(02)/public/auth/register',
      const response = await axios.post(
        "http://localhost/RoutePro-backend/app/controllers/signup_traveler.php",
        submitData
      );

      if (response.data.success) {
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
        alert("Error: " + (response.data.message || response.data.error || "Unknown server error"));
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
        alert('Network error: Unable to connect to server. Please check if the backend is running.');
      } else {
        // Something else happened
        alert('Registration failed: ' + error.message);
      }
      console.error("Axios error:", error);
      alert("Network error. Please check your backend server and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="traveler-form-container">
      <div className="form-header">
        <div className="icon-circle">👥</div>
        <h2>Create Traveler Account</h2>
        <p>Sign up to explore routes</p>
      </div>

      <form onSubmit={handleSubmit} className="traveler-form">
        <input
          name="name"
          type="text"
          placeholder="Full name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          type="tel"
          placeholder="Phone number"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email address"
          value={form.email}
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
          placeholder="Confirm password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p className="signin-text">
          Already have an account? <a href="/user-login">Sign in</a>
        </p>
        <p className="terms-text">
          By continuing, you agree to our{" "}
          <a href="/termsconditions" target="_blank" rel="noopener noreferrer">
            Terms and Conditions
          </a>{" "}
          and{" "}
          <a href="/privacypolicy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
        </p>
      </form>
    </div>
  );
}