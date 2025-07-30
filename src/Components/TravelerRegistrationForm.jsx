import React, { useState } from "react";
import "./TravelerRegistrationForm.css";
import axios from "axios";

export default function TravelerRegistrationForm() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost/Routepro/signup_traveler.php",
        {
          fullName: form.fullName,
          phone: form.phone,
          email: form.email,
          password: form.password,
        }
      );

      if (response.data.success) {
        alert("Registration successful!");
        setForm({
          fullName: "",
          phone: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        alert("Error: " + response.data.error);
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="traveler-form-container">
      <div className="form-header">
        <div className="icon-circle">👥</div>
        <h2>Welcome Back</h2>
        <p>Sign in to your traveller account</p>
      </div>

      <form onSubmit={handleSubmit} className="traveler-form">
        <input
          name="fullName"
          type="text"
          placeholder="Full name"
          value={form.fullName}
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
          onInvalid={(e) => e.target.setCustomValidity('Please enter a valid email (e.g., user@example.com)')}
          onInput={(e) => e.target.setCustomValidity('')}
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

        <button type="submit" className="submit-btn">
          Create Account
        </button>

        <p className="signin-text">
          Already have an account? <a href="/user-login">Sign in</a>
        </p>
        <p className="terms-text">
          By continuing, you agree to our{" "}
          <a href="/termsconditions" target="_blank" rel="noopener noreferrer">Terms and Conditions</a> and{" "}
          <a href="/privacypolicy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
        </p>
      </form>
    </div>
  );
}