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
    <aside className="w-full md:sticky md:top-10 h-fit">
      <div className="glass-card p-5">
        <h3 className="flex items-center gap-2 mb-4 text-white font-semibold">
          <Activity size={20} className="text-primary" /> Recent Activity
        </h3>
        <div className="flex flex-col gap-4">
          {activities.length === 0 && (
            <p className="text-text-muted text-sm italic">
              No activity yet.
            </p>
          )}
          {activities.map((act) => (
            <div key={act.id} className="text-[13px] border-l-2 border-primary/20 pl-3 py-1">
              <div className="text-text leading-tight mb-1">
                <span className="font-bold text-primary">
                  {act.userEmail === userEmail ? "You" : act.userEmail}
                </span>{" "}
                {act.action.toLowerCase()}d{" "}
                <span className="font-medium text-white">{act.noteTitle || "a note"}</span>
              </div>
              <div className="text-text-muted text-[11px]">
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
