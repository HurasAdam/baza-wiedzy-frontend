import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import queryClient from "@/config/query.client";
import { useAuthQuery, useLogoutMutation } from "@/hooks/auth/use-auth";
import { ChevronDown, LogOut, PlusCircle, Settings, ShieldUser } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const backendBase = import.meta.env.VITE_BACKEND_BASE_URL ?? "http://localhost:5000";

interface CurrentUserDropdownProps {
  onOpenSettings?: () => void;
  onJoinWorkspace?: () => void;
  compact?: boolean; // tylko avatar, bez email
}

export const CurrentUserAvatarDropdown: React.FC<CurrentUserDropdownProps> = ({
  onOpenSettings,
  onJoinWorkspace,
  compact = false,
}) => {
  const { data: user } = useAuthQuery();
  const navigate = useNavigate();
  const { mutate } = useLogoutMutation();

  const avatarUrl = user?.profilePicture?.path
    ? `${backendBase}${user.profilePicture.path.replace(/^\/app/, "")}`
    : null;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  const userPermissions = user?.role?.permissions || [];

  const onLogout = () => {
    mutate(undefined, {
      onSuccess: () => {
        queryClient.clear();
        navigate("/auth/login", { replace: true });
        toast.success("Zostałeś pomyślnie wylogowany", { position: "bottom-right" });
      },
      onError: () => toast.error("Wystąpił błąd. Spróbuj ponownie"),
    });
  };

  const profileMenuOptions = [
    {
      label: (
        <div className="flex flex-col">
          <span className="font-semibold text-base text-foreground truncate">{user?.name}</span>
          <span className="text-sm text-muted-foreground truncate">{user?.email}</span>
        </div>
      ),
      action: () => {},
      icon: null,
    },
    ...(userPermissions.includes("JOIN_COLLECTION")
      ? [
          {
            label: "Dołącz do kolekcji",
            icon: <PlusCircle className="w-4 h-4 text-muted-foreground" />,
            action: onJoinWorkspace,
          },
        ]
      : []),
    {
      label: "Ustawienia",
      icon: <Settings className="w-4 h-4 text-muted-foreground" />,
      action: onOpenSettings,
    },
    ...(userPermissions.includes("ACCESS_ADMIN_PANEL")
      ? [
          {
            label: "Panel admina",
            icon: <ShieldUser className="w-4 h-4 text-muted-foreground" />,
            action: () => navigate("/admin"),
          },
        ]
      : []),
    {
      label: "Wyloguj się",
      icon: <LogOut className="w-4 h-4 text-red-500" />,
      action: onLogout,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-between gap-1  rounded-full  w-full hover:bg-muted/40 transition-all duration-200 p-1">
          <div className="flex items-center gap-4 ">
            <Avatar className="w-12 h-12 shadow-md rounded-xl">
              <AvatarImage src={avatarUrl ?? undefined} />
              <AvatarFallback className="bg-primary/80 text-primary-forground text-base font-sembibold rounded-xl ">
                {initials}
              </AvatarFallback>
            </Avatar>

            {!compact && (
              <>
                <div className="flex flex-col  items-start truncate">
                  <span className="text-sm font-semibold">{user?.name}</span>
                  <span className="text-xs text-muted-foreground truncate">{user?.surname}</span>
                </div>
              </>
            )}
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64 rounded-2xl shadow-xl bg-background border border-border overflow-hidden animate-slide-fade"
        side="bottom"
        align="end"
        sideOffset={6}
      >
        {/* Sekcja Profilowa */}
        <div className="px-5 py-4 bg-muted/5 flex items-center gap-3">
          <Avatar className="w-14 h-14 shadow-sm">
            <AvatarImage src={avatarUrl ?? undefined} />
            <AvatarFallback className="bg-gradient-to-tr from-primary via-muted to-primary/80 text-primary-forground text-xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!compact && (
            <div className="flex flex-col truncate">
              <span className="font-semibold text-base text-foreground truncate">{user?.name}</span>
              <span className="text-sm text-muted-foreground truncate">{user?.email}</span>
            </div>
          )}
        </div>

        <DropdownMenuSeparator />

        {/* Opcje menu */}
        {profileMenuOptions.slice(1).map((option, idx) => (
          <DropdownMenuItem
            key={idx}
            onClick={option.action}
            className="flex items-center gap-3 px-5 py-3 hover:bg-primary/10 rounded-xl transition-colors text-sm font-medium"
          >
            {option.icon && option.icon}
            <span className="truncate">{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
