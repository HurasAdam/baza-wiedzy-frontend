import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

// MAPA TŁUMACZEŃ
const routeTranslations: Record<string, string> = {
  dashboard: "Start",
  "knowledge-base": "Baza wiedzy",
  articles: "Baza artykułów",
  settings: "Ustawienia",
  profile: "Profil",
  "useful-links": "Przydatne linki",
  "register-topic": "Rejestr tematów",
  faq: "FAQ",
  statistics: "Statystyki użytkowników",
  "network-tools": "Narzędzia sieciowe",
  "jst-projects": "Szkoły projektowe",
  history: "Historia",
  attachments: "Załączniki",
  edit: "Edycja",
  new: "Dodaj artykuł",
  create: "Dodaj FAQ",
  reports: "Zgłoszenia",
  "funny-messages": "Zabawne wiadomości",
  "articles-pending": "Do zweryfikowania",
};

function translateSegment(segment: string) {
  return routeTranslations[segment] ?? segment.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export function Breadcrumb() {
  const location = useLocation();

  const segments = location.pathname.split("/").filter(Boolean);

  const isDashboard = location.pathname === "/dashboard";

  return (
    <nav className="flex items-center gap-1.5 text-xs">
      {/* Wyświetl Start tylko jeśli nie jesteś na /dashboard */}
      {!isDashboard && (
        <>
          <Link to="/dashboard" className="hover:underline text-muted-foreground">
            Start
          </Link>
          {segments.length > 0 && (
            <span className="mx-2">
              <ChevronRight size={11} />
            </span>
          )}
        </>
      )}

      {segments.map((segment, index) => {
        const path = "/" + segments.slice(0, index + 1).join("/");
        const isLast = index === segments.length - 1;
        const nextIsLast = index === segments.length - 2;

        const label = translateSegment(segment);

        return (
          <span key={path} className="flex items-center max-w-[120px]">
            {isLast ? (
              <span className="font-medium text-foreground truncate" title={label}>
                {label}
              </span>
            ) : (
              <Link to={path} className="truncate text-muted-foreground inline-block max-w-[120px]" title={label}>
                {label}
              </Link>
            )}

            {/* Separator */}
            {!isLast && <span className="mx-2">{nextIsLast ? "•" : <ChevronRight size={11} />}</span>}
          </span>
        );
      })}
    </nav>
  );
}
