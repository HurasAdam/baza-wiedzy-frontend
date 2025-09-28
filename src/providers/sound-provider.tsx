import React, { createContext, useContext, useState } from "react";

type SoundProviderState = {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
};

const SoundContext = createContext<SoundProviderState | undefined>(undefined);

export const SoundProvider = ({ children }: { children: React.ReactNode }) => {
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem("soundEnabled");
    return saved === null ? true : saved === "true";
  });

  const setSoundEnabled = (enabled: boolean) => {
    localStorage.setItem("soundEnabled", String(enabled));
    setSoundEnabledState(enabled);
  };

  return <SoundContext.Provider value={{ soundEnabled, setSoundEnabled }}>{children}</SoundContext.Provider>;
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) throw new Error("useSound must be used within a SoundProvider");
  return context;
};
