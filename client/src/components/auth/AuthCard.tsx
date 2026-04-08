import React, { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  error?: string;
  children: ReactNode;
  footer?: ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({
  title,
  error,
  children,
  footer,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        className="glass-card animate-fade"
        style={{ padding: "40px", width: "100%", maxWidth: "400px" }}
      >
        <h1 style={{ marginBottom: "24px", textAlign: "center" }}>{title}</h1>
        {error && (
          <p
            style={{
              color: "var(--danger)",
              marginBottom: "16px",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}
        {children}
        {footer && (
          <div
            style={{
              marginTop: "24px",
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: "14px",
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCard;
