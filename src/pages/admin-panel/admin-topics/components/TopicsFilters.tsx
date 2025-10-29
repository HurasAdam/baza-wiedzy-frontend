import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import type { Product } from "../../admin-products/components/ProductsList";

interface TopicsFiltersProps {
  products: Product[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  foundTopicsCount: number;

  onResetAllFilters: () => void;
  productFilter: string;
  setProductFilter: (value: string) => void;
}

const TopicsFilters = ({
  searchTerm,
  setSearchTerm,
  setProductFilter,
  productFilter,
  products,
  foundTopicsCount,
  onResetAllFilters,
}: TopicsFiltersProps) => {
  return (
    <div className="flex px-3 py-2 gap-3 items-center flex-wrap">
      <Input
        placeholder="Wyszukaj temat..."
        className="w-64 border-ring"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Select
        value={productFilter === "" ? "all" : productFilter}
        onValueChange={(value) => setProductFilter(value === "all" ? "" : (value as string))}
      >
        <SelectTrigger className="w-40 border-ring">
          <SelectValue placeholder="Produkt" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Wszystkie</SelectItem>
          {products.map(({ _id, name }) => (
            <SelectItem key={_id} value={_id}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" size="sm" onClick={onResetAllFilters}>
        Resetuj
      </Button>
      <Badge variant="outline" className="ml-auto">
        Znaleziono: {foundTopicsCount}
      </Badge>
    </div>
  );
};

export default TopicsFilters;
