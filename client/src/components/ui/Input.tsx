import React, { InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  wrapperClassName?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  className,
  wrapperClassName,
  type,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={cn("mb-4 w-full relative", wrapperClassName)}>
      {label && (
        <label className="block mb-2 text-text-muted text-sm font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={cn(
            "input",
            isPassword ? "pr-12" : "pr-3",
            className
          )}
          type={inputType}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-text-muted cursor-pointer p-1 flex items-center justify-center transition-colors hover:text-white focus:outline-none"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
