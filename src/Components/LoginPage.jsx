// LoginPage.js
import React, { useState } from "react";
import "./LoginPage.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
  "http://localhost/RoutePro-backend/app/controllers/Login.php",
  { email, password },
  { withCredentials: true } // << allow cookies (session ID)
);


      const result = response.data;
      console.log(result)
      if (result.success) {
        // Store user data in localStorage
        localStorage.setItem("userId", result.userId);
        localStorage.setItem("role", result.role);
        
        // Show success alert
        // alert(`Login successful! Welcome ${result.role}!`);
        
        // Navigate based on role
        if (result.role === "driver") {
          navigate("/driver-dashboard");
        } else if (result.role === "guide") {
          navigate("/guide-dashboard");
        } else if (result.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
      } else {
        alert("Login failed: " + result.error);
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        alert("Login failed: " + (error.response.data.error || "Server error"));
      } else if (error.request) {
        alert("Network error. Please check your connection and try again.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src="login.jpg" alt="Train Scenic" />
      </div>
      <div className="login-right">
        <img className="logo-image" src="new logo.png" alt="Logo" />
        <h2 className="welcome">Welcome</h2>
        <p className="login-subtitle">Login with Email</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "LOGGING IN..." : "LOGIN"}
          </button>
          <Link className="forgot-link" to="/forgot-password">
            Forgot your password?
          </Link>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;