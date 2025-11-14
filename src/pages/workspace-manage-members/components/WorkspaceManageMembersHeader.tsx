import { Users } from "lucide-react";
import { Button } from "../../../components/ui/button";

const WorkspaceManageMembersHeader = () => (
  <header className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <Users className="w-6 h-6 text-muted-foreground" />
      <h1 className="text-2xl font-semibold tracking-tight">Użytkownicy dodani do kolekcji</h1>
    </div>
    <Button>Dodaj członka</Button>
  </header>
);

export default WorkspaceManageMembersHeader;
