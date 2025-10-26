// import { useAuth } from "@/provider/auth-context";

import { LogOut, LucideCircleFadingPlus, LucidePhone, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import queryClient from "@/config/query.client";
import { useAuthQuery, useLogoutMutation } from "@/hooks/auth/use-auth";
import { getAvatarFallbackText } from "@/utils/avatar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface HeaderProps {
  onOpenSettingsModal: () => void;
}

const AdminHeader = ({ onOpenSettingsModal }: HeaderProps) => {
  const { data: user } = useAuthQuery();

  const initials = getAvatarFallbackText(user?.name);
  const navigate = useNavigate();

  const { mutate, isPending } = useLogoutMutation();

  const onLogout = () => {
    mutate(undefined, {
      onSuccess: () => {
        queryClient.clear();
        navigate("/auth/login", { replace: true });
        toast.success("Zostałeś pomyślnie wylogowany");
      },
      onError: () => {
        toast.error("Wystąpił błąd. Spróbuj ponownie");
      },
    });
  };

  return (
    <div className="bg-background sticky top-0 z-40 border-b">
      <div className="flex h-14 items-center justify-end px-4 sm:px-6 lg:px-8 py-4 gap-6">
        <div className="flex items-center gap-2">
          <Button className="cursor-pointer" variant="ghost" size="icon">
            <LucideCircleFadingPlus />
          </Button>
          <Button className="cursor-pointer" variant="ghost" size="icon">
            <LucidePhone />
          </Button>
          <Button onClick={onOpenSettingsModal} className="cursor-pointer" variant="ghost" size="icon">
            <Settings />
          </Button>
        </div>
        <Button onClick={onLogout} className="cursor-pointer" variant="ghost" size="icon">
          <LogOut />
        </Button>
      </div>
    </div>
  );
};

export default AdminHeader;
