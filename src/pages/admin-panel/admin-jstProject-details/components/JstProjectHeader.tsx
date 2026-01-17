import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface JstProjectHeaderProps {
  project?: { name: string; createdAt: string };
  isLoading: boolean;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function JstProjectHeader({ project, isLoading }: JstProjectHeaderProps) {
  const navigate = useNavigate();

  return (
    <Card className="border bg-background">
      <CardHeader className="space-y-2">
        {isLoading ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-md bg-muted/50 animate-pulse" />
                <div className="h-8 bg-muted/50 rounded-md w-[240px] animate-pulse" />
              </div>
              <div className="h-6 w-[96px] bg-muted/50 rounded-md animate-pulse" />
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-4 h-4 bg-muted/50 rounded animate-pulse" />
              <div className="h-4 bg-muted/50 rounded w-[140px] animate-pulse" />
            </div>
          </div>
        ) : (
          <>
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
              Dodano {formatDate(project!.createdAt)}
            </div>
          </>
        )}
      </CardHeader>
    </Card>
  );
}
