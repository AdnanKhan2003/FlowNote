import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthCard from "../components/auth/AuthCard";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/register", {
        email,
        password,
        role: "EDITOR",
      });
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  const footer = (
    <>
      <Link
        to="/login"
        style={{ color: "var(--primary)", textDecoration: "none" }}
      >
        Already have an account? Sign In
      </Link>
    </>
  );

  return (
    <AuthCard title="Create Account" error={error} footer={footer}>
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
          Create Account
        </Button>
      </form>
    </AuthCard>
  );
};

export default Register;
