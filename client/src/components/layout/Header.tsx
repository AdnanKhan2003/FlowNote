import React from "react";
import { Plus, LogOut, Shield } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
  userEmail: string;
  userRole: string;
  onCreateNote: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  userEmail,
  userRole,
  onCreateNote,
  onLogout,
}) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pt-5">
      <div className="flex items-center gap-3">
        <img
          src="/favicon.ico"
          alt="FlowNote Logo"
          className="w-10 h-10 object-contain"
        />
        <div>
          <h1 className="text-3xl md:text-4xl font-black bg-gradient-primary bg-clip-text text-transparent m-0 leading-none tracking-tight">
            FlowNote
          </h1>
          <p className="text-text-muted m-0 mt-1 text-sm truncate max-w-[200px] sm:max-w-none">
            Welcome, {userEmail}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
        {userRole === "ADMIN" && (
          <Link 
            to="/admin" 
            className="btn bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:border-blue-500/40 whitespace-nowrap"
          >
            <Shield size={18} /> Admin
          </Link>
        )}
        <button onClick={onCreateNote} className="btn btn-primary whitespace-nowrap">
          <Plus size={20} /> New Note
        </button>
        <button
          onClick={onLogout}
          className="btn bg-glass text-white border border-border hover:border-text-muted/30 px-3!"
          title="Logout"
          aria-label="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
