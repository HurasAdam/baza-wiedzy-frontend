import { Lock, Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface ManageFoldersHeaderProps {
  handleAddFolder: () => void;
  permissions: Record<string, boolean>;
}

const ManageFoldersHeader = ({ handleAddFolder, permissions }: ManageFoldersHeaderProps) => {
  return (
    <header className="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 className="text-2xl font-semibold">Zarządzaj folderami</h1>
        <p className="text-sm text-muted-foreground mt-1">Organizuj i zarządzaj folderami w kolekcji</p>
      </div>
      <Button disabled={!permissions.addFolder} onClick={handleAddFolder}>
        {!permissions.addFolder ? <Lock className="mr-1" /> : <Plus className="w-4 h-4 mr-2" />} Nowy folder
      </Button>
    </header>
  );
};

export default ManageFoldersHeader;
