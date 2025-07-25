import styles from './TravelerDashboard.module.css';

const ProfileInfo = () => (
  <section className={styles.profileSection}>
    <div className={styles.profileContainer}>
      {/* Left: Avatar */}
      <img
        src="pic.jpg"
        alt="Sarah Johnson"
        className={styles.profileImage}
      />

      {/* Middle: Profile Info */}
      <div className={styles.profileDetails}>
        <h3>Profile Information</h3>
        <p><strong>Name:</strong> Sarah Johnson</p>
        <p><strong>Email:</strong> sarah.johnson@email.com</p>
        <p><strong>Member Since:</strong> 2022</p>
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

export default ProfileInfo;
