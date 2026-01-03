import { Bell, Bug, ChevronDown, Layers, LogOut, Plus, PlusCircle, Settings, Shield, User } from "lucide-react";

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
import { useFindMyNotificationsQuery } from "@/hooks/notifications/use-notifications";
import { useSound } from "@/providers/sound-provider";
import { getAvatarFallbackText } from "@/utils/avatar";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
  const { data: notificationsData } = useFindMyNotificationsQuery();
  const unreadCount = notificationsData?.unreadCount || 0;
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
      requiredPermissions: null,
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
      icon: <User />,
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
    <div className="bg-muted/30 backdrop-blur-sm  sticky top-0 z-50 ">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-16">
        {/* Left: Only Problem Report */}
        <div className="flex items-center gap-3">
          {userPermissions.includes("SEND_REPORT") && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-background/10 bg-background/20 group"
                  onClick={onOpenCreateIssueReport}
                >
                  <Bug className="w-5 h-5 text-muted-foreground group-hover:text-destructive/60" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-sm rounded-md px-2 py-1 shadow-md bg-muted">Zgłoś problem</TooltipContent>
            </Tooltip>
          )}
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
              <TooltipContent className="bg-muted">Dodaj artykuł</TooltipContent>
            </Tooltip>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="secondary" className="transition-transform hover:scale-105">
                <Layers className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="shadow-lg rounded-xl">
              <DropdownMenuLabel>Kolekcje</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {workspaces.map((ws) => (
                  <DropdownMenuItem key={ws._id}>
                    {ws.color && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ws.color }} />}
                    <span className="ml-2">{ws.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuItem onClick={onCreateWorkspace}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Dodaj kolekcję
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {userPermissions.includes("ACCESS_ADMIN_PANEL") && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => navigate("/admin")}
              className=" transition-transform hover:scale-105"
            >
              <Shield className="w-5 h-5" />
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
