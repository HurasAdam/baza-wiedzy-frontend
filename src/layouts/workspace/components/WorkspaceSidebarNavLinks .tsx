import { cn } from "@/lib/utils";
import { FolderKanban, Settings, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

interface WorkspaceSidebarNavLinksProps {
  workspaceId: string;
}

export const WorkspaceSidebarNavLinks = ({ workspaceId }: WorkspaceSidebarNavLinksProps) => {
  const links = [
    { to: `/workspaces/${workspaceId}/projects`, icon: FolderKanban, label: "Projekty" },
    { to: `/workspaces/${workspaceId}/members`, icon: Users, label: "Zespół" },
    { to: `/workspaces/${workspaceId}/settings`, icon: Settings, label: "Ustawienia" },
  ];

  return (
    <nav className="px-2 py-2 space-y-1">
      {links.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
              isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"
            )
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
};
