import React from "react";
import "./termsconditions.css";

export default function TermsCondition() {
  return (
    <div className="terms-box">
      <h3>Terms and Conditions</h3>
      

      <p>
        Welcome to <strong>RoutePro</strong>! By using our website, you agree to
        the following terms:
      </p>

      <h5>1. Use of the Platform</h5>
      <p>
        RoutePro is a travel planning platform that connects travelers with
        drivers and tour guides. You can use our service to plan routes, book
        guides or vehicles, and explore sightseeing suggestions.
      </p>

      <h5>2. User Responsibilities</h5>
      <ul>
        <li>You must be 18 years or older to create an account.</li>
        <li>You agree to provide accurate, complete, and updated information.</li>
        <li>You are responsible for keeping your account login information secure.</li>
      </ul>

      <h5>3. Bookings and Payments</h5>
      <ul>
        <li>All bookings are confirmed directly between the traveler and the service provider (driver or guide).</li>
        <li>Payments must be processed through the RoutePro system.</li>
        <li>Cancellations and refunds will follow our platform’s policy.</li>
      </ul>

      <h5>4. Ratings and Account Monitoring</h5>
      <ul>
        <li>After a trip, travelers can rate and review the service.</li>
        <li>Any driver or guide who receives an average rating below <strong>2.5</strong> will be flagged for admin review.</li>
        <li>Accounts that consistently perform poorly may be suspended or removed from the system.</li>
      </ul>

      <h5>5. Account Termination</h5>
      <p>
        We reserve the right to suspend or delete any account that violates our
        terms or receives repeated complaints or low ratings.
      </p>

      <h5>6. Data Privacy</h5>
      <p>
        Your personal information is protected under our Privacy Policy. We do
        not share or sell your data to third parties.
      </p>

      <h5>7. Contact Us</h5>
      <p>
        If you have any questions or concerns, please contact us at: <strong>support@routepro.com</strong>
      </p>
    </div>
  );
}
