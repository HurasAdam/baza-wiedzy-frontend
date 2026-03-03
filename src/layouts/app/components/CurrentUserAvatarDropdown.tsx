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
  compact?: boolean;
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

  const initials = user ? `${user.name?.[0] ?? ""}${user.surname?.[0] ?? ""}`.toUpperCase() || "U" : "U";

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
        <button className="group flex bg-transparent items-center pr-4 justify-between w-full px-3 py-2 rounded-xl transition-colors duration-200 hover:bg-muted/30 data-[state=open]:bg-muted/40">
          <div className="flex items-center gap-3">
            {/* Avatar z glow – W SIDEBARZE */}
            <div className="relative">
              {/* subtelny glow */}
              <span className="absolute inset-0 rounded-lg bg-primary/20 blur-md opacity-60" />

              <Avatar className="relative w-10 h-10 rounded-lg ring-1 ring-border/40 bg-background">
                <AvatarImage src={avatarUrl ?? undefined} alt={user?.name ?? "Avatar"} crossOrigin="anonymous" />
                <AvatarFallback className="bg-primary/70 text-primary-forground text-sm font-medium rounded-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>

            {!compact && (
              <div className="flex flex-col leading-tight truncate">
                <span className="text-[13px] font-medium tracking-tight">{user?.name}</span>
                <span className="text-[11px] text-muted-foreground/80 truncate">{user?.surname}</span>
              </div>
            )}
          </div>

          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/60 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64 rounded-xl shadow-xl bg-background border border-border overflow-hidden animate-slide-fade"
        side={compact ? "right" : "bottom"}
        align="center"
        sideOffset={6}
      >
        {/* Sekcja Profilowa */}
        <div className="px-5 py-4 bg-muted/5 flex items-center gap-4">
          <Avatar className="w-14 h-14 rounded-lg ring-1 ring-border/40 bg-background">
            <AvatarImage src={avatarUrl ?? undefined} alt={user?.name ?? "Avatar"} crossOrigin="anonymous" />
            <AvatarFallback className="bg-primary/70 rounded-lg text-primary-foreground text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          {!compact && (
            <div className="flex flex-col truncate leading-tight">
              {/* Imię i nazwisko */}
              {/* Email */}
              <span className="text-[12px] text-muted-foreground/80 truncate">{user?.email}</span>
              {/* Rola jako badge */}
              <span className="mt-2 inline-flex w-fit items-center rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                {user?.role?.name}
              </span>
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
