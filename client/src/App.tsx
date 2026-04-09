import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import PublicNote from "./pages/PublicNote";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import axios from "axios";

axios.defaults.baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(
    !!localStorage.getItem("token"),
  );

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "ADMIN";

  const NavigateByRole = () => {
    return isAdmin ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />;
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login onLogin={() => setIsAuthenticated(true)} />
            ) : (
              <NavigateByRole />
            )
          }
        />
        <Route
          path="/register"
          element={
            !isAuthenticated ? <Register /> : <NavigateByRole />
          }
        />
        <Route
          path="/admin/login"
          element={
            !isAuthenticated ? (
              <AdminLogin onLogin={() => setIsAuthenticated(true)} />
            ) : (
              <NavigateByRole />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/notes/:id"
          element={isAuthenticated ? <Editor /> : <Navigate to="/login" />}
        />
        <Route path="/public/:id" element={<PublicNote />} />
        <Route
          path="/admin"
          element={
            isAuthenticated && isAdmin ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route path="/" element={<NavigateByRole />} />
      </Routes>
    </Router>
  );
};

export default App;
