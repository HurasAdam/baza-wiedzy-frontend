import { useState } from "react";
import { UserStatisticsAddedArticlesModal } from "../../components/user-statistics-added-articles-details/user-statistics-added-articles.modal";
import { UserStatisticsAddedConversationReportsModal } from "../../components/user-statistics-added-coversation-reports-details/user-statistics-added-conersation-reports.modal";
import { UserStatisticsEditedArticlesModal } from "../../components/user-statistics-edited-articles-details/user-statistics-edited-articles.modal";
import { useAuthQuery } from "../../hooks/auth/use-auth";
import { useExportUsersStatistics, useFindAllUsersStatistics } from "../../hooks/user-statistics/user-user-statistics";
import StatisticsHeader from "./components/StatisticsHeader";
import StatisticsSection from "./components/StatisticsSection";

export interface SelectedUser {
  userId: string;
  email: string;
  name: string;
  surname: string;
  role?: string;
  stats: {
    articlesAdded: number;
    articlesEdited: number;
    conversationTopics: number;
  };
}

export type ModalVariant = "ADDED_ARTICLES" | "EDITED_ARTICLES" | "ADDED_CONVERSATION_REPORTS" | "";

export const StatisticsPage = () => {
  const { data: user } = useAuthQuery();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [userStatisticsModal, setUserStatisticsModal] = useState<{
    variant: ModalVariant;
    isOpen: boolean;
    selectedUser: SelectedUser | null;
  }>({
    variant: "",
    isOpen: false,
    selectedUser: null,
  });

  const canViewStatsDetails = user?.role?.permissions?.includes("VIEW_USER_STATS_DETAILS");

  const backendBase = import.meta.env.VITE_BACKEND_BASE_URL ?? "http://localhost:5000";
  const hasFilters = startDate && endDate;
  const params = hasFilters ? { startDate, endDate } : undefined;
  const { data = [], isLoading } = useFindAllUsersStatistics(params);
  const { mutate: downloadStatisticsMutate, isPending } = useExportUsersStatistics();

  const openUserStatisticsModal = (variant: ModalVariant, selectedUser: SelectedUser) => {
    if (!variant) return;
    setUserStatisticsModal({
      variant,
      isOpen: true,
      selectedUser,
    });
  };

  return (
    <div className="space-y-6 pb-10 max-w-[1400px] mx-auto py-4 ">
      <StatisticsHeader
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        onExport={() => downloadStatisticsMutate(startDate && endDate ? { startDate, endDate } : {})}
        isExportLoading={isPending}
      />

      <StatisticsSection
        isLoading={isLoading}
        data={data}
        backendBase={backendBase}
        setUserStatisticsModal={openUserStatisticsModal}
        canViewStatsDetails={canViewStatsDetails}
      />

      {userStatisticsModal.isOpen &&
        userStatisticsModal.selectedUser &&
        userStatisticsModal.variant === "ADDED_ARTICLES" && (
          <UserStatisticsAddedArticlesModal
            isUserStatisticsModalOpen={userStatisticsModal.isOpen && userStatisticsModal.variant === "ADDED_ARTICLES"}
            selectedUser={userStatisticsModal.selectedUser}
            setIsUserStatisticsModalOpen={(isOpen) => setUserStatisticsModal((prev) => ({ ...prev, isOpen }))}
            startDate={startDate}
            endDate={endDate}
          />
        )}

      {userStatisticsModal.isOpen &&
        userStatisticsModal.selectedUser &&
        userStatisticsModal.variant === "EDITED_ARTICLES" && (
          <UserStatisticsEditedArticlesModal
            isUserStatisticsModalOpen={userStatisticsModal.isOpen && userStatisticsModal.variant === "EDITED_ARTICLES"}
            selectedUser={userStatisticsModal.selectedUser}
            setIsUserStatisticsModalOpen={(isOpen) => setUserStatisticsModal((prev) => ({ ...prev, isOpen }))}
            startDate={startDate}
            endDate={endDate}
          />
        )}
      {userStatisticsModal.isOpen &&
        userStatisticsModal.selectedUser &&
        userStatisticsModal.variant === "ADDED_CONVERSATION_REPORTS" && (
          <UserStatisticsAddedConversationReportsModal
            isUserStatisticsModalOpen={
              userStatisticsModal.isOpen && userStatisticsModal.variant === "ADDED_CONVERSATION_REPORTS"
            }
            selectedUser={userStatisticsModal.selectedUser}
            setIsUserStatisticsModalOpen={(isOpen) => setUserStatisticsModal((prev) => ({ ...prev, isOpen }))}
            startDate={startDate}
            endDate={endDate}
          />
        )}
    </div>
  );
};
