import { Archive, FileText, Link as LinkIcon, Plus, Users } from "lucide-react";
import { useLatestArticles } from "../../hooks/articles/use-articles";

// MOCK DATA
const mockData = {
  myCollections: [
    { id: 1, title: "Szablony GSMN", icon: Archive },
    { id: 2, title: "Pisma", icon: Users },
    { id: 3, title: "Procedury Admina", icon: Archive },
    { id: 4, title: "Projekt L", icon: Users },
    { id: 5, title: "Szablony MD", icon: Archive },
    { id: 6, title: "Dokumentacja Onboardingu", icon: Users },
    { id: 7, title: "Procedury Admina", icon: Archive },
    { id: 8, title: "Projekt L", icon: Users },
  ],
  quickLinks: [
    { label: "Procedura przywracania kont", url: "https://jira.example.com" },
    { label: "Monitorki", url: "https://jira.example.com" },
    { label: "FAQ-Akademia L", url: "https://jira.example.com" },
  ],
  recentArticles: [
    { id: 1, title: "Reset VPN connection" },
    { id: 2, title: "Konfiguracja MFA z bardzo długą nazwą żeby sprawdzić truncate" },
    { id: 3, title: "Procedura onboardingowa" },
    { id: 4, title: "Dostępy do systemów" },
    { id: 1, title: "Reset VPN connection" },
    { id: 2, title: "Konfiguracja MFA z bardzo długą nazwą żeby sprawdzić truncate" },
    { id: 3, title: "Procedura onboardingowa" },
  ],
};

// ---------------- GENERIC CARD ----------------
function Card({ children, title, icon: Icon, action }) {
  return (
    <div className="rounded-2xl border bg-card text-card-foreground p-5 shadow-sm hover:shadow-md transition">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
            <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{title}</h2>
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

// ---------------- STATS ----------------
function StatsCard() {
  const stats = [
    { label: "Dodane artykuły", value: 128 },
    { label: "Edytowane artykuły", value: 32 },
    { label: "Odnotowane tematy", value: 7 },
  ];

  return (
    <Card>
      <div className="flex justify-between text-center">
        {stats.map((s, i) => (
          <div key={i} className="flex-1">
            <div className="text-2xl font-bold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ---------------- QUICK LINKS ----------------
function QuickLinksList() {
  return (
    <Card
      title="Przypięte linki"
      icon={LinkIcon}
      action={
        <button className="p-2 rounded-lg hover:bg-accent transition">
          <Plus className="w-4 h-4" />
        </button>
      }
    >
      <ul className="list-disc list-inside space-y-2 min-h-[572px] max-h-[570px] overflow-auto">
        {mockData.quickLinks.map((link, i) => (
          <li key={i} className="text-sm hover:text-accent transition">
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="underline truncate">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
}

// ---------------- COLLECTIONS ----------------
function CollectionsGrid() {
  return (
    <Card title="Przypięte kolekcje" icon={FileText}>
      {mockData.myCollections.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nie przypiąłeś jeszcze żadnych kolekcji</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-auto">
          {mockData.myCollections.map((col) => (
            <div
              key={col.id}
              className="flex items-center gap-3 p-4 rounded-xl bg-background hover:bg-accent transition cursor-pointer min-h-[80px] font-medium text-foreground"
            >
              {col.icon && <col.icon className="w-6 h-6 text-foreground" />}
              <span>{col.title}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// ---------------- RECENT ARTICLES ----------------
function RecentArticles() {
  const { data: articlesData, isLoading, isError } = useLatestArticles();

  return (
    <Card title="Ostatnio dodane wpisy" icon={FileText}>
      <ul className="space-y-2 min-h-[240px] max-h-[240px] overflow-auto">
        {articlesData?.data.map((a) => (
          <li key={a.id}>
            <button className="w-full text-left text-sm hover:text-accent transition truncate">{a.title}</button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

// ---------------- TOP BAR ----------------
function TopBar() {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
  const formattedDate = today.toLocaleDateString("pl-PL", options);

  return (
    <div className="flex items-center justify-between ml-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Moja tablica</h1>
      </div>
      <div className="text-sm font-medium text-muted-foreground">
        {formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)}
      </div>
    </div>
  );
}

export function DashboardPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] bg-background py-5 px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <TopBar />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-6 lg:col-span-1">
            <StatsCard />
            <QuickLinksList />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <CollectionsGrid />
            <RecentArticles />
          </div>
        </div>
      </div>
    </div>
  );
}
