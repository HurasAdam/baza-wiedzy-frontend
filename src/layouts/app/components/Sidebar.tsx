import { cn } from "@/lib/utils";
// import { useAuth } from "@/provider/auth-context";
import type { Workspace } from "@/types";
import {
  CheckCircle2,
  ChevronsLeft,
  ChevronsRight,
  Layers,
  LayoutDashboard,
  ListCheck,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarNav } from "./Sidebar-nav";
import { ThemeToggle } from "@/components/Theme-toggle";
import { useLogoutMutation } from "@/hooks/auth/use-auth";
import queryClient from "@/config/query.client";

const navItems = [
  {
    title: "Start",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Artykuły",
    href: "/articles",
    icon: Users,
  },
  {
    title: "Rejestr tematów",
    href: "/register-topic",
    icon: ListCheck,
  },
  {
    title: "Szkoły projektowe",
    href: `/members`,
    icon: Users,
  },
  {
    title: "Działy i kontakty",
    href: `/achieved`,
    icon: CheckCircle2,
  },
  {
    title: "Ulubione",
    href: "/settings",
    icon: Settings,
  },
];

export const Sidebar = ({
  currentWorkspace,
}: {
  currentWorkspace: Workspace | null;
}) => {
  //   const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const { mutate, isPending } = useLogoutMutation();

  const onLogout = () => {
    mutate(undefined, {
      onSuccess: () => {
        queryClient.clear();
        navigate("/auth/login", { replace: true });
      },
      onError: (err) => {
        // optionalnego obsłużenia błędu
      },
    });
  };

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-sidebar transition-all duration-300",
        isCollapsed ? "w-16 md:w[80px]" : "w-16 md:w-[240px]"
      )}
    >
      <div className="flex h-14 items-center border-b px-4 mb-4">
        <Link to="/dashboard" className="flex items-center">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Layers className="size-6 text-sidebar-primary" />
              <span className="font-semibold text-lg hidden md:block text-foreground">
                Baza wiedzy
              </span>
            </div>
          )}

          {isCollapsed && <Layers className="size-6 text-sidebar-primary" />}
        </Link>

        <Button
          variant={"ghost"}
          size="icon"
          className="ml-auto hidden md:block"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronsRight className="size-4" />
          ) : (
            <ChevronsLeft className="size-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-2">
        <SidebarNav
          items={navItems}
          isCollapsed={isCollapsed}
          className={cn(isCollapsed && "items-center space-y-2")}
          currentWorkspace={currentWorkspace}
        />
      </ScrollArea>

      <div className="flex justify-center">
        <ThemeToggle />
      </div>
      <div>
        <Button
          variant={"ghost"}
          size={isCollapsed ? "icon" : "default"}
          onClick={onLogout}
        >
          <LogOut className={cn("size-4", isCollapsed && "mr-2")} />
          <span className="hidden md:block">Logout</span>
        </Button>
      </div>
    </div>
  );
};
