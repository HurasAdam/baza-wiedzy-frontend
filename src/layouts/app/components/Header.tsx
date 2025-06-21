// import { useAuth } from "@/provider/auth-context";

import { Bell, ChevronDown, PlusCircle, User } from "lucide-react";

import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthQuery } from "@/hooks/auth/use-auth";
import { Separator } from "@/components/ui/separator";
import { Dropdown } from "@/components/Dropdown";
import { getAvatarFallbackText } from "@/utils/avatar";

interface HeaderProps {
  onWorkspaceSelected: (workspace: any) => void;
  selectedWorkspace: {};
  onCreateWorkspace: () => void;
}

const workspaces = [];
const Header = ({
  onWorkspaceSelected,
  setIsCreatingWorkspace,
}: HeaderProps) => {
  const { data: user } = useAuthQuery();

  const initials = getAvatarFallbackText(user?.name);

  const profileMenuOptions = [
    {
      label: (
        <div>
          <div className="flex items-center mr-4 pb-2 hover:bg-transparent">
            {/* Avatar */}
            <Avatar className="h-7.5 w-7.5 bg-primary ">
              <AvatarImage src={user} alt={user?.name} />
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
      label: "Profil",
      icon: <User />,
      actionHandler: () => console.log("profil"),
    },

    {
      label: "Moje zgłoszenia",
      icon: <User />,
      actionHandler: () => {},
    },
    {
      label: "Panel Admina",
      icon: <User />,
      actionHandler: () => {},
    },
    {
      label: "Ustawienia",
      icon: <User />,
      actionHandler: () => setIsCreatingWorkspace(true),
    },
    { label: "Wyloguj się", icon: <User />, actionHandler: () => {} },
  ];

  return (
    <div className="bg-background sticky top-0 z-40 border-b">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button />
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuLabel>Workspace</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              {workspaces.map((ws) => (
                <DropdownMenuItem
                  key={ws._id}
                  onClick={() => onWorkspaceSelected(ws)}
                >
                  {ws.color && (
                    // <WorkspaceAvatar color={ws.color} name={ws.name} />
                    <div className="border bg-orange-600">OK</div>
                  )}
                  <span className="ml-2">{ws.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Workspace
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell />
          </Button>
          <Button variant="ghost" size="icon">
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
              <div className="rounded-full flex items-center gap-0.5 cursor-pointer bg-muted/90 p-1 hover:bg-muted">
                <Avatar className="size-6 bg-primary">
                  <AvatarImage src={user} alt={user?.name} />
                  <AvatarFallback className="text-base font-sembibold bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="chevron-icon h-4 w-4" />
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
