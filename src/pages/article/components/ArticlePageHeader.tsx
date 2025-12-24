// pages/article/components/ArticlePageHeader.tsx
import { cn } from "@/lib/utils"; // helper do łączenia klas
import { ArrowLeft, ArrowUp, CheckCircleIcon, Star, XCircleIcon } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Badge } from "../../../components/ui/badge";
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
      <div className="flex items-center justify-between pt-8  px-4 bg-background  relative">
        <div className="flex flex-col gap-2 ">
          <div className="flex gap-2 absolute top-[-10px] left-0">
            {/* Lewy przycisk Wróć */}
            <Button
              variant="ghost"
              size="sm"
              className="w-fit px-2 py-1 h-auto text-muted-foreground text-[13px] gap-2 
        hover:text-foreground hover:bg-muted/60 transition"
              onClick={() => navigate(returnUrl)}
            >
              <ArrowLeft className="w-3 h-3 text-xs" />
              Wróć do listy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-fit px-2 py-1 h-auto text-muted-foreground text-[13px] gap-2 
        hover:text-foreground hover:bg-muted/60 transition"
              onClick={() => navigate(-1)}
            >
              <ArrowUp className="w-3 h-3 text-xs" />
              Wstecz
            </Button>
          </div>
          {/* Nagłówek */}
          <h1 className="text-2xl font-bold text-foreground/95 max-w-xs md:max-w-5xl mb-2">{article.title}</h1>
          <div className="flex flex-col gap-3 ">
            <div className="flex gap-2 items-center">
              <Badge variant="outline" className="whitespace-nowrap  text-muted-foreground">
                Produkt : {article.product.name}
              </Badge>
              <Badge variant="outline" className="whitespace-nowrap  text-muted-foreground">
                Kategoria : {article.category.name}
              </Badge>
            </div>

            <div className="flex gap-2">
              {article.status === "approved" && (
                <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center whitespace-nowrap">
                  <CheckCircleIcon className="w-4 h-4 mr-1" /> Zweryfikowany
                </Badge>
              )}
              {article.status === "pending" && (
                <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300 flex items-center whitespace-nowrap">
                  <XCircleIcon className="w-4 h-4 mr-1" /> Wymaga weryfikacji
                </Badge>
              )}
              {article.status === "draft" && (
                <Badge className="bg-destructive/10 text-rose-800/95 border border-destructive/30 flex items-center whitespace-nowrap">
                  <XCircleIcon className="w-4 h-4 mr-1" /> Wymaga zatwierdzenia
                </Badge>
              )}
              {article.status === "rejected" && (
                <Badge className="bg-destructive/10 text-rose-800/95 border border-destructive/30 flex items-center whitespace-nowrap">
                  <XCircleIcon className="w-4 h-4 mr-1" /> Odrzucony
                </Badge>
              )}

              {article.isImportant && (
                <Badge className="bg-yellow-100 text-yellow-800 px-3 border border-yellow-300 flex items-center whitespace-nowrap">
                  <Star className="w-4 h-4 mr-1" /> Ważny
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-muted/40 p-1 backdrop-blur-sm">
          {filteredTabOptions.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.path === ""}
              state={{ from: returnUrl }}
              className={({ isActive }) =>
                cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap",
                  "text-muted-foreground hover:text-foreground",
                  isActive ? "bg-primary/90 text-foreground shadow-sm border border-border" : "hover:bg-background/40"
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
