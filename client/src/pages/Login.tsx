import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthCard from "../components/auth/AuthCard";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      onLogin();

      if (res.data.data.user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const footer = (
    <div className="flex items-center justify-center gap-2">
      <Link
        to="/register"
        className="text-primary hover:underline"
      >
        Create an account
      </Link>
      <span className="text-text-muted opacity-50">•</span>
      <Link
        to="/admin/login"
        className="text-accent hover:underline"
      >
        Admin Login
      </Link>
    </div>
  );

  const handleBypass = async () => {
    const bypassEmail = "adnan@gmail.com";
    const bypassPassword = "adnan@gmail.com";
    setEmail(bypassEmail);
    setPassword(bypassPassword);
    
    try {
      const res = await axios.post("/api/auth/login", { 
        email: bypassEmail, 
        password: bypassPassword 
      });
      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      onLogin();

      if (res.data.data.user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Bypass login failed");
    }
  };

  return (
    <AuthCard title="Welcome Back" error={error} footer={footer}>
      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
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
          <Button type="submit" variant="primary" fullWidth>
            Sign In
          </Button>
          <Button 
            type="button" 
            variant="default" 
            fullWidth 
            onClick={handleBypass}
            className="bg-accent/10 text-accent hover:bg-accent/20 border border-accent/20"
          >
            Bypass User Login
          </Button>
        </div>
      </form>
    </AuthCard>
  );
};

export default Login;
