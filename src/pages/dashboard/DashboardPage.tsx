import { Edit, FileText, Link as LinkIcon, MessageCircle, Plus } from "lucide-react";
import { WORKSPACE_ICONS } from "../../components/workspace/workspace-form";
import { useLatestArticles } from "../../hooks/articles/use-articles";
import { useFindUserWorkspacesQuery } from "../../hooks/workspace/use-workspace";

function Card({ children, title, icon: Icon, action, className }: any) {
  return (
    <div
      className={`rounded-2xl border bg-card text-card-foreground p-5 shadow-sm hover:shadow-md transition ${className}`}
    >
      {title && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-5 h-5 text-muted-foreground" />}
            <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">{title}</h2>
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

// ---------------- COLLECTIONS ----------------
function CollectionsList({ className }: any) {
  const { data: workspaces = [], isPending } = useFindUserWorkspacesQuery();

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Moje przypięte kolekcje
        </h2>
      </div>

      {isPending && <p className="text-sm text-muted-foreground">Ładowanie kolekcji...</p>}

      {!isPending && workspaces.length === 0 && (
        <p className="text-sm text-muted-foreground">Brak przypiętych kolekcji</p>
      )}

      <div className="flex flex-col gap-3.5">
        {workspaces.slice(0, 6).map((ws) => {
          const Icon = WORKSPACE_ICONS[ws.icon] ?? FileText;

          return (
            <div
              key={ws._id}
              className="
    flex items-center gap-2.5
    px-4 py-3
    rounded-2xl
    bg-background
    shadow-sm hover:shadow-none
    hover:bg-accent/10
    transition cursor-pointer
    min-h-[72px]
    border border-border/55
  "
            >
              <div
                className="flex items-center justify-center w-10 h-10 rounded-xl"
                style={{ backgroundColor: `${ws.labelColor}22` }}
              >
                <Icon className="w-5 h-5" style={{ color: ws.labelColor }} />
              </div>

              <span className="text-sm font-semibold truncate">{ws.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuickLinksListVertical({ className }: any) {
  const mockData = [
    { label: "Procedura przywracania kont", url: "#" },
    { label: "Monitorki", url: "#" },
    { label: "FAQ-Akademia L", url: "#" },
    { label: "Procedura przywracania kont", url: "#" },
    { label: "Monitorki", url: "#" },
    { label: "FAQ-Akademia L", url: "#" },
  ];

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <LinkIcon className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Szybkie linki</h2>
        </div>

        <button className="p-2 rounded-lg hover:bg-accent transition">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {mockData.slice(0, 6).map((link, i) => (
          <a key={i} href={link.url} className="flex items-center gap-2 text-sm hover:text-accent transition truncate">
            <LinkIcon className="w-4 h-4 text-muted-foreground flex-shrink-0 " />
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
// ---------------- RECENT ARTICLES ----------------
function RecentArticles({ className }: any) {
  const { data: articlesData = [] } = useLatestArticles();

  return (
    <Card title="Ostatnio dodane wpisy" icon={FileText} className={className}>
      <div className="flex flex-col gap-2 h-full overflow-auto">
        {articlesData?.data?.map((a) => (
          <button key={a.id} className="w-full text-left text-sm hover:text-accent transition truncate">
            {a.title}
          </button>
        ))}
      </div>
    </Card>
  );
}

// ---------------- TOP BAR USER ----------------

function TopBarUser() {
  const month = "Marzec 2026";

  const stats = [
    { label: "Dodane artykuły", value: 12, icon: FileText },
    { label: "Edytowane artykuły", value: 8, icon: Edit },
    { label: "Komentarze / wiadomości", value: 4, icon: MessageCircle },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-card border border-border/70 backdrop-blur-md rounded-3xl shadow-lg gap-14">
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground uppercase tracking-wider">Twoja aktywność</span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mt-1">{month}</h2>
      </div>

      <div className="flex flex-1 justify-between mt-4 md:mt-0 gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center flex-1 p-5 bg-background border border-border/50 backdrop-blur-md rounded-2xl shadow-xs "
          >
            {s.icon && <s.icon className="w-6 h-6 text-accent mb-2" />}
            <span className="text-2xl font-bold text-foreground">{s.value}</span>
            <span className="text-sm text-muted-foreground text-center">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardPage() {
  return (
    <div className="min-h-[calc(100vh-100px)] bg-background py-5 px-6 2xl:px-0">
      <div className="mx-auto max-w-[1320px] flex flex-col gap-6">
        <div className="flex flex-col gap-6">
          <TopBarUser />

          <Card>
            <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-6 md:gap-2">
              <CollectionsList className="md:pr-6 border-r border-border/70 shadow-none bg-transparent" />
              <QuickLinksListVertical className="md:pl-6 shadow-none bg-transparent" />
            </div>
          </Card>

          <RecentArticles />
        </div>
      </div>
    </div>
  );
}
