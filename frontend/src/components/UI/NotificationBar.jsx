import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const NotificationBar = ({ notification, onClose }) => {
  if (!notification) return null;

  const { type, message } = notification;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="notification-icon success-icon" size={20} />;
      case 'error':
        return <AlertCircle className="notification-icon error-icon" size={20} />;
      default:
        return <Info className="notification-icon info-icon" size={20} />;
    }
  };

  return (
    <div className={`notification-toast notification-${type}`} role="alert">
      <div className="notification-content">
        {getIcon()}
        <span className="notification-message">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="notification-close-btn"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default NotificationBar;
