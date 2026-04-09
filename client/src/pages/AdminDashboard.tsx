import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, Activity, Loader2, ArrowLeft, Shield, TrendingUp, Clock, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  userEmail: string;
  noteTitle: string;
}

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="glass-card p-6 flex items-center justify-between group">
    <div>
      <p className="text-text-muted text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
    </div>
    <div className={`p-3 rounded-2xl ${color} bg-glass group-hover:scale-110 transition-transform`}>
      <Icon className="w-6 h-6" />
    </div>
  </div>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<"users" | "activity">("users");
  const [users, setUsers] = useState<User[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");

    try {
      const [usersRes, activityRes] = await Promise.all([
        axios.get("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/admin/activity", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setUsers(usersRes.data.data);
      setActivities(activityRes.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-bg text-text">
        <div className="relative">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse"></div>
        </div>
        <p className="text-text-muted font-medium tracking-wide">Initializing Oversight Console...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 bg-bg text-text">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center space-x-4 md:space-x-6">
            <Link
              to="/dashboard"
              className="p-3 bg-glass border border-border text-text-muted transition-all hover:text-white rounded-2xl group cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">System Intel</h1>
                <span className="bg-primary/10 text-primary text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md border border-primary/20 uppercase tracking-widest">Live</span>
              </div>
              <p className="text-text-muted font-medium italic text-sm md:text-base">Observing the FlowNote Network</p>
            </div>
          </div>
          <div className="flex items-center self-start md:self-auto px-4 py-2 space-x-2 border bg-accent/5 border-accent/10 rounded-2xl">
            <Shield className="w-4 h-4 text-accent" />
            <span className="text-[10px] sm:text-xs font-bold text-accent uppercase tracking-tighter">Root Administrator</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <StatCard 
                title="Active Nodes (Users)" 
                value={users.length} 
                icon={Users} 
                color="text-primary"
            />
            <StatCard 
                title="System Throughput (Logs)" 
                value={activities.length} 
                icon={TrendingUp} 
                color="text-accent"
            />
             <StatCard 
                title="Recent Joiners" 
                value={users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 86400000)).length} 
                icon={UserPlus} 
                color="text-danger"
            />
        </div>

        {error && (
          <div className="p-4 mb-6 border bg-danger/10 border-danger/20 rounded-2xl text-danger font-medium flex items-center gap-3 animate-shake">
            <div className="w-2 h-2 bg-danger rounded-full animate-ping"></div>
            {error}
          </div>
        )}

        <div className="flex p-1.5 mb-8 gap-1 glass-card w-full md:w-fit">
          <button
            onClick={() => setActiveTab("users")}
            className={`flex-1 md:flex-none flex items-center justify-center space-x-2 px-3 md:px-8 py-2.5 rounded-xl transition-all duration-300 cursor-pointer ${
              activeTab === "users"
                ? "bg-primary text-white shadow-xl shadow-primary/20"
                : "text-text-muted hover:text-white hover:bg-glass"
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wide truncate">User Directory</span>
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`flex-1 md:flex-none flex items-center justify-center space-x-2 px-3 md:px-8 py-2.5 rounded-xl transition-all duration-300 cursor-pointer ${
              activeTab === "activity"
                ? "bg-primary text-white shadow-xl shadow-primary/20"
                : "text-text-muted hover:text-white hover:bg-glass"
            }`}
          >
            <Activity className="w-4 h-4 shrink-0" />
            <span className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wide truncate">System Stream</span>
          </button>
        </div>

        <div className="overflow-hidden glass-card">
          {activeTab === "users" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-glass">
                    <th className="px-8 py-5 text-[10px] sm:text-xs font-black text-text-muted uppercase tracking-[0.2em]">Endpoint (Email)</th>
                    <th className="px-8 py-5 text-[10px] sm:text-xs font-black text-text-muted uppercase tracking-[0.2em]">Permission</th>
                    <th className="px-8 py-5 text-[10px] sm:text-xs font-black text-text-muted uppercase tracking-[0.2em]">Registry Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((user) => (
                    <tr key={user.id} className="transition-all hover:bg-glass group">
                      <td className="px-8 py-5 font-bold text-white">{user.email}</td>
                      <td className="px-8 py-5">
                        <span className={`px-2 py-1 text-[9px] font-black uppercase rounded-md tracking-wider border ${
                          user.role === 'ADMIN' ? 'bg-accent/10 text-accent border-accent/20' : 'bg-primary/10 text-primary border-primary/20'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-text-muted font-medium text-xs">
                            <Clock className="w-3 h-3" />
                            {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-glass">
                    <th className="px-8 py-5 text-[10px] sm:text-xs font-black text-text-muted uppercase tracking-[0.2em]">Temporal Marker</th>
                    <th className="px-8 py-5 text-[10px] sm:text-xs font-black text-text-muted uppercase tracking-[0.2em]">Agent</th>
                    <th className="px-8 py-5 text-[10px] sm:text-xs font-black text-text-muted uppercase tracking-[0.2em]">Target Entity</th>
                    <th className="px-8 py-5 text-[10px] sm:text-xs font-black text-text-muted uppercase tracking-[0.2em]">Action Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {activities.map((log) => (
                    <tr key={log.id} className="transition-all hover:bg-glass group">
                      <td className="px-8 py-5 text-xs font-mono text-text-muted">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="px-8 py-5 font-bold text-white">{log.userEmail}</td>
                      <td className="px-8 py-5">
                          <span className="text-text-muted italic text-sm">{log.noteTitle || "\u2014 Deleted \u2014"}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-2 py-1 text-[9px] font-black uppercase rounded-md tracking-wider border ${
                          log.action === 'CREATE' ? 'bg-primary/10 text-primary border-primary/20' :
                          log.action === 'DELETE' ? 'bg-danger/10 text-danger border-danger/20' :
                          'bg-accent/10 text-accent border-accent/20'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
        .animate-shake { animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
