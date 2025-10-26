import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { iconMap } from "@/constants/role-icons";

interface UsersFiltersProps {
  roles: any[];
  usersCount: number;
  role: string | null;
  status: string | null;
  search: string;
  onChange: (filters: { role: string | null; status: string | null; search: string }) => void;
}

export const UsersFilters = ({ roles, usersCount, role, status, search, onChange }: UsersFiltersProps) => {
  const resetFilters = () => {
    onChange({ role: null, status: null, search: "" });
  };

  return (
    <div className="flex rounded-lg px-3 py-2 gap-3 items-center flex-wrap mb-4">
      {/* Keyword Filter */}
      <Input
        placeholder="Szukaj użytkownika..."
        className="w-48 border-ring"
        value={search}
        onChange={(e) => onChange({ role, status, search: e.target.value })}
      />

      {/* Role Filter */}
      <Select value={role ?? "all"} onValueChange={(v) => onChange({ role: v === "all" ? null : v, status, search })}>
        <SelectTrigger className="w-40 border-ring">
          <SelectValue placeholder="Filtruj rolę" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Wszystkie role</SelectItem>
          {roles.map((r) => {
            const Icon = iconMap[r.iconKey];
            return (
              <SelectItem key={r._id} value={r._id}>
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center justify-center w-6 h-6 rounded-md flex-shrink-0"
                    style={{ background: r.labelColor ? `var(--color-${r.labelColor})` : undefined }}
                  >
                    {Icon ? <Icon className="w-4 h-4 text-white" /> : null}
                  </span>
                  <span className="text-sm">{r.name}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select value={status ?? "all"} onValueChange={(v) => onChange({ role, status: v === "all" ? null : v, search })}>
        <SelectTrigger className="w-40 border-ring">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Wszyscy</SelectItem>
          <SelectItem value="active">Aktywni</SelectItem>
          <SelectItem value="inactive">Nieaktywni</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" size="sm" onClick={resetFilters}>
        Resetuj filtry
      </Button>

      <Badge variant="outline" className="ml-auto">
        Znaleziono: {usersCount}
      </Badge>
    </div>
  );
};
