import { Hash, Plus } from "lucide-react";
import { Dropdown } from "../../../../components/Dropdown";
import { Button } from "../../../../components/ui/button";
import TagsFilters from "./TagsFilters";

interface TagsHeaderProps {
  onCreateTag: () => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  foundTagsCount: number;
}

const TagsHeader = ({ onCreateTag, searchTerm, setSearchTerm, foundTagsCount }: TagsHeaderProps) => {
  const triggerBtn = (
    <Button variant="default" className="flex items-center gap-1">
      Dodaj <Plus className="w-4 h-4" />
    </Button>
  );

  const dropdownOptions = [
    {
      label: "Dodaj tag",
      icon: <Plus className="w-4 h-4" />,
      actionHandler: () => {
        onCreateTag();
      },
    },
  ];

  return (
    <div className="bg-background z-10 flex flex-col gap-4 mb-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <Hash className="w-6 h-6 text-muted-foreground" /> Tagi
        </h1>
        <Dropdown triggerBtn={triggerBtn} options={dropdownOptions} position={{ align: "end" }} />
      </div>

      <TagsFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} foundTagsCount={foundTagsCount} />
    </div>
  );
};

export default TagsHeader;
