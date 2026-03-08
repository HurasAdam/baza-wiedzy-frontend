import { useEffect, useState } from "react";
import { useFindChangelogQuery } from "../../hooks/changelog/use-changelog";
import { Card, CardContent, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface ChangeLogEntry {
  version: string;
  date: string;
  changes: {
    added: string[];
    improved: string[];
    fixed: string[];
  };
  type: "major" | "minor" | "patch";
}

interface ChangeLogModalProps {
  isChangeLogModalOpen: boolean;
  setIsChangeLogModalOpen: (isOpen: boolean) => void;
}

export const ChangeLogModal = ({ isChangeLogModalOpen, setIsChangeLogModalOpen }: ChangeLogModalProps) => {
  const { data: changelog, isLoading } = useFindChangelogQuery();
  const [activeVersion, setActiveVersion] = useState<string | null>(null);

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

  const renderSection = (title: string, icon: string, items: string[], color: string) => (
    <div className="flex flex-col gap-2 mb-9">
      <div className="flex items-center mb-2">
        <span className={`mr-2 text-xs`} style={{ color }}>
          {icon}
        </span>
        <h4 className="text-sm font-semibold uppercase tracking-wide">{title}</h4>
      </div>
      <ul className="list-disc list-inside space-y-2 max-w-2xl text-sm break-words whitespace-pre-wrap leading-relaxed">
        {items.map((c, idx) => (
          <li className="text-sm" key={idx}>
            {c}
          </li>
        ))}
      </ul>
    </div>
  );

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
              <aside className="min-w-[22%] h-full border-r bg-sidebar px-3 py-4 space-y-2 overflow-y-auto scrollbar-custom">
                {changelog
                  .slice()

                  .map(({ version, date, type }) => {
                    const isActive = activeVersion === version;
                    return (
                      <button
                        key={version}
                        onClick={() => setActiveVersion(version)}
                        className={`flex items-center gap-0.5 w-full px-3 py-2 rounded-md text-sm text-left transition-colors ${
                          isActive
                            ? "bg-accent text-accent-foreground shadow-sm"
                            : "hover:bg-muted text-muted-foreground"
                        }`}
                      >
                        {" "}
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${
                            type === "major" ? "bg-green-500" : type === "minor" ? "bg-amber-500" : "bg-gray-400"
                          }`}
                        ></span>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium">v{version}</span>
                          <span className="text-xs opacity-75">{date}</span>
                        </div>
                      </button>
                    );
                  })}
              </aside>

              <section className="w-full  py-6 px-12 overflow-y-auto h-full scrollbar-custom flex">
                <div className="max-w-3xl w-full  space-y-6">
                  {activeEntry ? (
                    <>
                      <CardTitle className="mb-2">Wersja {activeEntry.version}</CardTitle>
                      <p className="text-sm text-muted-foreground mb-4">Data wydania: {activeEntry.date}</p>
                      {activeEntry.changes.added.length > 0 &&
                        renderSection("Dodano", "➕", activeEntry.changes.added, "#2563EB")}{" "}
                      {activeEntry.changes.improved.length > 0 &&
                        renderSection("Ulepszono", "⚡", activeEntry.changes.improved, "#D97706")}{" "}
                      {activeEntry.changes.fixed.length > 0 &&
                        renderSection("Naprawiono", "✅", activeEntry.changes.fixed, "#16A34A")}{" "}
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">Brak danych dla tej wersji.</p>
                  )}
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
