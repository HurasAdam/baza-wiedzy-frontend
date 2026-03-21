import { Button } from "@/components/ui/button";
import { useFindMySummaryNotificationsQuery } from "@/hooks/notifications/use-notifications";
import { Bell, Bug, MailQuestionMark, PanelLeftClose, PanelLeftOpen, Settings, ShieldUser } from "lucide-react";
import { Breadcrumb } from "../../../components/breadcrumb/Breadcrumb";
import { useAuthQuery } from "../../../hooks/auth/use-auth";
import { useSidebar } from "../../../providers/sidebar-provider";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onOpenSettingsModal: () => void;
  onOpenNotificationsPanel: () => void;
  onOpenAdminPanel: () => void;
  onOpenReportsPanel: () => void;
  onOpenCreateIssueReport: () => void;
}

const Header = ({
  title = "Baza artykułów",
  subtitle = "Zarządzaj wszystkimi artykułami",
  onOpenSettingsModal,
  onOpenNotificationsPanel,
  onOpenAdminPanel,
  onOpenReportsPanel,
  onOpenCreateIssueReport,
}: HeaderProps) => {
  const { variant: sidebarVariant, setVariant } = useSidebar();
  const { data } = useFindMySummaryNotificationsQuery();
  const { data: authData, isLoading } = useAuthQuery();
  const userPermissions = authData?.role?.permissions || [];
  const unreadCount = data?.unreadCount || 0;

  const toggleVariant = () => {
    setVariant(sidebarVariant === "compact" ? "full" : "compact");
  };

  return (
    <header className="sticky top-0 z-40 pl-2.5 pr-3.5 py-1  bg-transparent rounded-t-2xl border-b">
      <div className="h-10  flex items-center justify-between ">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleVariant}
            className="hover:bg-transparent hover:text-primary"
          >
            {sidebarVariant === "compact" ? (
              <PanelLeftOpen className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
          </Button>

          <div className="flex flex-col leading-tight">
            <Breadcrumb />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          {userPermissions.includes("ACCESS_ADMIN_PANEL") && (
            <Button onClick={onOpenAdminPanel} size="sm" variant="ghost" className="group hover:bg-muted/40  ">
              <ShieldUser className="group-hover:text-primary" />
            </Button>
          )}

          <Button onClick={onOpenReportsPanel} size="sm" variant="ghost" className="group hover:bg-muted/40  ">
            <MailQuestionMark className="group-hover:text-primary" />
          </Button>

          {userPermissions.includes("ACCESS_ADMIN_PANEL") && (
            <Button onClick={onOpenCreateIssueReport} size="sm" variant="ghost" className="group hover:bg-muted/40  ">
              <Bug className="group-hover:text-destructive" />
            </Button>
          )}
          {/* Notifications */}

          <Button
            size="icon"
            variant="ghost"
            onClick={onOpenSettingsModal}
            className="hover:bg-muted/40 hover:text-foreground group"
          >
            <Settings className="size-4 group-hover:text-primary" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={onOpenNotificationsPanel}
            className="relative hover:bg-muted/40 hover:text-foreground group"
          >
            <Bell className="size-4 group-hover:text-primary" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
