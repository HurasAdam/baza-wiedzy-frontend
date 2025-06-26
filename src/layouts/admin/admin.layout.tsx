import { LayoutDashboard, Settings, Users } from "lucide-react";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SettingsModal } from "../../components/settings/settings-modal";
import AdminHeader from "./components/AdminHeader";
import { AdminSidebar } from "./components/AdminSidebar";
const adminLinks = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Użytkownicy", href: "/admin/users", icon: Users },
  { title: "Ustawienia", href: "/admin/settings", icon: Settings },
];
const AdminLayout = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapes] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  return (
    <div className="flex h-screen w-full">
      {/* SIDEBAR */}

      <AdminSidebar isCollapsed={isCollapsed} />
      {/* SIDEBAR */}

      <div className="flex flex-1 flex-col h-full">
        {/* HEADER */}
        <AdminHeader onOpenSettingsModal={() => setIsSettingsModalOpen(true)} />
        {/* HEADER */}
        <main className="flex-1 overflow-y-auto h-full w-full bg-background">
          <div className="mx-auto container px-2 sm:px-6 lg:px-8 py-0 md:py-8 w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>

      <SettingsModal
        isSettingsModalOpen={isSettingsModalOpen}
        setIsSettingsModalOpen={setIsSettingsModalOpen}
      />
    </div>
  );
};

export default AdminLayout;
