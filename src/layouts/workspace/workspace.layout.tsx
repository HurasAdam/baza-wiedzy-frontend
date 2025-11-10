import { FolderKanban, Settings, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { CreateWorkspaceFolderModal } from "../../components/workspace-folder/CreateWorkspaceFolderModal";
import { useFindWorkspaceFoldersQuery } from "../../hooks/workspace-folders/use-workspace-folder";
import { useFindUserWorkspacesQuery, useFindWorkspaceQuery } from "../../hooks/workspace/use-workspace";
import { WorkspaceSidebar } from "./components/WorkspaceSidebar";

export default function WorkspaceLayout() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { data: workspaces = [] } = useFindUserWorkspacesQuery();
  const { data: workspace } = useFindWorkspaceQuery(workspaceId);
  const { data: folders, isLoading: isFoldersLoading } = useFindWorkspaceFoldersQuery(workspaceId);
  const [isCreatingWorkspaceFolder, setIsCreatingWorkspaceFolder] = useState(false);

  useEffect(() => {
    if (!workspaceId && workspaces.length > 0) {
      navigate(`/workspace/${workspaces[0]._id}`, { replace: true });
    }
  }, [workspaceId, workspaces]);

  const links = [
    { to: `/workspaces/${workspaceId}/projects`, icon: FolderKanban, label: "Projekty" },
    { to: `/workspaces/${workspaceId}/members`, icon: Users, label: "Zespół" },
    { to: `/workspaces/${workspaceId}/settings`, icon: Settings, label: "Ustawienia" },
  ];

  const handleAddFolder = () => setIsCreatingWorkspaceFolder(true);
  const handleNewArticle = () => {
    if (workspaceId && folders?.[0]?._id) {
      navigate(`/workspace/${workspaceId}/folders/${folders[0]._id}/articles/new`);
    }
  };

  return (
    <div className="flex h-screen text-foreground bg-background">
      {/* Sidebar */}

      <WorkspaceSidebar
        workspaceId={workspaceId!}
        folders={folders}
        onAddFolder={handleAddFolder}
        onOpenNewArticle={handleNewArticle}
        isLoading={isFoldersLoading}
      />

      <div className="flex flex-col flex-1">
        <main className="flex-1 overflow-y-auto h-full w-full  scrollbar-custom">
          <div className="mx-auto container px-2 sm:px-6 lg:px-8 py-0 md:py-10 w-full h-full">
            <Outlet context={{ workspace, folders }} />
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
