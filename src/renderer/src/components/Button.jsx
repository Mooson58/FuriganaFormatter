import React from 'react';

const Button = ({ children, onClick, disabled = false }) => {
  return (
    <button
      className={`custom-button ${disabled ? 'disabled' : ''}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
