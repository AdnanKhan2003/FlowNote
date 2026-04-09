import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import EditorHeader from "../components/editor/EditorHeader";
import ShareModal from "../components/modals/ShareModal";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";

const Editor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [sharePermission, setSharePermission] = useState("VIEWER");
  const [copied, setCopied] = useState(false);
  const [permission, setPermission] = useState("VIEWER");
  const [shareStatus, setShareStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [shareMessage, setShareMessage] = useState("");

  const isReadOnly = permission === "VIEWER";
  const isOwner = permission === "OWNER";

  const socketRef = useRef<Socket | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!id) {
      console.error("No note ID in URL params");
      navigate("/dashboard");
      return;
    }

    const fetchNote = async () => {
      try {
        const res = await axios.get(`/api/notes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNote(res.data.data);
        setTitle(res.data.data.title);
        setContent(res.data.data.content);
        setIsPublic(res.data.data.isPublic);
        setPermission(res.data.data.currentUserPermission || "VIEWER");
      } catch (err) {
        console.error("[Editor] Failed to fetch note:", err);
        navigate("/dashboard");
      }
    };

    fetchNote();

    const socketUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    socketRef.current = io(socketUrl, { path: "/socket.io" });
    socketRef.current.emit("join-note", id);

    socketRef.current.on("note-updated", (data) => {
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
      await axios.put(
        `/api/notes/${id}`,
        { title, content, isPublic },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setSaving(false);
    } catch (err) {
      alert("Failed to save");
      setSaving(false);
    }
  };

  const handleLocalChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: "title" | "content",
  ) => {
    if (isReadOnly) return;

    const value = e.target.value;
    if (field === "title") setTitle(value);
    else setContent(value);

    if (socketRef.current && id) {
      socketRef.current.emit("edit-note", { noteId: id, [field]: value });
    }
  };

  const shareNote = async () => {
    if (!id) return;
    setShareStatus("loading");
    setShareMessage("");
    try {
      await axios.post(
        `/api/notes/${id}/collaborators`,
        { email: shareEmail, permission: sharePermission },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setShareStatus("success");
      setShareMessage("Invitation sent successfully!");
      setShareEmail("");
    } catch (err: any) {
      setShareStatus("error");
      setShareMessage(err.response?.data?.message || "Failed to share note");
    }
  };

  const togglePublic = async () => {
    if (!id) return;
    const newIsPublic = !isPublic;
    setIsPublic(newIsPublic);
    try {
      await axios.put(
        `/api/notes/${id}`,
        { isPublic: newIsPublic },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    } catch (err) {
      setIsPublic(!newIsPublic);
      alert("Failed to update");
    }
  };

  const copyPublicLink = () => {
    const url = `${window.location.origin}/public/${id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!note)
    return <div className="text-white p-5">Loading...</div>;

  return (
    <div className="container animate-fade">
      <EditorHeader
        isReadOnly={isReadOnly}
        isOwner={isOwner}
        saving={saving}
        onShareClick={() => setShowShareModal(true)}
        onSaveClick={handleUpdate}
      />

      <div
        className="glass-card p-10 min-h-[70vh]"
      >
        <Input
          type="text"
          value={title}
          onChange={(e) => handleLocalChange(e, "title")}
          placeholder="Untitled Note"
          readOnly={isReadOnly}
          className="bg-transparent border-none text-white text-3xl md:text-4xl lg:text-5xl font-black outline-none p-0 focus:border-none ring-0 shadow-none tracking-tight"
          wrapperClassName="mb-6"
        />
        <Textarea
          value={content}
          onChange={(e) => handleLocalChange(e, "content")}
          placeholder={isReadOnly ? "This note is empty." : "Start writing..."}
          readOnly={isReadOnly}
          className="min-h-[50vh]"
        />
      </div>

      <ShareModal
        isOpen={showShareModal}
        isPublic={isPublic}
        shareEmail={shareEmail}
        sharePermission={sharePermission}
        shareStatus={shareStatus}
        shareMessage={shareMessage}
        copied={copied}
        noteId={id!}
        onClose={() => {
          setShowShareModal(false);
          setShareStatus("idle");
          setShareMessage("");
        }}
        onTogglePublic={togglePublic}
        onCopyPublicLink={copyPublicLink}
        onShareEmailChange={(val) => {
          setShareEmail(val);
          if (shareStatus !== "idle") setShareStatus("idle");
        }}
        onSharePermissionChange={setSharePermission}
        onShareSubmit={shareNote}
      />
    </div>
  );
};

export default Editor;
