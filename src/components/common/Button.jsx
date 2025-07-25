// src/components/common/Button.jsx
import React from 'react';
import { twMerge } from 'tailwind-merge'; // For merging Tailwind classes gracefully

const Button = ({ children, className = '', ...props }) => {
  return (
    <button
      className={twMerge(
        'px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-electric focus:ring-opacity-50 transition-all duration-200',
        'bg-steel hover:bg-steel-light text-text-light', // Default button styling
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;