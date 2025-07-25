import styles from './TravelerDashboard.module.css';
import ProfileInfo from './ProfileInfo';

import QuickActions from './QuickActions';
import UpcomingTrips from './UpcomingTrips';
import RecentActivity from './RecentActivity';

const TravelerDashboard = () => {
  return (
    <div className={styles.dashboard}>
      <h2>Welcome back, Sarah Johnson</h2>
      <ProfileInfo />
   
      <QuickActions />
      <UpcomingTrips />
      <RecentActivity />
    </div>
  );
};

export default TravelerDashboard;
