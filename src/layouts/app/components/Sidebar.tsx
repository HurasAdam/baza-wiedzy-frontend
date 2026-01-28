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
  MailQuestionMark,
  MoreHorizontal,
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
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

import { Separator } from "../../../components/ui/separator";
import { useFindUserWorkspacesQuery } from "../../../hooks/workspace/use-workspace";
import { useSidebar } from "../../../providers/sidebar-provider";
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
  { title: "Rejestr tematów", href: "/register-topic", icon: Clipboard },
  // { title: "Moje wpisy", href: `/my-entries`, icon: UserRoundPen, requiredPermission: "ADD_ARTICLE" },
  { title: "FAQ", href: "/faq", icon: BookOpen },
  {
    title: "Statystyki",
    href: `/statistics`,
    icon: ChartColumnDecreasing,
    requiredPermission: "VIEW_USER_STATS",
  },
  { title: "Szkoły JST", href: `/jst-projects`, icon: School },
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
  currentWorkspace,
  onOpenChangeLogModal,
}: {
  currentWorkspace?: Workspace | null;
  onOpenChangeLogModal: () => void;
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
    <div
      style={{
        background: "var(--sidebar)",
        boxShadow: "var(--sidebar-shadow)",
      }}
      className={cn(
        "flex flex-col  border-r-sidebar-border transition-all duration-300",
        sidebarVariant === "compact" ? "w-22 md:w[80px]" : "w-16 md:w-[240px] border-sidebar-border",
      )}
    >
      {/* <div className="flex h-14 items-center border-b px-4 mb-1.5 gap-2 ">
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

        {sidebarVariant !== "compact" && (
          <span className="font-semibold text-lg hidden md:block text-sidebar-foreground">Baza wiedzy</span>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="ml-auto hidden md:block hover:bg-transparent"
          onClick={toggleVariant}
        >
          {sidebarVariant === "compact" ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
        </Button>
      </div> */}

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
    </div>
  );
};
