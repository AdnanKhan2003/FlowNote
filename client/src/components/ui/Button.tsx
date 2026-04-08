import React, { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "ghost" | "default";
  children: ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "default",
  children,
  fullWidth,
  style,
  className,
  ...props
}) => {
  let baseStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s",
    border: "none",
    width: fullWidth ? "100%" : "auto",
    justifyContent: fullWidth ? "center" : "auto",
    ...style,
  };

  if (variant === "primary") {
    baseStyle = {
      ...baseStyle,
      background: "var(--primary)",
      color: "white",
      border: "1px solid rgba(255,255,255,0.1)",
    };
  } else if (variant === "danger") {
    baseStyle = {
      ...baseStyle,
      background: "var(--danger)",
      color: "white",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    };
  } else if (variant === "ghost") {
    baseStyle = {
      ...baseStyle,
      background: "var(--glass)",
      color: "white",
      border: "1px solid var(--border)",
    };
  } else {
    baseStyle = {
      ...baseStyle,
      background: "rgba(255,255,255,0.06)",
      color: "var(--text-muted)",
      border: "1px solid rgba(255,255,255,0.08)",
    };
  }

  return (
    <button className={`btn ${className || ""}`} style={baseStyle} {...props}>
      {children}
    </button>
  );
};

export default Button;
