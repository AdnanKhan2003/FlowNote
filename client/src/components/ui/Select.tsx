import React, { SelectHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  wrapperClassName?: string;
  children: ReactNode;
}

const Select: React.FC<SelectProps> = ({
  label,
  className,
  wrapperClassName,
  children,
  ...props
}) => {
  return (
    <div className={cn("mb-4 w-full", wrapperClassName)}>
      {label && (
        <label className="block mb-2 text-text-muted text-sm font-medium">
          {label}
        </label>
      )}
      <select
        className={cn("input", className)}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

export default Select;
