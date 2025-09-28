import { cn } from "@/lib/utils";
import type { Workspace } from "@/types";
import {
  BookOpen,
  BookUser,
  ChartColumnDecreasing,
  ChevronsLeft,
  ChevronsRight,
  Clipboard,
  FolderSearch,
  HeartIcon,
  Info,
  LayoutDashboard,
  Origami,
  RectangleEllipsis,
  School,
  Smile,
  UserRoundPen,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import queryClient from "@/config/query.client";
import { useAuthQuery, useLogoutMutation } from "@/hooks/auth/use-auth";
import { Link, useNavigate } from "react-router-dom";
import { SidebarNav } from "./Sidebar-nav";

type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<any>;
  requiredPermission?: string; // opcjonalna permisja do wyświetlenia
};

const navItems: NavItem[] = [
  { title: "Start", href: "/dashboard", icon: LayoutDashboard },
  { title: "Baza artykułów", href: "/articles", icon: FolderSearch },
  { title: "FAQ", href: "/faq", icon: BookOpen },
  { title: "Rejestr tematów", href: "/register-topic", icon: Clipboard },
  { title: "Szkoły projektowe", href: `/jst-projects`, icon: School },
  { title: "Działy i kontakty", href: `/achieved`, icon: BookUser },
  { title: "Moje wpisy", href: `/my-entries`, icon: UserRoundPen, requiredPermission: "ADD_ARTICLE" },
  { title: "Statystyki", href: `/statistics`, icon: ChartColumnDecreasing },
  { title: "Ulubione", href: "/favorites-articles", icon: HeartIcon },
  {
    title: "do zweryfikowania",
    href: "/articles-pending",
    icon: RectangleEllipsis,
    requiredPermission: "ACCESS_PENDING_ARTICLES_PANEL",
  },
  { title: "Zabawne wiad.", href: "/funny-messages", icon: Smile },
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
  const { mutate } = useLogoutMutation();

  // Pobranie użytkownika i jego permisji
  const { data: authData, isLoading } = useAuthQuery();
  const userPermissions = authData?.role?.permissions || [];

  const onLogout = () => {
    mutate(undefined, {
      onSuccess: () => {
        queryClient.clear();
        navigate("/auth/login", { replace: true });
      },
    });
  };

  // Filtrowanie zakładek po permisjach
  const filteredNavItems = navItems.filter((item) => {
    if (!item.requiredPermission) return true;
    return userPermissions.includes(item.requiredPermission);
  });

  return (
    <div
      style={{ background: "var(--sidebar)" }}
      className={cn(
        "flex flex-col border-r bg-sidebar transition-all duration-300",
        isCollapsed ? "w-18 md:w[80px]" : "w-16 md:w-[240px] p-2.5"
      )}
    >
      <div className="flex h-14 items-center border-b px-4 mb-4 gap-1">
        <Link to="/dashboard" className="flex items-center">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Origami className="size-6 text-sidebar-logo/65" />
              <span className="font-semibold text-lg hidden md:block text-sidebar-foreground">Baza wiedzy</span>
            </div>
          )}
          {isCollapsed && <Origami className="size-6 text-sidebar-primary" />}
        </Link>

        <Button
          variant={"ghost"}
          size="icon"
          className="ml-auto hidden md:block hover:bg-transparent"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-2">
        <SidebarNav
          items={filteredNavItems} // <- wyświetlamy tylko zakładki dostępne dla użytkownika
          isCollapsed={isCollapsed}
          className={cn(isCollapsed && "items-center space-y-2")}
          currentWorkspace={currentWorkspace}
        />
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
