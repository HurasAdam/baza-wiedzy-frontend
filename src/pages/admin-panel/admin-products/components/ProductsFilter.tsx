import { Loader } from "lucide-react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";

interface ProductsFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  foundProductsValue: number;
  isLoading: boolean;
}

const ProductsFilter = ({ searchTerm, setSearchTerm, foundProductsValue, isLoading }: ProductsFilterProps) => {
  return (
    <div className="flex px-3 py-2 gap-3 items-center flex-wrap">
      <Input
        placeholder="Szukaj produktu..."
        className="w-64 border-ring"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button variant="outline" size="sm" onClick={() => setSearchTerm("")}>
        Resetuj
      </Button>
      <Badge variant="outline" className="ml-auto">
        Znaleziono: {isLoading ? <Loader className="animate-spin w-4 h-4" /> : foundProductsValue}
      </Badge>
    </div>
  );
};

export default ProductsFilter;
