import React, { useState } from 'react';
import './GuideRegistrationForm.css';
import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default function GuideRegistrationForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    nic: '',
    license_no: '',
    experience: '',
    location: '',
    languages: '',
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
  const [isVerifying, setIsVerifying] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    // Clear errors when user starts typing
    if (error) setError("");
  };
// 1. Full Name: Only letters and spaces allowed
const validateName = (name) => /^[a-zA-Z\s]+$/.test(name);

// 2. Email: Standard email format
const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// 3. Phone: Either 10 digits starting with 0 or 9 digits starting with 7
const validatePhone = (phone) => {
  const cleaned = phone.replace(/[\s-]/g, '');
  return /^0\d{9}$/.test(cleaned) || /^7\d{8}$/.test(cleaned);
};

// 4. NIC: Either old (9 digits + V/X) or new (12 digits)
const validateNIC = (nic) =>
  /^[0-9]{9}[vVxX]$/.test(nic) || /^[0-9]{12}$/.test(nic);

// 5. Guide License: Alphanumeric only
const validateLicense = (license_no) => /^[a-zA-Z0-9]+$/.test(license_no);

// 6. Experience: Must be a positive integer
const validateExperience = (experience) => /^[1-9][0-9]*$/.test(experience);

// 7. Location: Letters, numbers, commas, and spaces allowed
const validateLocation = (location) =>
  /^[a-zA-Z0-9\s,]+$/.test(location);

// 8. Languages: Letters, commas, and spaces
const validateLanguages = (languages) =>
  /^[a-zA-Z\s,]+$/.test(languages);

// 9. Password: Minimum 8 characters, at least 1 letter, 1 number, 1 special character
const validatePassword = (password) =>
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password);



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

    if (!validateNIC(form.nic)) {
      setError('NIC must be 9 digits + V/v/X/x or 12 digits.');
      return;
    }

    if (!validateLicense(form.license_no)) {
      setError('Guide License must be alphanumeric only.');
      return;
    }

    if (!validateExperience(form.experience)) {
      setError('Experience must be a positive whole number.');
      return;
    }

    if (!validateLocation(form.location)) {
      setError('Location contains invalid characters.');
      return;
    }

    if (!validateLanguages(form.languages)) {
      setError('Languages must contain only letters, commas, and spaces.');
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
      console.log("Sending guide registration OTP with form data:", form);
      
      // Send all guide registration data with the OTP request - backend will store temporarily
      const response = await api.post("http://localhost/RoutePro-backend(02)/public/auth/send-guide-registration-otp", {
        email: form.email,
        name: form.name,
        phone: form.phone,
        password: form.password,
        nic: form.nic,
        license_no: form.license_no,
        experience: form.experience,
        location: form.location,
        languages: form.languages
      });

      if (response.data.success) {
        setCurrentEmail(form.email);
        setStep("otp");
        setError('');
        setSuccessMessage('Verification code sent to your email! Your guide account will be created after verification.');
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

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      console.log("Verifying OTP and creating guide account for:", currentEmail);
      
      // Verify OTP and create the actual guide account
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
        setSuccessMessage("Guide registration completed successfully! Redirecting to login...");
        setError("");
        setOtp("");
        
        // Reset form and redirect immediately
        setTimeout(() => {
          setForm({
            name: '',
            email: '',
            phone: '',
            nic: '',
            license_no: '',
            experience: '',
            location: '',
            languages: '',
            password: '',
            confirmPassword: '',
            agree: false,
          });
          setStep("form");
          setSuccessMessage("");
          // Redirect to login page
          window.location.href = '/user-login';
        }, 2000); // Reduced to 2 seconds for faster redirect
      } else {
        setError(response.data.message || "Failed to verify OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError(error.response?.data?.message || "An error occurred while verifying OTP");
    } finally {
      setIsVerifying(false);
    }
  };

  const resendOTP = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await api.post("http://localhost/RoutePro-backend(02)/public/auth/send-guide-registration-otp", {
        email: form.email,
        name: form.name,
        phone: form.phone,
        password: form.password,
        nic: form.nic,
        license_no: form.license_no,
        experience: form.experience,
        location: form.location,
        languages: form.languages
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
    <div className="guide-page-container">
      {/* LEFT SECTION: IMAGE */}
      <div className="guide-image-section">
                 <img src="/images/guide.jpg" alt="Guide illustration" />
      </div>
      <div className="guide-form-section">
    <div className="guide-form-container">
      <div className="guide-form-header">
                 <img className="guide-logo-image" src="/images/newlogo.png" alt="Logo" />
        <h2>{step === "form" ? "Join as a Tour Guide" : "Verify Your Email"}</h2>
        <p>{step === "form" ? "Create your tour guide account" : "Enter the verification code sent to your email"}</p>
      </div>

      {step === "form" && (
        <form onSubmit={handleSubmit} className="guide-form">
        
        {/* Error and Success Messages */}
        {error && <div className="error-message" style={{color: 'red', marginBottom: '10px', padding: '10px', backgroundColor: '#ffe6e6', border: '1px solid red', borderRadius: '4px'}}>{error}</div>}
        {successMessage && <div className="success-message" style={{color: 'green', marginBottom: '10px', padding: '10px', backgroundColor: '#e6ffe6', border: '1px solid green', borderRadius: '4px'}}>{successMessage}</div>}
        
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
          name="nic"
          type="text"
          placeholder="Enter your NIC number"
          value={form.nic}
          onChange={handleChange}
          required
        />
        <input
          name="license_no"
          type="text"
          placeholder="Enter your guide license number"
          value={form.license_no}
          onChange={handleChange}
          required
        />
        <input
          name="experience"
          type="number"
          placeholder="Years of experience"
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
          name="languages"
          type="text"
          placeholder="Languages spoken (e.g., English, Sinhala, Tamil)"
          value={form.languages}
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


        <button type="submit" disabled={loading || !form.agree} className="submit-btn">
          {loading ? 'Sending...' : 'Send Verification Code'}
        </button>

        <p className="signin-link">
          Already have a guide account? <a href="/user-login">Sign in here</a>
        </p>
        </form>
      )}

      {step === "otp" && (
        <div className="guide-form">
          <div className="otp-info">
            <p>We've sent a 6-digit verification code to:</p>
            <strong>{currentEmail}</strong>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
              Please check your email and enter the code to activate your guide account
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
            disabled={isVerifying}
            style={{ 
              textAlign: 'center', 
              fontSize: '18px', 
              letterSpacing: '2px',
              fontWeight: 'bold'
            }}
          />

          {/* Error and Success Messages */}
          {error && (
            <div className="error-message" style={{color: 'red', marginBottom: '10px', padding: '10px', backgroundColor: '#ffe6e6', border: '1px solid red', borderRadius: '4px'}}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {successMessage && (
            <div className="success-message" style={{color: 'green', marginBottom: '10px', padding: '10px', backgroundColor: '#e6ffe6', border: '1px solid green', borderRadius: '4px'}}>
              {successMessage}
            </div>
          )}

          <button
            type="button"
            onClick={handleVerifyOTP}
            disabled={isVerifying || otp.length !== 6}
            className="submit-btn"
          >
            {isVerifying ? "Verifying..." : "Verify Email & Activate Account"}
          </button>

          <div className="otp-actions" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <button
              type="button"
              onClick={() => setStep("form")}
              className="back-btn"
              disabled={isVerifying}
              style={{ flex: 1 }}
            >
              ← Back to Form
            </button>
            
            <button
              type="button"
              onClick={resendOTP}
              disabled={loading}
              className="resend-btn"
              style={{ flex: 1 }}
            >
              {loading ? "Sending..." : "Resend Verification Code"}
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
    </div>
  );
}
