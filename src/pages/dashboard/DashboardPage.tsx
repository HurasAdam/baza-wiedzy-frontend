import { motion } from "framer-motion";
import {
  ChartSpline,
  Edit,
  FileText,
  FolderSymlink,
  Home,
  Layers2,
  Link as LinkIcon,
  List,
  MessageCircle,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { PinnedLinkModal } from "../../components/pinned-link/pinned-link.modal";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { WORKSPACE_ICONS } from "../../components/workspace/workspace-form";
import * as animation from "../../constants/animations";
import { useLatestArticles } from "../../hooks/articles/use-articles";
import { useFindUserPinnedLinksQuery } from "../../hooks/pinned-links/use-pinned-links";
import { useFindUserWorkspacesQuery } from "../../hooks/workspace/use-workspace";
import type { AuthUserData } from "../../types/user";

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
        <Layers2 className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Moje przypięte kolekcje
        </h2>
      </div>

      {isPending && <p className="text-sm text-muted-foreground">Ładowanie kolekcji...</p>}

      {!isPending && workspaces.length === 0 && (
        <p className="text-sm text-muted-foreground">Brak przypiętych kolekcji</p>
      )}

      <div className="flex flex-col gap-2 overflow-hidden min-h-[564px] max-h-[564px]">
        {workspaces.slice(0, 7).map((ws) => {
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

export function QuickLinksListVertical({ className, openCreateModal, links = [], isLoading }: any) {
  const navigate = useNavigate();

  function normalizeUrl(url: string) {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `https://${url}`;
    }
    return url;
  }

  const maxLeft = 10;
  const leftColumn = links.slice(0, maxLeft);
  const rightColumn = links.slice(maxLeft);

  return (
    <div className={`${className} flex flex-col pb-5`}>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-semibold uppercase tracking-tight text-muted-foreground flex items-center gap-2">
          <LinkIcon className="w-5 h-5" /> Moje przypięte linki
        </h2>

        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 rounded-lg hover:bg-accent transition">
            <MoreHorizontal className="w-4 h-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="flex items-center gap-2" onClick={openCreateModal}>
              <Plus className="w-4 h-4 text-muted-foreground" />
              Dodaj link
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-2" onClick={() => navigate("/dashboard/pinned-links")}>
              <List className="w-4 h-4 text-muted-foreground" />
              Zarządzaj
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* LOADING DATA PLACEHOLDER */}
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-muted border-t-foreground animate-spin" />

            <div className="flex flex-col items-center leading-tight">
              <span className="text-sm font-medium text-foreground">Wczytywanie linków</span>
              <span className="text-xs text-muted-foreground">Proszę czekać</span>
            </div>
          </div>
        </div>
      ) : links.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-1 flex-col items-center justify-center text-center gap-4 px-6"
        >
          <FolderSymlink className="w-20 h-20 text-primary/40 mb-2" />
          <h3 className="text-xl font-semibold text-foreground">Brak przypiętych linków</h3>
          <p className="text-sm text-muted-foreground max-w-[280px]">
            Przypnij link, aby mieć szybki dostęp do ważnych zasobów z poziomu tablicy.
          </p>
          <Button
            size="sm"
            className="mt-4 gap-2 bg-primary/80 hover:shadow-lg transition-all"
            onClick={openCreateModal}
          >
            <Plus className="w-4 h-4" />
            Dodaj link
          </Button>
        </motion.div>
      ) : (
        <div className="flex gap-6 flex-1">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-2 flex-1">
            {leftColumn.map((link: any) => (
              <a
                key={link._id}
                href={normalizeUrl(link.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[15px] tracking-tight text-foreground/85 hover:text-primary underline"
              >
                <FolderSymlink className="w-4 h-4" />
                {link.name}
              </a>
            ))}
          </div>

          {/* RIGHT COLUMN */}
          {rightColumn.length > 0 && (
            <div className="flex flex-col gap-2 flex-1">
              {rightColumn.map((link: any) => (
                <a
                  key={link._id}
                  href={normalizeUrl(link.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[15px] tracking-tight text-foreground/85 hover:text-primary underline"
                >
                  <FolderSymlink className="w-4 h-4" />
                  {link.name}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
// ---------------- RECENT ARTICLES ----------------
function RecentArticles({ className }: { className?: string }) {
  const { data: articlesData = [] } = useLatestArticles();

  return (
    <Card title="Ostatnio dodane wpisy" icon={FileText} className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 overflow-auto min-h-[600px]">
        {articlesData?.data?.map((a) => (
          <ArticleCard key={a._id} article={a} />
        ))}
      </div>
    </Card>
  );
}

function ArticleCard({ article }: { article: any }) {
  return (
    <div className="flex flex-col p-4 bg-muted/50 border border-border/60 rounded-xl transition cursor-pointer hover:shadow-md">
      <h3 className="text-sm font-semibold text-foreground truncate">{article.title}</h3>

      <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
        <span>
          Autor: {article.createdBy.name} {article.createdBy.surname}
        </span>
        <span>
          Produkt: <span style={{ color: article.product.labelColor }}>{article.product.name}</span>
        </span>
        <span>Kategoria: {article.category.name}</span>
      </div>

      <div className="flex flex-wrap gap-1 mt-2">
        {article.tags?.map((tag) => (
          <span key={tag._id} className="text-[10px] bg-primary/45 text-foreground px-2 py-0.5 rounded-full">
            {tag.name}
          </span>
        ))}
      </div>
    </div>
  );
}
// ---------------- TOP BAR USER ----------------

function TopBarUser() {
  const month = "Kwiecień 2026";
  const stats = [
    { label: "Dodane artykuły", value: 12, icon: FileText },
    { label: "Edytowane artykuły", value: 8, icon: Edit },
    { label: "Odnotowane tematy", value: 4, icon: MessageCircle },
  ];

  return (
    <div className="flex flex-col gap-4 pb-6 w-full  ">
      <div className="flex justify-between items-center px-4">
        <div className="flex items-center gap-2">
          <ChartSpline className="w-5 h-5" />
          <span className="text-sm font-semibold  text-muted-foreground tracking-wide"> Moja aktywność ( Marzec )</span>
        </div>
      </div>

      {/* KAFELKI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-muted/50 py-4 rounded-xl">
        {stats.map((s, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center p-9 border-r border-border last:border-r-0 transition-all"
          >
            {s.icon && <s.icon className="w-6 h-6 text-muted-foreground mb-1" />}
            <span className="text-xl font-bold text-foreground">{s.value}</span>
            <span className="text-xs text-muted-foreground text-center">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardPage() {
  const [isCreatePinnedLinkModalOpen, setIsCreatePinnedLinkModalOpen] = useState<boolean>(false);
  const { userData } = useOutletContext<{ onOpenCreateIssueReport: () => void; userData: AuthUserData }>();
  const { data: pinnedLinks, isPending } = useFindUserPinnedLinksQuery(userData._id);

  const openCreateModal = () => {
    setIsCreatePinnedLinkModalOpen(true);
  };

  return (
    <motion.div
      variants={animation.pageFadePremium}
      initial="init"
      animate="visible"
      exit="exit"
      className="min-h-[calc(100vh-100px)] bg-background py-5 px-6 2xl:px-0 mx-auto max-w-7xl "
    >
      <div className="mx-auto max-w-[1320px] flex flex-col gap-6">
        <div className="flex flex-col gap-6">
          {/* <TopBarUser /> */}
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-muted px-2.5 py-2.5 rounded-xl">
                <Home className="h-4 w-4" />
              </div>
              <h1 className="font-semibold text-xl tracking-tight"> Moja tablica</h1>
            </div>
            <span>...</span>
          </div>
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-6 md:gap-2">
              <div>
                <CollectionsList className="md:pr-6 border-r border-border/70 shadow-none bg-transparent" />
              </div>

              <div className="flex flex-col justify-between">
                <TopBarUser />
                <QuickLinksListVertical
                  openCreateModal={openCreateModal}
                  links={pinnedLinks ?? []}
                  isLoading={isPending}
                  className="md:pl-6 shadow-none bg-transparent min-h-[362px] max-h-[362px]"
                />
              </div>
            </div>
          </Card>
          <RecentArticles />
        </div>
      </div>

      {isCreatePinnedLinkModalOpen && (
        <PinnedLinkModal
          isOpen={isCreatePinnedLinkModalOpen}
          setIsOpen={setIsCreatePinnedLinkModalOpen}
          onSave={() => {}}
        />
      )}
    </motion.div>
  );
}
