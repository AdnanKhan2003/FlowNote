import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, FileText, Share2, Trash2, LogOut, Search, Activity, AlertTriangle } from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [notes, setNotes] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchNotes = async () => {
    try {
      const res = await axios.get('/api/notes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchActivity = async () => {
    try {
      const res = await axios.get('/api/notes/activity/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivities(res.data);
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
      const res = await axios.post('/api/notes', { title: '', content: '' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate(`/notes/${res.data.id}`);
    } catch (err) {
      alert('Failed to create note');
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await axios.delete(`/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsDeleting(null);
      await Promise.all([fetchNotes(), fetchActivity()]);
    } catch (err) {
      alert('Failed to delete note');
    }
  };

  const logout = () => {
    onLogout();
    navigate('/login');
  };

  const filteredNotes = notes.filter(n => n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div style={{ color: 'white', padding: '20px' }}>Loading...</div>;

  return (
    <div className="container animate-fade">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', paddingTop: '20px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', background: 'linear-gradient(to right, #6366f1, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FlowNote</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome, {user.email}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleCreateNote} className="btn btn-primary">
            <Plus size={20} /> New Note
          </button>
          <button onClick={logout} className="btn" style={{ background: 'var(--glass)', color: 'white' }}>
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px' }}>
        <main>
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              type="text" 
              className="input" 
              placeholder="Search your notes..." 
              style={{ paddingLeft: '40px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {filteredNotes.map(note => (
              <div key={note.id} className="glass-card note-card" style={{ padding: '20px' }} onClick={() => navigate(`/notes/${note.id}`)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <FileText size={24} color="var(--primary)" />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {note.isPublic && <Share2 size={16} color="var(--accent)" />}
                    {String(note.ownerId) === String(user.id) && (
                      <Trash2 
                        size={16} 
                        color="var(--danger)" 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setIsDeleting(note.id);
                        }} 
                      />
                    )}
                  </div>
                </div>
                <h3 style={{ marginBottom: '8px', fontSize: '18px' }}>{note.title || 'Untitled Note'}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {note.content || 'No content...'}
                </p>
                <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  Last modified: {new Date(note.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </main>

        <aside>
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Activity size={20} color="var(--primary)" /> Recent Activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activities.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No activity yet.</p>}
              {activities.map(act => (
                <div key={act.id} style={{ fontSize: '13px' }}>
                  <div style={{ color: 'var(--text)' }}>
                    <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{act.userEmail === user.email ? 'You' : act.userEmail}</span> {act.action.toLowerCase()}d <strong>{act.noteTitle || 'a note'}</strong>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{new Date(act.timestamp).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Delete Confirmation Modal — rendered via Portal */}
      {isDeleting && ReactDOM.createPortal(
        <div className="modal-overlay" onClick={() => setIsDeleting(null)}>
          <div className="glass-card modal-card" onClick={(e) => e.stopPropagation()} style={{ padding: '48px 40px', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
            
            {/* Icon */}
            <div style={{ 
              width: '88px', 
              height: '88px', 
              borderRadius: '28px', 
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              margin: '0 auto 28px',
              border: '1px solid rgba(239, 68, 68, 0.1)'
            }}>
              <Trash2 size={40} color="#ef4444" strokeWidth={1.5} />
            </div>

            {/* Title */}
            <h2 style={{ marginBottom: '12px', fontSize: '22px', fontWeight: '700', letterSpacing: '-0.02em' }}>Delete this note?</h2>
            
            {/* Description */}
            <p style={{ 
              color: 'var(--text-muted)', 
              marginBottom: '36px', 
              lineHeight: '1.7',
              fontSize: '15px',
              maxWidth: '320px',
              margin: '0 auto 36px'
            }}>
              This action is permanent and cannot be undone. All collaborators will immediately lose access.
            </p>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn" 
                onClick={() => setIsDeleting(null)}
                style={{ 
                  flex: 1, 
                  justifyContent: 'center', 
                  background: 'rgba(255,255,255,0.06)', 
                  color: 'var(--text-muted)',
                  fontWeight: '600',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '12px 20px'
                }}
              >
                Cancel
              </button>
              <button 
                className="btn" 
                onClick={() => handleDeleteNote(isDeleting)}
                style={{ 
                  flex: 1, 
                  justifyContent: 'center', 
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)', 
                  color: 'white', 
                  fontWeight: '600', 
                  boxShadow: '0 8px 24px -4px rgba(239, 68, 68, 0.5)',
                  padding: '12px 20px',
                  border: 'none'
                }}
              >
                Delete permanently
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Dashboard;
