import { createContext, useContext, useEffect, useState } from "react";

export type SidebarTheme = "default" | "gradient" | "glass";
export type SidebarVariant = "full" | "compact";

type SidebarProviderState = {
  sidebarTheme: SidebarTheme;
  variant: SidebarVariant;
  setSidebarTheme: (theme: SidebarTheme) => void;
  setVariant: (variant: SidebarVariant) => void;
};

type SidebarProviderProps = {
  children: React.ReactNode;
  defaultTheme?: SidebarTheme;
  defaultVariant?: SidebarVariant;
  themeStorageKey?: string;
  variantStorageKey?: string;
};

const initialState: SidebarProviderState = {
  sidebarTheme: "default",
  variant: "compact",
  setSidebarTheme: () => null,
  setVariant: () => null,
};

const SidebarContext = createContext<SidebarProviderState>(initialState);

export const SidebarProvider = ({
  children,
  defaultTheme = "default",
  defaultVariant = "full",
  themeStorageKey = "vite-ui-sidebar",
  variantStorageKey = "vite-ui-sidebar-variant",
}: SidebarProviderProps) => {
  const [sidebarTheme, setSidebarTheme] = useState<SidebarTheme>(
    () => (localStorage.getItem(themeStorageKey) as SidebarTheme) || defaultTheme
  );
  const [variant, setVariant] = useState<SidebarVariant>(
    () => (localStorage.getItem(variantStorageKey) as SidebarVariant) || defaultVariant
  );

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-sidebar", sidebarTheme);
    root.setAttribute("data-sidebar-variant", variant);
    localStorage.setItem(themeStorageKey, sidebarTheme);
    localStorage.setItem(variantStorageKey, variant);
  }, [sidebarTheme, variant, themeStorageKey, variantStorageKey]);

  return (
    <SidebarContext.Provider value={{ sidebarTheme, variant, setSidebarTheme, setVariant }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used inside SidebarProvider");
  return context;
};
