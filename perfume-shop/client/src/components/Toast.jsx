import React from 'react';
import './Toast.css';

// Temporary notification that auto-dismisses after 3 seconds
const Toast = ({ message, visible }) => {
  if (!visible) return null;

  return (
    <div className="toast slide-in">
      {message}
    </div>
  );
};

export default Toast;
