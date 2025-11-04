import { BookOpen, ClipboardList, Edit3, Loader } from "lucide-react";
import { NoDataFound } from "../../../components/shared/NoDataFound";
import { UserStatsContext } from "../../../types/statistics";
import type { ModalVariant, SelectedUser } from "../StatisticsPage";
import { StatisticsTable } from "./StatisticsTable";

export interface UserStats {
  articlesAdded: number;
  articlesEdited: number;
  conversationTopics: number;
}

export interface UserData {
  userId: string;
  name: string;
  surname: string;
  email: string;
  role: string;
  stats: UserStats;
}

interface StatisticsSectionProps {
  isLoading: boolean;
  data: UserData[] | [];
  backendBase: "string";

  setUserStatisticsModal: (variant: ModalVariant, selectedUser: SelectedUser) => void;
}

const StatisticsSection = ({ isLoading, data = [], backendBase, setUserStatisticsModal }: StatisticsSectionProps) => {
  if (isLoading)
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-7 h-7 animate-spin" />
      </div>
    );

  if (!data?.length)
    return (
      <NoDataFound
        title="No data"
        description="Pick a start and end date to view statistics"
        buttonText="Pick Date"
        buttonAction={() => {}}
      />
    );

  return (
    <div className="space-y-6">
      <StatisticsTable
        title="Dodane artykuły"
        icon={BookOpen}
        data={data}
        context={UserStatsContext.ARTICLES_ADDED}
        setUserStatisticsModal={setUserStatisticsModal}
        backendBase={backendBase}
      />

      <StatisticsTable
        title="Edytowane artykuły"
        icon={Edit3}
        data={data}
        context={UserStatsContext.ARTICLES_EDITED}
        setUserStatisticsModal={setUserStatisticsModal}
        backendBase={backendBase}
      />

      <StatisticsTable
        title="Zgłoszone rozmowy"
        icon={ClipboardList}
        data={data}
        context={UserStatsContext.CONVERSATION_TOPICS}
        setUserStatisticsModal={setUserStatisticsModal}
        backendBase={backendBase}
      />
    </div>
  );
};

export default StatisticsSection;
