import { MoreHorizontal } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover";
import type { UserStatsContextEnum } from "../../../types/statistics";
import type { SelectedUser } from "../StatisticsPage";

interface ActionsCellProps {
  selectedUser: SelectedUser;
  context: UserStatsContextEnum;
  count?: number;
  onOpenModal: (selectedUser: SelectedUser, context: string) => void;
  canViewStatsDetails?: boolean;
}

const ActionsCell = ({ selectedUser, context, count = 0, onOpenModal, canViewStatsDetails }: ActionsCellProps) => {
  if (!canViewStatsDetails || count === 0) {
    return (
      <Button variant="ghost" disabled>
        <MoreHorizontal className="h-4 w-4 opacity-40" />
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-2 space-y-1">
        <Button onClick={() => onOpenModal(selectedUser, context)} variant="ghost" className="w-full justify-start">
          Szczegóły
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default ActionsCell;
