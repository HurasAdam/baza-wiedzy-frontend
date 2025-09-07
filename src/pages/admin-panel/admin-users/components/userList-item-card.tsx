import { Dropdown } from "@/components/Dropdown";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertTriangle, CircleCheckBig, CircleX, Clock, Crown, Ellipsis, EyeIcon, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";

interface DropdownOption {
  label: string;
  icon: React.ReactNode;
  actionHandler: () => void;
}

interface UserRole {
  name: string;
  _id: string;
}

export interface IUser {
  is2FAEnabled: boolean;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin: string | null;
  mustChangePassword: boolean;
  name: string;
  surname: string;
  role: UserRole;
  profilePicture: { path: string; mimeType?: string } | null;
  __v?: number;
  _id: string;
}

interface UserListItemCardProps {
  user: IUser;
  onRequestResetPassword: (user: IUser) => void;
  onRequestAccountStatustoggle: (user: IUser) => void;
}

const backendBase = import.meta.env.VITE_BACKEND_BASE_URL ?? "http://localhost:5000";

const UserListItemCard = ({ user, onRequestResetPassword, onRequestAccountStatustoggle }: UserListItemCardProps) => {
  const navigate = useNavigate();

  const getUserDropdownOptions = (): DropdownOption[] => [
    {
      label: "Wyświetl szczegóły",
      icon: <EyeIcon className="w-4 h-4 hover:text-admin-sidebar-primary-foreground" />,
      actionHandler: () => navigate(`/admin/manage-users/${user._id}`),
    },
    {
      label: "Zresetuj hasło",
      icon: <KeyRound className="w-4 h-4 hover:text-admin-sidebar-primary-foreground" />,
      actionHandler: () => onRequestResetPassword(user),
    },
    {
      label: user.isActive ? "Wyłącz konto" : "Włącz konto",
      icon: user.isActive ? (
        <CircleX className="w-4 h-4 text-destructive" />
      ) : (
        <CircleCheckBig className="w-4 h-4 text-green-600" />
      ),
      actionHandler: () => onRequestAccountStatustoggle(user),
    },
  ];

  const dropdownOptions = getUserDropdownOptions();

  const formatLastLogin = (date: string | null) => {
    if (!date) return "Brak logowania";
    return new Date(date).toLocaleString("pl-PL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const avatarUrl = user.profilePicture?.path
    ? `${backendBase}${user.profilePicture.path.replace(/^\/app/, "")}`
    : null;

  const getAvatarContent = () => {
    const initials = (user.name?.charAt(0) || "") + (user.surname?.charAt(0) || "U");

    if (user.profilePicture?.path) {
      if (user.profilePicture.mimeType === "image/svg+xml") {
        return (
          <object
            data={`${backendBase}${user.profilePicture.path.replace(/^\/app/, "")}`}
            type="image/svg+xml"
            className="w-full h-full"
          >
            <span className="flex items-center justify-center w-full h-full text-white font-semibold">{initials}</span>
          </object>
        );
      }

      return (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="w-full h-full object-cover rounded-md"
          crossOrigin="anonymous"
          onError={(e) => {
            console.warn("Avatar load failed, fallback to initials");
            (e.currentTarget as HTMLImageElement).remove();
          }}
        />
      );
    }

    if (user.role.name === "ADMIN") return <Crown className="w-6 h-6 text-foreground" />;

    return <span className="flex items-center justify-center w-full h-full text-white font-semibold">{initials}</span>;
  };

  return (
    <li
      key={user._id}
      className={`flex items-start gap-4 border-l-2 pl-4 ${user.isActive ? "border-green-500" : "border-border"}`}
    >
      {/* Avatar */}
      <Avatar className="w-18 h-18 rounded-md">
        <AvatarImage className="object-cover" src={avatarUrl} alt="Avatar" crossOrigin="anonymous" />

        <AvatarFallback className="bg-muted text-foreground w-18 h-18 rounded-md">
          {(user.name?.[0] || "") + (user.surname?.[0] || "U")}
        </AvatarFallback>
      </Avatar>

      {/* Card */}
      <div className="flex-1 bg-card p-4 rounded-2xl shadow hover:shadow-lg transition">
        <div className="flex justify-between items-start mb-1">
          <div className="flex flex-col">
            <div className="text-sm font-medium text-foreground space-x-1.5 flex items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Clock className="w-4 h-4 text-muted-foreground cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent className="text-sm">
                    <p>
                      <span className="font-semibold">Ostatnie logowanie:</span> {formatLastLogin(user.lastLogin)}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span>{user.name}</span>
              <span>{user.surname}</span>
            </div>
            <span className="mt-1 text-xs text-muted-foreground">{user.role.name}</span>
          </div>

          <div className="flex items-center space-x-16">
            <div className="flex items-center gap-4">
              {user.mustChangePassword && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertTriangle className="w-4 h-4 text-primary/90 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent className="text-sm">
                      <p>Wymagana zmiana hasła</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            {/* Dropdown */}
            <Dropdown
              withSeparators
              triggerBtn={
                <Button className="cursor-pointer group" variant="ghost" size="icon">
                  <Ellipsis className="text-foreground group-hover:text-admin-sidebar-primary-foreground" />
                </Button>
              }
              options={dropdownOptions}
              position={{ align: "end" }}
            />
          </div>
        </div>
      </div>
    </li>
  );
};

export default UserListItemCard;
