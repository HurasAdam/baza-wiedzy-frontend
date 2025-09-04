import { SendIssueReportModal } from "@/components/issue-report/send-issue-report-modal";
import { SettingsModal } from "@/components/settings/settings-modal";
import { CreateWorkspaceModal } from "@/components/workspace/CreateWorkspaceModal";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ChangeLogModal } from "../../components/change-log/change-log-modal";
import Header from "./components/Header";
import { Sidebar } from "./components/Sidebar";

const AppLayout = () => {
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCreatingIssueReport, setIsCreatingIssueReport] = useState(false);
  const [isChangeLogModalOpen, setIsChangeLogModalOpen] = useState(false);

  return (
    <div className="flex h-screen w-full">
      <Sidebar onOpenChangeLogModal={() => setIsChangeLogModalOpen(true)} />

      <div className="flex flex-1 flex-col h-full">
        <Header
          onCreateWorkspace={() => setIsCreatingWorkspace(true)}
          onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
          onOpenCreateIssueReport={() => setIsCreatingIssueReport(true)}
        />

        <main className="flex-1 overflow-y-auto h-full w-full bg-background scrollbar-custom">
          <div className="mx-auto container px-2 sm:px-6 lg:px-6 py-0 md:py-8 w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>

      <SettingsModal isSettingsModalOpen={isSettingsModalOpen} setIsSettingsModalOpen={setIsSettingsModalOpen} />

      <CreateWorkspaceModal isCreatingWorkspace={isCreatingWorkspace} setIsCreatingWorkspace={setIsCreatingWorkspace} />
      <SendIssueReportModal
        isCreatingIssueReport={isCreatingIssueReport}
        setIsCreatingIssueReport={setIsCreatingIssueReport}
      />
      <ChangeLogModal isChangeLogModalOpen={isChangeLogModalOpen} setIsChangeLogModalOpen={setIsChangeLogModalOpen} />
    </div>
  );
};

export default AppLayout;
