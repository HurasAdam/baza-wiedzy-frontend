import { Archive, FileText, Link as LinkIcon, Plus, Users } from "lucide-react";

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
      title="Quick Links"
      icon={LinkIcon}
      action={
        <button className="p-2 rounded-lg hover:bg-accent transition">
          <Plus className="w-4 h-4" />
        </button>
      }
    >
      <ul className="list-disc list-inside space-y-2 min-h-[180px] max-h-[380px] overflow-auto">
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

// ---------------- TOP BAR ----------------
function TopBar() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Moja tablica</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary" />
      </div>
    </div>
  );
}

// ---------------- DASHBOARD PAGE ----------------
export function DashboardPage() {
  return (
    <div className="min-h-screen bg-background py-6 px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <TopBar />

        {/* PREMIUM STATS */}
        {/* <StatsCard /> */}
        <StatsCard />
        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickLinksList />
          <CollectionsGrid />
        </div>
      </div>
    </div>
  );
}
