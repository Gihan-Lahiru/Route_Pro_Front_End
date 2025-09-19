import React, { useState } from 'react';
import './DriverRegistrationForm.css';
import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json'
  }
});

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

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("form"); // "form": Registration form, "otp": OTP verification
  const [currentEmail, setCurrentEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    // Clear errors when user starts typing
    if (error) setError("");
  };

  // 1. Full Name: Only letters and spaces allowed
  const validateName = (name) => /^[a-zA-Z\s]+$/.test(name);

  // 2. Email: Standard email format
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // 3. Phone: Either 10 digits starting with 0 or 9 digits starting with 7
  const validatePhone = (phone) => {
    const cleaned = phone.replace(/[\s-]/g, '');
    return /^0\d{9}$/.test(cleaned) || /^7\d{8}$/.test(cleaned);
  };

  // 4. License: Alphanumeric only
  const validateLicense = (license) => /^[a-zA-Z0-9]+$/.test(license);

  // 5. Experience: Must be a non-negative number
  const validateExperience = (experience) => /^[0-9]+$/.test(experience);

  // 6. Location: Letters, numbers, commas, and spaces allowed
  const validateLocation = (location) => /^[a-zA-Z0-9\s,]+$/.test(location);

  // 7. Password: Minimum 8 characters, at least 1 letter, 1 number, 1 special character
  const validatePassword = (password) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password);

  const sendOTP = async () => {
    // Step 1: Terms agreement must be ticked
    if (!form.agree) {
      setError('You must agree to the Terms and Conditions and Privacy Policy.');
      return;
    }

    // Step 2: Validate each field in order
    if (!validateName(form.name)) {
      setError('Full name can only contain letters and spaces.');
      return;
    }

    if (!validateEmail(form.email)) {
      setError('Invalid email format.');
      return;
    }

    if (!validatePhone(form.phone)) {
      setError('Phone number must be 10 digits starting with 0 or 9 digits starting with 7.');
      return;
    }

    if (!validateLicense(form.license_no)) {
      setError('License number must be alphanumeric only.');
      return;
    }

    if (!form.license_no) {
      setError('License number is required.');
      return;
    }

    if (!form.vehicle_type) {
      setError('Please select a vehicle type.');
      return;
    }

    if (!validateExperience(form.experience)) {
      setError('Experience must be a non-negative whole number.');
      return;
    }

    if (!validateLocation(form.location)) {
      setError('Location contains invalid characters.');
      return;
    }

    if (!validatePassword(form.password)) {
      setError('Password must be at least 8 characters and include a letter, a number, and a special character.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      console.log("Sending driver registration OTP with form data:", form);
      
      // Send all driver registration data with the OTP request - backend will store temporarily
      const response = await api.post("http://localhost/RoutePro-backend(02)/public/auth/send-driver-registration-otp", {
        email: form.email,
        name: form.name,
        phone: form.phone,
        password: form.password,
        license_no: form.license_no,
        vehicle_type: form.vehicle_type,
        experience: form.experience,
        location: form.location
      });

      if (response.data.success) {
        setCurrentEmail(form.email);
        setStep("otp");
        setError('');
        setSuccessMessage('Verification code sent to your email! Your driver account will be created after verification.');
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
      console.log("Verifying OTP and creating driver account for:", currentEmail);
      
      // Verify OTP and create the actual driver account
      const response = await api.post(
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
        setSuccessMessage("Driver registration completed successfully! You can now login to your account.");
        setStep("success");
        setError("");
        setOtp("");
        
        // Reset form after successful registration
        setTimeout(() => {
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
          setStep("form");
          setSuccessMessage("");
          // Redirect to login page
          window.location.href = '/user-login';
        }, 3000);
      } else {
        setError(response.data.message || "Failed to verify OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError(error.response?.data?.message || "An error occurred while verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await api.post("http://localhost/RoutePro-backend(02)/public/auth/send-driver-registration-otp", {
        email: form.email,
        name: form.name,
        phone: form.phone,
        password: form.password,
        license_no: form.license_no,
        vehicle_type: form.vehicle_type,
        experience: form.experience,
        location: form.location
      });

      if (response.data.success) {
        setSuccessMessage("New verification code sent to your email!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(response.data.message || "Failed to resend verification code");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      setError("Failed to resend verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    sendOTP();
  };

  return (
    <div className="driver-page-container">
      {/* LEFT SECTION: IMAGE */}
      <div className="driver-image-section">
        <img src="/images/driver-reg.jpg" alt="Driver illustration" />
      </div>
      <div className="driver-form-section">
        <div className="driver-form-container">
          <div className="driver-form-header">
            <img className="driver-logo-image" src="/images/new logo.png" alt="Logo" />
            <h2>Join as a Driver</h2>
            <p>Create your driver account</p>
          </div>

          {step === "form" && (
            <form onSubmit={handleSubmit} className="driver-form">
              <input 
                name="name" 
                type="text" 
                placeholder="Enter your full name" 
                value={form.name} 
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
                name="license_no" 
                type="text" 
                placeholder="Enter your license number" 
                value={form.license_no} 
                onChange={handleChange} 
                required 
              />
              
              <select name="vehicle_type" value={form.vehicle_type} onChange={handleChange} required>
                <option value="">Select vehicle type</option>
                <option value="Car">Car</option>
                <option value="Van">Van</option>
                <option value="Bike">Bike</option>
                <option value="Tuk Tuk">Tuk Tuk</option>
              </select>

              <input 
                name="experience" 
                type="number" 
                min="0" 
                placeholder="Years of driving experience" 
                value={form.experience} 
                onChange={handleChange} 
                required 
              />
              <input 
                name="location" 
                type="text" 
                placeholder="Enter your primary location" 
                value={form.location} 
                onChange={handleChange} 
                required 
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
                className="driver-submit-btn" 
                disabled={loading || !form.agree}
              >
                {loading ? "Sending..." : "Send Verification Code"}
              </button>

              <p className="driver-signin-text">
                Already have a driver account? <a href="/user-login">Sign in here</a>
              </p>
            </form>
          )}

          {step === "otp" && (
            <div className="otp-section">
              <h3>Verify Your Email</h3>
              <p>We've sent a 6-digit verification code to {currentEmail}</p>
              
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength="6"
                  className="otp-input"
                />
              </div>
              
              <button 
                onClick={verifyOTPAndRegister} 
                className="driver-submit-btn" 
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify & Complete Registration"}
              </button>
              
              <button 
                onClick={resendOTP} 
                className="resend-btn" 
                disabled={loading}
              >
                Resend Code
              </button>
              
              <button 
                onClick={() => setStep("form")} 
                className="back-btn"
              >
                Back to Form
              </button>
            </div>
          )}

          {step === "success" && (
            <div className="success-section">
              <h3>Registration Successful!</h3>
              <p>Your driver account has been created successfully. Redirecting to login...</p>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
        </div>
      </div>
    </div>
  );
}