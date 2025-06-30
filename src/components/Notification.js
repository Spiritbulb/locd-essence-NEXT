// components/Notification.js
'use client';
import { useEffect, useState } from 'react';

const Notification = ({ message, type = 'success', duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  if (!isVisible || !message) return null;

  // Style definitions with hardcoded colors
  const baseStyle = {
    position: 'fixed',
    bottom: '1rem',
    right: '1rem',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    zIndex: '50',
    animation: 'slideIn 0.5s ease-out',
    color: '#fff'
  };

  const typeStyles = {
    success: {
      backgroundColor: '#8a6e5d' // Your custom brown
    },
    error: {
      backgroundColor: '#ef4444' // Red-500 equivalent
    },
    warning: {
      backgroundColor: '#f59e0b', // Amber-500 equivalent
      color: '#000'
    },
    info: {
      backgroundColor: '#3b82f6' // Blue-500 equivalent
    },
    default: {
      backgroundColor: '#7e4507' // Your custom dark brown
    }
  };

  return (
    <div style={{ ...baseStyle, ...(typeStyles[type] || typeStyles.default) }}>
      {message}
    </div>
  );
};

export default Notification;