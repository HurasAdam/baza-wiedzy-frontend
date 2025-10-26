import { X } from "lucide-react";
import { Badge } from "../../../../components/ui/badge";
import { iconMap } from "../../../../constants/role-icons";

const SelectedFiltersBadges = ({ selectedRole, selectedStatus, setSelectedStatus, setSelectedRole, roles }) => {
  return (
    <div className="flex gap-2 pt-2.5 flex-wrap px-2 h-6 mb-3">
      {selectedRole &&
        (() => {
          const role = roles.find((r) => r._id === selectedRole);
          if (!role) return null;
          const Icon = iconMap[role.iconKey];
          return (
            <Badge variant="secondary" className={`flex items-center gap-1 text-${role.labelColor}-600`}>
              <Icon className="w-4 h-4" />
              {role.name}
              <button
                onClick={() => setSelectedRole(null)}
                className="hover:text-destructive"
                aria-label="Usuń filtr roli"
              >
                <X className="w-4 h-4" />
              </button>
            </Badge>
          );
        })()}

      {/* Selected status badge */}
      {selectedStatus && (
        <Badge variant="secondary" className="flex items-center gap-1">
          {selectedStatus === "active" && "Aktywni"}
          {selectedStatus === "inactive" && "Nieaktywni"}

          <button
            onClick={() => setSelectedStatus(null)}
            className="hover:text-destructive"
            aria-label="Usuń filtr statusu"
          >
            <X className="w-4 h-4" />
          </button>
        </Badge>
      )}
    </div>
  );
};

export default SelectedFiltersBadges;
