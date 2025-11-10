import { Folders } from "lucide-react";

const ManageFoldersHeader = () => {
  return (
    <header className="w-full max-w-7xl px-2 mx-auto flex items-center gap-4 ">
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary shadow-sm">
        <Folders className="w-6 h-6" />
      </div>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Zarządzanie folderami</h1>
        <p className="text-sm text-muted-foreground">Przeglądaj, edytuj lub dodawaj foldery w tym workspace.</p>
      </div>
    </header>
  );
};

export default ManageFoldersHeader;
