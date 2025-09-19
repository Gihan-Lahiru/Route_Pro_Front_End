import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ForgotPasswordPage.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // If message exists, navigate to verify page
    if (message) {
      navigate("/verify-otp", { state: { email } });
      return;
    }

    // Validate email format
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    
    setLoading(true);
    setMessage("");
    setError("");

    try {
      console.log("Sending OTP request to:", "http://localhost/RoutePro-backend(02)/public/auth/send-otp");
      console.log("Request payload:", { email });
      
      const response = await axios.post(
        "http://localhost/RoutePro-backend(02)/public/auth/send-otp",
        { 
          email,
          type: "password_reset" // Specify this is for password reset
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      console.log("Response received:", response);

      if (response.data.success) {
        setMessage("OTP sent to your email! Please check your email and enter the 6-digit code.");
      } else {
        setError(response.data.message || "Failed to send OTP.");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      
      // More detailed error handling
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setError("Cannot connect to server. Please ensure the backend server is running on localhost.");
      } else if (err.code === 'ENOTFOUND') {
        setError("Server not found. Please check the backend URL configuration.");
      } else if (err.response) {
        // Server responded with error status
        console.log("Error response status:", err.response.status);
        console.log("Error response data:", err.response.data);
        setError(err.response.data.message || `Server error: ${err.response.status}`);
      } else if (err.request) {
        // Request was made but no response received
        console.log("No response received:", err.request);
        setError("No response from server. Please check your internet connection and try again.");
      } else {
        // Something else happened
        console.log("Request setup error:", err.message);
        setError(`Request error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <div className="forgot-password-header">
          <h2>Forgot Password</h2>
          <p>Enter your email address and we'll send you a 6-digit OTP to reset your password.</p>
        </div>

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
              <br />
              <small>
                If this issue persists, please:
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                  <li>Check your internet connection</li>
                  <li>Ensure the backend server is running</li>
                  <li>Verify your email address is correct</li>
                  <li>Contact support if the problem continues</li>
                </ul>
              </small>
            </div>
          )}
          {message && <div className="success-message">{message}</div>}

          <button
            type="submit"
            className={`submit-btn ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Sending OTP..." : message ? "Verify OTP" : "Send OTP"}
          </button>
        </form>

        <div className="forgot-password-footer">
          <p>
            Remember your password?{" "}
            <Link to="/user-login" className="login-link">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
