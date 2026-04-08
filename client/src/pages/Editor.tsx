import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { ArrowLeft, Save, Share2, Users, Check, Copy } from 'lucide-react';

const Editor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [sharePermission, setSharePermission] = useState('VIEWER');
  const [copied, setCopied] = useState(false);
  const [permission, setPermission] = useState('VIEWER');
  
  const isReadOnly = permission === 'VIEWER';
  const isOwner = permission === 'OWNER';
  
  const socketRef = useRef<Socket | null>(null);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!id) {
      console.error('No note ID in URL params');
      navigate('/dashboard');
      return;
    }

    const fetchNote = async () => {
      try {
        const res = await axios.get(`/api/notes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNote(res.data);
        setTitle(res.data.title);
        setContent(res.data.content);
        setIsPublic(res.data.isPublic);
        setPermission(res.data.currentUserPermission || 'VIEWER');
      } catch (err) {
        console.error('[Editor] Failed to fetch note:', err);
        navigate('/dashboard');
      }
    };

    fetchNote();


    socketRef.current = io('/', { path: '/socket.io' });
    socketRef.current.emit('join-note', id);

    socketRef.current.on('note-updated', (data) => {
      if (data.title !== undefined) setTitle(data.title);
      if (data.content !== undefined) setContent(data.content);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [id]);

  const handleUpdate = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await axios.put(`/api/notes/${id}`, { title, content, isPublic }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSaving(false);
    } catch (err) {
      alert('Failed to save');
      setSaving(false);
    }
  };

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: 'title' | 'content') => {
    if (isReadOnly) return;
    
    const value = e.target.value;
    if (field === 'title') setTitle(value);
    else setContent(value);

    if (socketRef.current && id) {
      socketRef.current.emit('edit-note', { noteId: id, [field]: value });
    }
  };

  const shareNote = async () => {
    if (!id) return;
    try {
      await axios.post(`/api/notes/${id}/collaborators`, { email: shareEmail, permission: sharePermission }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Shared successfully');
      setShareEmail('');
    } catch (err) {
      alert('Failed to share');
    }
  };

  const togglePublic = async () => {
    if (!id) return;
    const newIsPublic = !isPublic;
    setIsPublic(newIsPublic);
    try {
      await axios.put(`/api/notes/${id}`, { isPublic: newIsPublic }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      setIsPublic(!newIsPublic);
      alert('Failed to update');
    }
  };

  const copyPublicLink = () => {
    const url = `${window.location.origin}/public/${id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!note) return <div style={{ color: 'white', padding: '20px' }}>Loading...</div>;

  return (
    <div className="container animate-fade" style={{ maxWidth: '900px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingTop: '10px' }}>
        <button onClick={() => navigate('/dashboard')} className="btn" style={{ background: 'var(--glass)', color: 'white' }}>
          <ArrowLeft size={18} /> Back
        </button>
        <div style={{ display: 'flex', gap: '12px' }}>
          {isReadOnly && (
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px', color: 'var(--text-muted)', fontSize: '14px', background: 'var(--glass)', borderRadius: '8px' }}>
              Read Only
            </div>
          )}
          {isOwner && (
            <button onClick={() => setShowShareModal(true)} className="btn" style={{ background: 'var(--glass)', color: 'white' }}>
              <Share2 size={18} /> Share
            </button>
          )}
          {!isReadOnly && (
            <button onClick={handleUpdate} className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : <><Save size={18} /> Save</>}
            </button>
          )}
        </div>
      </header>

      <div className="glass-card" style={{ padding: '40px', minHeight: '70vh' }}>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => handleLocalChange(e, 'title')}
          placeholder="Untitled Note"
          readOnly={isReadOnly}
          style={{ 
            width: '100%', 
            background: 'transparent', 
            border: 'none', 
            color: 'white', 
            fontSize: '2.5rem', 
            fontWeight: '800', 
            outline: 'none', 
            marginBottom: '24px' 
          }}
        />
        <textarea 
          value={content} 
          onChange={(e) => handleLocalChange(e, 'content')}
          placeholder={isReadOnly ? "This note is empty." : "Start writing..."}
          readOnly={isReadOnly}
          style={{ 
            width: '100%', 
            minHeight: '50vh', 
            background: 'transparent', 
            border: 'none', 
            color: 'var(--text)', 
            fontSize: '1.2rem', 
            lineHeight: '1.6', 
            outline: 'none', 
            resize: 'none' 
          }}
        />
      </div>

      {showShareModal && ReactDOM.createPortal(
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="glass-card modal-card-share" onClick={(e) => e.stopPropagation()} style={{ padding: '32px' }}>
            <h2 style={{ marginBottom: '20px', fontWeight: '700', letterSpacing: '-0.02em' }}>Share Note</h2>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '14px' }}>Public Access</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input type="checkbox" checked={isPublic} onChange={togglePublic} style={{ width: '20px', height: '20px' }} />
                <span>Anyone with link can view</span>
              </div>
              {isPublic && (
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                  <input className="input" value={`${window.location.origin}/public/${id}`} readOnly />
                  <button className="btn" style={{ background: 'var(--glass)', color: 'white', border: '1px solid var(--border)' }} onClick={copyPublicLink}>
                    {copied ? <Check size={18} color="var(--accent)" /> : <Copy size={18} />}
                  </button>
                </div>
              )}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: '24px' }} />

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '14px' }}>Invite Collaborators</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input className="input" placeholder="User email" value={shareEmail} onChange={(e) => setShareEmail(e.target.value)} />
                <select className="input" style={{ width: '120px' }} value={sharePermission} onChange={(e) => setSharePermission(e.target.value)}>
                  <option value="VIEWER">Viewer</option>
                  <option value="EDITOR">Editor</option>
                </select>
              </div>
              <button onClick={shareNote} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Invite</button>
            </div>

            <button onClick={() => setShowShareModal(false)} className="btn" style={{ width: '100%', justifyContent: 'center', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.08)' }}>Close</button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Editor;
