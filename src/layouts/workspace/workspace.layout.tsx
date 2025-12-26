import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";

import { CreateWorkspaceFolderModal } from "../../components/workspace-folder/CreateWorkspaceFolderModal";
import { useFindWorkspaceFoldersQuery } from "../../hooks/workspace-folders/use-workspace-folder";
import { useFindCurrentWorkspaceMemberQuery } from "../../hooks/workspace-members/use-workspace-member";
import { useFindUserWorkspacesQuery, useFindWorkspaceQuery } from "../../hooks/workspace/use-workspace";
import { WorkspaceAccessDenied } from "../../pages/workspace-denied-page/WorkspaceAccessDeniedPage";
import { WorkspaceSidebar } from "./components/WorkspaceSidebar";

export default function WorkspaceLayout() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { data: currentWorkspaceMember } = useFindCurrentWorkspaceMemberQuery(workspaceId!);
  const { data: workspaces = [], isLoading: isWorkspacesLoading } = useFindUserWorkspacesQuery();
  const { data: workspace, isLoading: isWorkspaceLoading, error } = useFindWorkspaceQuery(workspaceId);
  const { data: folders, isLoading: isFoldersLoading } = useFindWorkspaceFoldersQuery(workspaceId);
  const [isCreatingWorkspaceFolder, setIsCreatingWorkspaceFolder] = useState(false);

  useEffect(() => {
    if (!workspaceId && workspaces.length > 0) {
      navigate(`/workspace/${workspaces[0]._id}`, { replace: true });
    }
  }, [workspaceId, workspaces]);

  const handleAddFolder = () => setIsCreatingWorkspaceFolder(true);
  const handleNewArticle = () => {
    navigate(`/workspace/${workspaceId}/new-article`);
  };

  const isLoading = isWorkspacesLoading || isWorkspaceLoading || isFoldersLoading;

  if (isLoading) {
    return <WorkspaceLoader message="Trwa ładowanie kolekcji" />;
  }

  if (error) {
    return <WorkspaceAccessDenied message="Nie masz dostępu do tej kolekcji" />;
  }

  return (
    <div className="flex h-screen text-foreground bg-background">
      {/* Sidebar */}

      <WorkspaceSidebar
        workspaceId={workspaceId!}
        workspace={workspace}
        workspaces={workspaces}
        folders={folders}
        onAddFolder={handleAddFolder}
        onOpenNewArticle={handleNewArticle}
        isLoading={isFoldersLoading}
        permissions={currentWorkspaceMember?.permissions}
      />

      <div className="flex flex-col flex-1">
        <main className="flex-1 overflow-y-auto h-full w-full  scrollbar-custom">
          <div className="mx-auto container px-2 sm:px-6 lg:px-8 py-0 md:py-10 w-full h-full">
            <Outlet
              context={{ workspace, folders, handleAddFolder, permissions: currentWorkspaceMember?.permissions }}
            />
          </div>
        </main>
      </div>
      <CreateWorkspaceFolderModal
        isCreatingWorkspaceFolder={isCreatingWorkspaceFolder}
        setIsCreatingWorkspaceFolder={setIsCreatingWorkspaceFolder}
        workspaceId={workspace?._id}
      />
    </div>
  );
}

export function WorkspaceLoader({ message = "Trwa ładowanie..." }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen  text-primary/70">
      <Loader2 className="w-20 h-20 animate-spin text-primary mb-6" />
      <p className="text-xl font-medium">{message}</p>
      <p className="text-sm text-muted-foreground mt-2">To może chwilę potrwać…</p>
    </div>
  );
}
