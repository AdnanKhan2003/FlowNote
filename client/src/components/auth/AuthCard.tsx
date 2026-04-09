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
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="glass-card animate-fade p-8 md:p-10 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">{title}</h1>
        {error && (
          <p className="text-danger mb-4 text-sm text-center">
            {error}
          </p>
        )}
        {children}
        {footer && (
          <div className="mt-6 text-center text-text-muted text-sm">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCard;
