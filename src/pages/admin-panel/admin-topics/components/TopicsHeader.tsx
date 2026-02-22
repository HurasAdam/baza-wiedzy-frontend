import { ListChecks, Plus } from "lucide-react";
import { Dropdown } from "../../../../components/Dropdown";
import { Button } from "../../../../components/ui/button";
import type { Product } from "../../admin-products/components/ProductsList";
import TopicsFilters from "./TopicsFilters";

interface TopicsHeaderProps {
  products: Product[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  foundTopicsCount: number;
  onCreateTopic: () => void;
  onResetAllFilters: () => void;
  productFilter: string;
  setProductFilter: (value: string) => void;
}

const TopicsHeader = ({
  searchTerm,
  setSearchTerm,
  setProductFilter,
  productFilter,
  products,
  foundTopicsCount,
  onResetAllFilters,
  onCreateTopic,
}: TopicsHeaderProps) => {
  const triggerBtn = (
    <Button size="sm" variant="default" className="flex items-center gap-2">
      <Plus className="w-4 h-4" /> Dodaj
    </Button>
  );

  const dropdownOptions = [
    {
      label: "Dodaj temat",
      icon: <Plus className="w-4 h-4" />,
      actionHandler: () => onCreateTopic(),
    },
  ];

  return (
    <div className="bg-background z-10 flex flex-col gap-4 mb-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <ListChecks className="w-6 h-6 text-muted-foreground" /> Tematy rozmów i wiadomości
        </h1>
        <Dropdown triggerBtn={triggerBtn} options={dropdownOptions} position={{ align: "end" }} />
      </div>

      {/* Filters */}

      <TopicsFilters
        products={products}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        productFilter={productFilter}
        setProductFilter={setProductFilter}
        onResetAllFilters={onResetAllFilters}
        foundTopicsCount={foundTopicsCount}
      />
    </div>
  );
};

export default TopicsHeader;
