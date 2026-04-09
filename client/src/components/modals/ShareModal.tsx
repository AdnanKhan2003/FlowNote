import React from "react";
import ReactDOM from "react-dom";
import { Check, Copy } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Select from "../ui/Select";

interface ShareModalProps {
  isOpen: boolean;
  isPublic: boolean;
  shareEmail: string;
  sharePermission: string;
  copied: boolean;
  noteId: string;
  onClose: () => void;
  onTogglePublic: () => void;
  onCopyPublicLink: () => void;
  onShareEmailChange: (val: string) => void;
  onSharePermissionChange: (val: string) => void;
  onShareSubmit: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  isPublic,
  shareEmail,
  sharePermission,
  copied,
  noteId,
  onClose,
  onTogglePublic,
  onCopyPublicLink,
  onShareEmailChange,
  onSharePermissionChange,
  onShareSubmit,
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-card modal-card-share"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: "32px" }}
      >
        <h2
          style={{
            marginBottom: "20px",
            fontWeight: "700",
            letterSpacing: "-0.02em",
          }}
        >
          Share Note
        </h2>

        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              color: "var(--text-muted)",
              fontSize: "14px",
            }}
          >
            Public Access
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={onTogglePublic}
              style={{ width: "20px", height: "20px" }}
            />
            <span>Anyone with link can view</span>
          </div>
          {isPublic && (
            <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
              <Input
                value={`${window.location.origin}/public/${noteId}`}
                readOnly
                wrapperClassName="mb-0"
              />
              <Button variant="ghost" onClick={onCopyPublicLink}>
                {copied ? (
                  <Check size={18} color="var(--accent)" />
                ) : (
                  <Copy size={18} />
                )}
              </Button>
            </div>
          )}
        </div>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid var(--border)",
            marginBottom: "24px",
          }}
        />

        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "8px",
              alignItems: "flex-end",
            }}
          >
            <Input
              label="Invite Collaborators"
              placeholder="User email"
              value={shareEmail}
              onChange={(e) => onShareEmailChange(e.target.value)}
              wrapperClassName="mb-0"
            />
            <Select
              className="w-[120px]"
              value={sharePermission}
              onChange={(e) => onSharePermissionChange(e.target.value)}
              wrapperClassName="w-auto mb-0"
            >
              <option value="VIEWER">Viewer</option>
              <option value="EDITOR">Editor</option>
            </Select>
          </div>
          <Button variant="primary" fullWidth onClick={onShareSubmit}>
            Invite
          </Button>
        </div>

        <Button fullWidth onClick={onClose}>
          Close
        </Button>
      </div>
    </div>,
    document.body,
  );
};

export default ShareModal;
