import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { iconOptions } from "../../../constants/role-icons";
import type { IPermission } from "../../../types/roles";

export type CreateRoleFormValues = {
  name: string;
  labelColor: string;
  iconKey: string;
  permissions: string[];
};

const colorOptions = [
  { name: "Blue", value: "blue" },
  { name: "Green", value: "green" },
  { name: "Orange", value: "orange" },
  { name: "Rose", value: "rose" },
  { name: "Gray", value: "gray" },
  { name: "Purple", value: "purple" },
  { name: "Teal", value: "teal" },
];

const colorClassMap: Record<string, string> = {
  blue: "bg-blue-800 border-blue-700",
  green: "bg-green-800 border-green-700",
  orange: "bg-orange-800 border-orange-700",
  rose: "bg-rose-800 border-rose-700",
  gray: "bg-gray-800 border-gray-700",
  purple: "bg-purple-800 border-purple-700",
  teal: "bg-teal-800 border-teal-700",
};

// external pure function - ok to keep outside (stable reference)
function groupPermissionsByCategory(permissions: IPermission[]) {
  return permissions.reduce<Record<string, IPermission[]>>((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {});
}

interface RoleFormProps {
  permissions: IPermission[]; // <- poprawiony typ
  isPermissionsLoading: boolean;
}

const RoleForm = ({ permissions = [], isPermissionsLoading }: RoleFormProps) => {
  const { register, watch, setValue } = useFormContext<CreateRoleFormValues>();
  const selectedColor = watch("labelColor");
  const selectedIcon = watch("iconKey");
  const selectedPermissions = watch("permissions") ?? [];

  const groupedPermissions = useMemo(() => groupPermissionsByCategory(permissions || []), [permissions]);

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  // toggle single permission
  const togglePermission = useCallback(
    (perm: string) => {
      const updated = selectedPermissions.includes(perm)
        ? selectedPermissions.filter((p) => p !== perm)
        : [...selectedPermissions, perm];
      setValue("permissions", updated, { shouldDirty: true });
    },
    [selectedPermissions, setValue]
  );

  // toggle all in category
  const toggleAllInCategory = useCallback(
    (category: string) => {
      const perms = groupedPermissions[category] || [];
      const allSelected = perms.every((p) => selectedPermissions.includes(p.key));
      const newPermissions = new Set(selectedPermissions);
      if (allSelected) perms.forEach((p) => newPermissions.delete(p.key));
      else perms.forEach((p) => newPermissions.add(p.key));
      setValue("permissions", Array.from(newPermissions), {
        shouldDirty: true,
      });
    },
    [groupedPermissions, selectedPermissions, setValue]
  );

  const categoryCounts = useMemo(() => {
    const m: Record<string, { total: number; selected: number }> = {};
    Object.entries(groupedPermissions).forEach(([cat, perms]) => {
      m[cat] = {
        total: perms.length,
        selected: perms.filter((p) => selectedPermissions.includes(p.key)).length,
      };
    });
    return m;
  }, [groupedPermissions, selectedPermissions]);

  return (
    <form className="space-y-6 pt-1" aria-label="Role form">
      {/* Name */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-muted-foreground" htmlFor="role-name">
          Nazwa roli
        </label>
        <Input
          id="role-name"
          {...register("name", { required: true })}
          placeholder="Np. Moderator"
          className="h-9 border-ring text-foreground"
        />
      </div>

      {/* Icon */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Ikona roli</p>
        <input type="hidden" {...register("iconKey")} />
        <div className="flex flex-wrap gap-2">
          {iconOptions.map(({ name, icon: Icon }) => (
            <button
              key={name}
              type="button"
              onClick={() => setValue("iconKey", name, { shouldDirty: true })}
              className={`w-11 h-11 flex items-center justify-center rounded border transition ${
                selectedIcon === name
                  ? "border-ring  ring-primary bg-primary text-primary-foreground ring-offset-1"
                  : "border-border hover:bg-muted text-foreground"
              }`}
              title={name}
              aria-pressed={selectedIcon === name}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Label color */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Kolor etykiety</p>
        <input type="hidden" {...register("labelColor", { required: true })} value={selectedColor} />
        <div className="flex flex-wrap gap-2 items-center">
          {colorOptions.map(({ name, value }) => {
            const isSelected = selectedColor === value;
            const colorClasses = colorClassMap[value] || "bg-muted border-border";
            return (
              <button
                key={name}
                type="button"
                onClick={() => setValue("labelColor", value, { shouldDirty: true })}
                className={`w-8 h-8 rounded-full border cursor-pointer transition-all duration-200 flex items-center justify-center ${
                  isSelected ? "ring-2 ring-ring ring-offset-2" : "hover:scale-105"
                } ${colorClasses}`}
                title={name}
                aria-pressed={isSelected}
              />
            );
          })}
        </div>
      </div>

      {/* Permissions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">Uprawnienia</p>
          <p className="text-sm text-muted-foreground">Wybierz uprawnienia dla roli</p>
        </div>

        {isPermissionsLoading && <p className="text-sm text-muted-foreground">Ładowanie uprawnień...</p>}

        {!isPermissionsLoading && (
          <>
            <input type="hidden" {...register("permissions")} />

            <div className="space-y-4">
              {Object.entries(groupedPermissions).map(([category, perms]) => {
                const counts = categoryCounts[category] || {
                  total: perms.length,
                  selected: 0,
                };
                const allSelected = counts.selected === counts.total && counts.total > 0;
                const isCollapsed = !!collapsed[category];

                return (
                  <section
                    key={category}
                    className="mb-4 rounded-lg border p-4 shadow-sm transition"
                    style={{
                      borderColor: "var(--color-border)",
                      backgroundColor: "var(--color-card)",
                      color: "var(--color-card-foreground)",
                      borderLeft: "4px solid var(--color-ring)",
                    }}
                    aria-labelledby={`cat-${category}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <h3 id={`cat-${category}`} className="text-base font-semibold text-foreground">
                            {category}
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            {counts.selected}/{counts.total} selected
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleAllInCategory(category)}
                          className="text-sm px-2 py-1 rounded-md border border-border bg-transparent text-muted-foreground hover:bg-muted transition"
                          aria-pressed={allSelected}
                          title={allSelected ? "Unselect all" : "Select all"}
                        >
                          {allSelected ? "Odznacz wszystkie" : "Zaznacz wszystkie"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setCollapsed((s) => ({
                              ...s,
                              [category]: !s[category],
                            }))
                          }
                          aria-expanded={!isCollapsed}
                          className="p-1 rounded hover:bg-muted transition"
                          title={isCollapsed ? "Expand" : "Collapse"}
                        >
                          {isCollapsed ? (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </div>

                    {!isCollapsed && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {perms.map(({ key, label }) => {
                          const checked = selectedPermissions.includes(key);
                          return (
                            <label
                              key={key}
                              className="flex items-center justify-between gap-3 rounded-md border border-border p-3 hover:bg-muted transition"
                              style={{
                                backgroundColor: "transparent",
                                borderColor: "var(--color-border)",
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div className="min-w-0">
                                  <div className="text-sm font-medium text-foreground">{label}</div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {checked && <Check className="w-4 h-4 text-muted-foreground" aria-hidden />}
                                <Switch
                                  checked={checked}
                                  onCheckedChange={() => togglePermission(key)}
                                  aria-label={`Permission ${key}`}
                                />
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          </>
        )}
      </div>

      <Separator />

      <p className="text-sm text-muted-foreground leading-relaxed">
        Po zapisaniu rola będzie dostępna do przypisania użytkownikom.
      </p>
    </form>
  );
};

export default RoleForm;
