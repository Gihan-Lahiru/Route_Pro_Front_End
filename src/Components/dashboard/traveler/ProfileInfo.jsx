import React, { useState, useEffect } from 'react';
import styles from './TravelerDashboard.module.css';

const ProfileInfo = () => {
  const [travellerInfo, setTravellerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    member_since: '',
    user_id: ''
  });

  useEffect(() => {
    // Get the logged-in user's email from localStorage (set during login)
    const userEmail = localStorage.getItem('userEmail') || 
                     localStorage.getItem('email') ||
                     'emma@traveller.com'; // Fallback for testing

    console.log('🚀 Fetching traveller profile data:', userEmail);

    // Use proper TravellerController endpoint with email parameter
    fetch(`http://localhost/RoutePro-backend(02)/public/traveller/profile?email=${encodeURIComponent(userEmail)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.success && data.data) {
          setTravellerInfo({
            name: data.data.name || 'Unknown',
            email: data.data.email || 'No email',
            phone: data.data.phone || 'Not provided',
            member_since: data.data.member_since ? new Date(data.data.member_since).getFullYear() : 'Unknown',
            user_id: data.data.user_id || ''
          });
        } else {
          console.error('Error fetching traveller profile:', data.message || 'Unknown error');
        }
      })
      .catch((err) => {
        console.error('Fetch error:', err);
      });
  }, []);

  return (
    <section className={styles.profileSection}>
      <div className={styles.profileContainer}>
        {/* Left: Avatar */}
        <img
          src="images/driver1.jpg"
          alt={travellerInfo.name}
          className={styles.profileImage}
        />

        {/* Middle: Profile Info */}
        <div className={styles.profileDetails}>
          <h3>Profile Information</h3>
          <p><strong>Name:</strong> {travellerInfo.name}</p>
          <p><strong>Email:</strong> {travellerInfo.email}</p>
          <p><strong>Phone:</strong> {travellerInfo.phone}</p>
          <p><strong>Member Since:</strong> {travellerInfo.member_since}</p>
        </div>

        {/* Right: Travel Stats */}
        <div className={styles.statsBlock}>
          <div>
            <strong>12</strong>
            <span>Trips Completed</span>
          </div>
          <div>
            <strong>8</strong>
            <span>Countries Visited</span>
          </div>
          <div>
            <strong>24</strong>
            <span>Saved Places</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileInfo;
