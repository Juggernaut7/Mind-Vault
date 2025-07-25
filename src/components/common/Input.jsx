// src/components/common/Input.jsx
import React from 'react';
import { twMerge } from 'tailwind-merge';

const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={twMerge(
        'w-full p-2 rounded-md bg-midnight-700 text-text-light border border-steel-dark focus:border-electric focus:ring-electric focus:ring-1 outline-none transition-all duration-200',
        className
      )}
      {...props}
    />
  );
};

export default Input;