import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search } from "lucide-react";
import Header from "../components/layout/Header";
import NoteCard from "../components/dashboard/NoteCard";
import ActivitySidebar from "../components/dashboard/ActivitySidebar";
import DeleteConfirmModal from "../components/modals/DeleteConfirmModal";
import Input from "../components/ui/Input";

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [notes, setNotes] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchNotes = async () => {
    try {
      const res = await axios.get("/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchActivity = async () => {
    try {
      const res = await axios.get("/api/notes/activity/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActivities(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchNotes(), fetchActivity()]);
      setLoading(false);
    };
    init();
  }, []);

  const handleCreateNote = async () => {
    try {
      const res = await axios.post(
        "/api/notes",
        { title: "", content: "" },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      navigate(`/notes/${res.data.data.id}`);
    } catch (err) {
      alert("Failed to create note");
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await axios.delete(`/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsDeleting(null);
      await Promise.all([fetchNotes(), fetchActivity()]);
    } catch (err) {
      alert("Failed to delete note");
    }
  };

  const logout = () => {
    onLogout();
    navigate("/login");
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading)
    return <div className="text-white p-5">Loading...</div>;

  return (
    <div className="container animate-fade">
      <Header
        userEmail={user.email}
        userRole={user.role}
        onCreateNote={handleCreateNote}
        onLogout={logout}
      />

      <div className="relative mb-8">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors"
          size={18}
        />
        <Input
          type="text"
          placeholder="Search your notes..."
          className="pl-10 h-11"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8">
        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                userId={user.id}
                onClick={() => navigate(`/notes/${note.id}`)}
                onDeleteClick={(e) => {
                  e.stopPropagation();
                  setIsDeleting(note.id);
                }}
              />
            ))}
          </div>
        </main>

        <ActivitySidebar activities={activities} userEmail={user.email} />
      </div>

      <DeleteConfirmModal
        isOpen={!!isDeleting}
        onCancel={() => setIsDeleting(null)}
        onConfirm={() => isDeleting && handleDeleteNote(isDeleting)}
      />
    </div>
  );
};

export default Dashboard;
