import React from "react";
import "./App.css";
import Header from "./Components/Header";
import HeroSection from "./Components/HeroSection";
import FeaturesSection from "./Components/FeaturesSection";
import PopularDestinations from "./Components/PopularDestinations";
import Footer from "./Components/Footer";
import BecomeProviderSection from "./Components/BecomeProviderSection";
import LocalEventsFoods from "./Components/LocalEventsFoods";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Cultural from "./Components/Cultural";
import BudgetSelection from "./Components/BudgetSelection";
import RoutePlanner from "./Components/RoutePlanner";
import ScrollToTop from "./Components/ScrollToTop";
import "bootstrap/dist/css/bootstrap.min.css";
import GuideRegistrationForm from "./Components/GuideRegistrationForm";
import DriverRegistrationForm from "./Components/DriverRegistrationForm";
import TravelerRegistrationForm from "./Components/TravelerRegistrationForm";
import LoginPage from "./Components/LoginPage";
import BookDriver from "./Components/BookDriver";

// ✅ Dashboards
import DriverDashboard from "./Components/dashboard/driver/DriverDashboard/DriverDashboard";
import GuideDashboard from "./Components/dashboard/guide/GuideDashboard/GuideDashboard";
import AdminDashboard from "./Components/dashboard/admin/AdminDashboard";
import TravelerDashboard from "./Components/dashboard/traveler/TravelerDashboard";

import AboutUs from "./Components/AboutUs";
import TermsCondition from "./Components/TermsConditions";
import PrivacyPolicy from "./Components/PrivacyPolicy";
import ContactUs from "./Components/ContactUs";

// ✅ Homepage content as a separate component
const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <h1 className="highlight">Discover Sri Lanka Like Never Before</h1>
      <p>
        Plan your perfect journey with optimized routes, discover hidden gems,
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

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Header />

        <main style={{ marginTop: "70px" }}>
          <Routes>
            {/* ✅ This makes the homepage show by default */}
            <Route path="/homepage" element={<HomePage />} />

            {/* Other pages */}
            <Route
              path="/guide-registration"
              element={<GuideRegistrationForm />}
            />
            <Route
              path="/traveler-register"
              element={<TravelerRegistrationForm />}
            />
            <Route
              path="/driver-registration"
              element={<DriverRegistrationForm />}
            />
            <Route path="/user-login" element={<LoginPage />} />
            <Route path="/culture" element={<Cultural />} />
            <Route path="/budget" element={<BudgetSelection />} />
            <Route path="/route" element={<RoutePlanner />} />
            <Route path="/bookdriver" element={<BookDriver />} />

            {/* Dashboards */}
            <Route path="/driver-dashboard" element={<DriverDashboard />} />
            <Route path="/guide-dashboard" element={<GuideDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/traveler-dashboard" element={<TravelerDashboard />} />

            {/* Info pages */}
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/termsconditions" element={<TermsCondition />} />
            <Route path="/privacypolicy" element={<PrivacyPolicy />} />
            <Route path="/contactus" element={<ContactUs />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
