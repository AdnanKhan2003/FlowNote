import React, { SelectHTMLAttributes, ReactNode } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  wrapperStyle?: React.CSSProperties;
  children: ReactNode;
}

const Select: React.FC<SelectProps> = ({ label, style, className, wrapperStyle, children, ...props }) => {
  return (
    <div style={{ marginBottom: '16px', width: '100%', ...wrapperStyle }}>
      {label && <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '14px' }}>{label}</label>}
      <select 
        className={`input ${className || ''}`}
        style={{ ...style }}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

export default Select;
