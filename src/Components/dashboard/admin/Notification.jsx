import React, { useState, useEffect } from "react";
import "./Notification.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    
    // Set up polling to check for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost/RoutePro-backend(02)/public/admin/notifications', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread_count || 0);
      } else {
        setError(data.message || 'Failed to fetch notifications');
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch('http://localhost/RoutePro-backend(02)/public/admin/notifications/mark-read', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ notification_id: notificationId })
      });

      const data = await response.json();
      
      if (data.success) {
        // Update the notification in the state
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, is_read: 1 } 
              : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } else {
        console.error('Failed to mark notification as read:', data.message);
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('http://localhost/RoutePro-backend(02)/public/admin/notifications/mark-all-read', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (data.success) {
        // Mark all notifications as read in the state
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, is_read: 1 }))
        );
        setUnreadCount(0);
      } else {
        console.error('Failed to mark all notifications as read:', data.message);
      }
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const getNotificationPriority = (type) => {
    switch (type) {
      case 'trip_cancelled':
        return 'high';
      case 'low_rating':
        return 'high';
      case 'new_traveller':
        return 'medium';
      case 'new_driver':
        return 'medium';
      case 'new_guide':
        return 'medium';
      case 'new_booking':
        return 'medium';
      case 'payment':
        return 'low';
      default:
        return 'medium';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'trip_cancelled':
        return '❌';
      case 'low_rating':
        return '⚠️';
      case 'new_traveller':
        return '🧳';
      case 'new_driver':
        return '🚗';
      case 'new_guide':
        return '🗺️';
      case 'new_booking':
        return '📅';
      case 'payment':
        return '💰';
      default:
        return '🔔';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#10b981";
      default:
        return "#64748b";
    }
  };

  const resetRating = (id) => {
    // This would typically make an API call to reset the rating
    console.log(`Resetting rating for notification ${id}`);
    markAsRead(id);
  };

  return (
    <div className="notifications">
      <div className="page-header">
        <div className="header-left">
          <h2>Notifications</h2>
          <span className="unread-count">{unreadCount} unread notifications</span>
        </div>
        <button className="mark-all-read" onClick={markAllAsRead}>
          Mark All as Read
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading notifications...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <h3>Error loading notifications</h3>
          <p>{error}</p>
          <button onClick={fetchNotifications} className="retry-btn">
            Retry
          </button>
        </div>
      ) : notifications.length === 0 ? (
        <div className="no-notifications">
          <h3>No notifications</h3>
          <p>You're all caught up! No new notifications at this time.</p>
        </div>
      ) : (
        <div className="notification-list">
          {notifications.map((notification) => {
            const priority = getNotificationPriority(notification.type);
            return (
              <div key={notification.id} className={`notification-card ${!notification.is_read ? "unread" : ""}`}>
                <div className="notification-header">
                  <div className="notification-info">
                    <span className="notification-icon">{getNotificationIcon(notification.type)}</span>
                    <div className="notification-title">
                      <h3>{notification.title}</h3>
                      <span className="priority-badge" style={{ backgroundColor: getPriorityColor(priority) }}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                      </span>
                    </div>
                  </div>
                  <div className="notification-meta">
                    <span className="notification-time">{formatTime(notification.created_at)}</span>
                    {!notification.is_read && (
                      <button className="mark-read-btn" onClick={() => markAsRead(notification.id)}>
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>

                <div className="notification-content">
                  <p className="notification-message">{notification.message}</p>

                  {notification.trip_id && (
                    <div className="trip-info">
                      <span className="trip-id">Trip ID: #{notification.trip_id}</span>
                    </div>
                  )}

                  {notification.user_id && (
                    <div className="user-info">
                      <span className="user-id">User ID: {notification.user_id}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}

export default Notifications
