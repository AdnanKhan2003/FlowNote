import React from "react";
import { Activity } from "lucide-react";

interface ActivitySidebarProps {
  activities: any[];
  userEmail: string;
}

const ActivitySidebar: React.FC<ActivitySidebarProps> = ({
  activities,
  userEmail,
}) => {
  return (
    <aside>
      <div className="glass-card" style={{ padding: "20px" }}>
        <h3
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "16px",
          }}
        >
          <Activity size={20} color="var(--primary)" /> Recent Activity
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {activities.length === 0 && (
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
              No activity yet.
            </p>
          )}
          {activities.map((act) => (
            <div key={act.id} style={{ fontSize: "13px" }}>
              <div style={{ color: "var(--text)" }}>
                <span style={{ fontWeight: "600", color: "var(--primary)" }}>
                  {act.userEmail === userEmail ? "You" : act.userEmail}
                </span>{" "}
                {act.action.toLowerCase()}d{" "}
                <strong>{act.noteTitle || "a note"}</strong>
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>
                {new Date(act.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default ActivitySidebar;
