import React, { useState, useEffect, useRef } from 'react';
import { sessionUtils, apiMethods } from '../../../utils/api-client';
import RatingModalWorking from './RatingModalWorking';
import styles from './NotificationButton.module.css';

const NotificationButton = ({ onNotificationClick }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('Notifications API response:', data);

      if (data.success) {
        const newNotifications = data.notifications || [];
        setNotifications(newNotifications);
        setUnreadCount(newNotifications.length);
        console.log('Set notifications:', newNotifications);
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
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    console.log('🔔 Notification clicked:', notification);
    markAsRead(notification.id);
    setIsOpen(false);
    setSelectedNotification(notification);
    setShowRatingModal(true);
    console.log('📊 Show rating modal set to true');
    
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  const handleRatingSubmit = () => {
    // Refresh notifications after rating is submitted
    fetchNotifications();
    setShowRatingModal(false);
    setSelectedNotification(null);
  };

  const handleRatingClose = () => {
    setShowRatingModal(false);
    setSelectedNotification(null);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.notificationContainer} ref={dropdownRef}>
      <button 
        className={styles.notificationButton}
        onClick={toggleDropdown}
        aria-label="Notifications"
      >
        <span className={styles.bellIcon}>🔔</span>
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <span className={styles.unreadCount}>{unreadCount} new</span>
            )}
          </div>

          <div className={styles.dropdownContent}>
            {loading ? (
              <div className={styles.loadingState}>
                <p>Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>📭</span>
                <p>No new notifications</p>
                <small>Complete trips will appear here for rating</small>
              </div>
            ) : (
              <div className={styles.notificationsList}>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={styles.notificationItem}
                  >
                    <div className={styles.notificationIcon}>
                      {notification.type === 'trip_completed' ? '✅' : '📋'}
                    </div>
                    <div 
                      className={styles.notificationContent}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <h4 className={styles.notificationTitle}>{notification.title}</h4>
                      <p className={styles.notificationMessage}>{notification.message}</p>
                      <span className={styles.notificationTime}>{notification.time_ago}</span>
                    </div>
                    <div className={styles.notificationAction}>
                      {notification.type === 'trip_completed' && (
                        <button 
                          className={styles.actionButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNotificationClick(notification);
                          }}
                        >
                          Rate
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className={styles.dropdownFooter}>
              <button 
                className={styles.viewAllButton}
                onClick={() => setIsOpen(false)}
              >
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}

      {showRatingModal && selectedNotification && (
        <RatingModalWorking
          notification={selectedNotification}
          onClose={handleRatingClose}
          onSubmit={handleRatingSubmit}
        />
      )}
    </div>
  );
};

export default NotificationButton;