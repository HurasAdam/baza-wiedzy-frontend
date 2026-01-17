import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useFindJstProjectQuery } from "../../../hooks/jst-projects/use-jst-projects";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function JstProjectDetailsLayout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: project } = useFindJstProjectQuery(id!);

  const activeTab = pathname.endsWith("/schools") ? "schools" : "details";

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Card className="border bg-background">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/admin/manage-jstprojects")}
                className="flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="Wróć"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-semibold tracking-tight">{project?.name}</h1>
            </div>
            <Badge variant="secondary">Projekt JST</Badge>
          </div>
          <div className="flex items-center text-sm text-muted-foreground gap-2">
            <CalendarDays className="w-4 h-4" />
            Dodano {formatDate(project?.createdAt)}
          </div>
        </CardHeader>
      </Card>

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
