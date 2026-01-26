import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavLink, Outlet, useLocation, useParams } from "react-router-dom";
import { useFindJstProjectQuery } from "../../../hooks/jst-projects/use-jst-projects";
import { JstProjectHeader } from "./components/JstProjectHeader";

export function JstProjectDetailsLayout() {
  const { id } = useParams();

  const { pathname } = useLocation();
  const { data: project, isLoading } = useFindJstProjectQuery(id!);

  const activeTab = pathname.endsWith("/schools") ? "schools" : "details";

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-1 space-y-6">
      <JstProjectHeader project={project} isLoading={isLoading} />

      <Tabs value={activeTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger asChild value="details">
            <NavLink to="">Szczegóły</NavLink>
          </TabsTrigger>
          <TabsTrigger asChild value="schools">
            <NavLink to="schools">Lista szkół</NavLink>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Outlet context={{ jstProject: project }} />
    </div>
  );
}
