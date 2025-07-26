import {
  Box,
  Ellipsis,
  FileIcon,
  LandPlot,
  Loader,
  Plus,
  XCircleIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "@/components/ui/input";
import { Dropdown } from "@/components/Dropdown";
import { useFindJstProjectsQuery } from "@/hooks/jst-projects/use-jst-projects";
import { JstProjectModal } from "@/components/jst-project/jst-project-modal";

const triggerBtn = (
  <Button variant="default" className="flex items-center gap-1">
    Dodaj <Plus className="w-4 h-4" />
  </Button>
);

export const JstAdminProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreatingJstProject, setIsCreatingJstProject] =
    useState<boolean>(false);

  const params = useMemo(() => {
    const searchParams = new URLSearchParams();
    if (searchTerm) searchParams.append("name", searchTerm);
    return searchParams;
  }, [searchTerm]);

  const {
    data: jstprojects = [],
    isLoading,
    isError,
    error,
  } = useFindJstProjectsQuery();

  const onCreateJstProject = (): void => {
    setIsCreatingJstProject(true);
  };

  const dropdownOptions = [
    {
      label: "Dodaj projekt",
      icon: <Plus className="w-4 h-4" />,
      actionHandler: () => {
        onCreateJstProject();
      },
    },
  ];

  return (
    <div className="mx-auto pb-6">
      {/* Header */}
      <div className="bg-background z-10 flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <LandPlot className="w-6 h-6 text-muted-foreground" /> Projekty JST
          </h1>
          <Dropdown
            triggerBtn={triggerBtn}
            options={dropdownOptions}
            position={{ align: "end" }}
          />
        </div>

        {/* Filters */}
        <div className="flex bg-muted/40 rounded-lg px-3 py-2 gap-3 items-center flex-wrap">
          <Input
            placeholder="Szukaj projektu..."
            className="w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="outline" size="sm" onClick={() => setSearchTerm("")}>
            Resetuj
          </Button>
          <Badge variant="outline" className="ml-auto">
            Znaleziono: {jstprojects.length}
          </Badge>
        </div>
      </div>

      {/* Projects List */}
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
            {jstprojects.map((project) => (
              <li
                key={project._id}
                className="flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition group"
              >
                {/* Left */}
                <div className="flex items-center gap-3">
                  <LandPlot className="w-5 h-5 text-muted-foreground" />

                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {project.name}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      Szkoły: {project.schoolsCount ?? 0}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <Dropdown
                  withSeparators
                  triggerBtn={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition"
                    >
                      <Ellipsis className="w-4 h-4" />
                    </Button>
                  }
                  options={[
                    {
                      label: "Edytuj",
                      icon: <FileIcon className="w-4 h-4" />,
                      actionHandler: () => toast.info(`Edytuj ${project.name}`),
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
            ))}
          </ul>
        )}
      </div>

      <JstProjectModal
        isCreatingJstProject={isCreatingJstProject}
        setIsCreatingJstProject={setIsCreatingJstProject}
      />
    </div>
  );
};
