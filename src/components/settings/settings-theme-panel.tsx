import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/providers/theme-provider";
import { Droplet, LayoutDashboard, Palette, Sun } from "lucide-react";
import { useState } from "react";
import { useSidebar, type SidebarTheme } from "../../providers/sidebar-provider";

const themeGroups = {
  light: [
    { key: "light", label: "Aqua", accent: "bg-indigo-500" },
    { key: "light-halloween", label: "Halloween", accent: "bg-orange-600" },
    { key: "light-violet", label: "Violet", accent: "bg-purple-500" },
    { key: "light-amber", label: "Amber", accent: "bg-amber-400" },
  ],
  dark: [
    { key: "dark-aqua", label: "Aqua", accent: "bg-indigo-500" },
    // { key: "dark-aqua-gradient", label: "Aqua-Gradient", accent: "bg-indigo-400" },
    { key: "dark-halloween", label: "Halloween", accent: "bg-orange-600" },
    // { key: "dark-halloween-gradient", label: "Halloween-Gradient", accent: "bg-orange-400" },
    { key: "dark-violet", label: "Violet", accent: "bg-purple-500" },
    { key: "dark-amber", label: "Amber", accent: "bg-amber-400" },
  ],
  deep: [
    { key: "deep-forest", label: "Forest", accent: "bg-green-600" },
    { key: "deep-aqua", label: "Aqua", accent: "bg-blue-600" },
  ],
  // corporate: [
  //   { key: "corporate-default", label: "Gray", accent: "bg-neutral-400/80" },
  //   { key: "corporate-gray", label: "Gray", accent: "bg-neutral-400/80" },
  // ],
};

const Field = ({
  icon: Icon,
  label,
  description,
  children,
}: {
  icon?: React.ElementType;
  label: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center justify-between p-4 rounded-lg border hover:shadow-sm transition bg-input/30">
    <div className="flex items-center gap-3">
      {Icon && <Icon className="w-5 h-5 text-muted-foreground" />}
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {description && <span className="text-xs text-muted-foreground">{description}</span>}
      </div>
    </div>
    <div className="ml-4">{children}</div>
  </div>
);

const SettingsThemePanelTab = () => {
  const { theme, setTheme } = useTheme();
  const { sidebarTheme, setSidebarTheme, variant: sidebarVariant, setVariant } = useSidebar();

  const currentGroup = Object.keys(themeGroups).find((group) =>
    themeGroups[group as keyof typeof themeGroups].some((t) => t.key === theme)
  ) as keyof typeof themeGroups;

  const [selectedGroup, setSelectedGroup] = useState<"light" | "dark" | "deep" | "corporate">(currentGroup || "light");
  const [selectedAccent, setSelectedAccent] = useState<string>(theme);

  return (
    <div className="">
      {/* Wybór trybu */}
      <Card className="border-none shadow-none bg-transparent py-1">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-header-foreground">
            <Palette className="w-5 h-5 text-muted-foreground" />
            Wygląd
          </CardTitle>
          <p className="text-sm text-muted-foreground">Wybierz motyw i wariant akcentu dla aplikacji</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Field icon={Sun} label="Motyw" description="Wybierz jasny lub ciemny tryb">
            <Select
              value={selectedGroup}
              onValueChange={(value) => {
                const group = value as "light" | "dark" | "deep" | "corporate";
                setSelectedGroup(group);
                const defaultTheme = themeGroups[group][0].key;
                setTheme(defaultTheme);
                setSelectedAccent(defaultTheme);
              }}
            >
              <SelectTrigger className="w-48 border-ring text-foreground">
                <SelectValue placeholder="Wybierz tryb" />
              </SelectTrigger>
              <SelectContent>
                {(["light", "dark", "deep"] as const).map((g) => (
                  <SelectItem key={g} value={g}>
                    {g === "light" ? "Jasny" : g === "dark" ? "Ciemny" : g === "deep" ? "Deep" : "Corporate"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </CardContent>
      </Card>

      {/* Wybór akcentu */}
      <Card className="border-none shadow-none bg-transparent py-2">
        <CardContent className="space-y-3">
          <Field icon={Droplet} label="Akcent" description="Wybierz kolor akcentu">
            <Select
              value={selectedAccent}
              onValueChange={(value) => {
                setSelectedAccent(value);
                setTheme(value);
              }}
            >
              <SelectTrigger className="w-48 border-ring text-foreground">
                <SelectValue placeholder="Wybierz akcent" />
              </SelectTrigger>
              <SelectContent>
                {themeGroups[selectedGroup].map((t) => (
                  <SelectItem key={t.key} value={t.key}>
                    <div className="flex items-center gap-2">
                      <span className={`w-4 h-4 rounded-full ${t.accent}`} />
                      <span>{t.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </CardContent>
      </Card>

      {/* Wybór sidebaru */}
      <Card className="border-none shadow-none bg-transparent py-2">
        <CardContent className="space-y-3">
          <Field icon={LayoutDashboard} label="Sidebar" description="Wybierz wygląd paska bocznego">
            <Select
              value={sidebarTheme}
              onValueChange={(value) => {
                setSidebarTheme(value as SidebarTheme);
              }}
            >
              <SelectTrigger className="w-48 border-ring text-foreground">
                <SelectValue placeholder="Wybierz sidebar" />
              </SelectTrigger>
              <SelectContent>
                {selectedGroup === "light" ? (
                  <>
                    <SelectItem value="sidebar-default">Base</SelectItem>
                    <SelectItem value="sidebar-style-1">Gradient-One</SelectItem>
                    <SelectItem value="sidebar-style-2">Gradient-Two</SelectItem>
                    <SelectItem value="sidebar-style-3">Gradient-Three</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="sidebar-default">Base</SelectItem>
                    <SelectItem value="sidebar-style-1">Carbon</SelectItem>
                    <SelectItem value="sidebar-style-2">Gradient</SelectItem>
                    <SelectItem value="sidebar-style-3">CentOS</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </Field>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsThemePanelTab;
