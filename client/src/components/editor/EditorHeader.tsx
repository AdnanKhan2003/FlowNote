import React from 'react';
import { ArrowLeft, Save, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EditorHeaderProps {
  isReadOnly: boolean;
  isOwner: boolean;
  saving: boolean;
  onShareClick: () => void;
  onSaveClick: () => void;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({ isReadOnly, isOwner, saving, onShareClick, onSaveClick }) => {
  const navigate = useNavigate();

  return (
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
          <button onClick={onShareClick} className="btn" style={{ background: 'var(--glass)', color: 'white' }}>
            <Share2 size={18} /> Share
          </button>
        )}
        {!isReadOnly && (
          <button onClick={onSaveClick} className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : <><Save size={18} /> Save</>}
          </button>
        )}
      </div>
    </header>
  );
};

export default EditorHeader;
