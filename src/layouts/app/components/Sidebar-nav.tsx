import type { Workspace } from "@/types";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router";

interface SidebarNavProps extends React.HtmlHTMLAttributes<HTMLElement> {
  items: {
    title: string;
    href: string;
    icon: LucideIcon;
  }[];
  isCollapsed: boolean;
  currentWorkspace: Workspace | null;
  className?: string;
}

export const SidebarNav = ({ items, isCollapsed, className, currentWorkspace, ...props }: SidebarNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className={cn("flex flex-col gap-y-1.5 p-2.5", className)} {...props}>
      {items.map((el) => {
        const Icon = el.icon;
        const isActive = location.pathname === el.href || location.pathname.startsWith(el.href + "/");

        const handleClick = () => {
          if (el.href === "/workspaces") {
            navigate(el.href);
          } else if (currentWorkspace?._id) {
            navigate(`${el.href}?workspaceId=/${currentWorkspace._id}`);
          } else {
            navigate(el.href);
          }
        };

        return (
          <Button
            key={el.href}
            variant={isActive ? "outline" : "ghost"}
            className={cn(
              "justify-start text-sidebar-foreground border-transparent hover:text-sidebar-accent-foreground hover:bg-sidebar-hover rounded-md transition-colors duration-200  ",
              isActive &&
                "bg-sidebar-primary hover:bg-sidebar-primary border-sidebar-border text-sidebar-primary-foreground font-semibold ",
              isCollapsed && "w-10 justify-center "
            )}
            onClick={handleClick}
          >
            <Icon className={cn("w-5 h-5", isCollapsed && "mx-auto")} />
            {!isCollapsed && <span className="ml-1.5">{el.title}</span>}
          </Button>
        );
      })}
    </nav>
  );
};
