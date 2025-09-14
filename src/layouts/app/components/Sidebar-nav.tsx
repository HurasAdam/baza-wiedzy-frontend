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
    <nav className={cn("flex flex-col gap-y-2", className)} {...props}>
      {items.map((el) => {
        const Icon = el.icon;
        const isActive = location.pathname === el.href || location.pathname.startsWith(el.href + "/");

        const handleClick = () => {
          if (el.href === "/workspaces") {
            navigate(el.href);
          } else if (currentWorkspace && currentWorkspace._id) {
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
              "justify-start text-sidebar-foreground border-transparent hover:text-sidebar-accent-foreground hover:bg-transparent",
              isActive &&
                "bg-sidebar-primary hover:bg-sidebar-primary border-sidebar-border text-sidebar-primary-foreground font-medium",
              isCollapsed && "w-10 "
            )}
            onClick={handleClick}
          >
            <Icon className="mr-2 size-4" />
            {isCollapsed ? <span className="sr-only">{el.title}</span> : el.title}
          </Button>
        );
      })}
    </nav>
  );
};
