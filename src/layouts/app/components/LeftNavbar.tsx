import { Tooltip } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { Layers2, Loader, LogOut, Origami, Plus, type LucideIcon } from "lucide-react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { WORKSPACE_ICONS } from "../../../components/workspace/workspace-form";
import { useFindUserWorkspacesQuery } from "../../../hooks/workspace/use-workspace";
import { cn } from "../../../lib/utils";

interface LeftNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

interface LeftNavBarProps {
  items: LeftNavItem[];
  onCreateWorkspace: () => void;
}

export const LeftNavBar = ({ items, onCreateWorkspace }: LeftNavBarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: workspaces = [], isPending } = useFindUserWorkspacesQuery();

  return (
    <nav
      className="flex flex-col items-center justify-between py-1 px-0.5 gap-y-2.5 
                 bg-gradient-to-br from-muted to-muted shadow-md  border border-border/55 h-full"
    >
      <div className="flex flex-col items-center">
        <div className={cn("flex items-center mb-6.5 px-2.5 h-13 border-b  transition-colors justify-center")}>
          <div className="flex items-center gap-3.5 ">
            {/* Logo jako dropdown trigger */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center justify-center w-8.5 h-8.5 rounded-md  hover:bg-primary/60 transition-colors"
                  aria-label="Switch workspace"
                >
                  <Origami className="w-5 h-5 text-sidebar-logo/70" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-56 rounded-lg shadow-lg bg-background scrollbar-custom"
                align="start"
                sideOffset={4}
              >
                <DropdownMenuLabel className="text-xs text-muted-foreground">Twoje kolekcje</DropdownMenuLabel>

                {isPending ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader className="w-4 h-4 animate-spin text-foreground" />
                  </div>
                ) : (
                  workspaces?.map((ws) => (
                    <DropdownMenuItem
                      key={ws._id}
                      onClick={() => navigate(`/workspace/${ws._id}`)}
                      className="gap-2 p-2 cursor-pointer"
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-md border bg-background">
                        {React.createElement(WORKSPACE_ICONS[ws.icon] || Layers2, {
                          className: "w-4 h-4",
                          style: { color: ws.labelColor },
                        })}
                      </div>
                      {ws.name}
                    </DropdownMenuItem>
                  ))
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onCreateWorkspace} className="gap-2 p-2 cursor-pointer">
                  <Plus className="w-4 h-4" />
                  Dodaj kolekcję
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          const button = (
            <motion.button
              key={item.href}
              onClick={() => navigate(item.href)}
              className=" flex items-center justify-center w-10 h-10  hover:bg-primary   rounded-lg  text-sidebar-foreground transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              {/* Active vertical indicator */}

              <Icon className={isActive ? "text-muted-foreground w-4 h-4" : "w-4 h-4  text-muted-foreground "} />
            </motion.button>
          );

          return (
            <Tooltip key={item.href} content={item.title} placement="right">
              {button}
            </Tooltip>
          );
        })}
      </div>
      <div className="mb-3">
        <Button variant="ghost">
          <LogOut />
        </Button>
      </div>
    </nav>
  );
};
