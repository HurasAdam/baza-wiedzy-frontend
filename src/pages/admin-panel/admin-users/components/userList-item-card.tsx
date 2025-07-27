import { Dropdown } from "@/components/Dropdown";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import queryClient from "@/config/query.client";
import type { UseMutationOptions } from "@tanstack/react-query";
import {
  Ellipsis,
  KeyRound,
  User,
  Clock,
  AlertTriangle,
  CircleCheckBig,
  CircleX,
} from "lucide-react";
import { toast } from "sonner";

interface DropdownOption {
  label: string;
  icon: React.ReactNode;
  actionHandler: () => void;
}

interface UserRole {
  name: string;
  _id: string;
}

interface User {
  is2FAEnabled: boolean;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin: string | null;
  mustChangePassword: boolean;
  name: string;
  surname: string;
  role: UserRole;
  profilePicture: string | null;
  __v?: number;
  _id: string;
}

interface UserListItemCardProps {
  user: User;
  resetUserPasswordMutation: (
    userId: string,
    options?: UseMutationOptions
  ) => void;
}

const UserListItemCard = ({
  user,
  resetUserPasswordMutation,
}: UserListItemCardProps) => {
  const getUserDropdownOptions = (): DropdownOption[] => [
    {
      label: "Zresetuj hasło",
      icon: <KeyRound className="w-4 h-4" />,
      actionHandler: () => {
        resetUserPasswordMutation(user._id, {
          onSuccess: () => {
            toast.success(
              `Hasło użytkownika ${user.name} ${user.surname} zostało zresetowane`
            );
            queryClient.invalidateQueries({ queryKey: ["users"] });
          },
          onError: () => {
            toast.error("Błąd podczas resetowania hasła");
          },
        });
      },
    },
    {
      label: user.isActive ? "Wyłącz konto" : "Włącz konto",
      icon: user.isActive ? (
        <CircleX className="w-4 h-4 text-destructive" />
      ) : (
        <CircleCheckBig className="w-4 h-4 text-green-600" />
      ),
      actionHandler: () => {
        resetUserPasswordMutation(user._id, {
          onSuccess: () => {
            toast.success(
              `Hasło użytkownika ${user.name} ${user.surname} zostało zresetowane`
            );
            queryClient.invalidateQueries({ queryKey: ["users"] });
          },
          onError: () => {
            toast.error("Błąd podczas resetowania hasła");
          },
        });
      },
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

  return (
    <li
      key={user._id}
      className={`flex items-start gap-4 border-l-2 pl-4 ${
        user.isActive ? "border-green-500" : "border-border"
      }`}
    >
      {/* Avatar */}
      <div className="w-16 h-16 rounded-md flex items-center justify-center bg-muted shadow-md">
        <User className="w-6 h-6 text-foreground" />
      </div>

      {/* Card */}
      <div className="flex-1 bg-card p-4 rounded-2xl shadow hover:shadow-lg transition">
        <div className="flex justify-between items-start mb-1">
          <div className="flex flex-col">
            <div className="text-sm font-medium text-foreground space-x-1.5 flex items-center">
              {/* Ikona ostatniego logowania */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Clock className="w-4 h-4 text-muted-foreground cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent className="text-sm">
                    <div className="space-y-1">
                      <p>
                        <span className="font-semibold">
                          Ostatnie logowanie:
                        </span>{" "}
                        {formatLastLogin(user.lastLogin)}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span>{user.name}</span>
              <span>{user.surname}</span>
            </div>

            <span className="mt-1 text-xs text-muted-foreground">
              {user?.role?.name}
            </span>
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
              withSeparators={true}
              triggerBtn={
                <Button className="cursor-pointer" variant="ghost" size="icon">
                  <Ellipsis />
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
