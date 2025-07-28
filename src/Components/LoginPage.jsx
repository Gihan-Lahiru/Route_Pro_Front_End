import React, { useState } from "react";
import "./LoginPage.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost/RoutePro-backend/login.php", {
        email,
        password,
      });

      const result = response.data;

      if (result.success) {
      // alert("Login successful!");

        // Save user info
        localStorage.setItem("userId", result.userId);
        localStorage.setItem("role", result.role);

        // Redirect based on role
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
      alert("Server error. Please try again later.");
      console.error("Login error:", error);
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
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">
            LOGIN
          </button>
          <Link className="forgot-link" to="/forgot-password">Forgot your password?</Link>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
