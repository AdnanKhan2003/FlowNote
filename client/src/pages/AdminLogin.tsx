import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Shield } from "lucide-react";
import AuthCard from "../components/auth/AuthCard";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/admin/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      onLogin();
      navigate("/admin");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const footer = (
    <Link
      to="/login"
      className="text-text-muted hover:underline"
    >
      Return to User Login
    </Link>
  );

  const handleBypass = async () => {
    const bypassEmail = "admin@flownote.com";
    const bypassPassword = "admin@flownote.com";
    setEmail(bypassEmail);
    setPassword(bypassPassword);
    
    try {
      const res = await axios.post("/api/auth/admin/login", { 
        email: bypassEmail, 
        password: bypassPassword 
      });
      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      onLogin();
      navigate("/admin");
    } catch (err: any) {
      setError(err.response?.data?.message || "Bypass login failed");
    }
  };

  return (
    <AuthCard
      title={
        (
          <div className="flex items-center justify-center gap-3">
            <Shield className="text-accent" size={28} /> Admin Portal
          </div>
        ) as any
      }
      error={error}
      footer={footer}
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="Admin Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="admin@flownote.app"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          wrapperClassName="mb-6"
        />
        <div className="flex flex-col gap-3">
          <Button
            type="submit"
            fullWidth
            variant="primary"
            className="bg-accent hover:bg-accent/80"
          >
            Secure Login
          </Button>
          <Button 
            type="button" 
            variant="default" 
            fullWidth 
            onClick={handleBypass}
            className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20"
          >
            Bypass Admin Login
          </Button>
        </div>
      </form>
    </AuthCard>
  );
};

export default AdminLogin;
