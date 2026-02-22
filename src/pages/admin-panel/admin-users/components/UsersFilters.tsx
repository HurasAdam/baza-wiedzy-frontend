import { Dropdown } from "@/components/Dropdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { iconMap } from "@/constants/role-icons";
import { Plus, Users, X } from "lucide-react";

interface UsersFiltersProps {
  roles: any[];
  usersCount: number;
  role: string | null;
  status: string | null;
  search: string;
  onAddUser: () => void;
  onManageRoles: () => void;
  onChange: (filters: { role: string | null; status: string | null; search: string }) => void;
}

export const UsersFilters = ({
  roles,
  usersCount,
  role,
  status,
  search,
  onAddUser,
  onManageRoles,
  onChange,
}: UsersFiltersProps) => {
  const hasFilters = Boolean(role || status || search);
  const selectedRole = roles.find((r) => r._id === role);

  return (
    <div className="rounded-xl border border-border bg-background shadow-sm">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <h1 className="text-lg font-semibold text-foreground">Użytkownicy</h1>
        </div>

        <div className="flex items-center gap-4">
          <Dropdown
            triggerBtn={
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Dodaj
              </Button>
            }
            options={[
              {
                label: "Dodaj użytkownika",
                icon: <Plus className="h-4 w-4" />,
                actionHandler: onAddUser,
              },
              {
                label: "Zarządzaj rolami",
                icon: <Plus className="h-4 w-4" />,
                actionHandler: onManageRoles,
              },
            ]}
            position={{ align: "end" }}
          />
        </div>
      </div>

      {/* ===== Filters bar ===== */}
      <div className="flex justify-between px-6 py-4 items-center ">
        <div className="flex gap-3 flex-wrap ">
          <Input
            placeholder="Szukaj użytkownika"
            className="w-60"
            value={search}
            onChange={(e) => onChange({ role, status, search: e.target.value })}
          />

          <Select
            value={role ?? "all"}
            onValueChange={(v) => onChange({ role: v === "all" ? null : v, status, search })}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Rola" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie role</SelectItem>
              {roles.map((r) => {
                const Icon = iconMap[r.iconKey];
                return (
                  <SelectItem key={r._id} value={r._id}>
                    <div className="flex items-center gap-2">
                      {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                      <span>{r.name}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <Select
            value={status ?? "all"}
            onValueChange={(v) => onChange({ role, status: v === "all" ? null : v, search })}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszyscy</SelectItem>
              <SelectItem value="active">Aktywni</SelectItem>
              <SelectItem value="inactive">Nieaktywni</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="sm"
            disabled={!hasFilters}
            onClick={() => onChange({ role: null, status: null, search: "" })}
            className="text-muted-foreground"
          >
            Wyczyść
          </Button>
        </div>
        <div className="flex">
          <span className="text-sm text-muted-foreground">{usersCount} wyników</span>
        </div>
      </div>

      {/* ===== Active filters ===== */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 px-6 py-3 border-t border-border">
          {search && (
            <Badge variant="secondary" className="flex items-center gap-2">
              <span className="max-w-[160px] truncate">{search}</span>
              <button onClick={() => onChange({ role, status, search: "" })}>
                <X className="h-3.5 w-3.5 hover:text-destructive" />
              </button>
            </Badge>
          )}

          {selectedRole &&
            (() => {
              const Icon = iconMap[selectedRole.iconKey];
              return (
                <Badge
                  variant="secondary"
                  className={`flex items-center gap-2 ${
                    selectedRole.labelColor ? `text-${selectedRole.labelColor}-600` : ""
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{selectedRole.name}</span>
                  <button onClick={() => onChange({ role: null, status, search })}>
                    <X className="h-3.5 w-3.5 hover:text-destructive" />
                  </button>
                </Badge>
              );
            })()}

          {status && (
            <Badge variant="secondary" className="flex items-center gap-2">
              <span>{status === "active" ? "Aktywni" : "Nieaktywni"}</span>
              <button onClick={() => onChange({ role, status: null, search })}>
                <X className="h-3.5 w-3.5 hover:text-destructive" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
