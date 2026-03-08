import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { HelpCircle, Layers2, LogOut, Origami, Plus, Settings, type LucideIcon } from "lucide-react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  icon: LucideIcon;
  onClick: () => void;
  hasBadge?: number; // np. powiadomienia
}

interface LeftNavBarProps {
  items: LeftNavItem[];
  onCreateWorkspace: () => void;
  onOpenInviteModal: () => void;
  onOpenChangeLogModal: () => void;
  onOpenLogoutAlert: () => void;
}

export const LeftNavBar = ({
  items,
  onCreateWorkspace,
  onOpenInviteModal,
  onOpenChangeLogModal,
  onOpenLogoutAlert,
}: LeftNavBarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: workspaces = [], isPending } = useFindUserWorkspacesQuery();

  return (
    <nav className="flex flex-col items-center justify-between py-2.5 px-[8px] gap-y-3 bg-gradient-to-br from-muted to-muted shadow-md border border-border/55 h-full">
      {/* GÓRA: Workspace / logo */}
      <div className="flex flex-col items-center w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center  justify-center w-10 h-10 rounded-md hover:bg-primary/60 transition-colors mb-4"
              aria-label="Switch workspace"
            >
              <Origami className="w-5 h-5 text-sidebar-logo/70" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-56 mt-1 rounded-lg shadow-lg bg-background scrollbar-custom"
            align="start"
            sideOffset={11}
            side="right"
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">Twoje kolekcje</DropdownMenuLabel>

            {isPending ? (
              <div className="flex items-center justify-center py-2">
                <span className="w-4 h-4 animate-spin border-2 border-gray-300 border-t-transparent rounded-full" />
              </div>
            ) : (
              workspaces.map((ws) => (
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

        {/* AKCJE: dołącz / nowe / ustawienia / powiadomienia */}
        <div className="flex flex-col items-center mt-4 gap-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = false; // Możesz dodać logikę aktywnej strony, jeśli potrzebne

            return (
              <Tooltip key={item.title}>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={item.onClick}
                    className={cn(
                      "relative flex items-center justify-center w-10 h-10 hover:bg-primary/20 rounded-lg text-sidebar-foreground transition-colors",
                      isActive ? "bg-primary/20" : "",
                    )}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Aktywny wskaźnik pionowy */}
                    {isActive && <span className="absolute left-0 w-1 h-5 bg-primary rounded-r-full" />}
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    {item.hasBadge && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center w-3.5 h-3.5 text-[10px] font-bold text-white bg-red-500 rounded-full">
                        {item.hasBadge}
                      </span>
                    )}
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent
                  side="right" // po której stronie triggera ma być tooltip
                  align="center" // wyrównanie w pionie względem triggera
                  sideOffset={2} // dystans od triggera w px
                  className="text-xs"
                >
                  {item.title}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>

      {/* DOLE: logout */}
      <div className="mb-3 space-y-21">
        <div className="flex flex-col gap-2.5">
          <motion.button
            onClick={onOpenChangeLogModal}
            className={cn(
              "relative flex hover:bg-primary/20 items-center justify-center w-10 h-10  rounded-lg text-sidebar-foreground transition-colors",
            )}
            whileTap={{ scale: 0.95 }}
          >
            {/* Aktywny wskaźnik pionowy */}

            <Settings className="w-4 h-4" />
          </motion.button>
          <motion.button
            onClick={onOpenChangeLogModal}
            className={cn(
              "relative flex hover:bg-primary/20 items-center justify-center w-10 h-10  rounded-lg text-sidebar-foreground transition-colors",
            )}
            whileTap={{ scale: 0.95 }}
          >
            {/* Aktywny wskaźnik pionowy */}

            <HelpCircle className="w-4 h-4" />
          </motion.button>
        </div>
        <div className="space-y-2">
          <motion.button
            onClick={onOpenLogoutAlert}
            className={cn(
              "relative flex bg-primary/40 hover:bg-primary/50 items-center justify-center w-8.5 h-8.5  rounded-xl text-sidebar-foreground transition-colors",
            )}
            whileTap={{ scale: 0.95 }}
          >
            {/* Aktywny wskaźnik pionowy */}

            <LogOut className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </nav>
  );
};
