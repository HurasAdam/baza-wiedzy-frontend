import { cn } from "@/lib/utils";
import { Folders, LayoutGrid, Settings, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

interface WorkspaceSidebarNavLinksProps {
  workspaceId: string;
}

export const WorkspaceSidebarNavLinks = ({ workspaceId }: WorkspaceSidebarNavLinksProps) => {
  const links = [
    { to: `/workspace/${workspaceId}`, icon: LayoutGrid, label: "Start" },
    { to: `/workspace/${workspaceId}/manage-folders`, icon: Folders, label: "Foldery" },
    { to: `/workspace/${workspaceId}/members`, icon: Users, label: "Użytkownicy" },
    { to: `/workspace/${workspaceId}/settings`, icon: Settings, label: "Ustawienia" },
  ];

  return (
    <nav className="px-2 py-2 space-y-1">
      {links.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === `/workspace/${workspaceId}`}
          className={({ isActive }) =>
            cn(
              "group relative flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all",
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )
          }
        >
          {({ isActive }) => (
            <>
              {/* left active indicator */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r bg-primary" />
              )}

              <Icon
                size={18}
                className={cn(
                  "transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                )}
              />

              <span className="truncate">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
