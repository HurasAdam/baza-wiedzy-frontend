import { Plus, School } from "lucide-react";
import { Dropdown } from "../../../components/Dropdown";
import { Button } from "../../../components/ui/button";

interface JstProjectsHeaderProps {
  onCreateJstProject: () => void;
  onCreateJstSchool: () => void;
  userPermissions: string[];
}

const JstProjectsHeader = ({ onCreateJstProject, onCreateJstSchool, userPermissions }: JstProjectsHeaderProps) => {
  const dropdownOptions = [
    ...(userPermissions.includes("ADD_JST_PROJECT")
      ? [{ label: "Dodaj projekt", icon: <Plus className="w-4 h-4" />, actionHandler: onCreateJstProject }]
      : []),

    ...(userPermissions.includes("ADD_JST_SCHOOL")
      ? [{ label: "Dodaj szkołę", icon: <Plus className="w-4 h-4" />, actionHandler: onCreateJstSchool }]
      : []),
  ];

  const hasDropdownOptions = dropdownOptions.length > 0;

  const triggerBtn = (
    <Button variant="default" size="sm" className="flex items-center gap-2 cursor-pointer">
      <Plus className="w-4 h-4" /> Dodaj
    </Button>
  );

  return (
    <div className="flex justify-between mb-10">
      <h1 className="text-2xl font-semibold text-foreground flex items-center justify-center gap-1.5">
        <School className="w-6 h-6" /> Szkoły <span className="text-muted-foreground text-sm">(JST)</span>
      </h1>
      {hasDropdownOptions && <Dropdown triggerBtn={triggerBtn} options={dropdownOptions} position={{ align: "end" }} />}
    </div>
  );
};

export default JstProjectsHeader;
