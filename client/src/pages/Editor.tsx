import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import EditorHeader from '../components/editor/EditorHeader';
import ShareModal from '../components/modals/ShareModal';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';

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
      <EditorHeader 
        isReadOnly={isReadOnly} 
        isOwner={isOwner} 
        saving={saving} 
        onShareClick={() => setShowShareModal(true)} 
        onSaveClick={handleUpdate} 
      />

      <div className="glass-card" style={{ padding: '40px', minHeight: '70vh' }}>
        <Input 
          type="text" 
          value={title} 
          onChange={(e) => handleLocalChange(e, 'title')}
          placeholder="Untitled Note"
          readOnly={isReadOnly}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: 'white', 
            fontSize: '2.5rem', 
            fontWeight: '800', 
            outline: 'none',
            padding: 0
          }}
          wrapperStyle={{ marginBottom: '24px' }}
        />
        <Textarea 
          value={content} 
          onChange={(e) => handleLocalChange(e, 'content')}
          placeholder={isReadOnly ? "This note is empty." : "Start writing..."}
          readOnly={isReadOnly}
          style={{ 
            minHeight: '50vh', 
          }}
        />
      </div>

      <ShareModal 
        isOpen={showShareModal}
        isPublic={isPublic}
        shareEmail={shareEmail}
        sharePermission={sharePermission}
        copied={copied}
        noteId={id!}
        onClose={() => setShowShareModal(false)}
        onTogglePublic={togglePublic}
        onCopyPublicLink={copyPublicLink}
        onShareEmailChange={setShareEmail}
        onSharePermissionChange={setSharePermission}
        onShareSubmit={shareNote}
      />
    </div>
  );
};

export default Editor;
