import { EditJstProjectModal } from "@/components/jst-project/edit-jst-project-modal";
import { JstProjectModal } from "@/components/jst-project/jst-project-modal";
import { useFindJstProjectsQuery } from "@/hooks/jst-projects/use-jst-projects";
import { useMemo, useState } from "react";
import JstProjectsHeader from "./components/JstProjectsHeader";
import JstProjectsList from "./components/JstProjectsList";

export const JstAdminProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreatingJstProject, setIsCreatingJstProject] = useState<boolean>(false);
  const [isEditingJstProject, setIsEditingJstProject] = useState(false);
  const [editingJstProjectId, setEditingJstProjectId] = useState<string | null>(null);

  const params = useMemo(() => {
    const searchParams = new URLSearchParams();
    if (searchTerm) searchParams.append("name", searchTerm);
    return searchParams;
  }, [searchTerm]);

  const { data: jstprojects = [], isLoading, isError, error } = useFindJstProjectsQuery(params);

  const onCreateJstProject = (): void => {
    setIsCreatingJstProject(true);
  };

  const onEditJstProject = (productId: string): void => {
    setEditingJstProjectId(productId);
    setIsEditingJstProject(true);
  };

  return (
    <div className="mx-auto pb-6">
      <JstProjectsHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onCreateJstProject={onCreateJstProject}
        jstProjectsCount={jstprojects.length}
      />

      <JstProjectsList
        jstprojects={jstprojects}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onEditJstProject={onEditJstProject}
      />
      <JstProjectModal isCreatingJstProject={isCreatingJstProject} setIsCreatingJstProject={setIsCreatingJstProject} />
      {editingJstProjectId && (
        <EditJstProjectModal
          projectId={editingJstProjectId}
          isEditingJstProject={isEditingJstProject}
          setIsEditingJstProject={setIsEditingJstProject}
        />
      )}
    </div>
  );
};
