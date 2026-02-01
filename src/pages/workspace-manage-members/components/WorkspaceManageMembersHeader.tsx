import { Users } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../components/ui/tooltip";

const WorkspaceManageMembersHeader = () => (
  <header className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <Users className="w-6 h-6 text-muted-foreground" />
      <h1 className="text-2xl font-semibold tracking-tight">Użytkownicy dodani do kolekcji</h1>
    </div>

    <Tooltip>
      <TooltipTrigger asChild>
        <Button className="opacity-70 cursor-not-allowed">Dodaj członka</Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" align="center">
        Funkcja dostępna wkrótce!
      </TooltipContent>
    </Tooltip>
  </header>
);

export default WorkspaceManageMembersHeader;
