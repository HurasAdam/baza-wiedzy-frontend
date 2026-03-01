import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
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

const MotionButton = motion(Button);

export const SidebarMyNav = ({ items, isCollapsed, ...props }: MySectionNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  if (!items?.length) return null;

  return (
    <div className="mt-2 border-t border-border/50" {...props}>
      <div className="flex items-center px-4 py-3">
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sidebar-foreground/40">
          {!isCollapsed && "Moje"}
        </h3>
      </div>

      <nav className="flex flex-col gap-y-1.5 px-4 py-2">
        {items.map((el) => {
          const Icon = el.icon;
          const isActive = location.pathname === el.href || location.pathname.startsWith(el.href + "/");

          const handleClick = () => {
            navigate(el.href);
          };

          return (
            <MotionButton
              key={el.href}
              variant="ghost"
              onClick={handleClick}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={cn(
                "relative h-9 px-3 justify-start rounded-lg",
                "text-sidebar-foreground hover:text-sidebar-foreground",
                isActive && "text-sidebar-foreground font-medium",
                isCollapsed && "w-10 justify-center px-0",
              )}
              title={isCollapsed ? el.title : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="activeSidebarItem"
                  className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}

              <Icon
                strokeWidth={1.5}
                className={cn(
                  "relative z-10 w-4.5 h-4.5 transition-all",
                  isActive ? "text-sidebar-primary" : "text-sidebar-foreground/65 group-hover:text-sidebar-foreground",
                  isCollapsed && "mx-auto",
                )}
              />

              {!isCollapsed && <span className="relative z-10 ml-3 text-[14px] tracking-tight">{el.title}</span>}
            </MotionButton>
          );
        })}
      </nav>
    </div>
  );
};
