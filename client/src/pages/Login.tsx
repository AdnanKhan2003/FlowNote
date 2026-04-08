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
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const footer = (
    <>
      <Link
        to="/register"
        style={{ color: "var(--primary)", textDecoration: "none" }}
      >
        Create an account
      </Link>
      {" • "}
      <Link
        to="/admin"
        style={{ color: "var(--accent)", textDecoration: "none" }}
      >
        Admin Login
      </Link>
    </>
  );

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
          wrapperStyle={{ marginBottom: "24px" }}
        />
        <Button type="submit" variant="primary" fullWidth>
          Sign In
        </Button>
      </form>
    </AuthCard>
  );
};

export default Login;
