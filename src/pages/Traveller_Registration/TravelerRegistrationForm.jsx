import React, { useState } from "react";
import axios from "axios";
import "./TravelerRegistrationForm.css";

export default function TravelerRegistrationForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("form"); // "form": Registration form, "otp": OTP verification
  const [currentEmail, setCurrentEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    // Clear errors when user starts typing
    if (error) setError("");
  };

  const sendOTP = async () => {
    if (!isValidEmail(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!form.name.trim() || !form.phone.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      console.log("Sending registration OTP with form data:", form);
      
      // Send all registration data with the OTP request - backend will store temporarily
      const response = await axios.post("http://localhost/RoutePro-backend(02)/public/auth/send-otp", {
        type: "registration",
        email: form.email,
        name: form.name,
        phone: form.phone,
        password: form.password
      });

      if (response.data.success) {
        setCurrentEmail(form.email);
        setStep("otp");
        setError('');
        setSuccessMessage('Verification code sent to your email! Your account will be created after verification.');
      } else {
        setError(response.data.message || 'Failed to send verification code');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      if (error.response?.status === 409) {
        setError('Email is already registered. Please login instead.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to send verification code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOTPAndRegister = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Verifying OTP and creating account for:", currentEmail);
      
      // Verify OTP and create the actual user account
      const response = await axios.post(
        "http://localhost/RoutePro-backend(02)/public/auth/verify-otp",
        { 
          email: currentEmail,
          otp: otp,
          type: "registration"
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      if (response.data.success) {
        setSuccessMessage("Account created successfully! Please login to continue.");
        setTimeout(() => {
          window.location.href = '/user-login';
        }, 2000);
      } else {
        setError(response.data.message || "Invalid or expired OTP. Please try again.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Verification failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.agree) {
      setError('You must agree to the Terms and Conditions.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // Send OTP for email verification
    await sendOTP();
  };

  const handleOTPSubmit = (e) => {
    e.preventDefault();
    verifyOTPAndRegister();
  };

  const goBackToForm = () => {
    setStep("form");
    setOtp("");
    setSuccessMessage("");
    setError("");
  };

  const resendOTP = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // Resend OTP with the same registration data
      const response = await axios.post("http://localhost/RoutePro-backend(02)/public/auth/send-otp", {
        type: "registration",
        email: currentEmail,
        name: form.name,
        phone: form.phone,
        password: form.password
      });

      if (response.data.success) {
        setSuccessMessage("New verification code sent to your email!");
      } else {
        setError(response.data.message || "Failed to resend verification code.");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      setError("Failed to resend verification code. Please try again.");
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
            <img className="logo-image" src="/images/newlogo.png" alt="Logo" />
            <h2>{step === "form" ? "Join as a Traveler" : "Verify Your Email"}</h2>
            <p>{step === "form" ? "Create your traveler account" : "Enter the verification code sent to your email"}</p>
          </div>

          {step === "form" ? (
            // Registration Form
            <form onSubmit={handleSubmit} className="traveler-form">
              <input 
                name="name" 
                type="text" 
                placeholder="Enter your full name" 
                value={form.name} 
                onChange={handleChange} 
                required 
                disabled={loading}
              />
              <input
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={form.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <input 
                name="phone" 
                type="tel" 
                placeholder="Enter your phone number" 
                value={form.phone} 
                onChange={handleChange} 
                required 
                disabled={loading}
              />
              <input
                name="password"
                type="password"
                placeholder="Create a strong password (min 6 characters)"
                value={form.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
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
                    disabled={loading}
                  />
                  I agree to the Terms and Conditions
                </label>
              </div>

              {error && (
                <div className="error-message">
                  <strong>Error:</strong> {error}
                </div>
              )}

              <button 
                type="submit" 
                className="submit-btn" 
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send Verification Code"}
              </button>

              <p className="signin-text">
                Already have a traveler account? <a href="/user-login">Sign in here</a>
              </p>
            </form>
          ) : (
            // OTP Verification Form
            <form onSubmit={handleOTPSubmit} className="traveler-form">
              <div className="otp-info">
                <p>We've sent a 6-digit verification code to:</p>
                <strong>{form.email}</strong>
                <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                  Please check your email and enter the code to activate your account
                </p>
              </div>
              
              <input
                type="text"
                placeholder="Enter 6-digit verification code"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setOtp(value);
                  if (error) setError("");
                }}
                maxLength={6}
                required
                disabled={loading}
                style={{ 
                  textAlign: 'center', 
                  fontSize: '18px', 
                  letterSpacing: '2px',
                  fontWeight: 'bold'
                }}
              />

              {error && (
                <div className="error-message">
                  <strong>Error:</strong> {error}
                </div>
              )}

              {successMessage && (
                <div className="success-message">
                  {successMessage}
                </div>
              )}

              <button 
                type="submit" 
                className="submit-btn" 
                disabled={loading || otp.length !== 6}
              >
                {loading ? "Verifying..." : "Verify Email & Activate Account"}
              </button>

              <div className="otp-actions">
                <button 
                  type="button" 
                  onClick={goBackToForm}
                  className="back-btn"
                  disabled={loading}
                >
                  ← Back to Form
                </button>
                
                <button 
                  type="button" 
                  onClick={resendOTP}
                  className="resend-btn"
                  disabled={loading}
                >
                  Resend Verification Code
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}