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
      console.log("Attempting login with:", { email });

      // Try the new MVC API endpoint first, then fallback to legacy
      let response;
      try {
        response = await axios.post(
          "http://localhost/RoutePro-backend/public/index.php/auth/login", 
          {
            email,
            password,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 10000,
          }
        );
      } catch (newApiError) {
        console.log("New API failed, trying legacy endpoint...", newApiError.message);
        
        // Fallback to legacy endpoint
        response = await axios.post(
          "http://localhost/RoutePro-backend/app/controllers/Login.php", 
          {
            email,
            password,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 10000,
          }
        );
      }

      const result = response.data;
      console.log("Login response:", result);

      if (result.success) {
        // Store comprehensive user data in localStorage
        localStorage.setItem("userId", result.userId);
        localStorage.setItem("role", result.role);
        localStorage.setItem("userName", result.name);
        localStorage.setItem("userEmail", result.email);
        localStorage.setItem("userRating", result.rating || "0");
        
        // Store additional profile data if available
        if (result.user && result.user.profile) {
          localStorage.setItem("userProfile", JSON.stringify(result.user.profile));
        }

        console.log(`Login successful for ${result.role}: ${result.name}`);
        
        // Navigate based on role using the inheritance-based system
        if (result.role === "driver") {
          navigate("/driver-dashboard");
        } else if (result.role === "guide") {
          navigate("/guide-dashboard");
        } else if (result.role === "traveller") {
          navigate("/traveller-dashboard");
        } else if (result.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
        
      } else {
        // Handle login failure
        const errorMessage = result.error || result.message || "Login failed";
        console.error("Login failed:", errorMessage);
        alert("Login failed: " + errorMessage);
      }
    } catch (error) {
      console.error("Login error:", error);
      
      // Enhanced error handling
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (error.response) {
        // Server responded with error status
        const serverError = error.response.data;
        if (serverError && serverError.error) {
          errorMessage = serverError.error;
        } else if (serverError && serverError.message) {
          errorMessage = serverError.message;
        } else {
          errorMessage = `Server error (${error.response.status})`;
        }
      } else if (error.request) {
        // Network error
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error.code === 'ECONNABORTED') {
        // Timeout error
        errorMessage = "Request timeout. Please try again.";
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
                 <img src="/images/login.jpg" alt="Train Scenic" />
      </div>
      <div className="login-right">
                                     <img className="logo-image" src="/images/new logo.png" alt="Logo" />
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
