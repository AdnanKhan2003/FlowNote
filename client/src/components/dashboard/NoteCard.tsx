import React from "react";
import { FileText, Share2, Trash2 } from "lucide-react";

interface NoteCardProps {
  note: any;
  userId: string;
  onClick: () => void;
  onDeleteClick: (e: React.MouseEvent) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  userId,
  onClick,
  onDeleteClick,
}) => {
  return (
    <div
      className="glass-card note-card p-5 cursor-pointer flex flex-col h-full"
      onClick={onClick}
    >
      <div className="flex justify-between mb-3">
        <FileText size={24} className="text-primary" />
        <div className="flex gap-2 items-center">
          {note.isPublic && <Share2 size={16} className="text-accent" />}
          {String(note.ownerId) === String(userId) && (
            <Trash2 
               size={16} 
               className="text-danger hover:text-red-400 transition-colors" 
               onClick={onDeleteClick} 
            />
          )}
        </div>
      </div>
      <h3 className="mb-2 text-lg md:text-xl font-bold text-white tracking-tight">
        {note.title || "Untitled Note"}
      </h3>
      <p className="text-text-muted text-sm md:text-base line-clamp-3 flex-1">
        {note.content || "No content..."}
      </p>
      <div className="mt-4 text-[10px] md:text-xs text-text-muted">
        Last modified: {new Date(note.updatedAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default NoteCard;
