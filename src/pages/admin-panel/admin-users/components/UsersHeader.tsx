import { Plus, Users } from "lucide-react";
import { Dropdown } from "../../../../components/Dropdown";
import { Button } from "../../../../components/ui/button";
import SelectedFiltersBadges from "./SelectedFiltersBadges";

interface UsersHeaderProps {
  roles: any[];
  selectedRole: string | null;
  selectedStatus: string | null;
  setSelectedRole: (r: string | null) => void;
  setSelectedStatus: (s: string | null) => void;
  onAddUser: () => void;
  onManageRoles: () => void;
}

export const UsersHeader = ({
  roles,
  selectedRole,
  selectedStatus,
  setSelectedRole,
  setSelectedStatus,
  onAddUser,
  onManageRoles,
}: UsersHeaderProps) => {
  return (
    <div className="bg-background z-10 flex flex-col gap-4 mb-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Users className="text-muted-foreground" /> Użytkownicy
          </h1>

          <SelectedFiltersBadges
            roles={roles}
            selectedRole={selectedRole}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            setSelectedRole={setSelectedRole}
          />
        </div>

        <Dropdown
          triggerBtn={
            <Button variant="default" className="flex items-center gap-1 cursor-pointer">
              Dodaj <Plus className="w-4 h-4" />
            </Button>
          }
          options={[
            { label: "Dodaj użytkownika", icon: <Plus className="w-4 h-4" />, actionHandler: onAddUser },
            { label: "Zarządzaj rolami", icon: <Plus className="w-4 h-4" />, actionHandler: onManageRoles },
          ]}
          position={{ align: "end" }}
        />
      </div>
    </div>
  );
};
