import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import type { Product } from "../../articles/components/ArticlesList";

interface TopicRegisterFiltersProps {
  title: string;
  product: string;
  foundTopicsCount: number;
  products: (Product & { articlesCount: number })[];
  hasFilters: boolean;
  titleHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  productHandler: (value: string) => void;
  onResetAllFilters: () => void;
}

const TopicRegisterFilters = ({
  title,
  product,
  foundTopicsCount,
  products,
  hasFilters,
  titleHandler,
  productHandler,
  onResetAllFilters,
}: TopicRegisterFiltersProps) => {
  return (
    <div className="bg-background z-10 flex flex-col gap-4 mb-4">
      {/* Filters */}
      <div className="flex border-b  px-3 py-2 gap-3 items-center flex-wrap">
        <Input
          placeholder="Wyszukaj temat..."
          className="w-64 border-ring"
          value={title}
          onChange={(e) => titleHandler(e)}
        />
        <Select
          value={product === "" ? "all" : product}
          onValueChange={(value) => productHandler(value === "all" ? "" : value)}
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
        <Button
          onClick={onResetAllFilters}
          disabled={!hasFilters}
          variant={hasFilters ? "default" : "outline"}
          size="sm"
        >
          Wyczyść
        </Button>
        <Badge variant="outline" className="ml-auto">
          Znaleziono: {foundTopicsCount}
        </Badge>
      </div>
    </div>
  );
};

export default TopicRegisterFilters;
