import { SendIssueReportModal } from "@/components/issue-report/send-issue-report-modal";
import { SettingsModal } from "@/components/settings/settings-modal";
import { CreateWorkspaceModal } from "@/components/workspace/CreateWorkspaceModal";
import { useQuery } from "@tanstack/react-query";
import { BellIcon, BookPlus, Bug, FolderPlus, Settings } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ChangeLogModal } from "../../components/change-log/change-log-modal";
import { IssueReportsModal } from "../../components/issue-reports/issue-reports-modal";
import { NotificationsPanel } from "../../components/notifications-panel/notifications-panel";
import { WorkspaceInviteModal } from "../../components/workspace-invite/WorkspaceInviteModal";
import Header from "./components/Header";
import { LeftNavBar } from "./components/LeftNavbar";
import { Sidebar } from "./components/Sidebar";

const AppLayout = () => {
  const { data: onlineUsers = [] } = useQuery({
    queryKey: ["onlineUsers"],
  });

  console.log(onlineUsers, "SOCKET");
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isIssueReportsModalOpen, setIsIssueReportsModalOpen] = useState(false);
  const [isCreatingIssueReport, setIsCreatingIssueReport] = useState(false);
  const [isWorkspaceInviteModalOpen, setIsWorkspaceInviteModalOpen] = useState(false);
  const [isChangeLogModalOpen, setIsChangeLogModalOpen] = useState(false);
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);

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

      <main className="flex w-full flex-1 min-h-0   bg-background">
        <div className="flex w-full flex-1 min-h-0 bg-gradient-to-br from-muted/60 to-card/60">
          <LeftNavBar
            items={[
              { title: "A", href: "/articles/new", icon: BellIcon },
              { title: "A", href: "/articles/new", icon: BookPlus },

              { title: "B", href: "/b", icon: FolderPlus },
              { title: "C", href: "/c", icon: Bug },
              { title: "B", href: "/b", icon: Settings },
            ]}
          />

          <Sidebar
            onCreateWorkspace={() => setIsCreatingWorkspace(true)}
            onOpenChangeLogModal={() => setIsChangeLogModalOpen(true)}
            onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
          />

          <div className="flex flex-col flex-1 rounded-2xl bg-sidebar shadow-xl my-1.5 border border-border/80">
            <Header
              onCreateWorkspace={() => setIsCreatingWorkspace(true)}
              onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
              onOpenIssueReportsModal={() => setIsIssueReportsModalOpen(true)}
              onOpenCreateIssueReport={() => setIsCreatingIssueReport(true)}
              onOpenNotificationsPanel={() => {
                setIsNotificationsPanelOpen(true);
              }}
              onOpenWorkspaceInviteModal={() => setIsWorkspaceInviteModalOpen(true)}
            />
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-custom  ">
              <div className="min-h-screen   shadow-xl  ">
                <div className="">
                  <Outlet context={{ onOpenCreateIssueReport: () => setIsCreatingIssueReport(true) }} />
                </div>
              </div>
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
    </div>
  );
};

export default AppLayout;
