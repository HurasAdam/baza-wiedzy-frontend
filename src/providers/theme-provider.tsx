import { createContext, useContext, useEffect, useState } from "react";

type Theme =
  | "dark-aqua"
  | "dark-aqua-gradient"
  | "dark-halloween"
  | "dark-halloween-gradient"
  | "light"
  | "dark-violet"
  | "dark-amber"
  | "light-violet"
  | "aqua"
  | "light-halloween"
  | "deep-forest"
  | "deep-aqua"
  | "corporate-default"
  | "corporate-gray";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system" as Theme,
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "dark-violet",
  storageKey = "vite-ui-theme",

  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem(storageKey) as Theme) || defaultTheme);

  useEffect(() => {
    const root = window.document.documentElement;

    // usuń stare klasy theme
    root.classList.remove(
      "light",
      "light-halloween",
      "dark-aqua",
      "dark-aqua-gradient",
      "dark-violet",
      "dark-amber",
      "light-amber",
      "light-violet",
      "aqua",
      "dark-halloween",
      "dark-halloween-gradient",
      "deep-forest",
      "deep-aqua",
      "corporate-default",
      "corporate-gray"
    );

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    // dodaj atrybut sidebarTheme
    // root.setAttribute("data-sidebar", sidebarTheme);
  }, [theme]);

  const value: ThemeProviderState = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
/* eslint-disable react-refresh/only-export-components */
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
