import { Settings } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { Separator } from "../../components/ui/separator";
import WorkspaceForm from "../../components/workspace/workspace-form";

export const WorkspaceManageSettingsPage = () => {
  const { workspace } = useOutletContext();
  return (
    <div className="max-w-5xl mx-auto ">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-muted-foreground" />
          <h1 className="text-2xl font-semibold tracking-tight">Ustawienia modułu</h1>
        </div>
      </header>
      <Separator />
      <WorkspaceForm workspace={workspace} onSubmit={() => {}} />
    </div>
  );
};
