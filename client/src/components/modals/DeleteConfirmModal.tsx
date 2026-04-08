import React from "react";
import ReactDOM from "react-dom";
import { Trash2 } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="glass-card modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          padding: "48px 40px",
          textAlign: "center",
          border: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            width: "88px",
            height: "88px",
            borderRadius: "28px",
            background: "var(--glass)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto 28px",
            border: "1px solid var(--border)",
          }}
        >
          <Trash2 size={40} color="var(--danger)" strokeWidth={1.5} />
        </div>

        <h2
          style={{
            marginBottom: "12px",
            fontSize: "22px",
            fontWeight: "700",
            letterSpacing: "-0.02em",
          }}
        >
          Delete this note?
        </h2>

        <p
          style={{
            color: "var(--text-muted)",
            marginBottom: "36px",
            lineHeight: "1.7",
            fontSize: "15px",
            maxWidth: "320px",
            margin: "0 auto 36px",
          }}
        >
          This action is permanent and cannot be undone. All collaborators will
          immediately lose access.
        </p>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            className="btn"
            onClick={onCancel}
            style={{
              flex: 1,
              justifyContent: "center",
              background: "rgba(255,255,255,0.06)",
              color: "var(--text-muted)",
              fontWeight: "600",
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "12px 20px",
            }}
          >
            Cancel
          </button>
          <button
            className="btn"
            onClick={onConfirm}
            style={{
              flex: 1,
              justifyContent: "center",
              background: "var(--danger)",
              color: "white",
              fontWeight: "600",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              padding: "12px 20px",
              border: "none",
            }}
          >
            Delete permanently
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default DeleteConfirmModal;
