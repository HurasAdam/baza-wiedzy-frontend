import { SendIssueReportModal } from "@/components/issue-report/send-issue-report-modal";
import { SettingsModal } from "@/components/settings/settings-modal";
import { CreateWorkspaceModal } from "@/components/workspace/CreateWorkspaceModal";
import { useQuery } from "@tanstack/react-query";
import { ClipboardPlus, FolderPlus, MailQuestionMark, ShieldUser, UserPlus } from "lucide-react";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ChangeLogModal } from "../../components/change-log/change-log-modal";
import { IssueReportsModal } from "../../components/issue-reports/issue-reports-modal";
import { NotificationsPanel } from "../../components/notifications-panel/notifications-panel";
import { Alert } from "../../components/shared/alert-modal";
import { WorkspaceInviteModal } from "../../components/workspace-invite/WorkspaceInviteModal";
import queryClient from "../../config/query.client";
import { useAuthQuery, useLogoutMutation } from "../../hooks/auth/use-auth";
import Header from "./components/Header";
import { LeftNavBar } from "./components/LeftNavbar";
import { Sidebar } from "./components/Sidebar";

const AppLayout = () => {
  const { data: onlineUsers = [] } = useQuery({
    queryKey: ["onlineUsers"],
  });

  const { data: authData, isLoading } = useAuthQuery();

  const { mutate: logoutMutate, isPending: isLogoutPending } = useLogoutMutation();

  const navigate = useNavigate();

  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isIssueReportsModalOpen, setIsIssueReportsModalOpen] = useState(false);
  const [isCreatingIssueReport, setIsCreatingIssueReport] = useState(false);
  const [isWorkspaceInviteModalOpen, setIsWorkspaceInviteModalOpen] = useState(false);
  const [isChangeLogModalOpen, setIsChangeLogModalOpen] = useState(false);
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState<boolean>(false);

  const onLogoutConfirm = () => {
    logoutMutate(undefined, {
      onSuccess: () => {
        queryClient.clear();
        navigate("/auth/login", { replace: true });
        toast.success("Zostałeś pomyślnie wylogowany", { position: "bottom-right" });
      },
      onError: () => toast.error("Wystąpił błąd. Spróbuj ponownie"),
    });
  };

  return (
    <div className="flex flex-col h-screen w-full ">
      {/* <Header
        onCreateWorkspace={() => setIsCreatingWorkspace(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenIssueReportsModal={() => setIsIssueReportsModalOpen(true)}
        onOpenCreateIssueReport={() => setIsCreatingIssueReport(true)}
        onOpenNotificationsPanel={() => {
          setIsNotificationsPanelOpen(true);
        }}
        onOpenWorkspaceInviteModal={() => setIsWorkspaceInviteModalOpen(true)}
      /> */}

      <main className="flex w-full flex-1 min-h-0">
        <div className="flex w-full flex-1 min-h-0    bg-sidebar">
          <LeftNavBar
            onOpenLogoutAlert={() => setIsLogoutOpen(true)}
            onOpenChangeLogModal={() => setIsChangeLogModalOpen(true)}
            onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
            items={[
              {
                title: "Dodaj artykuł",
                icon: ClipboardPlus,
                onClick: () => navigate("/articles/new"),
                requiredPermission: "ADD_ARTICLE",
              },
              {
                title: "Dodaj kolekcje",
                icon: FolderPlus,
                onClick: () => setIsCreatingWorkspace(true),
                requiredPermission: "ADD_COLLECTION",
              },
              {
                title: "Dołącz do kolekcji",
                icon: UserPlus,
                onClick: () => setIsWorkspaceInviteModalOpen(true),
                requiredPermission: "JOIN_COLLECTION",
              },
              {
                title: "Zgłoszenia i propozycje",
                icon: MailQuestionMark,
                onClick: () => navigate("/reports"),
                requiredPermission: "SEND_REPORT",
              },
              {
                title: "Panel admina",
                icon: ShieldUser,
                onClick: () => navigate("/admin"),
                requiredPermission: "ACCESS_ADMIN_PANEL",
              },
            ]}
          />

          <Sidebar
            onCreateWorkspace={() => setIsCreatingWorkspace(true)}
            onOpenChangeLogModal={() => setIsChangeLogModalOpen(true)}
            onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
            onOpenWorkspaceInviteModal={() => setIsWorkspaceInviteModalOpen(true)}
          />

          <div className="flex flex-col flex-1 rounded-l-2xl border border-border/80 bg-background">
            <Header
              onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
              onOpenIssueReportsModal={() => setIsIssueReportsModalOpen(true)}
              onOpenCreateIssueReport={() => setIsCreatingIssueReport(true)}
              onOpenNotificationsPanel={() => setIsNotificationsPanelOpen(true)}
              onOpenWorkspaceInviteModal={() => setIsWorkspaceInviteModalOpen(true)}
              onOpenChangeLogModal={() => setIsChangeLogModalOpen(true)}
              onOpenAdminPanel={() => navigate("/admin")}
              onOpenReportsPanel={() => navigate("/reports")}
            />
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-custom rounded-b-2xl py-6">
              <Outlet context={{ onOpenCreateIssueReport: () => setIsCreatingIssueReport(true), userData: authData }} />
            </div>
          </div>
        </div>
      </main>

      {/* flex-1 overflow-y-auto h-full w-full bg-background scrollbar-custom */}
      {isSettingsModalOpen && (
        <SettingsModal isSettingsModalOpen={isSettingsModalOpen} setIsSettingsModalOpen={setIsSettingsModalOpen} />
      )}
      {isNotificationsPanelOpen && (
        <NotificationsPanel
          isOpen={isNotificationsPanelOpen}
          onOpenChange={setIsNotificationsPanelOpen}
          onMarkAsRead={(id) => console.log("Oznaczono jako przeczytane:", id)}
        />
      )}
      {isIssueReportsModalOpen && (
        <IssueReportsModal
          isIssueReportsModalOpen={isIssueReportsModalOpen}
          setIsIssueReportsModalOpen={setIsIssueReportsModalOpen}
        />
      )}

      {isCreatingWorkspace && (
        <CreateWorkspaceModal
          isCreatingWorkspace={isCreatingWorkspace}
          setIsCreatingWorkspace={setIsCreatingWorkspace}
          onClose={() => setIsCreatingWorkspace(false)}
        />
      )}
      {isCreatingIssueReport && (
        <SendIssueReportModal
          isCreatingIssueReport={isCreatingIssueReport}
          setIsCreatingIssueReport={setIsCreatingIssueReport}
        />
      )}
      {isWorkspaceInviteModalOpen && (
        <WorkspaceInviteModal
          isOpen={isWorkspaceInviteModalOpen}
          setIsOpen={setIsWorkspaceInviteModalOpen}
          isLoading={false}
          onSave={() => {}}
        />
      )}
      {isChangeLogModalOpen && (
        <ChangeLogModal isChangeLogModalOpen={isChangeLogModalOpen} setIsChangeLogModalOpen={setIsChangeLogModalOpen} />
      )}

      {isLogoutOpen && (
        <Alert
          isOpen={isLogoutOpen}
          type="info"
          title="Wylogować się?"
          isLoading={isLogoutPending}
          onCancel={() => setIsLogoutOpen(false)}
          onConfirm={onLogoutConfirm}
        >
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">Czy na pewno chcesz się wylogować ?</p>
          </div>
        </Alert>
      )}
    </div>
  );
};

export default AppLayout;
