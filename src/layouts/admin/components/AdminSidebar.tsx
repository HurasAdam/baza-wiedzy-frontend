import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Archive,
  BookOpen,
  Box,
  Crown,
  Hash,
  LandPlot,
  LayoutDashboard,
  ListChecks,
  LucideArrowBigLeft,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip";

interface SidebarProps {
  isCollapsed: boolean;
}

const adminLinks = [
  { title: "Start", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Użytkownicy", href: "/admin/manage-users", icon: Users },
  { title: "Administratorzy", href: "/admin/manage-admins", icon: ShieldCheck },
  {
    title: "Role i uprawnienia",
    href: "/admin/manage-roles",
    icon: UserCog,
  },
  { title: "Produkty", href: "/admin/manage-products", icon: Box },
  { title: "Tagi", href: "/admin/manage-tags", icon: Hash },
  { title: "Projekty JST", href: "/admin/manage-jstprojects", icon: LandPlot },
  {
    title: "Lista tematów",
    href: "/admin/manage-registertopics",
    icon: ListChecks,
  },
  {
    title: "Lista FAQ",
    href: "/admin/manage-faqs",
    icon: BookOpen,
  },

  {
    title: "Archiwum art.",
    href: "/admin/articles/archived",
    icon: Archive,
  },
];

export const AdminSidebar = ({ isCollapsed }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside
      className={cn(
        "h-screen bg-admin-sidebar border-r flex flex-col justify-between px-2 pt-2 pb-4 ",
        isCollapsed ? "w-16 md:w-[80px]" : "w-16 md:w-[240px]",
      )}
    >
      <div className="px-3 pb-4 mb-4 border-b border-border text-center">
        {/* ---------SUBTITLE ----- */}
        <div className="">
          <span className="text-[10px] font-semibold text-sidebar-ring tracking-widest uppercase animate-pulse">
            Baza wiedzy
          </span>
        </div>

        {/* ------ MAIN SECTION ------*/}
        <div className="flex items-center justify-center gap-2">
          <div className="p-2 bg-admin-sidebar-logo rounded-lg shadow-inner">
            <Crown className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-admin-sidebar-foreground tracking-tight">Panel Admina</span>
        </div>
      </div>

      {/*-------- NAVIGATION -------- */}
      <nav className="flex-1 space-y-1">
        <TooltipProvider>
          {adminLinks.map(({ title, href, icon: Icon }) => {
            const isActive = location.pathname.startsWith(href);

            return (
              <Tooltip key={href} delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => navigate(href)}
                    variant="ghost"
                    className={cn(
                      "w-full px-3 py-2 text-admin-sidebar-foreground transition border-transparent rounded-none hover:bg-transparent hover:border-l hover:border-admin-sidebar-primary",
                      isCollapsed ? "justify-center" : "justify-start",
                      isActive &&
                        "bg-admin-sidebar-primary hover:bg-admin-sidebar-primary rounded-md  text-admin-sidebar-primary-foreground font-medium border-l-4  border-transparent",
                    )}
                  >
                    <Icon className={cn("w-5 h-5", !isCollapsed && "mr-2")} />
                    {!isCollapsed && <span>{title}</span>}
                  </Button>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">{title}</TooltipContent>}
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>

      {/* -------- FOOTER -------- */}
      <div className="border-t  pt-4 mt-6">
        <Button
          onClick={() => navigate("/dashboard")}
          variant="outline"
          className="cursor-pointer w-full justify-start text-foreground  "
        >
          <LucideArrowBigLeft className="w-5 h-5 mr-0 md:mr-2" />
          {!isCollapsed && <span>Powrót do BW</span>}
        </Button>
      </div>
    </aside>
  );
};
