import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export interface MySectionNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  requiredPermission?: string[];
}

interface MySectionNavProps extends React.HtmlHTMLAttributes<HTMLElement> {
  items: MySectionNavItem[];
  isCollapsed: boolean;
}

export const SidebarMyNav = ({ items, isCollapsed, ...props }: MySectionNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  if (!items?.length) return null;

  if (isCollapsed) {
    return (
      <div className="mt-2 border-t flex justify-center py-2" {...props}>
        <nav className="flex flex-col gap-y-1.5">
          {items.map((el) => {
            const Icon = el.icon;
            const isActive = location.pathname === el.href || location.pathname.startsWith(el.href + "/");

            const handleClick = () => {
              navigate(el.href);
            };

            return (
              <Button
                key={el.href}
                variant={isActive ? "outline" : "ghost"}
                className={cn(
                  "justify-start text-sidebar-foreground border-transparent hover:text-sidebar-accent-foreground hover:bg-sidebar-hover rounded-md transition-colors duration-200",
                  isActive &&
                    "bg-sidebar-primary hover:bg-sidebar-primary border-sidebar-border text-sidebar-primary-foreground font-semibold",
                  isCollapsed && "w-10 justify-center",
                )}
                onClick={handleClick}
                title={isCollapsed ? el.title : undefined}
              >
                <Icon className={cn("w-5 h-5", isCollapsed && "mx-auto")} />
                {!isCollapsed && <span className="ml-1.5">{el.title}</span>}
              </Button>
            );
          })}
        </nav>
      </div>
    );
  }

  return (
    <div className="mt-2 border-t px-2" {...props}>
      <div className="flex items-center px-3.5 py-2.5 ">
        <h3 className="text-[11px] font-medium text-muted-foreground/80  tracking-wide flex items-center gap-2">
          {!isCollapsed && "Moje"}
        </h3>
      </div>

      <nav className="flex flex-col gap-y-1.5">
        {items.map((el) => {
          const Icon = el.icon;
          const isActive = location.pathname === el.href || location.pathname.startsWith(el.href + "/");

          const handleClick = () => {
            navigate(el.href);
          };

          return (
            <Button
              key={el.href}
              variant={isActive ? "outline" : "ghost"}
              className={cn(
                "justify-start text-sidebar-foreground border-transparent hover:text-sidebar-accent-foreground hover:bg-sidebar-hover rounded-md transition-colors duration-200",
                isActive &&
                  "bg-sidebar-primary hover:bg-sidebar-primary border-sidebar-border text-sidebar-primary-foreground font-semibold",
                isCollapsed && "w-10 justify-center",
              )}
              onClick={handleClick}
              title={isCollapsed ? el.title : undefined}
            >
              <Icon className={cn("w-5 h-5", isCollapsed && "mx-auto")} />
              {!isCollapsed && <span className="ml-1.5">{el.title}</span>}
            </Button>
          );
        })}
      </nav>
    </div>
  );
};
