import { Ellipsis, FileIcon, Loader, User, XCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { Dropdown } from "../../../../components/Dropdown";
import { Button } from "../../../../components/ui/button";
import { iconMap } from "../../../../constants/role-icons";
import type { Role } from "../../../../types/roles";

interface AdminRolesListProps {
  roles: Role[];
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  navigate: (url: string) => void;
}

const AdminRolesList = ({ roles, isLoading, isError, error, navigate }: AdminRolesListProps) => {
  return (
    <div className="bg-card border rounded-xl overflow-hidden">
      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader className="animate-spin w-6 h-6" />
        </div>
      )}

      {isError && (
        <p className="text-destructive text-center py-10">{error?.message || "Błąd podczas ładowania produktów"}</p>
      )}

      {!isLoading && !isError && roles.length === 0 && <p className="text-center py-10">Nie znaleziono roli</p>}

      {!isLoading && !isError && roles.length > 0 && (
        <ul className="divide-y divide-border">
          {roles.map((role) => {
            const Icon = iconMap[role.iconKey] || User; // fallback Icon
            return (
              <li
                key={role._id}
                className="flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition group"
              >
                {/* Left */}
                <div className="flex items-center gap-3">
                  <div
                    className="  flex-shrink-0
  w-8.5 h-8.5
  flex items-center justify-center
  rounded-lg
  border border-muted/40
  bg-muted/90"
                  >
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>

                  <span className="text-sm font-medium text-foreground">{role.name}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-40 items-center">
                  <Dropdown
                    withSeparators
                    triggerBtn={
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition">
                        <Ellipsis className="w-4 h-4" />
                      </Button>
                    }
                    options={[
                      {
                        label: "Edytuj",
                        icon: <FileIcon className="w-4 h-4" />,
                        actionHandler: () => navigate(`/admin/manage-roles/${role._id}`),
                      },
                      {
                        label: "Usuń",
                        icon: <XCircleIcon className="w-4 h-4 text-red-500" />,
                        actionHandler: () => toast.error(`Usuń ${role.name}`),
                      },
                    ]}
                    position={{ align: "end" }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AdminRolesList;
