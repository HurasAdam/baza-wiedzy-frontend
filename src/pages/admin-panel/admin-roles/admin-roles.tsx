import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { useFindRoles } from "@/hooks/users/use-users";
import { useNavigate } from "react-router-dom";
import AdminRolesFilters from "./components/AdminRolesFilters";
import AdminRolesHeader from "./components/AdminRolesHeader";
import AdminRolesList from "./components/AdminRolesList";

export const AdminRolesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const params = useMemo(() => {
    const searchParams = new URLSearchParams();
    if (searchTerm) searchParams.append("name", searchTerm);
    searchParams.append("includeAdmins", "true");
    return searchParams;
  }, [searchTerm]);

  const { data: roles = [], isLoading, isError, error } = useFindRoles(params);
  const dropdownOptions = [
    {
      label: "Dodaj role",
      icon: <Plus className="w-4 h-4" />,
      actionHandler: () => navigate("/admin/manage-roles/create"),
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-1 space-y-6 pb-10">
      {/* Header */}
      <div className="bg-background z-10 flex flex-col gap-4 mb-4">
        <AdminRolesHeader
          triggerBtn={
            <Button variant="default" className="flex items-center gap-1">
              Dodaj <Plus className="w-4 h-4" />
            </Button>
          }
          dropdownOptions={dropdownOptions}
        />

        <AdminRolesFilters roles={roles} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      {/* Roles List */}

      {roles && (
        <AdminRolesList roles={roles} isLoading={isLoading} isError={isError} navigate={navigate} error={error} />
      )}
    </div>
  );
};
