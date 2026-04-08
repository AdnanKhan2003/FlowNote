import React from 'react';
import { FileText, Share2, Trash2 } from 'lucide-react';

interface NoteCardProps {
  note: any;
  userId: string;
  onClick: () => void;
  onDeleteClick: (e: React.MouseEvent) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, userId, onClick, onDeleteClick }) => {
  return (
    <div className="glass-card note-card" style={{ padding: '20px', cursor: 'pointer' }} onClick={onClick}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <FileText size={24} color="var(--primary)" />
        <div style={{ display: 'flex', gap: '8px' }}>
          {note.isPublic && <Share2 size={16} color="var(--accent)" />}
          {String(note.ownerId) === String(userId) && (
            <Trash2 
              size={16} 
              color="var(--danger)" 
              onClick={onDeleteClick} 
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
  );
};

export default NoteCard;
