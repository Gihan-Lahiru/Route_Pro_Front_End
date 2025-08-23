import React, { useState } from "react";
import "./TravelerRegistrationForm.css";
import axios from "axios";

export default function TravelerRegistrationForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
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

    const { confirmPassword, ...submitData } = form;
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost/RoutePro-backend/app/controllers/TravellerController.php",
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
        });
      } else {
        alert("Error: " + (response.data.error || "Unknown server error"));
      }
    } catch (error) {
      console.error("Axios error:", error);
      alert("Something went wrong. Please try again.");
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
            <input name="name" type="text" placeholder="Full name" value={form.name} onChange={handleChange} required />
            <input name="phone" type="tel" placeholder="Phone number" value={form.phone} onChange={handleChange} required />
            <input
              name="email"
              type="email"
              placeholder="Email address"
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
      </div>
    </div>
  );
}
