import { BookOpen, Plus } from "lucide-react";
import { Dropdown } from "../../../../components/Dropdown";
import { Button } from "../../../../components/ui/button";
import FaqsFilters from "./FaqsFilters";

interface FaqsHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  foundFaqsValue: number;
  navigate: (url: string) => void;
}

const FaqsHeader = ({ searchTerm, setSearchTerm, foundFaqsValue, navigate }: FaqsHeaderProps) => {
  const dropdownOptions = [
    {
      label: "Dodaj FAQ",
      icon: <Plus className="w-4 h-4" />,
      actionHandler: () => {
        navigate("/admin/manage-faqs/create");
      },
    },
  ];

  return (
    <div className="bg-background z-10 flex flex-col gap-4 mb-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-muted-foreground" /> Lista FAQ
        </h1>
        <Dropdown
          triggerBtn={
            <Button size="sm" variant="default" className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Dodaj
            </Button>
          }
          options={dropdownOptions}
          position={{ align: "end" }}
        />
      </div>

      <FaqsFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} foundFaqsValue={foundFaqsValue} />
    </div>
  );
};

export default FaqsHeader;
