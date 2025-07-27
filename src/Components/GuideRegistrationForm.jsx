import React, { useState } from 'react';
import './GuideRegistrationForm.css';
import axios from 'axios';

export default function GuideRegistrationForm() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    nic: '',
    guideLicense: '',
    experience: '',
    location: '',
    languages: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.agree) {
      alert('Please agree to the terms and conditions');
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await axios.post('http://localhost/RoutePro-backend/signup_guide.php', form);

      if (response.data.success) {
        alert('Guide registered successfully!');
        // Optionally reset form here
      } else {
        alert('Error: ' + response.data.error);
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="guide-form-container">
      <div className="form-header">
        <div className="icon-circle">🎒</div>
        <h2>Join as a Tour Guide</h2>
        <p>Create your tour guide account</p>
      </div>

      <form onSubmit={handleSubmit} className="guide-form">
        <input name="fullName" type="text" placeholder="Enter your full name" value={form.fullName} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Enter your email address" value={form.email} onChange={handleChange} required />
        <input name="phone" type="tel" placeholder="Enter your phone number" value={form.phone} onChange={handleChange} required />
        <input name="nic" type="text" placeholder="Enter your NIC number" value={form.nic} onChange={handleChange} required />
        <input name="guideLicense" type="text" placeholder="Enter your guide license number" value={form.guideLicense} onChange={handleChange} required />
        <input name="experience" type="number" placeholder="Years of experience (e.g., 5)" value={form.experience} onChange={handleChange} required />
        <input name="location" type="text" placeholder="Enter your primary location" value={form.location} onChange={handleChange} required />
        
        <textarea name="languages" placeholder="Languages spoken (e.g., English, Sinhala, Tamil)" value={form.languages} onChange={handleChange} rows="3" required></textarea>

        <input name="password" type="password" placeholder="Create a strong password" value={form.password} onChange={handleChange} required />
        <input name="confirmPassword" type="password" placeholder="Confirm your password" value={form.confirmPassword} onChange={handleChange} required />

        <div className="checkbox-container">
          <label className="checkbox-label">
            <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} />
            I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms and Conditions</a> and{" "}
          <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
          </label>
        </div>

        <button type="submit" className="submit-btn">Create Guide Account</button>

        <p className="signin-link">
          Already have a guide account? <a href="/login">Sign in here</a>
        </p>
      </form>
    </div>
  );
}
