import type { Project } from "../../admin-panel/admin-jst-projects/components/JstProjectCard";
import ProjectTabCard from "./jst-project/ProjectTabCard";
import { ProjectTabsSkeleton } from "./jst-project/ProjectTabSkeleton";

type JstProjectsTabsProps = {
  projects: Project[];
  selectedProjectId: string | null;
  isLoading: boolean;
  onSelectProject: (id: string) => void;
};

const JstProjectsTabs = ({ projects, selectedProjectId, isLoading, onSelectProject }: JstProjectsTabsProps) => {
  if (isLoading) return <ProjectTabsSkeleton tabsCount={5} />;

  return (
    <div className="flex flex-wrap gap-2 border-b mb-8">
      {projects.map((project) => (
        <ProjectTabCard
          key={project._id}
          onClick={() => onSelectProject(project._id)}
          name={project.name}
          isActive={selectedProjectId === project._id}
        />
      ))}
    </div>
  );
};

export default JstProjectsTabs;
