import { useState } from "react";
import { Settings, Palette, User, Bell } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Card, CardContent, CardTitle } from "../ui/card";
import clsx from "clsx";

interface SettingsModalProps {
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (isSettingsModalOpen: boolean) => void;
  closeOnOutsideClick?: boolean;
}

const tabs = [
  { key: "account", label: "Konto", icon: User },
  { key: "theme", label: "Motyw", icon: Palette },
  { key: "notifications", label: "Powiadomienia", icon: Bell },
];

export const SettingsModal = ({
  isSettingsModalOpen,
  setIsSettingsModalOpen,
  closeOnOutsideClick = false,
}: SettingsModalProps) => {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <Dialog
      open={isSettingsModalOpen}
      onOpenChange={setIsSettingsModalOpen}
      modal
    >
      <DialogContent
        {...(!closeOnOutsideClick
          ? { onInteractOutside: (e) => e.preventDefault() }
          : {})}
        className="max-h-[83vh] min-h-[83vh] min-w-[88vw] md:min-w-[75vw] xl:min-w-[62vw] flex flex-col p-0 gap-0"
      >
        {/* HEADER */}
        <DialogHeader className="flex-shrink-0  border-b py-3 px-4">
          <DialogTitle className="text-lg font-semibold flex gap-1 items-center">
            <Settings size="22" />
            Ustawienia
          </DialogTitle>
        </DialogHeader>

        {/* MAIN */}
        <div className="flex-grow flex overflow-hidden scrollbar-custom">
          <Card className="flex flex-grow flex-col w-full overflow-hidden border-none rounded-none p-0 bg-background">
            <CardContent className="flex flex-grow h-full p-0 overflow-hidden">
              {/* SIDEBAR */}
              <aside className="w-[23%] h-full border-r bg-sidebar px-3 py-4 space-y-2">
                {tabs.map(({ key, label, icon: Icon }) => {
                  const isActive = activeTab === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={clsx(
                        "flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive
                          ? "bg-accent text-accent-foreground shadow-sm"
                          : "hover:bg-muted text-muted-foreground"
                      )}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {label}
                    </button>
                  );
                })}
              </aside>

              {/* CONTENT */}
              <section className="w-full py-6 px-7 overflow-y-auto h-full scrollbar-custom">
                {activeTab === "general" && (
                  <div>
                    <CardTitle className="mb-4">Ustawienia ogólne</CardTitle>
                    {Array(30)
                      .fill(null)
                      .map((_, i) => (
                        <p
                          key={i}
                          className="mb-2 text-sm text-muted-foreground"
                        >
                          Pole {i + 1}
                        </p>
                      ))}
                  </div>
                )}
                {activeTab === "account" && (
                  <div>
                    <CardTitle className="mb-4">Konto</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Zarządzanie danymi konta...
                    </p>
                  </div>
                )}
                {activeTab === "theme" && (
                  <div>
                    <CardTitle className="mb-4">Motyw</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Ustawienia wyglądu, kolory, tryb ciemny...
                    </p>
                  </div>
                )}
                {activeTab === "notifications" && (
                  <div>
                    <CardTitle className="mb-4">Powiadomienia</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Zarządzaj ustawieniami powiadomień.
                    </p>
                  </div>
                )}
              </section>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
