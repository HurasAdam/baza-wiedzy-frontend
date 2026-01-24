import { useAuthQuery } from "@/hooks/auth/use-auth";
import { Loader } from "lucide-react";
import type { ReactNode } from "react";
import { NoAccessPage } from "../pages/no-access/NoAccessPage";

interface PermissionGuardProps {
  permissions: string[];
  children: ReactNode;
}

export default function PermissionGuard({ permissions, children }: PermissionGuardProps) {
  const { data: user, isLoading } = useAuthQuery();

  if (isLoading) return <Loader className="animate-spin" />;

  const hasPermission = permissions.some((perm) => user?.role?.permissions?.includes(perm));

  if (!hasPermission) {
    return <NoAccessPage />;
  }

  return <>{children}</>;
}
