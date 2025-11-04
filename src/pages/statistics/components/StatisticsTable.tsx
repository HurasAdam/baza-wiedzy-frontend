import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { UserStatsContext, type UserStatsContextEnum } from "../../../types/statistics";
import type { ModalVariant, SelectedUser } from "../StatisticsPage";
import ActionsCell from "./ActionsCell";
import type { UserData } from "./StatisticsSection";
import UserCell from "./UserCell";

interface StatisticsTableProps {
  title: string;
  icon: LucideIcon;
  data: UserData[] | [];
  context: UserStatsContextEnum;
  setUserStatisticsModal: (variant: ModalVariant, selectedUser: SelectedUser) => void;
  backendBase: string;
}

export const StatisticsTable = ({
  title,
  icon: Icon,
  data = [],
  context,
  setUserStatisticsModal,
  backendBase,
}: StatisticsTableProps) => {
  const openModal = (selectedUser: SelectedUser) => {
    let variant: ModalVariant;

    switch (context) {
      case UserStatsContext.ARTICLES_ADDED:
        variant = "ADDED_ARTICLES";
        break;

      case UserStatsContext.ARTICLES_EDITED:
        variant = "EDITED_ARTICLES";
        break;

      case UserStatsContext.CONVERSATION_TOPICS:
        variant = "ADDED_CONVERSATION_REPORTS";
        break;

      default:
        throw new Error(`Unsupported context: ${context}`);
    }

    setUserStatisticsModal(variant, selectedUser);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Użytkownik</th>
              <th className="text-left py-2">Wartość</th>
              <th className="text-center py-2">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {[...data]
              .sort((a, b) => b.stats[context] - a.stats[context])
              .map((u) => (
                <tr key={u.userId} className="border-b hover:bg-muted/50">
                  <td className="py-2">
                    <UserCell user={u} backendBase={backendBase} />
                  </td>
                  <td className="py-2">{u.stats[context]}</td>
                  <td className="py-2 text-center">
                    <ActionsCell selectedUser={u} context={context} count={u.stats[context]} onOpenModal={openModal} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};
