import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const PublicNote: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPublicNote = async () => {
      try {
        const res = await axios.get(`/api/notes/${id}`);
        setNote(res.data.data);
      } catch (err: any) {
        setError("This note is private or does not exist.");
      }
    };
    fetchPublicNote();
  }, [id]);

  if (error)
    return (
      <div className="container py-24 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
        <p className="text-text-muted mb-8">{error}</p>
        <Link
          to="/login"
          className="text-primary hover:underline"
        >
          Go to Login
        </Link>
      </div>
    );

  if (!note)
    return <div className="text-white p-5">Loading...</div>;

  return (
    <div className="container animate-fade py-10 md:py-16">
      <div className="glass-card p-10 md:p-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-white leading-tight">
          {note.title || "Untitled Note"}
        </h1>
        <div className="text-text text-lg md:text-xl leading-relaxed whitespace-pre-wrap">
          {note.content}
        </div>
        <div className="mt-10 pt-5 border-t border-border text-sm text-text-muted">
          Shared via FlowNote • READ ONLY
        </div>
      </div>
      <div className="text-center mt-10">
        <Link to="/register" className="btn btn-primary">
          Create your own notes
        </Link>
      </div>
    </div>
  );
};

export default PublicNote;
