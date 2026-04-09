import React from "react";
import { ArrowLeft, Save, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EditorHeaderProps {
  isReadOnly: boolean;
  isOwner: boolean;
  saving: boolean;
  onShareClick: () => void;
  onSaveClick: () => void;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({
  isReadOnly,
  isOwner,
  saving,
  onShareClick,
  onSaveClick,
}) => {
  const navigate = useNavigate();

  return (
    <header className="flex flex-wrap justify-between items-center gap-4 mb-6 pt-3">
      <button
        onClick={() => navigate("/dashboard")}
        className="btn bg-glass text-white border border-border hover:border-text-muted/30 whitespace-nowrap"
      >
        <ArrowLeft size={18} /> Back
      </button>
      <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
        {isReadOnly && (
          <div className="flex items-center px-3 py-2 text-text-muted text-sm bg-glass rounded-lg border border-border whitespace-nowrap">
            Read Only
          </div>
        )}
        {isOwner && (
          <button
            onClick={onShareClick}
            className="btn bg-glass text-white border border-border hover:border-text-muted/30 whitespace-nowrap"
          >
            <Share2 size={18} /> Share
          </button>
        )}
        {!isReadOnly && (
          <button
            onClick={onSaveClick}
            className="btn btn-primary whitespace-nowrap"
            disabled={saving}
          >
            {saving ? (
              "Saving..."
            ) : (
              <>
                <Save size={18} /> Save
              </>
            )}
          </button>
        )}
      </div>
    </header>
  );
};

export default EditorHeader;
