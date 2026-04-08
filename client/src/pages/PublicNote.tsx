import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const PublicNote: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPublicNote = async () => {
      try {
        const res = await axios.get(`/api/notes/${id}`);
        setNote(res.data);
      } catch (err: any) {
        setError('This note is private or does not exist.');
      }
    };
    fetchPublicNote();
  }, [id]);

  if (error) return (
    <div style={{ padding: '100px', textAlign: 'center', color: 'white' }}>
      <h1>Access Denied</h1>
      <p style={{ color: 'var(--text-muted)' }}>{error}</p>
      <Link to="/login" style={{ color: 'var(--primary)', marginTop: '20px', display: 'block' }}>Go to Login</Link>
    </div>
  );

  if (!note) return <div style={{ color: 'white', padding: '20px' }}>Loading...</div>;

  return (
    <div className="container animate-fade" style={{ maxWidth: '800px', paddingTop: '60px' }}>
      <div className="glass-card" style={{ padding: '60px' }}>
        <h1 style={{ marginBottom: '32px', fontSize: '3rem' }}>{note.title || 'Untitled Note'}</h1>
        <div style={{ color: 'var(--text)', fontSize: '1.2rem', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
          {note.content}
        </div>
        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border)', fontSize: '14px', color: 'var(--text-muted)' }}>
          Shared via FlowNote • READ ONLY
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Link to="/register" className="btn btn-primary">Create your own notes</Link>
      </div>
    </div>
  );
};

export default PublicNote;
