import { LandPlot, Plus } from "lucide-react";
import { Dropdown } from "../../../../components/Dropdown";
import { Button } from "../../../../components/ui/button";
import JstProjectsFilters from "./JstProjectsFilters";

interface JstProjectsHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  jstProjectsCount: number;
  onCreateJstProject: () => void;
}

const JstProjectsHeader = ({
  searchTerm,
  setSearchTerm,
  onCreateJstProject,
  jstProjectsCount,
}: JstProjectsHeaderProps) => {
  const triggerBtn = (
    <Button variant="default" className="flex items-center gap-1">
      Dodaj <Plus className="w-4 h-4" />
    </Button>
  );

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
    <div className="bg-background z-10 flex flex-col gap-4 mb-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <LandPlot className="w-6 h-6 text-muted-foreground" /> Projekty JST
        </h1>
        <Dropdown triggerBtn={triggerBtn} options={dropdownOptions} position={{ align: "end" }} />
      </div>

      <JstProjectsFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} jstProjectsCount={jstProjectsCount} />
    </div>
  );
};

export default JstProjectsHeader;
