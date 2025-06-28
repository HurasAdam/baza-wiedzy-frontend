import { ChevronsUp, Filter, Mail, MapPin, School } from "lucide-react";
import { useEffect, useState } from "react";
import EmptyState from "../../components/shared/EmptyState";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useFindJstProjectsQuery } from "../../hooks/jst-projects/use-jst-projects";
import { useFindJstSchoolsQuery } from "../../hooks/jst-schools/use-jst-schools";
import type { IJstProject, IJstSchool } from "../../types";
import ProjectTabCard from "./components/jst-project/ProjectTabCard";
import { ProjectTabsSkeleton } from "./components/jst-project/ProjectTabSkeleton";
import SchoolCard from "./components/jst-school/SchoolCard";
import SchoolSkeletonCards from "./components/jst-school/SchoolSkeletonCards";

type FilterField = "name" | "adres" | "email";

const placeholderMap: Record<FilterField, string> = {
  name: "Wyszukaj po nazwie szkoły…",
  adres: "Wyszukaj po adresie…",
  email: "Wyszukaj po e-mailu…",
};

export const JstProjectsPage = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [filterField, setFilterField] = useState<FilterField>("name");
  const [filterQuery, setFilterQuery] = useState("");

  const { data: projects = [], isLoading } = useFindJstProjectsQuery();
  const { data: schools = [], isLoading: isSchoolsLoading } =
    useFindJstSchoolsQuery(selectedProjectId, { [filterField]: filterQuery });

  useEffect(() => {
    if (projects.length && !selectedProjectId) {
      setSelectedProjectId(projects[0]._id);
    }
  }, [projects, selectedProjectId]);

  console.log("SCHOOLS", schools);

  const filterOptions: {
    value: FilterField;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: "name",
      label: "Nazwa",
      icon: <ChevronsUp className="w-4 h-4 mr-2" />,
    },
    {
      value: "adres",
      label: "Adres",
      icon: <MapPin className="w-4 h-4 mr-2" />,
    },
    {
      value: "email",
      label: "E-mail",
      icon: <Mail className="w-4 h-4 mr-2" />,
    },
  ];

  return (
    <div className="flex w-full ">
      <div className="w-full">
        <h1 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-1.5">
          <School className="w-6 h-6" /> Szkoły projektowe
        </h1>

        {/* Tabs */}

        <div className="flex flex-wrap gap-2 border-b mb-8">
          {isLoading ? (
            <ProjectTabsSkeleton tabsCount={4} />
          ) : (
            projects.map((project: IJstProject) => {
              const isActive = selectedProjectId === project._id;
              return (
                <ProjectTabCard
                  key={project._id}
                  onClick={() => setSelectedProjectId(project._id)}
                  name={project.name}
                  isActive={isActive}
                />
              );
            })
          )}
        </div>

        {/* ---- Filter bar ------ */}

        {/* Enterprise-style filter panel */}
        <div className="mb-8 p-4 bg-muted/50 border border-border rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium min-w-[100px]">
              <Filter className="w-4 h-4" />
              Wyszukaj szkołę
            </div>
            <Select value={filterField} onValueChange={setFilterField}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Kryterium" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                {filterOptions.map(({ value, label, icon }) => (
                  <SelectItem key={value} value={value} className="bg-card">
                    <div className="flex items-center py-0.5 text-foreground ">
                      {icon}
                      {label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              className="flex-1 outline-none ring-0 focus:ring-0"
              placeholder={placeholderMap[filterField]}
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
            />
            <Button
              variant={
                filterQuery || filterField !== "name" ? "default" : "outline"
              }
              disabled={!filterQuery && filterField === "name"}
              onClick={() => {
                setFilterField("name");
                setFilterQuery("");
              }}
              className="ml-2 text-secondary-foreground"
            >
              Resetuj
            </Button>
          </div>
        </div>

        {/* ----- Schools -------- */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isSchoolsLoading ? (
            <SchoolSkeletonCards itemsCount={6} />
          ) : (
            schools?.map((school: IJstSchool) => <SchoolCard school={school} />)
          )}

          {!isSchoolsLoading && !schools?.length && (
            <EmptyState
              // onReset={() => navigate("/admin/projects")}
              resetLabel="Dodaj szkołę"
              title="Brak szkół do wyświetlenia"
              description="Wygląda na to że dla wybranego projektu nie dodano jeszcze żadnych szkół"
            />
          )}
        </div>
      </div>
    </div>
  );
};
