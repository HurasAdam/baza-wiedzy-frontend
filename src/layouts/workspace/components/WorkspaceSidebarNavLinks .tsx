import { cn } from "@/lib/utils";
import { Folders, LayoutGrid, Settings, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

interface WorkspaceSidebarNavLinksProps {
  workspaceId: string;
}

export const WorkspaceSidebarNavLinks = ({ workspaceId }: WorkspaceSidebarNavLinksProps) => {
  const links = [
    { to: `/workspace/${workspaceId}`, icon: LayoutGrid },
    { to: `/workspace/${workspaceId}/manage-folders`, icon: Folders },
    { to: `/workspace/${workspaceId}/members`, icon: Users },
    { to: `/workspace/${workspaceId}/settings`, icon: Settings },
  ];

  return (
    <nav className="px-1.5 py-2 space-y-2">
      {links.map(({ to, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === `/workspace/${workspaceId}`}
          className={({ isActive }) =>
            cn(
              "group relative flex items-center justify-center p-2 rounded-md transition-colors aspect-square",
              isActive ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r bg-primary" />
              )}
              <Icon
                size={17.5}
                className={cn(
                  "transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                )}
              />
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
