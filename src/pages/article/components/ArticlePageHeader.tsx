// pages/article/components/ArticlePageHeader.tsx
import { cn } from "@/lib/utils"; // helper do łączenia klas
import { ArrowLeft, ArrowUp } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import type { Article } from "../../../types/article";
import ArticleBannerSection from "./ArticleBannerSection";

interface Props {
  article: Article;
  returnUrl: string;
  userPermissions: string[];
}

export const ArticlePageHeader: React.FC<Props> = ({ article, returnUrl, userPermissions }) => {
  const navigate = useNavigate();

  const tabs = [
    { label: "Dane główne", path: "", requirePermission: null },
    { label: "Załączniki", path: "attachments", requiredPermission: null },
    { label: "Historia zmian", path: "history", requiredPermission: "VIEW_ARTICLE_HISTORY" },
  ];

  const filteredTabOptions = tabs.filter((tab) => {
    if (!tab.requiredPermission) return true; // brak wymagania = zawsze widoczne
    return userPermissions.includes(tab.requiredPermission);
  });

  return (
    <>
      <div className="flex items-center justify-between py-4 px-4 bg-background border-b border-border ">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 ">
            {/* Lewy przycisk Wróć */}
            <Button variant="ghost" size="sm" className="" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-3 h-3 text-xs" />
              Wróć
            </Button>
            <Button variant="ghost" size="sm" className="" onClick={() => navigate(returnUrl)}>
              <ArrowUp className="w-3 h-3 text-xs" />
              Powrót do listy artykułów
            </Button>
          </div>
          {/* Nagłówek */}
          <h1 className="text-lg font-semibold text-foreground  max-w-xs md:max-w-5xl ">{article.title}</h1>
        </div>

        {/* Zakładki po prawej */}
        <div className="flex items-center gap-2">
          {filteredTabOptions.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.path === ""}
              state={{ from: returnUrl }}
              className={({ isActive }) =>
                cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted hover:bg-muted/80 text-foreground"
                )
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>
      {/* {article.status === "rejected" && (
        <RejectedArticleBanner article={article} isResubmitting={isApproveLoading} onResubmit={onArticleAprove} />
      )}

      {["pending"].includes(article.status) && (
        <ArticleVerificationBanner status={article.status} onApprove={onArticleAprove} onReject={onArticleReject} />
      )}
      {["draft"].includes(article.status) && (
        <ArticleDraftBanner status={article.status} onApprove={onArticleAprove} onReject={onArticleReject} />
      )} */}

      <ArticleBannerSection article={article} userPermissions={userPermissions} />
    </>
  );
};
