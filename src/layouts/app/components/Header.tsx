import {
  Bell,
  ChevronDown,
  LogOut,
  LucideCircleFadingPlus,
  LucidePhone,
  PlusCircle,
  Settings,
  User,
} from "lucide-react";

import { Dropdown } from "@/components/Dropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import queryClient from "@/config/query.client";
import { useAuthQuery, useLogoutMutation } from "@/hooks/auth/use-auth";
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
}

const workspaces = [];
const Header = ({
  onOpenSettingsModal,
  onCreateWorkspace,
  onOpenCreateIssueReport,
  onOpenIssueReportsModal,
}: HeaderProps) => {
  const { data: user } = useAuthQuery();

  const initials = getAvatarFallbackText(user?.name);
  const navigate = useNavigate();

  const avatarUrl = user.profilePicture?.path
    ? `${backendBase}${user.profilePicture.path.replace(/^\/app/, "")}`
    : null;
  console.log("UR", avatarUrl);
  const { mutate, isPending } = useLogoutMutation();

  const onLogout = () => {
    mutate(undefined, {
      onSuccess: () => {
        queryClient.clear();
        navigate("/auth/login", { replace: true });
        toast.success("Zostałeś pomyślnie wylogowany");
      },
      onError: (err) => {
        toast.error("Wystąpił błąd. Spróbuj ponownie");
      },
    });
  };

  const profileMenuOptions = [
    {
      label: (
        <div className="">
          <div className="flex items-center mr-4 pb-2">
            {/* Avatar */}
            <Avatar className="h-9 w-9 ">
              <AvatarImage className="object-cover" src={avatarUrl} alt="Avatar" crossOrigin="anonymous" />
              <AvatarFallback className="text-base font-sembibold bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            {/* User Data */}
            <div className="ml-3 text-left">
              <p className="font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Separator />
        </div>
      ),
      icon: <></>,
      actionHandler: () => {},
    },

    {
      label: "Moje zgłoszenia",
      icon: <User className="hover:text-primary-foreground" />,
      actionHandler: () => onOpenIssueReportsModal(),
    },
    {
      label: "Panel Admina",
      icon: <User className="hover:text-primary-foreground" />,
      actionHandler: () => navigate("/admin"),
    },
    {
      label: "Ustawienia",
      icon: <Settings className="hover:text-primary-foreground" />,
      actionHandler: () => onOpenSettingsModal(),
    },
    {
      label: "Wyloguj się",
      icon: <LogOut className="hover:text-primary-foreground" />,
      actionHandler: () => onLogout(),
    },
  ];

  return (
    <div className="bg-background sticky top-0 z-40 border-b">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button />
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuLabel>Moduł</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              {workspaces.map((ws) => (
                <DropdownMenuItem key={ws._id} onClick={() => onWorkspaceSelected(ws)}>
                  {ws.color && (
                    // <WorkspaceAvatar color={ws.color} name={ws.name} />
                    <div className="border bg-orange-600">OK</div>
                  )}
                  <span className="ml-2">{ws.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            <DropdownMenuGroup>
              <DropdownMenuItem onClick={onCreateWorkspace}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Dodaj Moduł
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2">
          {/* FEEDBACK BUTTON */}
          <Button onClick={onOpenCreateIssueReport} variant="outline" size="sm" className="relative mr-4">
            🐞 Zgłoś problem
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-[10px] px-1 py-0.5 rounded">
              Beta
            </span>
          </Button>
          <Button onClick={() => navigate("articles/new")} className="cursor-pointer" variant="ghost" size="icon">
            <LucideCircleFadingPlus />
          </Button>
          <Button className="cursor-pointer" variant="ghost" size="icon">
            <LucidePhone />
          </Button>

          <Button className="cursor-pointer " variant="ghost" size="icon">
            <Bell />
          </Button>

          <Dropdown
            position={{
              align: "end",
              side: "bottom",
              sideOffset: 7,
              alignOffset: 0,
            }}
            options={profileMenuOptions}
            triggerBtn={
              <div className="rounded-full flex items-center gap-0.5 cursor-pointer bg-muted/90 py-1 px-1.5 hover:bg-muted ml-0.5 ">
                <Avatar className="size-7 ">
                  <AvatarImage className="object-cover" src={avatarUrl} alt={user?.name} crossOrigin="anonymous" />
                  <AvatarFallback className="text-base font-sembibold bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="chevron-icon h-3.5 w-3.5" />
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
