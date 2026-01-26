import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";

interface JstProjectsFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  jstProjectsCount: number;
}

const JstProjectsFilters = ({ searchTerm, setSearchTerm, jstProjectsCount }: JstProjectsFiltersProps) => {
  return (
    <div className="flex px-3 py-2 gap-3 items-center flex-wrap">
      <Input
        placeholder="Szukaj projektu..."
        className="w-64"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button variant="outline" size="sm" onClick={() => setSearchTerm("")}>
        Resetuj
      </Button>
      <Badge variant="outline" className="ml-auto">
        Znaleziono: {jstProjectsCount}
      </Badge>
    </div>
  );
};

export default JstProjectsFilters;
