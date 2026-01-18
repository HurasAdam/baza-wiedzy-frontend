import { useEffect, useState } from "react";
import { useFindChangelogQuery } from "../../hooks/changelog/use-changelog";
import { Card, CardContent, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface ChangeLogEntry {
  version: string;
  date: string;
  changes: string[];
}

interface ChangeLogModalProps {
  isChangeLogModalOpen: boolean;
  setIsChangeLogModalOpen: (isOpen: boolean) => void;
}

export const ChangeLogModal = ({ isChangeLogModalOpen, setIsChangeLogModalOpen }: ChangeLogModalProps) => {
  const { data: changelog, isLoading } = useFindChangelogQuery();
  const [activeVersion, setActiveVersion] = useState<string | null>(null);

  // ustawiamy pierwszą wersję jako aktywną po załadowaniu danych
  useEffect(() => {
    if (changelog && changelog.length > 0) {
      setActiveVersion(changelog[0].version);
    }
  }, [changelog]);

  if (isLoading || !changelog) {
    return (
      <Dialog open={isChangeLogModalOpen} onOpenChange={setIsChangeLogModalOpen} modal>
        <DialogContent className="max-h-[83vh] min-h-[83vh] min-w-[88vw] md:min-w-[75vw] xl:min-w-[62vw] flex flex-col p-0 gap-0">
          <p>Ładowanie historii zmian...</p>
        </DialogContent>
      </Dialog>
    );
  }

  const activeEntry = changelog.find((e) => e.version === activeVersion);

  return (
    <Dialog open={isChangeLogModalOpen} onOpenChange={setIsChangeLogModalOpen} modal>
      <DialogContent className="max-h-[83vh] min-h-[83vh] min-w-[88vw] md:min-w-[75vw] xl:min-w-[62vw] flex flex-col p-0 gap-0">
        {/* HEADER */}
        <DialogHeader className="flex-shrink-0 border-b py-3 px-4">
          <DialogTitle className="text-lg font-semibold">BW Historia zmian</DialogTitle>
        </DialogHeader>

        {/* MAIN */}
        <div className="flex-grow flex overflow-hidden">
          <Card className="flex flex-grow flex-col w-full overflow-hidden border-none rounded-none p-0 bg-background">
            <CardContent className="flex flex-grow h-full p-0 overflow-hidden">
              {/* SIDEBAR (wersje) */}
              <aside className="w-[23%] h-full border-r bg-sidebar px-3 py-4 space-y-2 overflow-y-auto scrollbar-custom">
                {changelog.map(({ version, date }) => {
                  const isActive = activeVersion === version;
                  return (
                    <button
                      key={version}
                      onClick={() => setActiveVersion(version)}
                      className={`flex flex-col w-full px-3 py-2 rounded-md text-sm text-left transition-colors ${
                        isActive ? "bg-accent text-accent-foreground shadow-sm" : "hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      <span className="font-medium">v{version}</span>
                      <span className="text-xs opacity-75">{date}</span>
                    </button>
                  );
                })}
              </aside>

              <section className="w-full py-6 px-7 overflow-y-auto h-full scrollbar-custom">
                {activeEntry ? (
                  <div>
                    <CardTitle className="mb-4">Wersja {activeEntry.version}</CardTitle>
                    <p className="text-sm text-muted-foreground mb-4">Data wydania: {activeEntry.date}</p>
                    <ul className="list-disc list-inside space-y-2">
                      {activeEntry.changes.map((change, idx) => (
                        <li key={idx} className="text-sm">
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Brak danych dla tej wersji.</p>
                )}
              </section>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
