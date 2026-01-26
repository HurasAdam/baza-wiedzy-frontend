import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";

interface Role {
  _id: string;
  name: string;
  iconKey?: string;
  labelColor?: string;
}

interface AdminRolesFiltersProps {
  roles: Role[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}
const AdminRolesFilters = ({ roles, searchTerm, setSearchTerm }: AdminRolesFiltersProps) => {
  return (
    <div className="flex  px-3 py-2 gap-3 items-center flex-wrap">
      <Input
        placeholder="Wyszukaj role..."
        className="w-64"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button variant="outline" size="sm" onClick={() => setSearchTerm("")}>
        Resetuj
      </Button>
      <Badge variant="outline" className="ml-auto">
        Znaleziono: {roles && roles.length}
      </Badge>
    </div>
  );
};

export default AdminRolesFilters;
