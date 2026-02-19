import {
  Bell,
  Bug,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  FolderPlus,
  Layers,
  Link,
  Loader,
  LogOut,
  Origami,
  Plus,
  PlusCircle,
  Settings,
  ShieldUser,
  SquarePlus,
} from "lucide-react";

import { Dropdown } from "@/components/Dropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import queryClient from "@/config/query.client";
import { useAuthQuery, useLogoutMutation } from "@/hooks/auth/use-auth";
import { useFindMySummaryNotificationsQuery } from "@/hooks/notifications/use-notifications";
import { useSound } from "@/providers/sound-provider";
import { getAvatarFallbackText } from "@/utils/avatar";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { WORKSPACE_ICONS } from "../../../components/workspace/workspace-form";
import { useFindUserWorkspacesQuery } from "../../../hooks/workspace/use-workspace";
import { useSidebar } from "../../../providers/sidebar-provider";

const backendBase = import.meta.env.VITE_BACKEND_BASE_URL ?? "http://localhost:5000";

interface HeaderProps {
  onCreateWorkspace: () => void;
  onOpenCreateIssueReport: () => void;
  onOpenIssueReportsModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenNotificationsPanel: () => void;
  onOpenWorkspaceInviteModal: () => void;
}

const workspaces = [];

const Header = ({
  onOpenSettingsModal,
  onCreateWorkspace,
  onOpenCreateIssueReport,
  onOpenIssueReportsModal,
  onOpenNotificationsPanel,
  onOpenWorkspaceInviteModal,
}: HeaderProps) => {
  const { data: summaryNotificationsData } = useFindMySummaryNotificationsQuery();
  const { data: workspaces = [], isPending } = useFindUserWorkspacesQuery();
  const { variant: sidebarVariant, setVariant } = useSidebar();
  const unreadCount = summaryNotificationsData?.unreadCount || 0;
  const { data: user } = useAuthQuery();
  const { soundEnabled } = useSound();
  const initials = getAvatarFallbackText(user?.name);
  const navigate = useNavigate();
  const userPermissions = user?.role?.permissions || [];

  const avatarUrl = user.profilePicture?.path
    ? `${backendBase}${user.profilePicture.path.replace(/^\/app/, "")}`
    : null;

  const { mutate } = useLogoutMutation();

  const onLogout = () => {
    mutate(undefined, {
      onSuccess: () => {
        queryClient.clear();
        navigate("/auth/login", { replace: true });
        if (soundEnabled) new Audio("/logout-sound.m4a").play().catch(() => {});
        toast.success("Zostałeś pomyślnie wylogowany", { position: "bottom-right" });
      },
      onError: () => toast.error("Wystąpił błąd. Spróbuj ponownie"),
    });
  };

  const toggleVariant = () => {
    const newVariant = sidebarVariant === "compact" ? "full" : "compact";
    setVariant(newVariant);
  };

  const profileMenuOptions = [
    {
      label: (
        <div>
          <div className="flex items-center gap-3 pb-2">
            <Avatar>
              <AvatarImage src={avatarUrl} alt="Avatar" crossOrigin="anonymous" />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Separator />
        </div>
      ),
      icon: <></>,
      actionHandler: () => {},
      requiredPermissions: null,
    },
    {
      label: "Dołącz do kolekcji",
      icon: <PlusCircle />,
      requiredPermissions: ["JOIN_COLLECTION"],
      actionHandler: onOpenWorkspaceInviteModal,
    },
    {
      label: "Ustawienia",
      icon: <Settings />,
      requiredPermissions: null,
      actionHandler: onOpenSettingsModal,
    },
    {
      label: "Panel admina",
      icon: <ShieldUser />,
      requiredPermissions: ["ACCESS_ADMIN_PANEL"],
      actionHandler: () => navigate("/admin"),
    },

    {
      label: "Wyloguj się",
      icon: <LogOut />,
      requiredPermissions: null,
      actionHandler: onLogout,
    },
  ];

  const filteredProfileOptions = profileMenuOptions.filter((option) => {
    if (!option.requiredPermissions) return true;
    return option.requiredPermissions.some((perm) => userPermissions.includes(perm));
  });

  return (
    <div className="bg-sidebar border-b border-border/65 backdrop-blur-sm  sticky top-0 z-50">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:pr-16">
        <div className="flex h-14 items-center  mb-1.5 gap-3 ">
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
                  </DropdownMenuItem>
                ))
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={onCreateWorkspace} className="gap-2 p-2 cursor-pointer">
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
        </div>

        {/* Right: Primary Actions + Notifications + Profile */}
        <div className="flex items-center gap-3">
          {userPermissions.includes("ADD_ARTICLE") && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => navigate("articles/new")}
                  className="transition-transform hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-xs">Dodaj artykuł</TooltipContent>
            </Tooltip>
          )}

          {(userPermissions.includes("ADD_COLLECTION") || userPermissions.includes("JOIN_COLLECTION")) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="secondary" className="transition-transform hover:scale-105">
                  <FolderPlus className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="shadow-lg rounded-xl">
                <DropdownMenuLabel>Kolekcje</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {userPermissions.includes("ADD_COLLECTION") && (
                  <DropdownMenuItem onClick={onCreateWorkspace}>
                    <SquarePlus className="w-4 h-4 mr-2" />
                    Dodaj kolekcję
                  </DropdownMenuItem>
                )}

                {userPermissions.includes("JOIN_COLLECTION") && (
                  <DropdownMenuItem onClick={onOpenWorkspaceInviteModal}>
                    <Link className="w-4 h-4 mr-2" />
                    Dołącz do kolekcji
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {userPermissions.includes("SEND_REPORT") && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="icon" className="" onClick={onOpenCreateIssueReport}>
                  <Bug className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-xs">Zgłoś problem</TooltipContent>
            </Tooltip>
          )}
          {userPermissions.includes("ACCESS_ADMIN_PANEL") && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => navigate("/admin")}
              className=" transition-transform hover:scale-105"
            >
              <ShieldUser className="w-5 h-5" />
            </Button>
          )}

          <Button
            size="icon"
            variant="ghost"
            onClick={onOpenSettingsModal}
            className=" transition-transform hover:scale-105"
          >
            <Settings className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={onOpenNotificationsPanel}
            className="relative transition-transform hover:scale-105"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                size="sm"
                className="absolute -top-1 -right-1 animate-pulse bg-gradient-to-tr from-red-500 to-pink-500 text-white shadow-lg"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>

          <Dropdown
            position={{ align: "end", side: "bottom", sideOffset: 7 }}
            options={filteredProfileOptions}
            triggerBtn={
              <div className="flex items-center gap-2 rounded-full px-2 py-1 bg-muted/90 hover:bg-muted cursor-pointer">
                <Avatar className="h-8.5 w-8.5">
                  <AvatarImage src={avatarUrl ?? undefined} alt={user?.name ?? "Avatar"} crossOrigin="anonymous" />
                  <AvatarFallback className="text-base font-sembibold bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
