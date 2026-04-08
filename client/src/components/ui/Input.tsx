import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  wrapperStyle?: React.CSSProperties;
}

const Input: React.FC<InputProps> = ({ label, style, className, wrapperStyle, ...props }) => {
  return (
    <div style={{ marginBottom: '16px', width: '100%', ...wrapperStyle }}>
      {label && <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '14px' }}>{label}</label>}
      <input 
        className={`input ${className || ''}`}
        style={{ ...style }}
        {...props}
      />
    </div>
  );
};

export default Input;
