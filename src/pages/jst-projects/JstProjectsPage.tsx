import { School } from "lucide-react";
import { useState } from "react";
import { useFindJstProjectsQuery } from "../../hooks/jst-projects/use-jst-projects";
import ProjectTabCard, { type IProject } from "./components/ProjectTabCard";
import { ProjectTabsSkeleton } from "./components/ProjectTabSkeleton";

export const JstProjectsPage = () => {
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  const { data: projects = [], isLoading } = useFindJstProjectsQuery({});

  return (
    <div className="flex w-full max-w-[1540px] mx-auto p-5 min-h-[calc(100vh-190px)]">
      <div className="w-full">
        <h1 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-1.5">
          <School className="w-6 h-6" /> Szkoły projektowe
        </h1>

        {/* Tabs */}

        <div className="flex flex-wrap gap-2 border-b mb-8">
          {isLoading ? (
            <ProjectTabsSkeleton tabsCount={4} />
          ) : (
            projects.map((project: IProject) => {
              const isActive = selectedDept === project._id;
              return (
                <ProjectTabCard
                  key={project._id}
                  onClick={() => setSelectedDept(project._id)}
                  name={project.name}
                  isActive={isActive}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
