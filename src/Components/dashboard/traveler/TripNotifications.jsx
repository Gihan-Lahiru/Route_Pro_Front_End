import React, { useState, useEffect } from 'react';
import { sessionUtils, apiMethods } from '../../../utils/api-client';
import styles from './TripNotifications.module.css';

const TripNotifications = ({ onNotificationClick }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const currentUser = sessionUtils.getCurrentUser();
      if (!currentUser?.userId) {
        console.log('No current user found for notifications');
        return;
      }

      console.log('Fetching notifications for user:', currentUser.userId);
      const url = `${apiMethods.getBackendUrl()}/api/trips/trip-notifications.php?traveler_id=${currentUser.userId}`;
      console.log('Notifications API URL:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('Notifications API response:', data);

      if (data.success) {
        setNotifications(data.notifications || []);
        console.log('Set notifications:', data.notifications);
      } else {
        console.error('Notifications API error:', data.message);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`${apiMethods.getBackendUrl()}/api/trips/mark-notification-read.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification_id: notificationId })
      });
      
      // Remove from local state
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  if (loading) {
    return <div className={styles.notificationsLoading}>Loading notifications...</div>;
  }

  if (notifications.length === 0) {
    // Show a placeholder when no notifications - for testing visibility
    return (
      <div className={styles.tripNotifications}>
        <h3 className={styles.notificationsTitle}>🔔 Trip Updates</h3>
        <div className={styles.noNotifications}>
          <p>No new trip notifications at the moment.</p>
          <small>Complete trips will appear here for rating.</small>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tripNotifications}>
      <h3 className={styles.notificationsTitle}>🔔 Trip Updates</h3>
      <div className={styles.notificationsList}>
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`${styles.notificationItem} ${styles[notification.type]}`}
            onClick={() => handleNotificationClick(notification)}
          >
            <div className={styles.notificationIcon}>
              {notification.type === 'trip_completed' ? '✅' : '📋'}
            </div>
            <div className={styles.notificationContent}>
              <h4 className={styles.notificationTitle}>{notification.title}</h4>
              <p className={styles.notificationMessage}>{notification.message}</p>
              <span className={styles.notificationTime}>{notification.time_ago}</span>
            </div>
            <div className={styles.notificationAction}>
              {notification.type === 'trip_completed' && (
                <button className={styles.rateButton}>Rate & Review</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripNotifications;