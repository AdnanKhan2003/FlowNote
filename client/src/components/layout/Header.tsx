import React from 'react';
import { Plus, LogOut } from 'lucide-react';

interface HeaderProps {
  userEmail: string;
  onCreateNote: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ userEmail, onCreateNote, onLogout }) => {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', paddingTop: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img src="/favicon.ico" alt="FlowNote Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', background: 'linear-gradient(to right, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0, lineHeight: 1 }}>FlowNote</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, marginTop: '4px' }}>Welcome, {userEmail}</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={onCreateNote} className="btn btn-primary">
          <Plus size={20} /> New Note
        </button>
        <button onClick={onLogout} className="btn" style={{ background: 'var(--glass)', color: 'white' }}>
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}

export default Header;
