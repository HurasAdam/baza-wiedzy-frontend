import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";

interface TagsFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  foundTagsCount: number;
}

const TagsFilters = ({ searchTerm, setSearchTerm, foundTagsCount }: TagsFiltersProps) => {
  return (
    <div className="flex px-3 py-2 gap-3 items-center flex-wrap">
      <Input
        placeholder="Wyszukaj tag..."
        className="w-64 border-ring"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button variant="outline" size="sm" onClick={() => setSearchTerm("")}>
        Resetuj
      </Button>
      <Badge variant="outline" className="ml-auto">
        Znaleziono: {foundTagsCount}
      </Badge>
    </div>
  );
};

export default TagsFilters;
