import { cn } from "@/lib/utils";
import type { Workspace } from "@/types";
import {
  BookOpen,
  BookUser,
  ChartColumnDecreasing,
  Check,
  ChevronsLeft,
  ChevronsRight,
  Clipboard,
  FolderSearch,
  HeartIcon,
  Info,
  LandPlot,
  Layers,
  Layers2,
  LayoutDashboard,
  Loader,
  MailQuestionMark,
  Origami,
  Plus,
  RectangleEllipsis,
  School,
  Smile,
  UserRoundPen,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthQuery } from "@/hooks/auth/use-auth";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

import { WORKSPACE_ICONS } from "../../../components/workspace/workspace-form";
import { useFindUserWorkspacesQuery } from "../../../hooks/workspace/use-workspace";
import { SidebarMyNav, type MySectionNavItem } from "./Sidebar-my-nav";
import { SidebarNav } from "./Sidebar-nav";

type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<any>;
  requiredPermission?: string;
};

const navItems: NavItem[] = [
  { title: "Start", href: "/dashboard", icon: LayoutDashboard },
  { title: "Baza artykułów", href: "/articles", icon: FolderSearch },
  // { title: "Moje ulubione", href: `/flagged-articles`, icon: HeartIcon },
  { title: "Rejestr tematów", href: "/register-topic", icon: Clipboard },
  // { title: "Moje wpisy", href: `/my-entries`, icon: UserRoundPen, requiredPermission: "ADD_ARTICLE" },
  { title: "FAQ", href: "/faq", icon: BookOpen },
  { title: "Statystyki", href: `/statistics`, icon: ChartColumnDecreasing },
  { title: "Szkoły projektowe", href: `/jst-projects`, icon: School },
  { title: "Działy i kontakty", href: `/achieved`, icon: BookUser },

  {
    title: "Do zweryfikowania",
    href: "/articles-pending",
    icon: RectangleEllipsis,
    requiredPermission: "ACCESS_PENDING_ARTICLES_PANEL",
  },
  { title: "Zabawne wiad.", href: "/funny-messages", icon: Smile },
];

export const myNavItems: MySectionNavItem[] = [
  {
    title: "Kolekcje",
    href: "/my-workspaces",
    icon: Layers2,
  },
  {
    title: "Ulubione",
    href: "/flagged-articles",
    icon: HeartIcon,
  },
  {
    title: "Wpisy",
    href: "/my-entries",
    icon: UserRoundPen,
    requiredPermission: "ADD_ARTICLE",
  },
  {
    title: "Etykiety",
    href: "/my-flags",
    icon: LandPlot,
    requiredPermission: "ADD_ARTICLE",
  },
  {
    title: "Zgłoszenia",
    href: "/reports",
    icon: MailQuestionMark,
    requiredPermission: "ADD_ARTICLE",
  },
];

const APP_VERSION = import.meta.env.VITE_APP_VERSION;
const isBeta = APP_VERSION?.toLowerCase().includes("beta");

export const Sidebar = ({
  currentWorkspace,
  onOpenChangeLogModal,
}: {
  currentWorkspace?: Workspace | null;
  onOpenChangeLogModal: () => void;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const { data: workspaces = [], isPending } = useFindUserWorkspacesQuery();

  const { data: authData, isLoading } = useAuthQuery();
  const userPermissions = authData?.role?.permissions || [];

  const filteredNavItems = navItems.filter((item) => {
    if (!item.requiredPermission) return true;
    return userPermissions.includes(item.requiredPermission);
  });

  return (
    <div
      style={{
        background: "var(--sidebar)",
        boxShadow: "var(--sidebar-shadow)",
      }}
      className={cn(
        "flex flex-col border-r  transition-all duration-300",
        isCollapsed ? "w-18 md:w[80px]" : "w-16 md:w-[240px] border-sidebar-border"
      )}
    >
      <div className="flex h-14 items-center border-b px-4 mb-1.5 gap-2 ">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center justify-center focus:outline-none focus:ring-0"
              aria-label="Switch workspace"
            >
              <Origami className="size-6 text-sidebar-logo/65 hover:text-sidebar-primary transition-colors" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-56 rounded-lg shadow-md bg-background scrollbar-custom"
            align="start"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">Twoje kolekcje</DropdownMenuLabel>

            {isPending ? (
              <div className="flex items-center justify-center py-2">
                <Loader className="w-4 h-4 animate-spin" />
              </div>
            ) : (
              workspaces?.map((ws) => (
                <DropdownMenuItem
                  key={ws._id}
                  onClick={() => navigate(`/workspace/${ws._id}`)}
                  className="gap-2 p-2 cursor-pointer"
                >
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    {React.createElement(WORKSPACE_ICONS[ws.icon] || Layers, {
                      className: "w-5 h-5",
                      style: { color: ws.labelColor },
                    })}
                  </div>
                  {ws.name}
                  {currentWorkspace?._id === ws._id && (
                    <DropdownMenuShortcut>
                      <Check className="w-4 h-4" />
                    </DropdownMenuShortcut>
                  )}
                </DropdownMenuItem>
              ))
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => console.log("TODO: create workspace modal")}
              className="gap-2 p-2 cursor-pointer"
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="w-4 h-4" />
              </div>
              Dodaj kolekcję
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {!isCollapsed && (
          <span className="font-semibold text-lg hidden md:block text-sidebar-foreground">Baza wiedzy</span>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="ml-auto hidden md:block hover:bg-transparent"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 py-2 ">
        <SidebarNav
          items={filteredNavItems}
          isCollapsed={isCollapsed}
          className={cn(isCollapsed && "items-center space-y-2 ")}
          currentWorkspace={currentWorkspace}
        />
        <SidebarMyNav items={myNavItems} isCollapsed={isCollapsed} />
      </ScrollArea>

      <div className="flex flex-col items-center py-4 mt-auto text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Info onClick={onOpenChangeLogModal} className="w-4 h-4 cursor-help text-sidebar-logo-secondary" />
          {!isCollapsed && (
            <span className="flex items-center gap-1 text-sidebar-foreground">
              v{APP_VERSION}
              {isBeta && (
                <span className="bg-yellow-400 text-black text-[10px] px-1 py-0.5 rounded font-medium">Beta</span>
              )}
            </span>
          )}
        </span>
      </div>
    </div>
  );
};
