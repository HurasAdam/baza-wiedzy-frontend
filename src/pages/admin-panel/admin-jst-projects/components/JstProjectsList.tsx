import { Loader } from "lucide-react";
import JstProjectCard, { type Project } from "./JstProjectCard";

interface JstProjectsListProps {
  jstprojects: Project[];
  onEditJstProject: (productId: string) => void;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

const JstProjectsList = ({ isLoading, isError, error, jstprojects, onEditJstProject }: JstProjectsListProps) => {
  return (
    <div className="bg-card border rounded-xl overflow-hidden">
      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader className="animate-spin w-6 h-6" />
        </div>
      )}

      {isError && (
        <p className="text-destructive text-center py-10">
          {(error as Error)?.message || "Błąd podczas ładowania projektów"}
        </p>
      )}

      {!isLoading && !isError && jstprojects.length === 0 && (
        <p className="text-center py-10">Nie znaleziono projektów</p>
      )}

      {!isLoading && !isError && jstprojects.length > 0 && (
        <ul className="divide-y divide-border">
          {jstprojects.map((project: Project) => (
            <JstProjectCard key={project._id} project={project} onEditJstProject={onEditJstProject} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default JstProjectsList;
