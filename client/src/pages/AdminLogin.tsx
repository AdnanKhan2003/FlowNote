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
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const footer = (
    <Link
      to="/login"
      style={{ color: "var(--text-muted)", textDecoration: "none" }}
    >
      Return to User Login
    </Link>
  );

  return (
    <AuthCard
      title={
        (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
            }}
          >
            <Shield color="var(--accent)" size={28} /> Admin Portal
          </span>
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
          wrapperStyle={{ marginBottom: "24px" }}
        />
        <Button
          type="submit"
          fullWidth
          style={{ background: "var(--accent)", color: "white" }}
        >
          Secure Login
        </Button>
      </form>
    </AuthCard>
  );
};

export default AdminLogin;
