import type { JSX } from "react";
import { Button } from "../../../components/ui/button";
import { cn } from "../../../lib/utils";
import type { StatusKey } from "../MyEntriesPage";

interface StatusBarProps {
  currentStatus: StatusKey;
  setCurrentStatus: (key: StatusKey) => void;
  statuses: { key: StatusKey; label: string; icon: JSX.Element }[]; // <-- tu zmiana
}

const StatusBar = ({ statuses, currentStatus, setCurrentStatus }: StatusBarProps) => {
  return (
    <div className="flex gap-2 mb-6 border-b border-border pb-2">
      {statuses.map(({ key, label, icon }) => {
        const isActive = currentStatus === key;
        return (
          <Button
            key={key}
            onClick={() => setCurrentStatus(key)}
            className={cn(
              "flex items-center px-4 py-2 text-sm font-medium transition-colors rounded-md border",
              isActive
                ? "bg-primary border text-foreground shadow-sm "
                : "bg-card border-border text-muted-foreground hover:bg-muted/80"
            )}
          >
            {icon}
            {label}
          </Button>
        );
      })}
    </div>
  );
};

export default StatusBar;
