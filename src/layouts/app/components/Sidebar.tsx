import { cn } from "@/lib/utils";
import type { Workspace } from "@/types";
import {
  BookOpen,
  BookUser,
  ChartColumnDecreasing,
  Clipboard,
  FolderSearch,
  HeartIcon,
  HelpCircle,
  LandPlot,
  Layers2,
  LayoutDashboard,
  Link,
  MailQuestionMark,
  MoreHorizontal,
  Network,
  RectangleEllipsis,
  School,
  Smile,
  UserRoundPen,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthQuery } from "@/hooks/auth/use-auth";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Separator } from "../../../components/ui/separator";
import * as animation from "../../../constants/animations";
import { useFindUserWorkspacesQuery } from "../../../hooks/workspace/use-workspace";
import { useSidebar } from "../../../providers/sidebar-provider";
import { CurrentUserAvatarDropdown } from "./CurrentUserAvatarDropdown";
import { SidebarMyNav, type MySectionNavItem } from "./Sidebar-my-nav";
import { SidebarNav } from "./Sidebar-nav";

type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  requiredPermission?: string;
};

const navItems: NavItem[] = [
  { title: "Start", href: "/dashboard", icon: LayoutDashboard },
  { title: "Baza artykułów", href: "/articles", icon: FolderSearch },
  // { title: "Moje ulubione", href: `/flagged-articles`, icon: HeartIcon },
  { title: "Przydatne linki", href: "/useful-links", icon: Link },
  { title: "Rejestr tematów", href: "/register-topic", icon: Clipboard },
  // { title: "Moje wpisy", href: `/my-entries`, icon: UserRoundPen, requiredPermission: "ADD_ARTICLE" },

  { title: "FAQ", href: "/faq", icon: BookOpen },
  {
    title: "Statystyki",
    href: `/statistics`,
    icon: ChartColumnDecreasing,
    requiredPermission: "VIEW_USER_STATS",
  },
  {
    title: "Narzędzia sieciowe",
    href: "/network-tools",
    icon: Network,
  },
  { title: "Szkoły JST", href: `/jst-projects`, icon: School },
  { title: "Działy i kontakty", href: `/achieved`, icon: BookUser },

  { title: "Zabawne wiad.", href: "/funny-messages", icon: Smile },
  {
    title: "Do zweryfikowania",
    href: "/articles-pending",
    icon: RectangleEllipsis,
    requiredPermission: "ACCESS_PENDING_ARTICLES_PANEL",
  },
];

export const myNavItems: MySectionNavItem[] = [
  {
    title: "Kolekcje",
    href: "/my-workspaces",
    icon: Layers2,
    requiredPermission: ["ADD_COLLECTION", "JOIN_COLLECTION"], // teraz tablica permisji
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
    requiredPermission: ["ADD_ARTICLE"],
  },
  {
    title: "Etykiety",
    href: "/my-flags",
    icon: LandPlot,
  },
];

const APP_VERSION = import.meta.env.VITE_APP_VERSION;

export const Sidebar = ({
  onCreateWorkspace,
  currentWorkspace,
  onOpenSettingsModal,
  onOpenChangeLogModal,
}: {
  currentWorkspace?: Workspace | null;
  onOpenChangeLogModal: () => void;
  onCreateWorkspace: () => void;
  onOpenSettingsModal: () => void;
}) => {
  const { variant: sidebarVariant, setVariant } = useSidebar();
  const navigate = useNavigate();
  const { data: workspaces = [], isPending } = useFindUserWorkspacesQuery();

  const { data: authData, isLoading } = useAuthQuery();
  const userPermissions = authData?.role?.permissions || [];

  const filteredNavItems = navItems.filter((item) => {
    if (!item.requiredPermission) return true;
    return userPermissions.includes(item.requiredPermission);
  });

  const filteredMyNavItems = myNavItems.filter((item) => {
    if (!item.requiredPermission) return true;

    if (Array.isArray(item.requiredPermission)) {
      return item.requiredPermission.some((perm) => userPermissions.includes(perm));
    }

    return userPermissions.includes(item.requiredPermission);
  });

  const toggleVariant = () => {
    const newVariant = sidebarVariant === "compact" ? "full" : "compact";
    setVariant(newVariant);
  };

  return (
    <motion.div
      variants={animation.pageFadePremium}
      initial="init"
      animate="visible"
      exit="exit"
      style={{
        // background: "linear-gradient(to bottom, var(--sidebar), var(--sidebar)/95%)",
        boxShadow: "var(--sidebar-shadow)",
      }}
      className={cn(
        "flex flex-col backdrop-blur-sm transition-all duration-300 bg-gradient-to-br from-muted/60 to-card/60",
        sidebarVariant === "compact" ? "w-20" : "w-[260px]",
      )}
    >
      <div className="px-5 pt-3 pb-1 ">
        <CurrentUserAvatarDropdown
          compact={false}
          onOpenSettings={onOpenSettingsModal}
          onJoinWorkspace={() => console.log("Join workspace")}
        />
      </div>

      <ScrollArea className="flex-1 py-2 ">
        <SidebarNav
          items={filteredNavItems}
          isCollapsed={sidebarVariant === "compact"}
          className={cn(sidebarVariant === "compact" && "items-center space-y-2 ")}
          currentWorkspace={currentWorkspace}
        />
        <SidebarMyNav items={filteredMyNavItems} isCollapsed={sidebarVariant === "compact"} />
      </ScrollArea>

      {sidebarVariant === "compact" ? (
        <DropdownMenu>
          <DropdownMenuTrigger className=" mx-auto" asChild>
            <MoreHorizontal className="w-7 h-7 mb-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52" side="right" align="end">
            <DropdownMenuGroup className="space-y-2">
              <DropdownMenuItem className="cursor-pointer" onClick={onOpenChangeLogModal}>
                <HelpCircle />
                Informacje
              </DropdownMenuItem>
              <Separator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/reports")}>
                <MailQuestionMark />
                Zgłoszenia
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center pb-1 pt-2 mt-auto text-xs text-muted-foreground border-t justify-evenly gap-2.5">
          <Button
            onClick={onOpenChangeLogModal}
            size="sm"
            variant="ghost"
            className="flex flex-1 hover:bg-transparent text-xs font-medium "
          >
            <HelpCircle />
            Info.
          </Button>
          <Separator orientation="vertical" />

          <Button
            onClick={() => navigate("/reports")}
            size="sm"
            variant="ghost"
            className="flex flex-1 hover:bg-transparent text-sm font-medium"
          >
            <MailQuestionMark />
            zgłosz.
          </Button>
        </div>
      )}
    </motion.div>
  );
};

// USER SDIEBAR

export const SidebarUser = () => {
  const { data: authData } = useAuthQuery();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center p-4 border-b border-border/50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-full hover:bg-sidebar-hover transition-colors p-1">
            <Avatar className="w-10 h-10">
              {authData?.avatar ? (
                <AvatarImage src={authData.avatar} />
              ) : (
                <AvatarFallback>{authData?.email?.[0].toUpperCase() || "U"}</AvatarFallback>
              )}
            </Avatar>
            <span className="text-sm font-medium">{authData?.email}</span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" side="right" align="end">
          <DropdownMenuLabel className="text-xs text-muted-foreground">Konto</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigate("/profile")}>Profil</DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/settings")}>Ustawienia</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => console.log("Wyloguj")}>Wyloguj</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
