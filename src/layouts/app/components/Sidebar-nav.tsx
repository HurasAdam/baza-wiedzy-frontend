import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Workspace } from "@/types";
import { motion } from "framer-motion";
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

const MotionButton = motion(Button);

export const SidebarNav = ({ items, isCollapsed, className, currentWorkspace, ...props }: SidebarNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className={cn("flex flex-col gap-y-1.5 px-4 py-5 relative", className)} {...props}>
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
              isActive && " text-sidebar-foreground font-medium",
            )}
          >
            {/* Animated active background (Linear-style) */}
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
              )}
            />

            {!isCollapsed && <span className="relative z-10 ml-3 text-[14px] tracking-tight">{el.title}</span>}
          </MotionButton>
        );
      })}
    </nav>
  );
};
