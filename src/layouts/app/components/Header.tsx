import { Button } from "@/components/ui/button";
import { useFindMySummaryNotificationsQuery } from "@/hooks/notifications/use-notifications";
import { Bell, Bug, PanelLeftClose, PanelLeftOpen, Settings } from "lucide-react";
import { Breadcrumb } from "../../../components/breadcrumb/Breadcrumb";
import { useSidebar } from "../../../providers/sidebar-provider";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onOpenSettingsModal: () => void;
  onOpenNotificationsPanel: () => void;
  onOpenChangeLogModal: () => void;
  onOpenCreateIssueReport: () => void;
}

const Header = ({
  title = "Baza artykułów",
  subtitle = "Zarządzaj wszystkimi artykułami",
  onOpenSettingsModal,
  onOpenNotificationsPanel,
  onOpenChangeLogModal,
  onOpenCreateIssueReport,
}: HeaderProps) => {
  const { variant: sidebarVariant, setVariant } = useSidebar();
  const { data } = useFindMySummaryNotificationsQuery();
  const unreadCount = data?.unreadCount || 0;

  const toggleVariant = () => {
    setVariant(sidebarVariant === "compact" ? "full" : "compact");
  };

  return (
    <header className="sticky top-0 z-40 px-2 py-1  bg-transparent rounded-t-2xl border-b">
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
          {/* Notifications */}
          <Button
            size="icon"
            variant="ghost"
            onClick={onOpenNotificationsPanel}
            className="relative hover:bg-muted/40 hover:text-foreground"
          >
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </Button>
          {/* Settings */}

          <Button
            size="icon"
            variant="ghost"
            onClick={onOpenSettingsModal}
            className="hover:bg-muted/40 hover:text-foreground"
          >
            <Settings className="size-4" />
          </Button>
          <Button onClick={onOpenCreateIssueReport} size="sm" variant="ghost" className="group hover:bg-muted/40  ">
            <Bug className="group-hover:text-destructive" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
