import { Ellipsis, FileIcon, LandPlot, XCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { Dropdown } from "../../../../components/Dropdown";
import { Button } from "../../../../components/ui/button";

export interface Project {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  schoolsCount: number;
}

interface JstProjectCardProps {
  project: Project;
  onEditJstProject: (productId: string) => void;
}

const JstProjectCard = ({ project, onEditJstProject }: JstProjectCardProps) => {
  return (
    <li key={project._id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition group">
      <div className="flex items-center gap-3">
        <LandPlot className="w-5 h-5 text-muted-foreground" />

        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">{project.name}</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            Szkoły: {project.schoolsCount ?? 0}
          </span>
        </div>
      </div>

      <Dropdown
        withSeparators
        triggerBtn={
          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition">
            <Ellipsis className="w-4 h-4" />
          </Button>
        }
        options={[
          {
            label: "Edytuj",
            icon: <FileIcon className="w-4 h-4" />,
            actionHandler: () => onEditJstProject(project._id),
          },
          {
            label: "Usuń",
            icon: <XCircleIcon className="w-4 h-4 text-red-500" />,
            actionHandler: () => toast.error(`Usuń ${project.name}`),
          },
        ]}
        position={{ align: "end" }}
      />
    </li>
  );
};

export default JstProjectCard;
