import React, { useEffect } from "react";
import "./App.css";
import Header from "./Components/Header";
import HeroSection from "./Components/HeroSection";
import FeaturesSection from "./Components/FeaturesSection";
import PopularDestinations from "./Components/PopularDestinations";
import Footer from "./Components/Footer";
import BecomeProviderSection from "./Components/BecomeProviderSection";
import LocalEventsFoods from "./Components/LocalEventsFoods";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Cultural from "./Components/Cultural";
import RoutePlanner from "./Components/RoutePlanner";
import ScrollToTop from "./Components/ScrollToTop";
import "bootstrap/dist/css/bootstrap.min.css";
import GuideRegistrationForm from "./Components/GuideRegistrationForm";
import DriverRegistrationForm from "./Components/DriverRegistrationForm";
import TravelerRegistrationForm from "./Components/TravelerRegistrationForm";
import LoginPage from "./Components/LoginPage";
import BookDriver from "./Components/BookDriver";

// Dashboards
import DriverDashboard from "./Components/dashboard/driver/DriverDashboard/DriverDashboard";
import GuideDashboard from "./Components/dashboard/guide/GuideDashboard/GuideDashboard";
import AdminDashboard from "./Components/dashboard/admin/AdminDashboard";
import TravelerDashboard from "./Components/dashboard/traveler/TravelerDashboard";
import AboutUs from "./Components/AboutUs";
import TermsCondition from "./Components/TermsConditions";
import PrivacyPolicy from "./Components/PrivacyPolicy";
import ContactUs from "./Components/ContactUs";

import axios from "axios";

// Configure axios
axios.defaults.baseURL = "http://localhost/RoutePro-backend";
axios.defaults.withCredentials = true;

// Homepage content component
const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <h1 className="highlight">Discover Sri Lanka Like Never Before</h1>
      <p>
        Plan perfect journey with optimized routes, discover hidden gems,
        experience local culture, and create unforgettable memories in the Pearl
        of the Indian Ocean.
      </p>

      <HeroSection />
      <FeaturesSection />
      <PopularDestinations />
      <BecomeProviderSection />
      <LocalEventsFoods />
    </>
  );
};

// App component with interceptor logic
const AppWithInterceptor = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 403) {
          alert("You've been logged out due to another login.");
          localStorage.clear();
          navigate("/user-login");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  return (
    <>
      <ScrollToTop />
      <div className="App">
        <Header />

        <main style={{ marginTop: "70px" }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/guide-registration" element={<GuideRegistrationForm />} />
            <Route path="/traveler-register" element={<TravelerRegistrationForm />} />
            <Route path="/driver-registration" element={<DriverRegistrationForm />} />
            <Route path="/user-login" element={<LoginPage />} />
            <Route path="/culture" element={<Cultural />} />
            <Route path="/route" element={<RoutePlanner />} />
            <Route path="/bookdriver" element={<BookDriver />} />

            <Route path="/driver-dashboard" element={<DriverDashboard />} />
            <Route path="/guider-dashboard" element={<GuideDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/traveler-dashboard" element={<TravelerDashboard />} />

            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/termsconditions" element={<TermsCondition />} />
            <Route path="/privacypolicy" element={<PrivacyPolicy />} />
            <Route path="/contactus" element={<ContactUs />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppWithInterceptor />
    </Router>
  );
}

export default App;
