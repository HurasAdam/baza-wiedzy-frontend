import type { SetURLSearchParams } from "react-router-dom";
import StatusBar from "../../my-entries/components/StatusBar";
import type { StatusItem } from "./PendingArticlesList";

type PendingKey = "approved" | "pending" | "rejected" | "draft";

interface PendingArticlesHeaderProps {
  statuses: StatusItem[];

  currentStatus: PendingKey;
  setCurrentStatus: (key: PendingKey) => void;
  setSearchParams: SetURLSearchParams;
}

const PendingArticlesHeader = ({
  currentStatus,
  setCurrentStatus,
  setSearchParams,
  statuses,
}: PendingArticlesHeaderProps) => {
  const currentStatusObj = statuses.find((status) => status.key === currentStatus);

  return (
    <div>
      <StatusBar
        statuses={statuses}
        currentStatus={currentStatus}
        setCurrentStatus={(key) => {
          setCurrentStatus(key);
          setSearchParams((prev) => {
            prev.set("status", key);
            return prev;
          });
        }}
      />

      <div className="flex items-center justify-between mt-6 mb-4">
        <h1 className="text-xl font-semibold flex items-center gap-3">
          <div className="rounded-md bg-muted p-2">{currentStatusObj?.icon}</div>
          <span>{currentStatusObj?.label}</span>
        </h1>
      </div>
    </div>
  );
};

export default PendingArticlesHeader;
