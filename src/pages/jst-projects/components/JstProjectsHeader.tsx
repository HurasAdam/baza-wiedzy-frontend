import { Plus, School } from "lucide-react";
import { Dropdown } from "../../../components/Dropdown";
import { Button } from "../../../components/ui/button";

interface JstProjectsHeaderProps {
  onCreateJstProject: () => void;
  onCreateJstSchool: () => void;
}

const JstProjectsHeader = ({ onCreateJstProject, onCreateJstSchool }: JstProjectsHeaderProps) => {
  const dropdownOptions = [
    { label: "Dodaj projekt", icon: <Plus className="w-4 h-4" />, actionHandler: onCreateJstProject },
    { label: "Dodaj szkołę", icon: <Plus className="w-4 h-4" />, actionHandler: onCreateJstSchool },
  ];

  const triggerBtn = (
    <Button variant="default" className="flex items-center gap-1 cursor-pointer">
      Dodaj <Plus className="w-4 h-4" />
    </Button>
  );

  return (
    <div className="flex justify-between mb-6">
      <h1 className="text-xl font-semibold text-foreground flex items-center gap-1.5">
        <School className="w-6 h-6" /> Szkoły projektowe
      </h1>
      <Dropdown triggerBtn={triggerBtn} options={dropdownOptions} position={{ align: "end" }} />
    </div>
  );
};

export default JstProjectsHeader;
